"""The Python tracer's engine. It runs inside Pyodide, in a web worker in the app and in Node in the tests.

trace_program() runs a whole program under sys.settrace and records every line, call, return and
exception, with the variables of every frame, so the page can step forwards and back through it, as
the Java tracer does. It returns the recording as JSON. Nothing here may change how the program
behaves: output, input and errors are real Python's own, because tests/unit/python-real.test.ts holds
them to a real Python.
"""

import ast
import base64
import builtins
import io
import itertools
import json
import re
import sys
import time
import traceback
import types

PROGRAM = '<program>'

# Imports the syllabus uses, and the parts of the standard library a school program uses as freely. Anything
# else still runs, if it's in the bundled library, with a note.
SYLLABUS_IMPORTS = {
    'math', 'random', 'statistics', 'fractions', 'decimal', 'datetime', 'collections', 'itertools',
    'string', 'time', 'copy', 'functools', 'json', 'csv',
}

# NumPy, pandas and Matplotlib, by the names a program imports them as. They run, and the note that they go
# beyond the syllabus says so more warmly than for other imports. pylab and mpl_toolkits come with Matplotlib.
LIBRARY_IMPORTS = {'numpy': 'numpy', 'pandas': 'pandas', 'matplotlib': 'matplotlib', 'pylab': 'matplotlib', 'mpl_toolkits': 'matplotlib'}

# The libraries and what they bring with them. A value of one of their own types is shown by its own repr,
# which runs none of the program's code.
LIBRARY_ROOTS = {'numpy', 'pandas', 'matplotlib', 'mpl_toolkits', 'PIL', 'dateutil', 'pytz', 'contourpy', 'cycler', 'kiwisolver', 'fontTools', 'pyparsing', 'packaging', 'six'}

# Charts a run can show. A picture larger than MAX_SVG as an SVG, such as a scatter of many thousands of
# points, is drawn as a PNG instead.
MAX_CHARTS = 20
MAX_SVG = 1_500_000

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
    # Matplotlib draws off screen, into pictures the tracer shows in its console.
    import os
    os.environ['MPLBACKEND'] = 'Agg'


# ---- NumPy, pandas and Matplotlib, installed before a program that imports them runs

# Core library packages that the libraries' extra archive adds modules to, such as importlib.metadata. Python
# looks for a submodule only along its package's __path__, which is in the core zip, so each gets the matching
# folder of site-packages too.
EXTENDED_PACKAGES = ('importlib', 'encodings')


def site_packages():
    """Where the extra standard library and the wheels are unpacked."""
    import site
    return site.getsitepackages()[0]


def extras_unpacked():
    """Called once the extra standard library is in site-packages, before any wheel is installed."""
    import importlib
    import site
    for root in site.getsitepackages():
        for name in EXTENDED_PACKAGES:
            extra = f'{root}/{name}'
            package = sys.modules[name]
            if extra not in package.__path__:
                package.__path__.append(extra)
            # A folder looked for before it existed is remembered as missing.
            if sys.path_importer_cache.get(extra, True) is None:
                del sys.path_importer_cache[extra]
    # So is a codec, such as cp437 for a zip's names.
    import encodings
    for name in [name for name, entry in encodings._cache.items() if entry is None]:
        del encodings._cache[name]
    importlib.invalidate_caches()


# ---- What the program uses, read from its syntax tree before it runs


def program_imports(source):
    """The top-level modules a program imports, as JSON, so the page can install a library before it runs."""
    try:
        tree = ast.parse(source)
    except (SyntaxError, ValueError):
        return '[]'
    names = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            found = [alias.name for alias in node.names]
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            found = [node.module]
        else:
            continue
        for name in found:
            root = name.split('.')[0]
            if root not in names:
                names.append(root)
    return json.dumps(names)


def _scope_key(name, first_line):
    return f'{name}:{first_line}'


