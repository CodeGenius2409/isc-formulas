// Every simulator. Each one is loaded on demand, and each group is its own file.
import type { ComponentType } from 'react';
import type { SubjectId } from '../data/types';

export interface SimInfo {
  id: string;
  title: string;
  desc: string;
  subject: SubjectId;
  load: () => Promise<ComponentType>;
}

type Module = Record<string, ComponentType>;

const from = (loader: () => Promise<unknown>, name: string) => () => (loader() as Promise<Module>).then((m) => m[name]);

const mech = () => import('./mechanics');
const elec = () => import('./electric');
const opt = () => import('./optics');
const mod = () => import('./modern');
const chem = () => import('./chemistry');
const maths = () => import('./maths');
const mathsCalc = () => import('./maths-calc');
const cs = () => import('./cs');

export const SIMS: SimInfo[] = [
  // The four major tools
  { id: 'projectile', title: 'Projectile motion', desc: 'Launch angle, speed and height, optional air drag, and side-by-side comparison.', subject: 'physics', load: from(() => import('./Projectile'), 'Projectile') },
  { id: 'circuits', title: 'DC circuit builder', desc: "Build series and parallel networks with cells, and solve by Kirchhoff's laws.", subject: 'physics', load: from(() => import('./Circuits'), 'Circuits') },
  { id: 'titration', title: 'Titration curves', desc: 'pH against volume, equivalence points, and which indicator to choose.', subject: 'chemistry', load: from(() => import('./Titration'), 'Titration') },
  { id: 'plotter', title: 'Graph plotter', desc: 'Plot several functions, with tangents, areas and intersections.', subject: 'mathematics', load: from(() => import('./Plotter'), 'Plotter') },
  { id: 'java', title: 'Java program tracer', desc: 'Step through ISC-level Java, with variables, the call stack and a dry-run table.', subject: 'computerscience', load: from(() => import('./JavaTracer'), 'JavaTracer') },

  // Physics
  { id: 'shm', title: 'Simple harmonic motion', desc: 'A moving mass on a spring, with its displacement and velocity.', subject: 'physics', load: from(mech, 'Shm') },
  { id: 'wave', title: 'Wave superposition', desc: 'Two waves adding, and the beats they make.', subject: 'physics', load: from(mech, 'Wave') },
  { id: 'atwood', title: 'Atwood machine', desc: 'Acceleration and tension for two hanging masses.', subject: 'physics', load: from(mech, 'Atwood') },
  { id: 'inclined', title: 'Inclined plane', desc: 'Acceleration with and without friction.', subject: 'physics', load: from(mech, 'Inclined') },
  { id: 'collision', title: 'Elastic collision', desc: 'Final velocities in one dimension.', subject: 'physics', load: from(mech, 'Collision') },
  { id: 'spring', title: 'Spring force and energy', desc: "Hooke's law and stored energy.", subject: 'physics', load: from(mech, 'Spring') },
  { id: 'lcr', title: 'Series LCR resonance', desc: 'Impedance, resonant frequency and quality factor.', subject: 'physics', load: from(elec, 'Lcr') },
  { id: 'capacitor', title: 'Capacitor energy', desc: 'Charge and stored energy from C and V.', subject: 'physics', load: from(elec, 'Capacitor') },
  { id: 'lens', title: 'Lens and mirror formula', desc: 'Image distance and magnification, with a ray diagram.', subject: 'physics', load: from(opt, 'Lens') },
  { id: 'snell', title: "Snell's law", desc: 'Refraction and the critical angle.', subject: 'physics', load: from(opt, 'Snell') },
  { id: 'ydse', title: "Young's double slit", desc: 'Fringe width and the interference pattern.', subject: 'physics', load: from(opt, 'Ydse') },
  { id: 'bohr', title: 'Bohr model', desc: 'Energy levels and orbit radii of hydrogen.', subject: 'physics', load: from(mod, 'Bohr') },
  { id: 'photoelectric', title: 'Photoelectric effect', desc: 'Maximum kinetic energy from frequency and work function.', subject: 'physics', load: from(mod, 'Photoelectric') },
  { id: 'radioactive', title: 'Radioactive decay', desc: 'Nuclei remaining over time, and half-life.', subject: 'physics', load: from(mod, 'Radioactive') },

  // Chemistry
  { id: 'ph', title: 'pH and buffers', desc: 'Strong acids, and buffers by Henderson–Hasselbalch.', subject: 'chemistry', load: from(chem, 'Ph') },
  { id: 'nernst', title: 'Nernst equation', desc: 'Cell potential away from standard conditions.', subject: 'chemistry', load: from(chem, 'Nernst') },
  { id: 'kinetics', title: 'First-order kinetics', desc: 'Concentration against time, and half-life.', subject: 'chemistry', load: from(chem, 'Kinetics') },
  { id: 'arrhenius', title: 'Arrhenius equation', desc: 'Rate constant from activation energy and temperature.', subject: 'chemistry', load: from(chem, 'Arrhenius') },
  { id: 'equilibrium', title: 'Equilibrium solver', desc: 'Concentrations at equilibrium for A ⇌ B.', subject: 'chemistry', load: from(chem, 'Equilibrium') },
  { id: 'gaslaw', title: 'Ideal gas law', desc: 'Pressure from n, T and V.', subject: 'chemistry', load: from(chem, 'GasLaw') },
  { id: 'molality', title: 'Solution concentrations', desc: 'Moles, molarity and molality.', subject: 'chemistry', load: from(chem, 'Molality') },

  // Mathematics
  { id: 'quadratic', title: 'Quadratic solver', desc: 'Roots and discriminant, with the parabola.', subject: 'mathematics', load: from(maths, 'Quadratic') },
  { id: 'binomial', title: 'Binomial expansion', desc: 'Expand (a + b)ⁿ term by term.', subject: 'mathematics', load: from(maths, 'Binomial') },
  { id: 'trig', title: 'Trigonometric ratios', desc: 'sin, cos and tan of any angle, on the unit circle.', subject: 'mathematics', load: from(maths, 'Trig') },
  { id: 'complex', title: 'Complex numbers', desc: 'Modulus, argument and polar form.', subject: 'mathematics', load: from(maths, 'ComplexLab') },
  { id: 'vectors', title: 'Vectors in 2-D', desc: 'Resultant, dot product and the angle between.', subject: 'mathematics', load: from(maths, 'Vectors') },
  { id: 'matrix', title: '2×2 matrix', desc: 'Determinant and inverse.', subject: 'mathematics', load: from(mathsCalc, 'Matrix2') },
  { id: 'det3', title: '3×3 determinant', desc: 'Determinant by cofactor expansion.', subject: 'mathematics', load: from(mathsCalc, 'Det3') },
  { id: 'derivative', title: 'Derivative at a point', desc: 'The slope of x², sin x and eˣ, with the tangent.', subject: 'mathematics', load: from(mathsCalc, 'DerivativeTool') },
  { id: 'integral', title: 'Area under a curve', desc: 'Definite integrals of x², sin x and eˣ.', subject: 'mathematics', load: from(mathsCalc, 'IntegralTool') },
  { id: 'limits', title: 'Limit explorer', desc: 'Approach x → a from both sides.', subject: 'mathematics', load: from(mathsCalc, 'Limits') },
  { id: 'binomialprob', title: 'Binomial probability', desc: 'P(X = r) for n trials.', subject: 'mathematics', load: from(mathsCalc, 'BinomialProb') },
  { id: 'combinatorics', title: 'Permutations and combinations', desc: 'ⁿPᵣ and ⁿCᵣ, exactly.', subject: 'mathematics', load: from(mathsCalc, 'Combinatorics') },

  // Computer Science
  { id: 'logic', title: 'Logic gates', desc: 'Every gate, with live inputs and its truth table.', subject: 'computerscience', load: from(cs, 'LogicGates') },
  { id: 'adder', title: 'Half and full adder', desc: 'Sum and carry from A, B and carry in.', subject: 'computerscience', load: from(cs, 'Adder') },
  { id: 'baseconv', title: 'Number base converter', desc: 'Decimal, binary, hexadecimal and octal.', subject: 'computerscience', load: from(cs, 'BaseConverter') },
];

/** Old links and bookmarks keep working after simulators were merged. */
export const SIM_ALIASES: Record<string, string> = {
  projectile2: 'projectile',
  truth: 'logic',
  truthtable: 'logic',
  vector: 'vectors',
  vectoradd: 'vectors',
  ohms: 'circuits',
  circuit: 'lcr',
  phscale: 'ph',
  trigcalc: 'trig',
  halfadder: 'adder',
};
