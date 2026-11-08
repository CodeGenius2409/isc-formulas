# Decisions, v3

Newest work last. Each task gets two lines: what was decided, and why.

- **Task 2, intersections.** A toggle button marks every crossing on the graph with its coordinates, remembered in `sessionStorage`. Crossings come from sampling f − g, bisecting each sign change, and checking the two curves really agree at the result, which rejects tan x and 1/x; a separate search finds curves that touch without crossing.
  Labels never overlap each other or a dot, and avoid curves where they can. When a view is too crowded, a label is left out rather than overlapped, and the graph says "zoom in"; every point is still in the readouts.
- **Task 3, reading the graph.** The guide, markers and readout live on their own canvas and in their own component, so following the pointer never redraws the curves, and updates are held to one a frame. Named points snap within 14 px, or 24 on touch, and are worked out only when first needed.
  One finger now reads the graph on touch, as you asked, so moving it takes two fingers. Arrow keys used to pan; they now read, with up and down jumping between named points, and Shift with an arrow pans.
- **Task 4, plotter calculus.** Derivatives and antiderivatives come from a small module on the solver's own expression trees (`src/sims/lib/symbolic.ts`), not from mathjs `derivative` or Algebrite. Those would add a great deal to a page that needs a table of rules; the tests compare my derivatives with real mathjs, and every antiderivative is checked numerically before it is shown, so a wrong rule falls back to a numeric curve.
  Definite integrals use adaptive Simpson, split at roots so the areas above and below the axis are separate, map infinite limits to a finite range, and report "does not converge" rather than a wrong number. Below-axis shading is hatched as well as lighter, so the sign isn't colour alone. `log` stays the natural log, as it already was in this app, and the help text says so.
- **Task 5, structures with lone pairs.** 90-odd structures are JSON in `src/data/lewis/figures.ts`, mostly built from VSEPR templates, and drawn as SVG by `components/Lewis.tsx`, since SMILES renderers don't draw lone pairs well. Every one passes `src/data/lewis/check.ts`: electrons, formal charges, octets, shape against domains, and drawn angles, and a test confirms the checker fails on broken structures. They load lazily, and the practice questions take their answers from the same checked data.
  The syllabus map has no p-block unit, so oxoacids, xenon compounds and interhalogens as a topic are left out, as you asked. ClF₃, BrF₅ and iodine ions appear only as VSEPR examples. Lone pairs are hidden on functional groups, and the pair that matters is in `--accent`.
- **Task 1, your own formulas.** They live in IndexedDB through `idb`, with `u-` and a UUID as ids, and are merged into the book as it renders, so favourites, search, print and the lists needed almost no new paths. MathLive is lazy, about 812 KB raw, and reuses the book's KaTeX fonts rather than bringing its own. SMILES uses SmilesDrawer on the phone, about 197 KB raw and lazy, since RDKit is 7 MB; a test checks its molecular formula against what RDKit verified for every non-salt compound in the book.
  **No sketcher.** The usable ones, such as Ketcher, run to megabytes and bring their own interface, which is too much for a phone and this design. Typed SMILES with a live drawing and a computed formula does the job, and structures with lone pairs are chosen from the checked set, since a hand-described one couldn't be checked. Sections you add aren't stored apart: a section is just a name your formulas share, so an empty one can't linger. Your formulas are recall cards in practice, and only if you turn that on.

---

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

## The structure section going missing (v4, Task 0)

