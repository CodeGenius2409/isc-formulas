// Step A of the generator: goes through every question and sub-part of every paper in papers/, and records what
// kind of question it is. The result, data-private/question-analysis.json, holds wording from the papers and is
// never shipped or committed. What leaves is reports/question-analysis.md, which holds only counts and references.
import fs from 'node:fs';

const SUBJECT_ID = { physics: 'physics', chemistry: 'chemistry', mathematics: 'mathematics', 'computer-science': 'computerscience' };

const index = JSON.parse(fs.readFileSync('data-private/papers-index.json', 'utf8'));

// ---- Reading ----------------------------------------------------------------------------------

function textOf(paper) {
  if (paper.readable === 'text') return fs.readFileSync(paper.target, 'utf8');
  const layout = paper.ocr.replace(/^data-private\/ocr\//, 'data-private/ocr-layout/');
  const text = fs.readFileSync(fs.existsSync(layout) ? layout : paper.ocr, 'utf8');
  // OCR reads the mark [2] as (2], [21, [2l or [2). Only a mixed pair is changed, so (2) in a sum stays.
  return text.replace(/\(\s*([1-9])\s*\]/g, '[$1]').replace(/\[\s*([1-9])\s*[1lI|)]/g, '[$1]');
}

function levelOf(paper, text) {
  const name = paper.name.toUpperCase();
  if (/\bXII\b|[-_ ]XII[-_ .]|CLASS[- ]12/.test(name)) return 'XII';
  if (/\bXI\b|[-_ ]XI[-_ .]|CLASS[- ]11/.test(name)) return 'XI';
  const head = text.slice(0, 1800);
  if (/CLASS\s*[-:]?\s*XII\b/i.test(head)) return 'XII';
  if (/CLASS\s*[-:]?\s*XI\b/i.test(head)) return 'XI';
  return 'XII';
}

const NOISE = [
  /^[-_=.\s]{5,}$/,
  /this paper consists/i,
  /^\s*turn over\s*$/i,
  /isc specimen question paper/i,
  /^\s*\d{1,3}\s*$/,
  /^\s*[©@]?\s*copyright/i,
  /^\s*\d{4}-\d{3}[A-Z]?(-\d?[A-Z]+)?\s*$/,
  /^\s*\d{2,4}-\d{3}\s*$/,
  /^\s*iv?\s*$/i,
];

/** Where the questions stop and the answers begin, for files that carry a key. */
function cutAnswers(text) {
  const lines = text.split(/\r?\n/);
  const third = Math.floor(lines.length * 0.3);
  for (let i = third; i < lines.length; i++) {
    if (/^\s*(answer\s*key|answers?|marking\s+scheme|solutions?)\s*[:.]?\s*$/i.test(lines[i])) return lines.slice(0, i).join('\n');
  }
  return text;
}

const clean = (s) => s.normalize('NFKC').replace(/[ \t]+/g, ' ').trim();

// ---- Splitting into questions -----------------------------------------------------------------

function splitQuestions(text, paper) {
  const lines = text
    .split(/\r?\n|\f/)
    .map(clean)
    .filter((l) => l && !NOISE.some((n) => n.test(l)));
  const out = [];
  const byWord = lines.map((l, i) => [i, /^question\s*(\d{1,2})\b(?!\s+(?:is|carries|to|and|has|contains)\b)/i.exec(l)]).filter(([, m]) => m);
  let numbered = lines.map((l, i) => [i, /^(\d{1,3})\s*[.)]\s*(?=\S)/.exec(l)]).filter(([, m]) => m);
  // Some specimens and the practical papers write "1 The law..." with no full stop.
  if (numbered.length < 5) numbered = lines.map((l, i) => [i, /^(\d{1,2})\s+(?=[A-Z(\[])/.exec(l)]).filter(([, m]) => m);
  // Competency-focused files number their items, and the papers name them. Counts decide, not the file type.
  const useWords = byWord.length >= 5 && paper.type !== 'cfq' && paper.type !== 'item-bank';
  const marks = useWords ? byWord : numbered;
  if (marks.length < 3) return { questions: [], lines };
  let section = '';
  const sectionAt = new Map();
  lines.forEach((l, i) => {
    const s = /^(section|part)\s+([a-d]|i{1,2})\b/i.exec(l);
    if (s) section = `${s[1][0].toUpperCase()}${s[1].slice(1).toLowerCase()} ${s[2].toUpperCase()}`;
    sectionAt.set(i, section);
  });
  // Numbered items must rise, or a line that starts with a number gets taken for a new question.
  let expected = 0;
  const starts = [];
  for (const [i, m] of marks) {
    const n = Number(m[1]);
    if (useWords || n === expected + 1 || (n > expected && n <= expected + 3) || n === 1) {
      starts.push([i, n]);
      expected = n;
    }
  }
  for (let k = 0; k < starts.length; k++) {
    const [i, n] = starts[k];
    const end = k + 1 < starts.length ? starts[k + 1][0] : lines.length;
    const body = lines.slice(i, end);
    body[0] = useWords ? body[0].replace(/^question\s*\d{1,2}\b[.:]?\s*/i, '') : body[0].replace(/^\d{1,3}\s*[.)]?\s*/, '');
    out.push({ number: n, section: sectionAt.get(i) ?? '', lines: body });
  }
  return { questions: out, lines };
}

// ---- Splitting into sub-parts -----------------------------------------------------------------

const LABEL = /^\(?\s*((?:[ivx]{1,4})|[a-hA-H])\s*\)\s*/;
const ROMAN = new Set(['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv']);

function kindOf(label, previous) {
  if (/^[A-H]$/.test(label)) return 'upper';
  if (ROMAN.has(label) && !(label === 'i' && previous === 'h') && !(label === 'v' && previous === 'u') && !(label === 'x' && previous === 'w')) return 'roman';
  return 'lower';
}

function tokens(lines) {
  const out = [];
  let lastLower = '';
  let stem = [];
  for (const raw of lines) {
    const m = LABEL.exec(raw);
    if (m && m[0].includes(')')) {
      const label = m[1];
      const kind = kindOf(label, lastLower);
      if (kind === 'lower') lastLower = label;
      out.push({ label, kind, text: [raw.slice(m[0].length)] });
    } else if (out.length) {
      out[out.length - 1].text.push(raw);
    } else {
      stem.push(raw);
    }
  }
  return { stem: stem.join(' '), tokens: out };
}

/** (a) (b) (c) (d) with short text, none carrying marks of its own, are the options of a multiple-choice question. */
function foldOptions(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    const run = list.slice(i, i + 4);
    const isOptions =
      t.kind === 'lower' &&
      t.label === 'a' &&
      run.length === 4 &&
      run.map((x) => x.label).join('') === 'abcd' &&
      run.every((x) => x.text.join(' ').length < 320) &&
      run.slice(0, 3).every((x) => !/\[\s*\d{1,2}\s*\]/.test(x.text.join(' ')));
    if (isOptions) {
      const carrier = out[out.length - 1];
      const options = run.map((x) => x.text.join(' '));
      if (carrier) {
        (carrier.options ??= []).push(...options);
        carrier.text.push(...run.flatMap((x) => [`(${x.label})`, ...x.text]));
      } else {
        out.push({ label: '', kind: 'stem', text: [], options, optionsOnly: true });
      }
      i += 3;
    } else {
      out.push({ ...t });
    }
  }
  return out;
}

