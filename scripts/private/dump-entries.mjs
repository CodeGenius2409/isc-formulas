// Writes every stored entry, with where it sits, to data-private/all-entries.json.
import { readFileSync, writeFileSync } from 'node:fs';

const G = 'src/data/generated';
const shared = JSON.parse(readFileSync(`${G}/shared.json`, 'utf8'));
const out = [];
for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience']) {
  for (const level of ['XI', 'XII']) {
    const chunk = JSON.parse(readFileSync(`${G}/${subject}-${level}.json`, 'utf8'));
    for (const unit of chunk.units) {
      for (const sub of unit.subtopics) {
        for (const item of sub.items) {
          const entry = item.ref ? shared[item.ref] : item;
          out.push({ id: entry.id, name: entry.name, latex: entry.latex, note: entry.note ?? '', subject, level, unit: unit.name, subtopic: sub.name, shared: Boolean(item.ref) });
        }
      }
    }
  }
}
writeFileSync('data-private/all-entries.json', JSON.stringify(out));
console.log(out.length, 'rows', new Set(out.map((e) => e.id)).size, 'unique');