def _analyse(tree, source):
    """Finds every loop, with the scope it belongs to, anything beyond the ISC Python units, and the libraries."""
    loops = []
    beyond = []
    libraries = []

    def note(text):
        if text not in beyond:
            beyond.append(text)

    def library(name):
        if name not in libraries:
            libraries.append(name)

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
                    root = alias.name.split('.')[0]
                    if root in LIBRARY_IMPORTS:
                        library(LIBRARY_IMPORTS[root])
                    elif root not in SYLLABUS_IMPORTS:
                        note(f'import {alias.name}')
            elif isinstance(child, ast.ImportFrom):
                root = (child.module or '').split('.')[0]
                if child.level == 0 and root in LIBRARY_IMPORTS:
                    library(LIBRARY_IMPORTS[root])
                elif root not in SYLLABUS_IMPORTS:
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
    return loops, beyond, libraries


# ---- Showing values without running any of the program's code


def _table_kind(value):
    """'array', 'frame' or 'series' for a NumPy array or a pandas DataFrame or Series, exactly; else None."""
    kind = type(value)
    numpy = sys.modules.get('numpy')
    if numpy is not None and kind is numpy.ndarray:
        return 'array'
    pandas = sys.modules.get('pandas')
    if pandas is not None:
        if kind is pandas.DataFrame:
            return 'frame'
        if kind is pandas.Series:
            return 'series'
    return None


def _is_mutable(value):
    kind = type(value)
    return (
        isinstance(value, (list, dict, set, bytearray))
        or kind.__module__ == '__main__'
        or (kind.__module__ == 'collections' and kind.__name__ == 'deque')
        or _table_kind(value) is not None
    )


def _library_root(kind):
    return (kind.__module__ or '').split('.')[0]


def _library_repr(value):
    """A library object's own repr. Anything it prints is thrown away, and a failure shows the type's name."""
    saved = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = io.StringIO()
    try:
        text = repr(value)
    except Exception:
        text = f'<{type(value).__name__}>'
    finally:
        sys.stdout, sys.stderr = saved
    # A memory address changes every run and means nothing to a reader.
    return re.sub(r' at 0x[0-9a-fA-F]+', '', text)


def _library_str(value):
    """A library value's own str, such as 3.5 for np.float64(3.5), with anything it prints thrown away."""
    saved = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = io.StringIO()
    try:
        return str(value)
    except Exception:
        return f'<{type(value).__name__}>'
    finally:
        sys.stdout, sys.stderr = saved


def _float_text(x):
    """A float in a NumPy array, as NumPy prints it: 2.5, 0.33333333, 2. or 1.e-05."""
    numpy = sys.modules['numpy']
    if x != x:
        return 'nan'
    if x in (float('inf'), float('-inf')):
        return 'inf' if x > 0 else '-inf'
    if x != 0 and (abs(x) >= 1e16 or abs(x) < 1e-4):
        return numpy.format_float_scientific(x, precision=8, unique=True, trim='.')
    return numpy.format_float_positional(x, precision=8, unique=True, trim='.')


def _table_float(x):
    """A float in a pandas table, as pandas prints it: 88.0, 79.5, 0.333333."""
    if x != x:
        return 'NaN'
    if x.is_integer() and abs(x) < 1e16:
        return f'{x:.1f}'
    return f'{x:.6g}'


def _short(text):
    return text if len(text) <= MAX_REPR else text[: MAX_REPR - 1] + '…'


# Numbers and dates from the standard library. Their own repr and str run none of the program's code, so long
# as the type is exactly the library's: a subclass the program wrote could do anything in its __repr__.
_NUMBER_TYPES = {('fractions', 'Fraction'), ('decimal', 'Decimal')}
_DATE_TYPES = {('datetime', 'date'), ('datetime', 'datetime'), ('datetime', 'time'), ('datetime', 'timedelta'), ('datetime', 'timezone')}


