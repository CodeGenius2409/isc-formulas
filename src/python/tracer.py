"""The Python tracer's engine. It runs inside Pyodide, in a web worker in the app and in Node in the tests.

trace_program() runs a whole program under sys.settrace and records every line, call, return and
exception, with the variables of every frame, so the page can step forwards and back through it, as
the Java tracer does. It returns the recording as JSON. Nothing here may change how the program
behaves: output, input and errors are real Python's own, because tests/unit/python-real.test.ts holds
them to a real Python.
"""

import ast
import builtins
import io
import json
import sys
import time
import traceback
import types

PROGRAM = '<program>'

# Imports the syllabus uses. Anything else still runs, if it's in the bundled library, with a note.
SYLLABUS_IMPORTS = {'math', 'random'}

# Modules that reach out of Python into the worker. A student's program has no use for them.
BLOCKED_MODULES = ('js', 'pyodide', 'pyodide_js', '_pyodide', '_pyodide_core', 'micropip')

# Shown in the panel however deep recursion goes: the program's own frame and the innermost calls.
MAX_FRAMES = 25
MAX_VARS = 60
# A value longer than this is cut short in the variables table. The console always has the real thing.
MAX_REPR = 160
MAX_ITEMS = 60
MAX_DEPTH = 12


class _Stop(BaseException):
    """Raised by the trace function to end a program that has run too long."""


class _BlockFinder:
    """Refuses imports of the modules that would let a program reach the worker's JavaScript."""

    def find_spec(self, name, path=None, target=None):
        if name.split('.')[0] in BLOCKED_MODULES:
            raise ModuleNotFoundError(f"No module named '{name}'", name=name)
        return None


def lock_down():
    """Called once, after Pyodide has started and before any program runs."""
    for name in list(sys.modules):
        if name.split('.')[0] in BLOCKED_MODULES:
            del sys.modules[name]
    sys.meta_path[:] = [f for f in sys.meta_path if 'Js' not in type(f).__name__]
    sys.meta_path.insert(0, _BlockFinder())
    # A program run as a file has these from the site module. Pyodide doesn't run it.
    if not hasattr(builtins, 'exit'):
        class _Quitter:
            def __init__(self, name):
                self.name = name

            def __repr__(self):
                return f'Use {self.name}() or Ctrl-D (i.e. EOF) to exit'

            def __call__(self, code=None):
                raise SystemExit(code)

        builtins.exit = _Quitter('exit')
        builtins.quit = _Quitter('quit')


# ---- What the program uses, read from its syntax tree before it runs


def _scope_key(name, first_line):
    return f'{name}:{first_line}'


def _analyse(tree, source):
    """Finds every loop, with the scope it belongs to, and anything beyond the ISC Python units."""
    loops = []
    beyond = []

    def note(text):
        if text not in beyond:
            beyond.append(text)

    def first_line(node):
        lines = [node.lineno] + [d.lineno for d in getattr(node, 'decorator_list', [])]
        return min(lines)

    def visit(node, scope):
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda)):
                name = '<lambda>' if isinstance(child, ast.Lambda) else child.name
                if getattr(child, 'decorator_list', None):
                    note('a decorator')
                if isinstance(child, ast.AsyncFunctionDef):
                    note('async functions')
                visit(child, _scope_key(name, first_line(child)))
                continue
            if isinstance(child, ast.ClassDef):
                note('classes')
                visit(child, scope)
                continue
            if isinstance(child, (ast.For, ast.While)):
                test = child.test if isinstance(child, ast.While) else child.iter
                loops.append({
                    'scope': scope,
                    'line': child.lineno,
                    'end': child.end_lineno,
                    'body': child.body[0].lineno,
                    'bodyEnd': child.body[-1].end_lineno,
                    'kind': 'while' if isinstance(child, ast.While) else 'for',
                    'test': ast.get_source_segment(source, test) or '',
                    'target': '' if isinstance(child, ast.While) else (ast.get_source_segment(source, child.target) or ''),
                })
            if isinstance(child, ast.Import):
                for alias in child.names:
                    if alias.name.split('.')[0] not in SYLLABUS_IMPORTS:
                        note(f'import {alias.name}')
            elif isinstance(child, ast.ImportFrom):
                if (child.module or '').split('.')[0] not in SYLLABUS_IMPORTS:
                    note(f'import from {child.module or "."}')
            elif isinstance(child, (ast.Try, ast.TryStar)):
                note('try and except')
            elif isinstance(child, ast.Raise):
                note('raise')
            elif isinstance(child, (ast.With, ast.AsyncWith)):
                note('with')
            elif isinstance(child, (ast.Yield, ast.YieldFrom)):
                note('yield')
            elif isinstance(child, ast.Call) and isinstance(child.func, ast.Name) and child.func.id == 'open':
                note('files')
            visit(child, scope)

    visit(tree, _scope_key('<module>', 1))
    return loops, beyond


