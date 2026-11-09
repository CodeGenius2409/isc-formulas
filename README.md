# ISC Formula Book

Every ISC 2028 formula for Physics, Chemistry, Mathematics and Computer Science, with a
problem solver, practice with spaced repetition, and simulators. It installs as an app
and works with no network after the first visit.

7,822 formulas mapped to the official 2028 syllabus, with Computer Science written as Java, verified bond-line structures for organic chemistry, about 28,000 fixed exam-style questions, about 5,500 question blueprints that generate new ones offline, your own formulas alongside the printed ones, timed mock papers, 448 solvable for any variable, 41 simulators including a step-through Java
tracer.

## Run it

You need Node 20.19 or newer, or Node 22.12 or newer.

    npm install
    npm run dev

Then open the address it prints.

## Build it

    npm run build
    npm run preview

`npm run build` type-checks, then writes the finished site to `dist/`. `npm run preview`
serves that folder at http://localhost:4173. The service worker only exists in a build,
so test offline behaviour there, not with `npm run dev`.

## Deploy it

`dist/` is a plain static folder, and its links are relative, so the same build works at a
domain's root or under a sub-path. A test confirms this, offline included.

**GitHub Pages.** `.github/workflows/deploy.yml` tests, builds and publishes the site every
time you push to `master`.

1. Create an empty repository on GitHub. Don't add a README or licence.
2. In the repository, go to Settings, then Pages, and set Source to GitHub Actions.
3. From this folder, replacing `USERNAME` and `REPO`:

       git checkout master
       git remote add origin https://github.com/USERNAME/REPO.git
       git push -u origin master

4. Watch the Actions tab until it finishes, in a few minutes. The site is then at
   `https://USERNAME.github.io/REPO/`.

To publish a change, merge it into `master` and run `git push`. People who already have the site see the
"A new version of the book is ready" prompt.

**Vercel.** Import the repository. Vercel detects Vite, so the defaults are right: build
command `npm run build`, output folder `dist`.

Either host must serve over HTTPS, or the service worker and installing won't work. Both do
by default.

## Install it on a phone

- **Android:** open the site in Chrome, then choose Install app from the menu.
- **iPhone:** open the site in Safari, tap Share, then Add to Home Screen.

## Check it

    npm test              # unit tests, and a comparison with real Java if a JDK is installed
    npm run e2e           # browser tests, using Microsoft Edge
    npm run lighthouse    # writes reports/lighthouse.md
    npm run sizes         # writes reports/bundle-sizes.md

These need the private papers, so they only do anything on a machine that has them. In PowerShell:

    node scripts/private/question-analysis.mjs                      # analyse every paper
    $env:WRITE_BLUEPRINT_TAGS=1; npx vitest run tests/unit/blueprint-tags-private.test.ts
    node scripts/private/blueprint-coverage.mjs                     # how much is covered
    node scripts/private/write-reports.mjs                          # the reports made from them
    $env:NOVELTY_SAMPLES=500; npx vitest run tests/unit/novelty-private.test.ts

`npm run build` also runs `scripts/check-private.mjs`, which fails if git tracks anything in
`papers/` or `data-private/`, or if text from the papers has reached `dist/`.

Run `npm run build` before the last three. `npm run e2e` uses the Edge already on your
computer, through `channel: 'msedge'` in `playwright.config.ts`, and takes about six
minutes. It saves screenshots to `test-screens/` at each width and theme. Lighthouse also
uses Edge.

## Add to it

**A formula to the solver.** This needs data only, no code. Add an entry to the right file
in `src/solver/registry/`, linked by the formula's `id`. A test then fails if the
equation's dimensions don't balance.

**The uncertain duplicates.** To merge a group from `reports/dedupe-review.md`, follow the
instructions at the top of that file: move its ids into `MERGE` in
`scripts/dedupe-decisions.mjs`, then run `npm run data`.

**A brand-new formula.** There's no tidy route yet. `npm run data` rebuilds
`src/data/generated/` from `legacy/`, which must not change, so a formula added by hand to
the generated files is lost the next time that runs.

