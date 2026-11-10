// Written by hand: electrochemistry, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');
const C = at(2, 'c');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does a salt bridge keep a galvanic cell working?', 'Its ions move to keep both half-cells electrically neutral, so that current can go on.'),
  reason(A(2, 2), 'Why can a copper rod be left in a zinc sulphate solution with no reaction, though a zinc rod in copper sulphate reacts?', 'Zinc has the lower reduction potential, so zinc reduces Cu²⁺.', 'Copper can’t reduce Zn²⁺, so nothing happens.'),
  reason(A(1, 2), 'Why is the standard hydrogen electrode given a potential of exactly zero?', 'Only differences of potential can be measured, so one electrode must be chosen as the reference.'),
  reason(A(2, 3), 'A cell’s emf falls to zero as it reaches equilibrium. Why?', 'As the reaction goes on, Q rises until Q = K in the Nernst equation.', 'Then E = 0, ΔG = 0, and there is no further net change.'),
  reason(A(1, 2), 'Why isn’t a reaction with a positive E°cell always fast?', 'E° shows only that it is favoured, not how fast it goes, which depends on its activation energy.'),
  tell(A(2, 1), 'Distinguish between a galvanic and an electrolytic cell.', 'A galvanic cell changes chemical energy into electrical energy, by a spontaneous reaction.', 'An electrolytic cell uses electrical energy to drive a non-spontaneous reaction.'),
  short(A(2, 2), 'Write the Nernst equation for Zn | Zn²⁺ || Cu²⁺ | Cu at 298 K, and say what raising [Zn²⁺] does to it.', 'E = E° − (0.059/2) log([Zn²⁺]/[Cu²⁺]).', 'It lowers E.'),
  short(A(2, 2), 'How are ΔG° and E°cell related? What sign does a spontaneous reaction give each?', 'ΔG° = −nFE°.', 'ΔG° is negative, and E° is positive.'),
  short(A(3, 2), 'Write the cell notation of a cell made from zinc in Zn²⁺ and silver in Ag⁺. Write its anode and cathode reactions.', 'Zn | Zn²⁺ || Ag⁺ | Ag.', 'Anode: Zn → Zn²⁺ + 2e⁻.', 'Cathode: Ag⁺ + e⁻ → Ag.'),
  short(A(3, 3), 'What is an electrochemical series? State two uses of it.', 'Elements listed in order of their standard reduction potentials.', 'It shows which metal displaces which from a solution.', 'It gives the emf of any cell, and shows which metals can free hydrogen from acid.'),
  reason(B(1, 1), 'Why does molar conductivity rise as a solution is diluted?', 'Ions move more freely and, for a weak electrolyte, more of it ionises.'),
  reason(B(2, 2), 'Why does the conductivity of a solution fall on dilution, while its molar conductivity rises?', 'Conductivity counts ions per unit volume, which fall on dilution.', 'Molar conductivity counts per mole, and ions have more room to move.'),
  reason(B(2, 3), 'Why can’t the limiting molar conductivity of ethanoic acid be found from a graph in the way KCl’s can?', 'A weak electrolyte’s graph rises steeply at low concentration, and can’t be extended to zero.', 'Kohlrausch’s law gives it from the values of its ions.'),
  reason(B(1, 2), 'Why does a current of a.c., not d.c., go through a conductivity cell?', 'D.c. would cause electrolysis, which would change the solution being measured.'),
  reason(B(2, 2), 'Why does 1 F of charge free 1 mol of silver but only ½ mol of copper?', '1 F is one mole of electrons.', 'Ag⁺ takes one electron, and Cu²⁺ takes two.'),
  short(B(2, 1), 'Define molar conductivity, and write its link with conductivity.', 'The conductance of all the ions from one mole of electrolyte.', 'Λm = κ / c, with suitable units.'),
  short(B(2, 2), 'Besides concentration, name two things that the conductivity of an electrolyte’s solution depends on.', 'The nature of the electrolyte: how far it ionises, and the size and solvation of its ions.', 'The temperature: it rises as the solution gets warmer.'),
  short(B(2, 2), 'State Faraday’s two laws of electrolysis.', 'The mass deposited is proportional to the charge passed.', 'For the same charge, the masses deposited are proportional to the equivalent masses.'),
  short(B(3, 2), 'Which of these does each solution of NaCl give on electrolysis: dilute solution at the cathode, concentrated solution at the anode, and molten salt at the cathode?', 'Hydrogen.', 'Chlorine.', 'Sodium.'),
  short(B(3, 3), 'Sketch in words the graphs of molar conductivity against √c for KCl and for ethanoic acid. Why are they different?', 'KCl gives a straight line falling gently.', 'Ethanoic acid gives a curve rising steeply at low concentration.', 'KCl is fully ionised, while ethanoic acid ionises further as it’s diluted.'),
  reason(C(1, 1), 'Why does iron rust faster in sea water?', 'Dissolved salts conduct better, so the electrochemical action goes faster.'),
  reason(C(2, 2), 'Why is zinc used to protect iron, even though it is the more reactive metal?', 'Zinc is oxidised in place of iron, as it has the lower reduction potential.', 'So iron stays protected even if the coat is scratched.'),
  reason(C(2, 2), 'Why does a lead accumulator’s acid density fall as it discharges?', 'Sulphuric acid is used up in forming lead sulphate.', 'Water is also formed.'),
  reason(C(2, 3), 'Why is a fuel cell more efficient than a thermal power station?', 'It changes chemical energy directly into electrical energy.', 'A power station goes through heat, losing much of it.'),
  short(C(2, 1), 'What is corrosion? State two ways of preventing it.', 'The slow wearing away of a metal by chemical action with what surrounds it.', 'Painting, or galvanising with zinc.'),
  short(C(2, 2), 'Name the anode, the cathode and the electrolyte of a dry cell.', 'The anode is the zinc case, and the cathode is a graphite rod with MnO₂ around it.', 'The electrolyte is a paste of NH₄Cl and ZnCl₂.'),
  short(C(3, 2), 'Write the reactions at each electrode of a hydrogen–oxygen fuel cell, in alkali, and its overall reaction.', 'Anode: 2H₂ + 4OH⁻ → 4H₂O + 4e⁻.', 'Cathode: O₂ + 2H₂O + 4e⁻ → 4OH⁻.', 'Overall: 2H₂ + O₂ → 2H₂O.'),
  short(C(3, 3), 'Explain rusting as an electrochemical process, naming the anode and cathode reactions.', 'At one part of the iron, the anode: Fe → Fe²⁺ + 2e⁻.', 'At another, the cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O.', 'Fe²⁺ is then oxidised by air to form hydrated Fe₂O₃, rust.'),
  short(A(2, 1), 'Name the electrode against which standard electrode potentials are measured, and state its conditions.', 'The standard hydrogen electrode, taken as 0 V.', 'Hydrogen at 1 bar over platinum black, in H⁺ ions at 1 mol L⁻¹, at 298 K.'),
];

export default questions;