# ---- Showing values without running any of the program's code


def _is_mutable(value):
    return isinstance(value, (list, dict, set, bytearray)) or type(value).__module__ == '__main__'


def _short(text):
    return text if len(text) <= MAX_REPR else text[: MAX_REPR - 1] + '…'


class _Shower:
    """Writes values as Python's repr would, and notes which lists are the same object."""

    def __init__(self):
        # id -> places it was seen, as (frame index, path). Mutable objects only.
        self.places = {}

    def show(self, value, frame_index, path):
        self._seen_here = set()
        return _short(self._repr(value, frame_index, path, 0))

    def _register(self, value, frame_index, path):
        self.places.setdefault(id(value), []).append((frame_index, path))

    def _repr(self, value, frame_index, path, depth):
        kind = type(value)
        if kind in (int, float, complex, bool, str, bytes, range, slice) or value is None or value is Ellipsis:
            text = repr(value)
            return text if len(text) <= MAX_REPR else text[: MAX_REPR - 1] + '…'
        if depth > MAX_DEPTH:
            return '…'
        if _is_mutable(value):
            if id(value) in self._seen_here:
                return {list: '[...]', dict: '{...}', set: '{...}'}.get(kind, '...')
            if depth <= 2:
                self._register(value, frame_index, path)
            self._seen_here.add(id(value))
        try:
            if isinstance(value, (list, tuple)):
                parts = [self._repr(v, frame_index, f'{path}[{i}]', depth + 1) for i, v in enumerate(value[:MAX_ITEMS])]
                if len(value) > MAX_ITEMS:
                    parts.append('…')
                body = ', '.join(parts)
                if isinstance(value, tuple):
                    return f'({body},)' if len(value) == 1 else f'({body})'
                return f'[{body}]'
            if isinstance(value, dict):
                items = list(value.items())[:MAX_ITEMS]
                parts = [f'{self._repr(k, frame_index, path, depth + 1)}: {self._repr(v, frame_index, f"{path}[{k!r}]", depth + 1)}' for k, v in items]
                if len(value) > MAX_ITEMS:
                    parts.append('…')
                return '{' + ', '.join(parts) + '}'
            if isinstance(value, (set, frozenset)):
                if not value:
                    return 'set()' if kind is set else 'frozenset()'
                parts = [self._repr(v, frame_index, path, depth + 1) for v in list(value)[:MAX_ITEMS]]
                body = '{' + ', '.join(parts) + '}'
                return body if kind is set else f'frozenset({body})'
            if kind.__module__ == '__main__':
                # A class of the program's own: its fields, without calling its __repr__.
                fields = object.__getattribute__(value, '__dict__') if hasattr(value, '__dict__') else {}
                inner = ', '.join(f'{k}={self._repr(v, frame_index, f"{path}.{k}", depth + 1)}' for k, v in list(fields.items())[:MAX_ITEMS])
                return f'{kind.__name__}({inner})'
            if isinstance(value, types.FunctionType):
                return f'<function {value.__qualname__}>'
            return object.__repr__(value) if kind.__module__ != 'builtins' else kind.__repr__(value)
        finally:
            if _is_mutable(value):
                self._seen_here.discard(id(value))


def _shown_names(frame):
    """The names a dry run would write down: not modules, functions, classes or Python's own."""
    names = frame.f_globals if frame.f_code.co_name == '<module>' else frame.f_locals
    out = []
    for name, value in list(names.items()):
        if name.startswith('__') and name.endswith('__'):
            continue
        if isinstance(value, (types.ModuleType, types.FunctionType, types.BuiltinFunctionType, type)):
            continue
        out.append((name, value))
        if len(out) >= MAX_VARS:
            break
    return out


def _depth(frame):
    """How many Python frames are on the stack, up to and including this one."""
    n = 0
    while frame is not None:
        n += 1
        frame = frame.f_back
    return n


# ---- The run


class _Input:
    """sys.stdin, read a line at a time from the tracer's input box. input() uses readline()."""

    def __init__(self, run, text):
        self._run = run
        self._lines = io.StringIO(text)
        self.encoding = 'utf-8'
        self.errors = 'strict'

    def readline(self, size=-1):
        line = self._lines.readline(size)
        self._run.read_line(line)
        return line

    def read(self, size=-1):
        rest = self._lines.read(size)
        self._run.read_line(rest)
        return rest

    def isatty(self):
        return False

    def readable(self):
        return True

    def __iter__(self):
        return self

    def __next__(self):
        line = self.readline()
        if not line:
            raise StopIteration
        return line


