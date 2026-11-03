# Decisions, v2

Newest work last. Each task gets two lines: what was decided, and why.

- **Task 7, syllabus.** Every entry is classified against the official 2028 syllabus; 594 went to `archive/`, 69 uncertain ones stayed in the app for you to decide (`reports/syllabus-review.md`). The book is now 8,736 − 314 merged − 594 archived = 7,828, in official unit order.
  An out-of-syllabus item that appears in an old paper goes to review, not to core or the archive, because papers back to 2017 test topics the 2028 syllabus has dropped. Saved formulas, schedules and mistakes for a removed id are dropped on load, and Saved says how many.
- **Quoting the syllabus.** `src/data/syllabus/` quotes CISCE's wording, as you asked, and the repo is public while the PDFs say all rights reserved. Your call whether to keep this public.
- **Task 5, live location.** The list works out the current section from the scroll offset and the virtualiser's position for every row, so it holds for rows not in the DOM, and the URL follows with `replaceState`. After a click that section stays current until the reader next scrolls, because the last section of a unit often can't reach the top.
  The router now counts real navigations separately, so opening the working area doesn't move the page, and clicking the section you're already in takes you back to its start, which it didn't before.
- **Task 6, search on a tablet.** Nothing was clipped: the panel is a native `<dialog>` in the top layer, and Edge and WebKit lay it out correctly at every iPad size. The cause is the on-screen keyboard, because `dvh` doesn't shrink for it: in landscape 1–2 results showed above the keyboard, and at every size the last results could never be scrolled into view.
  The panel now takes its height from `visualViewport`. This was measured with typical iPad keyboard heights and a simulated keyboard, not on a real tablet, so please check yours.
- **Task 2, Java editor.** CodeMirror 6, loaded only when someone presses Edit code, so tracing a sample costs nothing extra; indentation comes from its Java grammar, and phones get a row of keys for Tab and brackets. A small tokeniser colours code that is only read, and a test holds it to the editor's result on every sample.
  Colours are ink tones and weight only, because `DESIGN.md` says subject colours mark a place in the book and nothing else. `--good` and `--accent` carry a second, code-only meaning here, which is written down in `DESIGN.md`.
- **Task 3, Computer Science as Java.** 845 entries audited; 677 are now written as code, with words where they are descriptions, and 168 keep Boolean, K-map or O(n) notation, as you asked. About 230 were converted by hand, adding notes where integer division or a cast changes the answer, and a test runs the key ones through the Java interpreter to check they give the right result.
  Code travels in the existing display string with a prefix, so rows, search, practice and saved mistakes needed no second path. Python units stay in Python, not Java, and old notes that wrote `^` as a power were rewritten, since in Java it means XOR.
- **Task 4, structures.** RDKit.js runs in the build, not on the phone: it checks each SMILES against its written formula and PubChem's InChIKey, and draws it, and the app ships only the finished paths in `currentColor`. A 7 MB engine for a few hundred fixed drawings would cost a mid-range phone for nothing; the drawings load on first need, cost 123 KB gzipped, and are precached for offline.
  247 of 254 compounds match PubChem exactly, including stereo; the other 7 are listed in `reports/structures-report.md`. Inorganic and coordination compounds are left out, because the syllabus asks about their shapes and SMILES can't draw those truthfully.
- **Task 1, practice from the papers.** 530 original questions in lazy per-class files, with marking points that add up, numericals computed through the solver registry with fresh values, and programs run in a test. A unit's practice now leads with these, and "Build a mock paper" draws the real structure weighted by the syllabus's marks, keeps the clock in storage, and feeds results to mistakes and review under each question's own id.
  Two things to check: Mathematics XII mock papers use the 20, 7, 7, 5 shape because the 2028 syllabus has no optional section, an inference until a 2028 specimen appears. And only 6 scanned pages were read as images, the rest by OCR, so nothing in the bank rests on a scan's figures or equations.
- **Keeping the papers private.** `scripts/check-private.mjs` runs after every build and fails if git tracks a private file or if text from the papers is in `dist/`, and a test checks the bank's wording at a stricter length. Where the papers aren't on the machine, as on GitHub, those two text checks skip and say so.

---

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
| React Bits | Copied in by hand | `AnimatedContent` only, on the Today page. Details under Design. |

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

