# Question supply, after

Written by `tests/unit/supply-report.test.ts`. It counts the app's own material, and holds no wording from any paper.

- **Structures** are blueprint × unknown × format × setting. New numbers alone don't make a new structure.
- **To structure repeat** is how many questions the real picker gives for that subtopic before a structure comes round again, averaged over 3 runs of up to 200.
- **Distinct** is how many different questions that picker can give with no fact asked twice, up to 200.
- **Variety** is 0 to 100 for how unlike consecutive questions are, in wording, structure and blueprint.

## By subject

| Subject | Subtopics | Blueprints | Bank questions | Facts | Structures | Median to structure repeat | Median distinct | Mean variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Physics | 41 | 2731 | 12995 | 2147 | 10968 | 12 | 200 | 94.7 |
| Chemistry | 52 | 1308 | 7059 | 2139 | 2940 | 12 | 68 | 90.4 |
| Mathematics | 28 | 820 | 4871 | 1096 | 861 | 16 | 200 | 94 |
| Computer Science | 31 | 631 | 3859 | 1241 | 640 | 12 | 166 | 91.3 |
| **All** | 152 | 5490 | 28784 | 6623 | 15409 | 12 | 200 | 92.4 |

## What the bank targets add up to

- 152 subtopics, 38 of them most asked. At 40 and 80 questions, the target is **7,600** bank questions. There are 28784.
- Counting a format as fitting a subtopic only where something already exists for it, there are **5,844** subtopic × format × difficulty combinations. **4,937** have fewer than 10 bank questions. Ten in each is **58,440** questions; forty, which the stress test asks for at 0%, is **233,760**.

## Before and after

| Measure | Before | After |
|---|---:|---:|
| Blueprints | 2,214 | 5,490 |
| Distinct structures | 2,272 | 15,409 |
| Facts | 6,623 | 6,623 |
| Bank questions, all layers | 704 | 28,784 |
| Median questions before a structure repeats | 12 | 12 |
| Median distinct questions per subtopic, capped at 200 | 159 | 200 |
| Mean variety score | 66.8 | 92.4 |

## The bank, by where each question came from

Only "Written" is finished questions written by hand as bank questions. "Facts" is reviewed facts asked as fixed questions, which are the same knowledge the generator uses. "Compiled" is frozen from reviewed blueprints, with machine-checked answers, and the slider counts it as generated: 0% uses only the first two.

| Subject | Written | Facts | Compiled | Total |
|---|---:|---:|---:|---:|
| Physics | 610 | 4,138 | 8,247 | 12,995 |
| Chemistry | 522 | 4,046 | 2,491 | 7,059 |
| Mathematics | 532 | 2,037 | 2,302 | 4,871 |
| Computer Science | 196 | 2,436 | 1,227 | 3,859 |
| **All** | 1,860 | 12,657 | 14,267 | 28,784 |

## Numericals at 0%

Numericals are the format 0% loses most by leaving compiled questions out, as most of the bank's were compiled.

| Class | Numericals 0% can use | Compiled, for above 0% | Subtopics with fewer than 10 at 0% |
|---|---:|---:|---:|
| Physics XI | 22 | 1,672 | 20 of 20 |
| Physics XII | 45 | 1,405 | 15 of 16 |
| Chemistry XI | 17 | 493 | 11 of 11 |
| Chemistry XII | 17 | 423 | 6 of 6 |
| Mathematics XI | 155 | 962 | 2 of 15 |
| Mathematics XII | 134 | 710 | 1 of 13 |
| Computer Science XI | 0 | 57 | 1 of 1 |
| Computer Science XII | 0 | 16 | 1 of 1 |

## Against the 40 and 80 target

- Counting all three layers, 152 of 152 subtopics reach it.
- Counting hand-written and fact-based questions, all that 0% can use, 127 of 152 reach it.
- Counting only hand-written questions, 8 of 152 reach it.

## Filter stress test