def _library_value(value, kind):
    """True for a Fraction, Decimal or date whose repr is the library's own."""
    key = (kind.__module__, kind.__name__)
    if key in _NUMBER_TYPES:
        return True
    if key in _DATE_TYPES:
        zone = getattr(value, 'tzinfo', None)
        return zone is None or type(zone).__module__ == 'datetime'
    return False


class _Shower:
    """Writes values as Python's repr would, and notes which lists are the same object."""

    def __init__(self):
        # id -> places it was seen, as (frame index, path). Mutable objects only.
        self.places = {}

    def show(self, value, frame_index, path):
        self._seen_here = set()
        kind = type(value)
        # On its own, a fraction, decimal or date is shown as a student writes it, 3/4 rather than
        # Fraction(3, 4). Inside a list it keeps its repr, as print() shows it there. So are NumPy's and
        # pandas' numbers and dates: 3.5 rather than np.float64(3.5).
        if _library_value(value, kind):
            return _short(str(value))
        if _library_root(kind) in ('numpy', 'pandas') and not _table_kind(value):
            numpy = sys.modules.get('numpy')
            pandas = sys.modules.get('pandas')
            if numpy is not None and isinstance(value, numpy.str_):
                return _short(repr(str(value)))
            if (numpy is not None and isinstance(value, numpy.generic)) or (pandas is not None and isinstance(value, (pandas.Timestamp, pandas.Timedelta))):
                return _short(_library_str(value))
        return _short(self._repr(value, frame_index, path, 0))

    # NumPy arrays and pandas tables, drawn as small tables beside their text

    def view(self, value):
        """A table of an array, a DataFrame or a Series, for the variables panel, or None for anything else."""
        kind = _table_kind(value)
        try:
            if kind == 'array':
                return self._array_view(value)
            if kind == 'frame':
                return self._frame_view(value)
            if kind == 'series':
                return self._series_view(value)
        except Exception:
            return None
        return None

    def _element(self, x, code):
        """One element of an array, by its dtype's kind."""
        if code == 'b':
            return 'True' if x else 'False'
        if code in 'iu':
            return str(int(x))
        if code == 'f':
            return _float_text(float(x))
        if code in 'US':
            return repr(x.item() if hasattr(x, 'item') else x)
        if code == 'O':
            return _short(self._repr(x, -1, '', 1))
        return _library_str(x)

    @staticmethod
    def _picks(count, room, tail):
        """Which positions of count to show in room: all of them, or the first few, a gap (None) and the last."""
        if count <= room:
            return list(range(count))
        return list(range(room - tail - 1)) + [None] + list(range(count - tail, count))

    def _array_rows(self, a):
        code = a.dtype.kind
        plane = a if a.ndim <= 2 else a[(0,) * (a.ndim - 2)]
        if plane.ndim == 1:
            return [['…' if i is None else self._element(plane[i], code) for i in self._picks(plane.shape[0], 10, 2)]]
        rows = []
        cols = self._picks(plane.shape[1], 8, 2)
        for r in self._picks(plane.shape[0], 8, 2):
            rows.append(None if r is None else ['…' if c is None else self._element(plane[r, c], code) for c in cols])
        return rows

    def _array_view(self, a):
        if a.ndim == 0:
            return None
        view = {'kind': 'array', 'shape': list(a.shape), 'dtype': str(a.dtype), 'rows': self._array_rows(a)}
        if a.ndim > 2:
            view['slice'] = '[' + ', '.join(['0'] * (a.ndim - 2) + [':', ':']) + ']'
        return view

    def _array_text(self, a):
        """An array as print() writes it, on one line and shortened: [1 2 3] or [[1 2] [3 4]]."""
        if a.ndim == 0:
            return self._element(a[()], a.dtype.kind)
        rows = self._array_rows(a)
        if a.ndim == 1:
            return '[' + ' '.join(rows[0]) + ']'
        inner = ' '.join('…' if row is None else '[' + ' '.join(row) + ']' for row in rows)
        return f'[{inner}]' if a.ndim == 2 else f'[[{inner}] …]'

    def _cell(self, v):
        """A value in a pandas table, as pandas prints it: strings without quotes, dates without midnight."""
        if v is None:
            return 'None'
        if isinstance(v, bool):
            return str(v)
        if isinstance(v, int):
            return str(v)
        if isinstance(v, float):
            return _table_float(v)
        if isinstance(v, str):
            return _short(v)
        kind = type(v)
        if _library_root(kind) in ('numpy', 'pandas'):
            numpy = sys.modules.get('numpy')
            if numpy is not None and isinstance(v, numpy.generic):
                return self._cell(v.item()) if not isinstance(v, (numpy.datetime64, numpy.timedelta64)) else str(v)
            text = _library_str(v)
            return text[:-9] if text.endswith(' 00:00:00') else text
        return _short(self._repr(v, -1, '', 1))

    def _label(self, label):
        return ', '.join(self._cell(part) for part in label) if isinstance(label, tuple) else self._cell(label)

    def _frame_view(self, df):
        count, width = df.shape
        rows = self._picks(count, 6, 0)
        rows = [r for r in rows if r is not None]
        cols = list(range(min(width, 8)))
        part = df.iloc[rows, cols]
        values = part.to_numpy(dtype=object).tolist()
        more_cols = width > len(cols)
        return {
            'kind': 'frame',
            'shape': [count, width],
            'columns': [self._label(c) for c in part.columns] + (['…'] if more_cols else []),
            'index': [self._label(i) for i in part.index],
            'rows': [[self._cell(v) for v in row] + (['…'] if more_cols else []) for row in values],
            'more': count - len(rows),
        }

    def _series_view(self, s):
        count = len(s)
        rows = [r for r in self._picks(count, 6, 0) if r is not None]
        part = s.iloc[rows]
        return {
            'kind': 'series',
            'shape': [count],
            'name': None if s.name is None else self._label(s.name),
            'dtype': str(s.dtype),
            'index': [self._label(i) for i in part.index],
            'values': [self._cell(v) for v in part.to_numpy(dtype=object).tolist()],
            'more': count - len(rows),
        }

    def _frame_text(self, value, kind, depth):
        if kind == 'frame':
            count, width = value.shape
            text = f'{count} row{"" if count == 1 else "s"} × {width} column{"" if width == 1 else "s"}'
            return text if depth == 0 else f'<DataFrame: {text}>'
        view = self._series_view(value)
        parts = [f'{i}: {v}' for i, v in zip(view['index'][:4], view['values'][:4])]
        text = ', '.join(parts) + (', …' if len(value) > 4 else '')
        return text if depth == 0 else f'<Series: {text}>'

    def _register(self, value, frame_index, path):
        self.places.setdefault(id(value), []).append((frame_index, path))

    def _dict_body(self, items, frame_index, path, depth):
        parts = [f'{self._repr(k, frame_index, path, depth + 1)}: {self._repr(v, frame_index, f"{path}[{k!r}]", depth + 1)}' for k, v in items[:MAX_ITEMS]]
        if len(items) > MAX_ITEMS:
            parts.append('…')
        return '{' + ', '.join(parts) + '}'

    def _collection(self, value, kind, frame_index, path, depth):
        """Counter, deque, defaultdict and OrderedDict, written as their own reprs write them."""
        name = kind.__name__
        if name == 'deque':
            parts = [self._repr(v, frame_index, f'{path}[{i}]', depth + 1) for i, v in enumerate(itertools.islice(value, MAX_ITEMS))]
            if len(value) > MAX_ITEMS:
                parts.append('…')
            limit = '' if value.maxlen is None else f', maxlen={value.maxlen}'
            return f'deque([{", ".join(parts)}]{limit})'
        if name == 'Counter':
            # Most common first, as Counter's repr lists them.
            items = list(dict.items(value))
            try:
                items.sort(key=lambda item: item[1], reverse=True)
            except TypeError:
                pass
            return f'Counter({self._dict_body(items, frame_index, path, depth)})' if items else 'Counter()'
        if name == 'OrderedDict':
            items = list(dict.items(value))
            return f'OrderedDict({self._dict_body(items, frame_index, path, depth)})' if items else 'OrderedDict()'
        if name == 'defaultdict':
            factory = self._repr(value.default_factory, frame_index, path, depth + 1)
            return f'defaultdict({factory}, {self._dict_body(list(dict.items(value)), frame_index, path, depth)})'
        return None

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
            if _library_value(value, kind):
                return repr(value)
            table = _table_kind(value)
            if table is not None:
                # A strange dtype mustn't stop the program: the table falls back to its type's name.
                try:
                    return self._array_text(value) if table == 'array' else self._frame_text(value, table, depth)
                except Exception:
                    return f'<{kind.__name__}>'
            if _library_root(kind) in LIBRARY_ROOTS:
                return _library_repr(value)
            if kind.__module__ == 'collections':
                shown = self._collection(value, kind, frame_index, path, depth)
                if shown is not None:
                    return shown
            if isinstance(value, tuple) and hasattr(kind, '_fields') and isinstance(kind._fields, tuple):
                # A named tuple, written as its repr would be, without calling it.
                inner = ', '.join(f'{f}={self._repr(v, frame_index, f"{path}.{f}", depth + 1)}' for f, v in zip(kind._fields, value))
                return f'{kind.__name__}({inner})'
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


