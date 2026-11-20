// Written by hand: titrations, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// MnO₄⁻ reacts with Fe²⁺ in the ratio 1 : 5, and with C₂O₄²⁻ in the ratio 2 : 5. Molar masses: Mohr’s salt 392, H₂C₂O₄·2H₂O 126.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, short } = kit('chemistry', 'XII');
const T = at(11, 'a');

const questions: BankDef[] = [
  figure(T(3, 1), 'Draw the set-up for titrating Mohr’s salt solution against potassium manganate(VII), labelling what is in each piece of apparatus.', ['A burette holding the KMnO₄ solution, read at the upper meniscus as the solution is so dark.', 'A conical flask holding a measured volume of Mohr’s salt solution, from a pipette, with dilute H₂SO₄ added.', 'A white tile under the flask, to show the first permanent pale pink, as KMnO₄ is its own indicator.'], {
    answer: sketch(400, 280, 'A burette clamped upright, labelled potassium manganate(VII), with a tap near the bottom and a tip pointing into the neck of a conical flask. The flask holds Mohr’s salt solution with dilute sulphuric acid. It stands on a white tile.', [
      { t: 'box', x: 132, y: 10, w: 16, h: 150 }, line([[124, 162], [156, 162]]), line([[140, 160], [140, 188]]),
      line([[132, 40], [148, 40]], { dash: 1 }), label(160, 44, 'burette: KMnO₄', 'start'), label(160, 166, 'tap', 'start'),
      { t: 'path', d: 'M128 192 L128 206 L100 250 L180 250 L152 206 L152 192' }, line([[109, 236], [171, 236]], { dash: 1 }),
      label(190, 222, 'conical flask:', 'start'), label(190, 238, 'Mohr’s salt + dilute H₂SO₄', 'start'),
      { t: 'box', x: 80, y: 250, w: 120, h: 10 }, label(210, 262, 'white tile', 'start'),
    ]),
  }),
  figure(T(3, 2), 'The table gives the burette readings when 25.0 cm³ of an iron(II) solution was titrated against 0.020 M KMnO₄. Find the titre to use, and the molarity of the iron(II) solution.', ['The rough titre is left out; the other three agree within 0.2 cm³, so their mean, (20.10 + 19.90 + 20.00)/3 = 20.00 cm³, is used.', 'Moles of MnO₄⁻ = 0.020 × 20.00/1000 = 4.0 × 10⁻⁴; each takes 5 Fe²⁺, so moles of Fe²⁺ = 2.0 × 10⁻³.', 'Molarity of Fe²⁺ = 2.0 × 10⁻³/0.0250 = 0.080 M.'], {
    shown: table(['Titration', 'Initial (cm³)', 'Final (cm³)', 'Titre (cm³)'], [['Rough', '0.00', '20.60', '20.60'], ['1', '0.00', '20.10', '20.10'], ['2', '20.10', '40.00', '19.90'], ['3', '0.50', '20.50', '20.00']], 'Each titration used 25.0 cm³ of the iron(II) solution.'),
  }),
  figure(T(3, 2), 'Make a table of what is seen, and why, at the start, in the middle and at the end point of titrating warm oxalic acid against KMnO₄.', ['At the start, the pink colour of the first few drops fades only slowly, as the reaction is slow at first.', 'In the middle, each drop loses its colour at once, as the Mn²⁺ formed catalyses the reaction.', 'At the end point, a pale pink colour stays for about 30 seconds, from a slight excess of MnO₄⁻.'], {
    answer: table(['Stage', 'What is seen', 'Why'], [['Start', 'pink colour fades slowly', 'the reaction is slow at first'], ['Middle', 'colour vanishes at once', 'Mn²⁺ formed catalyses it'], ['End point', 'pale pink stays for 30 s', 'slight excess of MnO₄⁻']]),
  }),

  predict(T(2, 2), 'A student rinses the burette with water but not with the KMnO₄ solution before filling it. Predict the effect on the molarity of iron(II) worked out from the titration.', 'The KMnO₄ is diluted by the water left in the burette, so more of it is needed: the titre is too large.', 'So the molarity of iron(II) worked out is too high.'),
  predict(T(2, 2), 'Dilute nitric acid is used instead of dilute sulphuric acid to acidify iron(II) before titrating it against KMnO₄. Predict the effect on the titre.', 'Nitric acid is itself an oxidising agent, and oxidises some of the Fe²⁺ to Fe³⁺.', 'Less Fe²⁺ is left for the KMnO₄, so the titre is too small.'),

  odd(T(2, 1), ['dilute H₂SO₄', 'dilute HCl', 'dilute HNO₃', 'ethanoic acid'], 'dilute H₂SO₄', 'It is the acid used in KMnO₄ titrations; HCl is oxidised by KMnO₄, HNO₃ is an oxidising agent, and ethanoic acid is too weak to keep the medium acid enough.'),
  odd(T(2, 1), ['Fe²⁺', 'C₂O₄²⁻', 'H₂C₂O₄', 'Mn²⁺'], 'Mn²⁺', 'It is formed when MnO₄⁻ is reduced; the others are reducing agents oxidised by MnO₄⁻ in these titrations.'),
  odd(T(2, 1), ['burette', 'pipette', 'volumetric flask', 'beaker'], 'beaker', 'It doesn’t measure a volume accurately; the others do.'),

  long(T(5, 2), 'A solution of Mohr’s salt is made up to 250 cm³ in a volumetric flask. 25.0 cm³ of it needs 24.0 cm³ of 0.020 M KMnO₄.\n(a) Write the ionic equation for the reaction. [1]\n(b) Find the molarity of the Mohr’s salt solution. [2]\n(c) Find its concentration in g/L. (M = 392.) [1]\n(d) Find the mass of Mohr’s salt dissolved to make the 250 cm³. [1]', '(a) MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.', '(b) Moles of MnO₄⁻ = 0.020 × 24.0/1000 = 4.8 × 10⁻⁴, so moles of Fe²⁺ = 5 × 4.8 × 10⁻⁴ = 2.4 × 10⁻³.', '(b) Molarity = 2.4 × 10⁻³/0.0250 = 0.096 M.', '(c) 0.096 × 392 = 37.6 g/L.', '(d) 37.6 × 0.250 = 9.41 g.'),
  long(T(5, 3), 'Impure oxalic acid crystals, H₂C₂O₄·2H₂O, are dissolved to make a solution of 8.40 g/L. 25.0 cm³ of it needs 24.0 cm³ of 0.020 M KMnO₄.\n(a) Write the ionic equation for the reaction. [1]\n(b) Find the molarity of the oxalic acid. [2]\n(c) Find the mass of pure crystals in a litre. (M = 126.) [1]\n(d) Find the percentage purity of the sample. [1]', '(a) 2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O.', '(b) Moles of MnO₄⁻ = 0.020 × 24.0/1000 = 4.8 × 10⁻⁴, so moles of oxalic acid = (5/2) × 4.8 × 10⁻⁴ = 1.2 × 10⁻³.', '(b) Molarity = 1.2 × 10⁻³/0.0250 = 0.048 M.', '(c) 0.048 × 126 = 6.05 g/L.', '(d) Purity = 6.05/8.40 × 100 = 72%.'),
  long(T(5, 1), 'Answer each part on the method of a KMnO₄ titration.\n(a) Why can’t a standard solution of KMnO₄ be made just by weighing it? [1]\n(b) Why is the burette rinsed with the KMnO₄ solution, but the conical flask only with water? [2]\n(c) Why is KMnO₄ added drop by drop near the end point? [1]\n(d) Why are concordant titres needed? [1]', '(a) It isn’t a primary standard: it isn’t pure enough, and its solution slowly decomposes, so it must be standardised.', '(b) Rinsing the burette with the KMnO₄ removes water that would dilute it.', '(b) Rinsing the flask with the solution to be titrated would add an unknown extra amount of it, while water doesn’t change the number of moles pipetted in.', '(c) So that the first permanent pink is seen, and the end point isn’t passed.', '(d) Titres that agree show the readings are reliable, free of chance errors in a single titration.'),

  tell(T(2, 1), 'Distinguish between a primary standard and a secondary standard, with an example of each from these titrations.', 'A primary standard is pure and stable, so a solution of known concentration is made by weighing it: oxalic acid crystals or Mohr’s salt.', 'A secondary standard must be standardised by titration first: potassium manganate(VII).'),
  tell(T(2, 2), 'Distinguish between the end point and the equivalence point of a titration.', 'The equivalence point is where the reactants have been added in exactly the amounts given by the equation.', 'The end point is where the colour change is seen; in a KMnO₄ titration it comes one drop past, at the first permanent pink.'),
  tell(T(2, 2), 'Distinguish between titrating Mohr’s salt and titrating oxalic acid against KMnO₄.', 'Mohr’s salt is titrated cold, as warming lets air oxidise Fe²⁺; MnO₄⁻ reacts with Fe²⁺ in the ratio 1 : 5.', 'Oxalic acid is warmed to 60–70 °C, as its reaction is slow; MnO₄⁻ reacts with C₂O₄²⁻ in the ratio 2 : 5.'),

  match(T(4, 2), [['MnO₄⁻ becoming Mn²⁺', '5 electrons gained'], ['MnO₄⁻ becoming MnO₂', '3 electrons gained'], ['Fe²⁺ becoming Fe³⁺', '1 electron lost'], ['C₂O₄²⁻ becoming 2CO₂', '2 electrons lost']]),
  match(T(4, 1), [['Mohr’s salt, FeSO₄·(NH₄)₂SO₄·6H₂O', '392 g/mol'], ['Oxalic acid crystals, H₂C₂O₄·2H₂O', '126 g/mol'], ['Anhydrous oxalic acid, H₂C₂O₄', '90 g/mol'], ['Potassium manganate(VII), KMnO₄', '158 g/mol']]),
  match(T(4, 1), [['Pipette', 'delivers a fixed volume of the solution being analysed'], ['Burette', 'delivers a measured, variable volume of the titrant'], ['White tile', 'makes the colour change easy to see'], ['Volumetric flask', 'makes up a solution to an exact volume']]),

  short(T(2, 2), 'Write the two half-equations for the reaction of manganate(VII) with oxalate ions in acid, and combine them into the ionic equation.', 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, and C₂O₄²⁻ → 2CO₂ + 2e⁻.', 'Taking the first twice and the second five times: 2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O.'),
];

export default questions;