- **The cause.** `tests/e2e/editor-structure.spec.ts` reproduced it on the old build. The section was shown only when `subject === 'chemistry'`, and `subject` was read once, when the editor opened, from the address or from the last unit read. The choice of subject itself is on the second step. So the section vanished, with no way back on that screen, in three cases that a reload cures: another tab had moved to Chemistry (this tab's memory of the last subject was stale), the address changed while the editor was open (the same `key` meant no fresh start), and any arrival from outside a unit, such as the Chemistry contents page, where nothing recorded the subject at all. That last case isn't cured by a reload, which is why it looked intermittent.
- **A second, separate cause of "a reload fixes it".** `React.lazy` and a remembered promise both keep a failed import for good. One dropped request for the drawing engine meant every later SMILES said it couldn't be read, until a reload, and a failed lone-pair chunk took the whole editor down with it. The likely suspect, a stale service worker, was tested and is not what removed the section: its only effect is this failed import.
- **The fix.** Chemistry always shows the section. Every other subject has an "Add a structure" button, and a structure can now be saved on any subject. The subject follows the address and the book, across tabs. Loads go through `src/lib/retry-import.tsx`, which retries, forgets failures, and looks for an update when a file has gone. `RetryBoundary` keeps a failure inside the section, with a Retry that needs no reload.
- **A half-written formula now survives a reload** in `sessionStorage`, including one that installs an update. Cancel throws it away, and moving elsewhere in the app leaves it behind.
- **Old and new code can't mix.** File names carry hashes, so old code can only ask for old files. After another tab presses Update now, a tab that has noticed the waiting version reloads onto the new one, which comes from the PWA library and is why a draft has to survive it. A tab that hadn't noticed is told in words. **This can still end an unsaved practice session in a second tab,** because that is in-memory state. Mock papers and drafts are stored, so they survive. `tests/e2e/update-flow.spec.ts` publishes a real renamed build to check both paths.

## SMILES help in the editor (v4, Task 3)

- **A small SMILES reader of our own, `src/custom/smiles-read.ts`,** rather than the drawing library's parser. That library can't report which character is which atom, and its errors are parser jargon. A test holds the reader to RDKit's formula for every compound in the book. It is deliberately stricter than the library, and refuses a neutral nitrogen with four bonds.
- **"Same compound" compares atoms, charges, hydrogen counts and connections, ignoring bond orders.** So every Kekulé form of benzene matches, and `N(=O)=O` matches `[N+](=O)[O-]`. **Stereochemistry is ignored,** so cis and trans count as the same answer. None of the guide's exercises depend on it.
- **"Pick by name" offers all 254 compounds that passed the PubChem and RDKit check,** used in the book or not, which fits the 200 to 300 asked for. No new compounds were added, so no new names needed checking.
- **The builder overwrites the box each time.** It keeps its own description rather than trying to edit whatever was typed, which is what keeps its output correct.

## The question generator (v4, Task 1)

- **Step A, the analysis:** `scripts/private/question-analysis.mjs` splits and classifies each paper by rules, not by reading all 4,699 parts by hand. Rules were checked against 12 page images and samples, and that found real bugs: a tag match sent every "Application of Derivatives" question to Integrals, and assertion options were counted as questions.
- **Step B, what "covered" means:** the same subject, class and topic, and the same kind of question. That's strict, as a question with no matching topic can't count. 88.2% of all parts are covered, and 97.1% of those with a topic.
- **Blueprints carry no paper text.** They're typed code in `src/data/blueprints/`, one file per subject and class, loaded when needed. The novelty check and `check-private` both enforce this, and each caught real phrases along the way.
- **A numerical is solved by the same registry as the solver,** so dimensions and steps come free, and a wrong formula would break both places. Where no entry applies, as in Maths, the question is built backwards from a clean answer, in exact fractions.
- **A distractor must name its mistake.** `mcqNumber` takes `[slip, value]` pairs and prints the slip in the working, so an arbitrary number has nowhere to hide. Reading the output caught several that were arbitrary all the same.
- **Generated ids hold their own recipe:** `g-<blueprint>-<seed>`. The mistakes log and review queue need no copy of the question, and a link can reopen one exactly. Only the id is stored, so a fixed blueprint fixes its past questions, and a removed blueprint drops out of review quietly.
- **Default mix:** about a third generated in unit practice, half on the teacher's screen and in mock papers when switched on, and 30% of a mock paper's generated questions are CBQ-style, from the share in recent papers. Each side remembers its own slider.
- **When the bank runs short, the share goes up and says so,** instead of quietly giving fewer questions. That's `planShare`, and a test holds it to within one question of what the slider says.
- **The teacher's paper is kept whole in the saved file,** not rebuilt from the seed, so editing the wording of a question or reordering it survives. The seed is for regenerating, and for linking a student's mock paper.
- **Word comes from `docx`, as a lazy chunk,** with figures as PNGs. Maths becomes readable text rather than Word equations: it survives editing and doesn't need Word's equation editor, though it's plainer than the screen.
- **Stacks and queues are left out,** though papers up to 2025 have them. The 2028 syllabus doesn't. The first version of the blueprints had them, and reading against the syllabus removed them.

## Physics figures and simulators (v4, Task 2)

- **A figure first, a simulator second.** A figure is light, prints, and suits a mock paper. A simulator is closed by default even where it's safe, under "Try this set-up in the simulator", because it's a second thing to load and to read while answering.
- **Only some simulators can open before answering.** Projectile, Atwood, inclined plane and spring don't show the answer once their readouts are hidden. A lens simulator draws the image, and the double slit draws the fringes to scale, so they wait. `reports/physics-visuals.md` has the reason for each.
- **Question mode is a context, not a prop.** `SimQuestionContext` holds a question's values, and `Readouts` goes quiet by itself. A simulator only swaps `useState` for `usePreset`. It also means a link can open a simulator at those values.
- **One drawing file, `BankDiagram.tsx`, draws from a typed spec,** and a question's spec is built from its own values. A test reads each number off the figure and insists it's in the question's words, which is the point of one source of truth. It found that level energies were adding information, so they came off.
- **A fixed figure is the same code with letters for values.** A derivation's figure is a spec with `d` and `D` rather than numbers. So there's no second set of drawings.
- **A figure is its own lazy chunk,** so a question with none costs nothing.

## PWA and performance

- **What v4 cost:** first load went from 119 KB to 121 KB gzipped, and everything saved for offline from 1,854 KB to 2,198 KB. Blueprints, figures, the teacher's screen and Word export are each their own chunks, so the first screen pays almost nothing for them.

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

- **Word files in Word itself.** Tests open the .docx as a zip and read its XML. Whether Word lays it out well hasn't been seen.

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

## v5 fixes

- **Task 1, stacks and queues:** confirmed not in the 2028 syllabus. The 6 formulas left in the book moved to `archive/removed-formulas.json`, with the reason. Papers' questions on them now count as out of syllabus, not as uncovered.
  A test scans the formula book, bank, blueprints, samples and syllabus map for them. A call stack is fine, as that's how a program runs.

- **Task 4, the tracer now does inheritance and interfaces:** `extends`, `super`, `this(...)`, overriding, abstract classes, `interface`, `instanceof` and class casts. `src/java/classes.ts` holds the class relations, and the checks javac makes.
  It follows Java on the subtle points: overloads and fields go by the type as written, overrides by the runtime class, field initializers run after `super()`. The test programs give identical output on a real JDK, and 27 of the 29 refused programs are refused by javac too: one is a run-time ClassCastException, and javac 26 has relaxed the rule on code before `super()`, which the tracer keeps, as ISC teaches it.

- **Task 3, assertion and reason:** a pair is now built from one concept node: a statement and its false version, why it's true and a false explanation, and something else true of it that doesn't explain it. So all four outcomes stay correct, and a true reason that doesn't explain is still about the same thing.
  452 nodes were written fresh, replacing random pairs of facts. The old way could pair a statement about double bonds with one about water's dipole. A test generates 1,000 per blueprint.

- **Task 5, figures in papers:** an "Include diagrams" switch on both screens, on by default and remembered apart. Figures are numbered across the paper, and the question refers to its number. With the switch off, a question that points at its figure keeps it, with a note: it would make no sense without it.
  Answer keys can have their own figure, such as a completed ray diagram, which never appears in the question. Word files get them as PNGs at three times their size, with alt text. In a paper, a simulator's button only appears after marking.

- **Task 7, fewer questions than asked: the cause.** A test of 11,358 narrow filter choices found 8,421 fell short. Three reasons: every "Which of these statements is correct?" counted as the same question, as only the words were compared, so one was allowed per paper. A subtopic with few facts simply ran out, and nothing looked further. And nothing said so until after generating.
  Now the order is: more instances, then the other source if the slider allows, then related subtopics in the chosen chapters, labelled. What can't be met is said before generating, and an option that gives nothing is greyed out with the reason. A mock paper and a practice session are never short.
- **"Never the same fact twice" wins over "the same fact in another format".** Task 7's second step and Task 6's rule pull against each other. A repeated fact is worse than a question from a related subtopic, so facts stay unique, and each question knows which facts it tests. A count that truly can't be met is refused before generating.

- **Task 8, derivations:** a library in `src/data/derivations/`, written from the syllabus's "derive" lines. Each has its assumptions, steps with marks, a result, and where it helps, a figure, a mistake to find, and fresh values for "hence calculate". A bank question asks each one, so they're there at 0%, and blueprints ask it the other ways.
  Most results are checked by mathjs at random values, and with units. What can't be is listed in `reports/derivations.md`. Mock papers give derivations the share they have in the real papers at each mark value. A step left unticked comes back alone in review, as "write the missing step".

- **Task 6, fresher facts:** 2,453 facts became 6,724, written from the syllabus wording, not the papers, with links (same, cause, contrast) that make linked assertion–reason and "distinguish" questions. A history in IndexedDB keeps each fact away for 7 days (a setting), unless spaced repetition has it due; numericals without facts are remembered by blueprint.
  When everything's resting, the least recently seen come back, with a note, so a paper is never short. Linked teacher papers stay reproducible, so they ignore the history. The history isn't in the progress backup: it's per device. New facts count as reviewed only once Task 2 checks their blueprint.

- **Task 2, labelling:** each class has a review file, `src/data/blueprints/reviews/`, with each blueprint's date and note, applied when the class loads. A flagged one counts as not reviewed and stays in use. A generated question from an unreviewed blueprint says "Not yet reviewed" beside "Generated", on screen, in print and in Word.
  "Only reviewed questions" is off by default on both screens. A mock paper is never short, so if nothing reviewed fits a place, an unreviewed one fills it, marked, and the paper says so. For a teacher, it narrows the counts shown before generating, as any filter does. There are 2,211 blueprints now, not 1,484.
- **Review batch 1** (CS XII Boolean algebra, Chemistry XII solutions; 41 blueprints, 11 fixed): every fact, and two samples of each blueprint, read. Arithmetic, K-maps and truth tables were right; the problems were repeats, "also true" reasons that in fact explained the assertion, and an unrealistic drip.
  Kept as is: azeotropes, though not named in the syllabus, as non-ideal solutions are, and they're what a teacher would teach with them.
- **Review batch 2** (Maths XII applications of derivatives, Physics XII moving charges; 46 blueprints, 14 fixed). The main find was general: 38 of the 51 "long answer" facts repeat a derivation in the library, as a different fact, so a paper could ask the same derivation twice. They now share the library's fact, matched by the derivation's own pattern, in the same topic.
  Kept: the solenoid derivation by Ampère's law. The syllabus summary says "only qualitative", but its detailed list says to apply the law to a solenoid, and the papers ask it.
- **Review batch 3** (Maths XII probability, CS XII methods, Physics XII a.c.; 58 blueprints, 13 fixed). Binomial distribution isn't in the 2028 Maths syllabus, which stops at a random variable's mean, so its recall and assertion–reason items went; "exactly r successes" stays, worked from independent trials and counting. Q factor, Curie temperature and the B–H loop are in the detailed Physics syllabus, though not its summary, so they stay.
  General: a "distinguish" pair made from two definitions now shares the fact of a written comparison of the same pair, matched by name, so a paper doesn't ask it twice.
- **Review batch 4** (Chemistry XII kinetics, Physics XII ray optics; 49 blueprints, 14 fixed). Scattering of light isn't in the 2028 Physics syllabus, so the blue sky and red sunset went. Two general bugs: a choice of three numbers, like `T: [30, 45, 60]`, is read as a range with a step, so eight blueprints always used one value, and the DSL now refuses such a range; and answers were rounded from binary floating point, so 0.001155 showed as 0.00115. Rounding is now half up, from the decimal digits.
  The lens magnification used the mirror's m = −v/u, so the solver has the book's m = v/u for lenses.
- **Review batch 5** (Maths XI trigonometry, Maths XII integrals, Physics XII cells and bridges; 47 blueprints, 6 fixed). These topics were sound: every standard integral, identity and value checks out. Kept: heights and distances in one Class XI CBQ, as it applies the definition of tan, which is in the syllabus.
  Fixed: near-repeats, an 8 V car battery, and working printed as "+ 0x² + 1x".
- **Review batch 6** (Chemistry XII coordination compounds, haloalkanes, alcohols; 58 blueprints, 12 fixed). All three are in the syllabus as written, including Swarts, Finkelstein and Wurtz. The alcohols' chemistry is "of primary alcohols only", but telling primary, secondary and tertiary apart is listed, so oxidation and the Lucas test stay as tests.
  The naming MCQ's distractors are now built from slips a student makes, not other complexes' names.
- **Review batch 7** (Maths XII vectors, Physics XII potential and capacitance; 42 blueprints, 11 fixed). A wrong formula: the dielectric numerical used the n-plate capacitor formula with n = K, so its answers were too small. The solver now has C = Kε₀A/d from the book.
  The syllabus says the parallel plate capacitance and energy stored are "No derivation, formulae only", though its detailed list says "obtain". The explicit note wins, as in Task 8, so those two derivations were replaced.
- **Review batch 8** (Physics XII conduction, semiconductor diodes; 42 blueprints, 12 fixed, 1 flagged). Logic gates aren't in the 2028 Physics syllabus, so their facts went, and `p12-9b-gates` is flagged for you rather than deleted: it stays in use, marked "Not yet reviewed". Flags have their own table in the report.
  Also: no bridge rectifier, which the syllabus leaves out; mains supplies of 220 to 240 V.
- **Review batch 9** (Physics XII wave optics, dual nature; 44 blueprints, 14 fixed, 1 flagged). Polarisation isn't in the 2028 Wave Optics syllabus, only named under Dual Nature as evidence of waves, so its facts went, and `p12-6c-malus` is flagged.
  The fringe width in water was worked by applying λ/n to a width; it now gives the slits and screen and uses β = λD/d with the wavelength in water.
- **Review batch 10** (Chemistry XII transition elements, Physics XII charges and fields; 42 blueprints, 7 fixed). A wrong answer: "two equal charges" was worked with a second charge the question didn't give. It now states that charge. The transition elements were sound throughout.
  Repeats were the rest: the same fact twice in a topic, which a paper could ask twice.
- **Review batch 11** (Physics XII nuclei, Maths XII 3-D geometry, CS XII binary trees; 46 blueprints, 18 fixed, 9 flagged). Radioactivity isn't in the 2028 syllabus, and an earlier version already asked you whether to keep it (`reports/syllabus-review.md`, item 1). So nothing is deleted: its facts left the shared pools, and its 9 blueprints are flagged, including 7 that Task 8 counted as reviewed.
  CS binary trees: the syllabus lists the terms and three traversals only, so search trees and full and complete trees went.
- **Review batch 12** (Chemistry XII conductance, Maths XII relations and functions, Physics XII atoms; 51 blueprints, 12 fixed). One question was wrong as worded: a single hydrogen atom gives at most n − 1 lines; the n(n − 1)/2 answer is for a sample. Electroplating now pairs each metal with its real ion.
  Open syllabus questions in `reports/syllabus-review.md` (radioactivity, polarisation, binomial): questions follow the 2028 syllabus, and blueprints wholly on such topics are flagged, not deleted. The formula book is left for you.
- **Review batch 13** (Chemistry XII cells, Maths XII determinants and differential equations; 50 blueprints, 11 fixed). No errors of fact; every worked answer checks by hand. The fixes were presentation ("1x²", "(dy/dx)¹"), a repeated CBQ, and repeated or arguable facts.
  Coefficients of 1 and terms of 0 are a recurring kind of slip, now fixed wherever a batch has met them.
- **Review batch 14** (Chemistry XII aldehydes and ketones, CS XI statements and scope, Maths XII inverse trigonometry; 48 blueprints, 9 fixed). Chemistry keeps to the syllabus's named reactions, so Gattermann–Koch, Friedel–Crafts acylation and acetals went. A Java line had a Unicode minus that wouldn't compile; a scan found no others.
  The programs' outputs, every inverse-trig value, and the iodoform and aldol equations all check out.
- **Review batch 15** (Chemistry XII phenols, Maths XII matrices and continuity; 41 blueprints, 7 fixed). Rolle's theorem and the mean value theorem aren't in the 2028 Calculus unit, so they left the shared pools, as with the other open questions in `reports/syllabus-review.md`. No blueprint was wholly about them.
  Matrices and differentiation were right throughout; Phenols had facts said twice.
- **Review batch 16** (Physics XII optical instruments, CS XII logic gates and arrays; 43 blueprints, 10 fixed). The eye's accommodation isn't in the Optical Instruments syllabus. Repeats were the main problem in Physics.
  CS was sound: every gate count, address and program output checks. "A AND gate" now reads "an AND gate", in Class XI too.
- **Review batch 17** (Physics XII EM waves, Chemistry XII K₂Cr₂O₇/KMnO₄ and amines; 46 blueprints, 10 fixed). Name-it answers now say "Kolbe's reaction", "esterification" and "the Sandmeyer reaction", and keep the capital in N-phenylethanamide.
  Most problems were facts said twice across a topic's blueprints; the chemistry itself was right.
- **Review batch 18** (CS XII propositional logic, Maths XI relations and functions, Maths XII areas and linear programming; 43 blueprints, 21 fixed, 1 flagged). LP corner sets are now always convex, and the word problem has realistic profits.
  One-one proofs are Class XII syllabus, so the Class XI one is flagged, not removed. Repeats across a topic's recall, truths and AR were the main problem.
- **Review batch 19** (Physics XII semiconductors, CS XI variables and expressions, Chemistry XII proteins; 43 blueprints, 15 fixed). Two topics had pairs of AR nodes asking the same thing. A recall with a 2024 board MCQ's exact options was reworded.
  Java expressions in prose now use the ASCII minus, as in code. The physics, chemistry and Java facts themselves were right.
- **Review batch 20** (Physics XII magnetism and EMI, Chemistry XII haloarenes; 49 blueprints, 21 fixed). The most repetitive topics so far, so many pool entries were removed, not replaced. Haloarenes got two directive-influence facts to stay at its 42.
  Wurtz–Fittig stays as a pool fact: the 2023 paper asked it, and the 2028 wording ("basic idea") doesn't clearly drop it.
- **Review batch 21** (CS XII adders and complexity, Chemistry XI ionic equilibrium, Chemistry XII diazonium salts; 48 blueprints, 19 fixed). Generated values are now cleaned to 12 figures before the solver reads them, so float noise no longer sets an answer's precision. The solver also brackets a value in standard form before a power.
  Both fixes are shared code, so they apply to every numerical, the solver screen included; tests/unit/solver-display.test.ts covers them.
- **Review batch 22** (CS XI numbers, objects and methods, Chemistry XII nucleic acids; 46 blueprints, 19 fixed). 2's complement stays in CS XI 1a: the 2028 wording names subtraction in other bases, and complements are how it is taught.
  Bisection stays in Methods, which names "finding roots of algebraic equations". The CS answers themselves (conversions, sums, outputs) all checked.
- **Review batch 23** (Chemistry XII ethers and carbohydrates, CS XI types and casting; 40 blueprints, 18 fixed). The casting MCQ now uses a negative value, so truncation and Math.floor give different answers.
  Duplicate AR nodes were again the main problem, with three pairs removed.
- **Review batch 24** (Maths XI sets and conics, CS XII inheritance; 46 blueprints, 13 fixed). AR statements were repeated word for word as truths in all three topics. Every conic, set and Java answer checked.
  Interfaces aren't in the Inheritance syllabus, so an "also true" line about them was replaced.
- **Review batch 25** (CS XII strings, recursion and interfaces, CS XI propositional logic; 47 blueprints, 21 fixed). The Class XI lift question asked about gates, which are 3b, so it now asks which connective; its id is unchanged.
  Interfaces' new facts follow the syllabus's one stated emphasis: the construct interface against a class's interface in the wider sense.
- **Review batch 26** (Physics XI waves, Chemistry XI volumetric analysis and isomerism, Chemistry XII carboxylic acids; 45 blueprints, 17 fixed). The Doppler effect left the Waves pool: the 2028 unit ends at beats, and no blueprint was wholly about it.
  The dilution numerical now asks for the volume to dilute to, which is what its answer gives.
- **Review batch 27** (Chemistry XII kinetics, cyanides and vitamins, Maths XI lines and probability; 40 blueprints, 20 fixed). Small topics often had AR nodes that repeated their only reasons. Several had just three truths, giving three-option MCQs, so facts were added.
  Coordinates in Maths questions are now in maths mode, so negative values show a proper minus sign.
- **Review batch 28** (Chemistry corrosion and moles, Maths XI P&C and circles, CS XI encodings; 43 blueprints, 17 fixed, 1 flagged). This corrects batch 22: the 2028 XI Encodings wording dropped integer encodings, so 2's complement is probably out. The complements question is flagged, and section A now subtracts in binary.
  The complement facts in the 2a pool stay until the user decides. The moles numerical now rounds its derived amount to 3 figures before use.
- **Review batch 29** (Physics XI work and energy, Chemistry XI quantum numbers, Maths XI sequences, CS XI files; 42 blueprints, 11 fixed). The second savings question became seats in a hall, so two of the same story can't share a paper.
  Thin topics got the definitions and truths they lacked.
- **Review batch 30** (six small Class XI topics; 47 blueprints, 21 fixed). The Class XI gate MCQ had only the options 0 and 1. It now asks for a whole output column, with four options.
  In small topics, AR nodes were again often a reason word for word, so new facts were written in their place.
- **Review batch 31** (Physics XI motion, Chemistry XI bonding and thermodynamics, Chemistry XII tests; 40 blueprints, 15 fixed). Four shared generator fixes: a carried value is rounded to 3 figures, a part can keep only its positive root, a count can be shown exactly, and question numbers use a true minus (not in CS, where values are what Java prints).
  A conics pair removed in batch 24 left a ten-question paper short, which check.sh didn't run; it now runs the paper-size test too. Covered in tests/unit/solver-display.test.ts.
- **Review batch 32** (Physics XI Newton's laws, Chemistry XI redox, CS XI arrays, Python and ethics; 48 blueprints, 8 fixed). A gun's recoil used the embedded-bullet formula; a new registry entry works it from conservation of momentum.
  Four topics had three-option truth MCQs, so each gained a fourth truth, and AR nodes that copied reasons were rewritten.
- **Review batch 33** (Maths XI complex numbers, 3D and statistics, Chemistry XI atoms and periodic trends, Chemistry XII titrations; 45 blueprints, 17 fixed). Complex answers printed “+ −4/13 i” and “1i”, 3D points printed “(2,-2,-3)”, and a variance printed 16 digits; all three now read as a teacher would write them.
  Argon was dropped as a “smaller than Cl⁻” option, since its radius is a van der Waals radius and the comparison isn’t safe.
- **Review batch 34** (Maths XI binomial, Physics XI projectiles, solids, surface tension and thermodynamics; 45 blueprints, 11 fixed). Stress now has its own σ = F/A entry rather than borrowing pressure’s P, and binomial questions no longer print x¹ or (1x).
  Entropy left the truths as it isn’t safely in the syllabus; silly distractors and copied AR nodes were replaced.
- **Review batch 35** (Physics XI measurement, dimensions, centre of mass and gravity, Chemistry XI laws and equilibrium, CS XI input; 40 blueprints, 10 fixed). g at a height of hundreds of kilometres now uses the exact formula, as h is not small against R; a new registry entry holds it.
  Silly distractors (a ring’s “one end”) and AR nodes that named a law as its own reason were replaced.
- **Review batch 36** (Physics XI oscillations, Chemistry XI organic basics and titration, Chemistry XII polyhalogens, CS XII strings; 40 blueprints, 12 fixed). A spring’s greatest speed no longer leans on an unexplained ω; a new registry entry works it from A, k and m.
  An output question’s explanation now matches its code in every form, and truths that repeated AR nodes were replaced.
- **Review batch 37** (Physics XI rotation, satellites, fluids, heat and kinetic theory; 47 blueprints, 14 fixed). A thin ring used a disc’s formula, so every answer was half what it should be; it now uses I = MR².
  Mixing water is answered in °C, an ideal gas’s pressure in pascals, and a one-step rms speed is worth 2 marks.
- **Review batch 38** (Practical chemistry, Chemistry XI first law, alkynes and aromatics; 41 blueprints, 10 fixed). A formula now prints −PΔV rather than (−P)ΔV, and a term starting with a minus sign gets brackets after + or −.
  This batch’s practical chemistry was mostly right; three-option MCQs and copied AR nodes were the main faults.
- **Review batch 39** (Physics XI friction, circular motion, collisions and instruments, CS lists, tuples and OOP; 46 blueprints, 14 fixed). A collision question asked for the reduced mass, out of syllabus and off the story; it now asks for the kinetic energy lost.
  Method names keep their small letter in “distinguish” answers, and copied AR nodes were replaced.
- **Review batch 40** (Physics XI torque, Physics XII ray optics practicals; 16 blueprints, 4 fixed). The last batch: AR nodes and a truth that repeated a recall or reason were rewritten, and the numericals were right.
  All blueprints have now been read; the common mistakes are listed in reports/question-quality.md.