def _owner(array):
    """The array that owns an array's data: itself, or the one a view or slice of it was taken from."""
    numpy = sys.modules['numpy']
    while isinstance(array.base, numpy.ndarray):
        array = array.base
    return array


def _shown_names(frame):
    """The names a dry run would write down: not modules, functions, classes or Python's own."""
    names = frame.f_globals if frame.f_code.co_name == '<module>' else frame.f_locals
    out = []
    for name, value in list(names.items()):
        if name.startswith('__') and name.endswith('__'):
            continue
        if isinstance(value, (types.ModuleType, types.FunctionType, types.BuiltinFunctionType, type)):
            continue
        # np.sqrt and np.mean are functions too, though not of Python's own kind.
        if callable(value) and _library_root(type(value)) in LIBRARY_ROOTS:
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


# ---- Charts: what plt.show() and savefig() draw, shown in the console at the step that drew them

# The run in progress, which a chart drawn now belongs to. None between runs.
_active = None
# NumPy's print options as they were when it was imported, put back before each run.
_numpy_defaults = None


def prepare_libraries(names_json):
    """
    Imports the libraries just installed, so a program's own import of them is instant and its time isn't
    counted against the program, and makes Matplotlib draw into the console.
    """
    global _numpy_defaults
    import warnings
    names = json.loads(names_json)
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        if 'numpy' in names and _numpy_defaults is None:
            import numpy
            _numpy_defaults = numpy.get_printoptions()
        if 'pandas' in names:
            import pandas  # noqa: F401
        if 'matplotlib' in names:
            import matplotlib
            matplotlib.use('Agg')
            import matplotlib.pyplot  # noqa: F401
            _catch_charts()


