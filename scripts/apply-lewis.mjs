// Adds structures with lone pairs to Chemistry entries. Runs last in `npm run data`. The figures themselves
// are in src/data/lewis/figures.ts, and tests/unit/lewis.test.ts checks that every id here exists.
import fs from 'node:fs';
import path from 'node:path';

/** Entry id to the figures it shows. */
const LEWIS = {
  // Lewis structures and the octet rule
  'c-xi-4-10': ['methane', 'ammonia', 'water', 'hf'],
  'c-xi-4-11': ['becl2', 'bf3'],
  'c-xi-4-12': ['pcl5', 'sf6'],
  'c-xi-4-13': ['no', 'no2'],
  // Formal charge
  'c-xi-4-1': ['ammonium'],
  'c-xi-4-15': ['ammonium'],
  'c-xi-4-16': ['ozone'],
  'c-xi-4-17': ['hydroxide'],
  // Coordinate bonds
  'c-xi-4-69': ['ammonium-dative', 'nh3-bf3'],
  'c-xi-4-70': ['hydronium'],
  'c-xi-4-71': ['ozone-dative'],
  'c-xi-4-75': ['hno3'],
  // Resonance
  'c-xi-4-61': ['ozone'],
  'c-xi-4-62': ['carbonate'],
  'c-xi-4-63': ['nitrate'],
  'c-xi-4-152': ['carbonate'],
  'c-xi-4-153': ['co2-resonance'],
  'c-xi-4-154': ['carbonate'],
  'c-xi-4-155': ['nitrate'],
  'c-xi-4-156': ['ozone'],
  // Hydrogen bonding
  'c-xi-4-157': ['water-dimer'],
  'c-xi-4-159': ['hf-chain'],
  'c-xi-4-160': ['ethanol-water'],
  'c-xi-4-161': ['water-dimer'],
  // Polarity
  'c-xi-4-85': ['co2', 'bf3'],
  // VSEPR and hybridisation
  'c-xi-4-93': ['sulphate'],
  'c-xi-4-94': ['ammonium'],
  'c-xi-4-95': ['icl2'],
  'c-xi-4-100': ['becl2', 'co2'],
  'c-xi-4-101': ['bf3'],
  'c-xi-4-102': ['methane'],
  'c-xi-4-103': ['pcl5'],
  'c-xi-4-104': ['sf6'],
  'c-xi-4-106': ['so2', 'nitrite'],
  'c-xi-4-107': ['ammonia'],
  'c-xi-4-108': ['water'],
  'c-xi-4-109': ['sf4'],
  'c-xi-4-110': ['clf3'],
  'c-xi-4-111': ['i3'],
  'c-xi-4-112': ['brf5'],
  'c-xi-4-113': ['icl4'],
  'c-xi-4-115': ['methane', 'ammonia', 'water'],
  'c-xi-4-118': ['becl2', 'bf3', 'methane'],
  'c-xi-4-119': ['ammonia', 'water'],
  'c-xi-4-122': ['n2'],
  'c-xi-4-123': ['co2'],
  // Organic concepts
  'c-xi-10-20': ['fg-alcohol', 'fg-ether', 'fg-aldehyde', 'fg-ketone', 'fg-acid', 'fg-amine', 'fg-nitrile', 'fg-nitro'],
  'c-xi-10-44': ['ethanol', 'dimethyl-ether'],
  'c-xi-10-66': ['acetate'],
  'c-xi-10-72': ['benzene-resonance'],
  'c-xi-10-76': ['cl-radical'],
  'c-xi-10-77': ['tert-butyl-cation', 'chloride'],
  'c-xi-10-78': ['tert-butyl-cation', 'isopropyl-cation', 'ethyl-cation', 'methyl-cation'],
  'c-xi-10-79': ['allyl'],
  'c-xi-10-80': ['methyl-anion'],
  'c-xi-10-81': ['tert-butyl-radical', 'methyl-radical'],
  'c-xi-10-83': ['nitronium', 'bf3', 'alcl3', 'methyl-cation'],
  'c-xi-10-84': ['hydroxide', 'cyanide', 'ammonia', 'water'],
  // Ligands and complexes
  'c-xii-6-83': ['co-ammine'],
  'c-xii-6-91': ['ligand-ammonia', 'ligand-en'],
  'c-xii-6-92': ['ligand-scn', 'nitrite'],
  'c-xii-6-93': ['ligand-en'],
  'c-xii-6-95': ['chloride', 'cyanide', 'hydroxide', 'ligand-ox'],
  'c-xii-6-96': ['ligand-ammonia', 'ligand-water', 'ligand-co'],
  'c-xii-6-124': ['nitrite'],
  'c-xii-6-126': ['cisplatin', 'transplatin'],
  'c-xii-6-132': ['co-ammine'],
  'c-xii-6-133': ['fe-aqua'],
  'c-xii-6-134': ['ni-chloride'],
  'c-xii-6-135': ['ni-cyanide'],
  'c-xii-6-136': ['fe-cyanide'],
  'c-xii-6-137': ['fe-aqua'],
  'c-xii-6-138': ['co-ammine'],
  'c-xii-6-143': ['cu-ammine'],
  'c-xii-6-144': ['zn-ammine'],
  'c-xii-6-145': ['ag-ammine'],
  'c-xii-6-172': ['ligand-en'],
  // Lone pairs that decide basicity and boiling points
  'c-xii-9-4': ['methylamine'],
  'c-xii-9-6': ['methylamine', 'dimethylamine', 'trimethylamine'],
  'c-xii-9-9': ['methylamine', 'aniline-pair'],
  'c-xii-7-107': ['methanol'],
  'c-xii-8-115': ['acetate'],
};

/** Entries that only need plain skeletal structures, from those already verified. */
const SKELETAL = {
  'c-xi-10-42': ['butane', 'isobutane'],
  'c-xi-10-43': ['propan-1-ol', 'propan-2-ol'],
};

const generated = path.resolve('src/data/generated');
const read = (name) => JSON.parse(fs.readFileSync(path.join(generated, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(generated, name), JSON.stringify(value));

const compounds = read('structures.json');
for (const keys of Object.values(SKELETAL)) {
  for (const key of keys) if (!compounds[key]) throw new Error(`apply-lewis: no verified compound ${key}`);
}

const shared = read('shared.json');
const done = new Set();
const update = (entry) => {
  if (LEWIS[entry.id]) {
    entry.lewis = LEWIS[entry.id];
    done.add(entry.id);
  }
  if (SKELETAL[entry.id] && !entry.structure) {
    entry.structure = { list: SKELETAL[entry.id] };
    done.add(entry.id);
  }
};
Object.values(shared).forEach(update);
write('shared.json', shared);
for (const file of ['chemistry-XI.json', 'chemistry-XII.json']) {
  const chunk = read(file);
  for (const unit of chunk.units) {
    for (const sub of unit.subtopics) {
      for (const item of sub.items) if (!item.ref) update(item);
    }
  }
  write(file, chunk);
}
const missing = [...Object.keys(LEWIS), ...Object.keys(SKELETAL)].filter((id) => !done.has(id));
if (missing.length) throw new Error(`apply-lewis: no such entries: ${missing.join(', ')}`);
console.log(`apply-lewis: ${done.size} entries given structures.`);
