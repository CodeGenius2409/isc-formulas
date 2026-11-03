// Skeletal drawings from SMILES you type, on the phone itself. RDKit draws the book's own structures in the
// build, but it is 7 MB, so this one job goes to SmilesDrawer, which loads only when it is needed.

export interface ParsedMolecule {
  smiles: string;
  /** Hill-order molecular formula, for you to confirm. */
  formula: string;
  /** The drawing, as SVG markup in the page's text colour. */
  svg: string;
}

export interface ParsedStructure {
  reactants: ParsedMolecule[];
  products: ParsedMolecule[];
  isReaction: boolean;
}

const INK = 'currentColor';
const THEME: Record<string, string> = { C: INK, O: INK, N: INK, F: INK, CL: INK, BR: INK, I: INK, P: INK, S: INK, B: INK, SI: INK, H: INK, BACKGROUND: 'transparent' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let engine: Promise<any> | null = null;
const cache = new Map<string, ParsedMolecule>();

function load() {
  engine ??= import('smiles-drawer').then((m) => m.default ?? m);
  return engine;
}

export class SmilesProblem extends Error {}

/** Hill order: C, then H, then the rest by symbol. Atoms that aren't there are left out. */
function hillOrder(formula: string): string {
  const counts = new Map<string, number>();
  for (const [, el, n] of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) counts.set(el, (counts.get(el) ?? 0) + Number(n || 1));
  const rest = [...counts.keys()].filter((k) => k !== 'C' && k !== 'H').sort();
  const order = counts.has('C') ? ['C', ...(counts.has('H') ? ['H'] : []), ...rest] : [...counts.keys()].sort();
  return order.map((k) => `${k}${counts.get(k)! > 1 ? counts.get(k) : ''}`).join('');
}

async function draw(smiles: string): Promise<ParsedMolecule> {
  const hit = cache.get(smiles);
  if (hit) return hit;
  const SD = await load();
  const host = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // The drawer measures text, so it has to be in the page while it works.
  host.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:300px;height:220px');
  document.body.append(host);
  try {
    const tree = SD.Parser.parse(smiles, {});
    const drawer = new SD.SvgDrawer({ width: 300, height: 220, padding: 8, compactDrawing: false, themes: { ink: THEME } });
    drawer.draw(tree, host, 'ink');
    const parsed = { smiles, formula: hillOrder(drawer.getMolecularFormula()), svg: host.outerHTML.replace(/ style="[^"]*"/, '') };
    cache.set(smiles, parsed);
    return parsed;
  } catch (err) {
    const where = (err as { location?: { start?: { offset?: number } } }).location?.start?.offset;
    throw new SmilesProblem(where !== undefined ? `This SMILES can't be read at character ${where + 1} of "${smiles}".` : `"${smiles}" can't be read as SMILES.`);
  } finally {
    host.remove();
  }
}

/** Reads a compound, or a reaction written reactants>>products, with parts separated by dots. */
export async function parseStructure(source: string): Promise<ParsedStructure> {
  const text = source.trim();
  if (/\s/.test(text)) throw new SmilesProblem('SMILES has no spaces in it.');
  const sides = text.split('>>');
  if (sides.length > 2) throw new SmilesProblem('A reaction has one >>, between reactants and products.');
  const part = (side: string) => {
    const pieces = side.split('.');
    if (pieces.some((p) => !p)) throw new SmilesProblem(`Something is missing in "${side}". Each side needs compounds separated by a single dot.`);
    return Promise.all(pieces.map(draw));
  };
  if (sides.length === 2) {
    if (!sides[0] || !sides[1]) throw new SmilesProblem('A reaction needs compounds on both sides of the >>.');
    return { reactants: await part(sides[0]), products: await part(sides[1]), isReaction: true };
  }
  return { reactants: await part(sides[0]), products: [], isReaction: false };
}