def _catch_charts():
    """plt.show(), fig.show() and savefig() draw the chart into the console, as well as doing their own work."""
    import matplotlib.pyplot as plt
    from matplotlib._pylab_helpers import Gcf
    from matplotlib.figure import Figure
    if getattr(Figure.savefig, 'tracer', False):
        return
    savefig = Figure.savefig

    def save(self, *args, **kwargs):
        result = savefig(self, *args, **kwargs)
        if _active is not None:
            _active.charts.capture(self, savefig, kwargs)
        return result

    def show(*args, **kwargs):
        if _active is not None:
            for manager in Gcf.get_all_fig_managers():
                _active.charts.capture(manager.canvas.figure, savefig, {}, shown=True)
        # A real window would stay until it was closed, and then the figure would be gone.
        plt.close('all')

    def show_one(self, warn=True):
        if _active is not None:
            _active.charts.capture(self, savefig, {}, shown=True)

    save.tracer = True
    Figure.savefig = save
    Figure.show = show_one
    plt.show = show


def _chart_kinds(ax):
    """What an Axes holds, in words, such as 'a line graph with 2 lines'."""
    from matplotlib.collections import PathCollection
    from matplotlib.container import BarContainer
    from matplotlib.patches import Wedge
    kinds = []
    bars = sum(len(c.patches) for c in ax.containers if isinstance(c, BarContainer))
    if bars:
        kinds.append(f'a bar chart with {bars} bar{"" if bars == 1 else "s"}')
    lines = [line for line in ax.get_lines() if line.get_visible()]
    if lines:
        kinds.append('a line graph' + (f' with {len(lines)} lines' if len(lines) > 1 else ''))
    points = sum(len(c.get_offsets()) for c in ax.collections if isinstance(c, PathCollection))
    if points:
        kinds.append(f'a scatter plot of {points} point{"" if points == 1 else "s"}')
    wedges = [p for p in ax.patches if isinstance(p, Wedge)]
    if wedges:
        kinds.append(f'a pie chart with {len(wedges)} slices')
    if ax.images:
        kinds.append('an image')
    return kinds


