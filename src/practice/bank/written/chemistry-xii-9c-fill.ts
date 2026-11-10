// Written by hand: diazonium salts, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const D = at(9, 'c');

/** Benzenediazonium chloride at the top, with three products below it, named as given. */
const branches = (p: string, q: string, r: string) => [
  label(160, 22, 'C₆H₅N₂⁺Cl⁻'),
  arrow([140, 32], [64, 110]), label(92, 66, 'H₂O, warm', 'end'),
  arrow([160, 32], [160, 110]), label(166, 74, 'KI', 'start'),
  arrow([180, 32], [256, 110]), label(226, 66, 'H₃PO₂, H₂O', 'start'),
  label(55, 128, p), label(160, 128, q), label(265, 128, r),
];

/** 4-Methylaniline to 4-chlorobenzoic acid, top to bottom, with the three products named as given. */
const route = (a: string, b: string, c: string) => [
  label(120, 20, '4-methylaniline'),
  arrow([120, 28], [120, 58]), label(134, 47, 'HNO₂, 273–278 K', 'start'),
  label(120, 74, a),
  arrow([120, 82], [120, 112]), label(134, 101, 'CuCl, HCl', 'start'),
  label(120, 128, b),
  arrow([120, 136], [120, 166]), label(134, 155, 'KMnO₄, KOH, heat; then H₃O⁺', 'start'),
  label(120, 182, c),
];

const ring = (cx: number, cy: number) => [
  { t: 'path' as const, d: `M${cx + 28} ${cy} L${cx + 14} ${cy + 24} L${cx - 14} ${cy + 24} L${cx - 28} ${cy} L${cx - 14} ${cy - 24} L${cx + 14} ${cy - 24} Z` },
  { t: 'circle' as const, x: cx, y: cy, r: 15 },
];