function markOf(text) {
  let total = 0;
  let found = false;
  for (const m of text.matchAll(/\[\s*(\d{1,2})\s*\]/g)) {
    const v = Number(m[1]);
    if (v >= 1 && v <= 20) {
      total += v;
      found = true;
    }
  }
  return found ? total : null;
}

function eachMark(text) {
  const m = /\[\s*(\d{1,2})\s*[x×*]\s*(\d{1,2})\s*\]/i.exec(text);
  return m ? { count: Number(m[1]), each: Number(m[2]) } : null;
}

function leavesOf(question) {
  const alternatives = [];
  let current = [];
  for (const line of question.lines) {
    if (/^\s*or\s*$/i.test(line)) {
      alternatives.push(current);
      current = [];
    } else current.push(line);
  }
  alternatives.push(current);
  const leaves = [];
  const wholeOf = (lines) => markOf(lines.join(' '));
  const shared = alternatives.map(wholeOf).find((m) => m != null) ?? null;
  alternatives.forEach((lines, alt) => {
    const { stem, tokens: raw } = tokens(lines);
    const list = foldOptions(raw);
    const path = { upper: '', lower: '', roman: '' };
    let inherit = eachMark(stem);
    let context = stem;
    const parents = new Map();
    const start = leaves.length;
    list.forEach((t, i) => {
      const text = t.text.join(' ');
      if (t.kind === 'upper') {
        path.upper = t.label;
        path.lower = '';
        path.roman = '';
        parents.set('upper', text);
        parents.delete('lower');
      } else if (t.kind === 'lower') {
        path.lower = t.label;
        path.roman = '';
        parents.set('lower', text);
      } else if (t.kind === 'roman') {
        path.roman = t.label;
      }
      const each = eachMark(text);
      if (each) inherit = each;
      const next = list[i + 1];
      const isParent = next && ((t.kind === 'upper' && next.kind !== 'upper') || (t.kind === 'lower' && next.kind === 'roman'));
      if (isParent) return;
      const label = [path.upper && `(${path.upper})`, path.lower && `(${path.lower})`, path.roman && `(${path.roman})`].filter(Boolean).join('');
      const ctx = [context, t.kind !== 'upper' && parents.get('upper'), t.kind === 'roman' && parents.get('lower')].filter(Boolean).join(' ');
      const parent = t.kind === 'roman' ? (parents.get('lower') ?? parents.get('upper') ?? stem) : t.kind === 'lower' ? (parents.get('upper') ?? stem) : stem;
      leaves.push({ sub: label, alt: alt || undefined, text, context: ctx, parent, options: t.options, marks: each ? each.each : markOf(text), inherit });
    });
    if (leaves.length === start) leaves.push({ sub: '', alt: alt || undefined, text: stem, context: '', parent: '', marks: markOf(stem), inherit: eachMark(stem) });
    // A mark for the whole question is spread over its parts when it divides evenly. An "or" shares its mark.
    const here = leaves.slice(start);
    for (const leaf of here) {
      if (leaf.marks == null && leaf.inherit) leaf.marks = leaf.inherit.each;
      delete leaf.inherit;
    }
    const whole = wholeOf(lines) ?? shared;
    const unmarked = here.filter((l) => l.marks == null);
    const placed = here.reduce((sum, l) => sum + (l.marks ?? 0), 0);
    const left = whole ? whole - placed : 0;
    if (unmarked.length && left > 0) {
      for (const leaf of unmarked) {
        leaf.groupMarks = left;
        leaf.groupSize = unmarked.length;
        if (left % unmarked.length === 0) {
          leaf.marks = left / unmarked.length;
          leaf.markGuess = true;
        }
      }
    }
  });
  return leaves;
}

// ---- What kind of question ---------------------------------------------------------------------

