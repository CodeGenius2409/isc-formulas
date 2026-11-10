// Written by hand: three-dimensional geometry, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('mathematics', 'XII');
const G = at(5, 'a');

const questions: BankDef[] = [
  ar(G(1, 1), '$1, 1, 1$ can be the direction cosines of a line.', 'The squares of a line’s direction cosines add up to 1.', 4, '$1 + 1 + 1 = 3$, not 1, so they can’t be.'),
  ar(G(1, 2), 'The planes $x + y + z = 1$ and $2x + 2y + 2z = 3$ are parallel.', 'Their normals are parallel.', 1, 'Both normals lie along $(1, 1, 1)$.'),
  ar(G(1, 2), 'Two skew lines lie in the same plane.', 'Skew lines are neither parallel nor intersecting.', 4, 'Being neither parallel nor meeting, they can’t lie in one plane.'),
  ar(G(1, 3), 'The shortest distance between two intersecting lines is zero.', 'The shortest distance is measured along the common perpendicular.', 2, 'Both are true, but the distance is zero because the lines meet, not because of how it is measured.'),
  ar(G(1, 3), 'The angle between a line and a plane is the angle between the line and the plane’s normal.', 'A plane’s normal is at right angles to every line in the plane.', 4, 'The angle with the plane is $90°$ minus the angle with the normal.'),
];

export default questions;
