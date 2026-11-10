# Generated question quality

How the questions from `src/data/blueprints/` were checked: by machine for every blueprint, and by reading a sample as a teacher would. This file holds no wording from any paper.

**In short:** every blueprint passes 1,000 generated instances. Nothing generated is too close to a paper. Reading 65 questions per subject found real problems that the machines couldn't, and each was fixed. Read "What is still weak" before relying on these for a real exam.

## Automated checks

### 1,000 instances per blueprint

`tests/unit/blueprints.test.ts` generates 1,000 instances of each of the 1,484 blueprints, which is about 1.5 million questions in about 15 seconds. To be sure the loop does what it says, three blueprints were timed separately, and each gave 1,000 distinct questions. Every instance must pass:

| Check | How |
|---|---|
| Answers are finite and in range | The engine rejects impossible values and draws again: negative mass or length, speed above c, probability above 1, pH outside the possible range |
| Dimensionally consistent | Each numerical is solved by the solver registry, and its dimensions are checked against the entry |
| MCQs | Exactly one correct option, no repeats, none blank |
| Marks add up | Parts and marking points total the marks of the question |
| Seeds reproduce | The same seed gives the same question, byte for byte |
| No broken text | No `NaN`, `undefined` or unfilled value |
| Java output | The program really runs in the tracer, and `tests/unit/python-answers.test.ts` runs the Python ones in real Python |
| Boolean answers | Computed by Quine–McCluskey, and the cover is checked against the function |
| Chemistry equations | `tests/unit/chemistry-equations.test.ts` counts atoms and charge on both sides of each one |

### Novelty against the papers

`tests/unit/novelty-private.test.ts` needs the private papers, so it runs only on a machine that has them, and only when asked: `NOVELTY_SAMPLES=500 npx vitest run tests/unit/novelty-private.test.ts`.

It generated **742,000 questions** (500 per blueprint), which gave **50,293 distinct pieces of wording** (questions and MCQ options, with code and LaTeX left out). Each was compared with the text of all 118 private files, in two ways:

- **A run of words:** ten or more words in a row that a paper also has. Runs of nothing but single letters and numbers, like the terms of a Boolean function, are ignored.
- **Similarity to one question:** the share of the generated question's five-word runs that appear in any single paper question. At 60% or more, with at least 12 words, it's flagged as too close.

**Final result: nothing flagged.** How similar the wording is to the closest paper question:

| Share of five-word runs found in one paper question | Pieces of wording | |
|---:|---:|---|
| Under 10% | 45,301 | 90.1% |
| 10 to 20% | 2,873 | 5.7% |
| 20 to 30% | 2,037 | 4.1% |
| 30 to 40% | 66 | 0.1% |
| 40 to 50% | 15 | under 0.1% |
| 50 to 60% | 1 | under 0.1% |
| 60% or more (too close) | 0 | 0 |

The highest are short stock questions, like a recall question on order of reaction, where there are few ways to ask it.

