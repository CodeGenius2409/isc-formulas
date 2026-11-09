// Written by hand: Matter, laws and measurement. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, theory } = bank('chemistry', 'XI');
const M = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [1, 'a', marks, d];

const questions: BankDef[] = [
  mcq(M(1, 1), 'Water from any source has hydrogen and oxygen in a mass ratio of 1 : 8. This shows the law of:', ['conservation of mass', 'definite proportions', 'multiple proportions', 'gaseous volumes'], 1),
  mcq(M(1, 2), 'For a fixed mass of carbon, the masses of oxygen in CO and CO₂ are in the ratio 1 : 2. This shows the law of:', ['definite proportions', 'multiple proportions', 'conservation of mass', 'gaseous volumes'], 1),
  mcq(M(1, 2), 'Hydrogen and oxygen gases react by volume to give steam in the ratio 2 : 1 : 2. This shows:', ['Gay-Lussac’s law', 'Dalton’s atomic theory only', 'the law of conservation of mass', 'the law of definite proportions'], 0),
  theory('reason', M(2, 2), 'Give a reason: Dalton’s idea that atoms can’t be divided is no longer accepted, but his theory was still useful.', ['Atoms are now known to have electrons, protons and neutrons.', 'His theory still explained the laws of chemical combination.']),
  theory('distinguish', M(2, 1), 'Distinguish between a homogeneous and a heterogeneous mixture, with one example of each.', ['A homogeneous mixture has the same composition throughout: salt in water.', 'A heterogeneous mixture doesn’t: sand in water.']),
  theory('short', M(2, 2), 'Convert a density of 0.80 g/cm³ to kg/m³, showing the conversion factors.', ['0.80 g/cm³ × (1 kg/1000 g) × (10⁶ cm³/1 m³).', 'This is 800 kg/m³.']),
];

export default questions;