For each subtopic, fitting format and fitting difficulty, how many combinations can fill a request entirely from exact matches, with no fact asked twice. Generated from `tests/unit/filter-stress.test.ts`.

| Subject | Combinations | 0%: 10 | 0%: 20 | 0%: 40 | 50%: 10 | 50%: 20 | 50%: 40 | 100%: 10 | 100%: 20 | 100%: 40 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Physics | 1,550 | 123 | 64 | 0 | 423 | 348 | 303 | 381 | 331 | 303 |
| Chemistry | 1,574 | 116 | 38 | 1 | 244 | 146 | 104 | 213 | 138 | 104 |
| Mathematics | 895 | 91 | 12 | 0 | 241 | 144 | 122 | 220 | 138 | 120 |
| Computer Science | 1,031 | 105 | 9 | 0 | 216 | 95 | 76 | 193 | 93 | 76 |

### By format

| Format | Combinations | Fill 10 at 0% | Fill 10 at 50% |
|---|---:|---:|---:|
| mcq | 456 | 89 | 221 |
| assertion | 456 | 12 | 35 |
| mistake | 456 | 78 | 100 |
| statement | 453 | 156 | 156 |
| reason | 414 | 7 | 7 |
| short | 378 | 1 | 35 |
| very-short | 304 | 73 | 73 |
| complete | 292 | 16 | 16 |
| match | 264 | 0 | 0 |
| distinguish | 262 | 0 | 4 |
| numerical | 249 | 0 | 206 |
| cbq | 237 | 0 | 59 |
| data | 156 | 0 | 77 |
| derivation | 116 | 3 | 13 |
| long | 114 | 0 | 12 |
| order | 102 | 0 | 45 |
| diagram | 102 | 0 | 0 |
| output | 48 | 0 | 20 |
| predict | 46 | 0 | 0 |
| change | 27 | 0 | 9 |
| fill | 27 | 0 | 9 |
| program | 24 | 0 | 3 |
| error | 18 | 0 | 4 |
| trace | 18 | 0 | 9 |
| odd | 16 | 0 | 0 |
| convert | 15 | 0 | 11 |

## Two mock papers running

With the same settings and the first paper in the history, what the second shares with the first, averaged over 3 runs.

| Paper | Generated | Same questions | Same facts | Same structures |
|---|---:|---:|---:|---:|
| physics XI | 0% | 0.0% | 0.0% | 0.0% |
| physics XI | 50% | 0.0% | 0.0% | 0.0% |
| physics XI | 100% | 0.0% | 0.0% | 0.0% |
| physics XII | 0% | 0.0% | 0.0% | 0.0% |
| physics XII | 50% | 0.0% | 0.0% | 0.0% |
| physics XII | 100% | 0.0% | 0.0% | 0.0% |
| chemistry XI | 0% | 2.9% | 0.0% | 2.9% |
| chemistry XI | 50% | 0.0% | 0.0% | 0.0% |
| chemistry XI | 100% | 0.0% | 0.0% | 0.0% |
| chemistry XII | 0% | 0.0% | 0.0% | 0.0% |
| chemistry XII | 50% | 0.0% | 0.0% | 0.0% |
| chemistry XII | 100% | 0.0% | 0.0% | 0.0% |
| mathematics XI | 0% | 2.6% | 0.0% | 2.6% |
| mathematics XI | 50% | 0.0% | 0.0% | 0.0% |
| mathematics XI | 100% | 0.0% | 0.0% | 0.0% |
| mathematics XII | 0% | 0.0% | 0.0% | 0.0% |
| mathematics XII | 50% | 0.0% | 0.0% | 0.0% |
| mathematics XII | 100% | 0.0% | 0.0% | 0.0% |
| computerscience XI | 0% | 0.0% | 0.0% | 0.0% |
| computerscience XI | 50% | 0.0% | 0.0% | 0.0% |
| computerscience XI | 100% | 0.0% | 0.0% | 0.0% |
| computerscience XII | 0% | 4.2% | 0.0% | 4.2% |
| computerscience XII | 50% | 0.0% | 0.0% | 0.0% |
| computerscience XII | 100% | 0.0% | 0.0% | 0.0% |