def _describe(fig, number):
    """Alt text for a chart: what kind it is, its title, its axes and its key."""
    from matplotlib.patches import Wedge

    def words(kinds):
        return kinds[0] if len(kinds) == 1 else ', '.join(kinds[:-1]) + ' and ' + kinds[-1]

    axes = [ax for ax in fig.axes if ax.get_visible() and ax.get_label() != '<colorbar>']
    title = fig._suptitle.get_text() if getattr(fig, '_suptitle', None) is not None else ''
    parts = []
    for ax in axes:
        kinds = _chart_kinds(ax) or ['an empty chart']
        text = words(kinds)
        name = ax.get_title() or (title if len(axes) == 1 else '')
        if name:
            text += f' titled “{name}”'
        labels = [f'{axis} axis {label}' for axis, label in (('x', ax.get_xlabel()), ('y', ax.get_ylabel())) if label]
        if labels:
            text += ', with ' + ' and '.join(labels)
        keys = [label for label in ax.get_legend_handles_labels()[1] if not label.startswith('_')]
        if not keys and any(isinstance(p, Wedge) for p in ax.patches):
            # A pie's labels are texts beside its slices; autopct's percentages are left out.
            keys = [t.get_text() for t in ax.texts if t.get_text() and not t.get_text().endswith('%')]
        if keys:
            text += ', key: ' + ', '.join(keys[:8]) + (' …' if len(keys) > 8 else '')
        parts.append(text)
    if not parts:
        return f'Chart {number}: an empty figure.'
    head = f'Chart {number}' + (f', “{title}”' if title and len(axes) > 1 else '')
    body = parts[0] if len(parts) == 1 else f'{len(parts)} charts: ' + '; '.join(parts)
    return f'{head}: {body[0].upper()}{body[1:]}.'


def _picture_size(mime, data):
    """A chart's natural size in CSS pixels, at Matplotlib's 100 dots to the inch."""
    if mime == 'image/svg+xml':
        found = re.search(r'width="([\d.]+)pt" height="([\d.]+)pt"', data[:2000])
        if found:
            return round(float(found.group(1)) * 100 / 72), round(float(found.group(2)) * 100 / 72)
        return 640, 480
    raw = base64.b64decode(data[:64])
    return round(int.from_bytes(raw[16:20], 'big') / 1.44), round(int.from_bytes(raw[20:24], 'big') / 1.44)