**A simulator.** Add a component in `src/sims/` and one line in `src/sims/registry.ts`.

**A bank question.** Add it to the file for its chapter in `src/practice/bank/written/`, named `<subject>-<level>-<unit>.ts`, using `mcq`, `ar`, `theory`, `num` or `output` from `define.ts`. A numerical names its solver entry, and a program is run by a test. Then, after any change to facts or blueprints, rebuild the rest of the bank's data, in PowerShell:

    $env:BANK_COMPILE=1; npx vitest run tests/unit/bank-compile.test.ts

**A new setting for numericals.** Add it to `src/data/blueprints/variety/scenes.ts`, with a pattern for the quantities it suits. Read a sample with `tests/unit/variety-dump.test.ts`.

**Measuring the supply.** These write `reports/supply-after.md`, `reports/filter-stress.json` and `reports/paper-overlap.json`:

    $env:STRESS_REPORT=1; npx vitest run tests/unit/filter-stress.test.ts tests/unit/freshness.test.ts
    $env:SUPPLY_REPORT='after'; npx vitest run tests/unit/supply-report.test.ts

**A question blueprint.** Add it to the right file in `src/data/blueprints/`, using `num`, `mcqNum`, `facts` or `custom` from `dsl.ts`. A numerical names its formula in the solver registry, and an MCQ gives each wrong answer with the mistake that leads to it. A test then generates 1,000 of them. Don't copy wording from a paper: `tests/unit/novelty-private.test.ts` looks for that where the papers are present.

**A figure for a question.** Add a `kind` to `DiagramSpec` in `src/practice/bank/diagram.ts`, draw it and describe it in `src/components/bank/BankDiagram.tsx`, and set `diagram` on the blueprint from its own values. `tests/unit/physics-visuals.test.ts` checks that each number on it is in the question, and that none gives the answer.

**A Java sample.** Add it to `src/java/samples.ts` with its expected output, and a test
checks it automatically.

**App icons and splash screens.** Change `scripts/make-icons.mjs`, then run
`node scripts/make-icons.mjs`. The results in `public/` are committed, so a normal build
doesn't need this.

## Where things are

| Path | What it holds |
|---|---|
| `legacy/` | The original files, never modified |
| `src/data/` | Types, loading, and the generated formula data |
| `src/solver/` | The registry, symbolic rearranging and the dimension checker |
| `src/search/` | Search, in a web worker, and quantity search |
| `src/practice/` | Question generation, spaced repetition and the mistakes log |
| `src/practice/bank/` | The exam-style question bank, marking and mock papers |
| `src/practice/gen/` | The generator: exact arithmetic, Quine–McCluskey, the mix, the teacher's papers and Word export |
| `src/data/blueprints/` | Question blueprints, one file per subject and class, with no text from the papers |
| `src/data/blueprints/variety/` | The variety engine, its settings, and hand-written Mathematics, Computer Science and cross-topic ways of asking |
| `src/data/bank/` | The bank's data, a file for each chapter, built by `tests/unit/bank-compile.test.ts` |
| `src/practice/bank/written/` | Bank questions written by hand, a file for each chapter |
| `scripts/private/` | Reads the private papers on your machine. Its results stay in `data-private/` and aren't committed |
| `src/custom/` | Your own formulas: IndexedDB storage, placing them in the book, backup files, and SMILES |
| `src/data/lewis/` | Structures with lone pairs as data, and the automated check every one must pass |
| `src/sims/` | The simulators |
| `src/java/` | The Java lexer, parser, interpreter and samples |
| `src/views/`, `src/components/` | Pages and shared interface |
| `src/styles/` | Tokens and stylesheets |
| `reports/` | Dedupe, audit, bundle size and Lighthouse reports |

## Read next

- `DESIGN.md`: the design system, for keeping additions consistent.
- `DECISIONS.md`: the calls made while building, and what could not be done or tested.
- `reports/dedupe-review.md`: the uncertain duplicates that are waiting for your decision.
- `reports/question-analysis.md`, `reports/question-quality.md`, `reports/physics-visuals.md`: what the papers contain, how far the generator covers them, how its questions were checked, and how Physics questions are drawn.
