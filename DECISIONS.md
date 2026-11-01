# Decisions

Calls made while building, so you can overrule any of them.

## Tooling: what was and wasn't installed

The Claude Code permission system blocked running remote installers
(`npx skills add ...`, flagged as "code from external"). I did not try to get
around that. So the **skills below were not installed**. I downloaded their text
as plain data and followed it by hand. Nothing from those repos was executed.

| Requested | Status | What actually happened |
|---|---|---|
| `frontend-design` | Not installed, text read | Followed `SKILL.md` from `anthropics/skills`, including its plan-and-review process and its list of generic defaults to avoid. |
| `ui-ux-pro-max` | Not installed, data read | Its search script was not run. I queried its CSV files (`typography`, `colors`, `products`, `motion`) directly. |
| Emil Kowalski's motion skills | Not installed, text read | Followed `emil-design-eng`, `animate`, `review-animations`, `animation-performance` and `mobile-native` from `emilkowalski/skills`. |
| `impeccable` | Not installed, text read | `/audit` and `/polish` cannot be run as commands, and its 62-rule detector binary was not run. I followed `audit.md`, `polish.md` and `craft-floor.md` by hand. See `reports/` for the results. |
| `gsap`, `lucide-react` | Installed | Normal npm dependencies. |
| React Bits | Copied in by hand | See the section below once it is used. |

To install the skills properly on your own machine, run these from the project root:

    npx skills@latest add emilkowalski/skills
    npx skills@latest add anthropics/skills --skill frontend-design
    npx impeccable install
    npx -p ui-ux-pro-max-cli uipro init --ai claude

npm dependencies were installed with `--ignore-scripts`, so no package lifecycle
scripts ran. Nothing in the build needs them.

## Git

Work is on a `rebuild` branch. `master` still holds your original files.

## Data and dedupe

- **A merged entry still shows in other units.** You asked for one entry shown in
  both places when two subjects need it. I applied the same rule across classes
  and units: a Class XII reader's table of standard derivatives must not have
  holes because the same rows exist in Class XI. It is stored once, so search,
  favourites and practice each see it once, and each place is tagged with where
  else it appears. Repeats inside the same unit collapse to one row. To change
  this, edit `resolvePlacements` in `scripts/lib/dedupe.mjs`.
- **Your near-duplicate example was kept apart.** `p-xi-1-11` and `p-xi-1-5` are
  the definition and the propagation rule, so they are not repeats. See
  `reports/dedupe-review.md`.
- **Your group counts did not reproduce.** The total of 8,736 and the subject
  split match, but I get 52 identical-LaTeX groups (you measured 65) and 199
  same-name groups (you measured 143). `reports/dedupe-report.md` shows the counts.
- **Conflicting entries were not merged.** Where two entries disagree on a fact,
  such as the d-block configuration or the nitration temperature, merging would
  silently pick one, so they went to the review file.
- **Data stays in per-chunk JSON.** Entries shown in more than one unit live in
  `shared.json`, which loads with any chunk.

## Design

- **Theme names.** Light is "Paper" and dark is "Blackboard". The high-contrast
  option is a separate switch, so it works with either.
- **Hash URLs.** Addresses look like `#/book/physics/XI/1`. They work on GitHub Pages
  and Vercel with no server rewrite rules.
- **Heading font.** `ui-ux-pro-max` proposed Crimson Pro with Atkinson Hyperlegible.
  I kept Atkinson and replaced Crimson Pro with Besley, because Crimson's thin
  strokes break up on the dark theme.
- **React Bits.** Only `AnimatedContent` is used, once, on the Today page. I trimmed
  it to remove ScrollTrigger, blur and tilt. Its default timing (0.8 s, 100 px)
  was far too loud for this design, so I changed it.
- **No ScrollTrigger.** Nothing earned it.
- **Browsers.** Playwright drives the installed Microsoft Edge, because Chrome is not
  installed here and I did not download a browser. Edge uses the same engine.

## Solver

- **468 formulas are in the registry**, more than the 300 you asked for. Adding one
  is a single line in `src/solver/registry/`. A test then fails if the id is not in
  the book or if the dimensions do not balance.
- **Own expression tree.** mathjs parses expressions and handles units. Rearranging,
  evaluating and printing use a small tree in `src/solver/expr.ts`, so each step of
  the working can be shown.
- **How the unknown is found.** If it appears once, each operation is undone in turn.
  If it appears more than once, a polynomial is collected and the linear or quadratic
  formula used. If neither works, a numeric search runs and the step says so.
