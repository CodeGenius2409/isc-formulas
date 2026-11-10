// Written by hand: carbohydrates, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const C = at(10, 'a');

/** A Fischer projection down the middle: a row is either a group written on the chain, or [left, right] groups on a crossing bond. Carbon numbers go on the right. */
const fischer = (rows: (string | [string, string])[]): SketchMark[] => {
  const y = (i: number) => 26 + i * 30;
  const out: SketchMark[] = [];
  rows.forEach((r, i) => {
    if (typeof r === 'string') out.push(label(150, y(i) + 5, r));
    else out.push(line([[112, y(i)], [188, y(i)]]), label(106, y(i) + 5, r[0], 'end'), label(194, y(i) + 5, r[1], 'start'));
    out.push(label(262, y(i) + 5, `C-${i + 1}`, 'start'));
    if (i > 0) out.push(line([[150, typeof rows[i - 1] === 'string' ? y(i - 1) + 9 : y(i - 1)], [150, typeof r === 'string' ? y(i) - 9 : y(i)]]));
  });
  return out;
};

const questions: BankDef[] = [
  figure(C(3, 2), 'Draw the open-chain Fischer projection of D-glucose, and show what makes it a D-sugar.', ['A chain of six carbons, with CHO at C-1, CH₂OH at C-6, and an OH group on each of C-2 to C-5.', 'Going down the chain, the OH groups on C-2 to C-5 are on the right, left, right and right.', 'The OH on C-5, the chiral carbon furthest from the CHO group, is on the right, as in D-glyceraldehyde, which makes it D.'], {
    answer: sketch(320, 200, 'A vertical chain. CHO at the top, carbon 1. Carbon 2 has H on the left and OH on the right. Carbon 3 has HO on the left and H on the right. Carbons 4 and 5 each have H on the left and OH on the right. CH₂OH at the bottom, carbon 6.', fischer(['CHO', ['H', 'OH'], ['HO', 'H'], ['H', 'OH'], ['H', 'OH'], 'CH₂OH'])),
  }),
  figure(C(2, 2), 'Draw the open-chain Fischer projection of D-fructose, and say how it shows that fructose is a ketose.', ['CH₂OH at C-1, a C=O at C-2, then HO on the left at C-3, OH on the right at C-4 and C-5, and CH₂OH at C-6.', 'Its carbonyl group is a ketone at C-2, inside the chain, not an aldehyde at the end, so it is a ketose.'], {
    answer: sketch(320, 200, 'A vertical chain. CH₂OH at the top, carbon 1. C=O at carbon 2. Carbon 3 has HO on the left and H on the right. Carbons 4 and 5 each have H on the left and OH on the right. CH₂OH at the bottom, carbon 6.', fischer(['CH₂OH', 'C=O', ['HO', 'H'], ['H', 'OH'], ['H', 'OH'], 'CH₂OH'])),
  }),
  figure(C(3, 2), 'The table gives the results of two tests on four sugars. Identify sugar X, and say which of the four are reducing sugars and why one is not.', ['X is lactose, as it gives glucose and galactose on hydrolysis.', 'Glucose, maltose and lactose reduce Fehling’s solution, so they are reducing sugars.', 'Sucrose isn’t, as its glucose and fructose units are joined through both their reducing groups.'], {
    shown: table(['Sugar', 'With Fehling’s solution', 'Products of hydrolysis'], [['Glucose', 'red precipitate', 'none'], ['Sucrose', 'no change', 'glucose and fructose'], ['Maltose', 'red precipitate', 'glucose only'], ['X', 'red precipitate', 'glucose and galactose']]),
  }),

  predict(C(2, 2), 'A solution of sucrose is boiled with dilute hydrochloric acid, cooled, made alkaline and warmed with Fehling’s solution. Predict what is seen, and why.', 'A brick-red precipitate forms.', 'The acid hydrolyses sucrose to glucose and fructose, both of which are reducing sugars.'),
  predict(C(2, 1), 'A drop of iodine solution is added to a starch paste, and another to cotton wool, which is nearly pure cellulose. Predict what is seen with each.', 'Starch turns blue-black, as the iodine fits inside its coiled amylose chains.', 'Cotton wool shows no blue colour.'),
  predict(C(2, 2), 'Glucose and starch are each stirred into cold water. Predict which dissolves, and which is classed as a sugar.', 'Glucose dissolves, is sweet, and is a sugar.', 'Starch, made of huge chains of glucose units, doesn’t dissolve in cold water and isn’t sweet, so it is a non-sugar.'),

  odd(C(2, 1), ['glucose', 'galactose', 'fructose', 'ribose'], 'fructose', 'It is a ketose; the others are aldoses.'),
  odd(C(2, 1), ['glucose', 'maltose', 'lactose', 'sucrose'], 'sucrose', 'It is a non-reducing sugar; the others are reducing sugars.'),
  odd(C(2, 2), ['starch', 'glycogen', 'cellulose', 'amylopectin'], 'cellulose', 'Its glucose units are joined by β-links; the others have α-links.'),

  long(C(5, 2), 'Answer each part on D and L sugars.\n(a) What do the letters D and L mean in the name of a sugar, and which compound are they compared with? [2]\n(b) D-fructose turns the plane of polarised light to the left. How can it be a D-sugar? [2]\n(c) What does the (+) in D-(+)-glucose tell us? [1]', '(a) They give the configuration at the chiral carbon furthest from the carbonyl group: OH on the right in the Fischer projection for D, on the left for L.', '(a) They are compared with glyceraldehyde, whose (+) form is D-glyceraldehyde.', '(b) D and L describe the arrangement of groups only.', '(b) They don’t tell which way the sugar rotates light, so a D-sugar can be laevorotatory.', '(c) That glucose turns the plane of polarised light to the right.'),
  long(C(5, 2), 'Answer each part on polysaccharides.\n(a) Where is glycogen stored, and why is it called animal starch? [2]\n(b) How is its structure like that of amylopectin, and how is it different? [1]\n(c) Why can’t humans use cellulose for energy, while cattle can? [2]', '(a) In the liver and in muscles.', '(a) It is the store of glucose in animals, as starch is in plants.', '(b) Both are branched chains of α-glucose, but glycogen is branched much more often.', '(c) Humans have no enzyme that breaks the β-links of cellulose.', '(c) Cattle carry bacteria in their gut that make such an enzyme, so they can break cellulose into glucose.'),
  long(C(5, 2), 'Answer each part on the hydrolysis of sucrose.\n(a) Write the equation for it. [1]\n(b) Sucrose turns polarised light to the right, but the mixture made from it turns it to the left. Explain, given that glucose rotates it by +52.5° and fructose by −92.4°. [2]\n(c) Find the mass of glucose made from 68.4 g of sucrose. [2]', '(a) C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ + C₆H₁₂O₆.', '(b) Equal amounts of glucose and fructose are formed.', '(b) Fructose turns light to the left more strongly than glucose turns it to the right, so the mixture is laevorotatory.', '(c) The molar mass of sucrose is 342 g/mol, so 68.4 g is 0.2 mol.', '(c) Each mole gives a mole of glucose: 0.2 × 180 = 36 g.'),

  tell(C(2, 2), 'Distinguish between α-D-glucose and β-D-glucose.', 'They differ only in the position of the OH group on C-1 of the ring: in α-D-glucose it is on the same side as the ring oxygen in the Fischer projection, and in β-D-glucose on the other side.', 'They have different specific rotations, +112° for α and +19° for β.'),
  tell(C(2, 1), 'Distinguish between a monosaccharide and an oligosaccharide, with an example of each.', 'A monosaccharide, such as glucose, can’t be hydrolysed to a simpler sugar.', 'An oligosaccharide, such as sucrose, gives two to ten monosaccharide units on hydrolysis.'),
  tell(C(2, 2), 'Distinguish between the ring forms of glucose and fructose.', 'Glucose forms a six-membered ring of five carbons and an oxygen, a pyranose ring.', 'Fructose forms a five-membered ring of four carbons and an oxygen, a furanose ring.'),

  match(C(4, 1), [['Sucrose', 'glucose and fructose'], ['Lactose', 'glucose and galactose'], ['Maltose', 'two glucose units'], ['Cellulose', 'many β-glucose units']]),
  match(C(4, 1), [['Glucose', 'an aldohexose'], ['Fructose', 'a ketohexose'], ['Ribose', 'an aldopentose'], ['Glyceraldehyde', 'an aldotriose']]),
  match(C(4, 2), [['Maltose', 'an α-1,4 link between two glucose units'], ['Cellulose', 'β-1,4 links'], ['The branches of amylopectin', 'α-1,6 links'], ['Sucrose', 'a link between C-1 of glucose and C-2 of fructose']]),

  ar(C(1, 2), 'A D-sugar need not turn polarised light to the right.', 'The D or L label gives the configuration at the lowest chiral carbon, not the direction of rotation.', 1, 'So D-fructose, for example, is laevorotatory.'),
  ar(C(1, 1), 'Cellulose is a polymer of glucose.', 'Cellulose is the main part of plant cell walls.', 2, 'Both are true, but where cellulose is found doesn’t explain what it is made of.'),
  ar(C(1, 1), 'Glycogen is the store of carbohydrate in plants.', 'Glycogen is a highly branched polymer of glucose.', 4, 'Glycogen is the store in animals; plants store starch.'),
];

export default questions;
