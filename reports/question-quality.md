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
- **The Java tracer doesn't run inheritance or interfaces.** Those model answers are the only Java in the generator that hasn't been run: `k12-6a-inherit-design` and `k12-6b-interface-write`. They were checked by reading.
- **Some content in the registry is beyond the usual ISC level.** For example, reduced mass appears in `p11-4b-collision`, because it's in the formula book.
- **No questions on the practical papers.** Those 11 files are set as experiments or programming tasks, and were recorded but not turned into blueprints.

## Reporting a problem

Each generated question has a "Report a problem" action, which saves the question, its seed and your comment on this device. Progress has a button to export them all as a file. Those reports, and the blueprint id in each, are the fastest way to fix a question.