**The first runs flagged 9 blueprints, and all were reworded:** `k12-1b-minterm`, `k12-2b-explain2`, `k12-1b-kmap4` and `k12-1b-section-a` (which share a Karnaugh map question's wording), `m12-7a-weather-plan`, `m12-2b-det-scale`, `m12-5a-plane-distance`, `p12-6b-compare2`, and `c12-7a-long3`. None was a copied question. Each was a stock phrase that happened to run long enough to be caught, and they were reworded anyway so that the check can stay strict.

The build has its own check as well. `scripts/check-private.mjs` runs after each build and looks for 15-word runs from the papers in everything shipped. It caught the default paper instructions in the teacher's screen, which had drifted too close to the wording on real papers. They were rewritten.

## Spot check, read as a teacher

40 questions per subject, spread evenly across each subject's blueprints, were read along with their answers, working or marking points, and judged as a teacher would: is it correct, clear, realistic and in ISC style? A second, independent sample of 25 per subject was read after the first round of fixes. The new blueprints added for coverage were all read too.

A spread of the numericals in the samples was also worked by hand, and those all agreed. The problems found were in wording, realism and choice of content, not in the arithmetic.

### Physics: 65 read

| Blueprint | Problem | Fix |
|---|---|---|
| `p12-7a-photon-rate` | Photons per second shown in Hz | Shown in s⁻¹ |
| `p12-6a-critical-angle` and other angles | A space before the degree sign: "28.4 °" | Removed |
| Every "distinguish" blueprint | Answer labels started in lower case | Capitalised |
| `p12-2a-energy-bill` | States a cost per unit, and never asks about it | Removed the cost |
| `p12-6c-fringe-water` | Awkward wording, and a value worked out but not used | Reworded and removed |
| `p11-3a-f-ma`, `p11-3b-friction-block` | Realistic numbers, but a 2 kg box accelerating at over 30 m/s² isn't | Masses and forces brought into a realistic range |
| `p11-2b-vectors-resultant` | Said forces in newtons, and answered in m/s | Rewritten as velocities |
| `p12-8a-bohr-energy` figure | Figure showed level energies the question hadn't given | Levels now show n only |

### Chemistry: 65 read

| Blueprint | Problem | Fix |
|---|---|---|
| `c11-5a-expansion-work` | Asked for "a magnitude", and gave a negative answer | Asks for the work done on the gas, which is negative here |
| `c11-1b-empirical` | Had an invented name ("urea-free methane") and an awkward case | Replaced with named real compounds |
| `c11-6b-ph-mcq` and pH numericals | Printed as "10⁻2" | Set as a proper power of ten |
| `c12-4b-oxidant-equations`, `c12-4a-transition-equations` | "iron(ii)": Roman numerals lower-cased by the code | Written correctly by hand |
| `c12-7a-long3` | Wording flagged by the novelty check | Reworded |

### Mathematics: 65 read

| Blueprint | Problem | Fix |
|---|---|---|
| `m12-1a-count-relations` | "Doubled it" and "halved it" as distractors, which aren't real mistakes. One option in scientific notation beside whole numbers | Replaced with a real slip (2 to the power 2n) |
| `m12-5a-plane-through` | Final answer not reduced, with odd wording ("proportional to") | Reduced to lowest terms |
| `m12-3c-partial-fractions` | Printed a factor of 1/1 | Left out when it's 1 |
| `m12-6a-cbq-diet-lp` | A linear programme with one constraint isn't worth four marks | Rebuilt with two constraints and four corners, from a known crossing point |
| `m11-2c-cbq-password` | Counts shown in scientific notation | Shown exactly |
| `m12-3d-cbq-garden-area` | Area as a decimal, when a fraction is right | Shown as a fraction |

### Computer Science: 65 read

| Blueprint | Problem | Fix |
|---|---|---|
| **Stacks and queues** | Blueprints, definitions and two CBQs were on stacks and queues, which **aren't in the 2028 syllabus**, though they appear in papers up to 2025 | All removed. Replaced with interface questions, the actual topic 6(b), and with binary tree CBQs |
| `k11-1a-convert-mcq` | Distractors were the right answer plus or minus a little, which isn't a real mistake | Now from real slips: remainders read the wrong way, a digit left out, place values ignored |
| `k12-1a-contrapositive` | "if it isn't so that the alarm rings" | Written as real negatives |

### Word export, found while reading

"Name the compound drawn here" lost its drawing in the Word file, which left the question unanswerable. It's now drawn, including when figures are switched off, because the question can't be asked without it. Square roots, Greek letters and powers also read better there: `x^(2x)` instead of `x^2x`.

## What is still weak

- **Theory questions have a limited pool.** A "define" or "give a reason" blueprint picks from the few facts written for that topic, so the same question comes back much sooner than a numerical would. It's a seeded choice from a list, not a new question. Numericals, Maths and Java are where "completely new" really holds. In the 742,000 samples, 744 of the 1,484 blueprints are theory, and they account for most of the repeats.
- **Assertion and reason pairs can feel unrelated.** A false or unrelated reason is taken from the same topic, so the logic is right, but the pair can read as artificial, in a way a person writing one by hand would avoid.
- **Self-marked answers.** Theory, derivations and programs are marked by the student against the marking points. There's no way to check the wording of an answer offline.
- **The analysis is automatic.** Types and topics come from rules, checked by sampling. See `reports/question-analysis.md` for its limits.
- **The facts are written by me, not checked against a textbook line by line.** Every blueprint has now been read as a teacher would (see Task 2 below), with sample instances, but a reading can still miss a mistake.
- **One MCQ has fewer than four options,** `k12-2a-gate-output`, as a gate’s output can only be 0 or 1.
- **Some content in the registry is beyond the usual ISC level,** because it’s in the formula book. No question asks for reduced mass now.
- **No questions on the practical papers.** Those 11 files are set as experiments or programming tasks, and were recorded but not turned into blueprints.

## Reporting a problem

Each generated question has a "Report a problem" action, which saves the question, its seed and your comment on this device. Progress has a button to export them all as a file. Those reports, and the blueprint id in each, are the fastest way to fix a question.

<!-- fact-counts -->
## The knowledge base, before and after Task 6

Facts are the rows a topic’s questions are made from: definitions, recall questions, true and false statements, reasons, comparisons, explanations, long answers, cases, diagrams and assertion–reason concepts. In all: 2,453 before and 6,724 after. The 20 most-asked topics in each subject needed at least three times their facts, and at least 40; every other syllabus topic needed at least 15. Links between facts, for assertion–reason and “distinguish between” pairs, aren’t counted here.

### Physics

| Topic | Parts asked in the papers | Facts before | Facts after | Needed |
|---|---:|---:|---:|---:|
| XI 1a Units and Measurements | 2 | 16 | 16 | 15 |
| XI 1b Dimensions | 2 | 14 | 16 | 15 |
| XI 1p Paper II: measuring instruments | 0 | 0 | 15 | 15 |
| XI 2a Motion in a Straight Line (most asked) | 6 | 19 | 67 | 57 |
| XI 2b Motion in a Plane | 3 | 18 | 18 | 15 |
| XI 3a Newton's laws and momentum | 5 | 21 | 21 | 15 |
| XI 3b Equilibrium and friction | 0 | 18 | 18 | 15 |
| XI 3c Circular motion | 0 | 14 | 15 | 15 |
| XI 4a Work, energy and power (most asked) | 8 | 18 | 71 | 54 |
| XI 4b Collisions | 0 | 14 | 15 | 15 |
| XI 5a Centre of mass | 2 | 11 | 15 | 15 |
| XI 5b Torque and angular momentum | 0 | 15 | 15 | 15 |
| XI 5c Moment of inertia | 1 | 13 | 15 | 15 |
| XI 6a Gravity and its variation | 2 | 16 | 16 | 15 |
| XI 6b Potential, escape velocity and satellites | 1 | 18 | 18 | 15 |
| XI 7a Mechanical Properties of Solids | 3 | 16 | 16 | 15 |
| XI 7b Mechanical Properties of Fluids | 1 | 20 | 20 | 15 |
| XI 7c Surface tension | 3 | 15 | 15 | 15 |
| XI 8a Thermal Properties of Matter | 1 | 19 | 19 | 15 |
| XI 8b Thermodynamics | 3 | 20 | 20 | 15 |
| XI 9a Kinetic Theory | 1 | 17 | 17 | 15 |
| XI 10a Oscillations | 1 | 18 | 18 | 15 |
| XI 10b Waves (most asked) | 12 | 22 | 92 | 66 |
| XII 1a Electric Charges and Fields (most asked) | 66 | 32 | 101 | 96 |
| XII 1b Electrostatic Potential, Potential Energy and Capacitance (most asked) | 74 | 27 | 95 | 81 |
| XII 2a Conduction, Ohm's law and power (most asked) | 74 | 27 | 90 | 81 |
| XII 2b Cells, Kirchhoff's laws and bridges (most asked) | 97 | 25 | 86 | 75 |
| XII 3a Moving charges and magnetism (most asked) | 144 | 30 | 104 | 90 |
| XII 3b Magnetism and Matter (most asked) | 22 | 20 | 83 | 60 |
| XII 4a Electromagnetic Induction (most asked) | 24 | 23 | 90 | 69 |
| XII 4b Alternating Current (most asked) | 121 | 30 | 105 | 90 |
| XII 5a Electromagnetic Waves (most asked) | 37 | 20 | 84 | 60 |
| XII 6a Ray Optics (most asked) | 117 | 37 | 137 | 111 |
| XII 6b Optical instruments (most asked) | 39 | 20 | 74 | 60 |
| XII 6c Wave Optics (most asked) | 67 | 28 | 93 | 84 |
| XII 6p Paper II: ray optics experiments | 0 | 0 | 17 | 15 |
| XII 7a Dual Nature of Radiation and Matter (most asked) | 68 | 24 | 87 | 72 |
| XII 8a Atoms (most asked) | 52 | 22 | 87 | 66 |
| XII 8b Nuclei (most asked) | 61 | 28 | 100 | 84 |
| XII 9a Semiconductor Electronics (most asked) | 27 | 19 | 79 | 57 |
| XII 9b Semiconductor diode (most asked) | 70 | 26 | 99 | 78 |

### Chemistry

| Topic | Parts asked in the papers | Facts before | Facts after | Needed |
|---|---:|---:|---:|---:|
| XI 1a Matter, laws and measurement | 2 | 14 | 15 | 15 |
| XI 1b Mole concept and stoichiometry | 8 | 15 | 15 | 15 |
| XI 1c Chemical equivalents and volumetric calculations (most asked) | 11 | 13 | 42 | 40 |
| XI 2a Particles and atomic models | 3 | 14 | 15 | 15 |
| XI 2b Quantum numbers and electronic configuration | 7 | 18 | 18 | 15 |
| XI 3a Periodic law and periodic trends | 3 | 20 | 20 | 15 |
| XI 4a Ionic and covalent bonding | 5 | 19 | 19 | 15 |
| XI 4b VSEPR, hybridisation and molecular orbitals | 6 | 17 | 17 | 15 |
| XI 5a Systems and the First Law | 0 | 16 | 16 | 15 |
| XI 5b Second and Third Laws | 5 | 14 | 15 | 15 |
| XI 6a Chemical Equilibrium | 2 | 16 | 16 | 15 |
| XI 6b Ionic equilibrium (most asked) | 19 | 19 | 76 | 57 |
| XI 7a Redox Reactions | 4 | 17 | 17 | 15 |
| XI 8a Classification, nomenclature and isomerism | 11 | 16 | 16 | 15 |
| XI 8b Purification and analysis | 1 | 13 | 15 | 15 |
| XI 8c Electronic effects and reaction types | 1 | 18 | 18 | 15 |
| XI 9a Alkanes | 1 | 13 | 15 | 15 |
| XI 9b Alkenes | 6 | 14 | 15 | 15 |
| XI 9c Alkynes | 0 | 12 | 15 | 15 |
| XI 9d Aromatic Hydrocarbons | 0 | 15 | 15 | 15 |
| XI 10a Titration | 1 | 10 | 15 | 15 |
| XI 10b Qualitative analysis | 0 | 0 | 17 | 15 |
| XI 10c Preparation of inorganic compounds | 0 | 0 | 15 | 15 |
| XI 10d Paper Chromatography | 0 | 0 | 15 | 15 |
| XII 1a Solutions and colligative properties (most asked) | 165 | 40 | 156 | 120 |
| XII 2a Cells and potentials (most asked) | 49 | 21 | 74 | 63 |
| XII 2b Conductance and electrolysis (most asked) | 54 | 19 | 73 | 57 |
| XII 2c Batteries and corrosion | 8 | 17 | 17 | 15 |
| XII 3a Rate, order and integrated rate equations (most asked) | 118 | 26 | 94 | 78 |
| XII 3b Collision theory and activation energy | 9 | 18 | 18 | 15 |
| XII 4a Transition elements, lanthanoids and actinoids (most asked) | 66 | 22 | 89 | 66 |
| XII 4b K2Cr2O7 and KMnO4 (most asked) | 30 | 21 | 87 | 63 |
| XII 5a Coordination Compounds (most asked) | 79 | 32 | 134 | 96 |
| XII 6a Haloalkanes (most asked) | 80 | 23 | 102 | 69 |
| XII 6b Haloarenes (most asked) | 21 | 14 | 52 | 42 |
| XII 6c Polyhalogen compounds | 1 | 14 | 15 | 15 |
| XII 7a Alcohols (most asked) | 82 | 21 | 80 | 63 |
| XII 7b Phenols (most asked) | 39 | 18 | 70 | 54 |
| XII 7c Ethers (most asked) | 15 | 13 | 50 | 40 |
| XII 8a Aldehydes and Ketones (most asked) | 48 | 26 | 101 | 78 |
| XII 8b Carboxylic Acids | 11 | 19 | 19 | 15 |
| XII 9a Aliphatic Amines and Aniline (most asked) | 32 | 23 | 89 | 69 |
| XII 9b Cyanides and Isocyanides | 9 | 14 | 15 | 15 |
| XII 9c Diazonium salts (most asked) | 19 | 13 | 48 | 40 |
| XII 10a Carbohydrates (most asked) | 15 | 23 | 89 | 69 |
| XII 10b Proteins (most asked) | 24 | 22 | 86 | 66 |
| XII 10c Vitamins | 10 | 16 | 16 | 15 |
| XII 10d Nucleic Acids (most asked) | 17 | 18 | 62 | 54 |
| XII 11a Titrations | 3 | 0 | 16 | 15 |
| XII 11b Rate of reaction, pH and cells | 0 | 0 | 16 | 15 |
| XII 11c Identifying compounds and functional groups | 5 | 0 | 16 | 15 |
| XII 11d Qualitative analysis | 0 | 0 | 15 | 15 |

### Mathematics

| Topic | Parts asked in the papers | Facts before | Facts after | Needed |
|---|---:|---:|---:|---:|
| XI 1a Sets (most asked) | 14 | 14 | 49 | 42 |
| XI 1b Relations & Functions (most asked) | 30 | 13 | 46 | 40 |
| XI 1c Trigonometry (most asked) | 114 | 14 | 56 | 42 |
| XI 2a Complex Numbers | 4 | 12 | 15 | 15 |
| XI 2b Quadratic Equations | 6 | 10 | 15 | 15 |
| XI 2c Permutations and Combinations | 8 | 13 | 15 | 15 |
| XI 2d Binomial Theorem | 3 | 10 | 15 | 15 |
| XI 2e Sequence and Series | 8 | 13 | 15 | 15 |
| XI 3a Straight Lines (most asked) | 9 | 10 | 40 | 40 |
| XI 3b Circles (most asked) | 9 | 9 | 43 | 40 |
| XI 3c Conic Section (most asked) | 14 | 14 | 50 | 42 |
| XI 3d Introduction to three-dimensional Geometry | 4 | 9 | 15 | 15 |
| XI 4a Limits and Derivatives | 6 | 14 | 15 | 15 |
| XI 5a Statistics | 4 | 14 | 15 | 15 |
| XI 5b Probability (most asked) | 10 | 12 | 40 | 40 |
| XII 1a Types of relations and functions (most asked) | 53 | 17 | 60 | 51 |
| XII 1b Inverse Trigonometric Functions (most asked) | 45 | 13 | 47 | 40 |
| XII 2a Matrices (most asked) | 44 | 13 | 48 | 40 |
| XII 2b Determinants (most asked) | 51 | 14 | 46 | 42 |
| XII 3a Continuity, Differentiability and Differentiation (most asked) | 44 | 14 | 49 | 42 |
| XII 3b Applications of Derivatives (most asked) | 146 | 13 | 49 | 40 |
| XII 3c Integrals (most asked) | 104 | 12 | 47 | 40 |
| XII 3d Application of Integrals (most asked) | 28 | 9 | 40 | 40 |
| XII 3e Differential Equations (most asked) | 51 | 13 | 45 | 40 |
| XII 4a Vector Algebra (most asked) | 77 | 15 | 60 | 45 |
| XII 5a Three-dimensional Geometry (most asked) | 56 | 13 | 47 | 40 |
| XII 6a Linear Programming (most asked) | 28 | 14 | 50 | 42 |
| XII 7a Probability (most asked) | 137 | 19 | 67 | 57 |

### Computer Science

| Topic | Parts asked in the papers | Facts before | Facts after | Needed |
|---|---:|---:|---:|---:|
| XI 1a System of Numeration (most asked) | 19 | 15 | 56 | 45 |
| XI 2a Encodings (most asked) | 8 | 15 | 50 | 45 |
| XI 3a Propositional logic (most asked) | 12 | 12 | 44 | 40 |
| XI 3b Logic and hardware | 7 | 12 | 15 | 15 |
| XI 4a Introduction | 0 | 15 | 15 | 15 |
| XI 5a Objects and the JVM (most asked) | 19 | 11 | 52 | 40 |
| XI 5b Errors and exceptions | 6 | 15 | 15 | 15 |
| XI 6a Primitive values, Wrapper classes, Types and casting (most asked) | 15 | 17 | 61 | 51 |
| XI 7a Variables, Expressions (most asked) | 26 | 16 | 60 | 48 |
| XI 8a Statements, Scope (most asked) | 46 | 16 | 58 | 48 |
| XI 9a Methods and Constructors (most asked) | 19 | 16 | 53 | 48 |
| XI 10a Arrays, Strings | 4 | 14 | 15 | 15 |
| XI 11a Basic input/output using Scanner class | 2 | 10 | 15 | 15 |
| XI 11b Data File Handling | 7 | 13 | 15 | 15 |
| XI 12a Introduction to Python | 5 | 16 | 16 | 15 |
| XI 13a Trends in computing and ethical issues | 5 | 19 | 19 | 15 |
| XII 1a Propositional logic (most asked) | 30 | 14 | 48 | 42 |
| XII 1b Boolean algebra and Karnaugh maps (most asked) | 216 | 20 | 72 | 60 |
| XII 2a Logic gates (most asked) | 38 | 15 | 54 | 45 |
| XII 2b Applications (most asked) | 20 | 21 | 66 | 63 |
| XII 3a Methods (most asked) | 121 | 21 | 67 | 63 |
| XII 4a Arrays (most asked) | 37 | 16 | 52 | 48 |
| XII 4b String handling (most asked) | 13 | 14 | 47 | 42 |
| XII 5a Recursion (most asked) | 13 | 13 | 42 | 40 |
| XII 6a Inheritance (most asked) | 14 | 18 | 62 | 54 |
| XII 6b Interfaces in Java (Only Conceptual) (most asked) | 13 | 16 | 48 | 48 |
| XII 7a Strings | 1 | 11 | 15 | 15 |
| XII 7b Lists | 0 | 12 | 15 | 15 |
| XII 7c Tuples | 0 | 11 | 15 | 15 |
| XII 8a Binary trees [Conceptual] (most asked) | 55 | 17 | 58 | 51 |
| XII 9a Complexity and Big O notation (most asked) | 20 | 16 | 55 | 48 |
<!-- /fact-counts -->

## Task 2: every blueprint reviewed, in batches

Each blueprint is read as an ISC teacher would: every fact correct and in the syllabus, the model answer complete and in marking-scheme style, the marks right, the wording clear, the values realistic, and the distractors plausible but definitely wrong. A few instances of each are generated and read, and for a blueprint made from a topic’s facts, every fact it can draw on is read. What can’t be confirmed from the syllabus is checked against a reliable reference. Batches go in order of how often their topic is asked in the papers.

There are 2,211 blueprints now, not 1,484: Tasks 3, 6 and 8 added derivations, linked assertion–reason and “distinguish” blueprints, and blueprints for new kinds of facts. 429 counted as reviewed from the start: the 321 derivation blueprints checked in Task 8, and the 108 assertion–reason blueprints Task 3 rebuilt and re-read, in the topics where Task 6 didn’t add new concepts. The earlier spot check read about 320 blueprints, but didn’t record which, so those are read again.

Each blueprint’s date and note are in `src/data/blueprints/reviews/`.

<!-- review-progress -->
| Batch | Topics | Blueprints reviewed | Problems found and fixed | Flagged | Reviewed so far, of 2,211 |
|---:|---|---:|---|---:|---:|
| 0 | Derivations (Task 8), assertion–reason (Task 3) | 429 | Checked in those tasks | 0 | 429 |
| 1 | CS XII 1b, Chemistry XII 1a | 41 | 11 blueprints fixed: two recall questions asked the same thing (K₂SO₄); a reason appeared twice; three assertion–reason “also true” lines in fact explained the assertion, or repeated another concept; a “saline” drip called a non-electrolyte, with a pressure far from blood’s; molalities up to 3 m for a dilute-solution formula; a K-map truth table’s rows numbered from 0 without saying so; a consensus step and a reason on Boolean algebra that didn’t explain | 0 | 470 |
| 2 | Maths XII 3b, Physics XII 3a | 46 | 14 blueprints fixed: every long answer that repeats a library derivation (38 of 51, across all subjects) now shares its fact, so a paper can’t ask both; a cyclotron concept, out of the syllabus, replaced; a second ammeter concept replaced with the voltmeter; two links that weren’t clearly cause and effect; a part label that gave away “attract”; a distractor explained as “worked out y” that left out the constant; a question that asked for a value it hadn’t mentioned; a roller coaster dipping to −130 m; a CBQ and a numerical that repeated other blueprints; a duplicated truth; and “stationary” where “critical” is right | 0 | 516 |
| 3 | Maths XII 7a, CS XII 3a, Physics XII 4b | 58 | 13 blueprints fixed: binomial distribution, not in the 2028 syllabus: two recall questions and an assertion–reason concept removed, and the “exactly r successes” numerical now worked from independent trials; a general fix: a “distinguish” pair made from two definitions now shares the fact of a written comparison of the same pair, so a paper doesn’t ask it twice; a repeated truth (the average of a sine wave), a repeated assertion–reason concept (largest current at resonance) and two “also true” lines that explain the assertion; a phase angle labelled “power factor angle” whose working said it “cannot be negative”; three links where the reason does explain, or that weren’t a natural pair; and an MCQ whose distractors couldn’t be overloaded at all | 0 | 574 |
| 4 | Chemistry XII 3a, Physics XII 6a | 49 | 14 blueprints fixed: scattering of light (blue sky, red sunset, white clouds, 1/λ⁴), not in the 2028 syllabus, removed; a lens magnification worked with the mirror formula m = −v/u, and a mirror’s with u’s sign dropped, both now in the Cartesian convention; a block with n = 2.7; four assertion–reason “also true” lines that explain the assertion; two links that were arguable; a repeated half-life concept; “four factors” answered with five; and two general bugs: numbers rounded down by floating point (0.001155 shown as 0.00115), and a choice of three numbers read as a range, which left eight blueprints always using one value | 0 | 623 |
| 5 | Maths XI 1c, Maths XII 3c, Physics XII 2b | 47 | 6 blueprints fixed: fewer problems: Physics XII cells and bridges, Maths XII integrals and Maths XI trigonometry were all correct in substance. Fixed: two near-repeats (a metre bridge’s best balance point, a potentiometer’s longer wire), an 8 V “car battery”, working printed as “+ 0x² + 1x”, and a pair to distinguish that isn’t one (a proper rational function and partial fractions) | 0 | 670 |
| 6 | Chemistry XII 7a, Chemistry XII 6a, Chemistry XII 5a | 58 | 12 blueprints fixed: IUPAC-name distractors that were the names of other complexes, which nobody would confuse, now come from real slips (the wrong oxidation state, -ate in a cation or missing in an anion, the wrong count); the dehydration mechanism asked twice in one topic; phenol among the alcohols to name; a truth said twice (the e_g set higher), and a false version that repeated another truth; [Cu(H₂O)₄]²⁺ for the hexaaqua ion; a tetrahedral “also true” line that gives the reason; two reasons said twice (Grignard reagents and water, ethanol in water); distractors like “better sight”; and fermentation and esterification as a pair to distinguish | 0 | 728 |
| 7 | Maths XII 4a, Physics XII 1b | 42 | 11 blueprints fixed: a wrong formula: the dielectric numerical used C = (n − 1)ε₀A/d, the formula for a capacitor of n plates, with n set to the dielectric constant, so every answer was too small; the solver now has the book’s C = Kε₀A/d. Also two derivations the syllabus says are “formulae only” (a parallel plate capacitor and the energy it stores), replaced with ones it asks for; four reasons and truths said twice; two “also true” lines that explain; a distractor whose slip was named wrongly; “+ 0k̂” in a question; a crane pulling with 5 N; and the scalar and vector products as a second “distinguish” of the dot and cross products | 0 | 770 |
| 8 | Physics XII 2a, Physics XII 9b | 42 | 12 blueprints fixed: logic gates, not in the 2028 Physics syllabus, removed from the facts, and the gates blueprint flagged; a bridge rectifier, which the syllabus leaves out; supplies of 110 to 190 V for an iron, and “1 hours a day”; drift speed as “a millimetre per second”; a link that is cause and effect marked as not, and one that was arguable; and one ampere and one ohm as a pair to distinguish | 1 | 812 |
| 9 | Physics XII 7a, Physics XII 6c | 44 | 14 blueprints fixed: polarisation, not in the 2028 syllabus (only named there as evidence of waves), removed from the facts, and the Malus’s law blueprint flagged; a fringe width in water worked with the wavelength formula, so its symbols were wrong; a repeated assertion–reason concept (the car with no wave effects); a part label that held the answer to a “say why” it didn’t mark; and three links or pairs that were arguable | 1 | 856 |
| 10 | Chemistry XII 4a, Physics XII 1a | 42 | 7 blueprints fixed: a wrong answer: one Coulomb’s law numerical said “two equal charges” but worked with a second charge it never gave, so its answer was neither; two assertion–reason concepts said the same (charges outside a closed surface); three facts said twice (the force in a medium, field lines meeting a conductor at right angles, the stability of Mn²⁺); and an arguable link | 0 | 898 |
| 11 | Physics XII 8b, Maths XII 5a, CS XII 8a | 46 | 18 blueprints fixed: radioactivity (decay law, half-life, alpha, beta and gamma, carbon dating), not in the 2028 syllabus: its facts left the shared pools, and its 9 blueprints, 7 of them Task 8 derivations, are flagged, as an earlier version already asked you about it; binary search trees and full and complete trees, not in the CS syllabus, replaced; a fusion reason said twice; “2x + 2y + 1z” and “+ 0z” in a question; “a full binary tree” where the largest number of nodes at a level was meant; and an arguable link | 9 | 944 |
| 12 | Chemistry XII 2b, Maths XII 1a, Physics XII 8a | 51 | 12 blueprints fixed: a question that was wrong as worded: one hydrogen atom can give at most n − 1 lines, not n(n − 1)/2, which needs a sample; metals paired with impossible ions (silver as Ag³⁺), and n always 1 from the range bug; Rutherford’s 1/sin⁴(θ/2) law, which the syllabus excludes; a repeated assertion–reason concept, a repeated truth and an “explain” that repeated a reason; a distractor whose slip was named backwards; and two links that weren’t cause and effect, or were arguable | 0 | 995 |
| 13 | Maths XII 2b, Maths XII 3e, Chemistry XII 2a | 50 | 11 blueprints fixed: no errors of fact in Chemistry XII cells, Maths XII determinants or differential equations, and every determinant, inverse and solution checks out by hand. Fixed: the range bug in two cell numericals; a reason said twice; an “also true” line that can read as the reason; a growth CBQ that repeated another, now decay; working printed as “1x²”, “x^{1}”, “(dy/dx)¹” and “1e^{1x}”; a distractor’s slip named unclearly; and an arguable link | 0 | 1,045 |
| 14 | Chemistry XII 8a, CS XI 8a, Maths XII 1b | 48 | 9 blueprints fixed: three Chemistry recall items outside the 2028 list (Gattermann–Koch, Friedel–Crafts acylation, acetals) removed; a Java line written with a Unicode minus, which wouldn’t compile; a sum printed as “π/1”; repeated facts (sp² twice, a boiling-point reason twice, a scope truth twice, two oxidation concepts, reduction reagents also asked as a comparison); and three “distinguish” pairs that aren’t pairs (a switch and a conditional, a loop and an infinite loop, scope and visibility) | 0 | 1,093 |
| 15 | Maths XII 2a, Maths XII 3a, Chemistry XII 7b | 41 | 7 blueprints fixed: Rolle’s theorem and the mean value theorem, not in the 2028 Calculus unit (an open question in syllabus-review.md, item 8), left the shared pools; a repeated assertion–reason concept (phenol and bromine water) and four facts said twice in Phenols; and a link that wasn’t clearly cause and effect. Matrices, their products and the sales CBQ were all right | 0 | 1,134 |
| 16 | Physics XII 6b, CS XII 2a, CS XII 4a | 43 | 10 blueprints fixed: the eye’s accommodation, not in the Optical Instruments syllabus, replaced; four facts said twice (the least distance of distinct vision, a telescope’s tube length, two reasons on a telescope’s objective and a reflector’s colour); “A AND gate”; and four links or pairs that were arguable or not pairs. Gates, arrays, addresses and programs were all right | 0 | 1,177 |
| 17 | Physics XII 5a, Chemistry XII 9a, Chemistry XII 4b | 46 | 10 blueprints fixed: seven facts said twice (radar, cancer treatment, the fields in phase, HCl in KMnO₄ titrations, the carbylamine test, basicity in water, amine boiling points); an AR “also true” line that explained the assertion; a “cause” link that was the same idea; a contrast with no clear difference; and name-it answers that read “the Esterification”, “the Kolbe’s reaction” and “n-phenylethanamide”. EM waves, dichromate and permanganate, and amine chemistry were otherwise right | 0 | 1,223 |
| 18 | CS XII 1a, Maths XI 1b, Maths XII 3d, Maths XII 6a | 43 | 21 blueprints fixed: about twenty facts said twice or three times (upper minus lower, areas below the axis, a corner as the optimum, an unbounded region, a function’s definition, the conditional, the biconditional and the contrapositive); LP corner sets that weren’t convex, so a “corner” lay inside the region; “1x³” and “y = 1x”; “Each of tables takes”, an odd farmer story and ₹ profits 100 times too small for a hectare; a converse that read “if it is divisible by 2, then a number is even”; an “is a: an equivalence” option; and truth tables with no row order. One-one proofs are Class XII syllabus, so that Class XI blueprint is flagged | 1 | 1,266 |
| 19 | Physics XII 9a, CS XI 7a, Chemistry XII 10b | 43 | 15 blueprints fixed: two pairs of AR nodes that were the same question (a neutral n-type crystal; a boiled egg), a third on small doping, and about twenty facts said two or three times (majority carriers, heating a semiconductor, glycine, the α-helix, keratin, specificity, 7 / 2 and 2 + 3 * 4, short-circuiting, final); a recall whose options matched a 2024 board question, reworded; Unicode minus signs in Java expressions; “Give the difference between =  and ==”; and three contrasts that weren’t pairs. Band theory, doping, the law of mass action, protein structure and Java’s operators were right | 0 | 1,309 |
| 20 | Physics XII 4a, Physics XII 3b, Chemistry XII 6b | 49 | 21 blueprints fixed: the worst repetition so far: soft iron, laminated cores, Lenz’s law and energy, a steady flux, and the C–X bond’s partial double bond character each came up in four or five places, and two Haloarenes AR nodes were the same question word for word; three “cause” links that weren’t causes; a superconductor truth outside the syllabus; and “A 80 cm rod … joined by a 8 Ω resistor”. Two directive-influence facts were added to keep Haloarenes at its 42. The physics and chemistry stated were right | 0 | 1,358 |
| 21 | CS XII 2b, CS XII 9a, Chemistry XI 6b, Chemistry XII 9c | 48 | 20 blueprints fixed: three solver display bugs in every generated numerical: floating-point noise in a value (6 × 10⁻⁴ read as 0.0006000000000000001) set the answer to 5 figures, a value in standard form before a power gave “8×10^{-5}^{2}”, which KaTeX can’t draw, and the pH formula read “−log₁₀ H”; an AR whose “reason” was only the reaction’s name; facts said three to five times (cold diazotisation, coupling in alkali, NH₄Cl, the buffer, half and full adder expressions, 8 inputs needing 3 select lines, constants in Big O); and “strong alkali” for phenolphthalein, which fades there. Five facts were added so Diazonium salts and Applications keep their counts | 0 | 1,406 |
| 22 | CS XI 1a, CS XI 5a, CS XI 9a, Chemistry XII 10d | 46 | 19 blueprints fixed: AR nodes that were word for word a reason elsewhere (Chargaff’s rule twice over, hexadecimal for binary, two references to one object, pass by value), two identical purine–pyrimidine reasons, about fifteen recalls and truths said twice (base pairs, uracil and thymine, bits per octal and hexadecimal digit, 1011 in decimal, compiling and running, static methods, void), five contrasts that weren’t pairs, and a distractor label “if you left out the last remainder” that described the wrong digit. Conversions, sums, 2’s complement, programs and outputs all check | 0 | 1,452 |
| 23 | Chemistry XII 10a, Chemistry XII 7c, CS XI 6a | 40 | 17 blueprints fixed: pairs of AR nodes asking the same thing (a tertiary halide in Williamson’s synthesis; cellulose not digested), AR nodes that were a reason word for word (sucrose not reducing, invert sugar), an “also true” line (two lone pairs) that partly explains the bond angle, and facts said three to five times (anisole with HI, glucose with Br₂, HI and Schiff’s reagent, bit sizes of the types, ’A’ + 1); a casting MCQ whose “added 1” slip gave floor + 2; and amylose called water-soluble beside starch called insoluble. The chemistry and Java facts were right | 0 | 1,492 |
| 24 | CS XII 6a, Maths XI 1a, Maths XI 3c | 46 | 13 blueprints fixed: AR statements repeated word for word as truths or recalls (2ⁿ subsets, De Morgan, an ellipse’s focal sum, a parabolic reflector, overriding at run time, an abstract class and new, single inheritance), a recall on the same ellipse as the worked ellipse question, three recalls on the same two sets, an AR whose reason was “this is how an ellipse is defined”, an “also true” line about interfaces, which aren’t in the syllabus, and “The object is a Apple”. All the conics, set working and Java outputs check | 0 | 1,538 |
| 25 | CS XII 4b, CS XII 5a, CS XII 6b, CS XI 3a | 47 | 21 blueprints fixed: all three Interfaces AR nodes were 2-mark reasons word for word, the three Recursion AR nodes were each a truth word for word, and many recalls and truths said what an AR, a comparison or a definition already said; Unicode minus signs inside Java code (f(n − 1), −1); a Class XI “propositional logic” question that asked about gates, which are in 3b; a truth table with no row order; Exam and Quiz classes with a “price”; and four contrasts that weren’t pairs. Eight new facts keep the two topics at their counts, Interfaces ones on the syllabus’s stress, the construct against a class’s interface in the wider sense. Every string, recursion and interface program checks | 0 | 1,585 |
| 26 | Physics XI 10b, Chemistry XI 1c, Chemistry XI 8a, Chemistry XII 8b | 46 | 17 blueprints fixed: a dilution question that asked how much water to add but gave the final volume; the Doppler effect, which isn’t in the 2028 Waves unit; all three Carboxylic Acids AR nodes repeating a reason, and the ethanol–methoxymethane AR repeating a recall; facts said four or five times (odd harmonics of a closed pipe, sound and temperature, beats, the primary standard, normality and n-factor); and two topics with only three truths, so their MCQs had three options. All the numericals check | 0 | 1,631 |
| 27 | Chemistry XII 10c, Maths XI 5b, Chemistry XII 3b, Chemistry XII 9b, Maths XI 3a | 40 | 20 blueprints fixed: small topics whose AR nodes repeated their only reasons (rate and temperature, collisions, AgCN, vitamin C three times over), recalls that repeated the reaction questions word for word, three topics with only three truths (so three-option MCQs) and Vitamins with one definition, AR statements repeated as truths and recalls in Straight Lines and Probability, a working line “1/52 = 1/52”, and ASCII minus signs in coordinates outside maths mode. Ten new facts keep the topics at their counts; the Arrhenius, distance and probability answers check | 0 | 1,671 |
| 28 | Maths XI 3b, Chemistry XI 1b, Chemistry XII 2c, CS XI 2a, Maths XI 2c | 43 | 17 blueprints fixed: integer encodings (2’s complement and the rest), which the 2028 Class XI wording dropped from Encodings, so the complements question is flagged and the Class XI section-A question now subtracts in binary; a moles answer given to 5 figures because a derived amount carried 10 digits; a working line that read only “= 1404000”; AR nodes that repeated a reason or a recall word for word (salt water, galvanising, nCr symmetry, 0!, the circle’s centre and tangent, ASCII’s size); three topics with only three truths; and “(3, -2)” outside maths mode. Seven new facts keep the counts; every count, conversion and circle checks | 1 | 1,714 |
| 29 | Maths XI 2e, Physics XI 4a, Chemistry XI 2b, CS XI 11b | 42 | 11 blueprints fixed: two Sequences blueprints with the same saving-money story, which could share a paper; AR statements repeated as truths (AM ≥ GM, two electrons per orbital, readLine’s null) or as a reason (closing a file, equal momenta); truths that repeated definitions (the work-energy theorem, F = −dU/dx); and thin topics with two definitions or three truths. Nine new facts keep the counts; every numerical, sum and configuration checks | 0 | 1,756 |
| 30 | CS XI 3b, Chemistry XI 4b, Chemistry XI 9b, CS XI 5b, Maths XI 2b, Maths XI 4a | 47 | 21 blueprints fixed: a gate question with only two options, 0 and 1; “x² + 0x − 9” and an ASCII “-31” in the quadratic questions; and, in six small topics, AR nodes that were a reason or a recall word for word (O₂’s paramagnetism, Markovnikov, but-2-ene, bromine water, −b/a, sin x/x, a constant’s derivative, a half adder’s outputs, int division by zero), with two definitions or three truths in most. Fifteen new facts and definitions fill them out; every shape, bond order, limit and derivative checks | 0 | 1,803 |
| 31 | Physics XI 2a, Chemistry XI 4a, Chemistry XI 5b, Chemistry XII 11c | 40 | 15 blueprints fixed: four generator faults shared by many numericals: a value carried to a later part with 10 digits, so that part was given to 5 figures; a “final speed” with two answers, ±15.6 m/s; counts such as a formal charge shown as “−2.00”; and ASCII minus signs (“-25 m/s”, “ΔH = -60”) in questions and options. Also AR nodes that were reasons word for word (zero velocity while accelerating, ionic melting points), truths that were AR statements (displacement and distance, CO₂’s dipole, the third law), and a hydrogen-bond node that batch 30 wrote twice over two topics. A conics “distinguish” pair removed in batch 24 left a paper of ten one short; a real pair now replaces it | 0 | 1,843 |
| 32 | CS XI 12a, CS XI 13a, Physics XI 3a, Chemistry XI 7a, CS XI 10a | 48 | 8 blueprints fixed: a gun’s recoil worked with the embedded-bullet formula, so 30 g at 500 m/s from a 6 kg gun gave 2.49 m/s, not 2.5; a bat’s contact lasting 0.5 s; three-option “which is correct” MCQs in four topics; and AR nodes or truths repeating a reason, recall or AR word for word | 0 | 1,891 |
| 33 | Maths XI 2a, Maths XI 3d, Maths XI 5a, Chemistry XI 2a, Chemistry XI 3a, Chemistry XII 11a | 45 | 17 blueprints fixed: answers like “+ −4/13 i” and “0 + 24i”, “1 + 1i” for 1 + i, and points printed “(2,-2,-3)”; a variance shown as 0.6666666666666666; three numericals with no working; an “Ar is smaller than Cl⁻” MCQ that depends on which radius you use; and the three-option and copied-AR faults again | 0 | 1,936 |
| 34 | Maths XI 2d, Physics XI 2b, Physics XI 7a, Physics XI 7c, Physics XI 8b | 45 | 14 blueprints fixed: stress worked as “P”, the symbol for pressure; “x¹” and “(1x)” in binomial questions, with a 3-mark question on the x term; entropy, not safely in the syllabus; silly options (“vanishes”, “first doubles”, “the heat added twice”); and three-option MCQs and copied AR nodes again | 0 | 1,981 |
| 35 | Chemistry XI 1a, Chemistry XI 6a, CS XI 11a, Physics XI 1a, Physics XI 1b, Physics XI 5a, Physics XI 6a | 40 | 10 blueprints fixed: g at a height of 500 km worked with the small-height approximation, 8.27 m/s² against a true 8.43; a “first rises, then jumps” distractor that real g with depth comes close to; silly options for a ring’s centre of mass (“at one end”, “nowhere”); and three-option MCQs and copied AR nodes again | 0 | 2,021 |
| 36 | Chemistry XI 10a, Chemistry XI 8b, Chemistry XI 8c, Chemistry XI 9a, Chemistry XII 6c, CS XII 7a, Physics XI 10a | 40 | 12 blueprints fixed: a spring’s greatest speed worked from an unexplained “5.773502692 rad/s”; an output question whose explanation talked about slices when its code had none; clumsy options (“same everywhere” after “greatest at the”); truths that were an AR or a definition word for word; and three-option MCQs again | 0 | 2,061 |
| 37 | Physics XI 5c, Physics XI 6b, Physics XI 7b, Physics XI 8a, Physics XI 9a | 47 | 14 blueprints fixed: a thin ring worked with a disc’s formula, so its moment of inertia was half the right answer; water mixed at 35 °C and 60 °C answered as “321 K”; a pressure worked in pascals but answered in atmospheres with no conversion shown; a one-step rms speed worth 3 marks; and three-option MCQs and copied AR nodes again | 0 | 2,108 |
| 38 | Chemistry XI 10b, Chemistry XI 10c, Chemistry XI 10d, Chemistry XI 5a, Chemistry XI 9c, Chemistry XI 9d, Chemistry XII 11b, Chemistry XII 11d | 41 | 10 blueprints fixed: formulas printed with “(−P)ΔV” instead of “−PΔV”; a yellow precipitate “with KI in hot water”, when it’s the precipitate that dissolves in hot water; and three-option MCQs and copied AR nodes again. Most of this batch’s practical chemistry was right | 0 | 2,149 |
| 39 | CS XI 4a, CS XII 7b, CS XII 7c, Physics XI 1p, Physics XI 3b, Physics XI 3c, Physics XI 4b | 46 | 15 blueprints fixed: “Reduced mass of the pair”, not in the syllabus, asked of two trolleys that stuck together; “Append():” and “Extend():” with capital letters; a one-step speed on a curve worth 3 marks; and three-option MCQs and copied AR nodes again | 0 | 2,195 |
| 40 | Physics XI 5b, Physics XII 6p | 16 | 4 blueprints fixed: AR nodes and a truth repeating a recall or reason word for word (the skater, the door handle, equilibrium); three-option MCQs; “A focal length”, and a silly option, “measuring its colour”. The numericals in this batch were right | 0 | 2,211 |
<!-- /review-progress -->

### Flagged: can’t be made right yet

These stay in use, marked “Not yet reviewed”, until you decide.

<!-- flagged -->
| Blueprint | Batch | Why |
|---|---:|---|
| `p12-9b-gates` | 8 | Logic gates aren’t in the 2028 ISC Physics syllabus, whose electronics stops at diodes, rectifiers, LEDs, photodiodes, solar cells and Zener diodes. They are in Computer Science. It stays in use, marked “Not yet reviewed”, until you decide whether to remove it. |
| `p12-6c-malus` | 9 | Polarisation, and with it Malus’s law, isn’t in the 2028 ISC Physics syllabus, which names polarisation only as one sign of the wave nature of light. It stays in use, marked “Not yet reviewed”, until you decide whether to remove it. |
| `p12-8b-half-life` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. |
| `p12-8b-half-life-mcq` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. |
| `p12-8b-dv-decay-law-ask` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. Its bank question, asked at 0% generated, is in the same position. |
| `p12-8b-dv-decay-law-error` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. Its bank question, asked at 0% generated, is in the same position. |
| `p12-8b-dv-decay-law-hence` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. Its bank question, asked at 0% generated, is in the same position. |
| `p12-8b-dv-decay-law-step` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. Its bank question, asked at 0% generated, is in the same position. |
| `p12-8b-dv-half-life-ask` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. Its bank question, asked at 0% generated, is in the same position. |
| `p12-8b-dv-half-life-hence` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. Its bank question, asked at 0% generated, is in the same position. |
| `p12-8b-dv-half-life-step` | 11 | Radioactivity isn’t in the 2028 ISC Physics syllabus, whose Nuclei section covers size, mass defect, binding energy, fission and fusion. An earlier version asked you whether to keep it for reference (reports/syllabus-review.md, item 1), which is still open, so this stays in use, marked “Not yet reviewed”, until you decide. Its bank question, asked at 0% generated, is in the same position. |
| `m11-1b-one-one-proof` | 18 | One-one functions are in the Class XII syllabus (Relations and Functions), not Class XI 1b, which lists only kinds of real functions and their algebra. The proof itself is right. |
| `k11-2a-complements` | 28 | The 2028 Class XI Encodings wording is only “Characters and their encodings (e.g. ASCII, ISCII, Unicode)”; the earlier wording’s “binary encodings for integers … sign-magnitude, twos complement” has gone. The working is right. Its pool facts (1’s and 2’s complement, sign and magnitude, parity) are left in place until you decide. |
<!-- /flagged -->

### The most common kinds of mistake

All 2,211 blueprints have now been read: 1,782 in these batches and 429 in Tasks 3 and 8. 2,198 count as reviewed, and the 13 above are flagged. The batches recorded fixes to 543 blueprints, not counting the shared generator fixes, which reached many more.

The list runs roughly from most to least common. That order comes from reading the batches, not from an exact count.

1. **One fact asked several ways.** The same sentence appeared as a recall, a reason, a truth and an assertion–reason statement, so a paper could ask it twice. This was by far the most common. In particular, assertion–reason nodes often copied a reason word for word.
2. **Too few options or facts.** “Which of these is correct?” often had only three options, because the topic had only three truths. Thin topics also had too few definitions or pairs. Only `k12-2a-gate-output` now has fewer than four options, because a gate’s output can only be 0 or 1.
3. **Faulty assertion–reason logic.** Examples are “also true” lines that really did explain the assertion, a law named as its own reason (“this is Hooke’s law”), arguable cause links, and “distinguish” pairs that weren’t real pairs.
4. **Printing slips.** Examples are “1x”, “0 + 24i”, “+ −4/13 i”, “(2,-2,-3)”, ASCII minus signs, “(−P)ΔV”, “Append():”, a value in standard form with no brackets before its power, and a count shown as “−2.00”.
5. **Outside the syllabus.** Examples are reduced mass, entropy in Physics, Rolle’s theorem and logic gates in Physics. Some are flagged above instead of removed.
6. **Weak distractors.** Some were silly (a ring’s “one end”, “vanishes”, “first doubles”). Some weren’t definitely wrong (argon against Cl⁻). Some slips were mislabelled in the explanation.
7. **Floating-point and rounding noise.** Examples are a variance of 0.6666666666666666, a working step with “5.773502692 rad/s”, a pH given to 5 figures, and carried values with 10 digits.
8. **Incomplete working.** Some answers had no substitution or no final line, or used a value that appeared from nowhere.
9. **The wrong formula or model.** These were the most serious, though the fewest. A thin ring used a disc’s ½MR², a gun’s recoil used the embedded-bullet formula, g at hundreds of kilometres used the small-height approximation, and a final speed had two answers.
10. **Answers that don’t fit the question.** Temperatures given in °C were answered in kelvin, a pressure worked in pascals was answered in atmospheres, and an explanation about slices was attached to code with none.
11. **Unrealistic values or wrong marks.** A bat’s contact lasted half a second, and a single substitution was worth 3 marks.
12. **A bug in how values were drawn.** A list of three angles was read as a range, so the angle was always 30°. Separately, two blueprints in one topic could tell the same story on one paper.

`tests/unit/question-answers.test.ts` works out the corrected physics answers from each question’s own numbers, so they can’t drift back.

## v6: the bank in three layers

The bank's questions come from three places, and it matters which. `reports/supply-after.md` counts them apart.

| Layer | What it is | How it is checked |
|---|---|---|
| Written | Finished questions written by hand, in `src/practice/bank/written/`, plus the first bank and the derivations | Read as written. Numericals by the solver, programs by the tracer, marks by test, originality against the papers |
| Facts | Each fact from the knowledge base, in its own words, as a fixed question | The facts were read in v5's review. The ways of asking were read on samples |
| Compiled | Instances frozen from reviewed blueprints | The blueprint was reviewed. Numericals by the solver when opened, programs by the tracer when frozen. Not read one by one, so they carry the Generated mark and its “may contain mistakes” note |

**“Fully reviewed” means less for the last two layers than for the first.** Nobody has read each of the compiled questions. They are held to machine checks and their family was read on samples.

### What was read

The engine's blueprints are too many to read one at a time, so they were read as families, about 300 instances across subjects:

| Read | Problem found | Fix |
|---|---|---|
| First samples | Correct arithmetic in absurd questions: a charged 12 kg body with a path 10⁷ m across | Values now come from the numericals v5 reviewed |
| Second samples | Settings that didn't suit: a railway expansion gap with engine efficiency, a defibrillator with Coulomb's law | Each setting has a pattern, and these were tightened |
| Second samples | “a acceleration”, “Rms voltage”, “The values are:” before one value, “PH” | Fixed in the engine |
| Second samples | “71.7 cal”, “0.00225 kN”, a student writing −2 J | A converted value must read as a measurement, and a slip can't change the sign |
| Second samples | A percentage change on a direct proportion, whose answer repeats the question | Only where a power makes it worth asking |
| Second samples | A question that didn't say what it was about: half-life against concentration, with no order given | Each question now names its situation, from the formula's title in the book |
| Second samples | A chain that ended where it began: half-life, then back to the rate constant | Left out |
| Mathematics | First terms of 4.5 “for a farmer”, probabilities as 0.0888889, part (b) contradicting part (a) | The engine is off for Mathematics, and 236 blueprints were written by hand instead |
| Tests | Identical stems with different wrong options counted as different questions | The stem decides, for compiled and engine questions |

**Settings are the weakest part of the engine.** Even when one suits, it is a sentence placed in front of a calculation, and doesn't change the physics. Hand-written cases are better, and there are few of them.

### Batches

| Batch | What was added | Problems found | Written so far |
|---:|---|---|---:|
| 0 | Facts and compiled layers, chapter files, stress test | A stale test cache hid the bank; capacity counted questions on one fact as different; two older bugs in marking and mock papers | 704 |
| 1 | Mathematics: 236 ways of asking across 26 topics | Two stubs left in, a non-convex corner set, a sign slip, all found on a read-through by hand | 704 |
| 2 | Physics XII 3a, 4b, 6a; Chemistry XII 1a, 3a; Mathematics XII 3b, 3c, 7a; CS XII 1b, 3a | A wrong solver symbol, one question repeating the first bank, two phrases close to a paper, one assertion–reason with no right option | 1,128 |
| 3 | Order, odd one out and predict for most-asked topics; 31 cross-topic and thin-topic numericals; Chemistry XII 7a, Physics XII 2b | A muddled explanation, a wrong ionisation order, a word the syllabus scan rightly caught | 1,189 |
| 4 | All 23 subtopics still under 40 or 80: Physics XI 1a, 1b, 1p, XII 6p; Chemistry XI 1a, 8b, 9a, 9c, 9d, 10a–10d; Chemistry XII 2c, 6c, 10c, 11a–11d; CS XI 4a, 11a, 11b | One repeated question stem; three clumsy wordings, fixed on re-reading; a new test on Section A then showed mock papers could lose the papers' mix of formats, which is fixed in `draw` | 1,579 |
| 5 | 281 Mathematics numericals, all 28 subtopics, for 0% generated. Four long Computer Science XI questions | A question that repeated one in the first bank. A comment that claimed a check, `written-bank.test.ts`, which never existed, so `tests/unit/written-answers.test.ts` now computes every hand-written Mathematics numerical a second time. Its first full run found no wrong answer | 1,864 |
| 6 | 103 Physics XII numericals on electrostatics, current, induction, AC, optics, photons and nuclei, for 0% generated | Six unit spellings the solver couldn't read. Reading all the answers found one question wired to the wrong arms of a bridge, two negative roots, one answer per second to a question asking per hour, and a unit of Hz on a count, none of which a solver can catch, so these are now worked from the physics in `tests/unit/written-answers.test.ts`. One-mark numericals crowded multiple choice out of Section A, which is fixed in `draw` | 1,967 |
| 7 | Long answers and programs for what internal choices use up: Chemistry XI 1b–9d; Computer Science XI 1a–13a and XII 1a–9a | A question asking for an expression that the quality gate rightly stopped. Boolean answers weren’t checked by anything, so `tests/unit/boolean-written.test.ts` works them out by truth table | 2,038 |
| 8 | Reasons and short answers: Physics XI and XII, Chemistry XII, and every most-asked Mathematics and Computer Science subtopic. Match the columns for all 38 most-asked subtopics (344 reasons, 290 short answers, 17 “distinguish” and 172 matches) | Two questions repeating the bank word for word. Out of the syllabus, found by checking its wording: polarisation, Malus’ law, half-life, hysteresis, myopia, the toroid, second-order kinetics, the Gattermann–Koch reaction and aspirin, all replaced; batteries and corrosion moved to Chemistry XII 2c. Matches with two right answers, such as three items all giving “fringes get wider”, so `tests/unit/match-written.test.ts` now requires every Column B entry to be different. One match’s labels ran ten words alongside a paper’s options, which the originality check caught. “Distinguish between” questions had been filed as short answers | 2,861 |
| 9 | Figures for 33 of the 38 most-asked subtopics, every one where a figure fits (141: graphs and sketches to draw, with the answer drawn; figures to label; graphs and tables to read). Matches for the four most-asked Computer Science subtopics. The last five short answers | Every figure was rendered and looked at. That found a Huygens construction whose wavelet wasn’t centred where it should be, a microscope and a telescope whose rays didn’t trace to their images (both redrawn from worked lens distances), energy levels drawn to scale on top of each other, labels lying over each other or off the edge, and graphs squashed against an axis because the graph figure always started at zero, which it no longer has to. Also out of the syllabus: the angular distribution of alpha scattering. A ten-word run beside a paper, caught by the originality check. A LaTeX command that lost its backslash, which `tests/unit/lost-backslash.test.ts` now catches anywhere in the bank | 3,027 |
| 10 | For the 38 most-asked subtopics: predict and explain (190), odd one out (190), distinguish between (143), programs (4) and assertion–reason (120) | Ten distinguish pairs the bank already asked, such as fission and fusion or real and virtual images, swapped for new ones after checking every pair against the bank and the blueprints. Out of the syllabus: polarisation, the angular distribution of scattering, branched alcohols’ properties, stacks and queues. Wrong answers caught on reading: a crossed-fields question whose forces couldn’t balance, `while (false)` which Java won’t compile, an assertion–reason item with both statements false, which no option fits, and a String said to be changeable by a method. Binary trees are conceptual in the syllabus, so programs no longer count as fitting them. A Physics XII set of 10 came out at 8 because a retry kept the blueprints an earlier try had used; that is fixed in the set builder | 3,674 |
| 11 | For the 38 most-asked subtopics: long answers in parts (153) and derivations or proofs (44), each derivation checked against the derivation library and the bank so none is asked twice | Batch 10’s Chemistry XII 4a questions on dichromate and permanganate belonged to 4b, which the syllabus gives to K₂Cr₂O₇ and KMnO₄, and some repeated 4b questions already written; they were replaced with 4a questions, and the dichromate figure moved to 4b. A match with “Catalyst” and “Catalyst for making SO₃” in Column B had two right answers. Two ten-word runs caught by the originality check. Every worked answer recomputed by hand. The diode subtopic has nothing to derive, so derivations no longer count as fitting it. Found but left for a decision: Physics XII 8b has written derivations of the decay law and half-life, and Mathematics XII 4a one on the scalar triple product, which the 2028 syllabus doesn’t list | 3,872 |

### Novelty check for v6

`NOVELTY_SAMPLES=30` over the 5,490 blueprints: 164,700 questions and 70,834 distinct pieces of wording. **Nothing flagged**, and no run of ten words in common with a paper. The closest band, 50–60% of five-word runs from one paper question, has 2 pieces of wording, and the flag is at 60%. All the bank's layers, Batch 4 included, pass `tests/unit/bank-private.test.ts`. This sampled less deeply than v5's 500 per blueprint, as there are nearly four times as many blueprints.

### Bank by subtopic

Written here by `tests/unit/supply-report.test.ts`. “Reviewed” is by layer, as above.

<!-- bank-progress -->
| Subtopic | Target | Written | Facts | Compiled | Total | Easy | Medium | Hard | Largest formats | Reviewed |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| Physics XI 1a | 80 | 44 | 38 | 0 | 82 | 30 | 37 | 15 | mcq 22, assertion 15, statement 10 | Yes, by layer |
| Physics XI 1b | 80 | 46 | 35 | 0 | 81 | 22 | 38 | 21 | mcq 23, assertion 17, short 13 | Yes, by layer |
| Physics XI 1p | 80 | 58 | 27 | 0 | 85 | 26 | 44 | 15 | mcq 25, short 11, very-short 10 | Yes, by layer |
| Physics XI 2a | 80 | 5 | 122 | 192 | 319 | 96 | 170 | 53 | numerical 81, mistake 49, data 40 | Yes, by layer |
| Physics XI 2b | 80 | 8 | 39 | 250 | 297 | 64 | 153 | 80 | numerical 90, data 48, mistake 44 | Yes, by layer |
| Physics XI 3a | 80 | 5 | 45 | 304 | 354 | 78 | 175 | 101 | numerical 103, data 56, mcq 55 | Yes, by layer |
| Physics XI 3b | 80 | 3 | 39 | 170 | 212 | 40 | 117 | 55 | numerical 73, data 48, order 24 | Yes, by layer |
| Physics XI 3c | 80 | 3 | 34 | 228 | 265 | 46 | 139 | 80 | numerical 97, data 48, mistake 28 | Yes, by layer |
| Physics XI 4a | 80 | 3 | 132 | 377 | 512 | 129 | 217 | 166 | numerical 121, mcq 95, data 72 | Yes, by layer |
| Physics XI 4b | 80 | 4 | 34 | 120 | 158 | 27 | 107 | 24 | numerical 57, data 32, mistake 20 | Yes, by layer |
| Physics XI 5a | 80 | 1 | 32 | 88 | 121 | 27 | 79 | 15 | numerical 56, data 16, mistake 12 | Yes, by layer |
| Physics XI 5b | 80 | 2 | 35 | 178 | 215 | 41 | 119 | 55 | numerical 81, data 45, mcq 25 | Yes, by layer |
| Physics XI 5c | 80 | 3 | 35 | 199 | 237 | 41 | 124 | 72 | numerical 81, data 51, mcq 26 | Yes, by layer |
| Physics XI 6a | 80 | 5 | 36 | 210 | 251 | 54 | 142 | 55 | numerical 73, data 48, mcq 39 | Yes, by layer |
| Physics XI 6b | 80 | 6 | 38 | 252 | 296 | 72 | 169 | 55 | numerical 89, mcq 72, data 40 | Yes, by layer |
| Physics XI 7a | 80 | 2 | 38 | 227 | 267 | 51 | 145 | 71 | numerical 73, mcq 57, data 54 | Yes, by layer |
| Physics XI 7b | 80 | 4 | 44 | 264 | 312 | 82 | 160 | 70 | numerical 95, mcq 55, data 48 | Yes, by layer |
| Physics XI 7c | 80 | 3 | 34 | 80 | 117 | 20 | 81 | 16 | numerical 48, data 16, mistake 12 | Yes, by layer |
| Physics XI 8a | 80 | 2 | 40 | 212 | 254 | 63 | 143 | 48 | numerical 81, data 45, mcq 44 | Yes, by layer |
| Physics XI 8b | 80 | 7 | 43 | 176 | 226 | 64 | 130 | 32 | numerical 73, data 40, mcq 29 | Yes, by layer |
| Physics XI 9a | 80 | 4 | 39 | 226 | 269 | 52 | 138 | 79 | numerical 98, data 45, mcq 41 | Yes, by layer |
| Physics XI 10a | 80 | 6 | 38 | 291 | 335 | 68 | 159 | 108 | numerical 103, data 56, mcq 51 | Yes, by layer |
| Physics XI 10b | 80 | 4 | 164 | 329 | 497 | 115 | 226 | 156 | numerical 121, mistake 64, mcq 61 | Yes, by layer |
| Physics XII 1a | 80 | 22 | 188 | 352 | 562 | 151 | 258 | 153 | numerical 132, mcq 105, data 56 | Yes, by layer |
| Physics XII 1b | 80 | 23 | 179 | 400 | 602 | 152 | 258 | 192 | numerical 135, mcq 104, data 80 | Yes, by layer |
| Physics XII 2a | 80 | 18 | 171 | 384 | 573 | 151 | 245 | 177 | numerical 132, mcq 103, data 72 | Yes, by layer |
| Physics XII 2b | 80 | 49 | 161 | 297 | 507 | 120 | 239 | 148 | numerical 132, mistake 60, mcq 57 | Yes, by layer |
| Physics XII 3a | 80 | 85 | 201 | 384 | 670 | 177 | 297 | 196 | numerical 140, mcq 120, data 72 | Yes, by layer |
| Physics XII 3b | 80 | 3 | 142 | 0 | 145 | 57 | 63 | 25 | statement 36, assertion 24, very-short 18 | Yes, by layer |
| Physics XII 4a | 80 | 13 | 164 | 243 | 420 | 116 | 211 | 93 | numerical 93, mcq 61, data 48 | Yes, by layer |
| Physics XII 4b | 80 | 69 | 204 | 311 | 584 | 160 | 279 | 145 | numerical 129, mcq 97, mistake 65 | Yes, by layer |
| Physics XII 5a | 80 | 4 | 156 | 40 | 200 | 80 | 94 | 26 | mcq 42, statement 40, assertion 24 | Yes, by layer |
| Physics XII 6a | 80 | 73 | 256 | 287 | 616 | 174 | 289 | 153 | numerical 137, mcq 76, mistake 70 | Yes, by layer |
| Physics XII 6b | 80 | 9 | 137 | 163 | 309 | 89 | 159 | 61 | numerical 76, data 42, statement 32 | Yes, by layer |
| Physics XII 6c | 80 | 15 | 169 | 259 | 443 | 122 | 219 | 102 | numerical 94, mcq 83, data 54 | Yes, by layer |
| Physics XII 6p | 80 | 52 | 29 | 0 | 81 | 23 | 43 | 15 | mcq 25, statement 10, short 10 | Yes, by layer |
| Physics XII 7a | 80 | 19 | 159 | 337 | 515 | 145 | 238 | 132 | numerical 116, mcq 105, mistake 52 | Yes, by layer |
| Physics XII 8a | 80 | 9 | 155 | 43 | 207 | 74 | 95 | 38 | numerical 42, statement 38, mcq 27 | Yes, by layer |
| Physics XII 8b | 40 | 15 | 176 | 125 | 316 | 115 | 163 | 38 | numerical 76, mcq 44, statement 42 | Yes, by layer |
| Physics XII 9a | 40 | 3 | 150 | 69 | 222 | 74 | 115 | 33 | statement 38, mcq 35, numerical 31 | Yes, by layer |
| Physics XII 9b | 40 | 4 | 180 | 180 | 364 | 102 | 191 | 71 | numerical 64, mcq 58, statement 46 | Yes, by layer |
| Chemistry XI 1a | 40 | 7 | 35 | 0 | 42 | 14 | 21 | 7 | assertion 13, statement 8, mcq 6 | Yes, by layer |
| Chemistry XI 1b | 40 | 4 | 38 | 58 | 100 | 37 | 48 | 15 | numerical 42, assertion 12, mcq 10 | Yes, by layer |
| Chemistry XI 1c | 40 | 3 | 73 | 236 | 312 | 84 | 159 | 69 | numerical 81, data 56, mcq 51 | Yes, by layer |
| Chemistry XI 2a | 40 | 3 | 36 | 170 | 209 | 68 | 102 | 39 | numerical 97, mcq 29, mistake 20 | Yes, by layer |
| Chemistry XI 2b | 40 | 4 | 41 | 10 | 55 | 26 | 22 | 7 | assertion 13, mcq 12, statement 8 | Yes, by layer |
| Chemistry XI 3a | 40 | 5 | 44 | 0 | 49 | 17 | 25 | 7 | assertion 13, mcq 8, statement 8 | Yes, by layer |
| Chemistry XI 4a | 40 | 10 | 43 | 46 | 99 | 28 | 64 | 7 | numerical 39, assertion 12, short 9 | Yes, by layer |
| Chemistry XI 4b | 40 | 32 | 37 | 70 | 139 | 29 | 91 | 19 | numerical 28, very-short 27, mcq 21 | Yes, by layer |
| Chemistry XI 5a | 40 | 5 | 38 | 231 | 274 | 67 | 153 | 54 | numerical 74, data 55, mcq 53 | Yes, by layer |
| Chemistry XI 5b | 40 | 2 | 35 | 156 | 193 | 46 | 116 | 31 | numerical 57, mcq 38, data 34 | Yes, by layer |
| Chemistry XI 6a | 40 | 4 | 36 | 0 | 40 | 14 | 18 | 8 | assertion 12, statement 8, mcq 5 | Yes, by layer |
| Chemistry XI 6b | 40 | 6 | 138 | 168 | 312 | 112 | 140 | 60 | numerical 87, mcq 40, statement 38 | Yes, by layer |
| Chemistry XI 7a | 40 | 4 | 39 | 10 | 53 | 23 | 23 | 7 | mcq 13, assertion 12, statement 8 | Yes, by layer |
| Chemistry XI 8a | 40 | 2 | 37 | 1 | 40 | 18 | 15 | 7 | assertion 12, statement 8, mcq 6 | Yes, by layer |
| Chemistry XI 8b | 40 | 8 | 34 | 0 | 42 | 12 | 21 | 9 | assertion 12, mcq 8, statement 8 | Yes, by layer |
| Chemistry XI 8c | 40 | 8 | 42 | 0 | 50 | 16 | 27 | 7 | assertion 13, very-short 8, statement 8 | Yes, by layer |
| Chemistry XI 9a | 40 | 5 | 36 | 0 | 41 | 14 | 20 | 7 | assertion 12, statement 8, mcq 5 | Yes, by layer |
| Chemistry XI 9b | 40 | 2 | 38 | 3 | 43 | 13 | 23 | 7 | assertion 12, statement 8, mcq 7 | Yes, by layer |
| Chemistry XI 9c | 40 | 9 | 33 | 0 | 42 | 13 | 20 | 9 | assertion 13, mcq 11, statement 8 | Yes, by layer |
| Chemistry XI 9d | 40 | 7 | 35 | 0 | 42 | 13 | 21 | 8 | assertion 12, statement 8, mcq 6 | Yes, by layer |
| Chemistry XI 10a | 40 | 6 | 35 | 0 | 41 | 14 | 18 | 9 | assertion 12, statement 8, mcq 6 | Yes, by layer |
| Chemistry XI 10b | 40 | 15 | 26 | 0 | 41 | 16 | 18 | 7 | mcq 16, statement 8, very-short 4 | Yes, by layer |
| Chemistry XI 10c | 40 | 19 | 26 | 0 | 45 | 17 | 21 | 7 | mcq 13, statement 8, mistake 5 | Yes, by layer |
| Chemistry XI 10d | 40 | 17 | 27 | 0 | 44 | 18 | 19 | 7 | mcq 10, statement 8, very-short 7 | Yes, by layer |
| Chemistry XII 1a | 40 | 64 | 282 | 400 | 746 | 209 | 321 | 216 | mcq 134, numerical 128, data 80 | Yes, by layer |
| Chemistry XII 2a | 40 | 6 | 139 | 152 | 297 | 83 | 173 | 41 | numerical 74, data 40, statement 34 | Yes, by layer |
| Chemistry XII 2b | 40 | 4 | 135 | 277 | 416 | 122 | 209 | 85 | mcq 82, numerical 80, data 56 | Yes, by layer |
| Chemistry XII 2c | 40 | 5 | 37 | 0 | 42 | 14 | 21 | 7 | assertion 12, statement 8, mcq 6 | Yes, by layer |
| Chemistry XII 3a | 40 | 54 | 176 | 263 | 493 | 138 | 239 | 116 | numerical 98, mcq 91, mistake 53 | Yes, by layer |
| Chemistry XII 3b | 40 | 2 | 40 | 104 | 146 | 31 | 91 | 24 | numerical 57, mcq 20, data 16 | Yes, by layer |
| Chemistry XII 4a | 40 | 4 | 170 | 17 | 191 | 65 | 96 | 30 | statement 46, mcq 31, assertion 29 | Yes, by layer |
| Chemistry XII 4b | 40 | 3 | 156 | 7 | 166 | 68 | 74 | 24 | statement 36, mcq 27, assertion 24 | Yes, by layer |
| Chemistry XII 5a | 40 | 21 | 237 | 34 | 292 | 112 | 143 | 37 | mcq 60, statement 52, very-short 43 | Yes, by layer |
| Chemistry XII 6a | 40 | 4 | 185 | 9 | 198 | 84 | 85 | 29 | statement 42, mcq 37, assertion 28 | Yes, by layer |
| Chemistry XII 6b | 40 | 3 | 81 | 2 | 86 | 31 | 40 | 15 | statement 24, mistake 12, assertion 12 | Yes, by layer |
| Chemistry XII 6c | 40 | 8 | 34 | 0 | 42 | 15 | 19 | 8 | assertion 14, statement 8, mcq 7 | Yes, by layer |
| Chemistry XII 7a | 40 | 33 | 146 | 8 | 187 | 68 | 87 | 32 | mcq 41, statement 36, assertion 29 | Yes, by layer |
| Chemistry XII 7b | 40 | 4 | 125 | 10 | 139 | 53 | 66 | 20 | statement 30, mcq 28, assertion 20 | Yes, by layer |
| Chemistry XII 7c | 40 | 2 | 75 | 3 | 80 | 33 | 34 | 13 | statement 20, assertion 13, mcq 12 | Yes, by layer |
| Chemistry XII 8a | 40 | 6 | 175 | 8 | 189 | 76 | 85 | 28 | statement 40, mcq 34, assertion 28 | Yes, by layer |
| Chemistry XII 8b | 40 | 3 | 39 | 8 | 50 | 15 | 28 | 7 | assertion 13, mcq 9, statement 8 | Yes, by layer |
| Chemistry XII 9a | 40 | 7 | 161 | 10 | 178 | 69 | 84 | 25 | statement 38, mcq 33, assertion 24 | Yes, by layer |
| Chemistry XII 9b | 40 | 1 | 35 | 4 | 40 | 13 | 20 | 7 | assertion 12, statement 8, mcq 5 | Yes, by layer |
| Chemistry XII 9c | 40 | 2 | 82 | 12 | 96 | 28 | 51 | 17 | statement 28, mcq 16, mistake 14 | Yes, by layer |
| Chemistry XII 10a | 40 | 3 | 145 | 0 | 148 | 69 | 57 | 22 | statement 36, very-short 21, complete 20 | Yes, by layer |
| Chemistry XII 10b | 40 | 2 | 153 | 4 | 159 | 67 | 68 | 24 | statement 38, mcq 25, assertion 20 | Yes, by layer |
| Chemistry XII 10c | 40 | 5 | 37 | 0 | 42 | 17 | 18 | 7 | assertion 12, mcq 8, statement 8 | Yes, by layer |
| Chemistry XII 10d | 40 | 2 | 107 | 0 | 109 | 48 | 44 | 17 | statement 28, mcq 17, very-short 14 | Yes, by layer |
| Chemistry XII 11a | 40 | 19 | 26 | 0 | 45 | 16 | 19 | 10 | mcq 13, statement 8, very-short 5 | Yes, by layer |
| Chemistry XII 11b | 40 | 18 | 26 | 0 | 44 | 19 | 19 | 6 | mcq 14, statement 8, very-short 5 | Yes, by layer |
| Chemistry XII 11c | 40 | 21 | 25 | 0 | 46 | 16 | 24 | 6 | mcq 19, statement 8, mistake 5 | Yes, by layer |
| Chemistry XII 11d | 40 | 29 | 15 | 0 | 44 | 18 | 18 | 8 | mcq 24, reason 4, very-short 3 | Yes, by layer |
| Mathematics XI 1a | 40 | 14 | 94 | 82 | 190 | 91 | 67 | 32 | numerical 80, statement 24, mcq 17 | Yes, by layer |
| Mathematics XI 1b | 40 | 12 | 86 | 15 | 113 | 52 | 46 | 15 | mcq 25, statement 24, very-short 14 | Yes, by layer |
| Mathematics XI 1c | 40 | 18 | 90 | 68 | 176 | 91 | 67 | 18 | numerical 59, mcq 44, statement 22 | Yes, by layer |
| Mathematics XI 2a | 40 | 16 | 33 | 100 | 149 | 67 | 64 | 18 | numerical 88, short 17, mcq 13 | Yes, by layer |
| Mathematics XI 2b | 40 | 13 | 35 | 83 | 131 | 57 | 60 | 14 | numerical 82, mcq 14, assertion 12 | Yes, by layer |
| Mathematics XI 2c | 40 | 17 | 38 | 73 | 128 | 35 | 75 | 18 | numerical 73, mcq 12, assertion 12 | Yes, by layer |
| Mathematics XI 2d | 40 | 14 | 34 | 54 | 102 | 34 | 51 | 17 | numerical 61, assertion 12, statement 8 | Yes, by layer |
| Mathematics XI 2e | 40 | 18 | 41 | 110 | 169 | 78 | 75 | 16 | numerical 98, cbq 17, mcq 14 | Yes, by layer |
| Mathematics XI 3a | 40 | 16 | 75 | 104 | 195 | 95 | 70 | 30 | numerical 92, mcq 26, statement 20 | Yes, by layer |
| Mathematics XI 3b | 40 | 13 | 75 | 84 | 172 | 80 | 66 | 26 | numerical 78, mcq 20, statement 18 | Yes, by layer |
| Mathematics XI 3c | 40 | 12 | 91 | 74 | 177 | 79 | 73 | 25 | numerical 75, statement 20, mcq 19 | Yes, by layer |
| Mathematics XI 3d | 40 | 12 | 34 | 65 | 111 | 54 | 49 | 8 | numerical 75, assertion 12, statement 8 | Yes, by layer |
| Mathematics XI 4a | 40 | 21 | 35 | 101 | 157 | 64 | 75 | 18 | numerical 83, mcq 20, assertion 13 | Yes, by layer |
| Mathematics XI 5a | 40 | 14 | 36 | 103 | 153 | 61 | 75 | 17 | numerical 91, cbq 15, mcq 13 | Yes, by layer |
| Mathematics XI 5b | 40 | 14 | 78 | 74 | 166 | 79 | 58 | 29 | numerical 75, statement 22, mcq 21 | Yes, by layer |
| Mathematics XII 1a | 40 | 16 | 105 | 88 | 209 | 95 | 88 | 26 | numerical 70, mcq 34, statement 32 | Yes, by layer |
| Mathematics XII 1b | 40 | 15 | 83 | 63 | 161 | 52 | 71 | 38 | numerical 58, mcq 32, statement 24 | Yes, by layer |
| Mathematics XII 2a | 40 | 17 | 87 | 93 | 197 | 88 | 87 | 22 | numerical 73, statement 26, mcq 25 | Yes, by layer |
| Mathematics XII 2b | 40 | 18 | 81 | 106 | 205 | 49 | 105 | 51 | numerical 75, mcq 37, statement 24 | Yes, by layer |
| Mathematics XII 3a | 40 | 21 | 84 | 90 | 195 | 70 | 86 | 39 | numerical 86, mcq 31, statement 24 | Yes, by layer |
| Mathematics XII 3b | 40 | 50 | 88 | 110 | 248 | 74 | 116 | 58 | numerical 52, mcq 37, cbq 30 | Yes, by layer |
| Mathematics XII 3c | 40 | 42 | 83 | 61 | 186 | 72 | 87 | 27 | mcq 48, numerical 41, short 27 | Yes, by layer |
| Mathematics XII 3d | 40 | 14 | 71 | 52 | 137 | 48 | 65 | 24 | numerical 52, mcq 20, statement 18 | Yes, by layer |
| Mathematics XII 3e | 40 | 16 | 82 | 74 | 172 | 61 | 71 | 40 | numerical 50, statement 24, mcq 23 | Yes, by layer |
| Mathematics XII 4a | 40 | 18 | 105 | 101 | 224 | 91 | 97 | 36 | numerical 80, mcq 31, statement 30 | Yes, by layer |
| Mathematics XII 5a | 40 | 18 | 83 | 83 | 184 | 66 | 67 | 51 | numerical 66, statement 26, mcq 25 | Yes, by layer |
| Mathematics XII 6a | 40 | 14 | 94 | 95 | 203 | 61 | 99 | 43 | numerical 81, statement 26, mcq 25 | Yes, by layer |
| Mathematics XII 7a | 40 | 53 | 116 | 96 | 265 | 108 | 104 | 53 | numerical 61, mcq 44, statement 28 | Yes, by layer |
| Computer Science XI 1a | 40 | 6 | 98 | 102 | 206 | 91 | 79 | 36 | numerical 57, mcq 29, statement 28 | Yes, by layer |
| Computer Science XI 2a | 40 | 3 | 96 | 0 | 99 | 44 | 39 | 16 | statement 26, mcq 18, assertion 13 | Yes, by layer |
| Computer Science XI 3a | 40 | 4 | 82 | 32 | 118 | 49 | 49 | 20 | statement 24, convert 23, mcq 13 | Yes, by layer |
| Computer Science XI 3b | 40 | 2 | 34 | 28 | 64 | 30 | 22 | 12 | convert 23, assertion 12, mcq 10 | Yes, by layer |
| Computer Science XI 4a | 40 | 4 | 38 | 0 | 42 | 17 | 18 | 7 | assertion 12, statement 8, mcq 5 | Yes, by layer |
| Computer Science XI 5a | 40 | 1 | 100 | 7 | 108 | 46 | 45 | 17 | statement 28, very-short 15, mcq 14 | Yes, by layer |
| Computer Science XI 5b | 40 | 2 | 38 | 0 | 40 | 15 | 18 | 7 | assertion 12, statement 8, mcq 4 | Yes, by layer |
| Computer Science XI 6a | 40 | 4 | 96 | 21 | 121 | 50 | 54 | 17 | statement 28, mcq 25, very-short 17 | Yes, by layer |
| Computer Science XI 7a | 40 | 3 | 112 | 50 | 165 | 52 | 80 | 33 | mcq 31, statement 30, very-short 15 | Yes, by layer |
| Computer Science XI 8a | 40 | 5 | 111 | 155 | 271 | 87 | 135 | 49 | trace 53, statement 32, change 29 | Yes, by layer |
| Computer Science XI 9a | 40 | 3 | 99 | 55 | 157 | 47 | 74 | 36 | statement 30, very-short 16, mistake 15 | Yes, by layer |
| Computer Science XI 10a | 40 | 4 | 36 | 76 | 116 | 35 | 52 | 29 | trace 21, short 16, output 14 | Yes, by layer |
| Computer Science XI 11a | 40 | 5 | 36 | 0 | 41 | 16 | 18 | 7 | assertion 12, mcq 8, statement 8 | Yes, by layer |
| Computer Science XI 11b | 40 | 3 | 38 | 0 | 41 | 14 | 19 | 8 | assertion 12, statement 8, mcq 5 | Yes, by layer |
| Computer Science XI 12a | 40 | 6 | 38 | 11 | 55 | 25 | 23 | 7 | output 13, assertion 12, statement 8 | Yes, by layer |
| Computer Science XI 13a | 40 | 3 | 43 | 0 | 46 | 20 | 19 | 7 | assertion 12, statement 8, mcq 5 | Yes, by layer |
| Computer Science XII 1a | 40 | 3 | 95 | 42 | 140 | 69 | 49 | 22 | mcq 26, statement 26, convert 25 | Yes, by layer |
| Computer Science XII 1b | 40 | 52 | 136 | 76 | 264 | 104 | 98 | 62 | mcq 53, statement 34, convert 30 | Yes, by layer |
| Computer Science XII 2a | 40 | 2 | 90 | 40 | 132 | 61 | 48 | 23 | convert 30, mcq 29, statement 26 | Yes, by layer |
| Computer Science XII 2b | 40 | 4 | 120 | 5 | 129 | 51 | 53 | 25 | statement 34, mcq 22, mistake 17 | Yes, by layer |
| Computer Science XII 3a | 40 | 44 | 126 | 76 | 246 | 80 | 111 | 55 | statement 34, mcq 31, fill 21 | Yes, by layer |
| Computer Science XII 4a | 40 | 7 | 95 | 135 | 237 | 84 | 103 | 50 | trace 31, statement 26, fill 23 | Yes, by layer |
| Computer Science XII 4b | 40 | 4 | 82 | 46 | 132 | 47 | 60 | 25 | mcq 22, statement 22, output 14 | Yes, by layer |
| Computer Science XII 5a | 40 | 5 | 80 | 62 | 147 | 35 | 65 | 47 | statement 22, fill 17, output 16 | Yes, by layer |
| Computer Science XII 6a | 40 | 2 | 113 | 96 | 211 | 43 | 118 | 50 | output 43, statement 34, mistake 17 | Yes, by layer |
| Computer Science XII 6b | 40 | 2 | 95 | 24 | 121 | 34 | 57 | 30 | statement 32, mistake 16, mcq 15 | Yes, by layer |
| Computer Science XII 7a | 40 | 2 | 32 | 8 | 42 | 18 | 17 | 7 | assertion 12, output 9, statement 8 | Yes, by layer |
| Computer Science XII 7b | 40 | 2 | 33 | 16 | 51 | 21 | 23 | 7 | output 16, assertion 12, statement 8 | Yes, by layer |
| Computer Science XII 7c | 40 | 1 | 33 | 8 | 42 | 19 | 16 | 7 | assertion 12, statement 8, output 8 | Yes, by layer |
| Computer Science XII 8a | 40 | 4 | 109 | 39 | 152 | 61 | 64 | 27 | statement 30, mcq 28, very-short 19 | Yes, by layer |
| Computer Science XII 9a | 40 | 4 | 102 | 17 | 123 | 56 | 43 | 24 | statement 26, mcq 25, very-short 14 | Yes, by layer |
<!-- /bank-progress -->