class _Run:
    def __init__(self, max_steps, max_recorded, max_output, max_seconds):
        self.max_steps = max_steps
        self.max_recorded = max_recorded
        self.max_output = max_output
        self.deadline = time.monotonic() + max_seconds
        self.steps = []
        # Output goes to C-level buffers, so printing adds no Python frames, as with python.exe. That keeps
        # the depth at which RecursionError strikes the same.
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
        self.err_seen = 0
        self.extras = []  # [kind, position in the output, text]: input echoed, input run out, or stderr
        self.count = 0
        self.truncated = False
        self.stopped = None
        self.stopped_in = None
        self.frame_keys = {}
        self.next_key = 0
        self.pending_error = set()
        self.last_line = 0
        # The program's own recursion limit, which it can read and change through sys. The real one is set
        # higher, so that the tracer's frames never count against the program.
        self.limit = 1000
        self.base = 0
        self.live = 0
        self.overflow = None

    @property
    def out_length(self):
        return self.stdout.tell()

    def take_stderr(self):
        if self.stderr.tell() > self.err_seen:
            text = self.stderr.getvalue()[self.err_seen:]
            self.err_seen = self.stderr.tell()
            self.extras.append(['err', self.out_length, text])

    def read_line(self, line):
        self.take_stderr()
        if line:
            self.extras.append(['in', self.out_length, line.rstrip('\n')])
        else:
            self.extras.append(['eof', self.out_length, ''])

    # Tracing

    def key_of(self, frame):
        key = self.frame_keys.get(id(frame))
        if key is None:
            key = self.next_key
            self.next_key += 1
            self.frame_keys[id(frame)] = key
        return key

    def stop(self, why, frame):
        self.stopped = why
        self.stopped_in = frame
        raise _Stop()

    def check_depth(self, frame):
        """Python counts every frame against the limit, the program's first frame as 1. So does this."""
        if self.live < self.limit - 200:
            return
        if _depth(frame) - self.base > self.limit:
            self.overflow = RecursionError('maximum recursion depth exceeded')
            raise self.overflow

    def trace(self, frame, event, arg):
        if event == 'call':
            self.check_depth(frame)
        if frame.f_code.co_filename != PROGRAM:
            return None
        self.count += 1
        if self.count > self.max_steps:
            self.stop('steps', frame)
        if self.count % 1000 == 0 and time.monotonic() > self.deadline:
            self.stop('time', frame)
        if self.stdout.tell() > self.max_output:
            self.stop('output', frame)
        self.take_stderr()
        module = frame.f_code.co_name == '<module>' and (frame.f_back is None or frame.f_back.f_code.co_filename != PROGRAM)
        if event == 'call':
            self.live += 1
            self.key_of(frame)
            if module:
                return self.trace
        elif event == 'line':
            self.pending_error.discard(id(frame))
        elif event == 'exception':
            self.pending_error.add(id(frame))
        elif event == 'return':
            self.live -= 1
            unwinding = id(frame) in self.pending_error
            self.pending_error.discard(id(frame))
            if module:
                self.frame_keys.pop(id(frame), None)
                return self.trace
            if unwinding:
                event = 'unwind'
        line = frame.f_lineno or 0
        if len(self.steps) < self.max_recorded:
            extra = None
            if event == 'return':
                extra = _Shower().show(arg, -1, '')
            elif event == 'exception':
                extra = _last_line(arg[0], arg[1])
            self.steps.append([line, event, *self.snapshot(frame), self.out_length, extra])
        else:
            self.truncated = True
        if event in ('return', 'unwind'):
            self.frame_keys.pop(id(frame), None)
        self.last_line = line
        return self.trace

    def snapshot(self, frame):
        chain = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == PROGRAM:
                chain.append(f)
            f = f.f_back
        chain.reverse()
        depth = len(chain)
        if depth > MAX_FRAMES:
            chain = [chain[0]] + chain[depth - MAX_FRAMES + 1:]
        shower = _Shower()
        frames = []
        for index, f in enumerate(chain):
            names = []
            for name, value in _shown_names(f):
                names.append([name, type(value).__name__, shower.show(value, index, name), None, None])
            frames.append([f.f_code.co_name, f.f_lineno or 0, f.f_code.co_firstlineno, self.key_of(f), names])
        # Which names are the same object: a list passed to a function, b = a, or rows made with *.
        for places in shower.places.values():
            if len(places) < 2:
                continue
            tops = [(fi, p) for fi, p in places if '[' not in p and '.' not in p]
            for fi, p in tops:
                entry = next((e for e in frames[fi][4] if e[0] == p), None)
                if entry is not None:
                    others = [[ofi, op] for ofi, op in places if (ofi, op) != (fi, p)]
                    entry[3] = (entry[3] or []) + others[:4]
            inner = {}
            for fi, p in places:
                if (fi, p) not in tops:
                    inner.setdefault((fi, p.split('[')[0].split('.')[0]), []).append(p)
            for (fi, root), paths in inner.items():
                entry = next((e for e in frames[fi][4] if e[0] == root), None)
                if entry is not None and len(paths) > 1:
                    entry[4] = (entry[4] or []) + [paths[:4]]
        return frames, depth


