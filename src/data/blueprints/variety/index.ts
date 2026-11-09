// What the variety engine adds to a class. Its own file, so that the class's blueprints can load it when they're needed.
import type { ClassLevel, SubjectId } from '../../types';
import type { Blueprint } from '../types';
import { crossBlueprints } from './cross';
import { csBlueprints } from './cs';
import { varietyBlueprints } from './engine';
import { mathsBlueprints } from './maths';
import { scenesFor } from './scenes';

export function varietyFor(subject: SubjectId, level: ClassLevel): Blueprint[] {
  const cross = crossBlueprints(subject, level);
  if (subject === 'computerscience') return [...csBlueprints(level), ...cross];
  // Reading its output showed the engine doesn't suit Mathematics: an AP with a first term of 4.5 "for a farmer", and
  // probabilities as 0.0888889. Variety in Mathematics is written by hand, with exact arithmetic.
  if (subject === 'mathematics') return [...mathsBlueprints(level), ...cross];
  return [...varietyBlueprints(subject, level, scenesFor(subject, level)), ...cross];
}
