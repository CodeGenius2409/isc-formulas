// Written by hand: electrostatics, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  predict(A(2, 1), 'Two equal point charges repel each other with a force F. Predict the force if the distance between them is doubled and one charge is also doubled.', 'Doubling the distance makes the force a quarter, by the inverse square law.', 'Doubling one charge doubles it, so the force becomes F/2.'),
  predict(A(2, 2), 'A charge q is at the centre of a closed sphere. Predict what happens to the flux through the sphere if the sphere’s radius is doubled, and if a second charge is placed just outside it.', 'Neither changes it: by Gauss’s law the flux is q/ε₀, whatever the radius.', 'A charge outside sends in as much flux as it sends out, so it adds nothing.'),
  predict(A(2, 2), 'An electric dipole is placed in a uniform field, at an angle to it, and let go. Predict how it moves.', 'It feels no net force, so its centre doesn’t move off.', 'The torque turns it to line up with the field, and it swings about that line.'),
  predict(A(3, 3), 'A small positive test charge is let go from rest near a large positively charged plate. Predict its path, its speed and its acceleration as it moves away.', 'It moves straight away from the plate, along the field.', 'Its speed rises steadily.', 'Near a large plate the field is uniform, so its acceleration stays the same.'),
  predict(A(2, 3), 'A neutral metal sphere is brought near a positively charged rod, without touching. Predict what charges appear on it, and whether it is attracted.', 'Negative charge gathers on the near side, and positive charge on the far side.', 'The near charge is closer to the rod, so the attraction wins and the sphere is pulled towards it.'),
  predict(B(2, 1), 'A capacitor is charged by a battery, then disconnected, and its plates are pulled further apart. Predict what happens to its charge and its potential difference.', 'The charge stays the same, as it has nowhere to go.', 'The capacitance falls, so V = Q/C rises.'),
  predict(B(2, 2), 'A dielectric slab is put between the plates of a capacitor that stays joined to a battery. Predict what happens to its capacitance, charge and stored energy.', 'The capacitance rises by the factor K, and V stays fixed by the battery.', 'So the charge Q = CV rises by K, and the energy ½CV² rises by K too.'),
  predict(B(2, 2), 'A charge is carried round a closed path in an electrostatic field and back to its start. Predict the total work done.', 'Zero.', 'The electrostatic force is conservative, so the work depends only on the start and end, which are the same.'),
  predict(B(3, 3), 'Two identical capacitors, one charged to V and one uncharged, are joined in parallel. Predict the final voltage, and what happens to the total energy.', 'The charge shares equally, so each ends at V/2.', 'The energy before is ½CV², and after is 2 × ½C(V/2)² = ¼CV².', 'Half the energy is lost, as heat in the wires and as radiation.'),
  predict(B(2, 3), 'A hollow conducting sphere is given a charge. Predict the potential at its centre, compared with that at its surface.', 'The same as at the surface.', 'The field inside is zero, so no work is done in moving a charge from the surface to the centre.'),
];

export default questions;
