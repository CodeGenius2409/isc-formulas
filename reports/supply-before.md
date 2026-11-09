# Question supply, before

Written by `tests/unit/supply-report.test.ts`. It counts the app's own material, and holds no wording from any paper.

- **Structures** are blueprint × unknown × format × setting. New numbers alone don't make a new structure.
- **To structure repeat** is how many questions the real picker gives for that subtopic before a structure comes round again, averaged over 3 runs of up to 200.
- **Distinct** is how many different questions that picker can give with no fact asked twice, up to 200.
- **Variety** is 0 to 100 for how unlike consecutive questions are, in wording, structure and blueprint.

## By subject

| Subject | Subtopics | Blueprints | Bank questions | Facts | Structures | Median to structure repeat | Median distinct | Mean variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Physics | 41 | 807 | 221 | 2147 | 833 | 15 | 176 | 58.1 |
| Chemistry | 52 | 614 | 210 | 2139 | 616 | 9 | 45 | 67.3 |
| Mathematics | 28 | 435 | 172 | 1096 | 464 | 13 | 200 | 61.8 |
| Computer Science | 31 | 358 | 101 | 1241 | 359 | 11 | 186 | 82 |
| **All** | 152 | 2214 | 704 | 6623 | 2272 | 12 | 159 | 66.8 |

## What the bank targets add up to

- 152 subtopics, 38 of them most asked. At 40 and 80 questions, the target is **7,600** bank questions. There are 704.
- Counting a format as fitting a subtopic only where something already exists for it, there are **3,378** subtopic × format × difficulty combinations. **3,377** have fewer than 10 bank questions. Ten in each is **33,780** questions; forty, which the stress test asks for at 0%, is **135,120**.

