// Written by hand: electrochemistry, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  ar(A(1, 1), 'Zinc displaces copper from copper sulphate solution.', 'Zinc has a lower standard reduction potential than copper.', 1, 'So zinc is the stronger reducing agent, and gives its electrons to Cu²⁺.'),
  ar(A(1, 2), 'The emf of a cell is zero when it reaches equilibrium.', 'At equilibrium, ΔG for the cell reaction is zero.', 1, 'ΔG = −nFE, so E = 0 when ΔG = 0.'),
  ar(A(1, 2), 'The standard hydrogen electrode has an electrode potential of exactly 1 V.', 'It is used as the reference for all other electrode potentials.', 4, 'It is the reference, and its potential is taken as 0 V by agreement.'),
  ar(A(1, 3), 'Raising [Cu²⁺] in a Daniell cell raises its emf.', 'By the Nernst equation, E = E° − (0.059/2) log([Zn²⁺]/[Cu²⁺]).', 1, 'A larger [Cu²⁺] makes the log term smaller, so E is larger.'),
  ar(A(1, 3), 'A salt bridge is needed in a galvanic cell.', 'The salt bridge provides the electrons that flow in the outer circuit.', 3, 'It keeps both solutions electrically neutral by letting ions move; the electrons come from the anode.'),
  ar(B(1, 1), 'The molar conductivity of a weak electrolyte rises steeply on dilution.', 'Its degree of ionisation rises on dilution.', 1, 'Many more ions are formed as the solution becomes more dilute.'),
  ar(B(1, 2), 'The conductivity of a solution rises on dilution.', 'Dilution raises the molar conductivity of every electrolyte.', 4, 'Conductivity falls on dilution, as there are fewer ions in each unit volume.'),
  ar(B(1, 2), 'One faraday deposits one mole of silver from silver nitrate.', 'Silver ion carries a single positive charge.', 1, 'Ag⁺ + e⁻ → Ag, so one mole of electrons gives one mole of silver.'),
  ar(B(1, 3), 'Λ°m for ethanoic acid can be found by extending its graph of Λm against √c to zero.', 'Kohlrausch’s law gives Λ°m from the limiting conductivities of the ions.', 4, 'A weak electrolyte’s graph rises too steeply near zero to extend; Kohlrausch’s law is used instead.'),
];

export default questions;