const questions: BankDef[] = [
  figure(D(3, 1), 'The figure shows three reactions of benzenediazonium chloride. Name P, Q and R, and say which reaction puts a hydrogen atom in place of the diazonium group.', ['P is phenol.', 'Q is iodobenzene.', 'R is benzene: hypophosphorous acid, H₃PO₂, replaces the −N₂⁺ group by H.'], {
    shown: sketch(320, 145, 'Benzenediazonium chloride at the top, with three arrows going down. Warmed with water it gives P. With potassium iodide it gives Q. With hypophosphorous acid and water it gives R.', branches('P', 'Q', 'R')),
    answer: sketch(320, 145, 'The same three reactions with the products named: phenol, iodobenzene and benzene.', branches('phenol', 'iodobenzene', 'benzene')),
  }),
  figure(D(2, 2), 'Draw the structure of the dye formed when benzenediazonium chloride couples with phenol in mild alkali, and mark the azo group.', ['Two benzene rings are joined by the azo group, −N=N−.', 'The OH group is on the second ring, para to the azo group: p-hydroxyazobenzene, an orange dye.'], {
    answer: sketch(290, 140, 'A benzene ring on the left joined by a bond to N=N, which is joined by a bond to a second benzene ring. The second ring carries an OH group on the side away from the azo group. An arrow points to N=N, labelled azo group.', [
      ...ring(70, 80), line([[98, 80], [118, 80]]), label(138, 84, 'N=N'), line([[158, 80], [178, 80]]), ...ring(206, 80),
      line([[234, 80], [252, 80]]), label(256, 84, 'OH', 'start'),
      line([[138, 118], [138, 92]], { arrow: 1 }), label(138, 132, 'azo group'),
    ]),
  }),
  figure(D(3, 3), 'The figure shows a route from 4-methylaniline. Name A, B and C, and the reaction that makes B.', ['A is 4-methylbenzenediazonium chloride, from diazotisation.', 'B is 4-chlorotoluene, made by the Sandmeyer reaction.', 'C is 4-chlorobenzoic acid, as KMnO₄ oxidises the methyl group to −COOH.'], {
    shown: sketch(340, 195, 'A route from top to bottom. 4-Methylaniline, with sodium nitrite and hydrochloric acid at 273 to 278 K, gives A. A, with copper(I) chloride and hydrochloric acid, gives B. B, heated with alkaline potassium permanganate and then acidified, gives C.', route('A', 'B', 'C')),
    answer: sketch(340, 195, 'The same route with the products named: 4-methylbenzenediazonium chloride, then 4-chlorotoluene, then 4-chlorobenzoic acid.', route('4-methylbenzenediazonium chloride', '4-chlorotoluene', '4-chlorobenzoic acid')),
  }),

  predict(D(2, 1), 'An aqueous solution of benzenediazonium chloride is warmed to about 320 K. Predict what is seen, and the organic product.', 'Bubbles of nitrogen gas are given off.', 'The diazonium group is replaced by OH, giving phenol.'),
  predict(D(2, 2), 'Benzenediazonium chloride is added to aniline in a mildly acidic solution. Predict the product and its colour.', 'The diazonium ion couples at the para position of aniline, giving p-aminoazobenzene.', 'It is a yellow dye.'),
  predict(D(2, 2), 'Ethanamine is treated with sodium nitrite and hydrochloric acid at 273 K. Predict what happens, and why it differs from aniline.', 'Nitrogen gas is given off, and ethanol is the main organic product.', 'The ethyldiazonium ion has no ring to spread its charge over, so it breaks down at once; benzenediazonium chloride is stable in the cold.'),

  odd(D(2, 1), ['CuCl, HCl', 'CuBr, HBr', 'CuCN, KCN', 'KI'], 'KI', 'It replaces the diazonium group with no copper(I) salt; the others are Sandmeyer reagents.'),
  odd(D(2, 2), ['phenol', 'aniline', 'benzene', 'N,N-dimethylaniline'], 'benzene', 'It doesn’t couple with benzenediazonium chloride, as its ring isn’t activated; the others have activating groups and couple.'),
  odd(D(2, 2), ['chlorobenzene', 'phenol', 'p-hydroxyazobenzene', 'benzonitrile'], 'p-hydroxyazobenzene', 'It keeps both nitrogen atoms of the diazonium salt; making the others sets them free as N₂.'),

  long(D(5, 2), 'Answer each part on making benzenediazonium chloride.\n(a) Write the equation for making it from aniline, and give the conditions. [2]\n(b) How is the nitrous acid it needs obtained? [1]\n(c) How would you show that the solution contains a diazonium salt? [2]', '(a) C₆H₅NH₂ + NaNO₂ + 2HCl → C₆H₅N₂⁺Cl⁻ + NaCl + 2H₂O.', '(a) It is done at 273–278 K, with excess hydrochloric acid.', '(b) It is made in the mixture from sodium nitrite and hydrochloric acid: NaNO₂ + HCl → HNO₂ + NaCl.', '(c) A little of the solution is added to a cold solution of phenol in sodium hydroxide.', '(c) An orange dye forms, from coupling, which shows the diazonium salt.'),
  long(D(5, 2), 'Answer each part, giving the reagents.\n(a) Change benzenediazonium chloride to chlorobenzene by two methods, naming each. [2]\n(b) Change it to fluorobenzene, with equations. [2]\n(c) Which reaction in (a) and (b) uses no copper or copper salt? [1]', '(a) With copper(I) chloride and HCl: the Sandmeyer reaction.', '(a) With copper powder and HCl: the Gattermann reaction.', '(b) With fluoroboric acid it gives benzenediazonium fluoroborate, C₆H₅N₂⁺BF₄⁻, which is filtered off and dried.', '(b) On heating: C₆H₅N₂⁺BF₄⁻ → C₆H₅F + BF₃ + N₂.', '(c) The Balz–Schiemann reaction, in (b).'),
  long(D(5, 3), 'Answer each part on making 1,3,5-tribromobenzene.\n(a) Show how it is made from aniline, giving the reagents for each step. [3]\n(b) Why can’t it be made by brominating benzene directly? [2]', '(a) Aniline with bromine water gives a white precipitate of 2,4,6-tribromoaniline.', '(a) This is diazotised with NaNO₂ and HCl at 273–278 K.', '(a) The diazonium salt with H₃PO₂ and water has its −N₂⁺ group replaced by H, giving 1,3,5-tribromobenzene.', '(b) A bromine atom on the ring directs the next one ortho and para, so direct bromination can’t put three bromines meta to each other.', '(b) The NH₂ group puts them at 2, 4 and 6, which are meta to each other, and is then removed through the diazonium salt.'),

  tell(D(2, 1), 'Distinguish between diazotisation and coupling.', 'Diazotisation makes a diazonium salt, by treating a primary aromatic amine with nitrous acid at 273–278 K.', 'Coupling joins a diazonium salt to an activated ring, such as phenol or aniline, giving an azo dye.'),
  tell(D(2, 2), 'Distinguish between the Sandmeyer reaction and the Balz–Schiemann reaction.', 'The Sandmeyer reaction replaces the diazonium group by Cl, Br or CN, using a copper(I) salt.', 'The Balz–Schiemann reaction replaces it by F, by heating the diazonium fluoroborate, with no copper.'),
  tell(D(2, 2), 'Distinguish between reactions of benzenediazonium chloride in which the nitrogen is lost and those in which it is kept, with an example of each.', 'In replacement reactions the nitrogen leaves as N₂ gas, as when warming with water gives phenol.', 'In coupling reactions both nitrogen atoms stay, as the −N=N− group of the dye made with phenol.'),

  match(D(4, 1), [['CuBr, HBr', 'bromobenzene'], ['CuCN, KCN', 'benzonitrile'], ['HBF₄, then heat', 'fluorobenzene'], ['Cu powder, HCl', 'chlorobenzene']]),
  match(D(4, 2), [['The Sandmeyer reaction', '−N₂⁺ replaced using a copper(I) salt'], ['The Gattermann reaction', '−N₂⁺ replaced using copper powder and acid'], ['The Balz–Schiemann reaction', 'a fluoroborate heated to give an aryl fluoride'], ['A coupling reaction', 'an azo compound made, keeping both nitrogens']]),
  match(D(4, 2), [['Diazotisation', '273–278 K, with excess HCl'], ['Coupling with phenol', 'a mildly alkaline solution'], ['Coupling with aniline', 'a mildly acidic solution'], ['Making phenol from the salt', 'warming with water']]),

  ar(D(1, 2), 'Benzenediazonium chloride gives phenol when warmed with water.', 'N₂ is a very stable molecule, so the diazonium group leaves easily.', 1, 'Losing N₂ is what lets water take the place of the diazonium group.'),
  ar(D(1, 2), 'Fluorobenzene is made by warming benzenediazonium chloride with potassium fluoride.', 'Heating benzenediazonium fluoroborate gives fluorobenzene.', 4, 'Fluorobenzene is made through the fluoroborate, by the Balz–Schiemann reaction, not with KF.'),
];

export default questions;
