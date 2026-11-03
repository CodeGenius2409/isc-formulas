// Original questions in the style of ISC Chemistry Class XI. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';
import { bondingQuestions, organicConceptQuestions } from '../lewis-questions';

const chemistryXI = bank('chemistry', 'XI');
const { mcq, ar, theory, num } = chemistryXI;

const questions: BankDef[] = [
  // One mark
  mcq([1, 'b', 1, 1], 'The number of moles in 22 g of CO₂ is:', ['0.25', '0.5', '1', '2'], 1, 'M(CO₂) = 44 g/mol.'),
  ar([1, 'a', 1, 2], 'Water from any source has hydrogen and oxygen in a fixed ratio by mass.', 'This illustrates the law of definite proportions.', 1),
  mcq([1, 'c', 1, 2], 'The equivalent mass of H₂SO₄ in a complete neutralisation (M = 98) is:', ['98', '49', '32.7', '196'], 1),
  mcq([2, 'a', 1, 1], 'Rutherford’s scattering experiment first showed the existence of the:', ['electron', 'neutron', 'nucleus', 'proton’s spin'], 2),
  mcq([2, 'b', 1, 2], 'Which set of quantum numbers (n, l, m) is not allowed?', ['3, 2, 0', '2, 2, 1', '4, 0, 0', '3, 1, −1'], 1, 'l can only go up to n − 1.'),
  ar([2, 'b', 1, 2], 'The electronic configuration of chromium is [Ar]3d⁵4s¹.', 'Half-filled subshells have extra stability.', 1),
  mcq([3, 'a', 1, 1], 'Across a period from left to right, the atomic radius generally:', ['increases', 'decreases', 'stays constant', 'first falls, then rises sharply'], 1),
  mcq([3, 'a', 1, 2], 'Which has the highest first ionisation enthalpy?', ['Na', 'Mg', 'Al', 'Ne'], 3),
  ar([3, 'a', 1, 2], 'The first ionisation enthalpy of nitrogen is greater than that of oxygen.', 'Nitrogen has a half-filled, more stable 2p subshell.', 1),
  mcq([4, 'a', 1, 2], 'Which has the greatest lattice enthalpy?', ['NaCl', 'MgO', 'KBr', 'CsI'], 1, 'High charges and small ions.'),
  mcq([4, 'b', 1, 1], 'The shape of a water molecule, according to VSEPR theory, is:', ['linear', 'bent', 'tetrahedral', 'trigonal planar'], 1),
  mcq([4, 'b', 1, 2], 'What is the bond order of O₂?', ['1', '1.5', '2', '3'], 2),
  mcq([5, 'a', 1, 1], 'Which is a state function?', ['Work', 'Heat', 'Enthalpy', 'Path length'], 2),
  ar([5, 'b', 1, 2], 'Spontaneous reactions always have a negative ΔG at constant temperature and pressure.', 'The entropy of the system always increases in a spontaneous process.', 3, 'It is the total entropy, of the system and surroundings, that increases.'),
  mcq([6, 'a', 1, 2], 'For N₂ + 3H₂ ⇌ 2NH₃, increasing the pressure:', ['shifts the equilibrium to the right', 'shifts it to the left', 'has no effect', 'changes Kc'], 0),
  mcq([6, 'b', 1, 2], 'The conjugate base of H₂PO₄⁻ is:', ['H₃PO₄', 'HPO₄²⁻', 'PO₄³⁻', 'H₂O'], 1),
  ar([6, 'b', 1, 2], 'Aqueous sodium acetate is basic.', 'Sodium ions react with water to form H⁺ ions.', 3, 'The acetate ion hydrolyses to give OH⁻ ions. Sodium ions do not hydrolyse.'),
  mcq([7, 'a', 1, 1], 'The oxidation number of S in H₂SO₄ is:', ['+2', '+4', '+6', '−2'], 2),
  mcq([7, 'a', 1, 2], 'In Zn + Cu²⁺ → Zn²⁺ + Cu, the reducing agent is:', ['Cu²⁺', 'Zn', 'Zn²⁺', 'Cu'], 1),
  mcq([8, 'a', 1, 1], 'Which pair are position isomers?', ['Butane and 2-methylpropane', 'Propan-1-ol and propan-2-ol', 'Ethanol and methoxymethane', 'Propanal and propanone'], 1),
  mcq([8, 'c', 1, 2], 'Which has the strongest −I effect?', ['−Cl', '−Br', '−NO₂', '−CH₃'], 2),
  ar([8, 'c', 1, 2], 'A primary carbocation is more stable than a tertiary one.', 'Hyperconjugation and +I effects of alkyl groups spread the positive charge.', 4, 'More alkyl groups spread the charge better, so the tertiary one is more stable.'),
  mcq([9, 'b', 1, 2], 'Adding HBr to propene without peroxide gives mainly:', ['1-bromopropane', '2-bromopropane', '1,2-dibromopropane', 'propane'], 1),
  mcq([9, 'c', 1, 2], 'Which compound is acidic enough to form a salt with sodamide?', ['Ethane', 'Ethene', 'Ethyne', 'But-2-ene'], 2),
  mcq([9, 'd', 1, 1], 'Name this compound.', ['Toluene', 'Benzene', 'Cumene', 'Biphenyl'], 0, undefined, { structure: { list: ['toluene'], unnamed: 1 } }),

  // Two marks
  num([1, 'b', 2, 1], {
    text: 'How many molecules are present in {N} mol of water?',
    vars: { N: [0.5, 3, 0.5] },
    parts: [{ ask: 'Number of molecules', use: 'c-xi-1-2', find: 'N', given: { n: 'N mol' }, marks: 2 }],
  }),
  num([1, 'c', 2, 2], {
    text: '{V} mL of a {M} M NaOH solution is needed to neutralise {W} mL of HCl. Find the molarity of the acid.',
    vars: { V: [10, 40, 10], M: [0.1, 0.5, 0.1], W: [20, 50, 10] },
    parts: [{ ask: 'Molarity of the acid', use: 'c-xi-1-51', find: 'M_2', given: { M_1: 'M mol/L', V_1: 'V mL', V_2: 'W mL' }, marks: 2 }],
  }),
  num([2, 'a', 2, 2], {
    text: 'Calculate the frequency of light with a wavelength of {W} nm.',
    vars: { W: [400, 700, 50] },
    parts: [{ ask: 'Frequency', use: 'c-xi-2-24', find: 'nu', given: { lambda: 'W nm' }, marks: 2 }],
  }),
  theory('definition', [2, 'b', 2, 1], 'State the Aufbau principle and Hund’s rule.', ['Aufbau principle: orbitals fill in the order of increasing energy.', 'Hund’s rule: in orbitals of the same energy, electrons pair up only once each has one electron with the same spin.']),
  theory('reason', [3, 'a', 2, 2], 'Give reasons. (a) The electron gain enthalpy of fluorine is less negative than that of chlorine. (b) Noble gases have large positive electron gain enthalpies.', ['(a) Fluorine is very small, so an added electron meets strong repulsion from its compact 2p electrons.', '(b) They have stable closed shells, so an added electron would have to enter a new, higher energy shell.']),
  theory('short', [4, 'b', 2, 1], 'Using VSEPR theory, state the shape and bond angle of (a) NH₃ and (b) BF₃.', ['(a) Trigonal pyramidal, about 107°.', '(b) Trigonal planar, 120°.']),
  theory('distinguish', [4, 'b', 2, 2], 'State two differences between sigma and pi bonds.', ['A sigma bond is formed by end-on overlap, and a pi bond by sideways overlap.', 'A sigma bond is stronger, and allows free rotation. A pi bond is weaker and prevents rotation.']),
  num([5, 'a', 2, 1], {
    text: 'A gas absorbs {Q} J of heat, while {W} J of work is done on it. What is its change in internal energy?',
    vars: { Q: [100, 500, 100], W: [50, 300, 50] },
    parts: [{ ask: 'Change in internal energy', use: 'c-xi-6-1', find: 'DeltaU', given: { q: 'Q J', w: 'W J' }, marks: 2 }],
  }),
  num([5, 'b', 2, 2], {
    text: 'For a reaction, ΔH = {H} kJ/mol and ΔS = {S} J/(mol K). Calculate ΔG at {T} K.',
    vars: { H: [-80, -20, 20], S: [50, 150, 50], T: [300, 400, 50] },
    parts: [{ ask: 'ΔG', use: 'c-xi-6-5', find: 'DeltaG', given: { DeltaH: 'H kJ/mol', T: 'T K', DeltaS: 'S J/(mol*K)' }, unit: 'kJ/mol', marks: 2 }],
  }),
  num([6, 'b', 2, 1], {
    text: 'Find the pH of a solution in which [H⁺] = {H} × 10⁻⁴ mol/L.',
    vars: { H: [1, 9, 1] },
    parts: [{ ask: 'pH', use: 'c-xi-7-3', find: 'pH', given: { H: 'H*0.0001 mol/L' }, marks: 2 }],
  }),
  theory('short', [6, 'a', 2, 2], 'State Le Chatelier’s principle. Which way does an exothermic equilibrium shift if the temperature is raised?', ['If a system at equilibrium is disturbed, it shifts in the direction that opposes the change.', 'It shifts towards the reactants, which absorbs the added heat.']),
  theory('reaction', [7, 'a', 2, 2], 'Balance the following in acidic medium using the ion-electron method: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺.', ['Half reactions: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O, and Fe²⁺ → Fe³⁺ + e⁻.', 'Overall: MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.']),
  theory('short', [8, 'a', 2, 1], 'Write the IUPAC names of (a) CH₃CH(CH₃)CH₂OH and (b) CH₃COCH₂CH₃.', ['(a) 2-Methylpropan-1-ol.', '(b) Butan-2-one.']),
  theory('short', [8, 'c', 2, 2], 'Explain what is meant by an electrophile and a nucleophile, with one example of each.', ['An electrophile is an electron-seeking species, such as H⁺ or NO₂⁺.', 'A nucleophile is an electron-rich species that attacks an electron-poor centre, such as OH⁻ or CN⁻.']),
  theory('reaction', [9, 'a', 2, 2], 'Write the equations for (a) the Wurtz reaction forming butane, and (b) the decarboxylation of sodium ethanoate.', ['(a) 2CH₃CH₂Br + 2Na → CH₃CH₂CH₂CH₃ + 2NaBr (dry ether).', '(b) CH₃COONa + NaOH → CH₄ + Na₂CO₃ (with CaO, on heating).']),
  theory('reaction', [9, 'd', 2, 2], 'How is benzene converted to (a) nitrobenzene, (b) acetophenone? Give the reagents.', ['(a) Concentrated HNO₃ and concentrated H₂SO₄, at about 330 K.', '(b) CH₃COCl with anhydrous AlCl₃ (Friedel-Crafts acylation).']),

  // Three marks
  num([1, 'b', 3, 2], {
    text: 'A {W} g sample of a gas has a density of {D} g/L at the conditions of the experiment. Find the volume of the gas, then the moles it contains if M = {M} g/mol.',
    vars: { W: [4, 16, 4], D: [2, 4, 1], M: [16, 44, 14] },
    parts: [
      { ask: 'Volume', use: 'c-xi-1-110', find: 'V', given: { m: 'W g', d: 'D g/L' }, unit: 'L', marks: 1 },
      { ask: 'Moles of gas', use: 'p-xi-9-16', find: 'n', given: { m: 'W g', M: 'M g/mol' }, marks: 2 },
    ],
  }),
  num([1, 'c', 3, 2], {
    text: '{V} mL of a {M} mol/L stock solution is mixed with {W} mL of a {N} mol/L solution of the same solute. What is the molarity of the mixture?',
    vars: { V: [50, 200, 50], M: [0.1, 0.5, 0.1], W: [100, 300, 100], N: [0.2, 0.8, 0.2] },
    parts: [{ ask: 'Molarity of the mixture', use: 'c-xi-1-53', find: 'M', given: { M_1: 'M mol/L', V_1: 'V mL', M_2: 'N mol/L', V_2: 'W mL' }, marks: 3 }],
  }),
  num([2, 'a', 3, 3], {
    text: 'Calculate, for a hydrogen atom, the energy of the electron in the level n = {N}, and the radius of that orbit.',
    vars: { N: [2, 5, 1] },
    parts: [
      { ask: 'Energy in the level', use: 'c-xi-2-4', find: 'E_n', given: { Z: '1', n: 'N' }, unit: 'eV', marks: 2 },
      { ask: 'Radius of the orbit', use: 'c-xi-2-5', find: 'r_n', given: { n: 'N', Z: '1' }, unit: 'nm', marks: 1 },
    ],
  }),
  theory('short', [3, 'a', 3, 2], 'Explain the trend in atomic radius (a) across a period and (b) down a group. (c) Why is the Na⁺ ion smaller than an Na atom?', ['(a) It falls across a period, since nuclear charge rises with no new shell added.', '(b) It rises down a group, since a new shell is added each period.', '(c) Na⁺ has lost its outer shell, and the remaining electrons are held more strongly.']),
  theory('short', [4, 'b', 3, 3], 'Use molecular orbital theory to show that O₂ is paramagnetic. Also find its bond order.', ['O₂ has 16 electrons, with the configuration ending in $\\pi^*2p_x^1\\,\\pi^*2p_y^1$.', 'It has two unpaired electrons, and so it is paramagnetic.', 'Bond order = (10 − 6)/2 = 2.']),
  theory('short', [4, 'a', 3, 2], 'What is a hydrogen bond? Explain, using it, why HF has a higher boiling point than HCl, and why ice floats on water.', ['A hydrogen bond is an attraction between H bonded to a strongly electronegative atom and a lone pair on a nearby electronegative atom.', 'HF molecules are associated through strong hydrogen bonds, while HCl has only weak attractions.', 'In ice, hydrogen bonds hold molecules in an open cage, so it is less dense than water.']),
  num([5, 'a', 3, 2], {
    text: '{N} mol of an ideal gas expands isothermally and reversibly at {T} K from {A} L to {B} L. Calculate the work done on the gas.',
    vars: { N: [1, 3, 1], T: [300, 400, 50], A: [2, 5, 1], B: [10, 40, 10] },
    parts: [{ ask: 'Work done on the gas', use: 'c-xi-6-30', find: 'w', given: { n: 'N mol', T: 'T K', V_2: 'B L', V_1: 'A L' }, unit: 'J', marks: 3 }],
  }),
  theory('short', [5, 'a', 3, 2], 'State Hess’s law. Use it to find ΔH for C(s) + ½O₂(g) → CO(g), given C(s) + O₂(g) → CO₂(g), ΔH = −393 kJ, and CO(g) + ½O₂(g) → CO₂(g), ΔH = −283 kJ.', ['The enthalpy change of a reaction is the same whether it takes place in one step or in several.', 'Subtract the second equation from the first.', 'ΔH = −393 − (−283) = −110 kJ/mol.']),
  num([6, 'b', 3, 2], {
    text: 'A weak acid has a Ka of {K} × 10⁻⁵, and a concentration of {C} mol/L. Find its degree of ionisation, and the pKa.',
    vars: { K: [1, 8, 1], C: [0.1, 0.5, 0.1] },
    parts: [
      { ask: 'Degree of ionisation', use: 'c-xi-7-10', find: 'alpha', given: { K_a: 'K*0.00001', C_c: 'C' }, marks: 2 },
      { ask: 'pKa', use: 'c-xi-7-95', find: 'pK_a', given: { K_a: 'K*0.00001' }, marks: 1 },
    ],
  }),
  num([6, 'b', 3, 3], {
    text: 'A buffer holds {S} mol/L of sodium acetate and {A} mol/L of acetic acid. pKa = 4.74. Find its pH, and the value of [H⁺] for this pH.',
    vars: { S: [0.1, 0.5, 0.1], A: [0.2, 0.8, 0.2] },
    parts: [
      { ask: 'pH', use: 'c-xi-7-6', find: 'pH', given: { pK_a: '4.74', S_c: 'S', A_c: 'A' }, marks: 2, save: 'PHV' },
      { ask: 'Hydrogen ion concentration', use: 'c-xi-7-3', find: 'H', given: { pH: 'PHV' }, marks: 1 },
    ],
  }),
  theory('short', [7, 'a', 3, 2], 'Define oxidation and reduction in terms of oxidation number. Identify the oxidant and reductant in 2Na + Cl₂ → 2NaCl.', ['Oxidation is an increase in oxidation number, and reduction is a decrease.', 'Na goes from 0 to +1, so it is oxidised and it is the reductant.', 'Cl goes from 0 to −1, so it is reduced and it is the oxidant.']),
  theory('short', [8, 'b', 3, 2], 'Describe the principle of (a) the Lassaigne’s test for nitrogen, (b) steam distillation, and (c) paper chromatography.', ['(a) Fusing with sodium turns nitrogen into NaCN, which gives Prussian blue with FeSO₄ and acid.', '(b) A volatile liquid that does not mix with water boils below its normal point, since the vapour pressures add up.', '(c) Components move at different speeds through the paper because they are distributed differently between the mobile and stationary phases.']),
  theory('reaction', [9, 'b', 3, 2], 'State Markovnikov’s rule and the peroxide effect. Write the products of propene with HBr in each case.', ['Markovnikov: the negative part of the addendum adds to the carbon with fewer hydrogens. This gives 2-bromopropane.', 'With peroxide, the addition is by a free-radical path, against the rule.', 'This gives 1-bromopropane.'], { structure: { list: ['propene', '2-bromopropane', '1-bromopropane'] } }),
  theory('reaction', [9, 'd', 3, 3], 'Explain, with the mechanism, the nitration of benzene.', ['The electrophile forms: HNO₃ + 2H₂SO₄ → NO₂⁺ + H₃O⁺ + 2HSO₄⁻.', 'NO₂⁺ attacks the ring to give a resonance-stabilised arenium ion.', 'Loss of H⁺ restores the aromatic ring and gives nitrobenzene.']),
  theory('short', [9, 'c', 3, 2], 'Show how ethyne is converted to (a) benzene, (b) ethanal, and (c) ethene.', ['(a) Passing it through a red-hot iron tube at 873 K.', '(b) Dilute H₂SO₄ with HgSO₄ at 333 K.', '(c) H₂ with Lindlar’s catalyst.']),

  // Five marks
  theory('short', [1, 'b', 5, 3], 'A compound contains 40.0% C, 6.67% H and the rest oxygen. Its molar mass is 60 g/mol. Find its empirical and molecular formulae, showing each step.', ['Oxygen is 53.33%.', 'Moles: C = 40.0/12 = 3.33, H = 6.67/1 = 6.67, O = 53.33/16 = 3.33.', 'The simplest ratio is 1 : 2 : 1, so the empirical formula is CH₂O.', 'The empirical formula mass is 30, so n = 60/30 = 2.', 'The molecular formula is C₂H₄O₂.']),
  theory('short', [2, 'b', 5, 2], 'Write the electronic configurations of Cr (Z = 24) and Cu (Z = 29). State the Pauli exclusion principle. Write the values of all quantum numbers for the outermost electron of potassium.', ['Cr: [Ar]3d⁵4s¹.', 'Cu: [Ar]3d¹⁰4s¹.', 'No two electrons in an atom can have the same set of four quantum numbers.', 'In potassium, the outermost electron is in 4s, so n = 4, l = 0, m = 0.', 'Its spin quantum number is $s = +\\tfrac12$ or $-\\tfrac12$.']),
  theory('short', [4, 'b', 5, 3], 'Explain the hybridisation in (a) CH₄, (b) C₂H₄, (c) C₂H₂, (d) PCl₅, and (e) SF₆, giving the shape in each case.', ['(a) sp³, tetrahedral.', '(b) sp², planar around each carbon.', '(c) sp, linear.', '(d) sp³d, trigonal bipyramidal.', '(e) sp³d², octahedral.']),
  theory('derivation', [6, 'a', 5, 3], 'For PCl₅ ⇌ PCl₃ + Cl₂, with initial moles a, degree of dissociation α, total pressure P, obtain the expression for Kp. Then state the effect on α of raising the pressure.', ['At equilibrium, moles are a(1 − α), aα and aα.', 'Total moles = a(1 + α).', 'Partial pressures: $p_{PCl_5} = \\dfrac{1-\\alpha}{1+\\alpha}P$, $p_{PCl_3} = p_{Cl_2} = \\dfrac{\\alpha}{1+\\alpha}P$.', '$K_p = \\dfrac{\\alpha^2 P}{1-\\alpha^2}$.', 'Raising the pressure shifts the equilibrium to fewer moles, so α falls.']),
  theory('reaction', [9, 'c', 5, 2], 'Write the equations for making ethene (a) from ethanol and (b) from ethyne. Then write what ethene gives with (c) bromine, (d) cold dilute alkaline KMnO₄, and (e) ozone followed by Zn and water.', ['(a) Heat with concentrated H₂SO₄ at 443 K.', '(b) Add H₂ with Lindlar’s catalyst.', '(c) 1,2-Dibromoethane.', '(d) Ethane-1,2-diol (Baeyer’s test).', '(e) Two molecules of methanal.']),
];

export default [...questions, ...bondingQuestions(chemistryXI), ...organicConceptQuestions(chemistryXI)];