class _Charts:
    """The charts one run draws, and where each goes in the console."""

    def __init__(self, run):
        self.run = run
        self.items = []
        self.dropped = 0
        # Each figure's last picture, so plt.show() after savefig() of the same, unchanged chart doesn't show it
        # twice. Matplotlib marks a figure as changed after any savefig(), so the pictures themselves are compared.
        self.drawn = {}

    @staticmethod
    def _svg(fig, savefig, keep):
        import matplotlib
        text = io.StringIO()
        # A fixed salt makes the SVG's ids the same each time the same chart is drawn.
        with matplotlib.rc_context({'svg.hashsalt': 'isc-tracer'}):
            savefig(fig, text, format='svg', metadata={'Date': None}, **keep)
        return text.getvalue()

    def capture(self, fig, savefig, options, shown=False):
        known = self.drawn.get(id(fig))
        if len(self.items) >= MAX_CHARTS and not (shown and known):
            self.dropped += 1
            return
        keep = {k: options[k] for k in ('bbox_inches', 'pad_inches', 'facecolor', 'edgecolor', 'transparent') if k in options}
        # Drawing runs many library calls, none of them the program's, so tracing waits until it's done.
        trace = sys.gettrace()
        sys.settrace(None)
        try:
            data = self._svg(fig, savefig, keep)
            plain = self._svg(fig, savefig, {}) if keep else data
            if shown and known is not None and known[0] is fig and known[1] == plain:
                return
            if len(self.items) >= MAX_CHARTS:
                self.dropped += 1
                return
            mime = 'image/svg+xml'
            if len(data) > MAX_SVG:
                raw = io.BytesIO()
                savefig(fig, raw, format='png', dpi=144, **keep)
                mime, data = 'image/png', base64.b64encode(raw.getvalue()).decode('ascii')
            alt = _describe(fig, len(self.items) + 1)
        finally:
            sys.settrace(trace)
        self.drawn[id(fig)] = (fig, plain)
        width, height = _picture_size(mime, data)
        self.items.append({'mime': mime, 'data': data, 'alt': alt, 'width': width, 'height': height})
        run = self.run
        run.take_stderr()
        run.extras.append(['fig', run.out_length, str(len(self.items) - 1), len(run.steps)])


def _chart_theme(theme):
    """Matplotlib's colours for the app's theme: its paper and ink, and chalk colours on the blackboard."""
    if not theme:
        return {}
    ink, ink2, faint, paper, grid = theme['ink'], theme['ink2'], theme['faint'], theme['paper'], theme['grid']
    rc = {
        'figure.facecolor': paper, 'axes.facecolor': paper, 'savefig.facecolor': 'auto', 'savefig.edgecolor': 'auto',
        'text.color': ink, 'axes.labelcolor': ink, 'axes.titlecolor': ink, 'axes.edgecolor': ink2,
        'xtick.color': ink2, 'ytick.color': ink2, 'xtick.labelcolor': ink, 'ytick.labelcolor': ink, 'grid.color': grid,
        'legend.facecolor': paper, 'legend.edgecolor': faint, 'legend.labelcolor': ink,
        'patch.edgecolor': ink, 'hatch.color': ink,
        'boxplot.boxprops.color': ink, 'boxplot.whiskerprops.color': ink, 'boxplot.capprops.color': ink,
        'boxplot.flierprops.color': ink, 'boxplot.flierprops.markeredgecolor': ink,
    }
    if theme.get('palette'):
        from cycler import cycler
        rc['axes.prop_cycle'] = cycler(color=theme['palette'])
    return rc


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
        # [kind, position in the output, text, steps recorded by then]: input echoed, input run out, or stderr.
        self.extras = []
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
            self.extras.append(['err', self.out_length, text, len(self.steps)])

    def read_line(self, line):
        self.take_stderr()
        if line:
            self.extras.append(['in', self.out_length, line.rstrip('\n'), len(self.steps)])
        else:
            self.extras.append(['eof', self.out_length, '', len(self.steps)])

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
        # Every hundred steps, as one step that calls NumPy or pandas can take a while.
        if self.count % 100 == 0 and time.monotonic() > self.deadline:
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
        arrays = []
        for index, f in enumerate(chain):
            names = []
            for name, value in _shown_names(f):
                # [name, type, value, other names for it, places inside it that are one object, table, shared data]
                entry = [name, type(value).__name__, shower.show(value, index, name), None, None, shower.view(value), None]
                names.append(entry)
                if _table_kind(value) == 'array':
                    arrays.append((index, entry, value))
            frames.append([f.f_code.co_name, f.f_lineno or 0, f.f_code.co_firstlineno, self.key_of(f), names])
        # Arrays that are different objects but share their data, as a slice or reshape of an array does, so
        # that changing one changes the other.
        owners = {}
        for index, entry, value in arrays:
            owners.setdefault(id(_owner(value)), []).append((index, entry, id(value)))
        for members in owners.values():
            for index, entry, key in members:
                others = [[i, e[0]] for i, e, k in members if k != key]
                if others:
                    entry[6] = others[:4]
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


