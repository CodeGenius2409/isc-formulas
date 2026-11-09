// What the variety engine adds to a class. Its own file, so that the class's blueprints can load it when they're needed.
import type { ClassLevel, SubjectId } from '../../types';
import type { Blueprint } from '../types';
import { csBlueprints } from './cs';
import { varietyBlueprints } from './engine';
import { scenesFor } from './scenes';

export function varietyFor(subject: SubjectId, level: ClassLevel): Blueprint[] {
  if (subject === 'computerscience') return csBlueprints(level);
  return varietyBlueprints(subject, level, scenesFor(subject, level));
}
