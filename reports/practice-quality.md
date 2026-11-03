# Practice quality

## The bank

530 original questions: 84 parameterised numericals with answers from the solver registry, and the rest multiple choice, marking-scheme questions and programs.

| Class | Questions | 1 mark | 2 marks | 3 marks | 5 marks | 10 marks | Parameterised | Assertion answers 1, 2, 3, 4 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Physics XI | 63 | 23 | 16 | 18 | 6 | 0 | 22 | 2, 1, 1, 1 |
| Physics XII | 90 | 33 | 23 | 25 | 9 | 0 | 27 | 6, 1, 1, 1 |
| Chemistry XI | 61 | 25 | 16 | 15 | 5 | 0 | 12 | 3, 0, 2, 1 |
| Chemistry XII | 81 | 35 | 22 | 17 | 7 | 0 | 11 | 5, 1, 1, 1 |
| Mathematics XI | 60 | 25 | 14 | 14 | 7 | 0 | 8 | 2, 0, 0, 1 |
| Mathematics XII | 79 | 32 | 14 | 18 | 15 | 0 | 4 | 3, 1, 0, 1 |
| Computer Science XI | 45 | 19 | 12 | 0 | 5 | 9 | 0 | 1, 0, 0, 0 |
| Computer Science XII | 51 | 19 | 14 | 0 | 7 | 11 | 0 | 1, 0, 1, 0 |

Every paper can be drawn from its own class's questions with none repeated, and a test builds each paper 20 times to check that.

## The quality gate

These are enforced by `tests/unit/bank.test.ts` and fail the build's test run.

- **No bare formula questions.** A question may not ask "what is the formula for X" or the like. The exception is a deliberate recall item, which is marked as such and capped at 5% of each class. The bank has 1, in Computer Science XII.
- **Marks add up.** Every marking scheme and every numerical's parts total the question's marks.
- **Tags are real.** Every question's unit and topic exist in the syllabus map from Task 7.
- **Numericals vary and are right.** Each is built 25 times. Each attempt must vary, solve through the registry, and accept its own answer when marked.
- **Programs run.** Every "write the output" Java program runs in the tracer's interpreter and prints what the bank says. Every Python one runs in real Python on this machine. Every model program with a `main` runs, apart from those using inheritance or files, which the interpreter lacks.
- **Hand-written answers are recalculated.** `tests/unit/bank-answers.test.ts` checks integrals, derivatives, matrices, K-maps and number conversions independently of the marking schemes.
- **Structures are verified ones.** A structure question can only use compounds from `reports/structures-report.md`.
- **Computer Science is code.** No maths-only markup, the same rule as Task 3.

## Originality

Each question's wording was compared with the text of all 95 papers. Of 530 questions, 373 share no run of 5 words or more, 84 share a run of 5, 48 share a run of 6, 14 share a run of 7, 8 share a run of 8, 1 share a run of 9, 1 share a run of 12, 1 share a run of 14. The longest runs are loop headers in code, and stock phrases such as "the rate constant of a first order reaction". I read every question sharing 8 or more words, and reworded the prose ones sharing 10 or more, though none was a copy. `tests/unit/bank-private.test.ts` now fails on any run of 10 words of prose. It can only run where the papers are, on this machine.

This catches copied wording. It would not catch a question that reuses a paper's exact idea and numbers in different words. Standard questions in these subjects do share ideas with the papers, as the brief expects. Fixed values in Mathematics and marking schemes are my own, and parameterised numericals get fresh values.

## Spot-check

40 questions per subject, drawn at random with a fixed seed (20261103), read by me against the paper analysis. For each I checked that it follows a pattern in the analysis, with marks a real paper gives that kind of question, that the tags are right, and that the answer is right. Model answers longer than about 400 characters were cut off in the listing I read, so the last points of those long answers were checked when writing, and by the tests where they apply, not again here. This was my own review of my own questions, so a teacher's eye would still be worth having.

