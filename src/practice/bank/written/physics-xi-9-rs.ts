// Written by hand: kinetic theory, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XI');
const A = at(9, 'a');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does a gas’s pressure rise when it is heated in a closed rigid tin?', 'Its molecules move faster, so they hit the walls harder and more often.'),
  reason(A(2, 2), 'Why do hydrogen molecules move faster than oxygen molecules at the same temperature?', 'Both have the same average kinetic energy, 3/2 kT.', 'Hydrogen’s molecules are lighter, so they must move faster.'),
  reason(A(2, 2), 'Why is C_P greater than C_V for a gas?', 'At constant pressure, the gas expands and does work as well.', 'So more heat is needed for the same rise in temperature.'),
  reason(A(2, 3), 'Why is γ smaller for a diatomic gas than for a monatomic one?', 'A diatomic molecule has 5 degrees of freedom at room temperature, rather than 3.', 'More of its heat goes into rotation, so C_V is larger and γ = 1 + 2/f is smaller.'),
  reason(A(1, 2), 'Why do molecules of a gas travel only a short way between collisions, though they move fast?', 'There are so many of them that each soon meets another: its mean free path is tiny.'),
  reason(A(2, 3), 'Why does a gas’s mean free path rise when its pressure falls?', 'Lower pressure, at the same temperature, means fewer molecules per unit volume.', 'So a molecule goes farther, on average, before it hits another.'),
  short(A(2, 1), 'State the ideal gas equation, and name each term.', 'PV = nRT.', 'P pressure, V volume, n the number of moles, R the gas constant, T the kelvin temperature.'),
  short(A(2, 2), 'State the law of equipartition of energy.', 'In equilibrium, energy is shared equally among all the degrees of freedom.', 'Each gets ½kT per molecule.'),
  short(A(3, 2), 'State three assumptions of the kinetic theory of gases.', 'The molecules are tiny compared with the gaps between them.', 'They move at random, and collide elastically.', 'They don’t attract each other, except during a collision.'),
  short(A(3, 3), 'Give the pressure of a gas from kinetic theory. Show how it links the average kinetic energy to the temperature.', 'P = ⅓ρc̄², where c̄² is the mean square speed.', 'With PV = RT for one mole, ⅓Mc̄² = RT.', 'So the average kinetic energy per molecule, ½mc̄², is 3/2 kT.'),
  short(A(2, 3), 'Give the rms speed of a gas’s molecules, and say what happens to it if the kelvin temperature is made four times as large.', 'c_rms = √(3RT/M).', 'It doubles.'),
  short(A(2, 2), 'What are the degrees of freedom of a molecule? Give the number for a monatomic and for a rigid diatomic gas.', 'The number of independent ways it can move and store energy.', 'Monatomic: 3. Diatomic: 5.'),
];

export default questions;
