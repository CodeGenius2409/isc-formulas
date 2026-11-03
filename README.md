# ISC Formula Book

Every ISC 2028 formula for Physics, Chemistry, Mathematics and Computer Science, with a
problem solver, practice with spaced repetition, and simulators. It installs as an app
and works with no network after the first visit.

7,828 formulas mapped to the official 2028 syllabus, with Computer Science written as Java, verified bond-line structures for organic chemistry, 586 exam-style questions, your own formulas alongside the printed ones, timed mock papers, 448 solvable for any variable, 41 simulators including a step-through Java
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
