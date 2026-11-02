// Adds bond-line structures to Chemistry. Runs after apply-cs-code.mjs.
//
// RDKit checks and draws every structure here, in the build. The app ships the finished SVG paths,
// so a phone never has to load a 6 MB chemistry engine to show a benzene ring. See DECISIONS.md.
import fs from 'node:fs';
import path from 'node:path';
import initRDKitModule from '@rdkit/rdkit';
import { BY_NAME, COMPOUNDS, DRAWN_COVALENT, EXAMPLES, GROUPS, INORGANIC_CARBON } from './structures/compounds.mjs';
import { readReactions, atomsOfCondensed, cleanSpecies } from './structures/reactions.mjs';

const OFFLINE = process.argv.includes('--offline');
const generated = path.resolve('src/data/generated');
const cachePath = path.resolve('scripts/structures/pubchem-cache.json');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(generated, name), 'utf8'));
const writeJson = (name, value) => fs.writeFileSync(path.join(generated, name), JSON.stringify(value));

const RDKit = await initRDKitModule();
RDKit.prefer_coordgen(true);
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
const failures = [];

/** Counts atoms from the molecule's explicit-hydrogen form. */
function atomsOfMol(mol) {
  const block = mol.add_hs().split('\n');
  const count = Number(block[3].slice(0, 3));
  const atoms = {};
  for (let i = 4; i < 4 + count; i++) {
    const symbol = block[i].slice(31, 34).trim();
    atoms[symbol] = (atoms[symbol] ?? 0) + 1;
  }
  return atoms;
}

function hill(atoms) {
  const keys = Object.keys(atoms).sort((a, b) => (a === 'C' ? -1 : b === 'C' ? 1 : a === 'H' ? -1 : b === 'H' ? 1 : a.localeCompare(b)));
  return keys.map((k) => `${k}${atoms[k] > 1 ? atoms[k] : ''}`).join('');
}

const sameAtoms = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

/** Turns RDKit's SVG into two compact paths, one stroked and one filled, in the page's own colour. */
function compactSvg(svg) {
  const view = /viewBox='0 0 (\d+) (\d+)'/.exec(svg);
  const lines = [];
  const fills = [];
  // Bonds carry style='fill:none...'. Atom labels are drawn as glyph outlines with a fill attribute.
  for (const m of svg.matchAll(/<path\b[^>]*>/g)) {
    const tag = m[0];
    const d = /\bd='([^']*)'/.exec(tag)?.[1]?.replace(/\s+/g, ' ').replace(/ ?([MLQCZ]) ?/g, '$1').trim();
    if (!d) continue;
    if (/fill:none/.test(tag)) lines.push(d);
    else fills.push(d);
  }
  return { w: Number(view[1]), h: Number(view[2]), l: lines.join(''), f: fills.join('') };
}

