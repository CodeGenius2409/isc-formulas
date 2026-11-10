// Written by hand: haloalkanes, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('chemistry', 'XII');
const A = at(6, 'a');

const questions: BankDef[] = [
  ar(A(1, 1), 'Tertiary halides react faster than primary halides by SN1.', 'Tertiary carbocations are more stable than primary ones.', 1, 'SN1 goes through a carbocation, so a more stable one forms faster.'),
  ar(A(1, 2), 'An SN2 reaction of an optically active halide gives a racemic mixture.', 'In SN2, the nucleophile attacks from the side opposite the leaving group.', 4, 'Back-side attack inverts the configuration, giving one enantiomer, not a racemic mixture.'),
  ar(A(1, 2), 'Haloalkanes boil higher than alkanes of similar mass.', 'The C–X bond is polar.', 1, 'Dipole–dipole forces between molecules add to the van der Waals forces.'),
  ar(A(1, 3), 'Iodomethane reacts faster than fluoromethane with OH⁻.', 'Fluorine is more electronegative than iodine.', 2, 'Both are true, but iodomethane reacts faster because the C–I bond is much weaker, and I⁻ a better leaving group.'),
  ar(A(1, 3), 'Haloalkanes dissolve readily in water.', 'Haloalkanes are polar molecules.', 4, 'They are polar, but can’t form hydrogen bonds with water strong enough to break water’s own, so they barely dissolve.'),
];

export default questions;
