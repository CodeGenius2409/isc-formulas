// Written by hand: Class XI practical work. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory } = bank('chemistry', 'XI');
const T = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [10, 'a', marks, d];
const Q = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [10, 'b', marks, d];
const P = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [10, 'c', marks, d];
const C = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [10, 'd', marks, d];

const questions: BankDef[] = [
  // ---- Titration
  mcq(T(1, 2), 'In the titration of sodium carbonate with dilute HCl, using methyl orange, the end point is a change from:', ['colourless to pink', 'yellow to orange-pink', 'pink to colourless', 'blue to red'], 1),
  theory('reason', T(1, 2), 'Give a reason: phenolphthalein isn’t the indicator used for the full titration of sodium carbonate with HCl.', ['It changes colour at the first stage only, when carbonate has become hydrogencarbonate, so it would show half the acid needed.']),
  theory('short', T(2, 2), 'What volume of 0.20 M HCl neutralises 25.0 cm³ of 0.10 M Na₂CO₃?', ['Na₂CO₃ is 2.5 mmol, and it needs 2 mol of HCl per mole, so 5.0 mmol.', 'V = 5.0/0.20 = 25.0 cm³.']),
  theory('short', T(3, 3), 'A solution has 14.3 g of Na₂CO₃·xH₂O per litre. 25.0 cm³ of it needs 25.0 cm³ of 0.10 M HCl. Find x.', ['HCl is 2.5 mmol, so the carbonate is 1.25 mmol in 25.0 cm³, which is 0.050 M.', 'The molar mass is 14.3/0.050 = 286 g/mol.', '106 + 18x = 286, so x = 10.'], { format: 'numerical' }),
  theory('short', T(3, 3), 'A sample of impure Na₂CO₃ has 6.0 g dissolved per litre. 25.0 cm³ of it needs 25.0 cm³ of 0.10 M HCl. Find the percentage purity.', ['HCl is 2.5 mmol, so the carbonate is 1.25 mmol in 25.0 cm³, which is 0.050 M.', 'That is 0.050 × 106 = 5.3 g/L.', 'Purity = 5.3/6.0 × 100 = 88.3%.'], { format: 'numerical' }),
  theory('short', T(2, 2), 'A student rinses the burette with distilled water only before filling it with acid. What will this do to the volume read, and why?', ['The water left behind dilutes the acid.', 'So a larger volume of acid will be needed, and the reading will be too high.'], { format: 'predict' }),
  // ---- Qualitative analysis
  mcq(Q(1, 1), 'A salt gives brisk effervescence with dilute HCl, and the gas turns lime water milky. The anion is likely to be:', ['Cl⁻', 'CO₃²⁻', 'SO₄²⁻', 'NO₃⁻'], 1),
  mcq(Q(1, 1), 'A gas with the smell of rotten eggs, which blackens lead acetate paper, shows the anion:', ['S²⁻', 'SO₃²⁻', 'NO₂⁻', 'CO₃²⁻'], 0),
  mcq(Q(1, 2), 'A salt with concentrated H₂SO₄ and MnO₂ gives violet vapours. The anion is:', ['Cl⁻', 'Br⁻', 'I⁻', 'NO₃⁻'], 2),
  mcq(Q(1, 2), 'The group reagent for group I cations is:', ['dilute HCl', 'H₂S in acid', 'NH₄OH with NH₄Cl', '(NH₄)₂CO₃'], 0),
  mcq(Q(1, 2), 'A white precipitate with BaCl₂ that doesn’t dissolve in concentrated HCl shows:', ['CO₃²⁻', 'SO₃²⁻', 'SO₄²⁻', 'C₂O₄²⁻'], 2),
  mcq(Q(1, 2), 'A canary yellow precipitate with ammonium molybdate and concentrated HNO₃ shows:', ['PO₄³⁻', 'SO₄²⁻', 'NO₃⁻', 'CH₃COO⁻'], 0),
  ar(Q(1, 2), 'NH₄Cl is added before NH₄OH in the test for group III cations.', 'The common ion lowers the OH⁻ concentration, so that hydroxides of later groups don’t precipitate.', 1),
  ar(Q(1, 3), 'The group II sulphides are precipitated by H₂S in acid.', 'Acid suppresses the ionisation of H₂S, so the S²⁻ concentration is low and only the least soluble sulphides form.', 1),
  theory('reason', Q(1, 2), 'Give a reason: an acetate gives a vinegar smell with dilute H₂SO₄.', ['The stronger acid frees ethanoic acid, which is volatile and has that smell.']),
  theory('reason', Q(2, 3), 'Give a reason: a little concentrated HNO₃ is boiled with the filtrate before group III is tested.', ['Group II’s H₂S will have reduced any Fe³⁺ to Fe²⁺.', 'Nitric acid oxidises it back to Fe³⁺, which precipitates as the hydroxide in this group.']),
  theory('distinguish', Q(2, 2), 'Distinguish between chloride and bromide by a test with silver nitrate and ammonia.', ['A chloride gives a white precipitate, which dissolves readily in dilute ammonia.', 'A bromide gives a pale yellow precipitate, which dissolves only sparingly.']),
  theory('distinguish', Q(2, 2), 'Give one test that distinguishes a sulphite from a carbonate. Both give a gas with dilute acid.', ['Pass each gas into acidified K₂Cr₂O₇.', 'SO₂ from the sulphite turns it green, and CO₂ from the carbonate has no effect.']),
  theory('short', Q(2, 2), 'Describe the brown ring test for a nitrate.', ['To the salt’s solution, add freshly prepared FeSO₄, then pour concentrated H₂SO₄ down the side.', 'A brown ring forms where the layers meet.']),
  theory('short', Q(2, 3), 'A student forgets to remove the group II cations, and adds group III reagents. What goes wrong?', ['Any group II cation is still in solution, and can precipitate with the later reagents.', 'Its precipitate is then wrongly taken for a cation of a later group.'], { format: 'predict' }),
  theory('short', Q(3, 2), 'Name the group reagents for cation groups I, II and III.', ['Group I: dilute HCl.', 'Group II: H₂S in dilute HCl.', 'Group III: NH₄OH in the presence of NH₄Cl.']),
  // ---- Preparation
  mcq(P(1, 1), 'Mohr’s salt is:', ['FeSO₄·7H₂O', 'FeSO₄·(NH₄)₂SO₄·6H₂O', 'K₂SO₄·Al₂(SO₄)₃·24H₂O', 'CuSO₄·5H₂O'], 1),
  mcq(P(1, 1), 'Potash alum is:', ['K₂SO₄·Al₂(SO₄)₃·24H₂O', 'FeSO₄·(NH₄)₂SO₄·6H₂O', 'K₂SO₄·Fe₂(SO₄)₃', 'KAlO₂'], 0),
  mcq(P(1, 1), 'Copper(II) sulphate crystallises from water as:', ['white CuSO₄', 'blue CuSO₄·5H₂O', 'green CuSO₄·7H₂O', 'black CuO'], 1),
  mcq(P(1, 2), 'Hydrated iron(II) sulphate crystals are:', ['pale green', 'deep blue', 'yellow-brown', 'colourless'], 0),
  mcq(P(1, 2), 'A double salt in water:', ['gives only a complex ion', 'gives all the ions of its simple salts', 'never dissolves', 'gives no ions'], 1),
  mcq(P(1, 3), 'To make Mohr’s salt, iron(II) sulphate and ammonium sulphate are mixed in the mole ratio:', ['1 : 1', '1 : 2', '2 : 1', '7 : 6'], 0),
  ar(P(1, 2), 'A few drops of dilute H₂SO₄ are added while dissolving FeSO₄.', 'The acid prevents hydrolysis of the salt.', 1),
  ar(P(1, 2), 'A hot, saturated solution is cooled slowly for good crystals.', 'Slow cooling gives larger, purer crystals.', 1),
  theory('reason', P(1, 2), 'Give a reason: a solution of Mohr’s salt isn’t boiled for long during its preparation.', ['Iron(II) ions would be oxidised to iron(III) on long heating in air.']),
  theory('reason', P(1, 2), 'Give a reason: the crystals are often washed with a little alcohol.', ['The salt hardly dissolves in alcohol, so impurities leave without losing the crystals, and alcohol dries quickly.']),
  theory('reason', P(2, 2), 'Give a reason: the iron(II) sulphate solution is filtered while hot.', ['Any unreacted iron and insoluble impurities are removed.', 'The salt stays in solution when hot, and would crystallise on the filter paper if cooled.']),
  theory('distinguish', P(2, 2), 'Distinguish between a double salt and a coordination compound.', ['A double salt breaks up in water into all of its simple ions.', 'A coordination compound keeps its complex ion intact in solution.']),
  theory('short', P(2, 1), 'How do you know when a solution has reached the crystallisation point?', ['Dip a glass rod in, and take it out.', 'A thin crust of crystals forms on it as it cools.']),
  theory('short', P(3, 2), 'Outline the preparation of crystals of CuSO₄·5H₂O from copper(II) oxide.', ['Add CuO to warm dilute H₂SO₄ until no more dissolves, then filter off the excess.', 'Heat the filtrate to the crystallisation point.', 'Cool slowly, filter off the crystals and dry them between filter papers.']),
  theory('short', P(3, 2), 'Outline the preparation of iron(II) sulphate crystals from iron filings.', ['Warm excess iron filings with dilute H₂SO₄ until effervescence stops.', 'Filter while hot, and concentrate the filtrate with a few drops of acid.', 'Cool, filter off the pale green crystals and dry them.']),
  theory('short', P(2, 3), 'What mass of (NH₄)₂SO₄ is needed for 7.00 g of FeSO₄·7H₂O, to make Mohr’s salt? (M: FeSO₄·7H₂O = 278, (NH₄)₂SO₄ = 132.)', ['The iron salt is 7.00/278 = 0.0252 mol.', 'The mass needed is 0.0252 × 132 = 3.32 g.'], { format: 'numerical' }),
  theory('short', P(3, 3), 'Excess dilute H₂SO₄ reacts with 5.6 g of iron, and gives 22.2 g of FeSO₄·7H₂O crystals. Find the percentage yield. (Fe = 56, FeSO₄·7H₂O = 278.)', ['Iron is 0.10 mol, so 0.10 mol of crystals are possible.', 'That is 27.8 g.', 'Yield = 22.2/27.8 × 100 = 80%.'], { format: 'numerical' }),
  theory('short', P(2, 2), 'A student’s Mohr’s salt solution turns yellow-brown on heating. Say what has happened, and how to prevent it.', ['Iron(II) has been oxidised to iron(III) by air.', 'Add a few drops of dilute H₂SO₄, and don’t heat it for long.'], { format: 'predict' }),
  theory('short', P(2, 2), 'A student boils a solution of potash alum to dryness to get the crystals. Find the mistake.', ['Heating it to dryness drives off the water of crystallisation.', 'It should be heated only to the crystallisation point, then cooled slowly.'], { format: 'mistake' }),
  // ---- Paper chromatography
  mcq(C(1, 1), 'The Rf value of a substance is the distance it moves divided by the distance moved by:', ['the paper', 'the solvent', 'the slowest pigment', 'the baseline'], 1),
  mcq(C(1, 1), 'The baseline in paper chromatography is drawn in pencil because:', ['ink looks untidy', 'pencil doesn’t dissolve and move', 'pencil is cheaper', 'ink makes the paper wet'], 1),
  mcq(C(1, 2), 'A pigment moves 3.6 cm while the solvent moves 9.0 cm. Its Rf value is:', ['0.40', '2.5', '3.6', '0.25'], 0),
  mcq(C(1, 2), 'The value of Rf for any spot on a chromatogram is:', ['always above 1', 'always 1 or less', 'always negative', 'the same for all pigments'], 1),
  mcq(C(1, 2), 'In paper chromatography, the stationary phase is mainly:', ['the moving solvent', 'water held in the paper’s fibres', 'the pigment', 'the air in the jar'], 1),
  ar(C(1, 2), 'The solvent level must start below the baseline.', 'Otherwise the spots would dissolve straight into the solvent in the jar.', 1),
  ar(C(1, 2), 'A pure substance gives one spot in a suitable solvent.', 'A mixture’s components move at different rates.', 2),
  theory('reason', C(1, 1), 'Give a reason: the jar is kept covered during a chromatography run.', ['The air stays saturated with solvent vapour, so the solvent doesn’t evaporate from the paper.']),
  theory('reason', C(2, 2), 'Give a reason: different pigments separate on the paper.', ['Each pigment divides between the water in the paper and the moving solvent in its own proportion.', 'So those more soluble in the solvent travel further.']),
  theory('distinguish', C(2, 2), 'Distinguish between the stationary phase and the mobile phase in paper chromatography.', ['The stationary phase stays in place: water held on the paper’s fibres.', 'The mobile phase moves: the solvent rising up the paper.']),
  theory('short', C(2, 1), 'Why must the solvent front be marked at once, when the paper is taken from the jar?', ['The solvent evaporates quickly, and the front disappears.', 'Its distance is needed for each Rf value.']),
  theory('short', C(3, 2), 'Describe how you would separate the pigments in a leaf extract by paper chromatography.', ['Crush the leaves in a solvent, and spot the concentrated extract several times on a pencil baseline, drying each time.', 'Hang the paper in a covered jar, with the solvent below the line.', 'Remove it when the solvent is near the top, mark the front and find each Rf value.']),
  theory('short', C(3, 2), 'An ink gives spots at 2.4 cm, 4.8 cm and 7.2 cm, with the solvent front at 8.0 cm.\n(i) How many dyes can you say it has at least? [1]\n(ii) Find the Rf of the fastest dye. [1]\n(iii) Find the Rf of the slowest dye. [1]', ['(i) At least three.', '(ii) 7.2/8.0 = 0.90.', '(iii) 2.4/8.0 = 0.30.'], { format: 'data' }),
  theory('short', C(2, 3), 'A student finds an Rf of 1.2 for a pigment. Find the mistake, and say what must have happened.', ['Rf can’t exceed 1, as no substance travels further than its solvent.', 'The student has divided the wrong way, or measured the solvent front wrongly.'], { format: 'mistake' }),
  theory('short', C(2, 2), 'A student draws the baseline in ink, and sees a coloured streak. Say why, and what to do.', ['The ink’s dyes dissolved in the solvent, and moved up the paper with the pigments.', 'Repeat the run with a pencil line.'], { format: 'predict' }),
  theory('short', C(2, 3), 'A spot has an Rf of 0.60 with solvent A and 0.25 with solvent B. Why are they different, and is one wrong?', ['Rf depends on the solvent, since the substance’s solubility is different in each.', 'Neither is wrong, and an Rf value must quote its solvent.']),
  theory('short', C(3, 3), 'A forensic chemist compares ink from a note with the inks of two pens.\n(i) What would the chemist run alongside the note’s ink? [1]\n(ii) What result shows the note matches one of the pens? [1]\n(iii) Why must they all run on one sheet, in the same jar? [1]', ['(i) Spots of the two pens’ inks, on the same baseline.', '(ii) The same spots, at the same heights, as the note’s ink.', '(iii) So the solvent, the paper and the temperature are the same for all.'], { style: 'cbq-style', context: 'forensics' }),
];

export default questions;
