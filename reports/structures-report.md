# Structures report

Every structure in the app is drawn from a SMILES string by RDKit 2026.09.1, in the build. None is drawn by hand. The build fails if any of these checks fails.

1. The SMILES parses in RDKit.
2. Its molecular formula, worked out from the SMILES, matches every condensed formula in the data that points at it. A mis-mapped compound stops the build here.
3. Its InChIKey matches the one [PubChem](https://pubchem.ncbi.nlm.nih.gov/) gives for that compound's name, and PubChem's molecular weight is within 0.1 of the SMILES.

Date checked: 2026-11-05. PubChem's answers are kept in `scripts/structures/pubchem-cache.json`.

## Result

- Compounds in the dictionary: 254, of which 233 are used and shipped.
- Offered under "Pick by name" in the formula editor: **254**, which is every compound that passed. The name comes from PubChem's check above, and `tests/unit/smiles-guide.test.ts` checks the formula and mass of each one against its SMILES a second time, with the editor's own reader.
- Exact match with PubChem, including stereochemistry: **247**
- Same connectivity as PubChem, stereochemistry differs or is unspecified: **4** (listed below)
- Same formula and mass, drawn with a covalent metal bond as taught, where PubChem stores it as ionic: **3** (listed below)
- PubChem did not recognise the name: **0** (listed below)
- Could not reach PubChem: **0**
- Chemistry entries given a structure: **361**, of which 80 show a worked example for a reaction written with R.

## Not an exact match: please look at these

| Compound | Formula | Mass | SMILES | PubChem name | Result |
|---|---|---|---|---|---|
| But-2-ene | C4H8 | 56.11 | `CC=CC` | 2-butene ([CID 62695](https://pubchem.ncbi.nlm.nih.gov/compound/62695)) | same skeleton |
| Benzaldehyde oxime | C7H7NO | 121.14 | `ON=Cc1ccccc1` | Benzaldehyde oxime ([CID 5324611](https://pubchem.ncbi.nlm.nih.gov/compound/5324611)) | same skeleton |
| Benzaldehyde phenylhydrazone | C13H12N2 | 196.25 | `C(=NNc1ccccc1)c1ccccc1` | Benzaldehyde phenylhydrazone ([CID 6436752](https://pubchem.ncbi.nlm.nih.gov/compound/6436752)) | same skeleton |
| 2,3-Dihydroxybutanedioic acid (tartaric acid) | C4H6O6 | 150.09 | `OC(C(O)C(O)=O)C(O)=O` | tartaric acid ([CID 444305](https://pubchem.ncbi.nlm.nih.gov/compound/444305)) | same skeleton |
| Phenylmagnesium bromide | C6H5BrMg | 181.32 | `Br[Mg]c1ccccc1` | Phenylmagnesium bromide ([CID 66852](https://pubchem.ncbi.nlm.nih.gov/compound/66852)) | drawn covalent |
| Ethylmagnesium bromide | C2H5BrMg | 133.27 | `CC[Mg]Br` | Ethylmagnesium bromide ([CID 101914](https://pubchem.ncbi.nlm.nih.gov/compound/101914)) | drawn covalent |
| Methylmagnesium bromide | CH3BrMg | 119.24 | `C[Mg]Br` | Methylmagnesium bromide ([CID 6349](https://pubchem.ncbi.nlm.nih.gov/compound/6349)) | drawn covalent |

"Same skeleton" means the atoms and bonds agree, and only the stereo layer differs: usually because PubChem's record for that name leaves a centre or a double bond unspecified, or describes a different form of the same sugar.

## Scope

From the syllabus map, structures are given to the organic units: Class XI Unit 8 (basic principles, isomerism) and Unit 9 (hydrocarbons), and Class XII Units 6 to 10 (haloalkanes and haloarenes; alcohols, phenols and ethers; aldehydes, ketones and carboxylic acids; nitrogen compounds; biomolecules).

**Inorganic and coordination compounds have none.** The syllabus asks for Lewis structures and shapes in bonding, and for isomerism and shapes in coordination compounds. A bond-line drawing from SMILES can't show a VSEPR shape or an octahedral complex faithfully, and a wrong structure is worse than none. K2Cr2O7 and KMnO4 are listed for "preparation and properties" only.

**What is left out on purpose.** Generic entries written only with R or Ar and no example (a general formula has no one structure). Combustion and elemental analysis, where the structure adds nothing. Polymers. Any reaction with a carbon compound that has no verified structure here: drawing only half of a reaction would mislead, so the whole entry stays as text. Any molecular formula that fits more than one compound, such as C4H10, unless the entry says which it means.

## All compounds

| Compound | Formula | Mass | SMILES | PubChem name | Result |
|---|---|---|---|---|---|
| Methane | CH4 | 16.04 | `C` | Methane ([CID 297](https://pubchem.ncbi.nlm.nih.gov/compound/297)) | exact |
| Ethane | C2H6 | 30.07 | `CC` | Ethane ([CID 6324](https://pubchem.ncbi.nlm.nih.gov/compound/6324)) | exact |
| Propane | C3H8 | 44.10 | `CCC` | Propane ([CID 6334](https://pubchem.ncbi.nlm.nih.gov/compound/6334)) | exact |
| Butane | C4H10 | 58.12 | `CCCC` | Butane ([CID 7843](https://pubchem.ncbi.nlm.nih.gov/compound/7843)) | exact |
| 2-Methylpropane | C4H10 | 58.12 | `CC(C)C` | isobutane ([CID 6360](https://pubchem.ncbi.nlm.nih.gov/compound/6360)) | exact |
| Hexane | C6H14 | 86.18 | `CCCCCC` | Hexane ([CID 8058](https://pubchem.ncbi.nlm.nih.gov/compound/8058)) | exact |
| Heptane | C7H16 | 100.20 | `CCCCCCC` | Heptane ([CID 8900](https://pubchem.ncbi.nlm.nih.gov/compound/8900)) | exact |
| Cyclopropane | C3H6 | 42.08 | `C1CC1` | Cyclopropane ([CID 6351](https://pubchem.ncbi.nlm.nih.gov/compound/6351)) | exact |
| Cyclohexane | C6H12 | 84.16 | `C1CCCCC1` | Cyclohexane ([CID 8078](https://pubchem.ncbi.nlm.nih.gov/compound/8078)) | exact |
| Ethene | C2H4 | 28.05 | `C=C` | ethylene ([CID 6325](https://pubchem.ncbi.nlm.nih.gov/compound/6325)) | exact |
| Propene | C3H6 | 42.08 | `CC=C` | Propene ([CID 8252](https://pubchem.ncbi.nlm.nih.gov/compound/8252)) | exact |
| But-1-ene | C4H8 | 56.11 | `CCC=C` | 1-butene ([CID 7844](https://pubchem.ncbi.nlm.nih.gov/compound/7844)) | exact |
| But-2-ene | C4H8 | 56.11 | `CC=CC` | 2-butene ([CID 62695](https://pubchem.ncbi.nlm.nih.gov/compound/62695)) | same skeleton |
| cis-But-2-ene | C4H8 | 56.11 | `C/C=C\C` | cis-2-butene ([CID 5287573](https://pubchem.ncbi.nlm.nih.gov/compound/5287573)) | exact |
| trans-But-2-ene | C4H8 | 56.11 | `C/C=C/C` | trans-2-butene ([CID 62695](https://pubchem.ncbi.nlm.nih.gov/compound/62695)) | exact |
| 2-Methylpropene | C4H8 | 56.11 | `CC(C)=C` | isobutylene ([CID 8255](https://pubchem.ncbi.nlm.nih.gov/compound/8255)) | exact |
| Chloroethene (vinyl chloride) | C2H3Cl | 62.50 | `C=CCl` | vinyl chloride ([CID 6338](https://pubchem.ncbi.nlm.nih.gov/compound/6338)) | exact |
| Bromoethene (vinyl bromide) | C2H3Br | 106.95 | `C=CBr` | vinyl bromide ([CID 11641](https://pubchem.ncbi.nlm.nih.gov/compound/11641)) | exact |
| Tetrafluoroethene | C2F4 | 100.01 | `FC(F)=C(F)F` | tetrafluoroethylene ([CID 8301](https://pubchem.ncbi.nlm.nih.gov/compound/8301)) | exact |
| 1,2-Dibromoethene | C2H2Br2 | 185.85 | `BrC=CBr` | 1,2-dibromoethylene ([CID 10897](https://pubchem.ncbi.nlm.nih.gov/compound/10897)) | exact |
| But-1-en-3-yne (vinylacetylene) | C4H4 | 52.08 | `C=CC#C` | vinylacetylene ([CID 12720](https://pubchem.ncbi.nlm.nih.gov/compound/12720)) | exact |
| Propenenitrile (acrylonitrile) | C3H3N | 53.06 | `C=CC#N` | acrylonitrile ([CID 7855](https://pubchem.ncbi.nlm.nih.gov/compound/7855)) | exact |
| Vinyl acetate | C4H6O2 | 86.09 | `CC(=O)OC=C` | Vinyl acetate ([CID 7904](https://pubchem.ncbi.nlm.nih.gov/compound/7904)) | exact |
| Ethenol (vinyl alcohol) | C2H4O | 44.05 | `C=CO` | vinyl alcohol ([CID 11199](https://pubchem.ncbi.nlm.nih.gov/compound/11199)) | exact |
| Ethyne | C2H2 | 26.04 | `C#C` | acetylene ([CID 6326](https://pubchem.ncbi.nlm.nih.gov/compound/6326)) | exact |
| Propyne | C3H4 | 40.07 | `CC#C` | Propyne ([CID 6335](https://pubchem.ncbi.nlm.nih.gov/compound/6335)) | exact |
| Benzene | C6H6 | 78.11 | `c1ccccc1` | Benzene ([CID 241](https://pubchem.ncbi.nlm.nih.gov/compound/241)) | exact |
| Toluene | C7H8 | 92.14 | `Cc1ccccc1` | Toluene ([CID 1140](https://pubchem.ncbi.nlm.nih.gov/compound/1140)) | exact |
| Cumene | C9H12 | 120.19 | `CC(C)c1ccccc1` | Cumene ([CID 7406](https://pubchem.ncbi.nlm.nih.gov/compound/7406)) | exact |
| Biphenyl | C12H10 | 154.21 | `c1ccc(cc1)-c1ccccc1` | Biphenyl ([CID 7095](https://pubchem.ncbi.nlm.nih.gov/compound/7095)) | exact |
| 2-Nitrotoluene | C7H7NO2 | 137.14 | `Cc1ccccc1[N+](=O)[O-]` | 2-Nitrotoluene ([CID 6944](https://pubchem.ncbi.nlm.nih.gov/compound/6944)) | exact |
| 4-Nitrotoluene | C7H7NO2 | 137.14 | `Cc1ccc(cc1)[N+](=O)[O-]` | 4-Nitrotoluene ([CID 7473](https://pubchem.ncbi.nlm.nih.gov/compound/7473)) | exact |
| Chloromethane | CH3Cl | 50.49 | `CCl` | Chloromethane ([CID 6327](https://pubchem.ncbi.nlm.nih.gov/compound/6327)) | exact |
| Bromomethane | CH3Br | 94.94 | `CBr` | Bromomethane ([CID 6323](https://pubchem.ncbi.nlm.nih.gov/compound/6323)) | exact |
| Iodomethane | CH3I | 141.94 | `CI` | Iodomethane ([CID 6328](https://pubchem.ncbi.nlm.nih.gov/compound/6328)) | exact |
| Fluoromethane | CH3F | 34.03 | `CF` | Fluoromethane ([CID 11638](https://pubchem.ncbi.nlm.nih.gov/compound/11638)) | exact |
| Dichloromethane | CH2Cl2 | 84.93 | `ClCCl` | Dichloromethane ([CID 6344](https://pubchem.ncbi.nlm.nih.gov/compound/6344)) | exact |
| Trichloromethane (chloroform) | CHCl3 | 119.38 | `ClC(Cl)Cl` | chloroform ([CID 6212](https://pubchem.ncbi.nlm.nih.gov/compound/6212)) | exact |
| Tetrachloromethane | CCl4 | 153.82 | `ClC(Cl)(Cl)Cl` | carbon tetrachloride ([CID 5943](https://pubchem.ncbi.nlm.nih.gov/compound/5943)) | exact |
| Triiodomethane (iodoform) | CHI3 | 393.73 | `IC(I)I` | iodoform ([CID 6374](https://pubchem.ncbi.nlm.nih.gov/compound/6374)) | exact |
| Chloroethane | C2H5Cl | 64.52 | `CCCl` | Chloroethane ([CID 6337](https://pubchem.ncbi.nlm.nih.gov/compound/6337)) | exact |
| Bromoethane | C2H5Br | 108.97 | `CCBr` | Bromoethane ([CID 6332](https://pubchem.ncbi.nlm.nih.gov/compound/6332)) | exact |
| Iodoethane | C2H5I | 155.97 | `CCI` | Iodoethane ([CID 6340](https://pubchem.ncbi.nlm.nih.gov/compound/6340)) | exact |
| 1-Bromopropane | C3H7Br | 122.99 | `CCCBr` | 1-Bromopropane ([CID 7840](https://pubchem.ncbi.nlm.nih.gov/compound/7840)) | exact |
| 2-Bromopropane | C3H7Br | 122.99 | `CC(C)Br` | 2-Bromopropane ([CID 6358](https://pubchem.ncbi.nlm.nih.gov/compound/6358)) | exact |
| 1-Chloropropane | C3H7Cl | 78.54 | `CCCCl` | 1-Chloropropane ([CID 10899](https://pubchem.ncbi.nlm.nih.gov/compound/10899)) | exact |
| 2-Chloropropane | C3H7Cl | 78.54 | `CC(C)Cl` | 2-Chloropropane ([CID 6361](https://pubchem.ncbi.nlm.nih.gov/compound/6361)) | exact |
| 2-Bromobutane | C4H9Br | 137.02 | `CCC(C)Br` | 2-Bromobutane ([CID 6554](https://pubchem.ncbi.nlm.nih.gov/compound/6554)) | exact |
| 2-Bromo-2-methylpropane | C4H9Br | 137.02 | `CC(C)(C)Br` | tert-butyl bromide ([CID 10485](https://pubchem.ncbi.nlm.nih.gov/compound/10485)) | exact |
| 2-Chloro-2-methylpropane | C4H9Cl | 92.57 | `CC(C)(C)Cl` | tert-butyl chloride ([CID 10486](https://pubchem.ncbi.nlm.nih.gov/compound/10486)) | exact |
| 2-Iodo-2-methylpropane | C4H9I | 184.02 | `CC(C)(C)I` | tert-butyl iodide ([CID 11206](https://pubchem.ncbi.nlm.nih.gov/compound/11206)) | exact |
| 1,2-Dibromoethane | C2H4Br2 | 187.86 | `BrCCBr` | 1,2-Dibromoethane ([CID 7839](https://pubchem.ncbi.nlm.nih.gov/compound/7839)) | exact |
| 1,2-Dichloroethane | C2H4Cl2 | 98.96 | `ClCCCl` | 1,2-Dichloroethane ([CID 11](https://pubchem.ncbi.nlm.nih.gov/compound/11)) | exact |
| 1,1-Dibromoethane | C2H4Br2 | 187.86 | `CC(Br)Br` | 1,1-Dibromoethane ([CID 11201](https://pubchem.ncbi.nlm.nih.gov/compound/11201)) | exact |
| 1,1,2,2-Tetrabromoethane | C2H2Br4 | 345.65 | `BrC(Br)C(Br)Br` | 1,1,2,2-Tetrabromoethane ([CID 6588](https://pubchem.ncbi.nlm.nih.gov/compound/6588)) | exact |
| 2,2-Dibromopropane | C3H6Br2 | 201.89 | `CC(C)(Br)Br` | 2,2-Dibromopropane ([CID 11658](https://pubchem.ncbi.nlm.nih.gov/compound/11658)) | exact |
| 2,2-Dichloropropane | C3H6Cl2 | 112.99 | `CC(C)(Cl)Cl` | 2,2-Dichloropropane ([CID 11660](https://pubchem.ncbi.nlm.nih.gov/compound/11660)) | exact |
| Dichlorodifluoromethane (Freon-12) | CCl2F2 | 120.91 | `FC(F)(Cl)Cl` | dichlorodifluoromethane ([CID 6391](https://pubchem.ncbi.nlm.nih.gov/compound/6391)) | exact |
| Carbonyl chloride (phosgene) | CCl2O | 98.92 | `ClC(Cl)=O` | phosgene ([CID 6371](https://pubchem.ncbi.nlm.nih.gov/compound/6371)) | exact |
| Trichloronitromethane (chloropicrin) | CCl3NO2 | 164.38 | `[O-][N+](=O)C(Cl)(Cl)Cl` | chloropicrin ([CID 6423](https://pubchem.ncbi.nlm.nih.gov/compound/6423)) | exact |
| Chlorobenzene | C6H5Cl | 112.56 | `Clc1ccccc1` | Chlorobenzene ([CID 7964](https://pubchem.ncbi.nlm.nih.gov/compound/7964)) | exact |
| Bromobenzene | C6H5Br | 157.01 | `Brc1ccccc1` | Bromobenzene ([CID 7961](https://pubchem.ncbi.nlm.nih.gov/compound/7961)) | exact |
| Iodobenzene | C6H5I | 204.01 | `Ic1ccccc1` | Iodobenzene ([CID 11575](https://pubchem.ncbi.nlm.nih.gov/compound/11575)) | exact |
| Benzal chloride | C7H6Cl2 | 161.03 | `ClC(Cl)c1ccccc1` | Benzal chloride ([CID 7411](https://pubchem.ncbi.nlm.nih.gov/compound/7411)) | exact |
| Hexachlorocyclohexane (BHC) | C6H6Cl6 | 290.83 | `ClC1C(Cl)C(Cl)C(Cl)C(Cl)C1Cl` | 1,2,3,4,5,6-hexachlorocyclohexane ([CID 727](https://pubchem.ncbi.nlm.nih.gov/compound/727)) | exact |
| DDT | C14H9Cl5 | 354.49 | `ClC(Cl)(Cl)C(c1ccc(Cl)cc1)c1ccc(Cl)cc1` | DDT ([CID 3036](https://pubchem.ncbi.nlm.nih.gov/compound/3036)) | exact |
| Trichloroethanal (chloral) | C2HCl3O | 147.39 | `O=CC(Cl)(Cl)Cl` | chloral ([CID 6407](https://pubchem.ncbi.nlm.nih.gov/compound/6407)) | exact |
| 1-Chloro-2-nitrobenzene | C6H4ClNO2 | 157.56 | `[O-][N+](=O)c1ccccc1Cl` | 1-Chloro-2-nitrobenzene ([CID 6945](https://pubchem.ncbi.nlm.nih.gov/compound/6945)) | exact |
| 1-Chloro-4-nitrobenzene | C6H4ClNO2 | 157.56 | `[O-][N+](=O)c1ccc(Cl)cc1` | 1-Chloro-4-nitrobenzene ([CID 7474](https://pubchem.ncbi.nlm.nih.gov/compound/7474)) | exact |
| 2-Chlorotoluene | C7H7Cl | 126.59 | `Cc1ccccc1Cl` | 2-Chlorotoluene ([CID 7238](https://pubchem.ncbi.nlm.nih.gov/compound/7238)) | exact |
| 4-Chlorotoluene | C7H7Cl | 126.59 | `Cc1ccc(Cl)cc1` | 4-Chlorotoluene ([CID 7810](https://pubchem.ncbi.nlm.nih.gov/compound/7810)) | exact |
| 4-Chlorobenzenesulfonic acid | C6H5ClO3S | 192.62 | `OS(=O)(=O)c1ccc(Cl)cc1` | 4-Chlorobenzenesulfonic acid ([CID 7400](https://pubchem.ncbi.nlm.nih.gov/compound/7400)) | exact |
| 4-Chloroacetophenone | C8H7ClO | 154.60 | `CC(=O)c1ccc(Cl)cc1` | 4'-chloroacetophenone ([CID 7467](https://pubchem.ncbi.nlm.nih.gov/compound/7467)) | exact |
| 1-Chloro-2,4-dinitrobenzene | C6H3ClN2O4 | 202.55 | `[O-][N+](=O)c1ccc(Cl)c(c1)[N+](=O)[O-]` | 1-Chloro-2,4-dinitrobenzene ([CID 6](https://pubchem.ncbi.nlm.nih.gov/compound/6)) | exact |
| 2,4-Dinitrophenol | C6H4N2O5 | 184.11 | `Oc1ccc(cc1[N+](=O)[O-])[N+](=O)[O-]` | 2,4-Dinitrophenol ([CID 1493](https://pubchem.ncbi.nlm.nih.gov/compound/1493)) | exact |
| Methanol | CH4O | 32.04 | `CO` | Methanol ([CID 887](https://pubchem.ncbi.nlm.nih.gov/compound/887)) | exact |
| Ethanol | C2H6O | 46.07 | `CCO` | Ethanol ([CID 702](https://pubchem.ncbi.nlm.nih.gov/compound/702)) | exact |
| Propan-1-ol | C3H8O | 60.10 | `CCCO` | 1-propanol ([CID 1031](https://pubchem.ncbi.nlm.nih.gov/compound/1031)) | exact |
| Propan-2-ol | C3H8O | 60.10 | `CC(C)O` | isopropyl alcohol ([CID 3776](https://pubchem.ncbi.nlm.nih.gov/compound/3776)) | exact |
| 2-Methylpropan-2-ol | C4H10O | 74.12 | `CC(C)(C)O` | tert-butanol ([CID 6386](https://pubchem.ncbi.nlm.nih.gov/compound/6386)) | exact |
| Ethane-1,2-diol (ethylene glycol) | C2H6O2 | 62.07 | `OCCO` | ethylene glycol ([CID 174](https://pubchem.ncbi.nlm.nih.gov/compound/174)) | exact |
| Propane-1,2,3-triol (glycerol) | C3H8O3 | 92.09 | `OCC(O)CO` | glycerol ([CID 753](https://pubchem.ncbi.nlm.nih.gov/compound/753)) | exact |
| Glyceryl trinitrate (nitroglycerine) | C3H5N3O9 | 227.08 | `[O-][N+](=O)OCC(O[N+]([O-])=O)CO[N+]([O-])=O` | nitroglycerin ([CID 4510](https://pubchem.ncbi.nlm.nih.gov/compound/4510)) | exact |
| 2-Chloroethanol | C2H5ClO | 80.51 | `OCCCl` | 2-Chloroethanol ([CID 34](https://pubchem.ncbi.nlm.nih.gov/compound/34)) | exact |
| Benzyl alcohol | C7H8O | 108.14 | `OCc1ccccc1` | Benzyl alcohol ([CID 244](https://pubchem.ncbi.nlm.nih.gov/compound/244)) | exact |
| Phenol | C6H6O | 94.11 | `Oc1ccccc1` | Phenol ([CID 996](https://pubchem.ncbi.nlm.nih.gov/compound/996)) | exact |
| Sodium phenoxide | C6H5NaO | 116.09 | `[Na+].[O-]c1ccccc1` | sodium phenolate ([CID 4445035](https://pubchem.ncbi.nlm.nih.gov/compound/4445035)) | exact |
| 2-Hydroxybenzoic acid (salicylic acid) | C7H6O3 | 138.12 | `OC(=O)c1ccccc1O` | salicylic acid ([CID 338](https://pubchem.ncbi.nlm.nih.gov/compound/338)) | exact |
| Sodium salicylate | C7H5NaO3 | 160.10 | `[Na+].[O-]C(=O)c1ccccc1O` | Sodium salicylate ([CID 16760658](https://pubchem.ncbi.nlm.nih.gov/compound/16760658)) | exact |
| 2-Hydroxybenzaldehyde (salicylaldehyde) | C7H6O2 | 122.12 | `O=Cc1ccccc1O` | salicylaldehyde ([CID 6998](https://pubchem.ncbi.nlm.nih.gov/compound/6998)) | exact |
| 2,4,6-Tribromophenol | C6H3Br3O | 330.80 | `Oc1c(Br)cc(Br)cc1Br` | 2,4,6-Tribromophenol ([CID 1483](https://pubchem.ncbi.nlm.nih.gov/compound/1483)) | exact |
| 2,4,6-Trinitrophenol (picric acid) | C6H3N3O7 | 229.10 | `Oc1c(cc(cc1[N+](=O)[O-])[N+](=O)[O-])[N+](=O)[O-]` | picric acid ([CID 6954](https://pubchem.ncbi.nlm.nih.gov/compound/6954)) | exact |
| 2-Bromophenol | C6H5BrO | 173.01 | `Oc1ccccc1Br` | 2-Bromophenol ([CID 7244](https://pubchem.ncbi.nlm.nih.gov/compound/7244)) | exact |
| 4-Bromophenol | C6H5BrO | 173.01 | `Oc1ccc(Br)cc1` | 4-Bromophenol ([CID 7808](https://pubchem.ncbi.nlm.nih.gov/compound/7808)) | exact |
| 2-Nitrophenol | C6H5NO3 | 139.11 | `Oc1ccccc1[N+](=O)[O-]` | 2-Nitrophenol ([CID 6947](https://pubchem.ncbi.nlm.nih.gov/compound/6947)) | exact |
| 4-Nitrophenol | C6H5NO3 | 139.11 | `Oc1ccc(cc1)[N+](=O)[O-]` | 4-Nitrophenol ([CID 980](https://pubchem.ncbi.nlm.nih.gov/compound/980)) | exact |
| Phenyl acetate | C8H8O2 | 136.15 | `CC(=O)Oc1ccccc1` | Phenyl acetate ([CID 31229](https://pubchem.ncbi.nlm.nih.gov/compound/31229)) | exact |
| Benzene-1,4-dione (p-benzoquinone) | C6H4O2 | 108.10 | `O=C1C=CC(=O)C=C1` | p-benzoquinone ([CID 4650](https://pubchem.ncbi.nlm.nih.gov/compound/4650)) | exact |
| 4-Hydroxyazobenzene | C12H10N2O | 198.23 | `Oc1ccc(cc1)N=Nc1ccccc1` | 4-phenylazophenol ([CID 15529](https://pubchem.ncbi.nlm.nih.gov/compound/15529)) | exact |
| Cumene hydroperoxide | C9H12O2 | 152.19 | `CC(C)(OO)c1ccccc1` | Cumene hydroperoxide ([CID 6629](https://pubchem.ncbi.nlm.nih.gov/compound/6629)) | exact |
| Benzenesulfonic acid | C6H6O3S | 158.18 | `OS(=O)(=O)c1ccccc1` | Benzenesulfonic acid ([CID 7371](https://pubchem.ncbi.nlm.nih.gov/compound/7371)) | exact |
| Sodium benzenesulfonate | C6H5NaO3S | 180.16 | `[Na+].[O-]S(=O)(=O)c1ccccc1` | Sodium benzenesulfonate ([CID 517327](https://pubchem.ncbi.nlm.nih.gov/compound/517327)) | exact |
| Methoxymethane (dimethyl ether) | C2H6O | 46.07 | `COC` | dimethyl ether ([CID 8254](https://pubchem.ncbi.nlm.nih.gov/compound/8254)) | exact |
| Ethoxyethane (diethyl ether) | C4H10O | 74.12 | `CCOCC` | diethyl ether ([CID 3283](https://pubchem.ncbi.nlm.nih.gov/compound/3283)) | exact |
| 1-Methoxypropane | C4H10O | 74.12 | `CCCOC` | methyl propyl ether ([CID 11182](https://pubchem.ncbi.nlm.nih.gov/compound/11182)) | exact |
| Methoxybenzene (anisole) | C7H8O | 108.14 | `COc1ccccc1` | anisole ([CID 7519](https://pubchem.ncbi.nlm.nih.gov/compound/7519)) | exact |
| 2-Methoxy-2-methylpropane | C5H12O | 88.15 | `COC(C)(C)C` | methyl tert-butyl ether ([CID 15413](https://pubchem.ncbi.nlm.nih.gov/compound/15413)) | exact |
| Oxirane (ethylene oxide) | C2H4O | 44.05 | `C1CO1` | ethylene oxide ([CID 6354](https://pubchem.ncbi.nlm.nih.gov/compound/6354)) | exact |
| Sodium ethoxide | C2H5NaO | 68.05 | `[Na+].CC[O-]` | Sodium ethoxide ([CID 2723922](https://pubchem.ncbi.nlm.nih.gov/compound/2723922)) | exact |
| Sodium methoxide | CH3NaO | 54.02 | `[Na+].C[O-]` | Sodium methoxide ([CID 10942334](https://pubchem.ncbi.nlm.nih.gov/compound/10942334)) | exact |
| Sodium tert-butoxide | C4H9NaO | 96.10 | `[Na+].CC(C)(C)[O-]` | sodium 2-methylpropan-2-olate ([CID 23676156](https://pubchem.ncbi.nlm.nih.gov/compound/23676156)) | exact |
| Diethyl carbonate | C5H10O3 | 118.13 | `CCOC(=O)OCC` | Diethyl carbonate ([CID 7766](https://pubchem.ncbi.nlm.nih.gov/compound/7766)) | exact |
| 2-Methylanisole | C8H10O | 122.17 | `COc1ccccc1C` | 2-Methylanisole ([CID 33637](https://pubchem.ncbi.nlm.nih.gov/compound/33637)) | exact |
| 4-Methylanisole | C8H10O | 122.17 | `COc1ccc(C)cc1` | 4-Methylanisole ([CID 7731](https://pubchem.ncbi.nlm.nih.gov/compound/7731)) | exact |
| 2-Bromoanisole | C7H7BrO | 187.04 | `COc1ccccc1Br` | 2-Bromoanisole ([CID 11358](https://pubchem.ncbi.nlm.nih.gov/compound/11358)) | exact |
| 4-Bromoanisole | C7H7BrO | 187.04 | `COc1ccc(Br)cc1` | 4-Bromoanisole ([CID 7730](https://pubchem.ncbi.nlm.nih.gov/compound/7730)) | exact |
| 2-Nitroanisole | C7H7NO3 | 153.14 | `COc1ccccc1[N+](=O)[O-]` | 2-Nitroanisole ([CID 7048](https://pubchem.ncbi.nlm.nih.gov/compound/7048)) | exact |
| 4-Nitroanisole | C7H7NO3 | 153.14 | `COc1ccc(cc1)[N+](=O)[O-]` | 4-Nitroanisole ([CID 7485](https://pubchem.ncbi.nlm.nih.gov/compound/7485)) | exact |
| 4-Methoxyacetophenone | C9H10O2 | 150.18 | `COc1ccc(cc1)C(C)=O` | 4'-methoxyacetophenone ([CID 7476](https://pubchem.ncbi.nlm.nih.gov/compound/7476)) | exact |
| Methanal (formaldehyde) | CH2O | 30.03 | `C=O` | formaldehyde ([CID 712](https://pubchem.ncbi.nlm.nih.gov/compound/712)) | exact |
| Ethanal (acetaldehyde) | C2H4O | 44.05 | `CC=O` | acetaldehyde ([CID 177](https://pubchem.ncbi.nlm.nih.gov/compound/177)) | exact |
| Propanal | C3H6O | 58.08 | `CCC=O` | Propanal ([CID 527](https://pubchem.ncbi.nlm.nih.gov/compound/527)) | exact |
| Propanone (acetone) | C3H6O | 58.08 | `CC(C)=O` | acetone ([CID 180](https://pubchem.ncbi.nlm.nih.gov/compound/180)) | exact |
| Benzaldehyde | C7H6O | 106.12 | `O=Cc1ccccc1` | Benzaldehyde ([CID 240](https://pubchem.ncbi.nlm.nih.gov/compound/240)) | exact |
| Acetophenone | C8H8O | 120.15 | `CC(=O)c1ccccc1` | Acetophenone ([CID 7410](https://pubchem.ncbi.nlm.nih.gov/compound/7410)) | exact |
| 3-Hydroxybutanal (aldol) | C4H8O2 | 88.11 | `CC(O)CC=O` | 3-hydroxybutanal ([CID 7897](https://pubchem.ncbi.nlm.nih.gov/compound/7897)) | exact |
| But-2-enal (crotonaldehyde) | C4H6O | 70.09 | `C/C=C/C=O` | crotonaldehyde ([CID 447466](https://pubchem.ncbi.nlm.nih.gov/compound/447466)) | exact |
| 4-Hydroxy-4-methylpentan-2-one | C6H12O2 | 116.16 | `CC(=O)CC(C)(C)O` | diacetone alcohol ([CID 31256](https://pubchem.ncbi.nlm.nih.gov/compound/31256)) | exact |
| 4-Methylpent-3-en-2-one (mesityl oxide) | C6H10O | 98.14 | `CC(=O)C=C(C)C` | mesityl oxide ([CID 8858](https://pubchem.ncbi.nlm.nih.gov/compound/8858)) | exact |
| 4-Phenylbut-3-en-2-one | C10H10O | 146.19 | `CC(=O)/C=C/c1ccccc1` | benzalacetone ([CID 637759](https://pubchem.ncbi.nlm.nih.gov/compound/637759)) | exact |
| Benzoin | C14H12O2 | 212.25 | `OC(C(=O)c1ccccc1)c1ccccc1` | Benzoin ([CID 8400](https://pubchem.ncbi.nlm.nih.gov/compound/8400)) | exact |
| 1-Chloropropan-2-one | C3H5ClO | 92.53 | `CC(=O)CCl` | chloroacetone ([CID 6571](https://pubchem.ncbi.nlm.nih.gov/compound/6571)) | exact |
| 1,1,1-Trichloropropan-2-one | C3H3Cl3O | 161.42 | `CC(=O)C(Cl)(Cl)Cl` | 1,1,1-trichloroacetone ([CID 13514](https://pubchem.ncbi.nlm.nih.gov/compound/13514)) | exact |
| Acetone cyanohydrin | C4H7NO | 85.11 | `CC(C)(O)C#N` | Acetone cyanohydrin ([CID 6406](https://pubchem.ncbi.nlm.nih.gov/compound/6406)) | exact |
| Benzaldehyde cyanohydrin | C8H7NO | 133.15 | `OC(C#N)c1ccccc1` | mandelonitrile ([CID 10758](https://pubchem.ncbi.nlm.nih.gov/compound/10758)) | exact |
| 3-Nitrobenzaldehyde | C7H5NO3 | 151.12 | `O=Cc1cccc(c1)[N+](=O)[O-]` | 3-Nitrobenzaldehyde ([CID 7449](https://pubchem.ncbi.nlm.nih.gov/compound/7449)) | exact |
| 3-Chlorobenzaldehyde | C7H5ClO | 140.57 | `O=Cc1cccc(Cl)c1` | 3-Chlorobenzaldehyde ([CID 11477](https://pubchem.ncbi.nlm.nih.gov/compound/11477)) | exact |
| 3-Formylbenzenesulfonic acid | C7H6O4S | 186.19 | `OS(=O)(=O)c1cccc(C=O)c1` | 3-Formylbenzenesulfonic acid ([CID 104693](https://pubchem.ncbi.nlm.nih.gov/compound/104693)) | exact |
| Benzaldehyde oxime | C7H7NO | 121.14 | `ON=Cc1ccccc1` | Benzaldehyde oxime ([CID 5324611](https://pubchem.ncbi.nlm.nih.gov/compound/5324611)) | same skeleton |
| Benzaldehyde phenylhydrazone | C13H12N2 | 196.25 | `C(=NNc1ccccc1)c1ccccc1` | Benzaldehyde phenylhydrazone ([CID 6436752](https://pubchem.ncbi.nlm.nih.gov/compound/6436752)) | same skeleton |
| Ethanedial (glyoxal) | C2H2O2 | 58.04 | `O=CC=O` | glyoxal ([CID 7860](https://pubchem.ncbi.nlm.nih.gov/compound/7860)) | exact |
| Methanoic acid (formic acid) | CH2O2 | 46.02 | `OC=O` | formic acid ([CID 284](https://pubchem.ncbi.nlm.nih.gov/compound/284)) | exact |
| Ethanoic acid (acetic acid) | C2H4O2 | 60.05 | `CC(O)=O` | acetic acid ([CID 176](https://pubchem.ncbi.nlm.nih.gov/compound/176)) | exact |
| Propanoic acid | C3H6O2 | 74.08 | `CCC(O)=O` | Propanoic acid ([CID 1032](https://pubchem.ncbi.nlm.nih.gov/compound/1032)) | exact |
| Ethanedioic acid (oxalic acid) | C2H2O4 | 90.03 | `OC(=O)C(O)=O` | oxalic acid ([CID 971](https://pubchem.ncbi.nlm.nih.gov/compound/971)) | exact |
| Propanedioic acid (malonic acid) | C3H4O4 | 104.06 | `OC(=O)CC(O)=O` | malonic acid ([CID 867](https://pubchem.ncbi.nlm.nih.gov/compound/867)) | exact |
| Butanedioic acid (succinic acid) | C4H6O4 | 118.09 | `OC(=O)CCC(O)=O` | succinic acid ([CID 1110](https://pubchem.ncbi.nlm.nih.gov/compound/1110)) | exact |
| Hexanedioic acid (adipic acid) | C6H10O4 | 146.14 | `OC(=O)CCCCC(O)=O` | adipic acid ([CID 196](https://pubchem.ncbi.nlm.nih.gov/compound/196)) | exact |
| 2-Hydroxypropanoic acid (lactic acid) | C3H6O3 | 90.08 | `CC(O)C(O)=O` | lactic acid ([CID 612](https://pubchem.ncbi.nlm.nih.gov/compound/612)) | exact |
| 2,3-Dihydroxybutanedioic acid (tartaric acid) | C4H6O6 | 150.09 | `OC(C(O)C(O)=O)C(O)=O` | tartaric acid ([CID 444305](https://pubchem.ncbi.nlm.nih.gov/compound/444305)) | same skeleton |
| Benzoic acid | C7H6O2 | 122.12 | `OC(=O)c1ccccc1` | Benzoic acid ([CID 243](https://pubchem.ncbi.nlm.nih.gov/compound/243)) | exact |
| Benzene-1,2-dicarboxylic acid (phthalic acid) | C8H6O4 | 166.13 | `OC(=O)c1ccccc1C(O)=O` | phthalic acid ([CID 1017](https://pubchem.ncbi.nlm.nih.gov/compound/1017)) | exact |
| Phthalic anhydride | C8H4O3 | 148.12 | `O=C1OC(=O)c2ccccc12` | Phthalic anhydride ([CID 6811](https://pubchem.ncbi.nlm.nih.gov/compound/6811)) | exact |
| Chloroethanoic acid | C2H3ClO2 | 94.50 | `OC(=O)CCl` | chloroacetic acid ([CID 300](https://pubchem.ncbi.nlm.nih.gov/compound/300)) | exact |
| Dichloroethanoic acid | C2H2Cl2O2 | 128.94 | `OC(=O)C(Cl)Cl` | dichloroacetic acid ([CID 6597](https://pubchem.ncbi.nlm.nih.gov/compound/6597)) | exact |
| Trichloroethanoic acid | C2HCl3O2 | 163.39 | `OC(=O)C(Cl)(Cl)Cl` | trichloroacetic acid ([CID 6421](https://pubchem.ncbi.nlm.nih.gov/compound/6421)) | exact |
| Fluoroethanoic acid | C2H3FO2 | 78.04 | `OC(=O)CF` | fluoroacetic acid ([CID 5237](https://pubchem.ncbi.nlm.nih.gov/compound/5237)) | exact |
| Bromoethanoic acid | C2H3BrO2 | 138.95 | `OC(=O)CBr` | bromoacetic acid ([CID 6227](https://pubchem.ncbi.nlm.nih.gov/compound/6227)) | exact |
| Iodoethanoic acid | C2H3IO2 | 185.95 | `OC(=O)CI` | iodoacetic acid ([CID 5240](https://pubchem.ncbi.nlm.nih.gov/compound/5240)) | exact |
| 3-Phenylprop-2-enoic acid (cinnamic acid) | C9H8O2 | 148.16 | `OC(=O)/C=C/c1ccccc1` | cinnamic acid ([CID 444539](https://pubchem.ncbi.nlm.nih.gov/compound/444539)) | exact |
| Sodium methanoate | CHNaO2 | 68.01 | `[Na+].[O-]C=O` | sodium formate ([CID 2723810](https://pubchem.ncbi.nlm.nih.gov/compound/2723810)) | exact |
| Sodium ethanoate | C2H3NaO2 | 82.03 | `[Na+].CC([O-])=O` | sodium acetate ([CID 31372](https://pubchem.ncbi.nlm.nih.gov/compound/31372)) | exact |
| Sodium benzoate | C7H5NaO2 | 144.10 | `[Na+].[O-]C(=O)c1ccccc1` | Sodium benzoate ([CID 517055](https://pubchem.ncbi.nlm.nih.gov/compound/517055)) | exact |
| Ammonium ethanoate | C2H7NO2 | 77.08 | `[NH4+].CC([O-])=O` | ammonium acetate ([CID 517165](https://pubchem.ncbi.nlm.nih.gov/compound/517165)) | exact |
| Ammonium benzoate | C7H9NO2 | 139.15 | `[NH4+].[O-]C(=O)c1ccccc1` | Ammonium benzoate ([CID 15830](https://pubchem.ncbi.nlm.nih.gov/compound/15830)) | exact |
| Ethanoyl chloride (acetyl chloride) | C2H3ClO | 78.50 | `CC(Cl)=O` | acetyl chloride ([CID 6367](https://pubchem.ncbi.nlm.nih.gov/compound/6367)) | exact |
| Benzoyl chloride | C7H5ClO | 140.57 | `ClC(=O)c1ccccc1` | Benzoyl chloride ([CID 7412](https://pubchem.ncbi.nlm.nih.gov/compound/7412)) | exact |
| Ethanoic anhydride (acetic anhydride) | C4H6O3 | 102.09 | `CC(=O)OC(C)=O` | acetic anhydride ([CID 7918](https://pubchem.ncbi.nlm.nih.gov/compound/7918)) | exact |
| Ethyl ethanoate (ethyl acetate) | C4H8O2 | 88.11 | `CCOC(C)=O` | ethyl acetate ([CID 8857](https://pubchem.ncbi.nlm.nih.gov/compound/8857)) | exact |
| Ethanamide (acetamide) | C2H5NO | 59.07 | `CC(N)=O` | acetamide ([CID 178](https://pubchem.ncbi.nlm.nih.gov/compound/178)) | exact |
| Benzamide | C7H7NO | 121.14 | `NC(=O)c1ccccc1` | Benzamide ([CID 2331](https://pubchem.ncbi.nlm.nih.gov/compound/2331)) | exact |
| 3-Nitrobenzoic acid | C7H5NO4 | 167.12 | `OC(=O)c1cccc(c1)[N+](=O)[O-]` | 3-Nitrobenzoic acid ([CID 8497](https://pubchem.ncbi.nlm.nih.gov/compound/8497)) | exact |
| 3-Sulfobenzoic acid | C7H6O5S | 202.19 | `OC(=O)c1cccc(c1)S(O)(=O)=O` | 3-Sulfobenzoic acid ([CID 8477](https://pubchem.ncbi.nlm.nih.gov/compound/8477)) | exact |
| 3-Bromobenzoic acid | C7H5BrO2 | 201.02 | `OC(=O)c1cccc(Br)c1` | 3-Bromobenzoic acid ([CID 11456](https://pubchem.ncbi.nlm.nih.gov/compound/11456)) | exact |
| 4-Nitrobenzoic acid | C7H5NO4 | 167.12 | `OC(=O)c1ccc(cc1)[N+](=O)[O-]` | 4-Nitrobenzoic acid ([CID 6108](https://pubchem.ncbi.nlm.nih.gov/compound/6108)) | exact |
| 4-Methylbenzoic acid | C8H8O2 | 136.15 | `Cc1ccc(cc1)C(O)=O` | p-toluic acid ([CID 7470](https://pubchem.ncbi.nlm.nih.gov/compound/7470)) | exact |
| Methanamine (methylamine) | CH5N | 31.06 | `CN` | methylamine ([CID 6329](https://pubchem.ncbi.nlm.nih.gov/compound/6329)) | exact |
| Ethanamine (ethylamine) | C2H7N | 45.08 | `CCN` | ethylamine ([CID 6341](https://pubchem.ncbi.nlm.nih.gov/compound/6341)) | exact |
| Aniline | C6H7N | 93.13 | `Nc1ccccc1` | Aniline ([CID 6115](https://pubchem.ncbi.nlm.nih.gov/compound/6115)) | exact |
| N,N-Dimethylaniline | C8H11N | 121.18 | `CN(C)c1ccccc1` | N,N-Dimethylaniline ([CID 949](https://pubchem.ncbi.nlm.nih.gov/compound/949)) | exact |
| N-Phenylethanamide (acetanilide) | C8H9NO | 135.17 | `CC(=O)Nc1ccccc1` | acetanilide ([CID 904](https://pubchem.ncbi.nlm.nih.gov/compound/904)) | exact |
| Benzanilide | C13H11NO | 197.24 | `O=C(Nc1ccccc1)c1ccccc1` | Benzanilide ([CID 7168](https://pubchem.ncbi.nlm.nih.gov/compound/7168)) | exact |
| Nitrobenzene | C6H5NO2 | 123.11 | `[O-][N+](=O)c1ccccc1` | Nitrobenzene ([CID 7416](https://pubchem.ncbi.nlm.nih.gov/compound/7416)) | exact |
| 1,3-Dinitrobenzene | C6H4N2O4 | 168.11 | `[O-][N+](=O)c1cccc(c1)[N+](=O)[O-]` | 1,3-Dinitrobenzene ([CID 7452](https://pubchem.ncbi.nlm.nih.gov/compound/7452)) | exact |
| Nitromethane | CH3NO2 | 61.04 | `C[N+]([O-])=O` | Nitromethane ([CID 6375](https://pubchem.ncbi.nlm.nih.gov/compound/6375)) | exact |
| Nitroethane | C2H5NO2 | 75.07 | `CC[N+]([O-])=O` | Nitroethane ([CID 6587](https://pubchem.ncbi.nlm.nih.gov/compound/6587)) | exact |
| Ethyl nitrite | C2H5NO2 | 75.07 | `CCON=O` | Ethyl nitrite ([CID 8026](https://pubchem.ncbi.nlm.nih.gov/compound/8026)) | exact |
| Ethanenitrile (acetonitrile) | C2H3N | 41.05 | `CC#N` | acetonitrile ([CID 6342](https://pubchem.ncbi.nlm.nih.gov/compound/6342)) | exact |
| Propanenitrile | C3H5N | 55.08 | `CCC#N` | Propanenitrile ([CID 7854](https://pubchem.ncbi.nlm.nih.gov/compound/7854)) | exact |
| Benzonitrile | C7H5N | 103.12 | `N#Cc1ccccc1` | Benzonitrile ([CID 7505](https://pubchem.ncbi.nlm.nih.gov/compound/7505)) | exact |
| Methyl isocyanide | C2H3N | 41.05 | `C[N+]#[C-]` | Methyl isocyanide ([CID 11646](https://pubchem.ncbi.nlm.nih.gov/compound/11646)) | exact |
| Ethyl isocyanide | C3H5N | 55.08 | `CC[N+]#[C-]` | isocyanoethane ([CID 12226](https://pubchem.ncbi.nlm.nih.gov/compound/12226)) | exact |
| Phenyl isocyanide | C7H5N | 103.12 | `[C-]#[N+]c1ccccc1` | Phenyl isocyanide ([CID 13606](https://pubchem.ncbi.nlm.nih.gov/compound/13606)) | exact |
| Benzenediazonium chloride | C6H5ClN2 | 140.57 | `[Cl-].N#[N+]c1ccccc1` | Benzenediazonium chloride ([CID 60992](https://pubchem.ncbi.nlm.nih.gov/compound/60992)) | exact |
| 2,4,6-Tribromoaniline | C6H4Br3N | 329.82 | `Nc1c(Br)cc(Br)cc1Br` | 2,4,6-Tribromoaniline ([CID 8986](https://pubchem.ncbi.nlm.nih.gov/compound/8986)) | exact |
| 4'-Bromoacetanilide | C8H8BrNO | 214.06 | `CC(=O)Nc1ccc(Br)cc1` | 4'-bromoacetanilide ([CID 7683](https://pubchem.ncbi.nlm.nih.gov/compound/7683)) | exact |
| 4-Bromoaniline | C6H6BrN | 172.03 | `Nc1ccc(Br)cc1` | 4-Bromoaniline ([CID 7807](https://pubchem.ncbi.nlm.nih.gov/compound/7807)) | exact |
| 4'-Nitroacetanilide | C8H8N2O3 | 180.16 | `CC(=O)Nc1ccc(cc1)[N+](=O)[O-]` | 4'-nitroacetanilide ([CID 7691](https://pubchem.ncbi.nlm.nih.gov/compound/7691)) | exact |
| 4-Nitroaniline | C6H6N2O2 | 138.13 | `Nc1ccc(cc1)[N+](=O)[O-]` | 4-Nitroaniline ([CID 7475](https://pubchem.ncbi.nlm.nih.gov/compound/7475)) | exact |
| 4-Aminobenzenesulfonic acid (sulfanilic acid) | C6H7NO3S | 173.19 | `Nc1ccc(cc1)S(O)(=O)=O` | sulfanilic acid ([CID 8479](https://pubchem.ncbi.nlm.nih.gov/compound/8479)) | exact |
| N,N-Dimethyl-4-nitrosoaniline | C8H10N2O | 150.18 | `CN(C)c1ccc(cc1)N=O` | N,N-Dimethyl-4-nitrosoaniline ([CID 8749](https://pubchem.ncbi.nlm.nih.gov/compound/8749)) | exact |
| 4-Aminoazobenzene | C12H11N3 | 197.24 | `Nc1ccc(cc1)N=Nc1ccccc1` | 4-Aminoazobenzene ([CID 6051](https://pubchem.ncbi.nlm.nih.gov/compound/6051)) | exact |
| Phenylhydrazine | C6H8N2 | 108.14 | `NNc1ccccc1` | Phenylhydrazine ([CID 7516](https://pubchem.ncbi.nlm.nih.gov/compound/7516)) | exact |
| Urea | CH4N2O | 60.06 | `NC(N)=O` | Urea ([CID 1176](https://pubchem.ncbi.nlm.nih.gov/compound/1176)) | exact |
| Semicarbazide | CH5N3O | 75.07 | `NNC(N)=O` | Semicarbazide ([CID 5196](https://pubchem.ncbi.nlm.nih.gov/compound/5196)) | exact |
| 2,4-Dinitrophenylhydrazine | C6H6N4O4 | 198.14 | `NNc1ccc(cc1[N+](=O)[O-])[N+](=O)[O-]` | 2,4-Dinitrophenylhydrazine ([CID 3772977](https://pubchem.ncbi.nlm.nih.gov/compound/3772977)) | exact |
| Phenylmagnesium bromide | C6H5BrMg | 181.32 | `Br[Mg]c1ccccc1` | Phenylmagnesium bromide ([CID 66852](https://pubchem.ncbi.nlm.nih.gov/compound/66852)) | drawn covalent |
| Ethylmagnesium bromide | C2H5BrMg | 133.27 | `CC[Mg]Br` | Ethylmagnesium bromide ([CID 101914](https://pubchem.ncbi.nlm.nih.gov/compound/101914)) | drawn covalent |
| Methylmagnesium bromide | CH3BrMg | 119.24 | `C[Mg]Br` | Methylmagnesium bromide ([CID 6349](https://pubchem.ncbi.nlm.nih.gov/compound/6349)) | drawn covalent |
| Potassium succinate | C4H4K2O4 | 194.27 | `[K+].[K+].[O-]C(=O)CCC([O-])=O` | dipotassium succinate ([CID 164717](https://pubchem.ncbi.nlm.nih.gov/compound/164717)) | exact |
| Potassium maleate | C4H2K2O4 | 192.25 | `[K+].[K+].[O-]C(=O)/C=C\C([O-])=O` | potassium maleate ([CID 6916256](https://pubchem.ncbi.nlm.nih.gov/compound/6916256)) | exact |
| Calcium ethanoate | C4H6CaO4 | 158.17 | `[Ca+2].CC([O-])=O.CC([O-])=O` | calcium acetate ([CID 6116](https://pubchem.ncbi.nlm.nih.gov/compound/6116)) | exact |
| Calcium methanoate | C2H2CaO4 | 130.11 | `[Ca+2].[O-]C=O.[O-]C=O` | calcium formate ([CID 10997](https://pubchem.ncbi.nlm.nih.gov/compound/10997)) | exact |
| Benzenesulfonyl chloride | C6H5ClO2S | 176.62 | `ClS(=O)(=O)c1ccccc1` | Benzenesulfonyl chloride ([CID 7369](https://pubchem.ncbi.nlm.nih.gov/compound/7369)) | exact |
| Ethyl hydrogen sulfate | C2H6O4S | 126.13 | `CCOS(O)(=O)=O` | Ethyl hydrogen sulfate ([CID 6004](https://pubchem.ncbi.nlm.nih.gov/compound/6004)) | exact |
| Silver benzoate | C7H5AgO2 | 228.98 | `[Ag+].[O-]C(=O)c1ccccc1` | Silver benzoate ([CID 164649](https://pubchem.ncbi.nlm.nih.gov/compound/164649)) | exact |
| Silver ethanoate | C2H3AgO2 | 166.91 | `[Ag+].CC([O-])=O` | silver acetate ([CID 11246](https://pubchem.ncbi.nlm.nih.gov/compound/11246)) | exact |
| Sodium ethynide (sodium acetylide) | C2HNa | 48.02 | `[Na+].C#[C-]` | sodium acetylide ([CID 2733336](https://pubchem.ncbi.nlm.nih.gov/compound/2733336)) | exact |
| Maleic anhydride | C4H2O3 | 98.06 | `O=C1C=CC(=O)O1` | Maleic anhydride ([CID 7923](https://pubchem.ncbi.nlm.nih.gov/compound/7923)) | exact |
| 1-Chloroethyl ethyl ether | C4H9ClO | 108.57 | `CCOC(C)Cl` | 1-chloro-1-ethoxyethane ([CID 23478](https://pubchem.ncbi.nlm.nih.gov/compound/23478)) | exact |
| Benzylidene diacetate | C11H12O4 | 208.21 | `CC(=O)OC(OC(C)=O)c1ccccc1` | Benzylidene diacetate ([CID 68489](https://pubchem.ncbi.nlm.nih.gov/compound/68489)) | exact |
| Prop-1-en-2-ol (enol of propanone) | C3H6O | 58.08 | `CC(O)=C` | prop-1-en-2-ol ([CID 141483](https://pubchem.ncbi.nlm.nih.gov/compound/141483)) | exact |
| N-Methylaniline | C7H9N | 107.16 | `CNc1ccccc1` | N-Methylaniline ([CID 7515](https://pubchem.ncbi.nlm.nih.gov/compound/7515)) | exact |
| Anilinium chloride | C6H8ClN | 129.59 | `[Cl-].[NH3+]c1ccccc1` | aniline hydrochloride ([CID 8870](https://pubchem.ncbi.nlm.nih.gov/compound/8870)) | exact |
| Fluorobenzene | C6H5F | 96.10 | `Fc1ccccc1` | Fluorobenzene ([CID 10008](https://pubchem.ncbi.nlm.nih.gov/compound/10008)) | exact |
| Phthalimide | C8H5NO2 | 147.13 | `O=C1NC(=O)c2ccccc12` | Phthalimide ([CID 6809](https://pubchem.ncbi.nlm.nih.gov/compound/6809)) | exact |
| Potassium phthalimide | C8H4KNO2 | 185.22 | `[K+].O=C1[N-]C(=O)c2ccccc12` | Potassium phthalimide ([CID 3356745](https://pubchem.ncbi.nlm.nih.gov/compound/3356745)) | exact |
| N-Ethylphthalimide | C10H9NO2 | 175.19 | `CCN1C(=O)c2ccccc2C1=O` | N-Ethylphthalimide ([CID 21120](https://pubchem.ncbi.nlm.nih.gov/compound/21120)) | exact |
| N-Ethylethanamine (diethylamine) | C4H11N | 73.14 | `CCNCC` | diethylamine ([CID 8021](https://pubchem.ncbi.nlm.nih.gov/compound/8021)) | exact |
| Triethylamine | C6H15N | 101.19 | `CCN(CC)CC` | Triethylamine ([CID 8471](https://pubchem.ncbi.nlm.nih.gov/compound/8471)) | exact |
| N-Ethylethanamide | C4H9NO | 87.12 | `CCNC(C)=O` | N-ethylacetamide ([CID 12253](https://pubchem.ncbi.nlm.nih.gov/compound/12253)) | exact |
| N-Ethylbenzenesulfonamide | C8H11NO2S | 185.25 | `CCNS(=O)(=O)c1ccccc1` | N-Ethylbenzenesulfonamide ([CID 79279](https://pubchem.ncbi.nlm.nih.gov/compound/79279)) | exact |
| N,N-Diethylbenzenesulfonamide | C10H15NO2S | 213.30 | `CCN(CC)S(=O)(=O)c1ccccc1` | N,N-Diethylbenzenesulfonamide ([CID 74367](https://pubchem.ncbi.nlm.nih.gov/compound/74367)) | exact |
| D-Glucose (open chain) | C6H12O6 | 180.16 | `O=C[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO` | aldehydo-D-glucose ([CID 107526](https://pubchem.ncbi.nlm.nih.gov/compound/107526)) | exact |
| α-D-Glucopyranose | C6H12O6 | 180.16 | `OC[C@H]1O[C@H](O)[C@H](O)[C@@H](O)[C@@H]1O` | alpha-D-glucopyranose ([CID 79025](https://pubchem.ncbi.nlm.nih.gov/compound/79025)) | exact |
| β-D-Glucopyranose | C6H12O6 | 180.16 | `OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O` | beta-D-glucopyranose ([CID 64689](https://pubchem.ncbi.nlm.nih.gov/compound/64689)) | exact |
| D-Fructose (open chain) | C6H12O6 | 180.16 | `OC[C@@H](O)[C@@H](O)[C@H](O)C(=O)CO` | keto-D-fructose ([CID 5984](https://pubchem.ncbi.nlm.nih.gov/compound/5984)) | exact |
| β-D-Fructofuranose | C6H12O6 | 180.16 | `C([C@@H]1[C@H]([C@@H]([C@](O1)(CO)O)O)O)O` | beta-D-fructofuranose ([CID 439709](https://pubchem.ncbi.nlm.nih.gov/compound/439709)) | exact |
| Sucrose | C12H22O11 | 342.30 | `OC[C@H]1O[C@@](CO)(O[C@H]2O[C@H](CO)[C@@H](O)[C@H](O)[C@H]2O)[C@@H](O)[C@@H]1O` | Sucrose ([CID 5988](https://pubchem.ncbi.nlm.nih.gov/compound/5988)) | exact |
| Maltose | C12H22O11 | 342.30 | `OC[C@H]1O[C@H](O[C@@H]2[C@@H](CO)OC(O)[C@H](O)[C@H]2O)[C@H](O)[C@@H](O)[C@@H]1O` | Maltose ([CID 439186](https://pubchem.ncbi.nlm.nih.gov/compound/439186)) | exact |
| Lactose | C12H22O11 | 342.30 | `C([C@@H]1[C@@H]([C@@H]([C@H]([C@@H](O1)O[C@@H]2[C@H](O[C@H]([C@@H]([C@H]2O)O)O)CO)O)O)O)O` | beta-lactose ([CID 6134](https://pubchem.ncbi.nlm.nih.gov/compound/6134)) | exact |
| D-Gluconic acid | C6H12O7 | 196.16 | `OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C(O)=O` | D-Gluconic acid ([CID 10690](https://pubchem.ncbi.nlm.nih.gov/compound/10690)) | exact |
| D-Glucaric acid (saccharic acid) | C6H10O8 | 210.14 | `[C@H]([C@@H]([C@@H](C(=O)O)O)O)([C@H](C(=O)O)O)O` | D-glucaric acid ([CID 33037](https://pubchem.ncbi.nlm.nih.gov/compound/33037)) | exact |
| Sorbitol (hexane-1,2,3,4,5,6-hexol) | C6H14O6 | 182.17 | `OC[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO` | sorbitol ([CID 5780](https://pubchem.ncbi.nlm.nih.gov/compound/5780)) | exact |
| D-Ribose | C5H10O5 | 150.13 | `O=C[C@H](O)[C@H](O)[C@H](O)CO` | aldehydo-D-ribose ([CID 5311110](https://pubchem.ncbi.nlm.nih.gov/compound/5311110)) | exact |
| 2-Deoxy-D-ribose | C5H10O4 | 134.13 | `O=CC[C@H](O)[C@H](O)CO` | 2-Deoxy-D-ribose ([CID 5460005](https://pubchem.ncbi.nlm.nih.gov/compound/5460005)) | exact |
| Adenine | C5H5N5 | 135.13 | `Nc1ncnc2[nH]cnc12` | Adenine ([CID 190](https://pubchem.ncbi.nlm.nih.gov/compound/190)) | exact |
| Guanine | C5H5N5O | 151.13 | `Nc1nc2[nH]cnc2c(=O)[nH]1` | Guanine ([CID 135398634](https://pubchem.ncbi.nlm.nih.gov/compound/135398634)) | exact |
| Cytosine | C4H5N3O | 111.10 | `Nc1cc[nH]c(=O)n1` | Cytosine ([CID 597](https://pubchem.ncbi.nlm.nih.gov/compound/597)) | exact |
| Thymine | C5H6N2O2 | 126.11 | `Cc1c[nH]c(=O)[nH]c1=O` | Thymine ([CID 1135](https://pubchem.ncbi.nlm.nih.gov/compound/1135)) | exact |
| Uracil | C4H4N2O2 | 112.09 | `O=c1cc[nH]c(=O)[nH]1` | Uracil ([CID 1174](https://pubchem.ncbi.nlm.nih.gov/compound/1174)) | exact |
| Glycine | C2H5NO2 | 75.07 | `NCC(O)=O` | Glycine ([CID 750](https://pubchem.ncbi.nlm.nih.gov/compound/750)) | exact |
| L-Alanine | C3H7NO2 | 89.09 | `C[C@H](N)C(O)=O` | L-Alanine ([CID 5950](https://pubchem.ncbi.nlm.nih.gov/compound/5950)) | exact |
| Glycylalanine | C5H10N2O3 | 146.15 | `C[C@@H](C(=O)O)NC(=O)CN` | L-glycylalanine ([CID 1551643](https://pubchem.ncbi.nlm.nih.gov/compound/1551643)) | exact |

<!-- lewis-check-start -->
## Structures with lone pairs

These are drawn from JSON descriptions in `src/data/lewis/figures.ts`, by `components/Lewis.tsx`, because skeletal renderers do not draw lone pairs well. `tests/unit/lewis.test.ts` runs `src/data/lewis/check.ts` on every one, and fails if any check fails. This table is written by that test.

**92 structures in 82 figures. 0 failed.**

Each is checked for: the atoms drawn against the formula; total valence electrons against the formula and overall charge; each atom's formal charge against the charge shown, and their sum against the overall charge; octets, allowing only marked exceptions (electron-deficient only for Be, B, Al and carbocation carbon, expanded only for period 3 and below, and odd-electron species); the stated shape against the count of electron domains; the hybridisation against the domains; and, where a shape lies in the page, the angles actually drawn.

**What the check cannot verify.** It confirms a structure is self-consistent, not that it is the one the book would print. So these choices are mine, from standard teaching, and worth a teacher's look:

- **Expanded octets for S in SO₂ and SO₄²⁻.** They are drawn with S=O double bonds, as ISC textbooks commonly do. Some books draw dative bonds instead.
- **Complex geometry.** VSEPR does not predict the shape of a complex. The check confirms that coordination number and hybridisation agree, but that [Ni(CN)₄]²⁻ is square planar and [NiCl₄]²⁻ tetrahedral, and which complexes are low spin, come from the standard results and not from a calculation.
- **Carbon free radicals** are drawn planar, sp², with the odd electron in a p orbital, so it is not counted as a domain there. In NO₂, the odd electron is counted as one.
- **R groups and labelled groups** such as CH₃ count their own electrons from a table, and their insides are not drawn.
- **Bond angles** other than linear, 120° and 90° are not measured, since shape diagrams show them in perspective.

**Left out on purpose.** The syllabus map has no p-block unit, so oxoacids of phosphorus and sulphur, interhalogens as a topic, and xenon compounds are not drawn. ClF₃, BrF₅ and the iodine ions appear only as VSEPR examples of their shapes, since the book's VSEPR entries name them. XeF₂ and XeF₄ are named in those entries but are not drawn.

| Id | Name | Formula | Valence electrons | Overall charge | Octets | Shape | Hybridisation | Result |
|---|---|---|---:|---:|---|---|---|---|
| water | Water | `H2O` | 8 | 0 | octet | bent | sp3 | Pass |
| ammonia | Ammonia | `NH3` | 8 | 0 | octet | trigonal pyramidal | sp3 | Pass |
| methane | Methane | `CH4` | 8 | 0 | octet | tetrahedral | sp3 | Pass |
| hf | Hydrogen fluoride | `HF` | 8 | 0 | octet | - | - | Pass |
| co2 | Carbon dioxide | `CO2` | 16 | 0 | octet | linear | sp | Pass |
| hcn | Hydrogen cyanide | `HCN` | 10 | 0 | octet | linear | sp | Pass |
| n2 | Nitrogen | `N2` | 10 | 0 | octet | - | - | Pass |
| becl2 | Beryllium chloride | `BeCl2` | 16 | 0 | deficient | linear | sp | Pass |
| bf3 | Boron trifluoride | `BF3` | 24 | 0 | deficient | trigonal planar | sp2 | Pass |
| alcl3 | Aluminium chloride | `AlCl3` | 24 | 0 | deficient | trigonal planar | sp2 | Pass |
| pcl5 | Phosphorus pentachloride | `PCl5` | 40 | 0 | expanded | trigonal bipyramidal | sp3d | Pass |
| sf4 | Sulphur tetrafluoride | `SF4` | 34 | 0 | expanded | see-saw | sp3d | Pass |
| clf3 | Chlorine trifluoride | `ClF3` | 28 | 0 | expanded | T-shaped | sp3d | Pass |
| sf6 | Sulphur hexafluoride | `SF6` | 48 | 0 | expanded | octahedral | sp3d2 | Pass |
| brf5 | Bromine pentafluoride | `BrF5` | 42 | 0 | expanded | square pyramidal | sp3d2 | Pass |
| i3 | Triiodide ion | `I3-` | 22 | -1 | expanded | linear | sp3d | Pass |
| icl2 | Dichloroiodate(I) ion | `ICl2-` | 22 | -1 | expanded | linear | sp3d | Pass |
| icl4 | Tetrachloroiodate(III) ion | `ICl4-` | 36 | -1 | expanded | square planar | sp3d2 | Pass |
| so2 | Sulphur dioxide | `SO2` | 18 | 0 | expanded | bent | sp2 | Pass |
| sulphate | Sulphate ion | `SO42-` | 32 | -2 | expanded | tetrahedral | sp3 | Pass |
| nitrite | Nitrite ion | `NO2-` | 18 | -1 | octet | bent | sp2 | Pass |
| no | Nitric oxide | `NO` | 11 | 0 | odd | - | - | Pass |
| no2 | Nitrogen dioxide | `NO2` | 17 | 0 | odd | bent | sp2 | Pass |
| ammonium | Ammonium ion | `NH4+` | 8 | 1 | octet | tetrahedral | sp3 | Pass |
| ammonium-dative | Ammonium ion, with its coordinate bond | `NH4+` | 8 | 1 | octet | tetrahedral | sp3 | Pass |
| hydronium | Hydronium ion | `H3O+` | 8 | 1 | octet | trigonal pyramidal | sp3 | Pass |
| hydroxide | Hydroxide ion | `OH-` | 8 | -1 | octet | - | - | Pass |
| chloride | Chloride ion | `Cl-` | 8 | -1 | octet | - | - | Pass |
| cl-radical | Chlorine atom | `Cl` | 7 | 0 | odd | - | - | Pass |
| nh3-bf3 | Ammonia-boron trifluoride adduct | `NH3BF3` | 32 | 0 | octet | - | - | Pass |
| ozone-dative | Ozone, with its coordinate bond | `O3` | 18 | 0 | octet | bent | sp2 | Pass |
| hno3 | Nitric acid | `HNO3` | 24 | 0 | octet | trigonal planar | sp2 | Pass |
| methyl-cation | Methyl carbocation | `CH3+` | 6 | 1 | deficient | trigonal planar | sp2 | Pass |
| methyl-radical | Methyl free radical | `CH3` | 7 | 0 | odd | trigonal planar | sp2 | Pass |
| methyl-anion | Methyl carbanion | `CH3-` | 8 | -1 | octet | trigonal pyramidal | sp3 | Pass |
| tert-butyl-cation | tert-Butyl carbocation | `C4H9+` | 24 | 1 | deficient | trigonal planar | sp2 | Pass |
| isopropyl-cation | Isopropyl carbocation | `C3H7+` | 18 | 1 | deficient | trigonal planar | sp2 | Pass |
| ethyl-cation | Ethyl carbocation | `C2H5+` | 12 | 1 | deficient | trigonal planar | sp2 | Pass |
| tert-butyl-radical | tert-Butyl free radical | `C4H9` | 25 | 0 | odd | trigonal planar | sp2 | Pass |
| nitronium | Nitronium ion | `NO2+` | 16 | 1 | octet | linear | sp | Pass |
| cyanide | Cyanide ion | `CN-` | 10 | -1 | octet | - | - | Pass |
| methylamine | Methylamine | `CH5N` | 14 | 0 | octet | trigonal pyramidal | sp3 | Pass |
| dimethylamine | Dimethylamine | `C2H7N` | 20 | 0 | octet | trigonal pyramidal | sp3 | Pass |
| trimethylamine | Trimethylamine | `C3H9N` | 26 | 0 | octet | trigonal pyramidal | sp3 | Pass |
| aniline-pair | Aniline | `C6H7N` | 36 | 0 | octet | trigonal pyramidal | sp3 | Pass |
| methanol | Methanol | `CH4O` | 14 | 0 | octet | bent | sp3 | Pass |
| ethanol | Ethanol | `C2H6O` | 20 | 0 | octet | bent | sp3 | Pass |
| dimethyl-ether | Methoxymethane | `C2H6O` | 20 | 0 | octet | bent | sp3 | Pass |
| fg-alcohol | Alcohol | `RHO` | 8 | 0 | octet | bent | - | Pass |
| fg-ether | Ether | `R2O` | 8 | 0 | octet | bent | - | Pass |
| fg-aldehyde | Aldehyde | `RCHO` | 12 | 0 | octet | trigonal planar | - | Pass |
| fg-ketone | Ketone | `R2CO` | 12 | 0 | octet | trigonal planar | - | Pass |
| fg-acid | Carboxylic acid | `RCOOH` | 18 | 0 | octet | trigonal planar | - | Pass |
| fg-amine | Primary amine | `RH2N` | 8 | 0 | octet | trigonal pyramidal | - | Pass |
| fg-nitrile | Nitrile | `RCN` | 10 | 0 | octet | linear | - | Pass |
| fg-nitro | Nitro compound | `RNO2` | 18 | 0 | octet | trigonal planar | - | Pass |
| ligand-ammonia | Ammonia, as a ligand | `NH3` | 8 | 0 | octet | trigonal pyramidal | - | Pass |
| ligand-water | Water, as a ligand | `H2O` | 8 | 0 | octet | bent | - | Pass |
| ligand-co | Carbon monoxide, as a ligand | `CO` | 10 | 0 | octet | - | - | Pass |
| ligand-en | Ethane-1,2-diamine | `C2H8N2` | 26 | 0 | octet | - | - | Pass |
| ligand-ox | Oxalate ion | `C2O42-` | 34 | -2 | octet | - | - | Pass |
| ligand-scn | Thiocyanate ion | `SCN-` | 16 | -1 | octet | - | - | Pass |
| co-ammine | Hexaamminecobalt(III) ion | `[Co(NH3)6]3+` | 54 | 3 | octet | octahedral | d2sp3 | Pass |
| fe-cyanide | Hexacyanidoferrate(II) ion | `[Fe(CN)6]4-` | 66 | -4 | octet | octahedral | d2sp3 | Pass |
| fe-aqua | Hexaaquairon(II) ion | `[Fe(H2O)6]2+` | 54 | 2 | octet | octahedral | sp3d2 | Pass |
| ni-cyanide | Tetracyanidonickelate(II) ion | `[Ni(CN)4]2-` | 48 | -2 | octet | square planar | dsp2 | Pass |
| ni-chloride | Tetrachloridonickelate(II) ion | `[NiCl4]2-` | 40 | -2 | octet | tetrahedral | sp3 | Pass |
| cu-ammine | Tetraamminecopper(II) ion | `[Cu(NH3)4]2+` | 41 | 2 | octet | square planar | dsp2 | Pass |
| zn-ammine | Tetraamminezinc(II) ion | `[Zn(NH3)4]2+` | 42 | 2 | octet | tetrahedral | sp3 | Pass |
| ag-ammine | Diamminesilver(I) ion | `[Ag(NH3)2]+` | 26 | 1 | octet | linear | sp | Pass |
| cisplatin | cis-Diamminedichloridoplatinum(II) | `[Pt(NH3)2Cl2]` | 40 | 0 | octet | square planar | dsp2 | Pass |
| transplatin | trans-Diamminedichloridoplatinum(II) | `[Pt(NH3)2Cl2]` | 40 | 0 | octet | square planar | dsp2 | Pass |
| hf-chain | Hydrogen bonds in hydrogen fluoride | `H3F3` | 24 | 0 | octet | - | - | Pass |
| water-dimer | A hydrogen bond between water molecules | `H4O2` | 16 | 0 | octet | - | - | Pass |
| ethanol-water | A hydrogen bond between ethanol and water | `C2H8O2` | 28 | 0 | octet | - | - | Pass |
| ozone-1 | Ozone | `O3` | 18 | 0 | octet | bent | sp2 | Pass |
| ozone-2 | Ozone | `O3` | 18 | 0 | octet | bent | sp2 | Pass |
| carbonate-1 | Carbonate ion | `CO32-` | 24 | -2 | octet | trigonal planar | sp2 | Pass |
| carbonate-2 | Carbonate ion | `CO32-` | 24 | -2 | octet | trigonal planar | sp2 | Pass |
| carbonate-3 | Carbonate ion | `CO32-` | 24 | -2 | octet | trigonal planar | sp2 | Pass |
| nitrate-1 | Nitrate ion | `NO3-` | 24 | -1 | octet | trigonal planar | sp2 | Pass |
| nitrate-2 | Nitrate ion | `NO3-` | 24 | -1 | octet | trigonal planar | sp2 | Pass |
| nitrate-3 | Nitrate ion | `NO3-` | 24 | -1 | octet | trigonal planar | sp2 | Pass |
| co2-1 | Carbon dioxide | `CO2` | 16 | 0 | octet | linear | sp | Pass |
| co2-2 | Carbon dioxide | `CO2` | 16 | 0 | octet | linear | sp | Pass |
| co2-3 | Carbon dioxide | `CO2` | 16 | 0 | octet | linear | sp | Pass |
| benzene-1 | Benzene | `C6H6` | 30 | 0 | octet | - | - | Pass |
| benzene-2 | Benzene | `C6H6` | 30 | 0 | octet | - | - | Pass |
| allyl-1 | Allyl carbocation | `C3H5+` | 16 | 1 | octet | - | - | Pass |
| allyl-2 | Allyl carbocation | `C3H5+` | 16 | 1 | octet | - | - | Pass |
| acetate-1 | Ethanoate ion | `C2H3O2-` | 24 | -1 | octet | trigonal planar | sp2 | Pass |
| acetate-2 | Ethanoate ion | `C2H3O2-` | 24 | -1 | octet | trigonal planar | sp2 | Pass |
<!-- lewis-check-end -->
