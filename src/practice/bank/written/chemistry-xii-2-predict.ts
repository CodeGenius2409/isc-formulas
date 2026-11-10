// Written by hand: electrochemistry, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  predict(A(2, 1), 'A zinc rod is dipped into copper sulphate solution. Predict what is seen, and why.', 'The zinc gets a red-brown coat of copper, and the blue colour fades.', 'Zinc has a lower reduction potential, so it reduces Cu²⁺ to copper and goes into solution itself.'),
  predict(A(2, 2), 'In a Daniell cell, the concentration of Cu²⁺ is raised. Predict what happens to the emf.', 'The emf rises.', 'By the Nernst equation, E = E° − (0.059/2) log([Zn²⁺]/[Cu²⁺]), and a larger [Cu²⁺] makes the log smaller.'),
  predict(A(2, 2), 'The salt bridge of a working Daniell cell is taken out. Predict what happens to the current.', 'The current stops.', 'Charge builds up in each beaker, as no ions can move between them to keep them neutral.'),
  predict(A(3, 3), 'Predict whether copper metal can displace hydrogen from dilute hydrochloric acid, and use electrode potentials to explain.', 'No, it can’t.', 'E° for Cu²⁺/Cu is +0.34 V, higher than that of H⁺/H₂, which is 0.', 'So H⁺ can’t oxidise copper, and E° for the reaction would be negative.'),
  predict(A(2, 3), 'Predict the sign of ΔG for a cell reaction at equilibrium, and the cell’s emf then.', 'ΔG = 0.', 'So E = 0: the cell gives no current, as with a used-up battery.'),
  predict(B(2, 1), 'A solution of ethanoic acid is diluted ten times. Predict what happens to its conductivity and to its molar conductivity.', 'Its conductivity falls, as there are fewer ions in each unit volume.', 'Its molar conductivity rises sharply, as the acid ionises much more on dilution.'),
  predict(B(2, 2), 'The same charge is passed through solutions of CuSO₄ and AgNO₃ in series. Predict which deposits more mass of metal at the cathode.', 'Silver.', 'By Faraday’s second law the masses are in the ratio of equivalent masses: 108 for silver, against 31.75 for copper.'),
  predict(B(2, 2), 'Aqueous sodium chloride is electrolysed with inert electrodes. Predict the products at the cathode and the anode.', 'At the cathode, hydrogen, as water is reduced more easily than Na⁺.', 'At the anode, chlorine, from a concentrated solution.'),
  predict(B(3, 3), 'The temperature of a solution of KCl is raised. Predict what happens to its conductivity, and give two reasons.', 'Its conductivity rises.', 'The solution becomes less viscous, so the ions move faster.', 'The ions are less hydrated, so they are smaller as they move.'),
  predict(B(2, 3), 'The current in an electrolysis is doubled and the time halved. Predict what happens to the mass deposited.', 'It stays the same.', 'The mass depends on the charge, It, which is unchanged.'),
];

export default questions;
