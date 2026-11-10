// Written by hand: cyanides and isocyanides, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const C = at(9, 'b');

/** Three reactions, one to a row, with the products named as given. */
const rows = (p: string, q: string, r: string): SketchMark[] => [
  ['CH₃CH₂Br', 'KCN, ethanol', p], ['CH₃CH₂Br', 'AgCN', q], ['CH₃CH₂CONH₂', 'P₂O₅, heat', r],
].flatMap(([start, reagent, product], i) => {
  const y = 34 + i * 50;
  return [label(60, y + 5, start), arrow([115, y], [235, y]), label(175, y - 8, reagent), label(245, y + 5, product, 'start')];
});

/** Methanamine with chloroform and alcoholic KOH gives A, which acid hydrolyses to B and C. */
const route = (a: string, bc: string): SketchMark[] => [
  label(150, 20, 'CH₃NH₂'),
  arrow([150, 28], [150, 64]), label(162, 50, 'CHCl₃, alcoholic KOH, warm', 'start'),
  label(150, 82, a),
  arrow([150, 90], [150, 126]), label(162, 112, 'H₃O⁺', 'start'),
  label(150, 144, bc),
];

const questions: BankDef[] = [
  figure(C(2, 2), 'Draw the cyanide ion with its lone pairs, and show how it can join an alkyl group through either atom, naming the product each way.', ['The ion is [:C≡N:]⁻, with a lone pair on carbon and one on nitrogen, so it is ambident.', 'Joining through carbon gives a nitrile, R–C≡N; joining through nitrogen gives an isocyanide, R–N≡C.'], {
    answer: sketch(320, 150, 'The cyanide ion, with a lone pair on the carbon and one on the nitrogen and a negative charge, at the top. An arrow from the carbon goes down left to R–C≡N, labelled nitrile. An arrow from the nitrogen goes down right to R–N≡C, labelled isocyanide.', [
      label(160, 32, '[:C≡N:]⁻'), arrow([146, 40], [86, 96]), arrow([174, 40], [234, 96]),
      label(80, 116, 'R–C≡N'), label(80, 138, 'nitrile'), label(240, 116, 'R–N≡C'), label(240, 138, 'isocyanide'),
    ]),
  }),
  figure(C(3, 2), 'The figure shows three reactions. Name the products P, Q and R, and say which two are the same compound.', ['P is propanenitrile, CH₃CH₂CN.', 'Q is ethyl isocyanide, CH₃CH₂NC.', 'R is propanenitrile too, from dehydrating the amide, so P and R are the same.'], {
    shown: sketch(400, 150, 'Three rows. Bromoethane with potassium cyanide in ethanol gives P. Bromoethane with silver cyanide gives Q. Propanamide heated with phosphorus pentoxide gives R.', rows('P', 'Q', 'R')),
    answer: sketch(400, 150, 'The same three rows with the products named: propanenitrile, ethyl isocyanide and propanenitrile.', rows('propanenitrile', 'ethyl isocyanide', 'propanenitrile')),
  }),
  figure(C(2, 2), 'The figure shows a reaction of methanamine and what its product gives with acid. Name A, B and C.', ['A is methyl isocyanide, CH₃NC, from the carbylamine reaction.', 'Acid hydrolysis gives methanamine, CH₃NH₂, and methanoic acid, HCOOH, as B and C.'], {
    shown: sketch(370, 160, 'Methanamine, warmed with chloroform and alcoholic potassium hydroxide, gives A. A, with acid and water, gives B and C.', route('A', 'B + C')),
    answer: sketch(370, 160, 'The same route with the compounds named: methyl isocyanide, which gives methanamine and methanoic acid.', route('CH₃NC', 'CH₃NH₂ + HCOOH')),
  }),

  predict(C(2, 1), 'Aniline is warmed with chloroform and alcoholic potassium hydroxide. Predict what is noticed, and the product.', 'A very unpleasant smell.', 'It comes from phenyl isocyanide, C₆H₅NC, formed in the carbylamine reaction.'),
  predict(C(2, 2), 'N-Methylethanamine, a secondary amine, is warmed with chloroform and alcoholic potassium hydroxide. Predict what is noticed, and why.', 'No offensive smell.', 'Only primary amines give isocyanides, as the nitrogen must carry two hydrogens to lose.'),
  predict(C(2, 3), '2-Bromo-2-methylpropane is warmed with potassium cyanide. Predict the main organic product, and why it isn’t the nitrile.', 'Mainly 2-methylpropene.', 'The tertiary halide is crowded, so the cyanide ion acts as a base and removes HBr, rather than replacing the bromine.'),

  odd(C(2, 1), ['CH₃CN', 'C₂H₅CN', 'C₆H₅CN', 'CH₃NC'], 'CH₃NC', 'It is an isocyanide; the others are nitriles.'),
  odd(C(2, 2), ['KCN', 'NaCN', 'AgCN', 'LiCN'], 'AgCN', 'It is mainly covalent, and gives isocyanides with alkyl halides; the others are ionic, and give nitriles.'),
  odd(C(2, 2), ['an alkyl halide with KCN', 'an amide heated with P₂O₅', 'a primary amine with CHCl₃ and alcoholic KOH', 'an alkyl halide with NaCN'], 'a primary amine with CHCl₃ and alcoholic KOH', 'It makes an isocyanide; the others make nitriles.'),

  long(C(5, 2), 'Answer each part, starting from ethanamide.\n(a) How is ethanenitrile made from it? Write the equation. [2]\n(b) What does ethanenitrile give on complete hydrolysis with acid? [1]\n(c) What does it give on reduction with LiAlH₄? [1]\n(d) Does the route from the amide through the nitrile change the number of carbon atoms? How does this differ from making a nitrile from an alkyl halide? [1]', '(a) By heating with phosphorus pentoxide, which removes water.', '(a) CH₃CONH₂ → CH₃CN + H₂O.', '(b) Ethanoic acid, CH₃COOH.', '(c) Ethanamine, CH₃CH₂NH₂.', '(d) No, the carbon count stays the same; a halide with KCN gains one carbon.'),
  long(C(5, 2), 'Answer each part on the carbylamine reaction.\n(a) Write the equation for methanamine. [2]\n(b) Why is the reaction used as a test for primary amines? [2]\n(c) Why should the test be done in a fume cupboard? [1]', '(a) CH₃NH₂ + CHCl₃ + 3KOH → CH₃NC + 3KCl + 3H₂O.', '(a) The amine is warmed with chloroform and alcoholic KOH.', '(b) Only primary amines give it, as their nitrogen carries two hydrogens.', '(b) The isocyanide formed has a very offensive smell, which shows clearly that the reaction happened.', '(c) Isocyanides are poisonous and foul-smelling.'),
  long(C(5, 3), 'Answer each part on the cyanide ion.\n(a) What is meant by calling it ambident? [1]\n(b) Why does an alkyl halide give mainly a nitrile with KCN, but mainly an isocyanide with AgCN? [2]\n(c) Give the main product of iodomethane with each. [2]', '(a) It can attack through either of two atoms, carbon or nitrogen, as each has a lone pair.', '(b) KCN is ionic, so the free CN⁻ attacks through carbon, forming the stronger C–C bond.', '(b) AgCN is mainly covalent, with carbon bonded to silver, so only the nitrogen’s lone pair is free to attack.', '(c) With KCN: ethanenitrile, CH₃CN.', '(c) With AgCN: methyl isocyanide, CH₃NC.'),

  tell(C(2, 1), 'Distinguish between the carbylamine reaction and the dehydration of an amide.', 'The carbylamine reaction warms a primary amine with chloroform and alcoholic KOH, and gives an isocyanide.', 'Dehydrating an amide with P₂O₅ gives a nitrile.'),
  tell(C(2, 2), 'Distinguish between KCN and AgCN as reagents with an alkyl halide.', 'KCN is ionic and gives mainly a nitrile, R–C≡N.', 'AgCN is mainly covalent and gives mainly an isocyanide, R–N≡C.'),
  tell(C(2, 2), 'Distinguish between making a nitrile from an alkyl halide and from an amide, by the number of carbon atoms.', 'An alkyl halide with KCN gains a carbon: bromoethane, with two, gives propanenitrile, with three.', 'An amide keeps its carbon count: propanamide, with three, gives propanenitrile, with three.'),

  match(C(4, 1), [['CH₃CH₂Br with KCN', 'propanenitrile'], ['CH₃CH₂Br with AgCN', 'ethyl isocyanide'], ['CH₃CONH₂ with P₂O₅', 'ethanenitrile'], ['CH₃NH₂ with CHCl₃ and KOH', 'methyl isocyanide']]),
  match(C(4, 2), [['CH₃CN with H₃O⁺, heated', 'ethanoic acid'], ['CH₃NC with H₃O⁺', 'methanamine and methanoic acid'], ['CH₃CN with LiAlH₄', 'ethanamine'], ['CH₃CN, partly hydrolysed', 'ethanamide']]),
  match(C(4, 1), [['–C≡N', 'the cyanide group, joined through carbon'], ['–N≡C', 'the isocyanide group, joined through nitrogen'], ['CN⁻', 'an ambident nucleophile'], ['P₂O₅', 'a dehydrating agent']]),

  ar(C(1, 2), 'Alkyl halides with KCN give mainly nitriles.', 'KCN is ionic, so the free CN⁻ attacks through carbon, forming the stronger C–C bond.', 1, 'Attack through carbon makes the nitrile.'),
  ar(C(1, 1), 'Secondary amines give the carbylamine reaction.', 'Isocyanides have an offensive smell.', 4, 'Only primary amines give the reaction.'),
  ar(C(1, 2), 'Dehydrating propanamide gives propanenitrile.', 'Nitriles are more polar than isocyanides.', 2, 'Both are true, but the product follows from removing water from –CONH₂, not from polarity.'),
];

export default questions;
