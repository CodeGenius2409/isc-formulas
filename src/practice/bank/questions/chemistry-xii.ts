// Original questions in the style of ISC Chemistry Class XII. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory, num } = bank('chemistry', 'XII');

const questions: BankDef[] = [
  // One mark
  mcq([1, 'a', 1, 1], 'Which of these is a colligative property?', ['Vapour pressure', 'Osmotic pressure', 'Density', 'Viscosity'], 1),
  mcq([1, 'a', 1, 2], 'Which aqueous solution of equal molality has the lowest freezing point?', ['Glucose', 'Sodium chloride', 'Calcium chloride', 'Urea'], 2, 'CaCl₂ gives three ions per formula unit, so its van’t Hoff factor is the largest.'),
  ar([1, 'a', 1, 2], 'A solution of ethanol and water shows positive deviation from Raoult’s law.', 'Ethanol-water attractions in the mixture are weaker than the attractions in the pure liquids.', 1),
  mcq([2, 'a', 1, 1], 'In a galvanic cell, oxidation takes place at the:', ['cathode', 'anode', 'salt bridge', 'external wire'], 1),
  mcq([2, 'b', 1, 2], 'On diluting a solution of a weak electrolyte, its molar conductivity:', ['falls', 'rises', 'stays the same', 'becomes zero'], 1, 'Dilution raises the degree of ionisation and the volume containing one mole.'),
  ar([2, 'b', 1, 2], 'The conductivity of an electrolyte decreases on dilution.', 'The number of ions per unit volume falls on dilution.', 1),
  mcq([2, 'c', 1, 2], 'Which of these is a secondary cell?', ['Dry cell', 'Lead storage battery', 'Mercury cell', 'Daniell cell'], 1),
  mcq([3, 'a', 1, 1], 'The unit of the rate constant of a first order reaction is:', ['mol L⁻¹ s⁻¹', 'L mol⁻¹ s⁻¹', 's⁻¹', 'mol² L⁻² s⁻¹'], 2),
  mcq([3, 'a', 1, 2], 'The half-life of a zero order reaction:', ['does not depend on the initial concentration', 'is directly proportional to the initial concentration', 'is inversely proportional to the initial concentration', 'is always 0.693/k'], 1),
  ar([3, 'b', 1, 2], 'A catalyst increases the rate of a reaction.', 'A catalyst changes the equilibrium constant of the reaction.', 3, 'A catalyst lowers the activation energy. It leaves the equilibrium constant unchanged.'),
  mcq([4, 'a', 1, 1], 'Which ion is coloured in aqueous solution?', ['Sc³⁺', 'Zn²⁺', 'Ti⁴⁺', 'Cu²⁺'], 3, 'Cu²⁺ has one unpaired 3d electron. The others have an empty or full d subshell.'),
  ar([4, 'a', 1, 2], 'Transition metals show variable oxidation states.', 'The energies of their (n − 1)d and ns electrons are very close.', 1),
  mcq([4, 'b', 1, 2], 'In acidic medium, one mole of KMnO₄ gains how many moles of electrons?', ['1', '3', '5', '6'], 2, 'Mn goes from +7 to +2.'),
  mcq([5, 'a', 1, 1], 'What is the coordination number of the central metal in [Co(en)₃]³⁺?', ['3', '4', '6', '9'], 2, 'Ethane-1,2-diamine is bidentate.'),
  mcq([5, 'a', 1, 2], 'The type of isomerism shown by [Co(NH₃)₅Br]SO₄ and [Co(NH₃)₅SO₄]Br is:', ['linkage', 'ionisation', 'coordination', 'optical'], 1),
  ar([5, 'a', 1, 3], '[Fe(CN)₆]³⁻ is a low-spin complex.', 'CN⁻ is a strong field ligand and pairs up the d electrons.', 1),
  mcq([6, 'a', 1, 2], 'Which alkyl halide reacts fastest by the Sₙ1 mechanism?', ['CH₃Br', 'CH₃CH₂Br', '(CH₃)₂CHBr', '(CH₃)₃CBr'], 3, 'A tertiary carbocation is the most stable intermediate.'),
  mcq([6, 'a', 1, 1], 'Name the reaction in which an alkyl chloride is converted to an alkyl iodide using NaI in dry acetone.', ['Swarts', 'Finkelstein', 'Wurtz', 'Sandmeyer'], 1),
  mcq([6, 'b', 1, 2], 'Chlorobenzene does not undergo nucleophilic substitution readily because:', ['the C-Cl bond has partial double bond character', 'chlorine is strongly electron-releasing', 'benzene is saturated', 'the C-Cl bond is ionic'], 0, 'Resonance gives the bond partial double bond character.'),
  mcq([6, 'c', 1, 1], 'Chloroform is stored in dark bottles filled to the top because, in air and light, it forms the poison:', ['ethanal', 'phosgene', 'carbon tetrachloride', 'DDT'], 1),
  mcq([7, 'b', 1, 2], 'Which is the strongest acid?', ['Phenol', '2-Nitrophenol', '2,4,6-Trinitrophenol', 'Ethanol'], 2, 'Three nitro groups stabilise the phenoxide ion the most.'),
  mcq([7, 'a', 1, 1], 'The Lucas test distinguishes between:', ['aldehydes and ketones', 'primary, secondary and tertiary alcohols', 'phenol and aniline', 'ethers and esters'], 1),
  ar([7, 'c', 1, 2], 'Ethers have higher boiling points than isomeric alcohols.', 'Ether molecules cannot form hydrogen bonds with one another.', 4, 'With no hydrogen bonding between their molecules, ethers boil lower.'),
  mcq([8, 'a', 1, 2], 'Which compound gives the iodoform test?', ['Methanal', 'Benzaldehyde', 'Propanone', 'Pentan-3-one'], 2, 'A CH₃CO- group is needed.'),
  mcq([8, 'a', 1, 2], 'Which reaction converts a carbonyl group into a CH₂ group using zinc amalgam and concentrated HCl?', ['Clemmensen', 'Rosenmund', 'Cannizzaro', 'Etard'], 0),
  ar([8, 'b', 1, 2], 'Chloroethanoic acid is a stronger acid than ethanoic acid.', 'The -I effect of chlorine stabilises the carboxylate ion.', 1),
  mcq([9, 'a', 1, 2], 'In aqueous solution, which is the strongest base?', ['Aniline', 'Methanamine', 'Dimethylamine', 'Ammonia'], 2),
  mcq([9, 'a', 1, 1], 'Which test is given only by primary amines?', ['Lucas test', 'Carbylamine test', 'Iodoform test', 'Tollens’ test'], 1),
  ar([9, 'c', 1, 2], 'Aromatic diazonium salts are more stable than aliphatic ones.', 'Diazotisation of aniline is carried out at 273-278 K.', 2, 'Both are true, but the stability comes from resonance with the ring.'),
  mcq([10, 'a', 1, 1], 'Which of these is a non-reducing sugar?', ['Glucose', 'Fructose', 'Sucrose', 'Maltose'], 2),
  mcq([10, 'b', 1, 1], 'Amino acids linked together form which bond between them?', ['Glycosidic', 'Peptide', 'Phosphodiester', 'Ester'], 1),
  mcq([10, 'c', 1, 1], 'A deficiency of vitamin C causes:', ['beri-beri', 'rickets', 'scurvy', 'night blindness'], 2),
  mcq([10, 'd', 1, 2], 'Which base is found in RNA but not in DNA?', ['Adenine', 'Guanine', 'Cytosine', 'Uracil'], 3),
  mcq([7, 'b', 1, 2], 'Identify the functional group in this compound.', ['Phenol', 'Aldehyde', 'Ether', 'Carboxylic acid'], 0, 'An -OH group directly on a benzene ring.', { structure: { list: ['phenol'], unnamed: 1 } }),
  mcq([8, 'b', 1, 2], 'Name this compound.', ['Benzoic acid', 'Benzaldehyde', 'Phenol', 'Acetophenone'], 0, undefined, { structure: { list: ['benzoic-acid'], unnamed: 1 } }),

  // Two marks
  num([1, 'a', 2, 1], {
    text: 'What is the osmotic pressure, at {T} K, of a {C} mol/L solution of a non-electrolyte? (R = 0.0821 L atm K⁻¹ mol⁻¹)',
    vars: { T: [290, 320, 10], C: [0.1, 0.5, 0.1] },
    parts: [{ ask: 'Osmotic pressure', use: 'c-xii-2-5', find: 'pi_o', given: { C: 'C mol/L', T: 'T K' }, unit: 'atm', marks: 2 }],
  }),
  num([1, 'a', 2, 2], {
    text: 'A solution contains {W} g of a non-volatile solute in {S} g of water, and boils {D} K above pure water. Kb of water is 0.52 K kg mol⁻¹. Find the molar mass of the solute.',
    vars: { W: [5, 20, 5], S: [100, 500, 100], D: [0.1, 0.4, 0.1] },
    parts: [{ ask: 'Molar mass of the solute', use: 'c-xii-2-56', find: 'M_2', given: { K_b: '0.52', w_2: 'W', DeltaT_b: 'D', w_1: 'S' }, marks: 2 }],
  }),
  num([2, 'a', 2, 2], {
    text: 'Calculate the standard Gibbs energy change for a cell reaction involving {N} electrons with E°cell = {E} V. (F = 96500 C mol⁻¹)',
    vars: { N: [1, 3, 1], E: [0.5, 2, 0.5] },
    parts: [{ ask: 'Standard Gibbs energy change', use: 'c-xii-3-3', find: 'DeltaG0', given: { n: 'N', E0: 'E V' }, unit: 'kJ/mol', marks: 2 }],
  }),
  num([2, 'b', 2, 1], {
    text: 'A current of {I} A is passed through a copper(II) sulphate solution for {T} s. Find the mass of copper deposited.',
    vars: { I: [2, 8, 2], T: [600, 1800, 600] },
    parts: [{ ask: 'Mass of copper deposited (M = 63.5 g/mol, 2 electrons per Cu²⁺)', use: 'c-xii-3-7', find: 'm', given: { M: '63.5 g/mol', I: 'I A', t: 'T s', n: '2' }, marks: 2 }],
  }),
  theory('short', [2, 'b', 2, 1], 'State Kohlrausch’s law, and give one use of it.', ['At infinite dilution, the molar conductivity of an electrolyte is the sum of the limiting molar conductivities of its cation and anion.', 'It lets us find the limiting molar conductivity of a weak electrolyte, which cannot be found by extrapolating a graph.']),
  num([3, 'a', 2, 1], {
    text: 'A first order reaction has a rate constant of {K} × 10⁻³ s⁻¹. Calculate its half-life.',
    vars: { K: [1, 8, 1] },
    parts: [{ ask: 'Half-life', use: 'c-xii-4-39', find: 't_half', given: { k: 'K*0.001 s^-1' }, marks: 2 }],
  }),
  theory('distinguish', [3, 'a', 2, 2], 'Distinguish between the order and the molecularity of a reaction, giving two differences.', ['Order is found by experiment. Molecularity is a theoretical count of the species colliding in an elementary step.', 'Order can be zero or a fraction. Molecularity is always a whole number, and is never zero.']),
  theory('reason', [4, 'a', 2, 2], 'Give reasons. (a) Zinc has the lowest enthalpy of atomisation in the 3d series. (b) Transition metals form alloys easily.', ['(a) Its 3d electrons are all paired and do not take part in metallic bonding, so that bonding is weak.', '(b) Their atomic sizes are similar, so atoms of one metal can replace atoms of another in the lattice.']),
  theory('reaction', [4, 'b', 2, 2], 'Write the balanced ionic equation for acidified potassium dichromate reacting with (a) iron(II) ions and (b) iodide ions.', ['(a) Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O', '(b) Cr₂O₇²⁻ + 14H⁺ + 6I⁻ → 2Cr³⁺ + 3I₂ + 7H₂O']),
  theory('short', [4, 'a', 2, 2], 'What is lanthanoid contraction? State one consequence of it.', ['It is the steady fall in atomic and ionic radii across the lanthanoid series, since 4f electrons shield the nuclear charge poorly.', 'A consequence is that Zr and Hf have nearly identical radii, so they are hard to separate.']),
  theory('short', [5, 'a', 2, 1], 'Write the IUPAC names of (a) [Co(NH₃)₄Cl₂]Cl and (b) K₄[Fe(CN)₆].', ['(a) Tetraamminedichloridocobalt(III) chloride', '(b) Potassium hexacyanidoferrate(II)']),
  theory('short', [5, 'a', 2, 2], 'Use valence bond theory to give the hybridisation and magnetic behaviour of [Ni(CN)₄]²⁻.', ['Ni²⁺ is 3d⁸. Strong field CN⁻ pairs the electrons, leaving one empty 3d orbital, so the hybridisation is dsp² and the shape square planar.', 'With no unpaired electrons it is diamagnetic.']),
  theory('reaction', [6, 'a', 2, 2], 'Write the equations for (a) the Wurtz reaction with bromoethane, and (b) dehydrohalogenation of 2-bromopropane with alcoholic KOH.', ['(a) 2CH₃CH₂Br + 2Na → CH₃CH₂CH₂CH₃ + 2NaBr (dry ether)', '(b) CH₃CHBrCH₃ + KOH(alc) → CH₃CH=CH₂ + KBr + H₂O']),
  theory('reason', [6, 'b', 2, 2], 'Give reasons. (a) The C-X bond in haloarenes is shorter than in haloalkanes. (b) Haloarenes undergo electrophilic substitution at ortho and para positions.', ['(a) In haloarenes, carbon is sp² and more electronegative, and resonance gives the bond partial double bond character.', '(b) Resonance raises the electron density at the ortho and para positions.']),
  theory('reaction', [7, 'b', 2, 1], 'How is phenol converted to (a) salicylaldehyde and (b) 2,4,6-tribromophenol? Name the reagents.', ['(a) Chloroform and aqueous NaOH, then acid (the Reimer-Tiemann reaction).', '(b) Bromine water at room temperature.']),
  theory('distinguish', [7, 'a', 2, 1], 'Give one chemical test to tell (a) ethanol from phenol, and (b) propan-1-ol from propan-2-ol.', ['(a) Phenol gives a violet colour with neutral FeCl₃, and ethanol does not.', '(b) Propan-2-ol gives a yellow iodoform precipitate with I₂ and NaOH, and propan-1-ol does not.']),
  theory('reaction', [8, 'a', 2, 2], 'Write what happens, with an equation, when (a) ethanal is treated with dilute NaOH, and (b) methanal is treated with concentrated NaOH.', ['(a) Aldol condensation: 2CH₃CHO → CH₃CH(OH)CH₂CHO', '(b) Cannizzaro reaction: 2HCHO + NaOH → CH₃OH + HCOONa']),
  theory('distinguish', [8, 'a', 2, 1], 'Give one chemical test to tell ethanal from propanone, describing what is seen in each.', ['Warm each with Tollens’ reagent.', 'Ethanal gives a silver mirror, and propanone gives no change.']),
  theory('reaction', [9, 'c', 2, 2], 'Starting from aniline, how would you make (a) chlorobenzene and (b) phenol? Give the reagents.', ['(a) Diazotise with NaNO₂ and HCl at 273-278 K, then warm with CuCl/HCl (Sandmeyer reaction).', '(b) Diazotise as before, then warm with water.']),
  theory('reason', [9, 'a', 2, 2], 'Give reasons. (a) Aniline is a weaker base than methanamine. (b) Aniline does not undergo Friedel-Crafts reaction.', ['(a) The lone pair on nitrogen is delocalised into the ring, so it is less available.', '(b) Aniline, as a base, forms a salt with the Lewis acid AlCl₃, which deactivates the ring.']),
  theory('short', [10, 'a', 2, 1], 'What is meant by a glycosidic linkage? Name the monosaccharides in sucrose.', ['It is the C-O-C link formed between two monosaccharide units, with loss of water.', 'Sucrose consists of glucose and fructose.']),
  theory('distinguish', [10, 'd', 2, 2], 'State two differences between DNA and RNA in structure.', ['DNA contains deoxyribose, and RNA contains ribose.', 'DNA is a double helix with thymine. RNA is usually a single strand, with uracil in place of thymine.']),

  // Three marks
  num([1, 'a', 3, 2], {
    text: '{W} g of a non-electrolyte (M = {M} g/mol) is dissolved in {S} g of water. Calculate the moles of solute, the molality of the solution, and the fall in its freezing point. (Kf = 1.86 K kg mol⁻¹)',
    vars: { W: [6, 18, 6], M: [60, 180, 60], S: [200, 500, 100] },
    parts: [
      { ask: 'Moles of solute', use: 'p-xi-9-16', find: 'n', given: { m: 'W g', M: 'M g/mol' }, marks: 1, save: 'MOLES' },
      { ask: 'Molality', use: 'c-xii-2-15', find: 'm', given: { n: 'MOLES', W: 'S g' }, marks: 1, save: 'MOL' },
      { ask: 'Fall in freezing point', use: 'c-xii-2-4', find: 'DeltaT_f', given: { K_f: '1.86', m: 'MOL' }, marks: 1 },
    ],
  }),
  num([1, 'a', 3, 3], {
    text: 'A salt of molality {M} mol/kg dissociates so that its van’t Hoff factor is {I}. Find the depression in freezing point of the solution, and its degree of dissociation, assuming that it gives 2 ions per formula unit. (Kf = 1.86 K kg mol⁻¹)',
    vars: { M: [0.1, 0.5, 0.1], I: [1.5, 1.9, 0.1] },
    parts: [
      { ask: 'Depression in freezing point', use: 'c-xii-2-14', find: 'DeltaT_f', given: { i: 'I', K_f: '1.86', m: 'M mol/kg' }, marks: 2 },
      { ask: 'Degree of dissociation', use: 'c-xii-2-88', find: 'alpha', given: { i: 'I', n: '2' }, marks: 1 },
    ],
  }),
  num([2, 'a', 3, 2], {
    text: 'For a cell with E°cell = {E} V, in which {N} electrons are transferred, the reaction quotient is Q = {Q}. Find the emf at 298 K.',
    vars: { E: [1, 1.2, 0.05], N: [2, 3, 1], Q: [10, 100, 10] },
    parts: [{ ask: 'EMF of the cell', use: 'c-xii-3-55', find: 'E', given: { E0: 'E V', n: 'N', Q: 'Q' }, marks: 3 }],
  }),
  theory('short', [2, 'c', 3, 2], 'Explain the rusting of iron as an electrochemical process, naming the anode reaction, the cathode reaction, and the final product.', ['At anodic regions: Fe → Fe²⁺ + 2e⁻.', 'At cathodic regions: O₂ + 4H⁺ + 4e⁻ → 2H₂O.', 'Fe²⁺ is oxidised further by air to give hydrated ferric oxide, Fe₂O₃·xH₂O, which is rust.']),
  num([3, 'a', 3, 2], {
    text: 'A first order reaction falls from {A} mol/L to {B} mol/L in {T} min. Find the rate constant, and the half-life.',
    vars: { A: [0.4, 0.8, 0.2], B: [0.1, 0.2, 0.05], T: [10, 40, 10] },
    parts: [
      { ask: 'Rate constant', use: 'c-xii-4-2', find: 'k', given: { t: 'T min', A_0: 'A mol/L', A: 'B mol/L' }, unit: 'min^-1', marks: 2, save: 'RK' },
      { ask: 'Half-life', use: 'c-xii-4-39', find: 't_half', given: { k: 'RK' }, unit: 'min', marks: 1 },
    ],
  }),
  num([3, 'b', 3, 3], {
    text: 'A reaction’s rate constant is {K1} × 10⁻³ s⁻¹ at {T1} K and {K2} × 10⁻³ s⁻¹ at {T2} K. Calculate the activation energy.',
    vars: { K1: [1, 2, 0.5], K2: [4, 8, 2], T1: [300, 310, 10], T2: [320, 330, 10] },
    parts: [{ ask: 'Activation energy', use: 'c-xii-4-6', find: 'E_a', given: { k_2: 'K2 s^-1', k_1: 'K1 s^-1', T_1: 'T1 K', T_2: 'T2 K' }, unit: 'kJ/mol', marks: 3 }],
  }),
  theory('reaction', [4, 'b', 3, 2], 'Describe, with equations, how potassium permanganate is prepared from pyrolusite.', ['MnO₂ is fused with KOH in air: 2MnO₂ + 4KOH + O₂ → 2K₂MnO₄ + 2H₂O.', 'The green manganate is oxidised electrolytically, or by chlorine or ozone.', '2MnO₄²⁻ + Cl₂ → 2MnO₄⁻ + 2Cl⁻, and the purple KMnO₄ crystallises out.']),
  theory('short', [5, 'a', 3, 3], 'For [CoF₆]³⁻ and [Co(NH₃)₆]³⁺, state and explain the difference in hybridisation and magnetic behaviour, and name each type of complex.', ['[CoF₆]³⁻: F⁻ is a weak field ligand, so d electrons stay unpaired, with sp³d² hybridisation.', '[Co(NH₃)₆]³⁺: NH₃ pairs the d electrons, with d²sp³ hybridisation.', 'The first is a paramagnetic outer orbital (high spin) complex, and the second a diamagnetic inner orbital (low spin) complex.']),
  theory('short', [6, 'a', 3, 3], 'Describe the Sₙ2 mechanism for the hydrolysis of bromomethane, including its kinetics and stereochemistry.', ['Hydroxide attacks carbon from the side opposite the bromine, in a single step, through a transition state with five groups around the carbon.', 'Rate depends on both the concentrations: rate = k[CH₃Br][OH⁻].', 'The configuration at the carbon is inverted.']),
  theory('reaction', [7, 'c', 3, 2], 'Write the Williamson synthesis of ethoxyethane. Explain why 2-methylpropan-2-ol’s bromide gives poor yield with sodium ethoxide, and what forms instead.', ['CH₃CH₂ONa + CH₃CH₂Br → CH₃CH₂OCH₂CH₃ + NaBr.', 'With a tertiary halide the ethoxide acts as a base, not as a nucleophile.', 'Elimination takes over, giving the alkene 2-methylpropene.']),
  theory('reaction', [7, 'a', 3, 2], 'Write the mechanism for the acid-catalysed dehydration of ethanol to ethene, in three steps.', ['Protonation: CH₃CH₂OH + H⁺ → CH₃CH₂OH₂⁺.', 'Loss of water to form a carbocation: CH₃CH₂OH₂⁺ → CH₃CH₂⁺ + H₂O.', 'Loss of H⁺ from the neighbouring carbon gives CH₂=CH₂.']),
  theory('reaction', [8, 'a', 3, 2], 'An organic compound A (C₃H₆O) gives a yellow precipitate with I₂/NaOH, and does not reduce Tollens’ reagent. Identify A and write the equation for the test.', ['A is propanone, CH₃COCH₃.', 'A positive iodoform test shows a CH₃CO- group, and no reduction of Tollens’ reagent shows it is not an aldehyde.', 'CH₃COCH₃ + 3I₂ + 4NaOH → CHI₃ + CH₃COONa + 3NaI + 3H₂O.'], { structure: { list: ['propanone', 'iodoform'] } }),
  theory('reaction', [8, 'b', 3, 2], 'How will you convert (a) ethanoic acid to ethanamide, (b) benzoic acid to benzene, (c) ethanoic acid to chloroethanoic acid? Name the reagents.', ['(a) With NH₃ to give the ammonium salt, then heat.', '(b) Heat its sodium salt with soda lime.', '(c) Cl₂ with red phosphorus (the Hell-Volhard-Zelinsky reaction).']),
  theory('reaction', [9, 'a', 3, 2], 'How will you tell primary, secondary and tertiary amines apart using Hinsberg’s reagent? Name the reagent.', ['Primary amines give a sulphonamide that dissolves in alkali. The reagent is benzenesulphonyl chloride.', 'Secondary amines give a sulphonamide that does not dissolve in alkali.', 'Tertiary amines do not react.']),
  theory('reaction', [9, 'b', 3, 2], 'Starting from bromoethane, write how you would get (a) ethanenitrile’s homologue, propanenitrile, (b) propanoic acid, and (c) propan-1-amine.', ['(a) With alcoholic KCN: CH₃CH₂Br → CH₃CH₂CN.', '(b) Acid hydrolysis of the nitrile gives CH₃CH₂COOH.', '(c) Reduction of the nitrile with LiAlH₄ gives CH₃CH₂CH₂NH₂.']),
  theory('short', [10, 'b', 3, 2], 'What is a peptide bond? What is meant by the denaturation of a protein? Give one example of denaturation.', ['A peptide bond is the -CO-NH- link between the carboxyl group of one amino acid and the amino group of another.', 'In denaturation, the secondary and tertiary structure is lost on heating or a pH change, and the protein loses its biological activity.', 'The coagulation of egg white on boiling is an example.']),
  theory('short', [10, 'a', 3, 3], 'Glucose’s open-chain structure fails to explain some of its reactions. State three such observations.', ['It does not give the Schiff’s test, in spite of having an aldehyde group.', 'It forms no addition product with NaHSO₃.', 'Its pentaacetate does not react with hydroxylamine, and glucose exists in α and β forms.']),

  // Five marks
  num([1, 'a', 5, 3], {
    text: '{W} g of a non-volatile solute of molar mass {M} g/mol is dissolved in water to give {V} L of solution at {T} K. Treat the solution as dilute. Find the following. (R = 0.0821 L atm K⁻¹ mol⁻¹)',
    vars: { W: [18, 36, 18], M: [180, 360, 180], V: [1, 2, 0.5], T: [280, 320, 20] },
    parts: [
      { ask: 'Moles of solute', use: 'p-xi-9-16', find: 'n', given: { m: 'W g', M: 'M g/mol' }, marks: 1, save: 'N' },
      { ask: 'Molarity of the solution', use: 'c-xii-2-6', find: 'M', given: { n: 'N', V: 'V L' }, marks: 2, save: 'CONC' },
      { ask: 'Osmotic pressure', use: 'c-xii-2-5', find: 'pi_o', given: { C: 'CONC', T: 'T K' }, unit: 'atm', marks: 2 },
    ],
  }),
  theory('short', [2, 'a', 5, 3], 'A cell is made from Zn|Zn²⁺(0.1 M) and Cu²⁺(0.01 M)|Cu, with E°cell = 1.10 V. Write the half reactions and cell reaction, then the Nernst equation, and calculate the cell emf at 298 K.', ['Anode: Zn → Zn²⁺ + 2e⁻. Cathode: Cu²⁺ + 2e⁻ → Cu.', 'Cell reaction: Zn + Cu²⁺ → Zn²⁺ + Cu, so n = 2.', 'Nernst equation: $E = E^\\circ - \\dfrac{0.0591}{2}\\log\\dfrac{[Zn^{2+}]}{[Cu^{2+}]}$.', 'Substituting: $E = 1.10 - 0.02955 \\log 10$.', 'So E is about 1.07 V.']),
  theory('derivation', [3, 'a', 5, 3], 'Derive the integrated rate equation for a first order reaction. Show from it that the half-life does not depend on initial concentration, and that 99.9% completion takes about ten half-lives.', ['$-d[R]/dt = k[R]$, so $\\int d[R]/[R] = -k\\int dt$.', 'Integrating from $[R]_0$ at t = 0 gives $\\ln([R]_0/[R]) = kt$, or $k = \\dfrac{2.303}{t}\\log\\dfrac{[R]_0}{[R]}$.', 'At $t_{1/2}$, $[R] = [R]_0/2$, so $t_{1/2} = 0.693/k$, with no $[R]_0$ in it.', 'For 99.9%, $[R]_0/[R] = 1000$, so $t = 6.909/k$.', 'Then $t/t_{1/2} = 6.909/0.693 \\approx 10$.']),
  theory('reaction', [6, 'b', 5, 2], 'Starting from benzene, write how you would prepare chlorobenzene. Then, from chlorobenzene, write the equation for (a) the Wurtz-Fittig reaction, (b) its nitration, (c) Dow’s process, and (d) the Fittig reaction.', ['Benzene with Cl₂ and anhydrous FeCl₃ gives chlorobenzene.', '(a) With CH₃Cl and Na in dry ether: gives toluene.', '(b) With conc. HNO₃ and conc. H₂SO₄: gives 2- and 4-chloronitrobenzene, mainly the para product.', '(c) With NaOH at 623 K and 300 atm, then acid: gives phenol.', '(d) With Na in dry ether: gives biphenyl.']),
  theory('reaction', [7, 'b', 5, 2], 'Starting from cumene, write the preparation of phenol. Then write what phenol gives with (a) Zn dust, (b) conc. HNO₃, (c) CO₂/NaOH followed by acid, and (d) dilute HNO₃.', ['Cumene with O₂ gives the hydroperoxide, and dilute acid then gives phenol and propanone.', '(a) Benzene.', '(b) 2,4,6-Trinitrophenol (picric acid).', '(c) 2-Hydroxybenzoic acid (salicylic acid), the Kolbe reaction.', '(d) A mixture of 2-nitrophenol and 4-nitrophenol.']),
  theory('reaction', [8, 'a', 5, 3], 'Explain the following, with equations. (a) The Rosenmund reduction. (b) The Etard reaction. (c) The HCN addition to ethanal, with its mechanism. (d) Why aldehydes are more reactive than ketones to nucleophiles.', ['(a) RCOCl + H₂ → RCHO + HCl, with Pd/BaSO₄.', '(b) Toluene with CrO₂Cl₂ in CS₂, then water, gives benzaldehyde.', '(c) CN⁻ attacks the carbonyl carbon, giving an alkoxide.', 'The alkoxide takes up H⁺ to give the cyanohydrin, CH₃CH(OH)CN.', '(d) Ketones have two electron-releasing groups and more steric hindrance around the carbonyl carbon.']),
  theory('reaction', [9, 'a', 5, 2], 'Write the equations for (a) reducing nitrobenzene to aniline, (b) the carbylamine reaction, (c) the Hofmann bromamide reaction of ethanamide, (d) bromination of aniline, and (e) the coupling of benzenediazonium chloride with phenol.', ['(a) C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O, with Sn/HCl.', '(b) C₆H₅NH₂ + CHCl₃ + 3KOH → C₆H₅NC + 3KCl + 3H₂O.', '(c) CH₃CONH₂ + Br₂ + 4NaOH → CH₃NH₂ + Na₂CO₃ + 2NaBr + 2H₂O.', '(d) Aniline with bromine water gives a white precipitate of 2,4,6-tribromoaniline.', '(e) It gives the orange dye 4-hydroxyazobenzene.'], { structure: { list: ['aniline', 'tribromoaniline'] } }),
];

export default questions;
