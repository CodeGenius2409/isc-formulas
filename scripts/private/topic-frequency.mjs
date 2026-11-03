// How often each syllabus unit appears across the private papers, counted by the question. It splits
// each paper into questions and looks for each unit's vocabulary. Counts only leave data-private.
import fs from 'node:fs';
import path from 'node:path';

const KEYWORDS = {
  physics: {
    XII: {
      'Electrostatics': ['electric field', 'coulomb', 'gauss', 'dipole', 'capacitor', 'capacitance', 'electrostatic', 'equipotential', 'dielectric'],
      'Current Electricity': ['resistance', 'resistivity', 'kirchhoff', 'wheatstone', 'meter bridge', 'potentiometer', 'emf', 'internal resistance', 'drift'],
      'Magnetism': ['magnetic field', 'biot', 'ampere', 'solenoid', 'galvanometer', 'cyclotron', 'lorentz', 'magnetic moment', 'diamagnetic', 'paramagnetic', 'ferromagnetic'],
      'EMI and AC': ['induced emf', 'faraday', 'lenz', 'self induct', 'mutual induct', 'transformer', 'alternating', 'lcr', 'reactance', 'impedance', 'resonan', 'power factor'],
      'EM Waves': ['electromagnetic wave', 'electromagnetic spectrum', 'displacement current', 'microwave', 'infrared', 'ultraviolet', 'x-ray'],
      'Optics': ['lens', 'mirror', 'refract', 'prism', 'critical angle', 'total internal', 'telescope', 'microscope', 'young', 'fringe', 'diffraction', 'interference', 'polaris', 'wavefront', 'huygens'],
      'Dual Nature': ['photoelectric', 'work function', 'de broglie', 'photon', 'stopping potential', 'threshold'],
      'Atoms and Nuclei': ['bohr', 'hydrogen atom', 'rydberg', 'balmer', 'nucleus', 'binding energy', 'mass defect', 'half life', 'half-life', 'fission', 'fusion', 'radioactiv'],
      'Electronic Devices': ['semiconductor', 'diode', 'rectifier', 'zener', 'p-n', 'pn junction', 'depletion', 'led', 'solar cell', 'photodiode'],
    },
  },
  chemistry: {
    XII: {
      'Solutions': ['raoult', 'molality', 'colligative', 'osmotic', 'van\'t hoff', 'elevation', 'depression', 'vapour pressure', 'azeotrop'],
      'Electrochemistry': ['electrode', 'nernst', 'conductivity', 'kohlrausch', 'molar conductance', 'faraday', 'galvanic', 'emf of', 'corrosion', 'electrolysis'],
      'Chemical Kinetics': ['rate constant', 'order of', 'half-life', 'half life', 'activation energy', 'arrhenius', 'molecularity', 'rate law'],
      'd- and f-block': ['transition', 'lanthan', 'actinoid', 'dichromate', 'permanganate', 'cr2o7', 'kmno4', 'k2cr2o7', 'oxidation state'],
      'Coordination': ['coordination', 'ligand', 'iupac name of', 'crystal field', 'complex', 'hexa', 'tetra', 'chelate', 'werner'],
      'Haloalkanes': ['haloalkane', 'haloarene', 'chloro', 'bromo', 'sn1', 'sn2', 'wurtz', 'grignard', 'dehydrohalogen', 'chlorobenzene', 'chloroform'],
      'Alcohols and phenols': ['alcohol', 'phenol', 'ether', 'lucas', 'reimer', 'kolbe', 'williamson', 'ethanol', 'methanol'],
      'Carbonyls and acids': ['aldehyde', 'ketone', 'carboxylic', 'aldol', 'cannizzaro', 'tollen', 'fehling', 'hvz', 'hell', 'iodoform', 'ethanal', 'acetone', 'propanone', 'clemmensen', 'rosenmund', 'etard'],
      'Nitrogen compounds': ['amine', 'aniline', 'diazonium', 'hoffmann', 'hofmann', 'carbylamine', 'cyanide', 'isocyanide', 'hinsberg', 'nitrobenzene', 'benzenediazonium', 'sandmeyer'],
      'Biomolecules': ['glucose', 'fructose', 'sucrose', 'starch', 'protein', 'amino acid', 'vitamin', 'dna', 'rna', 'nucleotide', 'peptide', 'carbohydrate', 'denaturation'],
    },
  },
  mathematics: {
    XII: {
      'Relations and functions': ['relation', 'one-one', 'onto', 'bijective', 'equivalence', 'composition', 'sin⁻¹', 'tan⁻¹', 'inverse trigonometric', 'binary operation'],
      'Matrices and determinants': ['matrix', 'matrices', 'determinant', 'adjoint', 'adj ', 'skew', 'symmetric', 'cramer', 'cofactor'],
      'Calculus: differentiation': ['differentiable', 'continuous', 'dy/dx', 'rolle', 'mean value', 'tangent', 'normal', 'maxima', 'minima', 'increasing', 'decreasing', 'rate of change'],
      'Calculus: integration': ['integrate', 'evaluate', '∫', 'definite integral', 'indefinite', 'area bounded', 'area of the region', 'partial fraction'],
      'Differential equations': ['differential equation', 'order and degree', 'integrating factor', 'homogeneous', 'general solution', 'particular solution'],
      'Vectors': ['vector', 'unit vector', 'dot product', 'cross product', 'scalar triple', 'collinear', 'coplanar'],
      'Three-dimensional geometry': ['direction cosine', 'direction ratio', 'skew lines', 'shortest distance', 'equation of the plane', 'equation of a line', 'line of intersection'],
      'Linear programming': ['linear programming', 'lpp', 'objective function', 'feasible', 'constraints', 'maximise', 'maximize', 'minimise', 'minimize'],
      'Probability': ['probability', 'bayes', 'independent events', 'random variable', 'binomial', 'mean of the', 'dice', 'die', 'cards', 'urn', 'bag contains'],
    },
  },
  'computer-science': {
    XII: {
      'Boolean algebra': ['boolean', 'k-map', 'karnaugh', 'minterm', 'maxterm', 'sop', 'pos', 'proposition', 'tautology', 'de morgan', 'truth table', 'contradiction', 'contingency', 'conditional'],
      'Computer hardware': ['logic gate', 'half adder', 'full adder', 'decoder', 'encoder', 'multiplexer', 'nand', 'nor', 'logic circuit', 'xor', 'xnor'],
      'Methods and objects': ['design a class', 'define a class', 'constructor', 'data members', 'member functions', 'member methods', 'class name'],
      'Arrays and strings': ['array', 'matrix', 'string', 'substring', 'charat', 'palindrome', 'row', 'column', 'address'],
      'Recursion': ['recursive', 'recursion', 'base case', 'stack overflow', 'mystery', 'function('],
      'Inheritance and interfaces': ['inherit', 'super', 'extends', 'interface', 'overrid', 'derived class', 'base class', 'abstract'],
      'Python': ['python', 'list', 'tuple', 'slice', 'append', 'print('],
      'Binary trees': ['binary tree', 'inorder', 'preorder', 'postorder', 'in-order', 'pre-order', 'post-order', 'leaf', 'root', 'height of the tree'],
      'Complexity': ['big o', 'big-o', 'complexity', 'o(n', 'worst case', 'best case'],
    },
  },
};

