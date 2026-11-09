// What the variety engine adds to a class. Its own file, so that the class's blueprints can load it when they're needed.
import type { ClassLevel, SubjectId } from '../../types';
import type { Blueprint } from '../types';
import { csBlueprints } from './cs';
import { varietyBlueprints } from './engine';
import { scenesFor } from './scenes';

export function varietyFor(subject: SubjectId, level: ClassLevel): Blueprint[] {
  if (subject === 'computerscience') return csBlueprints(level);
  // Reading its output showed the engine doesn't suit Mathematics: an AP with a first term of 4.5 "for a farmer", and
  // probabilities as 0.0888889. Variety in Mathematics is written by hand, with exact arithmetic, in the class's own file.
  if (subject === 'mathematics') return [];
  return varietyBlueprints(subject, level, scenesFor(subject, level));
}