## Physics

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a Units and Measurements (most asked) | 0 | 8 | 0 | 1 | 17 | 8 | 0 | 7 | 1 | 15 | 75 |
| XI 1b Dimensions (most asked) | 0 | 5 | 0 | 3 | 17 | 5 | 0 | 5 | 1 | 17 | 86 |
| XI 1p Paper II: measuring instruments (most asked) | 0 | 5 | 0 | 0 | 16 | 5 | 0 | 5 | 1 | 13 | 88 |
| XI 2a Motion in a Straight Line (most asked) | 0 | 24 | 3 | 5 | 63 | 31 | 10 | 20 | 1 | 200 | 66 |
| XI 2b Motion in a Plane (most asked) | 0 | 23 | 3 | 8 | 19 | 23 | 3 | 15 | 1 | 200 | 41 |
| XI 3a Newton's laws and momentum (most asked) | 0 | 23 | 3 | 5 | 22 | 23 | 3 | 17 | 1 | 200 | 45 |
| XI 3b Equilibrium and friction (most asked) | 0 | 11 | 2 | 3 | 19 | 11 | 2 | 10 | 1 | 133 | 27 |
| XI 3c Circular motion (most asked) | 0 | 11 | 2 | 3 | 16 | 12 | 3 | 8 | 1 | 165 | 22 |
| XI 4a Work, energy and power (most asked) | 0 | 20 | 3 | 3 | 71 | 20 | 3 | 19 | 1 | 200 | 63 |
| XI 4b Collisions (most asked) | 0 | 11 | 2 | 4 | 15 | 11 | 2 | 9 | 1 | 139 | 25 |
| XI 5a Centre of mass (most asked) | 0 | 7 | 1 | 1 | 15 | 7 | 1 | 7 | 1 | 200 | 51 |
| XI 5b Torque and angular momentum (most asked) | 0 | 10 | 2 | 2 | 16 | 10 | 2 | 9 | 1 | 176 | 23 |
| XI 5c Moment of inertia (most asked) | 0 | 7 | 1 | 3 | 16 | 8 | 2 | 7 | 1 | 116 | 61 |
| XI 6a Gravity and its variation (most asked) | 0 | 14 | 1 | 5 | 17 | 15 | 2 | 10 | 1 | 97 | 47 |
| XI 6b Potential, escape velocity and satellites (most asked) | 0 | 21 | 2 | 6 | 19 | 21 | 2 | 12 | 1 | 83 | 36 |
| XI 7a Mechanical Properties of Solids (most asked) | 0 | 9 | 1 | 2 | 17 | 9 | 1 | 8 | 1 | 124 | 25 |
| XI 7b Mechanical Properties of Fluids (most asked) | 0 | 15 | 3 | 4 | 21 | 15 | 3 | 12 | 1 | 117 | 35 |
| XI 7c Surface tension (most asked) | 0 | 7 | 1 | 3 | 16 | 7 | 1 | 6 | 1 | 20 | 63 |
| XI 8a Thermal Properties of Matter (most asked) | 0 | 10 | 3 | 2 | 20 | 10 | 3 | 9 | 1 | 200 | 30 |
| XI 8b Thermodynamics (most asked) | 0 | 21 | 2 | 7 | 21 | 21 | 2 | 15 | 1 | 200 | 43 |
| XI 9a Kinetic Theory (most asked) | 0 | 14 | 2 | 4 | 18 | 14 | 2 | 11 | 1 | 145 | 39 |
| XI 10a Oscillations (most asked) | 0 | 17 | 1 | 6 | 19 | 17 | 1 | 11 | 1 | 154 | 36 |
| XI 10b Waves (most asked) | 0 | 21 | 3 | 4 | 84 | 22 | 4 | 20 | 1 | 200 | 64 |
| XII 1a Electric Charges and Fields (most asked) | 0 | 42 | 4 | 12 | 101 | 45 | 7 | 27 | 1 | 200 | 76 |
| XII 1b Electrostatic Potential, Potential Energy and Capacitance (most asked) | 0 | 32 | 5 | 11 | 95 | 32 | 5 | 24 | 1 | 200 | 67 |
| XII 2a Conduction, Ohm's law and power (most asked) | 0 | 28 | 4 | 8 | 90 | 32 | 8 | 23 | 1 | 200 | 69 |
| XII 2b Cells, Kirchhoff's laws and bridges (most asked) | 0 | 30 | 4 | 8 | 86 | 31 | 5 | 22 | 1 | 200 | 60 |
| XII 3a Moving charges and magnetism (most asked) | 0 | 46 | 7 | 15 | 104 | 46 | 7 | 30 | 1 | 200 | 76 |
| XII 3b Magnetism and Matter (most asked) | 0 | 15 | 0 | 3 | 74 | 15 | 0 | 15 | 1 | 64 | 94 |
| XII 4a Electromagnetic Induction (most asked) | 0 | 29 | 3 | 7 | 82 | 29 | 3 | 22 | 1 | 200 | 56 |
| XII 4b Alternating Current (most asked) | 0 | 32 | 4 | 9 | 105 | 32 | 4 | 23 | 1 | 200 | 69 |
| XII 5a Electromagnetic Waves (most asked) | 0 | 15 | 0 | 4 | 84 | 15 | 0 | 15 | 1 | 86 | 79 |
| XII 6a Ray Optics (most asked) | 0 | 45 | 6 | 15 | 133 | 46 | 7 | 31 | 1 | 200 | 87 |
| XII 6b Optical instruments (most asked) | 0 | 24 | 1 | 5 | 74 | 24 | 1 | 17 | 1 | 148 | 59 |
| XII 6c Wave Optics (most asked) | 0 | 32 | 3 | 10 | 89 | 32 | 3 | 24 | 1 | 200 | 67 |
| XII 6p Paper II: ray optics experiments (most asked) | 0 | 7 | 0 | 0 | 18 | 7 | 0 | 6 | 1 | 17 | 69 |
| XII 7a Dual Nature of Radiation and Matter (most asked) | 0 | 28 | 4 | 9 | 87 | 30 | 6 | 23 | 1 | 200 | 66 |
| XII 8a Atoms (most asked) | 0 | 27 | 1 | 7 | 86 | 27 | 1 | 19 | 1 | 91 | 59 |
| XII 8b Nuclei | 0 | 27 | 3 | 7 | 92 | 31 | 7 | 22 | 1 | 200 | 63 |
| XII 9a Semiconductor Electronics | 0 | 15 | 1 | 3 | 78 | 15 | 1 | 15 | 1 | 93 | 78 |
| XII 9b Semiconductor diode | 0 | 19 | 2 | 4 | 95 | 19 | 2 | 19 | 1 | 200 | 97 |

