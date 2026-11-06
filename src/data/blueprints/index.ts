// Loads a class's blueprints on first need. Each subject and class is its own file, so a phone only fetches what's used.
import { generatedQuestion, parseGeneratedId, placeOfBlueprint, type Names } from '../../practice/gen/engine';
import type { BankQuestion } from '../../practice/bank/types';
import { loadOnce } from '../../lib/retry-import';
import { loadSyllabus } from '../syllabus';
import type { ClassLevel, SubjectId } from '../types';
import type { Blueprint, Reviews } from './types';

type BlueprintFile = () => Promise<{ default: Blueprint[] }>;
type ReviewFile = () => Promise<{ default: Reviews }>;
const files: Record<string, BlueprintFile> = {
  'physics-xi': () => import('./physics-xi'),
  'physics-xii': () => import('./physics-xii'),
  'chemistry-xi': () => import('./chemistry-xi'),
  'chemistry-xii': () => import('./chemistry-xii'),
  'mathematics-xi': () => import('./mathematics-xi'),
  'mathematics-xii': () => import('./mathematics-xii'),
  'computerscience-xi': () => import('./computerscience-xi'),
  'computerscience-xii': () => import('./computerscience-xii'),
};

const reviewFiles: Record<string, ReviewFile> = {
  'physics-xi': () => import('./reviews/physics-xi'),
  'physics-xii': () => import('./reviews/physics-xii'),
  'chemistry-xi': () => import('./reviews/chemistry-xi'),
  'chemistry-xii': () => import('./reviews/chemistry-xii'),
  'mathematics-xi': () => import('./reviews/mathematics-xi'),
  'mathematics-xii': () => import('./reviews/mathematics-xii'),
  'computerscience-xi': () => import('./reviews/computerscience-xi'),
  'computerscience-xii': () => import('./reviews/computerscience-xii'),
};

/** Marks each blueprint reviewed or not, from its class's review file. A flagged one counts as not reviewed. */
export function applyReviews(blueprints: Blueprint[], reviews: Reviews): void {
  for (const bp of blueprints) {
    const row = reviews[bp.id];
    bp.reviewed = Boolean(row && !row[2]);
    bp.review = row ? { date: row[0], note: row[1] } : undefined;
    bp.flag = row?.[2];
  }
}

export interface LoadedBlueprints {
  blueprints: Blueprint[];
  byId: Map<string, Blueprint>;
  names: (bp: Blueprint) => Names;
}

const loaded = new Map<string, () => Promise<LoadedBlueprints>>();

export function loadBlueprints(subject: SubjectId, level: ClassLevel): Promise<LoadedBlueprints> {
  const key = `${subject}-${level.toLowerCase()}`;
  let loader = loaded.get(key);
  if (!loader) {
    loader = loadOnce(async () => {
      const [module, reviews, syllabus] = await Promise.all([files[key](), reviewFiles[key](), loadSyllabus(subject)]);
      applyReviews(module.default, reviews.default);
      const names = new Map<string, string>();
      for (const unit of syllabus.classes.find((c) => c.level === level)?.units ?? []) {
        names.set(String(unit.number), unit.name);
        for (const topic of unit.topics) names.set(`${unit.number} ${topic.key}`, topic.name);
      }
      return {
        blueprints: module.default,
        byId: new Map(module.default.map((bp) => [bp.id, bp])),
        names: (bp: Blueprint) => ({ unitName: names.get(String(bp.unit)) ?? '', topicName: names.get(`${bp.unit} ${bp.topic}`) ?? '' }),
      };
    });
    loaded.set(key, loader);
  }
  return loader();
}

/** Rebuilds a generated question from its id. Null once its blueprint has gone from the app. */
export async function generatedQuestionForId(id: string): Promise<BankQuestion | null> {
  const parsed = parseGeneratedId(id);
  const place = parsed && placeOfBlueprint(parsed.blueprint);
  if (!parsed || !place) return null;
  const set = await loadBlueprints(place.subject, place.level);
  const bp = set.byId.get(parsed.blueprint);
  return bp ? generatedQuestion(bp, parsed.seed, set.names(bp)) : null;
}