async function pubchem(name) {
  if (cache[name]) return cache[name];
  if (OFFLINE) return null;
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/InChIKey,MolecularFormula,MolecularWeight,IUPACName/JSON`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url);
      if (response.status === 404) return (cache[name] = { notFound: true });
      if (response.ok) {
        const row = (await response.json()).PropertyTable.Properties[0];
        return (cache[name] = { cid: row.CID, key: row.InChIKey, formula: row.MolecularFormula, weight: Number(row.MolecularWeight), iupac: row.IUPACName });
      }
    } catch {
      // Try again below.
    }
    await new Promise((done) => setTimeout(done, 700 * (attempt + 1)));
  }
  return null;
}

const compounds = {};
const report = [];
const lookup = new Map();
const groupQueries = GROUPS.map(([name, smarts]) => [name, RDKit.get_qmol(smarts)]);

for (const [key, name, pubchemName, smiles, forms] of COMPOUNDS) {
  const mol = RDKit.get_mol(smiles);
  if (!mol || !mol.is_valid()) {
    failures.push(`${key}: the SMILES does not parse: ${smiles}`);
    continue;
  }
  const atoms = atomsOfMol(mol);
  const formula = hill(atoms);
  const mass = JSON.parse(mol.get_descriptors()).amw;
  const key14 = RDKit.get_inchikey_for_inchi(mol.get_inchi());

  // 1. The written forms in the data have to have the same atoms as this SMILES.
  for (const form of forms) {
    const counted = atomsOfCondensed(form);
    if (!/[a-z]{4}/.test(form.replace(/\(.*\)$/, '')) && counted && !sameAtoms(counted, atoms)) failures.push(`${key}: ${form} has ${hill(counted)}, but the SMILES has ${formula}`);
    if (lookup.has(form) && lookup.get(form) !== key) failures.push(`${form} is claimed by both ${lookup.get(form)} and ${key}`);
    lookup.set(form, key);
  }

  // 2. PubChem has to agree that this name is this structure.
  const queried = pubchemName ?? name;
  const found = await pubchem(queried);
  let check = 'not checked';
  if (found && !found.notFound) {
    const skeleton = found.key.slice(0, 14) === key14.slice(0, 14);
    if (found.key === key14) check = 'exact';
    else if (skeleton) check = 'same skeleton';
    else if (found.formula.replace(/[+-]\d*$/, '') !== formula) failures.push(`${key}: PubChem's ${queried} is ${found.formula}, but the SMILES is ${formula}`);
    else if (DRAWN_COVALENT.has(key)) check = 'drawn covalent';
    else check = 'mismatch';
    if (check === 'mismatch') failures.push(`${key}: PubChem's ${queried} has InChIKey ${found.key}, but the SMILES gives ${key14}`);
    if (Math.abs(found.weight - mass) > 0.1) failures.push(`${key}: PubChem's mass is ${found.weight}, but the SMILES gives ${mass.toFixed(2)}`);
  } else if (found?.notFound) {
    check = 'name not found';
  }

  const groups = groupQueries.filter(([, q]) => JSON.parse(mol.get_substruct_match(q)).atoms !== undefined).map(([g]) => g);
  const svg = mol.get_svg_with_highlights(
    JSON.stringify({ width: -1, height: -1, fixedBondLength: 28, bondLineWidth: 1.6, clearBackground: false, padding: 0.03, minFontSize: 11, maxFontSize: 13, addStereoAnnotation: false, useMolBlockWedging: false }),
  );
  const drawing = compactSvg(svg);
  // 3. A hetero atom has to be labelled. Without its label the drawing is a different compound.
  const hetero = Object.keys(atoms).filter((a) => a !== 'C' && a !== 'H').length;
  if (hetero && !drawing.f) failures.push(`${key}: has ${formula}, but its drawing has no atom labels`);
  const labels = (svg.match(/<path\b[^>]*class='atom-\d+'/g) ?? []).length;
  if (hetero && labels < hetero) failures.push(`${key}: has ${hetero} kinds of hetero atom, but ${labels} labels were drawn`);
  compounds[key] = { n: name, m: formula, a: Number(mass.toFixed(2)), s: smiles, g: groups, ...drawing };
  report.push({ key, name, formula, mass: mass.toFixed(2), smiles, queried, check, cid: found?.cid, iupac: found?.iupac, pubchemKey: found?.key, key14 });
  mol.delete();
  if (!OFFLINE && !cache[queried]?.key) await new Promise((done) => setTimeout(done, 230));
}
if (!OFFLINE) fs.writeFileSync(cachePath, JSON.stringify(cache, null, 1));

// ---- Attach to entries ----------------------------------------------------------------------
const UNITS = { XI: [8, 9], XII: [6, 7, 8, 9, 10] };
const exampleFor = new Map(EXAMPLES);
const namesFor = new Map(BY_NAME);
const unresolved = new Map();
const shared = readJson('shared.json');
const manifest = readJson('manifest.json');
const chemistry = manifest.subjects.find((s) => s.id === 'chemistry');
const touchedShared = new Set();

/** Turns a species into a token: a structure if it has one, words if it has no carbon. */
function resolveSpecies(raw) {
  const { species, count } = cleanSpecies(raw);
  if (!species) return null;
  // o/p- written together means both isomers.
  const both = /^o\/p-(.*)$/.exec(species);
  if (both) {
    const pair = [`o-${both[1]}`, `p-${both[1]}`].map((s) => lookup.get(s));
    if (pair.every(Boolean)) return [{ s: pair[0], c: count }, { op: 1 }, { s: pair[1] }];
    return { missing: species };
  }
  const key = lookup.get(species);
  if (key) return [{ s: key, c: count }];
  if (INORGANIC_CARBON.has(species) || !/C(?![a-z])/.test(species)) return [{ t: species, c: count }];
  return { missing: species };
}