const index = JSON.parse(fs.readFileSync('data-private/papers-index.json', 'utf8'));
const ocrFiles = [];
const walk = (d) => fs.existsSync(d) && fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : ocrFiles.push(path.join(d, e.name))));
walk('data-private/ocr');

function textOf(paper) {
  const stem = path.basename(paper.target ?? '').replace(/\.txt$/, '');
  const candidates = [paper.target, ...ocrFiles.filter((f) => stem && path.basename(f).includes(stem))].filter((f) => f && fs.existsSync(f));
  return candidates.map((f) => fs.readFileSync(f, 'utf8')).sort((a, b) => b.length - a.length)[0] ?? '';
}

function questionsOf(text) {
  // Specimens carry a marking part after the paper. Only the question paper is counted.
  const answers = text.search(/\n\s*(?:answers?|marking scheme|comments of examiners)\b/i);
  const paper = answers > 2000 ? text.slice(0, answers) : text;
  return paper.split(/\n\s*question\s+\d+\b/i).slice(1);
}

const out = {};
for (const [subject, levels] of Object.entries(KEYWORDS)) {
  out[subject] = { papers: 0, questions: 0, units: {} };
  const papers = index.filter((p) => p.subject === subject && (p.type === 'board' || p.type === 'specimen'));
  for (const paper of papers) {
    const questions = questionsOf(textOf(paper));
    if (questions.length < 5) continue;
    out[subject].papers++;
    out[subject].questions += questions.length;
    for (const [unit, words] of Object.entries(levels.XII)) {
      const hits = questions.filter((q) => {
        const lower = q.toLowerCase();
        return words.some((w) => lower.includes(w));
      }).length;
      const entry = (out[subject].units[unit] ??= { questions: 0, papers: 0 });
      entry.questions += hits;
      if (hits) entry.papers++;
    }
  }
}
fs.writeFileSync('data-private/topic-frequency.json', JSON.stringify(out, null, 1));
for (const [subject, s] of Object.entries(out)) {
  console.log(`\n${subject}: ${s.papers} papers, ${s.questions} questions`);
  for (const [unit, c] of Object.entries(s.units).sort((a, b) => b[1].questions - a[1].questions)) console.log(`  ${unit}: ${c.questions} questions, in ${c.papers} papers`);
}