**Problems the check found, all fixed before the tables below were drawn:**

- **Rounding.** Mathematics answers were rounded to three significant figures, so a term of 2048 showed as 2050. The solver now has an exact mode, used for Mathematics.
- **Missing units.** Two Mathematics rate answers had no unit, since the registry treats those quantities as pure numbers. The question now names the unit.
- **Wrong type.** A Computer Science XI question on wrapper classes was tagged as a program.
- **Wording.** One Physics derivation asked for "phasor reasoning". It now asks for a phasor diagram.

**Problems found while reviewing before the sample:**

- **Assertion and reason.** Every one had the first option as its answer, so a student could game them. About a third now have other answers, as the table above shows.
- **Mismatched text.** Two Physics XI questions asked for more than their parts covered.
- **A wrong method.** A Chemistry XII question found moles by a shortcut that did not use the molar mass. It now has a proper first step.
- **Figure label.** A label on the Wheatstone bridge sat on a wire.

### Physics

Types in the sample: numerical 12, mcq 10, derivation 9, short 3, reason 2, distinguish 2, assertion 2.

| # | Id | Class | Topic | Marks | Opens with | Pattern from the analysis | Result |
|---:|---|---|---|---:|---|---|---|
| 1 | `q-p11-10a-8voj55` | XI | Oscillations | 2 | A simple pendulum | Calculate, with working and units | Pass |
| 2 | `q-p11-6a-8il7v3` | XI | Gravity and its variation | 3 | Obtain the variation | Derive or obtain, marked by step | Pass |
| 3 | `q-p12-3a-1a7fwx9` | XII | Moving charges and magnetism | 2 | A galvanometer of | Calculate, with working and units | Pass |
| 4 | `q-p12-7a-1ts7gjo` | XII | Dual Nature of Radiation and Matter | 1 | A proton and | Section A multiple choice | Pass |
| 5 | `q-p11-3b-d743cr` | XI | Equilibrium and friction | 3 | A block of | Calculate, with working and units | Pass |
| 6 | `q-p11-7a-kljmtv` | XI | Mechanical Properties of Solids | 1 | Young’s modulus of | Section A multiple choice | Pass |
| 7 | `q-p11-4a-15vsumy` | XI | Work, energy and power | 2 | A pump lifts | Calculate, with working and units | Pass |
| 8 | `q-p12-1b-1s8x9u2` | XII | Electrostatic Potential, Potential Energy and Capacitance | 2 | Explain why the | Give reasons or explain why | Pass |
| 9 | `q-p12-3b-m46zox` | XII | Magnetism and Matter | 1 | Which of these | Section A multiple choice | Pass |
| 10 | `q-p11-3b-2o8by2` | XI | Equilibrium and friction | 2 | Explain why it | Give reasons or explain why | Pass |
| 11 | `q-p11-1a-12l71pr` | XI | Units and Measurements | 1 | How many significant | Section A multiple choice | Pass |
| 12 | `q-p12-4a-qjhb79` | XII | Electromagnetic Induction | 2 | A straight conductor | Calculate, with working and units | Pass |
| 13 | `q-p11-3a-vc8q2w` | XI | Newton's laws and momentum | 3 | State Newton’s second | Derive or obtain, marked by step | Pass |
| 14 | `q-p12-4b-13h2j74` | XII | Alternating Current | 5 | For a series | Derive or obtain, marked by step | Pass |
| 15 | `q-p11-2b-hl7u58` | XI | Motion in a Plane | 1 | For a projectile | Section A multiple choice | Pass |
| 16 | `q-p12-1b-18p47jr` | XII | Electrostatic Potential, Potential Energy and Capacitance | 2 | Find the electric | Calculate, with working and units | Pass |
| 17 | `q-p11-1b-5hop1i` | XI | Dimensions | 2 | Use dimensions to | Short answer or evaluate, marked by point | Pass |
| 18 | `q-p11-2b-4gjq10` | XI | Motion in a Plane | 5 | A projectile is | Derive or obtain, marked by step | Pass |
| 19 | `q-p12-1a-14bui94` | XII | Electric Charges and Fields | 5 | Obtain an expression | Derive or obtain, marked by step | Pass |
| 20 | `q-p11-7c-1iorgn1` | XI | Surface tension | 1 | A liquid wets | Section A multiple choice | Pass |
| 21 | `q-p12-9a-15mv6rw` | XII | Semiconductor Electronics | 3 | Distinguish between conductors, | Distinguish between | Pass |
| 22 | `q-p12-1a-1sf8ar0` | XII | Electric Charges and Fields | 3 | An electric dipole | Calculate, with working and units | Pass |
| 23 | `q-p11-10a-mp7k0y` | XI | Oscillations | 5 | Show that the | Derive or obtain, marked by step | Pass |
| 24 | `q-p12-3a-sflbda` | XII | Moving charges and magnetism | 3 | Use Ampere’s circuital | Derive or obtain, marked by step | Pass |
| 25 | `q-p12-3b-krkifx` | XII | Magnetism and Matter | 3 | Define magnetic susceptibility, | Short answer or evaluate, marked by point | Pass |
| 26 | `q-p11-3c-dgh1ad` | XI | Circular motion | 1 | Assertion: A cyclist | Assertion and reason, with the board’s four options | Pass |
| 27 | `q-p11-2b-18ssxci` | XI | Motion in a Plane | 2 | A ball is | Calculate, with working and units | Pass |
| 28 | `q-p11-2a-vxms1t` | XI | Motion in a Straight Line | 2 | A car moving | Calculate, with working and units | Pass |
| 29 | `q-p12-3b-d8mcbv` | XII | Magnetism and Matter | 2 | Distinguish between diamagnetic | Distinguish between | Pass |
| 30 | `q-p12-1b-o9e579` | XII | Electrostatic Potential, Potential Energy and Capacitance | 1 | A parallel plate | Section A multiple choice | Pass |
| 31 | `q-p12-6a-kpuili` | XII | Ray Optics | 1 | Assertion: Violet light | Assertion and reason, with the board’s four options | Pass |
| 32 | `q-p12-6a-1swsy7` | XII | Ray Optics | 1 | A ray passes | Section A multiple choice | Pass |
| 33 | `q-p11-10a-1s0f9x4` | XI | Oscillations | 3 | A particle of | Calculate, with working and units | Pass |
| 34 | `q-p12-2b-1z0xnc4` | XII | Cells, Kirchhoff's laws and bridges | 5 | Use Kirchhoff’s rules | Derive or obtain, marked by step | Pass |
| 35 | `q-p12-8a-1b9um2w` | XII | Atoms | 1 | The Balmer series | Section A multiple choice | Pass |
| 36 | `q-p11-8b-1k6ti9k` | XI | Thermodynamics | 5 | Obtain the work | Derive or obtain, marked by step | Pass |
| 37 | `q-p11-8b-10ob6vy` | XI | Thermodynamics | 3 | A Carnot engine | Calculate, with working and units | Pass |
| 38 | `q-p12-8b-gbkled` | XII | Nuclei | 2 | A radioactive sample | Calculate, with working and units | Pass |
| 39 | `q-p11-5c-104arks` | XI | Moment of inertia | 1 | The moment of | Section A multiple choice | Pass |
| 40 | `q-p12-7a-7aa3q4` | XII | Dual Nature of Radiation and Matter | 3 | State three features | Short answer or evaluate, marked by point | Pass |