## Physics

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a Units and Measurements (most asked) | 0 | 13 | 0 | 82 | 17 | 13 | 0 | 11 | 1 | 16 | 93 |
| XI 1b Dimensions (most asked) | 0 | 9 | 0 | 81 | 17 | 9 | 0 | 9 | 1 | 17 | 86 |
| XI 1p Paper II: measuring instruments (most asked) | 0 | 9 | 0 | 85 | 16 | 9 | 0 | 8 | 1 | 15 | 90 |
| XI 2a Motion in a Straight Line (most asked) | 0 | 64 | 24 | 319 | 63 | 300 | 20 | 16 | 7 | 200 | 97 |
| XI 2b Motion in a Plane (most asked) | 0 | 80 | 34 | 297 | 19 | 470 | 13 | 12 | 11 | 200 | 95 |
| XI 3a Newton's laws and momentum (most asked) | 0 | 97 | 46 | 354 | 22 | 609 | 13 | 13 | 11 | 200 | 96 |
| XI 3b Equilibrium and friction (most asked) | 0 | 44 | 20 | 212 | 19 | 181 | 11 | 12 | 11 | 200 | 96 |
| XI 3c Circular motion (most asked) | 0 | 56 | 28 | 265 | 16 | 353 | 14 | 12 | 11 | 200 | 94 |
| XI 4a Work, energy and power (most asked) | 0 | 105 | 50 | 512 | 71 | 695 | 13 | 13 | 11 | 200 | 96 |
| XI 4b Collisions (most asked) | 0 | 34 | 14 | 158 | 15 | 156 | 12 | 12 | 4 | 200 | 93 |
| XI 5a Centre of mass (most asked) | 0 | 20 | 8 | 121 | 15 | 30 | 3 | 13 | 7 | 200 | 81 |
| XI 5b Torque and angular momentum (most asked) | 0 | 44 | 20 | 215 | 16 | 238 | 11 | 12 | 11 | 200 | 95 |
| XI 5c Moment of inertia (most asked) | 0 | 43 | 21 | 237 | 16 | 268 | 11 | 12 | 5 | 200 | 94 |
| XI 6a Gravity and its variation (most asked) | 0 | 51 | 19 | 251 | 17 | 183 | 11 | 13 | 8 | 200 | 96 |
| XI 6b Potential, escape velocity and satellites (most asked) | 0 | 66 | 23 | 296 | 19 | 284 | 11 | 12 | 11 | 200 | 93 |
| XI 7a Mechanical Properties of Solids (most asked) | 0 | 52 | 23 | 267 | 17 | 294 | 9 | 12 | 9 | 200 | 95 |
| XI 7b Mechanical Properties of Fluids (most asked) | 0 | 68 | 32 | 312 | 21 | 309 | 12 | 12 | 11 | 200 | 96 |
| XI 7c Surface tension (most asked) | 0 | 21 | 8 | 117 | 16 | 61 | 6 | 12 | 5 | 200 | 85 |
| XI 8a Thermal Properties of Matter (most asked) | 0 | 56 | 30 | 254 | 20 | 133 | 11 | 12 | 7 | 200 | 96 |
| XI 8b Thermodynamics (most asked) | 0 | 52 | 18 | 226 | 21 | 80 | 6 | 12 | 9 | 200 | 96 |
| XI 9a Kinetic Theory (most asked) | 0 | 55 | 24 | 269 | 18 | 283 | 10 | 12 | 11 | 200 | 93 |
| XI 10a Oscillations (most asked) | 0 | 80 | 37 | 335 | 19 | 325 | 11 | 12 | 2 | 200 | 95 |
| XI 10b Waves (most asked) | 0 | 101 | 49 | 497 | 84 | 577 | 13 | 12 | 11 | 200 | 96 |
| XII 1a Electric Charges and Fields (most asked) | 0 | 122 | 49 | 552 | 101 | 324 | 15 | 12 | 2 | 200 | 97 |
| XII 1b Electrostatic Potential, Potential Energy and Capacitance (most asked) | 0 | 143 | 67 | 590 | 95 | 497 | 14 | 12 | 11 | 200 | 97 |
| XII 2a Conduction, Ohm's law and power (most asked) | 0 | 148 | 75 | 563 | 90 | 941 | 18 | 12 | 11 | 200 | 98 |
| XII 2b Cells, Kirchhoff's laws and bridges (most asked) | 0 | 104 | 49 | 497 | 86 | 463 | 14 | 13 | 11 | 200 | 97 |
| XII 3a Moving charges and magnetism (most asked) | 0 | 212 | 108 | 670 | 104 | 620 | 17 | 12 | 11 | 200 | 97 |
| XII 3b Magnetism and Matter (most asked) | 0 | 20 | 0 | 145 | 74 | 20 | 0 | 12 | 1 | 68 | 99 |
| XII 4a Electromagnetic Induction (most asked) | 0 | 75 | 27 | 414 | 82 | 327 | 12 | 12 | 11 | 200 | 97 |
| XII 4b Alternating Current (most asked) | 0 | 109 | 44 | 571 | 105 | 320 | 12 | 13 | 10 | 200 | 96 |
| XII 5a Electromagnetic Waves (most asked) | 0 | 25 | 3 | 200 | 84 | 30 | 2 | 12 | 2 | 200 | 96 |
| XII 6a Ray Optics (most asked) | 0 | 134 | 65 | 603 | 133 | 569 | 17 | 13 | 11 | 200 | 97 |
| XII 6b Optical instruments (most asked) | 0 | 53 | 16 | 305 | 74 | 185 | 8 | 13 | 7 | 200 | 95 |
| XII 6c Wave Optics (most asked) | 0 | 79 | 27 | 438 | 89 | 177 | 8 | 12 | 10 | 200 | 97 |
| XII 6p Paper II: ray optics experiments (most asked) | 0 | 11 | 0 | 81 | 18 | 11 | 0 | 10 | 1 | 18 | 90 |
| XII 7a Dual Nature of Radiation and Matter (most asked) | 0 | 106 | 41 | 505 | 87 | 268 | 14 | 12 | 6 | 200 | 98 |
| XII 8a Atoms (most asked) | 0 | 41 | 10 | 205 | 86 | 41 | 10 | 13 | 1 | 138 | 96 |
| XII 8b Nuclei | 0 | 49 | 13 | 308 | 92 | 53 | 8 | 12 | 4 | 200 | 98 |
| XII 9a Semiconductor Electronics | 0 | 28 | 5 | 222 | 78 | 28 | 2 | 12 | 5 | 200 | 97 |
| XII 9b Semiconductor diode | 0 | 52 | 18 | 364 | 95 | 234 | 10 | 13 | 9 | 200 | 95 |