## Chemistry

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a Matter, laws and measurement | 0 | 7 | 0 | 1 | 15 | 7 | 0 | 6 | 1 | 13 | 75 |
| XI 1b Mole concept and stoichiometry | 0 | 10 | 2 | 4 | 17 | 10 | 1 | 9 | 1 | 101 | 23 |
| XI 1c Chemical equivalents and volumetric calculations | 0 | 11 | 3 | 3 | 40 | 11 | 3 | 11 | 1 | 200 | 88 |
| XI 2a Particles and atomic models | 0 | 10 | 4 | 3 | 16 | 10 | 4 | 9 | 1 | 45 | 39 |
| XI 2b Quantum numbers and electronic configuration | 0 | 9 | 0 | 4 | 18 | 9 | 0 | 8 | 1 | 168 | 24 |
| XI 3a Periodic law and periodic trends | 0 | 8 | 0 | 5 | 21 | 8 | 0 | 7 | 1 | 18 | 71 |
| XI 4a Ionic and covalent bonding | 0 | 10 | 1 | 10 | 20 | 10 | 1 | 9 | 1 | 43 | 33 |
| XI 4b VSEPR, hybridisation and molecular orbitals | 0 | 13 | 1 | 32 | 18 | 13 | 1 | 12 | 1 | 200 | 35 |
| XI 5a Systems and the First Law | 0 | 13 | 3 | 5 | 17 | 13 | 3 | 10 | 1 | 189 | 27 |
| XI 5b Second and Third Laws | 0 | 9 | 2 | 2 | 16 | 9 | 2 | 8 | 1 | 113 | 24 |
| XI 6a Chemical Equilibrium | 0 | 11 | 0 | 4 | 17 | 11 | 0 | 7 | 1 | 17 | 72 |
| XI 6b Ionic equilibrium | 0 | 20 | 4 | 6 | 75 | 20 | 4 | 18 | 1 | 200 | 57 |
| XI 7a Redox Reactions | 0 | 10 | 0 | 4 | 18 | 10 | 0 | 9 | 1 | 159 | 35 |
| XI 8a Classification, nomenclature and isomerism | 0 | 8 | 0 | 2 | 17 | 8 | 0 | 7 | 1 | 122 | 22 |
| XI 8b Purification and analysis | 0 | 5 | 0 | 1 | 15 | 5 | 0 | 5 | 1 | 15 | 85 |
| XI 8c Electronic effects and reaction types | 0 | 7 | 0 | 8 | 19 | 7 | 0 | 6 | 1 | 16 | 75 |
| XI 9a Alkanes | 0 | 7 | 0 | 1 | 16 | 7 | 0 | 6 | 1 | 14 | 72 |
| XI 9b Alkenes | 0 | 8 | 0 | 2 | 17 | 8 | 0 | 7 | 1 | 18 | 74 |
| XI 9c Alkynes | 0 | 5 | 0 | 3 | 15 | 5 | 0 | 5 | 1 | 15 | 79 |
| XI 9d Aromatic Hydrocarbons | 0 | 7 | 0 | 3 | 16 | 7 | 0 | 7 | 1 | 16 | 90 |
| XI 10a Titration | 0 | 6 | 0 | 0 | 16 | 6 | 0 | 6 | 1 | 16 | 85 |
| XI 10b Qualitative analysis | 0 | 5 | 0 | 0 | 18 | 5 | 0 | 4 | 1 | 17 | 54 |
| XI 10c Preparation of inorganic compounds | 0 | 4 | 0 | 0 | 15 | 4 | 0 | 3 | 1 | 14 | 56 |
| XI 10d Paper Chromatography | 0 | 5 | 0 | 0 | 16 | 5 | 0 | 5 | 1 | 13 | 86 |
| XII 1a Solutions and colligative properties | 0 | 35 | 6 | 12 | 156 | 36 | 7 | 27 | 1 | 200 | 72 |
| XII 2a Cells and potentials | 0 | 26 | 3 | 6 | 74 | 26 | 3 | 21 | 1 | 200 | 65 |
| XII 2b Conductance and electrolysis | 0 | 17 | 3 | 4 | 73 | 18 | 4 | 17 | 1 | 200 | 94 |
| XII 2c Batteries and corrosion | 0 | 8 | 0 | 2 | 18 | 8 | 0 | 8 | 1 | 18 | 93 |
| XII 3a Rate, order and integrated rate equations | 0 | 33 | 4 | 9 | 94 | 33 | 4 | 25 | 1 | 200 | 62 |
| XII 3b Collision theory and activation energy | 0 | 10 | 1 | 2 | 19 | 10 | 1 | 9 | 1 | 166 | 25 |
| XII 4a Transition elements, lanthanoids and actinoids | 0 | 19 | 0 | 4 | 89 | 19 | 0 | 18 | 1 | 112 | 69 |
| XII 4b K2Cr2O7 and KMnO4 | 0 | 15 | 0 | 3 | 87 | 15 | 0 | 15 | 1 | 89 | 84 |
| XII 5a Coordination Compounds | 0 | 22 | 0 | 21 | 134 | 22 | 0 | 22 | 1 | 181 | 96 |
| XII 6a Haloalkanes | 0 | 17 | 0 | 4 | 102 | 17 | 0 | 17 | 1 | 170 | 97 |
| XII 6b Haloarenes | 0 | 14 | 0 | 3 | 42 | 14 | 0 | 13 | 1 | 39 | 66 |
| XII 6c Polyhalogen compounds | 0 | 5 | 0 | 1 | 15 | 5 | 0 | 5 | 1 | 15 | 90 |
| XII 7a Alcohols | 0 | 19 | 0 | 3 | 80 | 19 | 0 | 19 | 1 | 117 | 83 |
| XII 7b Phenols | 0 | 15 | 0 | 4 | 70 | 15 | 0 | 15 | 1 | 74 | 94 |
| XII 7c Ethers | 0 | 16 | 0 | 2 | 41 | 16 | 0 | 14 | 1 | 42 | 63 |
| XII 8a Aldehydes and Ketones | 0 | 19 | 0 | 6 | 98 | 19 | 0 | 19 | 1 | 200 | 86 |
| XII 8b Carboxylic Acids | 0 | 12 | 0 | 3 | 19 | 12 | 0 | 12 | 1 | 42 | 75 |
| XII 9a Aliphatic Amines and Aniline | 0 | 16 | 0 | 7 | 89 | 16 | 0 | 16 | 1 | 105 | 94 |
| XII 9b Cyanides and Isocyanides | 0 | 8 | 0 | 1 | 15 | 8 | 0 | 8 | 1 | 19 | 93 |
| XII 9c Diazonium salts | 0 | 13 | 0 | 2 | 40 | 13 | 0 | 13 | 1 | 46 | 82 |
| XII 10a Carbohydrates | 0 | 13 | 0 | 3 | 75 | 13 | 0 | 13 | 1 | 67 | 94 |
| XII 10b Proteins | 0 | 16 | 0 | 2 | 83 | 16 | 0 | 16 | 1 | 80 | 92 |
| XII 10c Vitamins | 0 | 7 | 0 | 1 | 18 | 7 | 0 | 6 | 1 | 17 | 65 |
| XII 10d Nucleic Acids | 0 | 12 | 0 | 2 | 54 | 12 | 0 | 11 | 1 | 45 | 61 |
| XII 11a Titrations | 0 | 6 | 0 | 0 | 17 | 6 | 0 | 5 | 1 | 16 | 64 |
| XII 11b Rate of reaction, pH and cells | 0 | 5 | 0 | 0 | 17 | 5 | 0 | 4 | 1 | 16 | 60 |
| XII 11c Identifying compounds and functional groups | 0 | 5 | 0 | 0 | 17 | 5 | 0 | 4 | 1 | 16 | 52 |
| XII 11d Qualitative analysis | 0 | 3 | 0 | 0 | 15 | 3 | 0 | 2 | 1 | 13 | 50 |