- **The old app has 41 simulators, not 44.** I counted the `tool*` functions in
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
- **Checked against a real JDK.** `tests/unit/java-jdk.test.ts` runs every sample and
  about 50 more programs through both the tracer and `javac` and `java`, and requires
  identical output, including how crashes end. It used Java 26 here, and it skips itself
  on a machine without Java 19 or newer. My hand-written tests had all passed, yet this
  found 9 bugs, now fixed. `"a" == "a"` was false, `true ? 1 : 2.0` printed `1`,
  `println(object)` ignored its `toString`, `%.2f` rounded 1.005 down, and overloads
  skipped the closest type.
- **`StringTokenizer` is included,** though the brief didn't list it, because ISC string
  programs use it so often.
- **One known difference from Java remains:** strings built from `final` variables aren't
  shared, so `final String a = "x"; (a + "y") == "xy"` gives false where Java gives true.
- **Your own program is kept.** Typing into a sample turns it into "My program", which
  is saved in this browser. Picking a sample never overwrites it.

## PWA and performance

- **The service worker precaches everything,** including every data chunk, simulator
  and font: about 3.3 MB, or 1.2 MB compressed. After one visit the whole app works
  offline, which the offline test checks by opening every formula with the network off.
- **Updates ask first.** A new version waits until "Update now" is pressed, because
  reloading in the middle of a practice session would lose it.
- **GSAP loads after first paint.** Motion is decoration, so the first screen never
  waits for it. Until it arrives things just appear. This removed about 27 KB (gzip)
  from the first load.
- **MiniSearch loads only inside the search worker,** and the palette's own code loads
  when the browser is idle. Together with GSAP, first-load JavaScript went from about
  126 KB to about 92 KB gzip, and React DOM is most of what remains.
  `reports/bundle-sizes.md` has the full table.
- **iPhone splash screens are light only.** Dark versions would double the 10 images
  for a screen shown for a moment. They aren't precached, since iOS reads them once at
  install time.
- **Status bar style is `default`.** The alternative, `black-translucent`, uses white
  text, which would vanish against the paper theme.
- **Lighthouse has no PWA category any more** (removed in version 12), so the
  "installable" check uses the browser's own `Page.getInstallabilityErrors` in a real
  profile. It was run in Edge. **I could not test on a real Android phone or iPhone,**
  so Add to Home Screen itself is checked only by those signals and the tags.
- **Performance is measured with compression on.** `vite preview` sends files
  uncompressed, which a real host would not, so `scripts/lib/static-server.mjs` gzips
  them for Lighthouse. Vercel and GitHub Pages compress by default, though GitHub
  Pages uses a shorter cache lifetime than this server does.

## Audit and polish

- **The audit and polish were done by hand, once.** `impeccable` couldn't be installed,
  so its `/audit` and `/polish` commands and its detector never ran. I followed its
  written instructions and wrote my own checks for what the detector looks for. You
  asked for a pass at the end of the UI phase and another at the very end. **Only the
  final pass happened.** During the UI phase I only followed its design rules while
  building. `reports/impeccable-audit.md` has the findings and scores. I scored my own
  work, so install the real tool (commands above) if you want an independent check.
- **List reveals stayed, against one motion guideline.** Emil Kowalski's guidance says
  not to animate what you see constantly, and I briefly removed them on that basis.
  Your brief asks for them by name, so they're back: first 10 rows only, and never
  after a keyboard action.
- **The interpreter and parser are split across files.** `interp.ts` had reached 1,074
  lines. A few files are still just over 400 lines, such as the Java standard library
  and the sample programs. Each does one job, so I left them.
- **Long formula names wrap to three lines at 1440 px.** The contents and work columns
  share that screen. I kept the room for the formulas, since they are the content.

## What could not be tested

- **Real phones.** Android and iPhone behaviour was checked by emulating touch and
  screen size in Edge, plus the install signals and iOS tags. Nobody has actually
  tapped Add to Home Screen on a device.
- **Other browsers.** Everything ran in Edge, which shares Chrome's engine. Safari and
  Firefox were not run.
- **A screen reader.** axe and the keyboard run pass, but no one has listened to it with
  VoiceOver or NVDA.
- **The GitHub Pages workflow.** It can only run on GitHub. I tested what it does, from
  a fresh clone on this machine: install, test, build, and serving that build from a
  sub-path. The workflow file itself hasn't run.
