// Chemistry, Class XI: knowledge added to what chemistry-xi.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import MORE_A from './more/chemistry-xi-a';

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['the law of definite proportions', 'Pure water always has the same ratio of hydrogen to oxygen by mass.', 'The ratio of hydrogen to oxygen by mass in pure water depends on its source.', 'A compound always has its elements in a fixed ratio by mass.', 'A compound can have its elements in any ratio by mass.', 'This ratio is about 1 : 8 for water.'],
      ['isotopes and atomic mass', 'The relative atomic mass of chlorine isn’t a whole number.', 'The relative atomic mass of chlorine is exactly 35.', 'It is an average over its isotopes, weighted by their abundance.', 'Each of its atoms has a mass of 35.5 u.', 'Chlorine has two main isotopes, of mass numbers 35 and 37.'],
      ['Avogadro’s law', 'Equal volumes of hydrogen and oxygen at the same temperature and pressure hold equal numbers of molecules.', 'Equal volumes of hydrogen and oxygen at the same temperature and pressure have equal masses.', 'This follows from Avogadro’s law.', 'Oxygen molecules have the same mass as hydrogen molecules.', 'One mole of an ideal gas takes up about 22.4 L at STP.'],
    ],
  },
  '1b': {
    ar: [
      ['the limiting reagent', 'The limiting reagent decides how much product forms.', 'The reagent in excess decides how much product forms.', 'The reaction stops once it is used up.', 'The reaction stops once the reagent in excess is used up.', 'Some of the other reagent is left over at the end.'],
      ['empirical and molecular formulae', 'Ethyne and benzene have the same empirical formula.', 'Ethyne and benzene have the same molecular formula.', 'Each has one hydrogen atom for each carbon atom.', 'Each has six carbon atoms in a molecule.', 'A molecular formula is a whole-number multiple of the empirical one.'],
      ['molarity and molality', 'Molality doesn’t change with temperature.', 'Molality changes noticeably with temperature.', 'It is based on the mass of the solvent, which doesn’t change on heating.', 'It is based on the volume of the solution.', 'Molarity falls slightly as a solution warms and expands.'],
    ],
  },
  '1c': {
    ar: [
      ['the end point of a titration', 'Phenolphthalein suits the titration of a weak acid with a strong base.', 'Methyl orange suits the titration of a weak acid with a strong base.', 'The equivalence point lies at a pH above 7, in its range.', 'The equivalence point lies at a pH below 4, in its range.', 'Phenolphthalein changes colour between pH 8 and 10.'],
      ['equivalent mass', 'The equivalent mass of H₂SO₄ is half its molar mass, when both hydrogens react.', 'The equivalent mass of H₂SO₄ is twice its molar mass, when both hydrogens react.', 'Its basicity is then 2.', 'Its basicity is then ½.', 'The molar mass of H₂SO₄ is 98 g mol⁻¹.'],
      ['the standard solution', 'NaOH isn’t used as a primary standard.', 'NaOH is the best primary standard.', 'It absorbs moisture and carbon dioxide from the air.', 'It is perfectly stable in air.', 'Oxalic acid crystals are a primary standard.'],
    ],
  },
  '2a': {
    ar: [
      ['Rutherford’s experiment', 'A few α-particles bounce back from a thin gold foil.', 'All α-particles pass straight through a thin gold foil.', 'They meet a small, dense, positive nucleus.', 'They meet electrons, which are far heavier than they are.', 'Most of an atom is empty space.'],
      ['the Bohr model', 'Hydrogen gives a line spectrum.', 'Hydrogen gives a continuous spectrum.', 'Its electron can only have certain energies.', 'Its electron can have any energy.', 'Its Lyman series lies in the ultraviolet.'],
      ['subatomic particles', 'Isotopes of an element have the same chemical properties.', 'Isotopes of an element have very different chemical properties.', 'They have the same electronic configuration.', 'They have different numbers of protons.', 'Isotopes differ in their number of neutrons.'],
    ],
  },
  '2b': {
    ar: [
      ['the orbital’s capacity', 'An orbital can hold at most two electrons.', 'An orbital can hold at most four electrons.', 'Two electrons in one orbital must have opposite spins, by Pauli’s principle.', 'Electrons in one orbital must have the same spin.', 'The p subshell has three orbitals.'],
      ['the stability of half-filled subshells', 'Chromium has the configuration [Ar] 3d⁵ 4s¹.', 'Chromium has the configuration [Ar] 3d⁴ 4s².', 'A half-filled d subshell is especially stable.', 'A full 4s orbital is always unstable.', 'Copper’s configuration ends in 3d¹⁰ 4s¹.'],
      ['Hund’s rule', 'Nitrogen’s three 2p electrons occupy separate orbitals.', 'Nitrogen’s three 2p electrons pair up in the same orbitals.', 'Electrons in a subshell stay unpaired for as long as they can.', 'Electrons in a subshell pair up as soon as they can.', 'These electrons have parallel spins.'],
    ],
  },
  '3a': {
    ar: [
      ['the size of ions', 'A cation is smaller than its parent atom.', 'A cation is larger than its parent atom.', 'It has lost electrons, so the nucleus holds the rest more tightly.', 'It has gained electrons.', 'An anion is larger than its parent atom.'],
      ['ionisation enthalpy', 'Nitrogen has a higher first ionisation enthalpy than oxygen.', 'Oxygen has a higher first ionisation enthalpy than nitrogen.', 'Nitrogen has a stable half-filled 2p subshell.', 'Nitrogen has a full 2p subshell.', 'Ionisation enthalpy generally rises across a period.'],
      ['electron gain enthalpy', 'Chlorine has a more negative electron gain enthalpy than fluorine.', 'Fluorine has a more negative electron gain enthalpy than chlorine.', 'Fluorine’s small 2p shell repels the extra electron strongly.', 'Chlorine’s atom is smaller than fluorine’s.', 'Fluorine is the most electronegative element.'],
    ],
  },
  '4a': {
    ar: [
      ['the properties of ionic compounds', 'Ionic compounds have high melting points.', 'Ionic compounds have low melting points.', 'Strong electrostatic forces hold their ions in the lattice.', 'Weak forces hold their molecules together.', 'Ionic compounds conduct when molten.'],
      ['the dipole moment', 'CO₂ has no dipole moment, although its bonds are polar.', 'CO₂ has a large dipole moment.', 'It is linear, so its bond dipoles cancel.', 'It is bent, so its bond dipoles add.', 'Water has a dipole moment, as it is bent.'],
      ['the hydrogen bond', 'Water has a much higher boiling point than H₂S.', 'H₂S has a much higher boiling point than water.', 'Water molecules are linked by hydrogen bonds.', 'H₂S molecules are linked by hydrogen bonds.', 'A hydrogen bond needs F, O or N.'],
    ],
  },
  '4b': {
    ar: [
      ['VSEPR and shape', 'The bond angle in water is less than the tetrahedral angle.', 'The bond angle in water is greater than the tetrahedral angle.', 'Lone pairs repel bond pairs more than bond pairs repel each other.', 'Bond pairs repel more than lone pairs do.', 'Oxygen in water is sp³ hybridised.'],
      ['molecular orbitals', 'O₂ is paramagnetic.', 'O₂ is diamagnetic.', 'It has two unpaired electrons in antibonding orbitals.', 'All its electrons are paired.', 'The bond order of O₂ is 2.'],
      ['bond order', 'He₂ doesn’t exist as a stable molecule.', 'He₂ is a stable molecule with a bond order of 2.', 'Its bond order is zero.', 'Its bond order is 3.', 'Bond order is half of the difference between bonding and antibonding electrons.'],
    ],
  },
  '5a': {
    ar: [
      ['state functions', 'Enthalpy change doesn’t depend on the path taken.', 'Enthalpy change depends on the path taken.', 'Enthalpy is a state function.', 'Enthalpy is a path function.', 'Heat and work are path functions.'],
      ['Hess’s law', 'An enthalpy of reaction can be found from others that add up to it.', 'An enthalpy of reaction can’t be found from others that add up to it.', 'Enthalpy depends only on the initial and final states.', 'Enthalpy depends on the time taken.', 'This is Hess’s law of constant heat summation.'],
      ['enthalpy and internal energy', 'ΔH and ΔU are equal for a reaction with no change in the number of moles of gas.', 'ΔH and ΔU are never equal.', 'ΔH = ΔU + Δn_g RT, and Δn_g is zero here.', 'ΔH = ΔU × Δn_g RT, and Δn_g is one here.', 'ΔH is the heat change at constant pressure.'],
    ],
  },
  '5b': {
    ar: [
      ['spontaneity', 'An endothermic change can be spontaneous.', 'An endothermic change can never be spontaneous.', 'A large enough rise in entropy can make ΔG negative.', 'ΔG depends only on ΔH.', 'Ice melts spontaneously above 0 °C.'],
      ['entropy', 'A gas has more entropy than the same amount of its liquid.', 'A liquid has more entropy than the same amount of its gas.', 'Gas molecules are much more disordered.', 'Liquid molecules are much more disordered.', 'Entropy is a measure of disorder.'],
      ['the third law', 'A perfect crystal has zero entropy at 0 K.', 'A perfect crystal has its greatest entropy at 0 K.', 'Its particles have only one possible arrangement there.', 'Its particles are moving fastest there.', 'This is the third law of thermodynamics.'],
    ],
  },
  '6a': {
    ar: [
      ['Le Chatelier’s principle', 'Raising the pressure favours ammonia in the Haber process.', 'Lowering the pressure favours ammonia in the Haber process.', 'The forward reaction reduces the number of moles of gas.', 'The forward reaction increases the number of moles of gas.', 'Iron is the catalyst in the Haber process.'],
      ['the catalyst and equilibrium', 'A catalyst doesn’t change the position of an equilibrium.', 'A catalyst moves the position of an equilibrium towards the products.', 'It speeds up the forward and backward reactions equally.', 'It speeds up only the forward reaction.', 'A catalyst shortens the time taken to reach equilibrium.'],
      ['the temperature and K', 'Raising the temperature lowers K for an exothermic reaction.', 'Raising the temperature raises K for an exothermic reaction.', 'It favours the endothermic direction, which is the backward one here.', 'It favours the exothermic direction, which is the forward one here.', 'K changes only with temperature.'],
    ],
  },
  '6b': {
    ar: [
      ['the polybasic acid', 'H₃PO₄ gives up its second proton less readily than its first.', 'H₃PO₄ gives up its second proton more readily than its first.', 'Removing H⁺ from the negative ion H₂PO₄⁻ is harder than from the neutral molecule.', 'The second proton is held by a weaker bond.', 'H₃PO₄ is a tribasic acid.'],
      ['the common ion effect', 'Sodium ethanoate suppresses the ionisation of ethanoic acid.', 'Sodium ethanoate increases the ionisation of ethanoic acid.', 'It adds a common ion, which shifts the equilibrium to the left.', 'It removes the ethanoate ions from the solution.', 'Ethanoic acid is a weak acid.'],
      ['salt hydrolysis', 'A solution of sodium carbonate is alkaline.', 'A solution of sodium carbonate is acidic.', 'The carbonate ion is hydrolysed to give hydroxide ions.', 'The sodium ion is hydrolysed to give hydrogen ions.', 'Sodium carbonate is used as washing soda.'],
    ],
  },
  '7a': {
    ar: [
      ['oxidation and reduction', 'Oxidation and reduction always occur together.', 'Oxidation can occur with no reduction.', 'Electrons lost by one species must be gained by another.', 'Electrons can be lost into empty space.', 'A reducing agent is itself oxidised.'],
      ['hydrogen peroxide', 'H₂O₂ can act as both an oxidising and a reducing agent.', 'H₂O₂ can act only as an oxidising agent.', 'Oxygen in it has −1, between −2 and 0.', 'Oxygen in it has its lowest possible oxidation number.', 'H₂O₂ can decompose into water and oxygen.'],
      ['disproportionation', 'Cl₂ with cold NaOH is a disproportionation.', 'Cl₂ with cold NaOH isn’t a redox reaction.', 'Chlorine is both oxidised and reduced in it.', 'Chlorine’s oxidation number stays the same in it.', 'The products of the reaction include NaCl and NaClO.'],
    ],
  },
  '8a': {
    ar: [
      ['isomerism', 'Pentane and 2,2-dimethylpropane are isomers.', 'Pentane and 2,2-dimethylpropane are the same compound.', 'Both are C₅H₁₂, with different chains.', 'They have different molecular formulae.', 'They are chain isomers.'],
      ['chirality', 'Butan-2-ol is optically active.', 'Butan-2-ol is optically inactive.', 'It has a carbon atom bonded to four different groups.', 'It has no carbon atom bonded to four different groups.', 'A chiral molecule has a non-superimposable mirror image.'],
      ['nomenclature', 'The longest chain gives the parent name of an alkane.', 'The shortest chain gives the parent name of an alkane.', 'IUPAC names are built on the longest continuous chain.', 'IUPAC names are built on the smallest group.', 'Numbering gives substituents the lowest possible numbers.'],
    ],
  },
  '8b': {
    ar: [
      ['distillation under reduced pressure', 'Glycerol is distilled under reduced pressure.', 'Glycerol is distilled only at raised pressure.', 'It decomposes before reaching its normal boiling point.', 'It boils at a very low temperature.', 'Lowering the pressure lowers a boiling point.'],
      ['the sublimation of solids', 'Naphthalene can be purified by sublimation.', 'Naphthalene can’t be purified by sublimation.', 'It turns directly into vapour on heating.', 'It doesn’t vaporise at any temperature.', 'Iodine also sublimes.'],
      ['Lassaigne’s test', 'Organic compounds are fused with sodium to test for nitrogen.', 'Organic compounds are boiled in water to test for nitrogen.', 'Sodium turns covalent nitrogen into ionic cyanide.', 'Sodium removes nitrogen from the sample altogether.', 'A Prussian blue colour shows nitrogen.'],
    ],
  },
  '8c': {
    ar: [
      ['the stability of carbocations', 'A tertiary carbocation is more stable than a primary one.', 'A primary carbocation is more stable than a tertiary one.', 'Alkyl groups push electrons towards the positive carbon.', 'Alkyl groups pull electrons away from the positive carbon.', 'Carbocations have sp² carbon atoms.'],
      ['the inductive effect', 'Chloroethanoic acid is stronger than ethanoic acid.', 'Ethanoic acid is stronger than chloroethanoic acid.', 'Chlorine’s −I effect stabilises the anion.', 'Chlorine’s +I effect destabilises the anion.', 'The inductive effect falls off along a chain.'],
      ['resonance', 'All the carbon–oxygen bonds in a carbonate ion are the same length.', 'The carbon–oxygen bonds in a carbonate ion have three different lengths.', 'The ion is a resonance hybrid.', 'One bond is a true double bond at all times.', 'Resonance structures differ only in where electrons are.'],
    ],
  },
  '9a': {
    ar: [
      ['the reactivity of alkanes', 'Alkanes are fairly unreactive.', 'Alkanes are highly reactive with most reagents.', 'They have only strong, non-polar C–C and C–H bonds.', 'They have many weak, polar bonds.', 'Alkanes burn in plenty of oxygen to form carbon dioxide and water.'],
      ['boiling points of alkanes', 'Neopentane boils lower than n-pentane.', 'Neopentane boils higher than n-pentane.', 'Its more nearly spherical shape has less surface for van der Waals forces.', 'Its molecules form hydrogen bonds with each other.', 'These two compounds are isomers.'],
      ['the halogenation of alkanes', 'Chlorination of methane needs light.', 'Chlorination of methane needs no light or heat.', 'Light breaks Cl₂ into free radicals, which start the chain.', 'Light breaks methane into ions.', 'A mixture of products forms if chlorine is in excess.'],
    ],
  },
  '9b': {
    ar: [
      ['Markovnikov’s rule', 'HBr adds to propene to give mostly 2-bromopropane.', 'HBr adds to propene to give mostly 1-bromopropane.', 'The more stable secondary carbocation forms.', 'The less stable primary carbocation forms.', 'Peroxides reverse this, but only with HBr.'],
      ['geometrical isomers', 'But-2-ene shows geometrical isomerism.', 'But-1-ene shows geometrical isomerism.', 'Each carbon of its double bond has two different groups.', 'Its double bond rotates freely.', 'Cis isomers usually have a higher boiling point.'],
      ['the reaction of alkenes', 'Alkenes decolourise bromine water.', 'Alkanes decolourise bromine water in the dark.', 'The C=C bond adds bromine across it.', 'Bromine dissolves in the C–H bonds.', 'A π bond is weaker than a σ bond.'],
    ],
  },
  '9c': {
    ar: [
      ['the acidity of alkynes', 'Ethyne is acidic, compared with ethene.', 'Ethene is more acidic than ethyne.', 'The sp carbon has more s character, so it holds the electrons closer.', 'The sp carbon has less s character than sp².', 'Ethyne reacts with sodamide.'],
      ['the structure of ethyne', 'Ethyne is linear.', 'Ethyne is bent at each carbon.', 'Its carbon atoms are sp hybridised.', 'Its carbon atoms are sp³ hybridised.', 'A triple bond has one σ and two π bonds.'],
      ['the hydration of alkynes', 'Ethyne gives ethanal with dilute H₂SO₄ and HgSO₄.', 'Ethyne gives ethanol with dilute H₂SO₄ and HgSO₄.', 'The first product, an enol, rearranges into the aldehyde.', 'The first product loses a carbon atom.', 'Other alkynes give ketones this way.'],
    ],
  },
  '9d': {
    ar: [
      ['aromatic substitution', 'Benzene prefers substitution to addition.', 'Benzene prefers addition to substitution.', 'Substitution keeps its stable aromatic ring.', 'Addition makes its ring more stable.', 'Its six π electrons are delocalised.'],
      ['the carbon–carbon bonds in benzene', 'All the carbon–carbon bonds in benzene have the same length.', 'Benzene has three short and three long carbon–carbon bonds.', 'Its π electrons are spread evenly around the ring.', 'Its π electrons stay between pairs of carbon atoms.', 'Its ring is flat, with each carbon sp² hybridised.'],
      ['directing groups', 'A methyl group directs an incoming group to the ortho and para positions.', 'A methyl group directs an incoming group to the meta position.', 'It pushes electrons into those positions.', 'It pulls electrons out of those positions.', 'A nitro group directs to the meta position.'],
    ],
  },
  '10a': {
    ar: [
      ['rinsing the burette', 'A burette is rinsed with the solution it will hold.', 'A burette is rinsed with water last of all, just before filling.', 'Water left inside would dilute the solution.', 'Rinsing with the solution dilutes it.', 'A conical flask is rinsed with distilled water only.'],
      ['reading the burette', 'The lower meniscus is read for a colourless solution in a burette.', 'The upper meniscus is read for a colourless solution in a burette.', 'A colourless solution’s lower curve is the clearest line to see.', 'A colourless solution has no lower curve.', 'A dark solution, like KMnO₄, is read at the upper meniscus.'],
      ['the self-indicator', 'A KMnO₄ titration needs no separate indicator.', 'A KMnO₄ titration needs methyl orange.', 'One extra drop of KMnO₄ turns the solution pink.', 'KMnO₄ is colourless in water.', 'It is carried out in dilute sulphuric acid.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A);