### Chemistry

Types in the sample: mcq 13, short 9, reaction 6, numerical 4, assertion 4, reason 2, derivation 2.

| # | Id | Class | Topic | Marks | Opens with | Pattern from the analysis | Result |
|---:|---|---|---|---:|---|---|---|
| 1 | `q-c12-6a-9kbchi` | XII | Haloalkanes | 1 | Name the reaction | Section A multiple choice | Pass |
| 2 | `q-c11-8b-dq4h7x` | XI | Purification and analysis | 3 | Describe the principle | Short answer or evaluate, marked by point | Pass |
| 3 | `q-c12-4a-vgp6ed` | XII | Transition elements, lanthanoids and actinoids | 2 | Give reasons. (a) | Give reasons or explain why | Pass |
| 4 | `q-c12-8a-19gan98` | XII | Aldehydes and Ketones | 1 | Which compound gives | Section A multiple choice | Pass |
| 5 | `q-c12-5a-ddr3bp` | XII | Coordination Compounds | 2 | Use valence bond | Short answer or evaluate, marked by point | Pass |
| 6 | `q-c12-7b-174z4ui` | XII | Phenols | 2 | How is phenol | Reaction, conversion, or name the test | Pass |
| 7 | `q-c11-1c-1pz6xqf` | XI | Chemical equivalents and volumetric calculations | 3 | 150 mL of | Calculate, with working and units | Pass |
| 8 | `q-c12-7b-pdsx5m` | XII | Phenols | 1 | Which is the | Section A multiple choice | Pass |
| 9 | `q-c11-3a-1drqsv5` | XI | Periodic law and periodic trends | 1 | Across a period | Section A multiple choice | Pass |
| 10 | `q-c12-7a-1h0giff` | XII | Alcohols | 3 | Write the mechanism | Reaction, conversion, or name the test | Pass |
| 11 | `q-c11-9c-yu8cm7` | XI | Alkynes | 3 | Show how ethyne | Short answer or evaluate, marked by point | Pass |
| 12 | `q-c11-1b-19ko91l` | XI | Mole concept and stoichiometry | 1 | The number of | Section A multiple choice | Pass |
| 13 | `q-c11-5a-zegl49` | XI | Systems and the First Law | 1 | Which is a | Section A multiple choice | Pass |
| 14 | `q-c11-6a-119zar4` | XI | Chemical Equilibrium | 1 | For N₂ + | Section A multiple choice | Pass |
| 15 | `q-c12-6b-1t7wvt9` | XII | Haloarenes | 2 | Give reasons. (a) | Give reasons or explain why | Pass |
| 16 | `q-c11-9d-xio2kg` | XI | Aromatic Hydrocarbons | 2 | How is benzene | Reaction, conversion, or name the test | Pass |
| 17 | `q-c12-9a-18tmouy` | XII | Aliphatic Amines and Aniline | 3 | How will you | Reaction, conversion, or name the test | Pass |
| 18 | `q-c11-6a-zz9vdb` | XI | Chemical Equilibrium | 5 | For PCl₅ ⇌ | Derive or obtain, marked by step | Pass |
| 19 | `q-c12-8a-1nfjlrw` | XII | Aldehydes and Ketones | 2 | Write what happens, | Reaction, conversion, or name the test | Pass |
| 20 | `q-c11-2b-3m5hxe` | XI | Quantum numbers and electronic configuration | 1 | Which set of | Section A multiple choice | Pass |
| 21 | `q-c11-4a-gvswhe` | XI | Ionic and covalent bonding | 1 | Which has the | Section A multiple choice | Pass |
| 22 | `q-c11-8a-uov245` | XI | Classification, nomenclature and isomerism | 2 | Write the IUPAC | Short answer or evaluate, marked by point | Pass |
| 23 | `q-c12-1a-ssw4nd` | XII | Solutions and colligative properties | 1 | Assertion: A solution | Assertion and reason, with the board’s four options | Pass |
| 24 | `q-c11-1b-lhji67` | XI | Mole concept and stoichiometry | 3 | A 4 g | Calculate, with working and units | Pass |
| 25 | `q-c11-5b-u6ea3v` | XI | Second and Third Laws | 2 | For a reaction, | Calculate, with working and units | Pass |
| 26 | `q-c11-6b-qv2w1y` | XI | Ionic equilibrium | 1 | Assertion: Aqueous sodium | Assertion and reason, with the board’s four options | Pass |
| 27 | `q-c11-5a-xrto7c` | XI | Systems and the First Law | 3 | 2 mol of | Calculate, with working and units | Pass |
| 28 | `q-c11-4b-1yzy0r5` | XI | VSEPR, hybridisation and molecular orbitals | 2 | Using VSEPR theory, | Short answer or evaluate, marked by point | Pass |
| 29 | `q-c12-2a-1q2xfqq` | XII | Cells and potentials | 1 | In a galvanic | Section A multiple choice | Pass |
| 30 | `q-c12-2c-6oc8cm` | XII | Batteries and corrosion | 1 | Which of these | Section A multiple choice | Pass |
| 31 | `q-c11-3a-1mzufce` | XI | Periodic law and periodic trends | 1 | Which has the | Section A multiple choice | Pass |
| 32 | `q-c12-8a-nulxiq` | XII | Aldehydes and Ketones | 5 | Explain the following, | Reaction, conversion, or name the test | Pass |
| 33 | `q-c12-3b-1a7t3rj` | XII | Collision theory and activation energy | 1 | Assertion: A catalyst | Assertion and reason, with the board’s four options | Pass |
| 34 | `q-c12-2b-143vmpn` | XII | Conductance and electrolysis | 2 | State Kohlrausch’s law, | Short answer or evaluate, marked by point | Pass |
| 35 | `q-c11-4b-l3nf8s` | XI | VSEPR, hybridisation and molecular orbitals | 5 | Explain the hybridisation | Short answer or evaluate, marked by point | Pass |
| 36 | `q-c11-8c-hod12w` | XI | Electronic effects and reaction types | 1 | Assertion: A primary | Assertion and reason, with the board’s four options | Pass |
| 37 | `q-c11-8c-119b7u5` | XI | Electronic effects and reaction types | 2 | Explain what is | Short answer or evaluate, marked by point | Pass |
| 38 | `q-c12-3a-10tmoey` | XII | Rate, order and integrated rate equations | 5 | Derive the integrated | Derive or obtain, marked by step | Pass |
| 39 | `q-c12-5a-14cfvzc` | XII | Coordination Compounds | 1 | The type of | Section A multiple choice | Pass |
| 40 | `q-c12-5a-1raluqn` | XII | Coordination Compounds | 3 | For [CoF₆]³⁻ and | Short answer or evaluate, marked by point | Pass |

