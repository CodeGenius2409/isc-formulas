# Follow-up task (v6): a much bigger and more varied question supply

This continues my ISC formula app after v5. Before changing anything:
1. Read `README.md`, `DESIGN.md`, `DECISIONS.md`, `reports/question-analysis.md`, `reports/question-quality.md` and `git log`.
2. Confirm v5 is merged into `master`. If not, stop and tell me.
3. Create a new branch `v6-question-supply` from `master` and do all the work there.
4. Run the app and tests so you know the starting state, and **measure the current supply** (see "Measure first" below).

**The problem:**
1. **Many times it can't make enough questions for my filters.** When I choose a subject, chapter, subtopic, format or difficulty, it often says there isn't enough material, or gives fewer questions than I asked for. With any reasonable combination of filters, there must be enough material to fill the request many times over, not just once. (v5 Task 7 makes sure the requested count is always delivered; v6 must make sure that's done with **genuinely matching, high-quality questions**, not by stretching into related topics.)
2. In practice, the question generator and mock papers, the question supply (bank, generated and previous-year-style questions together) feels too small. Questions and question *types* repeat too soon. This applies to theory **and to numericals**: numericals with new values but the same structure still feel repetitive.
3. **The question bank itself, the finished questions that are not generated, must be really large too**, not just the generator.

**The approach:** no runtime AI and no online API. Everything stays offline and free. You (Claude Code) write a lot more material now, every piece is checked automatically and reviewed, and it ships in the app. Then the generator gets many more *ways* of asking, so the same material produces far more distinct questions.

Keep the design system, keep `papers/` and `data-private/` private, don't break existing features, everything offline, tests for everything. Work autonomously in one continuous run, in the order of the tasks below. Commit after each task and **after each batch** of new material, with a note in `DECISIONS.md`. If interrupted, I'll start a new session with this prompt: check `git status`, `git log`, `DECISIONS.md` and the progress tables, then continue from where you stopped.

**Priority:** all four subjects, but within each subject work on topics in order of how often they're asked in the papers (from `reports/question-analysis.md`), so the most important topics grow first.

---

## Task 0. Measure first

Write a script that measures, for each subject, class, chapter and subtopic:
- the number of blueprints, bank questions and facts,
- **distinct structures** (blueprint × unknown quantity × format × context type, not just different numbers),
- how many questions can be produced before a **structure** repeats, and before an identical question repeats,
- a **variety score**: how similar consecutive generated questions are (wording and structure), averaged.

Save the results as `reports/supply-before.md`. Re-run at the end as `reports/supply-after.md`, with a comparison table, so the improvement is visible.

## Task 1. Huge variety in numerical questions

Numericals must not just change the numbers. Every numerical topic should be able to ask in many genuinely different ways. For each numerical subtopic in Physics, Chemistry and Maths (and number-based CS topics), add blueprint variants and generator features covering, wherever they make sense for that topic:

- **Different unknowns:** solve for every quantity in the relationship, not just the usual one.
- **Different givens:** data in words, in a table, read from a graph, read from a diagram (Physics figures from v4), or given indirectly (for example "the car stops in 4 s" instead of "a = …").
- **Unit conversions built in:** givens in non-SI or mixed units (cm, g, km/h, mA, μF, eV, atm, mmHg, °C, kcal), requiring conversion.
- **Multi-step and chained:** part (a) feeds part (b), or two formulas from the same chapter must be combined.
- **Cross-topic:** combine two topics that are commonly linked in the papers (for example energy and circular motion, stoichiometry and gas laws, probability and permutations).
- **Proportional reasoning:** "By what factor does X change if Y is doubled and Z halved?", ratios, and percentage change.
- **Graph-based:** find the gradient or the area under a graph, sketch or choose the correct graph, or interpret an intercept.
- **Reverse problems:** give the result and find the starting condition.
- **Comparison:** "Which of these produces the larger…?", ranking several cases.
- **Limiting and special cases**, estimation and order-of-magnitude, significant figures and scientific notation.
- **Error and uncertainty:** percentage error and propagation, where the syllabus includes it.
- **"Find the mistake":** a worked solution with one realistic error to spot and correct.
- **Realistic contexts:** a large, original scenario bank per topic (vehicles, sport, space, medicine, industry, household appliances, environment, labs), so the same physics or chemistry appears in many different situations. No context should appear in more than a small share of the questions for a topic.

**Targets**, per numerical subtopic: at least **10 distinct structures**, at least **8 context types**, and **no structure repeating within any 10 consecutive questions** from that subtopic. Every answer is computed by the solver, unit-checked and range-checked, as before.

**Rotation:** when generating a set or paper, rotate structures, formats and contexts so consecutive questions look and feel different, not just numerically different.

## Task 2. New ways to ask, from the same material

Add new question **formats** to the generator. Each one can use the existing facts, blueprints and the structure, Java and Boolean engines, so each multiplies the supply. Add them only where they fit ISC and CBQ style, and tag each one as paper-style or CBQ-style:

- **Which statement is incorrect / correct?** (built from true facts plus realistic false versions)
- **Match the columns** (concept ↔ definition, compound ↔ structure, quantity ↔ unit, graph ↔ relationship)
- **Find the mistake** in a worked solution, a reasoning chain, a chemical equation or a Java program
- **Complete the statement or table**
- **Arrange in order** (acidity, reactivity, energy, size, steps of a process or algorithm)
- **Odd one out**, with the reason
- **Read a graph or data table**, then answer (CBQ-style)
- **Case or passage-based sets** built from a short original scenario with three to five linked sub-questions (CBQ-style)
- **Predict and explain** (what happens if…, and why)
- **Computer Science:** predict the output after a small change to a program, trace a variable's values through a loop, fill in the missing line, count the loop iterations, and convert between Boolean expression, truth table and logic circuit.

Update the teacher generator's format filter, the mock paper mix, and unit practice to use the new formats, in realistic proportions taken from the paper analysis.

## Task 3. Write a much bigger bank of material

Write new material in **batches**, most-asked topics first, for all four subjects:
- **New blueprints:** fill gaps found by the Task 0 measurement and the coverage report, and reach the Task 1 targets.
- **New facts:** go beyond v5's expansion for the most-asked topics, adding more facts, more links between facts, and more realistic false versions for the "which is incorrect" and assertion–reason formats.
- **New bank questions:** see Task 3B. The bank is a priority in its own right, not an extra.

**Every piece is checked before it ships:**
- numericals by the solver, the dimension checker and range checks,
- Java answers by running them in the tracer,
- Boolean answers by an exact algorithm,
- chemical structures by the formula, valence-electron and VSEPR checks,
- facts and theory by the review process from v5 (marked `reviewed` only once checked, otherwise shown as "Not yet reviewed"),
- and the local **novelty check** against the papers (nothing too close to a real question).

**After each batch:** commit, and update a progress table in `reports/question-quality.md` (topics, what was added, problems found, total so far).

## Task 3B. A really large question bank (not generated)

The bank is the set of **finished, fixed questions** with full model answers and marking schemes, written in advance, not produced by templates at runtime. It must be large on its own, so practice and mock papers work well even with the generated-share slider at 0%.

- **Targets per subtopic** (every subtopic in the 2028 syllabus map, for all four subjects):
  - at least **40 bank questions** per subtopic, and at least **80** for the most-asked subtopics (top 25% by paper frequency),
  - spread across **every format that fits the subtopic** (MCQ, assertion–reason, very short, short and long answer, numerical, derivation or proof, give reasons, distinguish between, diagram-based, CBQ or case-based sets, and for CS: write the output, find the error, program writing), in roughly the proportions seen in the papers,
  - spread across **easy, medium and hard**, and across **paper-style and CBQ-style**,
  - covering **every learning point** in that subtopic's syllabus wording, not just the popular ones.
- **Quality:** write them as an experienced ISC examiner would, original, not copied or lightly reworded from the papers, with model answers in marking-scheme style and a mark breakdown. Long answers and derivations should be full and correct. Physics questions get figures where useful (v4/v5 figures). Chemistry uses verified structures. CS output answers are produced by running the code.
- **Every bank question is fully reviewed before it ships.** Unlike generated questions, no bank question goes out marked "Not yet reviewed". Numericals are checked by the solver, Java by the tracer, structures by their checks, and facts by the review process. All pass the novelty check against the papers.
- **Labelling:** bank questions are not marked "Generated". They keep a small, calm note that they're original practice questions, not official ISC questions.
- **Filters must always be fillable from the bank:** for any single subtopic with any single fitting format and any difficulty, the bank alone must provide at least **10** distinct questions. Report every combination that falls short, and fill it.
- **Previous-year questions:** don't ship the real paper questions in the public app (they belong to CISCE and the school). The bank should cover the same ground and patterns with original questions instead.
- Store the bank as data lazy-loaded per subject and chapter, so the first load stays fast. Write it in batches (most-asked subtopics first), commit after each batch, and keep a progress table (subtopic, count by format and difficulty, reviewed yes or no) in `reports/question-quality.md`.

## Task 4. Make it feel fresh in use

- **Never repeat a structure or fact too soon** for the same person (build on v5's 7-day fact rule): track structures as well as facts, and prefer the least recently seen.
- **Within one paper or set,** no two questions share a structure *and* a context.
- **Mock papers:** with the same settings, two consecutive mock papers should share almost nothing. Report the measured overlap.
- **Keep the full count, with matching questions:** as in v5 Task 7, always deliver the full number of questions requested. After v6, the "related subtopics" fallback should almost never be needed.
- **Filter stress test (permanent test):** for every subtopic × every fitting format × every difficulty, and for multi-subtopic and whole-chapter selections, at slider settings 0%, 50% and 100%, request 10, 20 and 40 questions. Every request must be filled **entirely from questions that exactly match the filters**, all distinct. Report any combination that needed the fallback, and add material until none do (or explain why a combination genuinely can't exist).

---

## Done means

All tasks done on `v6-question-supply`, with `reports/supply-after.md` showing the before and after comparison (structures, formats, facts, **bank size per subtopic, format and difficulty**, repeat distances, variety score, and the filter stress-test results per subject and topic). All tests pass, including the full browser run, with no console errors and offline still working. Bundle size before and after is reported, and data is lazy-loaded per subject so first load stays fast. Then:
- run `npm run build` and confirm `git ls-files papers data-private` prints nothing,
- merge `v6-question-supply` into `master` (don't push),
- and give me a short summary: how much bigger and more varied the supply is, which topics are still thin, and the exact Windows commands to push and deploy.