class _SysProxy:
    """sys.getrecursionlimit and sys.setrecursionlimit, as the program sees them during a run."""

    def __init__(self, run):
        self.run = run

    def get(self):
        return self.run.limit

    def set(self, limit):
        _real_setrecursionlimit(limit + self.run.base + 200)
        self.run.limit = limit


_real_getrecursionlimit = sys.getrecursionlimit
_real_setrecursionlimit = sys.setrecursionlimit


def _last_line(kind, value):
    try:
        return traceback.format_exception_only(kind, value)[-1].rstrip('\n')
    except Exception:
        return kind.__name__


def _program_frames(exc, skip_last):
    """The program's own frames in the traceback, outermost first."""
    found = []
    tb = exc.__traceback__
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == PROGRAM:
            found.append((tb.tb_frame, tb.tb_lineno))
        tb = tb.tb_next
    # A RecursionError the tracer raised appears in the call that couldn't be made. Python raises it in the
    # caller, so that's where it points.
    return found[:-1] if skip_last and len(found) > 1 else found


def _error_of(exc, overflow):
    """The line Python prints last, the line of the program it points at, and the exception's name."""
    lines = traceback.format_exception(type(exc), exc, exc.__traceback__)
    text = lines[-1].rstrip('\n') if lines else type(exc).__name__
    line = 0
    if isinstance(exc, SyntaxError) and exc.filename == PROGRAM:
        line = exc.lineno or 0
    frames = _program_frames(exc, exc is overflow)
    if frames:
        line = frames[-1][1]
    return {'type': type(exc).__name__, 'text': text, 'line': line}, (frames[-1][0] if frames else None)


def trace_program(source, input_text, max_steps, max_recorded, max_output, max_seconds):
    run = _Run(max_steps, max_recorded, max_output, max_seconds)
    result = {'steps': run.steps, 'error': None, 'loops': [], 'beyond': [], 'stopped': None}

    def finish():
        run.take_stderr()
        result['output'] = run.stdout.getvalue()
        result['extras'] = run.extras
        result['totalSteps'] = run.count
        result['truncated'] = run.truncated
        result['stopped'] = run.stopped
        return json.dumps(result, ensure_ascii=False)

    try:
        tree = ast.parse(source, PROGRAM)
        code = compile(tree, PROGRAM, 'exec')
    except SyntaxError as exc:
        error, _ = _error_of(exc, None)
        error['kind'] = 'syntax'
        result['error'] = error
        return finish()
    result['loops'], result['beyond'] = _analyse(tree, source)

    program_globals = {'__name__': '__main__', '__builtins__': builtins, '__doc__': None}
    saved = sys.stdin, sys.stdout, sys.stderr, sys.getrecursionlimit, sys.setrecursionlimit
    limit = _real_getrecursionlimit()
    proxy = _SysProxy(run)
    run.limit = limit
    # The program's first frame will sit just above this one, as a file's first frame sits at the bottom.
    run.base = _depth(sys._getframe())
    _real_setrecursionlimit(limit + run.base + 200)
    sys.stdin = _Input(run, input_text)
    sys.stdout = run.stdout
    sys.stderr = run.stderr
    sys.getrecursionlimit = proxy.get
    sys.setrecursionlimit = proxy.set
    try:
        sys.settrace(run.trace)
        try:
            exec(code, program_globals)
        finally:
            sys.settrace(None)
    except _Stop:
        # The last step shows where the program was when it was stopped.
        frame = run.stopped_in
        if frame is not None and len(run.steps) < run.max_recorded:
            frames, depth = run.snapshot(frame)
            run.steps.append([frame.f_lineno or run.last_line, 'stop', frames, depth, run.out_length, None])
    except SystemExit as exc:
        # sys.exit() ends a program quietly, as it would from a file, unless it gives a message.
        if exc.code is not None and not isinstance(exc.code, int):
            run.stderr.write(f'{exc.code}\n')
    except BaseException as exc:
        error, frame = _error_of(exc, run.overflow)
        error['kind'] = 'runtime'
        result['error'] = error
        if frame is not None and len(run.steps) < run.max_recorded:
            frames, depth = run.snapshot(frame)
            run.steps.append([error['line'], 'error', frames, depth, run.out_length, error['text']])
    finally:
        sys.stdin, sys.stdout, sys.stderr, sys.getrecursionlimit, sys.setrecursionlimit = saved
        _real_setrecursionlimit(limit)
    if run.stopped is None and result['error'] is None and len(run.steps) < run.max_recorded:
        run.steps.append([run.last_line, 'end', [], 0, run.out_length, None])
    return finish()