## Chemistry

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a Matter, laws and measurement | 0 | 12 | 0 | 42 | 15 | 12 | 0 | 10 | 2 | 14 | 96 |
| XI 1b Mole concept and stoichiometry | 0 | 22 | 7 | 100 | 17 | 27 | 4 | 14 | 2 | 200 | 93 |
| XI 1c Chemical equivalents and volumetric calculations | 0 | 57 | 28 | 312 | 40 | 217 | 8 | 11 | 11 | 200 | 95 |
| XI 2a Particles and atomic models | 0 | 37 | 17 | 209 | 16 | 140 | 12 | 15 | 3 | 200 | 95 |
| XI 2b Quantum numbers and electronic configuration | 0 | 14 | 0 | 55 | 18 | 14 | 0 | 12 | 1 | 169 | 62 |
| XI 3a Periodic law and periodic trends | 0 | 15 | 0 | 49 | 21 | 15 | 0 | 12 | 1 | 22 | 93 |
| XI 4a Ionic and covalent bonding | 0 | 20 | 6 | 99 | 20 | 20 | 2 | 12 | 3 | 200 | 86 |
| XI 4b VSEPR, hybridisation and molecular orbitals | 0 | 24 | 5 | 139 | 18 | 24 | 2 | 13 | 5 | 200 | 93 |
| XI 5a Systems and the First Law | 0 | 58 | 26 | 274 | 17 | 114 | 7 | 21 | 11 | 200 | 94 |
| XI 5b Second and Third Laws | 0 | 38 | 17 | 193 | 16 | 176 | 9 | 15 | 8 | 200 | 94 |
| XI 6a Chemical Equilibrium | 0 | 15 | 0 | 40 | 17 | 15 | 0 | 11 | 1 | 18 | 94 |
| XI 6b Ionic equilibrium | 0 | 55 | 23 | 312 | 75 | 138 | 13 | 12 | 9 | 200 | 97 |
| XI 7a Redox Reactions | 0 | 15 | 0 | 53 | 18 | 15 | 0 | 13 | 1 | 160 | 74 |
| XI 8a Classification, nomenclature and isomerism | 0 | 13 | 0 | 40 | 17 | 13 | 0 | 11 | 1 | 123 | 53 |
| XI 8b Purification and analysis | 0 | 9 | 0 | 42 | 15 | 9 | 0 | 9 | 1 | 15 | 92 |
| XI 8c Electronic effects and reaction types | 0 | 12 | 0 | 50 | 19 | 12 | 0 | 11 | 1 | 17 | 92 |
| XI 9a Alkanes | 0 | 11 | 0 | 41 | 16 | 11 | 0 | 10 | 1 | 15 | 96 |
| XI 9b Alkenes | 0 | 13 | 0 | 43 | 17 | 13 | 0 | 11 | 1 | 21 | 96 |
| XI 9c Alkynes | 0 | 9 | 0 | 42 | 15 | 9 | 0 | 8 | 1 | 15 | 91 |
| XI 9d Aromatic Hydrocarbons | 0 | 12 | 0 | 42 | 16 | 12 | 0 | 11 | 1 | 16 | 94 |
| XI 10a Titration | 0 | 10 | 0 | 41 | 16 | 10 | 0 | 10 | 1 | 16 | 94 |
| XI 10b Qualitative analysis | 0 | 8 | 0 | 41 | 18 | 8 | 0 | 7 | 1 | 17 | 71 |
| XI 10c Preparation of inorganic compounds | 0 | 8 | 0 | 45 | 15 | 8 | 0 | 7 | 1 | 15 | 83 |
| XI 10d Paper Chromatography | 0 | 9 | 0 | 44 | 16 | 9 | 0 | 8 | 1 | 14 | 87 |
| XII 1a Solutions and colligative properties | 0 | 173 | 89 | 746 | 156 | 707 | 18 | 11 | 11 | 200 | 97 |
| XII 2a Cells and potentials | 0 | 50 | 16 | 297 | 74 | 136 | 10 | 12 | 7 | 200 | 97 |
| XII 2b Conductance and electrolysis | 0 | 80 | 36 | 416 | 73 | 183 | 10 | 11 | 8 | 200 | 97 |
| XII 2c Batteries and corrosion | 0 | 13 | 0 | 42 | 18 | 13 | 0 | 12 | 1 | 18 | 93 |
| XII 3a Rate, order and integrated rate equations | 0 | 87 | 31 | 493 | 94 | 367 | 12 | 12 | 11 | 200 | 96 |
| XII 3b Collision theory and activation energy | 0 | 27 | 8 | 146 | 19 | 111 | 9 | 16 | 11 | 200 | 89 |
| XII 4a Transition elements, lanthanoids and actinoids | 0 | 24 | 0 | 191 | 89 | 24 | 0 | 12 | 1 | 113 | 97 |
| XII 4b K2Cr2O7 and KMnO4 | 0 | 20 | 0 | 166 | 87 | 20 | 0 | 12 | 1 | 92 | 98 |
| XII 5a Coordination Compounds | 0 | 30 | 0 | 292 | 134 | 30 | 0 | 12 | 1 | 186 | 98 |
| XII 6a Haloalkanes | 0 | 22 | 0 | 198 | 102 | 22 | 0 | 12 | 1 | 164 | 98 |
| XII 6b Haloarenes | 0 | 19 | 0 | 86 | 42 | 19 | 0 | 13 | 1 | 42 | 93 |
| XII 6c Polyhalogen compounds | 0 | 9 | 0 | 42 | 15 | 9 | 0 | 9 | 1 | 15 | 89 |
| XII 7a Alcohols | 0 | 27 | 0 | 187 | 80 | 27 | 0 | 13 | 1 | 124 | 98 |
| XII 7b Phenols | 0 | 20 | 0 | 139 | 70 | 20 | 0 | 11 | 1 | 76 | 97 |
| XII 7c Ethers | 0 | 21 | 0 | 80 | 41 | 21 | 0 | 13 | 1 | 44 | 95 |
| XII 8a Aldehydes and Ketones | 0 | 24 | 0 | 189 | 98 | 24 | 0 | 14 | 1 | 200 | 98 |
| XII 8b Carboxylic Acids | 0 | 17 | 0 | 50 | 19 | 17 | 0 | 15 | 1 | 42 | 82 |
| XII 9a Aliphatic Amines and Aniline | 0 | 21 | 0 | 178 | 89 | 21 | 0 | 12 | 1 | 107 | 98 |
| XII 9b Cyanides and Isocyanides | 0 | 13 | 0 | 40 | 15 | 13 | 0 | 12 | 1 | 19 | 95 |
| XII 9c Diazonium salts | 0 | 17 | 0 | 96 | 40 | 17 | 0 | 13 | 1 | 49 | 93 |
| XII 10a Carbohydrates | 0 | 18 | 0 | 148 | 75 | 18 | 0 | 11 | 1 | 68 | 98 |
| XII 10b Proteins | 0 | 21 | 0 | 159 | 83 | 21 | 0 | 12 | 1 | 78 | 98 |
| XII 10c Vitamins | 0 | 12 | 0 | 42 | 18 | 12 | 0 | 10 | 1 | 18 | 92 |
| XII 10d Nucleic Acids | 0 | 17 | 0 | 109 | 54 | 17 | 0 | 11 | 1 | 48 | 94 |
| XII 11a Titrations | 0 | 10 | 0 | 45 | 17 | 10 | 0 | 9 | 1 | 17 | 84 |
| XII 11b Rate of reaction, pH and cells | 0 | 9 | 0 | 44 | 17 | 9 | 0 | 8 | 1 | 17 | 84 |
| XII 11c Identifying compounds and functional groups | 0 | 8 | 0 | 46 | 17 | 8 | 0 | 7 | 1 | 17 | 77 |
| XII 11d Qualitative analysis | 0 | 3 | 0 | 44 | 15 | 3 | 0 | 2 | 1 | 15 | 60 |

