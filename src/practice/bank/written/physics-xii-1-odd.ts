// Written by hand: electrostatics, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  odd(A(2, 1), ['electric field', 'electric dipole moment', 'electric flux', 'force on a charge'], 'electric flux', 'It is a scalar; the others are vectors.'),
  odd(A(2, 2), ['N C⁻¹', 'V m⁻¹', 'N m² C⁻¹', 'kg m s⁻³ A⁻¹'], 'N m² C⁻¹', 'It is the unit of electric flux; the others are units of electric field.'),
  odd(A(2, 2), ['field of a point charge', 'field of a long charged wire', 'field near a large charged sheet', 'field of a charged thin shell, outside it'], 'field near a large charged sheet', 'It doesn’t depend on distance; the others fall as the distance grows.'),
  odd(A(2, 3), ['conservation of charge', 'quantisation of charge', 'additivity of charge', 'Coulomb’s law'], 'Coulomb’s law', 'It is a law of the force between charges; the others are properties of charge itself.'),
  odd(A(2, 2), ['conductor', 'electron', 'proton', 'alpha particle'], 'conductor', 'It is a material; the others are charged particles.'),
  odd(B(2, 1), ['farad', 'volt', 'coulomb per volt', 'C² N⁻¹ m⁻¹'], 'volt', 'It is the unit of potential; the others are units of capacitance.'),
  odd(B(2, 2), ['capacitance', 'electric potential', 'potential energy', 'electric field'], 'electric field', 'It is a vector; the others are scalars.'),
  odd(B(2, 2), ['mica', 'glass', 'paper', 'copper'], 'copper', 'It is a conductor, so it can’t be a capacitor’s dielectric; the others can.'),
  odd(B(2, 3), ['inside a charged conductor', 'on its surface', 'at its centre', 'just outside it'], 'just outside it', 'The potential there differs from the conductor’s; the other three are all at one potential.'),
  odd(B(2, 3), ['ε₀A/d', 'Q/V', '4πε₀R', '½QV'], '½QV', 'It gives the energy stored in a capacitor; the others give a capacitance.'),
];

export default questions;