def _fresh_state(theme):
    """Undoes what an earlier program changed in a library module, so each run starts as a new Python does."""
    import warnings
    decimal = sys.modules.get('decimal')
    if decimal is not None:
        decimal.setcontext(decimal.Context(prec=28, rounding=decimal.ROUND_HALF_EVEN, Emin=-999999, Emax=999999, capitals=1, clamp=0, flags=[], traps=[decimal.InvalidOperation, decimal.DivisionByZero, decimal.Overflow]))
    # Each library separately, and never so as to stop the run: a reset that fails leaves only what it couldn't undo.
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        numpy = sys.modules.get('numpy')
        if numpy is not None and _numpy_defaults is not None:
            try:
                numpy.set_printoptions(**_numpy_defaults)
            except Exception:
                pass
        pandas = sys.modules.get('pandas')
        if pandas is not None:
            # Only the options a program changed. reset_option('all') would run every option's callback, and
            # one of them imports Matplotlib, which a program using pandas alone hasn't installed.
            try:
                from pandas._config import config as pandas_config
                for key, option in list(pandas_config._registered_options.items()):
                    try:
                        if pandas.get_option(key) != option.defval:
                            pandas.set_option(key, option.defval)
                    except Exception:
                        pass
            except Exception:
                pass
        pyplot = sys.modules.get('matplotlib.pyplot')
        if pyplot is not None:
            try:
                import matplotlib
                pyplot.close('all')
                matplotlib.rcdefaults()
                # Charts take the app's colours, so a chart on the blackboard is chalk on slate.
                matplotlib.rcParams.update(_chart_theme(theme))
            except Exception:
                pass


def trace_program(source, input_text, max_steps, max_recorded, max_output, max_seconds, options_json='{}'):
    """Runs a program and returns its recording as JSON. options_json may give the app's theme, for charts."""
    global _active
    options = json.loads(options_json or '{}')
    _fresh_state(options.get('theme'))
    run = _Run(max_steps, max_recorded, max_output, max_seconds)
    run.charts = _Charts(run)
    result = {'steps': run.steps, 'error': None, 'loops': [], 'beyond': [], 'libraries': [], 'stopped': None}

    def finish():
        run.take_stderr()
        result['output'] = run.stdout.getvalue()
        result['extras'] = run.extras
        result['totalSteps'] = run.count
        result['truncated'] = run.truncated
        result['stopped'] = run.stopped
        result['figures'] = run.charts.items
        result['droppedFigures'] = run.charts.dropped
        return json.dumps(result, ensure_ascii=False)

    try:
        tree = ast.parse(source, PROGRAM)
        code = compile(tree, PROGRAM, 'exec')
    except SyntaxError as exc:
        error, _ = _error_of(exc, None)
        error['kind'] = 'syntax'
        result['error'] = error
        return finish()
    result['loops'], result['beyond'], result['libraries'] = _analyse(tree, source)

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
        _active = run
        sys.settrace(run.trace)
        try:
            exec(code, program_globals)
        finally:
            sys.settrace(None)
            _active = None
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