- **Roots.** Every root is substituted back into the original equation, which removes
  false solutions from squaring. Unphysical roots, such as a negative time, are shown
  as "Rejected" with the reason, because a student should see why.
- **Significant figures.** Results use the fewest significant figures among the values
  you typed, but always between 3 and 5. A strict "5 × 3 → 1 s.f." is correct but
  useless for checking working.
- **Chemistry units.** Mass is in grams and concentration in mol/L, as chemistry states
  them. A few equations only hold in stated units, such as the 1000 in
  `M₂ = 1000·K_b·w₂/(ΔT·w₁)`. These are marked `convention: true`, which skips only the
  unit-factor test. The dimension test still applies to them.
- **Logs of concentrations.** `pH = −log[H⁺]` takes the value in mol/L as a pure number.
  These inputs are labelled that way, since a logarithm of a dimensioned quantity is
  not strictly meaningful.

## Search

- **MiniSearch in a web worker.** The main thread sends documents to the worker rather
  than the worker importing the data, because importing would bundle the 1.4 MB of
  formulas a second time. The index builds the first time find opens. If a worker
  cannot start, the same engine runs on the main thread.
- **Find opens with no animation.** It is used constantly from the keyboard, and Emil
  Kowalski's guidance is explicit that such things should not animate.
- **Quantity search counts constants as known.** "have u, theta want R" is an exact
  match for the range formula even though it also uses g.

## Practice

- **SM-2 for spaced repetition,** with one change: a missed item comes back the same
  day rather than the next. `src/practice/srs.ts` documents the algorithm, and tests
  check it against the published formula.
- **localStorage rather than IndexedDB.** Progress is small (about 60 bytes per
  formula, so under 1 MB if you review every formula) and simple keys are easy to back
  up and inspect. Every read and write is guarded, so it still works with storage blocked.
- **Backups merge rather than replace.** Importing can only add, and the more recently
  reviewed schedule wins for each formula. That removes the risk of wiping progress by
  importing an old file, and it means importing needs no confirmation step.
- **2% tolerance on numeric answers,** to allow for rounding in intermediate steps.
- **The unit list includes wrong kinds of unit on purpose,** since picking the right
  unit is part of the question. A wrong kind is marked wrong with an explanation.
- **The working area keeps its tab, and any practice session, while you move around
  the book.**

## Simulators

- **The old app has 41 simulators, not 44.** I counted the `sim*` functions in
  `legacy/`. There are 41, plus one alias (`phscale`, which opened the pH tool). The
  number 44 did not reproduce.
- **Merged, because they did the same job:**
  - `projectile2` into Projectile, whose comparison feature replaces it.
  - `truth` and `truthtable` into Logic gates and truth tables.
  - `vector` and `vectoradd` into Vectors.
  - `ohms` into the DC circuit builder, since one resistor and one cell is Ohm's law.

  LCR stayed separate, because AC behaviour is a different lesson from DC circuits. Old
  links still work: `src/sims/registry.ts` maps each old id to its new home.
- **Added:** DC circuit builder, Titration curves, Graph plotter and Java program
  tracer. Projectile was rebuilt with RK4 air drag and comparison. Those merges and
  additions happen to bring the total back to 41.
- **Simulator pages hide the contents and the working area on desktop.** A plot beside
  its controls is worth more than the book beside it, and the rail is still there.
- **On a phone the result comes above the controls,** and a lone plot stays on screen
  while you scroll, so moving a slider shows what it does.

### Java tracer

- **It runs the whole program first and records it,** so Back works the same as Step,
  and a program using `Math.random` shows the same numbers when you step back.
- **Limits:** 500,000 steps before it reports a likely infinite loop, the first 20,000
  of those can be stepped through, and 5,000 nested calls before `StackOverflowError`.
  Method calls run on an explicit stack, so deep recursion cannot crash the page.
- **Type errors appear when the line is reached,** not before the program starts. A
  real compiler would reject `int x = 3.5;` even on a line that never runs. The message
  uses javac's wording, but a mistake on an unreached line goes unnoticed here. This is
  the biggest difference from running `javac`.
- **Outside the subset,** each with a message naming the construct: inheritance,
  interfaces, abstract classes, enums, generics and collections such as `ArrayList`,
  try/catch, lambdas and nested classes. **The ISC Class XII syllabus does cover
  inheritance,** though the brief's subset did not ask for it. Tell me if you want it
  added.
- **Your own program is kept.** Typing into a sample turns it into "My program", which
  is saved in this browser. Picking a sample never overwrites it.