/** A reaction becomes rows of tokens. Null if any carbon compound in it can't be drawn. */
function schemeOf(reactions) {
  const rows = [];
  let drawn = 0;
  for (const chain of reactions) {
    const row = [];
    for (let i = 0; i < chain.length; i++) {
      const part = chain[i];
      if (part.arrow !== undefined) {
        row.push({ r: part.arrow, ...(part.both ? { b: 1 } : {}) });
        continue;
      }
      const pieces = [];
      for (const raw of part.species) {
        const token = resolveSpecies(raw);
        if (!token) continue;
        if (token.missing) {
          unresolved.set(token.missing, (unresolved.get(token.missing) ?? 0) + 1);
          return null;
        }
        if (pieces.length) pieces.push({ op: 1 });
        pieces.push(...token);
        drawn += token.filter((t) => t.s).length;
      }
      row.push(...pieces);
    }
    rows.push(row);
  }
  return drawn ? rows : null;
}

let withStructure = 0;
let exampleCount = 0;
const used = new Set();
const entryLog = [];
const SKIP_NAMES = /\b(?:combustion|percentage|test for carbon|lassaigne|kjeldahl|carius|hydrocarbon$)\b/i;

function structureFor(entry) {
  if (namesFor.has(entry.id)) return { list: namesFor.get(entry.id) };
  if (SKIP_NAMES.test(entry.name)) return null;
  if (exampleFor.has(entry.id)) {
    const rows = schemeOf(readReactions(exampleFor.get(entry.id), true));
    if (!rows) failures.push(`${entry.id}: the example has a compound with no structure: ${exampleFor.get(entry.id)}`);
    else exampleCount++;
    return rows && { rows, example: 1 };
  }
  const reactions = readReactions(entry.latex);
  if (reactions.length) {
    const rows = schemeOf(reactions);
    return rows && { rows };
  }
  // No arrow: a formula or a list of isomers.
  const parts = entry.latex
    .replace(/\\text\{[^}]*\}/g, ' and ')
    .replace(/\\(?:quad|qquad|,|;| )/g, ' ')
    .split(/\band\b|;|,(?![0-9])|:/)
    .map((p) => cleanSpecies(p.replace(/[_{}]/g, '')).species)
    .filter(Boolean);
  const keys = parts.map((p) => lookup.get(p)).filter(Boolean);
  return keys.length ? { list: [...new Set(keys)] } : null;
}

for (const cls of chemistry.classes) {
  const chunk = readJson(cls.chunk);
  for (const unit of chunk.units) {
    if (!UNITS[cls.level].includes(unit.number)) continue;
    for (const sub of unit.subtopics) {
      for (const item of sub.items) {
        const entry = item.ref ? shared[item.ref] : item;
        if (item.ref && touchedShared.has(item.ref)) continue;
        if (item.ref) touchedShared.add(item.ref);
        const structure = structureFor(entry);
        if (!structure) continue;
        entry.structure = structure;
        withStructure++;
        const keys = structure.list ?? structure.rows.flat().flatMap((t) => (t.s ? [t.s] : []));
        keys.forEach((k) => used.add(k));
        entryLog.push({ id: entry.id, name: entry.name, keys, example: Boolean(structure.example) });
      }
    }
  }
  writeJson(cls.chunk, chunk);
}
writeJson('shared.json', shared);

// A name PubChem does not know, and any disagreement, is for a person to look at. Nothing is shipped unchecked.
for (const r of report) if (used.has(r.key) && r.check === 'not checked' && !OFFLINE) failures.push(`${r.key}: PubChem could not be reached to check this`);

// Only what is used ships.
const shipped = Object.fromEntries(Object.entries(compounds).filter(([k]) => used.has(k)));
writeJson('structures.json', shipped);