function classify(text, context, options, subject, parent = '') {
  const t = `${context} ${text}`.toLowerCase();
  const own = text.toLowerCase();
  const near = `${parent} ${text}`.toLowerCase();
  const has = (re) => re.test(t);
  if (has(/assertion\b[\s\S]*reason\b/) || has(/statement\s*(i|1)\b[\s\S]*statement\s*(ii|2)\b/)) return 'assertion';
  if (subject === 'computerscience') {
    if (has(/design a class|define a class|specify the class|class name\b|write a (java )?program|write the (complete )?program|write a (recursive )?(method|function)|write the method/)) return 'program';
    if (has(/\boutput\b|what will be (printed|displayed)|what is printed|dry run/) && !has(/output of (the )?(gate|circuit)|input.*output/)) return 'output';
    if (has(/find the error|correct the|identify the error|errors? in the/)) return 'error';
    if (has(/complete the (code|program|method|following|statement)|fill in the blank|\?\s*1\s*\?/)) return 'complete';
    if (has(/truth table|k-?map|karnaugh|simplif|reduce the|sop\b|pos\b|logic (gate|circuit)|boolean/)) return 'boolean';
    if (has(/address of|base address|row[- ]major|column[- ]major|big ?o|complexity|inorder|preorder|postorder|traversal/)) return 'numerical';
  }
  if (options?.length || /choose the correct|select the correct|correct (option|alternative)|which of the following|multiple choice/.test(near)) return 'mcq';
  if (has(/match the|column a\b|column i\b|match column/)) return 'match';
  if (has(/fill in the blank|fill in|complete the (following )?(statement|sentence)/)) return 'fill';
  if (own.split(/\s+/).length > 70 && has(/read the|passage|case\b|study the|based on the|answer the (following|question)/)) return 'case';
  if (has(/distinguish|difference between|differences between|differentiate between|how will you distinguish|chemical test/)) return 'distinguish';
  if (has(/\bderive\b|obtain an? (expression|relation)|deduce|establish the|expression for/)) return 'derivation';
  if (subject === 'mathematics' && has(/\bprove\b|show that|verify/)) return 'proof';
  if (has(/\bprove\b|show that/)) return 'derivation';
  if (has(/give (a )?reasons?|account for|explain why|\bwhy\b/)) return 'reason';
  if (subject === 'chemistry' && has(/convert|how (will|would|can) you|what happens when|write the (chemical |balanced )?equation|complete (and balance )?the|balance the|name reaction|reaction (of|between|for)|identify (the )?compound|compounds? [a-e]\b|predict the product|major product|from grignard|obtained from|prepared from|chemical equation/)) return 'reaction';
  if (subject === 'chemistry' && has(/arrange .* order|increasing order|decreasing order|stronger (acid|base)|more (basic|acidic|reactive)/)) return 'reason';
  if (subject === 'chemistry' && has(/iupac|structure of|hybridi[sz]|isomer|geometry of|magnetic|oxidation state/)) return 'structure';
  if (has(/\bdraw\b|sketch|labelled diagram|ray diagram|circuit diagram|show graphically|plot a graph|plot the/)) return 'diagram';
  if (has(/calculate|\bfind\b|determine|evaluate|what is the value|how much|how many|compute|solve|integrate|differentiate|value of/)) return 'numerical';
  if (has(/\bdefine\b|what is meant|what do you (mean|understand)|state\b|name the|\bname\b|what (is|are)\b|write (the )?(formula|expression|unit|dimension)/)) return 'definition';
  if (has(/how (does|do|is|will|would|can)\b|what (will|would|should|happens)|which\b|does\b|is the\b|explain|describe|discuss|interpret|verify|give (one|two|an?)\b|mention|list\b/)) return 'short';
  return 'short';
}

function skillOf(text, type) {
  const tag = /\(\s*(recall|remember|understand(?:ing)?|appl(?:y|ication)|analy[sz](?:e|is)|evaluat(?:e|ion)|creat(?:e|ion))\s*\)/i.exec(text)?.[1]?.toLowerCase();
  if (tag) {
    if (/recall|remember/.test(tag)) return { skill: 'recall', tagged: true };
    if (/understand/.test(tag)) return { skill: 'understand', tagged: true };
    if (/appl/.test(tag)) return { skill: 'application', tagged: true };
    return { skill: 'analysis', tagged: true };
  }
  if (type === 'definition' || type === 'fill' || type === 'match') return { skill: 'recall' };
  if (type === 'numerical' || type === 'output' || type === 'program' || type === 'boolean' || type === 'reaction' || type === 'error' || type === 'complete') return { skill: 'application' };
  if (type === 'case' || type === 'assertion' || type === 'distinguish') return { skill: 'analysis' };
  if (type === 'reason' || type === 'derivation' || type === 'proof') return { skill: 'understand' };
  return { skill: 'understand' };
}

const UNITS = /\b(?:\d+(?:\.\d+)?\s*)(?:mA|µA|μA|A|V|kV|mV|Ω|ohm|kΩ|cm|mm|m|km|nm|µm|Å|kg|g|mg|s|ms|µs|Hz|kHz|MHz|J|eV|MeV|keV|N|W|kW|T|mT|Wb|F|µF|μF|pF|H|mH|mol|M|K|°C|atm|Pa|kPa|L|mL|dm3|cm3)\b/g;

const TRAPS = [
  [/diameter/i, 'diameter given where the formula uses radius'],
  [/\b\d+(?:\.\d+)?\s*(?:cm|mm|nm|µm|μm|Å|mA|µA|μA|µF|μF|pF|mH|kV|mV|km|g|mg|mL)\b/, 'a unit to convert first'],
  [/\b\d+(?:\.\d+)?\s*°\s*C\b/, 'Celsius where the formula needs kelvin'],
  [/lens|mirror|focal/i, 'sign convention'],
  [/internal resistance/i, 'forgetting internal resistance'],
  [/parallel|series/i, 'series and parallel swapped'],
  [/half[- ]life/i, 'half-life against mean life'],
  [/\brms\b|root mean square/i, 'peak against rms'],
  [/\bint\b[\s\S]*\/|integer division/i, 'integer division'],
  [/\+\+|--/, 'prefix against postfix'],
  [/recurs/i, 'the order of calls on return'],
  [/\b(?:static)\b/i, 'static against instance'],
  [/charAt|substring|length\(\)/, 'an off-by-one index'],
  [/∫|integrat/i, 'the constant, or the limits after substitution'],
  [/sin⁻¹|tan⁻¹|cos⁻¹|inverse trig/i, 'the principal value range'],
  [/probabilit|bayes/i, 'conditional probability reversed'],
  [/molality|molarity/i, 'molality against molarity'],
  [/van.?t hoff|dissociat|electrolyte/i, "forgetting the van't Hoff factor"],
  [/log|nernst/i, 'log base, or the number of electrons'],
  [/k-?map|karnaugh/i, 'missing a wrap-around group'],
  [/row[- ]major|column[- ]major/i, 'row-major against column-major'],
];