## Mathematics

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a Sets | 0 | 12 | 1 | 4 | 44 | 14 | 3 | 12 | 1 | 200 | 79 |
| XI 1b Relations & Functions | 0 | 10 | 0 | 2 | 46 | 10 | 0 | 10 | 1 | 200 | 89 |
| XI 1c Trigonometry | 0 | 14 | 2 | 8 | 56 | 14 | 2 | 13 | 1 | 200 | 48 |
| XI 2a Complex Numbers | 0 | 11 | 1 | 6 | 15 | 11 | 1 | 10 | 1 | 200 | 28 |
| XI 2b Quadratic Equations | 0 | 9 | 2 | 3 | 17 | 9 | 2 | 9 | 1 | 200 | 80 |
| XI 2c Permutations and Combinations | 0 | 17 | 3 | 7 | 15 | 24 | 10 | 12 | 1 | 95 | 51 |
| XI 2d Binomial Theorem | 0 | 9 | 1 | 4 | 16 | 9 | 1 | 8 | 1 | 74 | 25 |
| XI 2e Sequence and Series | 0 | 19 | 4 | 8 | 18 | 19 | 4 | 14 | 1 | 200 | 37 |
| XI 3a Straight Lines | 0 | 15 | 2 | 6 | 40 | 15 | 2 | 13 | 1 | 200 | 38 |
| XI 3b Circles | 0 | 11 | 1 | 3 | 42 | 11 | 1 | 11 | 1 | 200 | 84 |
| XI 3c Conic Section | 0 | 13 | 2 | 2 | 48 | 13 | 2 | 13 | 1 | 69 | 90 |
| XI 3d Introduction to three-dimensional Geometry | 0 | 7 | 2 | 2 | 16 | 7 | 2 | 7 | 1 | 200 | 69 |
| XI 4a Limits and Derivatives | 0 | 19 | 3 | 11 | 16 | 19 | 3 | 15 | 1 | 200 | 40 |
| XI 5a Statistics | 0 | 10 | 3 | 4 | 16 | 13 | 6 | 10 | 1 | 200 | 81 |
| XI 5b Probability | 0 | 9 | 2 | 4 | 40 | 13 | 6 | 9 | 1 | 61 | 92 |
| XII 1a Types of relations and functions | 0 | 17 | 1 | 6 | 60 | 17 | 1 | 17 | 1 | 200 | 96 |
| XII 1b Inverse Trigonometric Functions | 0 | 13 | 1 | 5 | 47 | 13 | 1 | 13 | 1 | 200 | 89 |
| XII 2a Matrices | 0 | 18 | 1 | 7 | 48 | 18 | 1 | 16 | 1 | 200 | 44 |
| XII 2b Determinants | 0 | 20 | 3 | 7 | 46 | 20 | 3 | 19 | 1 | 200 | 49 |
| XII 3a Continuity, Differentiability and Differentiation | 0 | 20 | 3 | 11 | 47 | 20 | 3 | 17 | 1 | 200 | 46 |
| XII 3b Applications of Derivatives | 0 | 27 | 7 | 10 | 49 | 31 | 11 | 24 | 1 | 200 | 65 |
| XII 3c Integrals | 0 | 18 | 1 | 11 | 47 | 18 | 1 | 15 | 1 | 200 | 49 |
| XII 3d Application of Integrals | 0 | 15 | 3 | 4 | 40 | 15 | 3 | 12 | 1 | 60 | 47 |
| XII 3e Differential Equations | 0 | 16 | 4 | 6 | 45 | 17 | 5 | 15 | 1 | 200 | 43 |
| XII 4a Vector Algebra | 0 | 23 | 6 | 8 | 60 | 23 | 6 | 21 | 1 | 200 | 59 |
| XII 5a Three-dimensional Geometry | 0 | 18 | 4 | 8 | 47 | 19 | 4 | 15 | 1 | 200 | 50 |
| XII 6a Linear Programming | 0 | 14 | 3 | 4 | 50 | 16 | 5 | 15 | 1 | 200 | 88 |
| XII 7a Probability | 0 | 31 | 8 | 11 | 65 | 36 | 13 | 26 | 1 | 200 | 73 |