// ---- Report ----------------------------------------------------------------------------------
const counts = { exact: 0, 'same skeleton': 0, 'drawn covalent': 0, 'name not found': 0, 'not checked': 0 };
for (const r of report) counts[r.check]++;
const rowsOf = (list) => list.map((r) => `| ${r.name} | ${r.formula} | ${r.mass} | \`${r.smiles}\` | ${r.queried}${r.cid ? ` ([CID ${r.cid}](https://pubchem.ncbi.nlm.nih.gov/compound/${r.cid}))` : ''} | ${r.check} |`).join('\n');
const needsLook = report.filter((r) => r.check !== 'exact');
fs.writeFileSync(
  path.resolve('reports/structures-report.md'),
  `# Structures report

Every structure in the app is drawn from a SMILES string by RDKit ${RDKit.version()}, in the build. None is drawn by hand. The build fails if any of these checks fails.

1. The SMILES parses in RDKit.
2. Its molecular formula, worked out from the SMILES, matches every condensed formula in the data that points at it. A mis-mapped compound stops the build here.
3. Its InChIKey matches the one [PubChem](https://pubchem.ncbi.nlm.nih.gov/) gives for that compound's name, and PubChem's molecular weight is within 0.1 of the SMILES.

Date checked: ${new Date().toISOString().slice(0, 10)}. PubChem's answers are kept in \`scripts/structures/pubchem-cache.json\`.

## Result

- Compounds in the dictionary: ${report.length}, of which ${Object.keys(shipped).length} are used and shipped.
- Exact match with PubChem, including stereochemistry: **${counts.exact}**
- Same connectivity as PubChem, stereochemistry differs or is unspecified: **${counts['same skeleton']}** (listed below)
- Same formula and mass, drawn with a covalent metal bond as taught, where PubChem stores it as ionic: **${counts['drawn covalent']}** (listed below)
- PubChem did not recognise the name: **${counts['name not found']}** (listed below)
- Could not reach PubChem: **${counts['not checked']}**
- Chemistry entries given a structure: **${withStructure}**, of which ${exampleCount} show a worked example for a reaction written with R.

## Not an exact match: please look at these

${needsLook.length ? `| Compound | Formula | Mass | SMILES | PubChem name | Result |\n|---|---|---|---|---|---|\n${rowsOf(needsLook)}` : 'None.'}

"Same skeleton" means the atoms and bonds agree, and only the stereo layer differs: usually because PubChem's record for that name leaves a centre or a double bond unspecified, or describes a different form of the same sugar.

## Scope

From the syllabus map, structures are given to the organic units: Class XI Unit 8 (basic principles, isomerism) and Unit 9 (hydrocarbons), and Class XII Units 6 to 10 (haloalkanes and haloarenes; alcohols, phenols and ethers; aldehydes, ketones and carboxylic acids; nitrogen compounds; biomolecules).

**Inorganic and coordination compounds have none.** The syllabus asks for Lewis structures and shapes in bonding, and for isomerism and shapes in coordination compounds. A bond-line drawing from SMILES can't show a VSEPR shape or an octahedral complex faithfully, and a wrong structure is worse than none. K2Cr2O7 and KMnO4 are listed for "preparation and properties" only.

**What is left out on purpose.** Generic entries written only with R or Ar and no example (a general formula has no one structure). Combustion and elemental analysis, where the structure adds nothing. Polymers. Any reaction with a carbon compound that has no verified structure here: drawing only half of a reaction would mislead, so the whole entry stays as text. Any molecular formula that fits more than one compound, such as C4H10, unless the entry says which it means.

## All compounds

| Compound | Formula | Mass | SMILES | PubChem name | Result |
|---|---|---|---|---|---|
${rowsOf(report)}
`,
);

const log = `Structures: ${report.length} compounds checked (${counts.exact} exact, ${counts['same skeleton']} same skeleton, ${counts['name not found']} name not found, ${counts['not checked']} not checked), ${withStructure} entries drawn`;
console.log(log);
if (process.argv.includes('--coverage')) {
  console.log([...unresolved].sort((a, b) => b[1] - a[1]).slice(0, 90).map(([s, n]) => `${n} ${s}`).join('  |  '));
}
if (failures.length) {
  console.error(`\n${failures.length} structures failed their checks:\n${failures.join('\n')}`);
  process.exit(1);
}