function structureOf(text, marks, type) {
  const given = [...text.matchAll(UNITS)].length;
  const parts = (text.match(/\b(hence|then|also|further|and find|and hence)\b/gi) ?? []).length;
  return {
    steps: Math.max(1, Math.min(6, type === 'mcq' || type === 'definition' ? 1 : Math.max(marks ?? 1, parts + 1))),
    given,
    words: text.split(/\s+/).length,
    figure: /\b(figure|fig\.|diagram|shown (below|in|above|alongside)|circuit (below|shown)|graph)\b/i.test(text),
    table: /\b(table|data (below|given)|following data|observations?)\b/i.test(text),
    code: /[{};]\s*$|System\.out|public |def |print\(|int\s+\w+\s*=/m.test(text),
  };
}

// ---- Which topic -------------------------------------------------------------------------------

const STOP = new Set('and the of in to for with its their from on by as at an a or into using use uses used including simple only one two three all also it is are be this that these those between within without their such e.g i.e not no type types various different general basic elementary concept concepts idea ideas study introduction applications application example examples'.split(' '));

function phrasesOf(wording) {
  const out = new Set();
  for (const piece of wording.split(/[,;:.()–—]/)) {
    const words = piece.toLowerCase().replace(/[^a-z0-9'\- ]+/g, ' ').split(/\s+/).filter(Boolean);
    const core = words.filter((w) => !STOP.has(w));
    if (core.length >= 2 && core.length <= 5) out.add(core.join(' '));
    for (const w of core) if (w.length >= 7) out.add(w);
    for (let i = 0; i + 1 < core.length; i++) out.add(`${core[i]} ${core[i + 1]}`);
  }
  return [...out];
}

/** Words the syllabus wording leaves out but questions use. Written by hand, in the style of the unit word lists used before. */
const EXTRA = {
  physics: {
    XI: {
      '1a': ['least count', 'significant figure', 'vernier', 'screw gauge', 'percentage error', 'absolute error', 'si unit'],
      '1b': ['dimension', 'dimensional', 'homogeneity'],
      '2a': ['velocity', 'acceleration', 'displacement', 'uniformly accelerated', 'velocity-time', 'free fall'],
      '2b': ['projectile', 'vector', 'relative velocity', 'range of', 'angle of projection', 'circular motion'],
      '3a': ['newton', 'momentum', 'impulse', 'recoil', 'force', 'action and reaction'],
      '3b': ['friction', 'equilibrium', 'inclined plane', 'angle of repose'],
      '3c': ['centripetal', 'banking', 'circular track', 'turn'],
      '4a': ['work done', 'kinetic energy', 'power', 'potential energy', 'spring', 'work-energy'],
      '4b': ['collision', 'elastic', 'coefficient of restitution', 'inelastic'],
      '5a': ['centre of mass'],
      '5b': ['torque', 'angular momentum', 'couple'],
      '5c': ['moment of inertia', 'rolling', 'radius of gyration', 'parallel axes', 'perpendicular axes'],
      '6a': ['gravitational', 'acceleration due to gravity', 'kepler', 'universal gravitation'],
      '6b': ['escape velocity', 'orbital', 'satellite', 'geostationary'],
      '7a': ["young's modulus", 'stress', 'strain', 'hooke', 'bulk modulus', 'rigidity'],
      '7b': ['viscosity', 'bernoulli', 'terminal velocity', 'stokes', 'pascal', 'pressure', 'continuity'],
      '7c': ['surface tension', 'capillary', 'surface energy', 'drop'],
      '8a': ['thermal', 'calorimetry', 'expansion', 'conduction', 'specific heat', 'black body', 'stefan', 'wien', 'latent heat', 'newton\'s law of cooling'],
      '8b': ['thermodynamic', 'isothermal', 'adiabatic', 'first law', 'carnot', 'heat engine', 'refrigerator'],
      '9a': ['kinetic theory', 'rms speed', 'degrees of freedom', 'ideal gas', 'mean free path', 'equipartition'],
      '10a': ['simple harmonic', 'shm', 'pendulum', 'oscillation', 'spring-mass'],
      '10b': ['wave', 'beat', 'stationary', 'doppler', 'sound', 'organ pipe', 'sonometer', 'transverse', 'longitudinal'],
    },
    XII: {
      '1a': ['coulomb', 'electric field', 'dipole', 'gauss', 'flux', 'point charge', 'test charge', 'charged sphere', 'sheet of charge'],
      '1b': ['equipotential', 'electric potential', 'capacitor', 'capacitance', 'dielectric', 'potential energy of', 'parallel plate'],
      '2a': ['resistance', 'resistivity', 'drift', 'ohm', 'current density', 'mobility', 'colour code', 'carbon resistor', 'power dissipated', 'heating', 'temperature coefficient', 'conductivity'],
      '2b': ['kirchhoff', 'wheatstone', 'meter bridge', 'metre bridge', 'potentiometer', 'emf', 'e.m.f', 'internal resistance', 'cell', 'terminal voltage', 'balance point', 'balanced'],
      '3a': ['magnetic field', 'biot', 'ampere', 'solenoid', 'toroid', 'galvanometer', 'cyclotron', 'lorentz', 'current loop', 'ammeter', 'voltmeter', 'force on a conductor', 'moving charge'],
      '3b': ['magnetic moment', 'diamagnet', 'paramagnet', 'ferromagnet', 'hysteresis', 'susceptibility', 'bar magnet', 'curie', 'retentivity', 'coercivity', 'permeability'],
      '4a': ['induced emf', 'induced e.m.f', 'faraday', 'lenz', 'self inductance', 'self-inductance', 'mutual inductance', 'eddy current', 'motional', 'magnetic flux', 'induced current'],
      '4b': ['alternating', 'lcr', 'reactance', 'impedance', 'resonan', 'power factor', 'transformer', 'rms', 'ac generator', 'wattless', 'a.c.'],
      '5a': ['electromagnetic wave', 'electromagnetic spectrum', 'displacement current', 'microwave', 'infrared', 'ultraviolet', 'x-ray', 'gamma', 'em wave', 'radio wave'],
      '6a': ['mirror', 'refract', 'lens', 'prism', 'critical angle', 'total internal', 'focal', 'magnification', 'optical fibre', 'scatter', 'rainbow', 'minimum deviation', 'dispersion'],
      '6b': ['telescope', 'microscope', 'eyepiece', 'objective', 'magnifying power', 'resolving power'],
      '6c': ['young', 'fringe', 'diffraction', 'interference', 'wavefront', 'huygens', 'polari', 'brewster', 'malus', 'coherent', 'slit'],
      '7a': ['photoelectric', 'work function', 'de broglie', 'photon', 'stopping potential', 'threshold', 'davisson', 'matter wave', 'photo cell', 'photocell'],
      '8a': ['bohr', 'hydrogen atom', 'rydberg', 'balmer', 'lyman', 'paschen', 'rutherford', 'alpha particle', 'energy level', 'spectral', 'orbit'],
      '8b': ['nucleus', 'nuclei', 'binding energy', 'mass defect', 'half life', 'half-life', 'fission', 'fusion', 'radioactive', 'decay', 'isotope', 'nuclear', 'isobar', 'isotone', 'nucleon'],
      '9a': ['semiconductor', 'intrinsic', 'extrinsic', 'doping', 'dopant', 'band gap', 'energy band', 'hole', 'p-type', 'n-type', 'valence band', 'conduction band'],
      '9b': ['diode', 'rectifier', 'zener', 'p-n', 'pn junction', 'junction', 'depletion', 'led', 'solar cell', 'photodiode', 'forward bias', 'reverse bias', 'logic gate', 'nand', 'nor gate', 'and gate', 'or gate', 'transistor'],
    },
  },
  chemistry: {
    XI: {
      '1a': ['law of', 'significant figure', 'matter', 'atomic mass'],
      '1b': ['mole', 'molar mass', 'stoichiometry', 'limiting', 'empirical formula', 'percentage composition', 'molecular formula'],
      '1c': ['normality', 'equivalent', 'titration', 'volumetric', 'molarity'],
      '2a': ['bohr', 'rydberg', 'photon', 'de broglie', 'heisenberg', 'cathode ray', 'photoelectric'],
      '2b': ['quantum number', 'electronic configuration', 'orbital', 'aufbau', 'hund', 'pauli', 'electron'],
      '3a': ['periodic', 'ionisation enthalpy', 'ionization energy', 'electronegativity', 'atomic radius', 'electron gain', 'group', 'period'],
      '4a': ['ionic bond', 'covalent', 'lattice', 'dipole moment', 'fajan', 'octet', 'lewis'],
      '4b': ['hybridis', 'hybridiz', 'vsepr', 'sigma', 'bond order', 'molecular orbital', 'shape of', 'geometry', 'hydrogen bond'],
      '5a': ['enthalpy', 'internal energy', 'first law', 'hess', 'work done', 'bond enthalpy', 'isothermal'],
      '5b': ['entropy', 'gibbs', 'spontaneous', 'second law'],
      '6a': ['equilibrium constant', 'le chatelier', 'kp', 'kc', 'reaction quotient'],
      '6b': ['ph', 'buffer', 'solubility product', 'ksp', 'ionisation', 'common ion', 'hydrolysis', 'degree of dissociation', 'conjugate'],
      '7a': ['oxidation number', 'oxidation state', 'redox', 'oxidising', 'reducing agent', 'oxidising agent'],
      '8a': ['iupac', 'isomer', 'nomenclature', 'functional group'],
      '8b': ['purification', 'distillation', 'chromatography', 'lassaigne', 'kjeldahl', 'dumas', 'sublimation', 'crystallisation'],
      '8c': ['inductive', 'resonance', 'hyperconjugation', 'electromeric', 'electrophile', 'nucleophile', 'carbocation', 'free radical'],
      '9a': ['alkane', 'wurtz', 'conformation', 'methane', 'ethane'],
      '9b': ['alkene', 'markovnikov', 'ozonolysis', 'ethene', 'propene'],
      '9c': ['alkyne', 'ethyne', 'acetylene', 'acidic hydrogen'],
      '9d': ['benzene', 'aromatic', 'friedel', 'nitration', 'huckel'],
    },
    XII: {
      '1a': ['raoult', 'molality', 'molarity', 'mole fraction', 'colligative', 'osmotic', 'osmosis', "van't hoff", 'elevation', 'depression', 'vapour pressure', 'azeotrop', 'henry', 'freezing point', 'boiling point', 'solution'],
      '2a': ['electrode', 'nernst', 'galvanic', 'daniell', 'cell reaction', 'standard reduction', 'emf', 'e.m.f', 'electrochemical', 'salt bridge', 'cell potential'],
      '2b': ['conductivity', 'kohlrausch', 'molar conductance', 'molar conductivity', 'electrolysis', 'faraday', 'conductance', 'electrolytic'],
      '2c': ['fuel cell', 'corrosion', 'lead storage', 'rusting', 'battery', 'dry cell'],
      '3a': ['rate constant', 'order of', 'first order', 'half-life', 'half life', 'molecularity', 'rate law', 'rate of reaction', 'zero order', 'rate of', 'second order', 'pseudo'],
      '3b': ['activation energy', 'arrhenius', 'collision', 'threshold', 'catalyst', 'temperature coefficient'],
      '4a': ['transition', 'lanthan', 'actinoid', 'd-block', 'f-block', 'interstitial', 'oxidation state', 'magnetic moment', 'coloured', 'paramagnet'],
      '4b': ['dichromate', 'permanganate', 'cr2o7', 'kmno4', 'k2cr2o7', 'mno4'],
      '5a': ['coordination', 'ligand', 'crystal field', 'complex', 'chelate', 'werner', 'hexa', 'tetra', 'cfse', 'spectrochemical', 'iupac name of', 'high spin', 'low spin'],
      '6a': ['haloalkane', 'chloro', 'bromo', 'sn1', 'sn2', 'wurtz', 'grignard', 'dehydrohalogen', 'alkyl halide', 'iodo', 'finkelstein', 'swarts', 'chloroethane', 'bromoethane'],
      '6b': ['haloarene', 'chlorobenzene', 'sandmeyer', 'aryl halide', 'gattermann', 'dow'],
      '6c': ['chloroform', 'iodoform', 'ddt', 'freon', 'carbon tetrachloride', 'dichloromethane'],
      '7a': ['alcohol', 'lucas', 'ethanol', 'methanol', 'propanol', 'propan', 'dehydration'],
      '7b': ['phenol', 'reimer', 'kolbe', 'picric', 'cumene', 'salicylic'],
      '7c': ['ether', 'williamson', 'anisole', 'methoxy', 'ethoxy'],
      '8a': ['aldehyde', 'ketone', 'aldol', 'cannizzaro', 'tollen', 'fehling', 'ethanal', 'acetone', 'benzaldehyde', 'clemmensen', 'wolff', 'carbonyl', 'rosenmund', 'etard', 'propanone', 'schiff'],
      '8b': ['carboxylic', 'hvz', 'hell', 'acetic', 'ethanoic', 'benzoic', 'decarboxyl', 'formic', 'esterification'],
      '9a': ['amine', 'aniline', 'hoffmann', 'hofmann', 'hinsberg', 'gabriel', 'carbylamine', 'nitrobenzene', 'benzamide', 'acetamide', 'methanamine', 'ethanamine'],
      '9b': ['cyanide', 'isocyanide', 'nitrile', 'acetonitrile'],
      '9c': ['diazonium', 'coupling', 'azo', 'diazotisation', 'diazotization'],
      '10a': ['glucose', 'fructose', 'sucrose', 'starch', 'carbohydrate', 'maltose', 'lactose', 'cellulose', 'monosaccharide', 'disaccharide', 'glycosidic', 'anomer', 'reducing sugar'],
      '10b': ['protein', 'amino acid', 'peptide', 'denatur', 'zwitter', 'enzyme', 'glycine', 'alanine', 'globular', 'fibrous'],
      '10c': ['vitamin'],
      '10d': ['dna', 'rna', 'nucleotide', 'nucleoside', 'nucleic', 'pyrimidine', 'purine', 'thymine', 'uracil', 'cytosine'],
      '11a': ['titrat', 'indicator', 'burette'],
      '11c': ['test for', 'functional group test'],
      '11d': ['qualitative', 'salt analysis', 'radical'],
    },
  },
  mathematics: {
    XI: {
      '1a': ['set', 'venn', 'union', 'intersection', 'subset', 'power set', 'complement of'],
      '1b': ['relation', 'function', 'domain', 'range', 'f(x)'],
      '1c': ['trigonometric', 'sin', 'cos', 'tan', 'radian', 'sec', 'cosec', 'cot', 'angle'],
      '2a': ['complex number', 'argand', 'modulus', 'conjugate', 'iota', 'amplitude', 'polar form', 'a + ib', 'imaginary'],
      '2b': ['quadratic', 'roots of', 'discriminant'],
      '2c': ['permutation', 'combination', 'arrangements', 'ways', 'ncr', 'factorial', 'committee'],
      '2d': ['binomial expansion', 'binomial theorem', 'middle term', 'general term', 'term independent'],
      '2e': ['sequence', 'series', 'g.p', 'a.p', 'progression', 'sum to n', 'common ratio', 'common difference', 'h.p'],
      '3a': ['straight line', 'slope', 'intercept', 'perpendicular distance', 'equation of the line'],
      '3b': ['circle', 'radius', 'centre'],
      '3c': ['parabola', 'ellipse', 'hyperbola', 'conic', 'focus', 'directrix', 'eccentricity', 'latus rectum'],
      '3d': ['three dimensional', 'three-dimensional', 'section formula', 'distance between'],
      '4a': ['limit', 'lim', 'derivative', 'differentiate', 'first principle', 'dy/dx'],
      '5a': ['mean deviation', 'variance', 'standard deviation', 'median', 'quartile', 'statistics', 'frequency', 'mean of'],
      '5b': ['probability', 'mutually exclusive', 'sample space', 'event', 'coin', 'die', 'dice', 'cards'],
    },
    XII: {
      '1a': ['relation', 'one-one', 'one one', 'onto', 'bijective', 'equivalence', 'composition', 'inverse function', 'injective', 'surjective', 'reflexive', 'transitive', 'gof', 'fog', 'binary operation', 'invertible', 'many-one'],
      '1b': ['sin−1', 'tan−1', 'cos−1', 'cot−1', 'sec−1', 'cosec−1', 'sin-1', 'tan-1', 'cos-1', 'cot-1', 'inverse trigonometric', 'principal value', 'sin⁻', 'cos⁻', 'tan⁻'],
      '2a': ['matrix', 'matrices', 'transpose', 'skew', 'symmetric matrix', 'order of a'],
      '2b': ['determinant', 'cofactor', 'minor of', 'cramer', 'adjoint', 'adj', 'singular', 'system of equations', 'consistent'],
      '3a': ['continuous', 'continuity', 'differentiable', 'dy/dx', 'derivative', 'differentiate', 'implicit', 'parametric', 'rolle', 'mean value', 'lagrange', 'logarithmic', 'd²y', 'second order derivative', 'chain rule'],
      '3b': ['tangent', 'normal to', 'rate of change', 'increasing', 'decreasing', 'maxima', 'minima', 'maximum', 'minimum', 'turning point', 'approximate', 'point of inflection', 'stationary'],
      '3c': ['integrate', 'evaluate', '∫', 'definite integral', 'indefinite', 'partial fraction', 'integral', 'integration'],
      '3d': ['area bounded', 'area of the region', 'area enclosed', 'area under', 'bounded by', 'enclosed by'],
      '3e': ['differential equation', 'order and degree', 'integrating factor', 'homogeneous', 'general solution', 'particular solution', 'variable separable'],
      '4a': ['vector', 'dot product', 'cross product', 'scalar triple', 'projection', 'position vector', 'collinear', 'coplanar', 'î', 'ĵ', 'scalar product'],
      '5a': ['plane', 'direction cosine', 'direction ratio', 'skew lines', 'shortest distance', 'line passing', 'equation of the line', 'three dimension', 'three-dimension', 'cartesian', 'perpendicular distance', 'x-axis, y-axis'],
      '6a': ['linear programming', 'corner point', 'feasible', 'objective function', 'lpp', 'constraint', 'maximise z', 'minimise z', 'maximize z', 'minimize z'],
      '7a': ['probability', 'bayes', 'binomial', 'random variable', 'mean and variance', 'conditional', 'independent', 'distribution', 'bag contains', 'urn', 'dice', 'die ', 'coin', 'cards', 'total probability'],
    },
  },
  computerscience: {
    XI: {
      '1a': ['binary', 'octal', 'hexadecimal', 'number system', 'decimal', 'radix', 'base'],
      '2a': ["2's complement", "1's complement", 'sign and magnitude', 'floating', 'ascii', 'unicode', 'encoding', 'gray code', 'bcd', 'parity', 'twos complement'],
      '3a': ['proposition', 'truth table', 'tautology', 'contradiction', 'implication', 'de morgan'],
      '3b': ['logic gate', 'half adder', 'full adder', 'nand', 'nor', 'xor', 'arithmetic'],
      '4a': ['object oriented', 'object-oriented', 'encapsul', 'abstraction', 'polymorphism', 'oop'],
      '5a': ['object', 'jvm', 'bytecode', 'instance', 'class', 'byte code'],
      '5b': ['syntax error', 'runtime', 'logical error', 'exception', 'compile'],
      '6a': ['primitive', 'wrapper', 'data type', 'casting', 'byte', 'autoboxing', 'double', 'char', 'integer.parseint', 'boolean'],
      '7a': ['variable', 'expression', 'operator', 'precedence', 'ternary', 'increment', 'modulus', 'identifier', 'literal', 'evaluate'],
      '8a': ['if', 'switch', 'loop', 'while', 'for loop', 'do-while', 'break', 'continue', 'scope', 'statement', 'fall through'],
      '9a': ['method', 'constructor', 'overload', 'parameter', 'return', 'static', 'pure function', 'impure'],
      '10a': ['array', 'string', 'charat', 'substring', 'sorting', 'bubble', 'linear search', 'binary search', 'selection sort', 'indexof'],
      '11a': ['scanner', 'input', 'nextint', 'tokenizer'],
      '11b': ['file', 'filewriter', 'printwriter', 'bufferedreader', 'filereader'],
      '12a': ['python', 'tuple', 'dictionary', 'def ', 'list slicing', 'indentation'],
      '13a': ['cyber', 'ethic', 'privacy', 'plagiar', 'malware', 'phishing', 'intellectual property', 'artificial intelligence', 'cloud', 'copyright', 'digital'],
    },
    XII: {
      '1a': ['proposition', 'tautology', 'contradiction', 'contingency', 'implication', 'biconditional', 'converse', 'contrapositive', 'modus', 'syllogism'],
      '1b': ['boolean', 'k-map', 'kmap', 'karnaugh', 'sop', 'pos', 'maxterm', 'minterm', 'truth table', 'de morgan', 'complement', 'dual', 'reduce', 'absorption', 'canonical'],
      '2a': ['logic gate', 'logic circuit', 'nand', 'nor gate', 'xor', 'universal gate', 'gate'],
      '2b': ['half adder', 'full adder', 'decoder', 'encoder', 'multiplexer', 'adder', 'octal to binary', 'hexadecimal to binary'],
      '3a': ['design a class', 'class name', 'data member', 'member function', 'constructor', 'object as parameter', 'object', 'method', 'static', 'specify the class', 'define a class'],
      '4a': ['array', 'matrix', 'row major', 'column major', 'row-major', 'column-major', 'address', 'base address', 'dda', 'sda'],
      '4b': ['string', 'charat', 'substring', 'palindrome', 'word', 'sentence', 'stringtokenizer', 'indexof', 'vowel'],
      '5a': ['recurs', 'base case'],
      '6a': ['inherit', 'extends', 'super', 'overrid', 'derived class', 'base class', 'superclass', 'subclass'],
      '6b': ['interface', 'implements', 'abstract', 'stack', 'queue', 'dequeue', 'linked list', 'push', 'pop', 'enqueue'],
      '7a': ['python string', 'python', 'slicing', 'upper()', 'lower()', 'strip'],
      '7b': ['list comprehension', 'append', 'python list', 'lists', 'list'],
      '7c': ['tuple', 'immutable'],
      '8a': ['binary tree', 'node', 'leaf', 'inorder', 'preorder', 'postorder', 'traversal', 'in-order', 'pre-order', 'post-order', 'subtree', 'tree'],
      '9a': ['big o', 'big-o', 'complexity', 'o(n', 'worst case', 'best case', 'time complexity'],
    },
  },
};

const syllabi = Object.fromEntries(['physics', 'chemistry', 'mathematics', 'computerscience'].map((s) => [s, JSON.parse(fs.readFileSync(`src/data/syllabus/${s}.json`, 'utf8'))]));

/** Everything a topic can be recognised by, for one subject and class. */
function buildMatcher(subject, level) {
  const cls = syllabi[subject].classes.find((c) => c.level === level);
  const topics = [];
  for (const unit of cls.units) {
    for (const topic of unit.topics) {
      const key = `${unit.number}${topic.key}`;
      const extra = EXTRA[subject]?.[level]?.[key] ?? [];
      const phrases = [...new Set([...phrasesOf(`${topic.name}. ${topic.wording ?? ''}`), ...extra.map((x) => x.toLowerCase())])];
      topics.push({ unit: unit.number, unitName: unit.name, topic: topic.key, topicName: topic.name, phrases, strong: new Set(extra.map((x) => x.toLowerCase())) });
    }
  }
  return topics;
}

const matchers = new Map();
function matcher(subject, level) {
  const key = `${subject}-${level}`;
  if (!matchers.has(key)) matchers.set(key, buildMatcher(subject, level));
  return matchers.get(key);
}

function topicOf(subject, level, text, context, tag) {
  const haystack = ` ${`${tag ?? ''} ${context} ${text}`.toLowerCase().replace(/[’']/g, "'")} `;
  const list = matcher(subject, level);
  let best = null;
  let bestScore = 0;
  const concepts = [];
  for (const t of list) {
    let score = 0;
    const hits = [];
    for (const p of t.phrases) {
      if (haystack.includes(p)) {
        const weight = (t.strong.has(p) ? 3 : 1) * Math.min(3, p.split(' ').length);
        score += weight;
        hits.push(p);
      }
    }
    if (tag && tag.toLowerCase().includes(t.unitName.toLowerCase().slice(0, 12))) score += 20;
    if (tag && tag.toLowerCase().includes(t.topicName.toLowerCase().slice(0, 12))) score += 12;
    if (score > bestScore) {
      bestScore = score;
      best = t;
      concepts.length = 0;
      concepts.push(...hits.slice(0, 6));
    }
  }
  return best ? { unit: best.unit, unitName: best.unitName, topic: best.topic, topicName: best.topicName, concepts, score: bestScore } : { unit: null, concepts: [], score: 0 };
}

// ---- Formulas tested ---------------------------------------------------------------------------

const entries = JSON.parse(fs.readFileSync('data-private/all-entries.json', 'utf8'));
const normal = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const formulaNames = {};
for (const e of entries) {
  const base = normal(String(e.name).replace(/\([^)]*\)/g, ' ').split(/[:;,–—]| - /)[0]);
  if (base.length < 8 || base.split(' ').length < 2) continue;
  (formulaNames[e.subject] ??= new Map());
  if (!formulaNames[e.subject].has(base)) formulaNames[e.subject].set(base, e.id);
}

function formulasIn(subject, text) {
  const hay = ` ${normal(text)} `;
  const found = [];
  for (const [name, id] of formulaNames[subject] ?? []) {
    if (hay.includes(` ${name} `)) found.push(id);
    if (found.length >= 5) break;
  }
  return found;
}

// ---- Garbled OCR -------------------------------------------------------------------------------

function garbleOf(text) {
  const clearText = text.replace(/\s+/g, '');
  if (!clearText.length) return 1;
  const odd = (clearText.match(/[^A-Za-z0-9.,;:()[\]{}+\-=/%?'"<>°×÷µμΩαβγδθλπρσφω∫√∑]/g) ?? []).length;
  const words = text.split(/\s+/).filter(Boolean);
  const nonsense = words.filter((w) => w.length > 3 && !/[aeiou]/i.test(w) && /^[A-Za-z]+$/.test(w)).length;
  return Math.min(1, odd / clearText.length + nonsense / Math.max(1, words.length));
}

// ---- Run ----------------------------------------------------------------------------------------

const records = [];
const unanalysed = [];
const paperStats = [];

for (const paper of index) {
  const subject = SUBJECT_ID[paper.subject];
  const raw = textOf(paper);
  const level = levelOf(paper, raw);
  const text = cutAnswers(raw);
  const { questions } = splitQuestions(text, paper);
  const id = `${paper.subject}/${paper.type}/${paper.year}/${paper.name.replace(/[^\w.-]+/g, '_')}`;
  let count = 0;
  const practical = /(PAPER|Paper)[-_ ]?2\b|\b86[12]B\b|\b868B\b/.test(paper.name);
  if (!questions.length) unanalysed.push({ source: id, question: '', reason: practical ? 'a practical paper, set as an experiment or a programming task rather than numbered written questions' : 'no questions could be found in this file' });
  for (const q of questions) {
    for (const leaf of leavesOf(q)) {
      const body = clean(leaf.text ?? '');
      const context = clean(leaf.context ?? '');
      if (!body && !context) continue;
      if (/^(answer|attempt|this paper|general instructions|time allowed)/i.test(body) && !leaf.marks) continue;
      // A label with nothing after it is usually a figure's own label, or text the file doesn't hold as text.
      if (body.length < 4 && !leaf.options?.length) {
        unanalysed.push({ source: id, question: `${q.number}${leaf.sub}`, reason: 'almost no text survived, usually because the part is an equation or figure stored as a picture' });
        continue;
      }
      const tag = /\[([A-Z][^\]]{3,70})\]/.exec(q.lines[0] ?? '')?.[1] ?? null;
      const type = classify(body, context, leaf.options, subject, clean(leaf.parent ?? ''));
      let where = topicOf(subject, level, body, context, tag);
      let recordLevel = level;
      // A question can be on the other class's syllabus, as older papers mix them.
      if (where.score < 2) {
        const other = level === 'XI' ? 'XII' : 'XI';
        const there = topicOf(subject, other, body, context, tag);
        if (there.score > where.score + 1) {
          where = there;
          recordLevel = other;
        }
      }
      const garble = paper.readable === 'text' ? 0 : garbleOf(body);
      const { skill, tagged } = skillOf(`${body}`, type);
      const whole = `${context} ${body}`;
      const figure = structureOf(whole, leaf.marks, type);
      const record = {
        source: id,
        subject,
        level: recordLevel,
        paperType: paper.type,
        year: paper.year,
        scanned: paper.readable !== 'text',
        q: q.number,
        section: q.section,
        sub: leaf.sub,
        alt: leaf.alt,
        marks: leaf.marks ?? (leaf.options?.length || type === 'mcq' || type === 'assertion' ? 1 : null),
        markGuess: leaf.markGuess || (leaf.marks == null && (leaf.options?.length || type === 'mcq' || type === 'assertion')) ? true : undefined,
        groupMarks: leaf.groupMarks,
        groupSize: leaf.groupSize,
        type,
        style: paper.type === 'cfq' || paper.type === 'item-bank' || tagged || type === 'case' ? 'cbq' : 'paper',
        practical: practical || undefined,
        unit: where.unit,
        unitName: where.unitName,
        topic: where.topic,
        topicName: where.topicName,
        concepts: where.concepts,
        formulas: formulasIn(subject, whole),
        skill,
        skillTagged: tagged || undefined,
        structure: figure,
        traps: TRAPS.filter(([re]) => re.test(whole)).map(([, t]) => t),
        garble: Number(garble.toFixed(2)) || undefined,
        text: body.slice(0, 900),
        context: context.slice(0, 300) || undefined,
      };
      records.push(record);
      count++;
      const reasons = [];
      if (where.unit == null) reasons.push('no syllabus topic could be matched: it may be outside the 2028 syllabus');
      if (garble > 0.28) reasons.push('the OCR text is too garbled to trust');
      if (body.length < 12 && !context) reasons.push('almost no text survived');
      if (figure.figure && paper.readable !== 'text') reasons.push('it depends on a figure that OCR loses');
      if (reasons.length) unanalysed.push({ source: id, question: `${q.number}${leaf.sub}`, reason: reasons.join('; ') });
    }
  }
  paperStats.push({ source: id, subject, level, type: paper.type, year: paper.year, pages: paper.pages, scanned: paper.readable !== 'text', questions: questions.length, parts: count });
}

fs.writeFileSync('data-private/question-analysis.json', JSON.stringify({ made: new Date().toISOString(), records, unanalysed, paperStats }));

const tally = (list, f) => list.reduce((acc, x) => {
  const k = f(x);
  acc[k] = (acc[k] ?? 0) + 1;
  return acc;
}, {});
console.log('records', records.length, 'unanalysed', unanalysed.length);
for (const s of Object.values(SUBJECT_ID)) {
  const here = records.filter((r) => r.subject === s);
  console.log(s, here.length, JSON.stringify(tally(here, (r) => r.type)));
  console.log('  marks', JSON.stringify(tally(here, (r) => r.marks)));
  console.log('  no topic', here.filter((r) => r.unit == null).length, 'style', JSON.stringify(tally(here, (r) => r.style)));
}
console.log(paperStats.filter((p) => p.parts < 8).map((p) => `${p.source} q=${p.questions} parts=${p.parts}`).join('\n'));
