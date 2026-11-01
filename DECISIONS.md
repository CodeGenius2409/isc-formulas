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