## Computer Science

| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a System of Numeration | 0 | 15 | 1 | 5 | 52 | 15 | 1 | 15 | 1 | 200 | 89 |
| XI 2a Encodings | 0 | 10 | 0 | 3 | 48 | 10 | 0 | 10 | 1 | 165 | 86 |
| XI 3a Propositional logic | 0 | 9 | 0 | 3 | 40 | 9 | 0 | 9 | 1 | 45 | 91 |
| XI 3b Logic and hardware | 0 | 7 | 0 | 2 | 16 | 7 | 0 | 7 | 1 | 36 | 59 |
| XI 4a Introduction | 0 | 6 | 0 | 1 | 16 | 6 | 0 | 6 | 1 | 15 | 88 |
| XI 5a Objects and the JVM | 0 | 9 | 0 | 1 | 48 | 9 | 0 | 9 | 1 | 75 | 85 |
| XI 5b Errors and exceptions | 0 | 6 | 0 | 2 | 16 | 6 | 0 | 6 | 1 | 16 | 87 |
| XI 6a Primitive values, Wrapper classes, Types and casting | 0 | 12 | 0 | 4 | 54 | 12 | 0 | 12 | 1 | 200 | 89 |
| XI 7a Variables, Expressions | 0 | 13 | 0 | 3 | 60 | 13 | 0 | 13 | 1 | 200 | 92 |
| XI 8a Statements, Scope | 0 | 18 | 0 | 4 | 58 | 18 | 0 | 18 | 1 | 200 | 96 |
| XI 9a Methods and Constructors | 0 | 13 | 0 | 3 | 50 | 13 | 0 | 13 | 1 | 117 | 94 |
| XI 10a Arrays, Strings | 0 | 10 | 0 | 4 | 15 | 10 | 0 | 10 | 1 | 200 | 82 |
| XI 11a Basic input/output using Scanner class | 0 | 4 | 0 | 1 | 16 | 4 | 0 | 4 | 1 | 16 | 87 |
| XI 11b Data File Handling | 0 | 6 | 0 | 1 | 17 | 6 | 0 | 6 | 1 | 17 | 83 |
| XI 12a Introduction to Python | 0 | 8 | 0 | 5 | 17 | 8 | 0 | 8 | 1 | 200 | 64 |
| XI 13a Trends in computing and ethical issues | 0 | 7 | 0 | 3 | 20 | 7 | 0 | 7 | 1 | 19 | 94 |
| XII 1a Propositional logic | 0 | 11 | 0 | 3 | 48 | 11 | 0 | 11 | 1 | 72 | 93 |
| XII 1b Boolean algebra and Karnaugh maps | 0 | 26 | 0 | 9 | 72 | 26 | 0 | 21 | 1 | 200 | 63 |
| XII 2a Logic gates | 0 | 11 | 0 | 2 | 54 | 11 | 0 | 11 | 1 | 82 | 87 |
| XII 2b Applications | 0 | 12 | 0 | 4 | 63 | 12 | 0 | 11 | 1 | 65 | 57 |
| XII 3a Methods | 0 | 15 | 0 | 5 | 67 | 15 | 0 | 15 | 1 | 200 | 92 |
| XII 4a Arrays | 0 | 18 | 2 | 7 | 52 | 19 | 3 | 18 | 1 | 200 | 91 |
| XII 4b String handling | 0 | 12 | 0 | 4 | 45 | 12 | 0 | 12 | 1 | 186 | 71 |
| XII 5a Recursion | 0 | 13 | 0 | 5 | 40 | 13 | 0 | 13 | 1 | 200 | 89 |
| XII 6a Inheritance | 0 | 24 | 0 | 2 | 57 | 24 | 0 | 24 | 1 | 200 | 89 |
| XII 6b Interfaces in Java (Only Conceptual) | 0 | 17 | 0 | 2 | 48 | 17 | 0 | 17 | 1 | 132 | 93 |
| XII 7a Strings | 0 | 6 | 0 | 2 | 15 | 6 | 0 | 6 | 1 | 200 | 56 |
| XII 7b Lists | 0 | 7 | 0 | 2 | 15 | 7 | 0 | 7 | 1 | 200 | 65 |
| XII 7c Tuples | 0 | 7 | 0 | 1 | 15 | 7 | 0 | 7 | 1 | 200 | 52 |
| XII 8a Binary trees [Conceptual] | 0 | 15 | 0 | 4 | 56 | 15 | 0 | 15 | 1 | 199 | 91 |
| XII 9a Complexity and Big O notation | 0 | 11 | 0 | 4 | 51 | 11 | 0 | 11 | 1 | 86 | 88 |

Took 55 s.
