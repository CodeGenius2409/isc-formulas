// Written by hand: electrochemistry, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');
const C = at(2, 'c');

const questions: BankDef[] = [
  match(A(3, 1), [['Anode of a galvanic cell', 'Oxidation happens here'], ['Cathode of a galvanic cell', 'Reduction happens here'], ['Salt bridge', 'Keeps the two solutions neutral']]),
  match(A(4, 2), [['Nernst equation at 298 K', 'E = E° − (0.059/n) log Q'], ['Standard Gibbs energy', 'ΔG° = −nFE°'], ['Equilibrium constant', 'log K = nE°/0.059 at 298 K'], ['Emf of a cell', 'E°(cathode) − E°(anode)']]),
  match(A(3, 2), [['Standard hydrogen electrode', 'Electrode potential taken as zero'], ['Fluorine', 'Most positive reduction potential'], ['Lithium', 'Most negative reduction potential']]),
  match(C(4, 3), [['Dry cell', 'Zinc and manganese dioxide'], ['Lead storage battery', 'Lead and lead dioxide in sulphuric acid'], ['Hydrogen–oxygen fuel cell', 'Gives water as its product'], ['Mercury cell', 'Steady voltage of about 1.35 V']]),
  match(C(3, 3), [['Rusting of iron', 'An electrochemical change'], ['Galvanising', 'Coating iron with zinc'], ['Sacrificial protection', 'Joining iron to a more reactive metal such as magnesium']]),
  match(A(4, 3), [['Galvanic cell', 'Chemical energy to electrical energy'], ['Electrolytic cell', 'Electrical energy drives a reaction'], ['Daniell cell', 'Zinc and copper half-cells'], ['Cell at equilibrium', 'Emf is zero']]),
  match(A(3, 3), [['ΔG negative', 'E positive, reaction goes by itself'], ['ΔG positive', 'E negative, reaction doesn’t go by itself'], ['ΔG zero', 'Cell at equilibrium, E = 0']]),
  match(B(3, 1), [['Conductivity', 'S m⁻¹'], ['Molar conductivity', 'S m² mol⁻¹'], ['Cell constant', 'm⁻¹']]),
  match(B(4, 2), [['KCl solution on dilution', 'Molar conductivity rises a little'], ['Ethanoic acid on dilution', 'Molar conductivity rises steeply'], ['Any electrolyte on dilution', 'Conductivity falls'], ['Infinite dilution', 'Every ion moves independently']]),
  match(B(3, 2), [['Faraday’s first law', 'Mass deposited is proportional to the charge passed'], ['Faraday’s second law', 'Masses deposited by the same charge are in the ratio of equivalent masses'], ['One faraday', 'About 96,500 C']]),
  match(B(4, 3), [['Electrolysis of molten NaCl', 'Sodium at the cathode'], ['Electrolysis of aqueous NaCl', 'Hydrogen at the cathode'], ['Electrolysis of dilute H₂SO₄', 'Oxygen at the anode'], ['Electrolysis of aqueous CuSO₄ with copper electrodes', 'Copper dissolves from the anode']]),
  match(B(3, 3), [['Kohlrausch’s law', 'Limiting molar conductivity is the sum of its ions’ shares'], ['Degree of ionisation of a weak electrolyte', 'Λ_m / Λ°_m'], ['Strong electrolyte’s graph of Λ_m against √c', 'A straight line']]),
];

export default questions;
