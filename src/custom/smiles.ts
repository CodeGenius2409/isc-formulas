// Skeletal drawings from SMILES you type, on the phone itself. RDKit draws the book's own structures in the
// build, but it is 7 MB, so this one job goes to SmilesDrawer, which loads only when it is needed.
import { loadOnce } from '../lib/retry-import';
import { readSmiles, SmilesMistake, type ReadMolecule, type ReadStructure } from './smiles-read';

export interface ParsedMolecule {
  smiles: string;
  /** Hill-order molecular formula, for you to confirm. */
  formula: string;
  /** The drawing, as SVG markup in the page's text colour. */
  svg: string;
  /** The drawing's coordinate system, and each atom's place in it, in the order the atoms are written. */
  viewBox: string;
  points: ({ x: number; y: number } | null)[];
}

export interface ParsedStructure {
  reactants: ParsedMolecule[];
  products: ParsedMolecule[];
  isReaction: boolean;
}

const INK = 'currentColor';
const THEME: Record<string, string> = { C: INK, O: INK, N: INK, F: INK, CL: INK, BR: INK, I: INK, P: INK, S: INK, B: INK, SI: INK, H: INK, BACKGROUND: 'transparent' };

const cache = new Map<string, ParsedMolecule>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const load = loadOnce<any>(() => import('smiles-drawer').then((m) => m.default ?? m));

export { SmilesMistake as SmilesProblem };

/** The drawing engine itself didn't load. Nothing is wrong with what was typed. */
export class SmilesEngineUnavailable extends Error {}

async function draw(molecule: ReadMolecule): Promise<ParsedMolecule> {
  const smiles = molecule.text;
  const hit = cache.get(smiles);
  if (hit) return hit;
  const SD = await load().catch((err) => {
    throw new SmilesEngineUnavailable(String(err));
  });
  const host = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // The drawer measures text, so it has to be in the page while it works.
  host.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:300px;height:220px');
  document.body.append(host);
  try {
    const tree = SD.Parser.parse(smiles, {});
    const drawer = new SD.SvgDrawer({ width: 300, height: 220, padding: 8, compactDrawing: false, themes: { ink: THEME } });
    drawer.draw(tree, host, 'ink');
    // The drawer's atoms come in the written order, plus extra hydrogens it adds for stereo centres.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vertices = (drawer.preprocessor.graph.vertices as any[]).filter((v) => !(v.value.element === 'H' && !v.value.bracket));
    const points = vertices.length === molecule.atoms.length ? vertices.map((v) => (v.value.isDrawn === false ? null : { x: v.position.x as number, y: v.position.y as number })) : [];
    const parsed = { smiles, formula: molecule.formula, svg: host.outerHTML.replace(/ style="[^"]*"/, ''), viewBox: host.getAttribute('viewBox') ?? '0 0 300 220', points };
    cache.set(smiles, parsed);
    return parsed;
  } catch (err) {
    if (err instanceof SmilesEngineUnavailable) throw err;
    throw new SmilesMistake(`"${smiles}" can't be drawn, though it reads correctly. Try writing it another way.`, molecule.start, molecule.end);
  } finally {
    host.remove();
  }
}

/** Reads a compound, or a reaction written reactants>>products, with parts separated by dots. */
export async function parseStructure(source: string): Promise<ParsedStructure & { read: ReadStructure }> {
  const read = readSmiles(source.trim());
  return { read, reactants: await Promise.all(read.reactants.map(draw)), products: await Promise.all(read.products.map(draw)), isReaction: read.isReaction };
}
