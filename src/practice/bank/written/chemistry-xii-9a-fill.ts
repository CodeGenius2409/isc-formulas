// Written by hand: aliphatic amines and aniline, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const N = at(9, 'a');

/** The route from aniline to p-nitroaniline, top to bottom, with the two middle compounds named as given. */
const route = (p: string, q: string) => [
  label(90, 20, 'aniline'),
  arrow([90, 28], [90, 58]), label(104, 47, 'CH₃COCl', 'start'),
  label(90, 74, p),
  arrow([90, 82], [90, 112]), label(104, 101, 'conc. HNO₃, conc. H₂SO₄', 'start'),
  label(90, 128, q),
  arrow([90, 136], [90, 166]), label(104, 155, 'H₃O⁺, warm', 'start'),
  label(90, 182, 'p-nitroaniline'),
];

const questions: BankDef[] = [
  figure(N(2, 2), 'Draw the shape of a trimethylamine molecule, showing the lone pair, and give the C–N–C bond angle.', ['The nitrogen is sp³ hybridised: three bonds to methyl groups and a lone pair, making a pyramid.', 'The C–N–C angle is about 108°, a little less than the tetrahedral angle because of the lone pair.'], {
    answer: sketch(260, 165, 'A nitrogen atom at the top with a lone pair above it. Three bonds go down from it to three methyl groups, two to the sides and one towards the viewer, drawn dashed, making a pyramid. The angle between two bonds is marked 108°.', [
      { t: 'dot', x: 126, y: 46 }, { t: 'dot', x: 134, y: 46 }, label(130, 76, 'N'),
      line([[122, 80], [72, 118]]), line([[138, 80], [188, 118]]), line([[130, 82], [130, 130]], { dash: 1 }),
      label(60, 134, 'CH₃'), label(200, 134, 'CH₃'), label(130, 148, 'CH₃'),
      label(138, 124, '108°', 'start'),
    ]),
  }),
  figure(N(3, 2), 'The table gives the boiling points of four compounds of nearly the same molar mass. Explain the order of the three amines, and why propan-1-ol boils highest.', ['Propan-1-amine has two N–H hydrogens to hydrogen bond with, N-methylethanamine one, and trimethylamine none, so their boiling points fall in that order.', 'Trimethylamine has only weak van der Waals forces between its molecules.', 'O–H…O hydrogen bonds are stronger than N–H…N ones, as oxygen is more electronegative than nitrogen, so propan-1-ol boils highest.'], {
    shown: table(['Compound', 'Molar mass (g/mol)', 'Boiling point (K)'], [['Propan-1-ol', '60', '370'], ['Propan-1-amine', '59', '321'], ['N-methylethanamine', '59', '310'], ['Trimethylamine', '59', '276']]),
  }),
  figure(N(3, 2), 'The figure shows how p-nitroaniline is made from aniline. Name the compounds P and Q, and say what the last step does.', ['P is acetanilide, N-phenylethanamide, made by acetylating the amino group.', 'Q is p-nitroacetanilide, from nitrating P mainly at the para position.', 'The last step hydrolyses the amide, taking the acetyl group off to give p-nitroaniline.'], {
    shown: sketch(320, 195, 'A route from top to bottom. Aniline, with ethanoyl chloride, gives P. P, with concentrated nitric and sulphuric acids, gives Q. Q, warmed with acid, gives p-nitroaniline.', route('P', 'Q')),
    answer: sketch(320, 195, 'The same route with the middle compounds named: aniline gives acetanilide, which is nitrated to p-nitroacetanilide, which is hydrolysed to p-nitroaniline.', route('acetanilide', 'p-nitroacetanilide')),
  }),

  predict(N(2, 2), 'A solution of methanamine is added to iron(III) chloride solution. Predict what is seen, and why.', 'A reddish-brown precipitate forms.', 'Methanamine is a base, and the hydroxide ions it makes in water precipitate hydrated iron(III) oxide.'),
  predict(N(2, 1), 'Aniline is shaken with dilute hydrochloric acid, and the solution is then made alkaline with sodium hydroxide. Predict what is seen at each stage.', 'Aniline dissolves in the acid, as it forms soluble anilinium chloride.', 'With alkali, aniline is set free again, and the mixture turns cloudy with oily drops.'),
  predict(N(2, 3), 'Ethanamine is warmed with excess iodomethane. Predict the final product, and what kind of compound it is.', 'N,N,N-trimethylethanaminium iodide, C₂H₅N(CH₃)₃⁺ I⁻.', 'A quaternary ammonium salt, as each methyl replaces a hydrogen on the nitrogen until none is left.'),

  odd(N(2, 1), ['propan-1-amine', 'propan-2-amine', 'butan-2-amine', 'N-methylpropan-1-amine'], 'N-methylpropan-1-amine', 'It is a secondary amine; the other three are primary.'),
  odd(N(2, 2), ['reducing a nitrile with LiAlH₄', 'the Hofmann bromamide reaction of an amide', 'the Gabriel phthalimide synthesis', 'warming a primary amine with chloroform and alcoholic KOH'], 'warming a primary amine with chloroform and alcoholic KOH', 'It makes an isocyanide; the other three make primary amines.'),
  odd(N(2, 2), ['aniline', 'benzylamine', 'ethanamine', 'methanamine'], 'aniline', 'Its –NH₂ is joined directly to the ring, so its lone pair is delocalised and it is a weaker base than ammonia; in the others the nitrogen is on an alkyl carbon.'),

  long(N(5, 2), 'Answer each part on aniline.\n(a) How is aniline made from nitrobenzene? Write the equation. [2]\n(b) Write the equation for aniline with bromine water, and say what is seen. [2]\n(c) Why does aniline turn dark brown on standing in air? [1]', '(a) Nitrobenzene is reduced with tin, or iron, and hydrochloric acid.', '(a) C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O.', '(b) C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂ + 3HBr.', '(b) A white precipitate of 2,4,6-tribromoaniline forms at once.', '(c) It is slowly oxidised by air to coloured products.'),
  long(N(5, 3), 'Answer each part on the basic strength of the ethylamines.\n(a) In water, the order is (C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃. Explain it. [3]\n(b) In the gas phase the order is (C₂H₅)₃N > (C₂H₅)₂NH > C₂H₅NH₂ > NH₃. Why is it different? [2]', '(a) Ethyl groups push electrons to the nitrogen, making its lone pair more available, so all the amines are stronger than ammonia.', '(a) In water, the ion formed is stabilised by hydrogen bonding with water, which is greatest for the ion with most N–H hydrogens.', '(a) Crowding by three ethyl groups also hinders the approach of a proton and of water, so the tertiary amine falls below the secondary.', '(b) In the gas phase there is no solvation.', '(b) So only the inductive effect counts, and the more alkyl groups, the stronger the base.'),

  tell(N(2, 2), 'Distinguish between aniline and benzylamine by a chemical test.', 'Treat each with nitrous acid (NaNO₂ and HCl) at 273–278 K, then add an alkaline solution of β-naphthol.', 'Aniline gives an orange-red dye; benzylamine gives off nitrogen gas instead and no dye.'),
  tell(N(2, 1), 'Distinguish between aniline and phenol by their behaviour with dilute acid and dilute alkali.', 'Aniline dissolves in dilute hydrochloric acid, as it is a base, but not in sodium hydroxide.', 'Phenol dissolves in sodium hydroxide, as it is an acid, but not in dilute hydrochloric acid.'),
  tell(N(2, 2), 'Distinguish between ammonolysis of an alkyl halide and the Gabriel synthesis as ways of making amines.', 'Ammonolysis heats the alkyl halide with ammonia, and gives a mixture of primary, secondary and tertiary amines and a quaternary salt.', 'Gabriel synthesis alkylates potassium phthalimide and then hydrolyses it, giving a primary amine alone.'),

  match(N(4, 1), [['Bromine water', '2,4,6-tribromoaniline'], ['Ethanoyl chloride', 'acetanilide'], ['NaNO₂ and HCl at 273 K', 'benzenediazonium chloride'], ['Concentrated H₂SO₄, heated', 'sulphanilic acid']]),
  match(N(4, 2), [['Carbylamine test on a primary amine', 'a foul smell of isocyanide'], ['Hinsberg’s reagent with a secondary amine', 'a solid insoluble in alkali'], ['Nitrous acid with a primary aliphatic amine', 'brisk bubbles of nitrogen'], ['Nitrous acid in the cold, then β-naphthol, with aniline', 'an orange-red dye']]),
  match(N(4, 2), [['Nitrobenzene to aniline', 'Sn and HCl'], ['Ethanenitrile to ethanamine', 'LiAlH₄'], ['Ethanamide to methanamine', 'Br₂ and NaOH'], ['Potassium phthalimide to a primary amine', 'an alkyl halide, then hydrolysis']]),

  ar(N(1, 2), 'Tertiary amines don’t react with benzenesulphonyl chloride.', 'A tertiary amine has no hydrogen on its nitrogen.', 1, 'The reaction replaces a hydrogen on the nitrogen, so with none there is nothing to replace.'),
  ar(N(1, 2), 'Aniline is a weaker base than ammonia.', 'The phenyl group pushes electrons towards the nitrogen.', 3, 'The ring draws the lone pair into itself by resonance, which is why aniline is weaker.'),
  ar(N(1, 3), 'Amines are less soluble in water than alcohols of similar molar mass.', 'An amine has a lone pair on its nitrogen.', 2, 'Both are true, but the reason is that N–H…O hydrogen bonds are weaker than O–H…O ones, nitrogen being less electronegative.'),
];

export default questions;
