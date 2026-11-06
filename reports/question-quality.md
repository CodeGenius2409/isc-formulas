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
- **The facts are written by me, not checked against a textbook line by line.** The spot check read about 320 of the 1,484 blueprints. Definitions and reasons outside that sample were written from the syllabus and haven't been read a second time. Chemistry reactions and compounds come from verified data where the drawings are involved, but statements of fact are not machine-checkable. This is the main reason for the notice on every generated question.
- **A few MCQs have fewer than four options,** where only two or three make sense (a gate's output is 0 or 1).
- **Some content in the registry is beyond the usual ISC level.** For example, reduced mass appears in `p11-4b-collision`, because it's in the formula book.
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