## Mathematics

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a Sets | 0 | 27 | 10 | 189 | 44 | 29 | 12 | 15 | 5 | 200 | 96 |
| XI 1b Relations & Functions | 0 | 15 | 0 | 111 | 46 | 15 | 0 | 11 | 1 | 200 | 96 |
| XI 1c Trigonometry | 0 | 28 | 11 | 176 | 56 | 28 | 11 | 19 | 1 | 200 | 96 |
| XI 2a Complex Numbers | 0 | 26 | 11 | 149 | 15 | 26 | 9 | 15 | 5 | 200 | 94 |
| XI 2b Quadratic Equations | 0 | 23 | 11 | 131 | 17 | 23 | 10 | 16 | 4 | 200 | 91 |
| XI 2c Permutations and Combinations | 0 | 33 | 13 | 128 | 15 | 44 | 23 | 17 | 1 | 200 | 97 |
| XI 2d Binomial Theorem | 0 | 22 | 10 | 102 | 16 | 22 | 8 | 13 | 1 | 175 | 86 |
| XI 2e Sequence and Series | 0 | 35 | 14 | 169 | 18 | 35 | 14 | 17 | 4 | 200 | 94 |
| XI 3a Straight Lines | 0 | 30 | 12 | 195 | 40 | 30 | 12 | 18 | 6 | 200 | 92 |
| XI 3b Circles | 0 | 26 | 11 | 172 | 42 | 26 | 11 | 13 | 6 | 200 | 93 |
| XI 3c Conic Section | 0 | 29 | 12 | 177 | 48 | 29 | 11 | 13 | 1 | 200 | 94 |
| XI 3d Introduction to three-dimensional Geometry | 0 | 18 | 9 | 111 | 16 | 18 | 9 | 13 | 3 | 200 | 91 |
| XI 4a Limits and Derivatives | 0 | 34 | 13 | 157 | 16 | 34 | 4 | 16 | 7 | 200 | 92 |
| XI 5a Statistics | 0 | 26 | 13 | 153 | 16 | 32 | 19 | 14 | 9 | 200 | 91 |
| XI 5b Probability | 0 | 25 | 13 | 166 | 40 | 34 | 21 | 13 | 1 | 195 | 95 |
| XII 1a Types of relations and functions | 0 | 32 | 11 | 209 | 60 | 32 | 10 | 18 | 2 | 200 | 96 |
| XII 1b Inverse Trigonometric Functions | 0 | 28 | 11 | 161 | 47 | 28 | 5 | 17 | 1 | 200 | 92 |
| XII 2a Matrices | 0 | 34 | 11 | 197 | 48 | 34 | 11 | 15 | 8 | 200 | 97 |
| XII 2b Determinants | 0 | 35 | 13 | 205 | 46 | 35 | 12 | 20 | 11 | 200 | 97 |
| XII 3a Continuity, Differentiability and Differentiation | 0 | 36 | 14 | 195 | 47 | 36 | 5 | 18 | 2 | 200 | 94 |
| XII 3b Applications of Derivatives | 0 | 38 | 12 | 248 | 49 | 42 | 16 | 18 | 3 | 200 | 96 |
| XII 3c Integrals | 0 | 33 | 11 | 186 | 47 | 33 | 3 | 19 | 1 | 200 | 90 |
| XII 3d Application of Integrals | 0 | 28 | 11 | 137 | 40 | 28 | 10 | 13 | 1 | 128 | 91 |
| XII 3e Differential Equations | 0 | 29 | 12 | 171 | 45 | 30 | 13 | 18 | 3 | 200 | 96 |
| XII 4a Vector Algebra | 0 | 33 | 10 | 224 | 60 | 33 | 9 | 18 | 4 | 200 | 96 |
| XII 5a Three-dimensional Geometry | 0 | 29 | 10 | 184 | 47 | 30 | 10 | 16 | 3 | 200 | 95 |
| XII 6a Linear Programming | 0 | 27 | 11 | 203 | 50 | 29 | 13 | 14 | 10 | 200 | 97 |
| XII 7a Probability | 0 | 41 | 11 | 265 | 65 | 46 | 15 | 18 | 5 | 200 | 96 |

