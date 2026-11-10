// Written by hand: electrostatics, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  match(A(3, 1), [['Electric field', 'N C⁻¹'], ['Electric flux', 'N m² C⁻¹'], ['Electric dipole moment', 'C m']]),
  match(A(4, 2), [['Field of a point charge', 'Falls as 1/r²'], ['Field of a short dipole, far away', 'Falls as 1/r³'], ['Field of a long charged wire', 'Falls as 1/r'], ['Field near a large charged sheet', 'Doesn’t depend on r']]),
  match(A(3, 2), [['Dipole in a uniform field, at an angle', 'Feels a torque but no net force'], ['Charge inside a closed surface', 'Fixes the flux through it'], ['Point charge q at the centre of a cube', 'Flux through each face is q/6ε₀']]),
  match(A(4, 3), [['Dipole along the field', 'Stable equilibrium'], ['Dipole against the field', 'Unstable equilibrium'], ['Dipole at right angles to the field', 'Greatest torque'], ['Dipole in a non-uniform field', 'Can feel a net force']]),
  match(A(3, 3), [['Field just outside a charged conductor', 'σ/ε₀'], ['Field near a large thin charged sheet', 'σ/2ε₀'], ['Field inside a charged conductor', 'Zero']]),
  match(B(3, 1), [['Capacitance', 'farad'], ['Electric potential', 'volt'], ['Permittivity', 'F m⁻¹']]),
  match(B(4, 2), [['Capacitors in series', '1/C = 1/C₁ + 1/C₂'], ['Capacitors in parallel', 'C = C₁ + C₂'], ['Energy stored in a capacitor', '½CV²'], ['Parallel-plate capacitor', 'ε₀A/d']]),
  match(B(3, 2), [['Potential of a point charge', 'kq/r'], ['Potential on the axis of a short dipole', 'kp/r²'], ['Potential on the equator of a dipole', 'Zero']]),
  match(B(4, 3), [['Dielectric slab put in, battery still joined', 'Charge rises'], ['Dielectric slab put in, battery taken away', 'Potential difference falls'], ['Plates moved apart, battery taken away', 'Energy stored rises'], ['Plates moved apart, battery still joined', 'Charge falls']]),
  match(B(3, 3), [['Equipotential surfaces of a point charge', 'Concentric spheres'], ['Equipotential surfaces in a uniform field', 'Parallel planes, at right angles to the field'], ['Work done moving a charge along an equipotential', 'Zero']]),
];

export default questions;
