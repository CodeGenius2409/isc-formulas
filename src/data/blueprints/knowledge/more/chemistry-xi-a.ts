// Chemistry, Class XI: more knowledge, written fresh from the syllabus and standard texts. Not from any paper.
import type { Facts } from '../../dsl';

const knowledge: Record<string, Facts> = {
  '1a': {
    truths: [
      ['Precision is about how close repeated readings are to each other.', 'Precision is about how close a reading is to the true value.'],
    ],
  },

  '1c': {
    define: [
      ['equivalent mass', 'The mass of a substance that reacts with or replaces 1 g of hydrogen, 8 g of oxygen or 35.5 g of chlorine.'],
      ['a gram equivalent', 'The equivalent mass of a substance expressed in grams.'],
      ['the basicity of an acid', 'The number of replaceable hydrogen ions in one molecule of the acid.'],
      ['the acidity of a base', 'The number of replaceable hydroxide ions in one formula unit of the base.'],
      ['percentage by mass', 'The mass of solute in grams per 100 g of solution.'],
      ['percentage by mass per volume', 'The mass of solute in grams per 100 mL of solution.'],
      ['volumetric analysis', 'Finding how much of a substance is present by measuring the volume of a solution that reacts with it.'],
      ['a titrant', 'The solution of known concentration added from a burette in a titration.'],
    ],
    recall: [
      ['The equivalent mass of H₂SO₄ in a full neutralisation is:', '49', '98', '24.5', '196'],
      ['The equivalent mass of NaOH is:', '40', '80', '20', '23'],
      ['The equivalent mass of Na₂CO₃ in a full neutralisation is:', '53', '106', '26.5', '212'],
      ['The equivalent mass of Ca(OH)₂ is:', '37', '74', '18.5', '148'],
      ['The basicity of H₃PO₄ is:', '3', '1', '2', '4'],
      ['The basicity of H₃PO₃ is:', '2', '3', '1', '4'],
      ['The normality of 1 M H₂SO₄ in a full neutralisation is:', '2 N', '1 N', '0.5 N', '4 N'],
      ['The normality of 0.1 M Na₂CO₃ in a full neutralisation is:', '0.2 N', '0.1 N', '0.05 N', '0.4 N'],
      ['The law of normality for a titration is:', 'N₁V₁ = N₂V₂', 'N₁/V₁ = N₂/V₂', 'N₁V₂ = N₂V₁', 'N₁ + V₁ = N₂ + V₂'],
      ['Which is a primary standard?', 'anhydrous Na₂CO₃', 'NaOH', 'KMnO₄', 'HCl'],
      ['Which unit doesn’t depend on temperature?', 'molality', 'molarity', 'normality', 'g L⁻¹'],
      ['Concentrated acid has a molarity of 18 M. To make 1 L of 1 M, you take:', '55.6 mL', '18 mL', '180 mL', '1 mL'],
    ],
    truths: [
      ['The number of gram equivalents is the mass divided by the equivalent mass.', 'The number of gram equivalents is the mass times the equivalent mass.'],
      ['Normality equals molarity times the n-factor.', 'Normality equals molarity divided by the n-factor.'],
      ['An equal number of gram equivalents react in a titration.', 'An equal mass of each substance reacts in a titration.'],
      ['Molarity depends on temperature, as the volume of a solution changes.', 'Molarity is fixed at all temperatures.'],
      ['A primary standard should be pure, stable and not hygroscopic.', 'A primary standard should absorb water from the air.'],
      ['Mole fractions have no units.', 'Mole fractions are in mol L⁻¹.'],
      ['Diluting a solution keeps the amount of solute the same.', 'Diluting a solution raises the amount of solute.'],
    ],
    reason: [
      ['HCl isn’t a primary standard.', 'Its concentrated solution varies in strength and gives off fumes.'],
      ['Equivalent mass depends on the reaction.', 'The n-factor of a substance can differ between reactions.'],
    ],
    links: [
      ['same', 'A primary standard should', 'Sodium hydroxide is not'],
      ['same', 'Normality equals molarity', 'The number of gram equivalents'],
      ['contrast', 'the basicity of an acid', 'the acidity of a base'],
      ['contrast', 'percentage by mass', 'percentage by mass per volume'],
      ['contrast', 'equivalent mass', 'a gram equivalent'],
    ],
  },

  '2a': {
    recall: [
      ['The charge on a neutron is:', 'zero', '+1', '−1', '+2'],
    ],
  },

  '5b': {
    truths: [
      ['The entropy of the universe rises in a spontaneous process.', 'The entropy of the universe falls in a spontaneous process.'],
    ],
  },

  '6b': {
    define: [
      ['an electrolyte', 'A substance that conducts electricity when it is melted or dissolved, by forming ions.'],
      ['a non-electrolyte', 'A substance that doesn’t form ions in solution, and so doesn’t conduct, such as glucose.'],
      ['ionisation', 'The process by which a neutral substance forms ions in solution.'],
      ['degree of ionisation', 'The fraction of a dissolved substance that has ionised.'],
      ['a polybasic acid', 'An acid that gives more than one H⁺ per molecule, in stages.'],
      ['pOH', 'The negative logarithm to base ten of the hydroxide ion concentration.'],
      ['the ionic product of water', 'The product of [H⁺] and [OH⁻] in water, which is 1 × 10⁻¹⁴ at 298 K.'],
      ['a pH indicator', 'A weak acid or base whose colour changes over a certain pH range.'],
      ['an acidic buffer', 'A mixture of a weak acid and its salt with a strong base.'],
      ['a basic buffer', 'A mixture of a weak base and its salt with a strong acid.'],
      ['hydrolysis of a salt', 'The reaction of the ions of a salt with water, which changes the pH.'],
      ['solubility', 'The largest amount of a substance that dissolves in a given amount of solvent at a given temperature.'],
      ['a Brønsted acid', 'A proton donor.'],
      ['a Brønsted base', 'A proton acceptor.'],
    ],
    recall: [
      ['The pH of 0.01 M HCl is:', '2', '1', '12', '0.01'],
      ['The pH of 0.001 M NaOH is:', '11', '3', '10', '0.001'],
      ['The conjugate base of H₂SO₄ is:', 'HSO₄⁻', 'SO₄²⁻', 'H₃O⁺', 'OH⁻'],
      ['The conjugate acid of NH₃ is:', 'NH₄⁺', 'NH₂⁻', 'N₂', 'H₂O'],
      ['The Henderson equation for an acidic buffer is:', 'pH = pKa + log([salt]/[acid])', 'pH = pKa − log([salt]/[acid])', 'pH = pKa × [salt]/[acid]', 'pH = [salt]/[acid] − pKa'],
      ['A solution of CH₃COOH and CH₃COONa is:', 'an acidic buffer', 'a basic buffer', 'a strong acid', 'neutral at all times'],
      ['A solution of NH₄OH and NH₄Cl is:', 'a basic buffer', 'an acidic buffer', 'a strong base', 'a neutral salt'],
      ['For a sparingly soluble salt AB, Ksp equals:', 's²', 's', '4s³', '2s'],
      ['For a sparingly soluble salt AB₂, Ksp equals:', '4s³', 's²', '2s²', 's³'],
      ['Sodium chloride solution in water is:', 'neutral', 'acidic', 'basic', 'strongly basic'],
      ['Which salt in water gives an acidic solution?', 'NH₄Cl', 'NaCl', 'CH₃COONa', 'KNO₃'],
      ['Which salt in water gives a basic solution?', 'Na₂CO₃', 'NH₄Cl', 'NaCl', 'KNO₃'],
      ['Phenolphthalein’s colour in strong alkali is:', 'pink', 'colourless', 'yellow', 'red only in acid'],
      ['Methyl orange’s colour in strong acid is:', 'red', 'yellow', 'colourless', 'pink only in alkali'],
      ['Phenolphthalein changes colour over a pH range of about:', '8 to 10', '3 to 4.5', '1 to 2', '12 to 14'],
      ['Which is a strong electrolyte?', 'NaCl', 'CH₃COOH', 'NH₄OH', 'glucose'],
      ['Which is a non-electrolyte?', 'urea', 'NaCl', 'HCl', 'NH₄OH'],
      ['The degree of ionisation of a weak acid at concentration c is about:', '√(Ka/c)', 'Ka/c', 'Ka × c', '√(c/Ka)'],
    ],
    truths: [
      ['The degree of ionisation of a weak electrolyte rises on dilution.', 'The degree of ionisation of a weak electrolyte falls on dilution.'],
      ['For a polybasic acid, Ka₁ is larger than Ka₂.', 'For a polybasic acid, Ka₂ is larger than Ka₁.'],
      ['A lower pH means more H⁺ ions.', 'A lower pH means fewer H⁺ ions.'],
      ['One pH unit is a tenfold change in H⁺ concentration.', 'One pH unit is a twofold change in H⁺ concentration.'],
      ['Kw rises with temperature.', 'Kw falls with temperature.'],
      ['The pH of pure water falls as it’s heated, though it stays neutral.', 'The pH of pure water rises as it’s heated, and it turns basic.'],
      ['The common ion effect lowers the ionisation of a weak electrolyte.', 'The common ion effect raises the ionisation of a weak electrolyte.'],
      ['The common ion effect lowers the solubility of a sparingly soluble salt.', 'The common ion effect raises the solubility of a sparingly soluble salt.'],
      ['Buffer capacity is greatest when the salt and acid concentrations are equal.', 'Buffer capacity is greatest when one of the two is missing.'],
      ['A salt of a strong acid and a weak base gives an acidic solution.', 'A salt of a strong acid and a weak base gives a basic solution.'],
      ['A salt of a strong acid and a strong base doesn’t hydrolyse.', 'A salt of a strong acid and a strong base hydrolyses fully.'],
      ['Ksp changes only with temperature.', 'Ksp changes with every addition of a common ion.'],
      ['Precipitation stops once the ionic product equals Ksp.', 'Precipitation goes on till the ionic product is zero.'],
      ['Blood is a natural buffer with a pH of about 7.4.', 'Blood has a pH of about 3 and has no buffer in it.'],
      ['The conjugate base of a strong acid is weak.', 'The conjugate base of a strong acid is strong.'],
      ['An indicator changes colour when its acid and base forms are about equal.', 'An indicator changes colour only when all of it has gone.'],
    ],
    reason: [
      ['A solution of ammonium chloride is acidic.', 'NH₄⁺ reacts with water to give H₃O⁺.'],
      ['Group II sulphides precipitate in acid, but group IV ones need ammonia.', 'H⁺ lowers the S²⁻ concentration by the common ion effect, so only the lower Ksp values are reached.'],
      ['The pH of a buffer changes little on dilution.', 'The ratio of salt to acid stays the same.'],
      ['H₂SO₄ is a stronger acid than H₂SO₃.', 'It has more oxygen atoms drawing electrons from O–H, and its anion is more stable.'],
      ['NaCl can’t act as a buffer with HCl.', 'A buffer needs a weak acid or base with its salt.'],
    ],
    explain: [
      ['What is the relation between pKa and pKb for a conjugate pair at 298 K?', 'pKa + pKb = 14.'],
      ['Find when a precipitate forms in terms of ionic product and Ksp.', 'A precipitate forms when the ionic product is more than Ksp.'],
      ['Give two uses of the common ion effect.', 'Precipitating salts in qualitative analysis.', 'Purifying sodium chloride.'],
      ['Give the formula for the pH of a salt of a weak acid and a strong base.', 'pH = 7 + ½pKa + ½log c.'],
    ],
    links: [
      ['same', 'The common ion effect lowers the ionisation', 'The common ion effect lowers the solubility'],
      ['same', 'A lower pH means', 'One pH unit is'],
      ['same', 'A salt of a strong acid and a weak', 'A salt of a strong acid and a strong'],
      ['cause', 'The pH of pure water falls', 'Kw rises with temperature'],
      ['contrast', 'an acidic buffer', 'a basic buffer'],
      ['contrast', 'an electrolyte', 'a non-electrolyte'],
      ['contrast', 'a Brønsted acid', 'a Brønsted base'],
      ['contrast', 'pH', 'pOH'],
      ['contrast', 'ionisation', 'degree of ionisation'],
      ['contrast', 'solubility', 'solubility product'],
    ],
  },

  '8b': {
    recall: [
      ['A compound with a boiling point well above its decomposition temperature can be purified by:', 'distillation under reduced pressure', 'simple distillation at normal pressure', 'filtration', 'sublimation'],
    ],
    truths: [
      ['Sublimation separates a solid that sublimes from one that doesn’t.', 'Sublimation separates two liquids with close boiling points.'],
    ],
  },

  '9a': {
    recall: [
      ['Pyrolysis of alkanes is also called:', 'cracking', 'fermentation', 'hydration', 'polymerisation'],
    ],
    explain: [
      ['Write the balanced equation for the complete combustion of methane.', 'CH₄ + 2O₂ → CO₂ + 2H₂O.'],
    ],
  },

  '9b': {
    truths: [
      ['Ozonolysis splits an alkene at its double bond.', 'Ozonolysis adds water to an alkene without splitting it.'],
    ],
  },

  '9c': {
    recall: [
      ['Which has the shortest carbon–carbon bond?', 'ethyne', 'ethene', 'ethane', 'benzene'],
      ['Ethyne with excess hydrogen over nickel gives:', 'ethane', 'ethene alone', 'methane', 'benzene'],
    ],
    truths: [
      ['Ethyne with HBr can add twice, following Markovnikov’s rule.', 'Ethyne with HBr can’t add at all.'],
    ],
  },

  '10a': {
    define: [
      ['a titre', 'The volume of solution added from a burette to reach the end point.'],
      ['concordant readings', 'Titres that agree closely, usually to within 0.1 mL.'],
    ],
    recall: [
      ['Methyl orange in a Na₂CO₃ titration with acid changes from:', 'yellow to pink', 'pink to colourless', 'blue to red', 'green to violet'],
      ['One mole of Na₂CO₃ needs this much HCl to methyl orange’s end point:', '2 moles', '1 mole', '3 moles', '0.5 moles'],
    ],
    explain: [
      ['How is percentage purity found from a titration?', 'Divide the mass of pure substance found by the mass of the sample taken, and multiply by 100.'],
    ],
  },

  '10b': {
    define: [
      ['a confirmatory test', 'A specific test that proves which ion is present.'],
      ['the original solution', 'A solution of the salt under test, made in water or dilute acid, used for wet tests.'],
      ['a charcoal cavity test', 'A dry test in which a salt is heated on charcoal, which shows its cation from the residue or bead.'],
    ],
    recall: [
      ['Which gas turns acidified potassium dichromate paper green?', 'SO₂', 'CO₂', 'NH₃', 'H₂'],
      ['Which gas turns lead acetate paper black?', 'H₂S', 'CO₂', 'SO₂', 'Cl₂'],
      ['Which reagent with oxalate gives a white precipitate insoluble in acetic acid?', 'CaCl₂', 'NaOH', 'HCl', 'KI'],
      ['Which anion turns the ammonium molybdate test yellow?', 'PO₄³⁻', 'Cl⁻', 'SO₄²⁻', 'NO₃⁻'],
      ['A deep blue solution on adding excess ammonia shows:', 'Cu²⁺', 'Fe³⁺', 'Zn²⁺', 'Pb²⁺'],
      ['A blood-red colour with KSCN shows:', 'Fe³⁺', 'Cu²⁺', 'Ni²⁺', 'Mn²⁺'],
      ['A yellow precipitate with potassium chromate in acetic acid shows:', 'Ba²⁺', 'Mg²⁺', 'Zn²⁺', 'Ni²⁺'],
      ['A red precipitate with dimethylglyoxime shows:', 'Ni²⁺', 'Co²⁺', 'Cu²⁺', 'Zn²⁺'],
      ['A yellow precipitate with KI in hot water shows:', 'Pb²⁺', 'Cu²⁺', 'Zn²⁺', 'Al³⁺'],
      ['A white precipitate of aluminium hydroxide dissolves in excess of:', 'NaOH', 'NH₄OH', 'water', 'CO₂'],
    ],
    truths: [
      ['Group reagents are used in a fixed order of groups.', 'Group reagents can be used in any order at all.'],
      ['Dilute acid is added to the original solution in small amounts, to look for a gas.', 'A large amount of concentrated acid is always poured in first.'],
      ['A flame test uses a clean platinum or nichrome wire.', 'A flame test uses a dirty iron wire.'],
    ],
    explain: [
      ['How is a salt’s acid radical usually tried first?', 'Add dilute HCl or H₂SO₄ and look for a gas.'],
    ],
  },

  '10c': {
    define: [
      ['potash alum', 'The double salt K₂SO₄·Al₂(SO₄)₃·24H₂O.'],
      ['Mohr’s salt', 'The double salt FeSO₄·(NH₄)₂SO₄·6H₂O.'],
      ['crystallisation', 'The forming of a pure solid from a hot saturated solution as it cools.'],
      ['a double salt', 'A salt of two simple salts in a fixed ratio, which gives all its ions in solution.'],
    ],
    recall: [
      ['Potash alum is made from aluminium, KOH and:', 'H₂SO₄', 'HCl', 'HNO₃', 'CH₃COOH'],
      ['Mohr’s salt is made from equal moles of ferrous sulphate and:', 'ammonium sulphate', 'potassium sulphate', 'sodium chloride', 'aluminium sulphate'],
      ['A few drops of dilute H₂SO₄ are added in preparing Mohr’s salt to:', 'prevent the hydrolysis of Fe²⁺', 'colour the crystals', 'raise the pH', 'remove water'],
      ['The colour of Mohr’s salt crystals is:', 'pale green', 'deep blue', 'white', 'orange'],
      ['The colour of copper sulphate crystals is:', 'blue', 'green', 'pink', 'white'],
      ['The shape of a potash alum crystal is commonly:', 'octahedral', 'needle-like', 'cubic only', 'hexagonal only'],
      ['CuSO₄ crystals are made from copper oxide and:', 'dilute H₂SO₄', 'dilute HCl', 'NaOH', 'water alone'],
    ],
    truths: [
      ['Crystals are washed with a little cold water, as they dissolve less in it.', 'Crystals are washed with lots of hot water, as they dissolve less in it.'],
      ['A saturated solution gives crystals as it cools.', 'A saturated solution gives crystals only if heated further.'],
      ['Slow cooling gives larger crystals.', 'Slow cooling gives smaller crystals.'],
      ['Fe²⁺ in solution is easily oxidised by air to Fe³⁺.', 'Fe²⁺ in solution can never be oxidised by air.'],
    ],
  },

  '10d': {
    define: [
      ['the Rf value', 'The distance moved by a substance divided by the distance moved by the solvent front.'],
      ['the stationary phase', 'The phase that stays still in chromatography, such as the water held on paper.'],
      ['the mobile phase', 'The phase that moves in chromatography, such as the solvent rising up the paper.'],
      ['a chromatogram', 'The developed paper or plate, which shows how the components have separated.'],
      ['the solvent front', 'The furthest point reached by the rising solvent.'],
    ],
    recall: [
      ['The spot is put on the paper:', 'above the solvent level', 'below the solvent level', 'on the solvent', 'after the solvent has risen'],
      ['A larger Rf value shows a substance that:', 'moves further with the solvent', 'sticks more to the paper', 'can’t dissolve at all', 'has no colour'],
      ['Which is commonly separated by paper chromatography?', 'plant pigments', 'metals in an alloy', 'sand and salt', 'iron filings'],
      ['If the solvent rises 10 cm and a spot rises 4 cm, the Rf value is:', '0.4', '2.5', '4', '40'],
      ['The base line is drawn with a pencil, because:', 'its mark doesn’t dissolve in the solvent', 'it is coloured', 'it is the cheapest', 'it evaporates'],
    ],
    truths: [
      ['The Rf value has no units.', 'The Rf value is in centimetres.'],
      ['The Rf value can’t be more than 1.', 'The Rf value is always more than 1.'],
      ['Paper chromatography separates by partition between the two phases.', 'Paper chromatography separates by particle size alone.'],
    ],
    explain: [
      ['Why is the chromatography jar covered?', 'To keep its air saturated with solvent vapour.'],
      ['Why is the spot kept small?', 'A small spot gives clear, well-separated bands.'],
    ],
  },
};

export default knowledge;