### Mathematics

Types in the sample: short 15, mcq 13, numerical 6, proof 3, assertion 2, definition 1.

| # | Id | Class | Topic | Marks | Opens with | Pattern from the analysis | Result |
|---:|---|---|---|---:|---|---|---|
| 1 | `q-m11-2e-2c4l2x` | XI | Sequence and Series | 3 | A geometric progression | Calculate, with working and units | Pass |
| 2 | `q-m12-2b-8kiins` | XII | Determinants | 2 | Without expanding, show | Prove or show that, marked by step | Pass |
| 3 | `q-m11-2c-1r3zh03` | XI | Permutations and Combinations | 1 | In how many | Section A multiple choice | Pass |
| 4 | `q-m11-3d-1jioyer` | XI | Introduction to three-dimensional Geometry | 1 | A point on | Section A multiple choice | Pass |
| 5 | `q-m12-3a-keb224` | XII | Continuity, Differentiability and Differentiation | 1 | The derivative of | Section A multiple choice | Pass |
| 6 | `q-m11-5b-g6c906` | XI | Probability | 2 | For events A | Calculate, with working and units | Pass |
| 7 | `q-m12-3c-1fkspf9` | XII | Integrals | 5 | Evaluate \int_0^{\pi/2}\log(\sin x)\,dx. | Short answer or evaluate, marked by point | Pass |
| 8 | `q-m11-5b-1e1oqj9` | XI | Probability | 1 | A fair die | Section A multiple choice | Pass |
| 9 | `q-m12-6a-1e478eh` | XII | Linear Programming | 2 | In a linear | Define or state | Pass |
| 10 | `q-m11-2c-wiid19` | XI | Permutations and Combinations | 2 | How many 3-letter | Short answer or evaluate, marked by point | Pass |
| 11 | `q-m11-1c-1hh9xed` | XI | Trigonometry | 1 | The value of | Section A multiple choice | Pass |
| 12 | `q-m11-4a-1nugdkk` | XI | Limits and Derivatives | 2 | Evaluate \lim_{x\to 2}\dfrac{x^2 | Short answer or evaluate, marked by point | Pass |
| 13 | `q-m12-3a-extz6r` | XII | Continuity, Differentiability and Differentiation | 3 | If y = | Short answer or evaluate, marked by point | Pass |
| 14 | `q-m12-3d-1ui8yd1` | XII | Application of Integrals | 3 | Find the area | Short answer or evaluate, marked by point | Pass |
| 15 | `q-m12-7a-agpwiq` | XII | Probability | 2 | For two events, | Calculate, with working and units | Pass |
| 16 | `q-m12-3a-12pejuj` | XII | Continuity, Differentiability and Differentiation | 1 | Assertion: Every continuous | Assertion and reason, with the board’s four options | Pass |
| 17 | `q-m12-2b-mvowos` | XII | Determinants | 3 | Solve by Cramer’s | Short answer or evaluate, marked by point | Pass |
| 18 | `q-m11-5a-t8h1h5` | XI | Statistics | 5 | For the data | Short answer or evaluate, marked by point | Pass |
| 19 | `q-m11-2a-3n3dh8` | XI | Complex Numbers | 2 | Find the modulus | Calculate, with working and units | Pass |
| 20 | `q-m12-5a-1ar0nof` | XII | Three-dimensional Geometry | 1 | The direction cosines | Section A multiple choice | Pass |
| 21 | `q-m12-4a-911vdi` | XII | Vector Algebra | 1 | Assertion: If \vec | Assertion and reason, with the board’s four options | Pass |
| 22 | `q-m11-5b-1n3ap2s` | XI | Probability | 1 | If P(A) = | Section A multiple choice | Pass |
| 23 | `q-m12-3b-zexzne` | XII | Applications of Derivatives | 2 | The radius of | Calculate, with working and units | Pass |
| 24 | `q-m12-7a-1puxf9a` | XII | Probability | 1 | Two fair dice | Section A multiple choice | Pass |
| 25 | `q-m11-1b-5h0cis` | XI | Relations & Functions | 3 | Let f(x) = | Short answer or evaluate, marked by point | Pass |
| 26 | `q-m12-3e-7zi9u9` | XII | Differential Equations | 2 | Solve the differential | Short answer or evaluate, marked by point | Pass |
| 27 | `q-m11-5a-8vussf` | XI | Statistics | 3 | Find the variance | Short answer or evaluate, marked by point | Pass |
| 28 | `q-m12-2a-3frlqr` | XII | Matrices | 3 | For A = | Prove or show that, marked by step | Pass |
| 29 | `q-m12-1a-6c52yx` | XII | Types of relations and functions | 3 | On the integers, | Prove or show that, marked by step | Pass |
| 30 | `q-m12-2a-1e6q12v` | XII | Matrices | 1 | For any skew-symmetric | Section A multiple choice | Pass |
| 31 | `q-m12-2b-z0w0oj` | XII | Determinants | 1 | If A is | Section A multiple choice | Pass |
| 32 | `q-m11-1a-1uduvq5` | XI | Sets | 2 | In a class | Short answer or evaluate, marked by point | Pass |
| 33 | `q-m12-2b-dd83d6` | XII | Determinants | 1 | If A is | Section A multiple choice | Pass |
| 34 | `q-m11-3b-bunctt` | XI | Circles | 5 | Find the equation | Short answer or evaluate, marked by point | Pass |
| 35 | `q-m11-2e-1j29jjb` | XI | Sequence and Series | 5 | The 3rd and | Short answer or evaluate, marked by point | Pass |
| 36 | `q-m12-6a-1cbjhy4` | XII | Linear Programming | 5 | A firm makes | Short answer or evaluate, marked by point | Pass |
| 37 | `q-m12-3b-yuw0uc` | XII | Applications of Derivatives | 3 | A spherical balloon’s | Calculate, with working and units | Pass |
| 38 | `q-m11-4a-1h9xq9x` | XI | Limits and Derivatives | 5 | Evaluate (a) \lim_{x\to | Short answer or evaluate, marked by point | Pass |
| 39 | `q-m12-6a-1h8v50q` | XII | Linear Programming | 1 | In a linear | Section A multiple choice | Pass |
| 40 | `q-m11-3c-9rdyb5` | XI | Conic Section | 1 | The focus of | Section A multiple choice | Pass |

### Computer Science

Types in the sample: mcq 19, short 9, program 4, output 3, complete 2, error 1, definition 1, assertion 1.

| # | Id | Class | Topic | Marks | Opens with | Pattern from the analysis | Result |
|---:|---|---|---|---:|---|---|---|
| 1 | `q-k12-7a-1g9gonn` | XII | Strings | 1 | In Python, what | Section A multiple choice | Pass |
| 2 | `q-k11-2a-i7rtes` | XI | Encodings | 1 | How many bits | Section A multiple choice | Pass |
| 3 | `q-k11-7a-x8hnq7` | XI | Variables, Expressions | 1 | The value of | Section A multiple choice | Pass |
| 4 | `q-k11-8a-175c93g` | XI | Statements, Scope | 2 | This loop should | Find the error | Pass |
| 5 | `q-k12-6a-ah0jq5` | XII | Inheritance | 1 | Which keyword makes | Section A multiple choice | Pass |
| 6 | `q-k12-6b-1mf5vj3` | XII | Interfaces in Java (Only Conceptual) | 2 | What is an | Define or state | Pass |
| 7 | `q-k12-1b-1kjyhlz` | XII | Boolean algebra and Karnaugh maps | 2 | Simplify F = | Short answer or evaluate, marked by point | Pass |
| 8 | `q-k12-8a-1b2q911` | XII | Binary trees [Conceptual] | 1 | In a binary | Section A multiple choice | Pass |
| 9 | `q-k12-4a-1un5xrw` | XII | Arrays | 1 | If int a[] | Section A multiple choice | Pass |
| 10 | `q-k11-6a-1jvo14e` | XI | Primitive values, Wrapper classes, Types and casting | 10 | (a) Name the | Short answer or evaluate, marked by point | Pass |
| 11 | `q-k12-1b-1onbzu9` | XII | Boolean algebra and Karnaugh maps | 1 | Assertion: NAND is | Assertion and reason, with the board’s four options | Pass |
| 12 | `q-k11-11a-9umvnh` | XI | Basic input/output using Scanner class | 1 | Which Scanner method | Section A multiple choice | Pass |
| 13 | `q-k11-13a-vtpdbu` | XI | Trends in computing and ethical issues | 1 | Using someone’s work | Section A multiple choice | Pass |
| 14 | `q-k11-8a-fxnmlt` | XI | Statements, Scope | 2 | Complete the method | Complete the program | Pass |
| 15 | `q-k11-3a-al7a71` | XI | Propositional logic | 1 | Which proposition is | Section A multiple choice | Pass |
| 16 | `q-k11-2a-19zkoah` | XI | Encodings | 10 | (a) Compare ASCII, | Short answer or evaluate, marked by point | Pass |
| 17 | `q-k12-3a-pdy5l7` | XII | Methods | 10 | Design a class | Design a class or write a program | Pass |
| 18 | `q-k12-5a-3vje87` | XII | Recursion | 1 | Which part of | Section A multiple choice | Pass |
| 19 | `q-k12-1a-169h8zk` | XII | Propositional logic | 1 | The dual of | Section A multiple choice | Pass |
| 20 | `q-k12-7b-1wn82sm` | XII | Lists | 1 | In Python, which | Section A multiple choice | Pass |
| 21 | `q-k11-7a-14xz4qj` | XI | Variables, Expressions | 2 | Write the output | Write the output | Pass |
| 22 | `q-k12-5a-1i72ao8` | XII | Recursion | 2 | Complete the recursive | Complete the program | Pass |
| 23 | `q-k11-5b-tg3218` | XI | Errors and exceptions | 1 | Dividing an integer | Section A multiple choice | Pass |
| 24 | `q-k12-8a-zghtuv` | XII | Binary trees [Conceptual] | 5 | Insert 50, 30, | Short answer or evaluate, marked by point | Pass |
| 25 | `q-k11-1a-1tquz8d` | XI | System of Numeration | 1 | The binary number | Section A multiple choice | Pass |
| 26 | `q-k12-6a-1048v2k` | XII | Inheritance | 10 | A class Account | Design a class or write a program | Pass |
| 27 | `q-k12-4b-1rfy34n` | XII | String handling | 1 | What does "COMPUTER".substring(3, | Section A multiple choice | Pass |
| 28 | `q-k11-1a-1s09pud` | XI | System of Numeration | 10 | Show your working. | Short answer or evaluate, marked by point | Pass |
| 29 | `q-k11-4a-q2n8w` | XI | Introduction | 1 | Bundling data and | Section A multiple choice | Pass |
| 30 | `q-k11-10a-1pt3iif` | XI | Arrays, Strings | 1 | The length of | Section A multiple choice | Pass |
| 31 | `q-k12-2a-ba74p4` | XII | Logic gates | 2 | Write the sum | Short answer or evaluate, marked by point | Pass |
| 32 | `q-k12-4b-g6tnfs` | XII | String handling | 10 | Design a class | Design a class or write a program | Pass |
| 33 | `q-k11-9a-2e1rdk` | XI | Methods and Constructors | 2 | Write the output | Write the output | Pass |
| 34 | `q-k11-3b-jvpnh0` | XI | Logic and hardware | 10 | (a) Draw the | Short answer or evaluate, marked by point | Pass |
| 35 | `q-k11-10a-jnydgn` | XI | Arrays, Strings | 10 | Write a program | Design a class or write a program | Pass |
| 36 | `q-k11-12a-3tn5wj` | XI | Introduction to Python | 5 | Write the output | Write the output | Pass |
| 37 | `q-k12-9a-1v6evz7` | XII | Complexity and Big O notation | 5 | Compare O(1), O(\log | Short answer or evaluate, marked by point | Pass |
| 38 | `q-k12-3a-stub3p` | XII | Methods | 1 | Which keyword refers | Section A multiple choice | Pass |
| 39 | `q-k11-1a-16qeh6k` | XI | System of Numeration | 2 | Find the 8-bit | Short answer or evaluate, marked by point | Pass |
| 40 | `q-k11-9a-6kck44` | XI | Methods and Constructors | 1 | A constructor has | Section A multiple choice | Pass |

## What the bank doesn't do

- **Figures.** Three circuits are generated from a question's own values. Questions needing a ray diagram, a graph to read or a logic diagram to read were skipped, not drawn from memory. So circuit and optics figures are under-represented compared with real papers. Reaction questions asking for structures use the verified drawings only.
- **Mathematics numericals.** Few Mathematics questions are parameterised (12), because most of its registry entries are simple formulas, while its real questions need working in algebra. The others have fixed values and marking schemes.
- **Self-marking.** Written answers are marked by the student, so a generous student gets a generous mark.
- **The tracer.** Model programs using inheritance or file handling aren't run, because the tracer's interpreter lacks them. They were read but not executed.
