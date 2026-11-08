// Chemistry, Class XII: knowledge added to what chemistry-xii.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import MORE_A from './more/chemistry-xii-a';
import MORE_B from './more/chemistry-xii-b';
import MORE_C from './more/chemistry-xii-c';

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['osmosis', 'A cucumber shrinks in salty water.', 'A cucumber swells in salty water.', 'The salt solution is hypertonic to the cucumber’s cells.', 'The salt solution is hypotonic to the cucumber’s cells.', 'Osmosis also lets plants take in water through their roots.'],
      ['the vapour pressure of a solution', 'A non-volatile solute lowers a liquid’s vapour pressure.', 'A non-volatile solute raises a liquid’s vapour pressure.', 'Fewer solvent molecules are at the surface to escape.', 'More solvent molecules are at the surface to escape.', 'Raoult’s law relates this lowering to the mole fraction of the solute.'],
      ['the abnormal molar mass', 'Ethanoic acid in benzene shows about half its expected depression of freezing point.', 'Ethanoic acid in benzene shows about twice its expected depression of freezing point.', 'Its molecules form dimers there.', 'Its molecules split into ions there.', 'The van’t Hoff factor is then about 0.5.'],
      ['the van’t Hoff factor', 'A 0.1 m NaCl solution has about twice the expected freezing point depression.', 'A 0.1 m NaCl solution has about half the expected freezing point depression.', 'It splits into two ions, and colligative properties depend on the number of particles.', 'It forms dimers in water.', 'Its van’t Hoff factor is close to 2.'],
      ['non-ideal solutions', 'An ethanol and water mixture shows positive deviation from Raoult’s law.', 'An ethanol and water mixture shows no deviation from Raoult’s law.', 'Their mutual attractions are weaker than those in the pure liquids.', 'Their mutual attractions are much stronger than those in the pure liquids.', 'Acetone and chloroform show a negative deviation.'],
    ],
  },
  '2a': {
    ar: [
      ['electrode signs', 'The anode of a galvanic cell is negative.', 'The anode of a galvanic cell is positive.', 'Oxidation there releases electrons onto the electrode.', 'Reduction there takes electrons from the electrode.', 'Zinc is the anode of a Daniell cell.'],
      ['copper and acids', 'Copper doesn’t displace hydrogen from dilute acid.', 'Copper readily displaces hydrogen from dilute acid.', 'Its standard electrode potential is positive.', 'Its standard electrode potential is negative.', 'Zinc does displace hydrogen from dilute acid.'],
      ['the salt bridge', 'A salt bridge lets a Daniell cell keep working.', 'A salt bridge stops a Daniell cell from working.', 'It keeps both half-cells electrically neutral.', 'It carries electrons between the half-cells.', 'KCl is often used in a salt bridge.'],
    ],
  },
  '2b': {
    ar: [
      ['the molar conductivity of weak electrolytes', 'The molar conductivity of a weak electrolyte rises sharply on dilution.', 'The molar conductivity of a weak electrolyte falls sharply on dilution.', 'Dilution greatly raises its degree of ionisation.', 'Dilution greatly lowers its degree of ionisation.', 'Kohlrausch’s law gives its value at infinite dilution.'],
      ['conductivity and dilution', 'The conductivity of a solution falls on dilution.', 'The conductivity of a solution rises on dilution.', 'There are fewer ions per unit volume.', 'There are more ions per unit volume.', 'Molar conductivity, by contrast, rises on dilution.'],
      ['Faraday’s laws', 'The mass of copper deposited is proportional to the charge passed.', 'The mass of copper deposited doesn’t depend on the charge passed.', 'Each copper ion needs a fixed number of electrons.', 'Each copper ion gives electrons to the cathode.', 'One faraday is about 96 500 C.'],
    ],
  },
  '2c': {
    ar: [
      ['the fuel cell', 'A hydrogen–oxygen fuel cell is more efficient than burning the hydrogen.', 'Burning the hydrogen is always far more efficient than a fuel cell.', 'It turns chemical energy straight into electricity, not through heat.', 'It wastes most of the energy as heat.', 'Its product is water.'],
      ['the dry cell', 'A dry cell can’t be recharged.', 'A dry cell is recharged in normal use.', 'Its cell reaction can’t be reversed by passing a current.', 'It contains no electrolyte at all.', 'A dry cell is a primary cell.'],
      ['painting iron', 'Painting iron stops it rusting.', 'Painting iron speeds up its rusting.', 'Paint keeps oxygen and water away from the metal.', 'Paint reacts with iron to form a protective oxide.', 'Oiling and greasing work in the same way.'],
    ],
  },
  '3a': {
    ar: [
      ['order and the half-life', 'The half-life of a first-order reaction doesn’t depend on the starting concentration.', 'The half-life of a first-order reaction is proportional to the starting concentration.', 't½ = 0.693/k, which has no concentration in it.', 't½ = 0.693 k, which has concentration in it.', 'A zero-order half-life does depend on the starting concentration.'],
      ['order and molecularity', 'The order of a reaction can be a fraction.', 'The order of a reaction must be a whole number.', 'It is the sum of the powers in a rate law found by experiment, and these needn’t be whole numbers.', 'It is always the sum of the coefficients in the equation.', 'Molecularity must be a whole number.'],
      ['the units of k', 'A rate constant’s unit tells the order of a reaction.', 'All rate constants have the same unit.', 'Its unit is (mol/L)¹⁻ⁿ s⁻¹ for an order n.', 'Its unit is always mol/L.', 'A first-order rate constant has the unit s⁻¹.'],
      ['pseudo-first-order reactions', 'The hydrolysis of an ester in much water is first order.', 'The hydrolysis of an ester in much water is second order in water.', 'Water’s concentration hardly changes.', 'Water doesn’t take part in the reaction.', 'Such a reaction is called pseudo-first-order.'],
    ],
  },
  '3b': {
    ar: [
      ['the Arrhenius plot', 'A plot of log k against 1/T is a straight line.', 'A plot of log k against T is a straight line.', 'log k = log A − Ea/(2.303RT), which is linear in 1/T.', 'k rises in direct proportion to T.', 'A is called the frequency factor.'],
      ['the catalyst', 'A catalyst raises the rate of a reaction.', 'A catalyst lowers the rate of a reaction.', 'It offers a path of lower activation energy.', 'It raises the activation energy.', 'Enzymes are biological catalysts.'],
      ['a catalyst and ΔH', 'A catalyst doesn’t change the enthalpy change of a reaction.', 'A catalyst lowers the enthalpy change of a reaction.', 'It changes only the path, not the energies of the reactants and products.', 'It is used up in the reaction.', 'A catalyst has the same mass at the end of the reaction.'],
    ],
  },
  '4a': {
    ar: [
      ['the colour of transition metal ions', 'Most transition metal ions are coloured.', 'All transition metal ions are colourless.', 'Visible light excites d electrons from one d orbital to another.', 'Their nuclei emit visible light.', 'Sc³⁺ and Zn²⁺ are colourless.'],
      ['the oxidation states', 'Transition metals show several oxidation states.', 'Transition metals show only one oxidation state.', 'The energies of their (n−1)d and ns electrons are close.', 'Their d electrons can’t be removed.', 'Manganese shows a state of up to +7.'],
      ['catalysts and complexes', 'Many transition metals are good catalysts.', 'Transition metals never act as catalysts.', 'They can change oxidation state, and provide a surface.', 'They don’t react with anything.', 'Iron is the catalyst in the Haber process.'],
      ['the lanthanoid contraction', 'Zr and Hf have nearly equal atomic radii.', 'Hf is far larger than Zr.', 'The lanthanoid contraction cancels the size gained from an extra shell.', 'Hf has one electron shell fewer than Zr.', 'The contraction comes from the poor shielding of 4f electrons.'],
    ],
  },
  '4b': {
    ar: [
      ['the effect of pH on chromate', 'Dichromate turns to chromate in alkali.', 'Dichromate stays unchanged in alkali.', 'The two ions are in an equilibrium that depends on pH.', 'Dichromate has no chromium in it.', 'Dichromate is orange, and chromate is yellow.'],
      ['potassium permanganate in acid', 'Acidified KMnO₄ is decolourised by iron(II).', 'Acidified KMnO₄ turns a deeper purple with iron(II).', 'Purple MnO₄⁻ is reduced to nearly colourless Mn²⁺.', 'Colourless Mn²⁺ is oxidised to purple MnO₄⁻.', 'Manganese goes from +7 to +2 in this change.'],
      ['the acid used in KMnO₄ titrations', 'KMnO₄ titrations use dilute sulphuric acid rather than hydrochloric acid.', 'KMnO₄ titrations use hydrochloric acid rather than dilute sulphuric acid.', 'KMnO₄ would oxidise the chloride ions.', 'KMnO₄ would oxidise the sulphate ions.', 'Sulphuric acid isn’t oxidised by KMnO₄.'],
    ],
  },
  '5a': {
    ar: [
      ['the chelate effect', 'EDTA forms especially stable complexes.', 'EDTA forms only very weak complexes.', 'It is hexadentate, so it makes several rings around the metal.', 'It is monodentate, so it uses one bond.', 'A chelate has a ligand with two or more donor atoms.'],
      ['the spectrochemical series', '[Co(NH₃)₆]³⁺ is diamagnetic, while [CoF₆]³⁻ is paramagnetic.', '[Co(NH₃)₆]³⁺ is paramagnetic, while [CoF₆]³⁻ is diamagnetic.', 'NH₃ is a strong-field ligand, and F⁻ a weak-field one.', 'F⁻ is a strong-field ligand, and NH₃ a weak-field one.', 'A strong-field ligand gives a large crystal field splitting.'],
      ['the isomers of complexes', '[Pt(NH₃)₂Cl₂] has cis and trans isomers.', '[Pt(NH₃)₂Cl₂] has no isomers.', 'It is square planar.', 'It is tetrahedral.', 'Cisplatin is one of them, and is used against cancer.'],
      ['the tetrahedral field', 'Tetrahedral complexes are nearly always high spin.', 'Tetrahedral complexes are nearly always low spin.', 'Their crystal field splitting is small, about 4/9 of the octahedral.', 'Their crystal field splitting is very large.', '[NiCl₄]²⁻ is a tetrahedral complex.'],
    ],
  },
  '6a': {
    ar: [
      ['SN2 and alkyl groups', 'Primary halides react by SN2 faster than tertiary ones.', 'Tertiary halides react by SN2 faster than primary ones.', 'Bulky groups around the carbon block the nucleophile’s attack.', 'Primary halides have larger groups around the carbon.', 'SN2 happens in one step.'],
      ['SN1 and carbocations', 'Tertiary halides react by SN1 faster than primary ones.', 'Primary halides react by SN1 faster than tertiary ones.', 'A tertiary carbocation is the most stable.', 'A primary carbocation is the most stable.', 'SN1 goes through a carbocation in two steps.'],
      ['the boiling point of halides', 'Bromoethane boils higher than chloroethane.', 'Chloroethane boils higher than bromoethane.', 'Bromine’s larger size gives stronger van der Waals forces.', 'Bromine forms hydrogen bonds with itself.', 'Haloalkanes are nearly insoluble in water.'],
      ['the C–X bond', 'Iodoalkanes react faster than chloroalkanes in substitution.', 'Chloroalkanes react faster than iodoalkanes in substitution.', 'The C–I bond is the weakest of them.', 'The C–I bond is the strongest of them.', 'The C–X bond is polar in a haloalkane.'],
    ],
  },
  '6b': {
    ar: [
      ['the C–X bond in aryl halides', 'Aryl halides are less reactive than alkyl halides to nucleophiles.', 'Aryl halides are more reactive than alkyl halides to nucleophiles.', 'Their C–X bond has partial double bond character from resonance.', 'Their C–X bond is much longer than in alkyl halides.', 'Chlorobenzene has a smaller dipole moment than chloromethane.'],
      ['electron-withdrawing groups', 'A nitro group para to the chlorine makes chlorobenzene react faster with nucleophiles.', 'A nitro group para to the chlorine stops chlorobenzene from reacting with nucleophiles.', 'It stabilises the negative charge in the intermediate.', 'It adds electrons to the ring.', 'The nitro group is electron-withdrawing.'],
    ],
  },
  '6c': {
    ar: [
      ['CFCs and ozone', 'One CFC molecule can destroy many ozone molecules.', 'One CFC molecule can destroy only one ozone molecule.', 'The chlorine atom it releases is regenerated in a chain.', 'The chlorine atom it releases is used up at once.', 'CFCs are very unreactive in the lower atmosphere.'],
      ['the use of DDT', 'DDT is now restricted in many countries.', 'DDT is now the first choice of insecticide everywhere.', 'It stays in the environment and builds up in food chains.', 'It breaks down within a few minutes.', 'DDT is a polyhalogen compound.'],
      ['iodoform', 'Iodoform is used as an antiseptic.', 'Iodoform is used as an anaesthetic.', 'It frees iodine, which is antiseptic.', 'It frees chlorine, which is antiseptic.', 'Iodoform is a yellow solid.'],
    ],
  },
  '7a': {
    ar: [
      ['the boiling point of alcohols', 'Ethanol boils far higher than methoxymethane.', 'Methoxymethane boils far higher than ethanol.', 'Ethanol’s molecules are hydrogen-bonded.', 'Methoxymethane’s molecules are hydrogen-bonded.', 'The two compounds are isomers.'],
      ['the reactivity with HCl', 'Tertiary alcohols react fastest with HCl.', 'Primary alcohols react fastest with HCl.', 'They form the most stable carbocation.', 'They form the least stable carbocation.', 'The Lucas test is based on this.'],
      ['the acidity of alcohols', 'Alcohols are weaker acids than water.', 'Alcohols are much stronger acids than water.', 'Their alkyl group pushes electrons to the oxygen.', 'Their alkyl group pulls electrons from the oxygen.', 'Alcohols react with sodium, giving hydrogen.'],
      ['the oxidation of alcohols', 'Tertiary alcohols resist mild oxidation.', 'Tertiary alcohols are oxidised most easily.', 'Their carbinol carbon has no hydrogen on it.', 'Their carbinol carbon has three hydrogens on it.', 'Primary alcohols are oxidised to aldehydes.'],
    ],
  },
  '7b': {
    ar: [
      ['the acidity of phenol', 'Phenol is a stronger acid than ethanol.', 'Ethanol is a stronger acid than phenol.', 'The phenoxide ion is stabilised by resonance.', 'The ethoxide ion is stabilised by resonance.', 'Phenol doesn’t react with sodium hydrogencarbonate.'],
      ['the bromination of phenol', 'Phenol reacts with bromine water without a catalyst.', 'Phenol needs FeBr₃ to react with bromine water.', 'The –OH group strongly activates the ring.', 'The –OH group strongly deactivates the ring.', 'The product is a white precipitate of 2,4,6-tribromophenol.'],
      ['nitrophenols', 'o-Nitrophenol is more volatile than p-nitrophenol.', 'p-Nitrophenol is more volatile than o-nitrophenol.', 'Its hydrogen bonds are within each molecule.', 'Its hydrogen bonds link separate molecules.', 'The two can be separated by steam distillation.'],
    ],
  },
  '7c': {
    ar: [
      ['the solubility of ethers', 'Ethers of low mass dissolve to some extent in water.', 'Ethers of low mass don’t dissolve in water at all.', 'Their oxygen can form hydrogen bonds with water.', 'They form ions in water.', 'Ethoxyethane is less dense than water.'],
      ['the Williamson synthesis', 'A primary halide gives the best yield in the Williamson synthesis.', 'A tertiary halide gives the best yield in the Williamson synthesis.', 'A tertiary halide tends to eliminate instead.', 'A primary halide tends to eliminate instead.', 'Anisole can be made from sodium phenoxide and iodomethane.'],
      ['the bond angle', 'The C–O–C bond angle in an ether is close to the tetrahedral value.', 'The C–O–C bond angle in an ether is 180°.', 'The oxygen is sp³ hybridised.', 'The oxygen is sp hybridised.', 'The C–O bond is polar.'],
    ],
  },
  '8a': {
    ar: [
      ['aldehydes and ketones in nucleophilic addition', 'Aldehydes are generally more reactive than ketones to nucleophiles.', 'Ketones are generally more reactive than aldehydes to nucleophiles.', 'Aldehydes have less crowding and less electron release at the carbonyl carbon.', 'Aldehydes have two alkyl groups at the carbonyl carbon.', 'Nucleophiles attack the carbonyl carbon.'],
      ['the aldol reaction', 'Ethanal undergoes aldol condensation, while methanal doesn’t.', 'Methanal undergoes aldol condensation, while ethanal doesn’t.', 'Ethanal has an α-hydrogen.', 'Methanal has an α-hydrogen.', 'Dilute alkali is used for the reaction.'],
      ['the Cannizzaro reaction', 'Methanal undergoes the Cannizzaro reaction.', 'Ethanal undergoes the Cannizzaro reaction.', 'It has no α-hydrogen.', 'It has three α-hydrogens.', 'Concentrated alkali is used for the reaction.'],
      ['the tests for aldehydes', 'Aldehydes reduce Tollens’ reagent, and ketones don’t.', 'Ketones reduce Tollens’ reagent, and aldehydes don’t.', 'An aldehyde’s C–H bond makes it easily oxidised.', 'A ketone’s C–H bond on its carbonyl makes it easily oxidised.', 'A silver mirror shows a positive test.'],
    ],
  },
  '8b': {
    ar: [
      ['benzoic acid in water', 'Benzoic acid is only slightly soluble in cold water.', 'Benzoic acid mixes with cold water in all proportions.', 'Its large phenyl group is non-polar.', 'It forms no hydrogen bonds at all.', 'It dissolves much better in hot water.'],
      ['the boiling points of acids', 'Ethanoic acid boils higher than propan-1-ol.', 'Propan-1-ol boils higher than ethanoic acid.', 'Its molecules form hydrogen-bonded dimers.', 'Its molecules have no hydrogen bonds.', 'The two compounds have similar molar masses.'],
      ['the carbonyl of an acid', 'The C=O of a carboxylic acid doesn’t give the usual addition reactions of ketones.', 'The C=O of a carboxylic acid adds HCN and NaHSO₃ just as a ketone does.', 'Its electrons are shared by resonance with the –OH oxygen.', 'A carboxylic acid has no C=O group.', 'Carboxylic acids do react with PCl₅.'],
    ],
  },
  '9a': {
    ar: [
      ['the basicity of amines', 'Methanamine is a stronger base than ammonia.', 'Ammonia is a stronger base than methanamine.', 'The methyl group pushes electrons to the nitrogen.', 'The methyl group pulls electrons from the nitrogen.', 'Amines are bases because of their lone pair.'],
      ['the basicity of aniline', 'Aniline is a weaker base than methanamine.', 'Aniline is a stronger base than methanamine.', 'Its lone pair is delocalised into the ring.', 'Its lone pair is concentrated on the nitrogen.', 'Aniline has an amino group joined directly to a benzene ring.'],
      ['the nitration of aniline', 'Direct nitration of aniline gives a lot of the meta product.', 'Direct nitration of aniline gives only the ortho and para products.', 'In acid, aniline forms the anilinium ion, which directs to the meta position.', 'The amino group always directs to the meta position.', 'Acetylating the amino group first protects it.'],
      ['the carbylamine test', 'Only primary amines give the carbylamine test.', 'Only tertiary amines give the carbylamine test.', 'The test needs two hydrogens on the nitrogen.', 'The test needs no hydrogen on the nitrogen.', 'An isocyanide forms, with a foul smell.'],
    ],
  },
  '9b': {
    ar: [
      ['the reduction of cyanides', 'Reducing a nitrile gives a primary amine.', 'Reducing a nitrile gives a secondary amine.', 'The –C≡N group becomes –CH₂NH₂.', 'The –C≡N group loses its carbon atom.', 'LiAlH₄ can carry out this reduction.'],
      ['the hydrolysis of cyanides', 'Hydrolysing a nitrile gives a carboxylic acid.', 'Hydrolysing a nitrile gives an alcohol.', 'The carbon of the –CN group becomes that of a –COOH group.', 'The carbon of the –CN group is lost.', 'Under mild conditions, hydrolysis can stop at the amide.'],
      ['isomeric cyanides', 'Ethanenitrile and methyl isocyanide are isomers.', 'Ethanenitrile and methyl isocyanide have different molecular formulae.', 'Both are C₂H₃N, with the CN group joined in different ways.', 'One has an extra hydrogen atom.', 'Isocyanides have a foul smell.'],
    ],
  },
  '9c': {
    ar: [
      ['the coupling reaction', 'Coupling with phenol takes place in mildly alkaline conditions.', 'Coupling with phenol takes place in strongly acidic conditions.', 'The phenoxide ion formed is more reactive than phenol.', 'Phenol can’t react with electrophiles.', 'Coupling gives a brightly coloured azo dye.'],
      ['the acid in diazotisation', 'Diazotisation is done with excess hydrochloric acid.', 'Diazotisation is done in alkaline solution.', 'Excess acid stops the diazonium salt from coupling with unreacted aniline.', 'Alkali is needed to make nitrous acid from NaNO₂.', 'The mixture is kept at 273–278 K.'],
    ],
  },
  '10a': {
    ar: [
      ['glucose as a reducing sugar', 'Glucose reduces Fehling’s solution.', 'Glucose doesn’t reduce Fehling’s solution.', 'It has a free aldehyde group in solution.', 'It has no carbonyl group at all, in any form.', 'A brick-red precipitate shows a positive test.'],
      ['sucrose', 'Sucrose isn’t a reducing sugar.', 'Sucrose is a strong reducing sugar.', 'Its two units are linked through their reducing groups.', 'It has a free aldehyde group.', 'Sucrose is a disaccharide.'],
      ['starch and cellulose', 'Humans can’t digest cellulose, though they digest starch.', 'Humans digest cellulose, though they can’t digest starch.', 'Cellulose has β-glycosidic links, for which we have no enzyme.', 'Cellulose has α-glycosidic links, which are unbreakable.', 'Both are polymers of glucose.'],
    ],
  },
  '10b': {
    ar: [
      ['denaturation', 'Boiling an egg can’t be reversed by cooling it.', 'A boiled egg goes back to its raw state on cooling.', 'Heat destroys the protein’s folded shape for good.', 'Heat breaks all its peptide bonds at once.', 'Egg albumin is a globular protein.'],
      ['the solubility of amino acids', 'Amino acids dissolve in water but hardly in benzene.', 'Amino acids dissolve in benzene but hardly in water.', 'As dipolar ions, they are strongly attracted to polar water molecules.', 'They are non-polar molecules.', 'At its isoelectric point, an amino acid doesn’t move in an electric field.'],
      ['the secondary structure', 'An α-helix is held by hydrogen bonds.', 'An α-helix is held by peptide bonds alone.', 'The N–H and C=O groups along the chain link up.', 'Its side chains are bonded by metal ions.', 'A β-pleated sheet is also a secondary structure.'],
    ],
  },
  '10c': {
    ar: [
      ['fat-soluble vitamins', 'Vitamins A and D can build up in the body.', 'Vitamins A and D are quickly lost in urine.', 'They are stored in the liver and fat, as they are fat-soluble.', 'They dissolve in water.', 'Too much vitamin A can be harmful.'],
      ['cooking and vitamin C', 'Overcooking vegetables can destroy much of their vitamin C.', 'Cooking makes vitamin C more plentiful in vegetables.', 'Vitamin C is easily destroyed by heat and dissolves in cooking water.', 'Heat turns other vitamins into vitamin C.', 'Amla is rich in vitamin C.'],
      ['the need for vitamins', 'A deficiency of vitamin D causes rickets.', 'A deficiency of vitamin D causes scurvy.', 'It is needed for the body to take up calcium.', 'It is needed for the blood to clot.', 'Milk and eggs contain vitamin D.'],
    ],
  },
  '10d': {
    ar: [
      ['base pairing', 'Adenine is equal in amount to thymine in DNA.', 'Adenine is equal in amount to guanine in DNA.', 'Each adenine pairs with a thymine on the other strand.', 'Each adenine pairs with another adenine on the other strand.', 'Adenine is a purine.'],
      ['the differences of DNA and RNA', 'RNA has uracil in place of thymine.', 'RNA has thymine in place of uracil.', 'Its four bases are A, U, G and C.', 'Its four bases are A, T, G and C.', 'Messenger RNA carries the code to the ribosome.'],
      ['the structure of DNA', 'DNA’s two strands hold together along their length.', 'DNA’s two strands aren’t joined.', 'Hydrogen bonds link its base pairs.', 'Peptide bonds link its base pairs.', 'The strands form a double helix.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A, MORE_B, MORE_C);
