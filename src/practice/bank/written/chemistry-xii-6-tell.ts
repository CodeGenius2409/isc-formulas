// Written by hand: haloalkanes, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('chemistry', 'XII');
const A = at(6, 'a');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between enantiomers and a racemic mixture.', 'Enantiomers are a pair of non-superimposable mirror-image molecules, each optically active.', 'A racemic mixture holds equal amounts of the two, so it is optically inactive.'),
  tell(A(2, 2), 'Distinguish between nucleophilic substitution and elimination in haloalkanes.', 'In substitution, a nucleophile replaces the halogen, as OH⁻ in water gives an alcohol.', 'In elimination, a base removes H and X from neighbouring carbons, as alcoholic KOH gives an alkene.'),
  tell(A(2, 2), 'Distinguish between dextrorotatory and laevorotatory compounds.', 'A dextrorotatory compound turns the plane of polarised light to the right, marked (+).', 'A laevorotatory compound turns it to the left, marked (−).'),
  tell(A(2, 3), 'Distinguish between a chiral and an achiral molecule, with an example of each.', 'A chiral molecule can’t be placed over its mirror image, as butan-2-ol can’t.', 'An achiral molecule can, as propan-2-ol can.'),
  tell(A(2, 3), 'Distinguish between a nucleophile and a leaving group in an SN2 reaction of a haloalkane.', 'The nucleophile is the electron-rich species that attacks carbon, such as OH⁻.', 'The leaving group is the halide that departs with the bonding pair, such as Br⁻.'),
];

export default questions;