## Computer Science

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a System of Numeration | 0 | 30 | 10 | 206 | 52 | 38 | 18 | 15 | 6 | 200 | 95 |
| XI 2a Encodings | 0 | 16 | 0 | 99 | 48 | 16 | 0 | 13 | 1 | 129 | 91 |
| XI 3a Propositional logic | 0 | 18 | 0 | 118 | 40 | 18 | 0 | 12 | 1 | 98 | 97 |
| XI 3b Logic and hardware | 0 | 16 | 0 | 64 | 16 | 16 | 0 | 12 | 1 | 89 | 96 |
| XI 4a Introduction | 0 | 12 | 0 | 42 | 16 | 12 | 0 | 11 | 1 | 15 | 96 |
| XI 5a Objects and the JVM | 0 | 14 | 0 | 108 | 48 | 14 | 0 | 12 | 1 | 74 | 97 |
| XI 5b Errors and exceptions | 0 | 12 | 0 | 40 | 16 | 12 | 0 | 10 | 2 | 16 | 98 |
| XI 6a Primitive values, Wrapper classes, Types and casting | 0 | 18 | 0 | 121 | 54 | 18 | 0 | 12 | 1 | 165 | 97 |
| XI 7a Variables, Expressions | 0 | 23 | 0 | 165 | 60 | 23 | 0 | 12 | 1 | 200 | 97 |
| XI 8a Statements, Scope | 0 | 44 | 0 | 271 | 58 | 44 | 0 | 14 | 10 | 200 | 96 |
| XI 9a Methods and Constructors | 0 | 25 | 0 | 157 | 50 | 25 | 0 | 14 | 1 | 200 | 97 |
| XI 10a Arrays, Strings | 0 | 23 | 0 | 116 | 15 | 23 | 0 | 12 | 7 | 200 | 95 |
| XI 11a Basic input/output using Scanner class | 0 | 9 | 0 | 41 | 16 | 9 | 0 | 8 | 1 | 16 | 93 |
| XI 11b Data File Handling | 0 | 12 | 0 | 41 | 17 | 12 | 0 | 10 | 1 | 17 | 95 |
| XI 12a Introduction to Python | 0 | 13 | 0 | 55 | 17 | 13 | 0 | 13 | 1 | 123 | 62 |
| XI 13a Trends in computing and ethical issues | 0 | 13 | 0 | 46 | 20 | 13 | 0 | 11 | 2 | 19 | 99 |
| XII 1a Propositional logic | 0 | 20 | 0 | 140 | 48 | 20 | 0 | 17 | 1 | 200 | 97 |
| XII 1b Boolean algebra and Karnaugh maps | 0 | 38 | 0 | 264 | 72 | 38 | 0 | 12 | 3 | 200 | 98 |
| XII 2a Logic gates | 0 | 19 | 0 | 132 | 54 | 19 | 0 | 12 | 1 | 200 | 96 |
| XII 2b Applications | 0 | 18 | 0 | 129 | 63 | 18 | 0 | 11 | 1 | 62 | 97 |
| XII 3a Methods | 0 | 30 | 0 | 246 | 67 | 30 | 0 | 13 | 5 | 200 | 97 |
| XII 4a Arrays | 0 | 33 | 2 | 237 | 52 | 34 | 3 | 13 | 4 | 200 | 97 |
| XII 4b String handling | 0 | 23 | 0 | 132 | 45 | 23 | 0 | 13 | 1 | 200 | 95 |
| XII 5a Recursion | 0 | 26 | 0 | 147 | 40 | 26 | 0 | 12 | 3 | 200 | 95 |
| XII 6a Inheritance | 0 | 34 | 0 | 211 | 57 | 34 | 0 | 13 | 4 | 200 | 97 |
| XII 6b Interfaces in Java (Only Conceptual) | 0 | 23 | 0 | 121 | 48 | 23 | 0 | 15 | 1 | 124 | 96 |
| XII 7a Strings | 0 | 9 | 0 | 42 | 15 | 9 | 0 | 9 | 1 | 139 | 48 |
| XII 7b Lists | 0 | 11 | 0 | 51 | 15 | 11 | 0 | 10 | 2 | 200 | 75 |
| XII 7c Tuples | 0 | 11 | 0 | 42 | 15 | 11 | 0 | 10 | 1 | 166 | 50 |
| XII 8a Binary trees [Conceptual] | 0 | 21 | 0 | 152 | 56 | 21 | 0 | 13 | 1 | 166 | 95 |
| XII 9a Complexity and Big O notation | 0 | 17 | 0 | 123 | 51 | 17 | 0 | 12 | 1 | 85 | 95 |

Took 262 s.
