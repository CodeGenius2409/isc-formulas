# Task: Rebuild my ISC 2028 Formula Encyclopedia (new UI, no duplicates, 5 new feature areas, offline PWA)

You have a lot of budget for this. Work autonomously, in phases, and verify as you go. Do not stop to ask me things you can decide yourself; make the call, note it in `DECISIONS.md`, and keep going. Only stop if something is irreversible or genuinely ambiguous.

## 0. Context

I'm an ISC student (Class XI/XII, Dubai). The project is a formula encyclopedia and simulator for **Physics, Chemistry, Mathematics and Computer Science**. The current version is three plain files: `index.html` (268 lines), `styles.css` (886 lines), `script.js` (11,693 lines, 1.6 MB). Copy them untouched into `./legacy/` first and never modify them. They are the reference for behaviour and content.

What exists today (I measured this):
- `script.js` lines 9–9963 hold one giant `FORMULAS` object: `subject → class (XI/XII) → unit → sub-topic → [{ id, name, latex, note }]`. **8,736 formulas** (Physics 2,530, Chemistry 2,586, Mathematics 2,754, Computer Science 866). The rest of the file is state, rendering, favourites, KaTeX rendering, search, and 44 simulators (`toolProjectile`, `toolSHM`, `toolPH`, `toolTruthTable`, etc., listed in `renderTools()`).
- Features I use and want to keep: subject and class switching, syllabus navigation tree, favourites (localStorage), copy-LaTeX, print stylesheet, ⌘K search, dark/light mode, mobile sidebar, all 44 simulators.
- It loads Tailwind, KaTeX and Chart.js from CDNs, which is the opposite of offline.

## 1. Tooling to install and use first

Install and actually use each of these. Read each project's own README for install steps. If one can't be found or installed, tell me plainly in `DECISIONS.md` and carry on; do not pretend it was used.

**Skills (load them before the relevant work):**
- `frontend-design` – load before any UI work.
- `ui-ux-pro-max` – use it to choose palette, font pairing and layout structure for a dense reference/study app, not a SaaS landing page.
- Emil Kowalski's motion skills – all animation timing and easing decisions.
- `impeccable` – run `/audit` and `/polish` at the end of the UI phase and again at the very end, then fix what they find.

**Libraries:**
- `gsap` (with ScrollTrigger only if it earns its place) for motion.
- `lucide-react` for every icon. Delete all the inline SVGs from the old HTML.
- React Bits: pull in components selectively, via its own copy-in install method. Use it sparingly and never in the formula-reading area. Many of its components are flashy, and flashy is what I'm trying to get away from.

**Stack (decided):** Vite + React + TypeScript, Tailwind as a build-time dependency (not the CDN), Vitest for unit tests, Playwright for browser checks, `vite-plugin-pwa` (Workbox) for the PWA. Bundle KaTeX, fonts and chart code locally. Zero runtime CDN requests. The build output must be a static folder I can deploy to Vercel or GitHub Pages.

For the extra features, use `mathjs` (units, expression parsing), `fuse.js` or `minisearch` (search), and a lightweight charting layer (canvas or uPlot/Chart.js, your choice, bundled).

## 2. Data migration (do this programmatically, not by hand)

1. Write a Node script that `eval`s the `FORMULAS` block out of `legacy/script.js` and writes it to typed JSON under `src/data/`, **split per subject and class** and lazy-loaded (the old single 1.6 MB script is a performance problem).
2. **Preserve every `id`.** Favourites in my browser are stored by id, so any removed or merged id must map to its canonical id in an `idAliases.json`, and the favourites loader must migrate old ids automatically.
3. Write a reconciliation check that proves: old count − removed duplicates = new count, with the removed list in `reports/dedupe-report.md`.

## 3. Remove repetitive formulas

I measured these in the current data:
- **65 groups of identical LaTeX** (66 redundant entries). For example: Universal gravitational constant (`p-xi-1-176`) and Gravitational constant (`p-xii-8-35`); Elementary charge in three places (`p-xi-1-183`, `p-xii-8-9`, `c-xi-2-15`); Planck's constant in both Physics and Chemistry.
- **143 groups sharing the same name**, e.g. "Definition of the ampere", "Speed of light in vacuum", "Boltzmann constant", "Unified atomic mass unit". Some of these are legitimately different, so inspect them before merging.
- **Near-duplicates the scripts can't see**, e.g. "Percentage error" (`p-xi-1-11`) vs "Percentage error (product/quotient)" (`p-xi-1-5`), and the same relation written in two equivalent LaTeX forms.

Rules:
- Merge into one canonical entry, keeping the richest `note`. A constant that is genuinely needed in two subjects (Planck's constant in Physics and Chemistry) stays as **one entry tagged with both subjects**, shown in both places, not stored twice.
- Auto-merge only exact matches and clear same-meaning cases. Put everything uncertain in `reports/dedupe-review.md` for me to decide, and do not delete those.
- Do a semantic pass for near-duplicates (normalise LaTeX, compare names, then read the candidates). Report what you found.
- Don't cut anything just because it's minor. I want every formula a student might need, so only true repeats go.
- Some units are labelled "(not in 2028 syllabus)". Leave them in, but make that label visible in the UI, and list them in the report.

## 4. The redesign (completely, not a reskin)

The current design reads as AI-generated and I want it gone: Inter everywhere, sky-blue gradient brand colour, glassmorphism and backdrop blur, radial "mesh" gradient backgrounds, gradient icon tiles, rounded-2xl cards that lift on hover, pill tags, a centered hero with three feature cards, a stat-card row. **Don't carry any of these over**, including the layout skeleton (sidebar + top bar + card grid).

Direction (a starting brief; you and the `frontend-design` skill refine it): a **printed reference book / lab notebook** feel. Formulas are the content, so typography does the work.
- Dense, calm, readable for hours. Hairline rules and spacing for structure instead of boxes and shadows. No gradients, no glass, no glow.
- A distinctive, characterful type pairing chosen with `ui-ux-pro-max`. Not Inter, not the usual trendy display fonts. Tabular numerals and a good mono for values and units.
- A restrained palette with one confident accent and a systematic per-subject colour. A proper dark theme designed on its own terms (not an inverted light theme), plus a high-contrast option.
- A layout that suits the content, e.g. a formula index/reading view with a persistent "working area" for the solver and practice, instead of generic cards. Surprise me, but keep it usable one-handed on a phone during revision.
- Motion (GSAP plus Emil Kowalski's principles): purposeful and quiet. Page and view transitions, list reveals, and feedback on solver steps. Nothing that animates just to animate, durations under ~250 ms for interface feedback, and full `prefers-reduced-motion` support.
- Accessibility: WCAG AA contrast, visible focus, keyboard navigation for everything (including search and the solver), proper landmarks, touch targets ≥44 px.
- A cohesive home screen that is useful (continue where I left off, today's review queue, recent formulas), not a marketing page.

Deliver a short `DESIGN.md` explaining the system (tokens, type scale, spacing, motion rules) so future additions stay consistent.

## 5. New features

### 5.1 Problem solver
- Each solvable formula gets a structured entry in a **solver registry** (separate from the display data, linked by formula `id`): symbols, names, dimensions/SI units, the equation, and constraints (e.g. denominators ≠ 0, valid ranges).
- The user picks a formula, marks which quantity to find, enters the knowns with units (with unit conversion, e.g. cm → m), and gets **step-by-step working**: state the formula, rearrange for the unknown, substitute with units, compute, give the result with correct units and sensible significant figures.
- It must work for **any** variable as the unknown (rearrange symbolically), and handle quadratic-type multiple roots.
- Not all 8.7k entries are computable (definitions, text rules, CS complexity). Start with **at least 300 core computational formulas** across Physics, Chemistry and Maths (kinematics, dynamics, work/energy, gravitation, SHM, waves, optics, electrostatics, current electricity, magnetism, modern physics; gas laws, stoichiometry, concentration, thermodynamics, equilibrium, kinetics, electrochemistry; algebra, trig, calculus, coordinate geometry, vectors, probability, statistics). Make adding more a **data-only change**.
- Show a clear "can't solve this one numerically" state for the rest.

### 5.2 Unit and dimension checker
- Every solver equation is dimension-checked **at build/test time** (a failing test if either side doesn't match).
- User-facing: a "check my equation" tool. Type an equation or choose symbols with units, and it reports whether the dimensions of both sides match, and if not, shows each side's dimensions and explains the mismatch (e.g. "LHS is [L T⁻¹], RHS is [L T⁻²]").
- In the solver, warn on wrong or incompatible units for an input (e.g. entering kg where a length is expected).

### 5.3 Practice questions, mistakes tracker, spaced repetition
- **Tier 1 (computational formulas):** auto-generated numeric questions from the solver registry, with randomised values in sensible ranges, tolerance-based marking, unit checking, and a worked solution after answering.
- **Tier 2 (every other formula):** recall cards and MCQs ("which formula gives X?", "complete the formula") with distractors drawn from the same topic. Aim for coverage of **every formula**, not just the solvable ones.
- A **mistakes tracker**: every wrong answer is logged (question, my answer, correct answer, formula, topic, date), with a filter and a "retry my mistakes" mode.
- **Spaced repetition** (SM-2 or Leitner, your choice, documented) so missed items return sooner. A daily review queue on the home screen.
- Progress stored locally (IndexedDB or localStorage), with export/import as JSON so I can back it up or move devices.

### 5.4 Search
- Instant, typo-tolerant search over all formulas by name, topic, symbols, LaTeX and note text, with filters by subject and class, and ⌘K / `/` shortcuts.
- **Quantity search:** parse queries like `I have v, u, t want s` (also `given v u t find s`, `find s from v u t`). Match against the solver registry's variable sets and rank formulas that solve for the wanted quantity from exactly the knowns above ones that need extras. Show which extra quantity is missing when there's no direct match.
- Search must stay fast with 8.7k entries (index lazily or in a worker).

### 5.5 Simulators
Keep all 44 existing simulators and port them. Several look like duplicates (`projectile` / `projectile2`, `truthtable` / `truth`, `vector` / `vectoradd`, and `circuit` / `ohms` overlap): audit them and merge into single better tools, noting what you merged. Then add or upgrade:
- **Projectile motion:** launch angle/speed/height, optional air drag, trajectory comparison, live readouts (range, max height, time of flight).
- **Circuits:** a DC circuit builder for series/parallel resistor networks and cells, solving currents and voltages (Kirchhoff / nodal analysis), plus keep the series LCR resonance tool.
- **Titration curves:** strong/weak acid–base titrations, pH vs volume curve, equivalence and half-equivalence points, indicator selection and colour-change range, with the underlying equations shown.
- **Graph plotter:** multiple functions, pan/zoom, parse with mathjs, plus derivative/tangent, area-under-curve and intersection points.
- **Java/ISC program tracer:** ISC Computer Science uses Java, so build a **step-through interpreter for an ISC-level Java subset** that runs fully in the browser. Support primitives, operators, `if/else`, `switch`, `for/while/do-while`, 1D and 2D arrays, `String` and common `Math`/`Character`/`Integer` methods, methods and recursion, simple classes/objects/constructors, and input through a text box standing in for `Scanner`. Show the current line highlighted, a live variables table, the call stack, console output, and an auto-built **trace table** (dry run) for loops. For unsupported syntax, give a clear message naming the construct; never crash silently. Include 15+ sample programs from typical ISC board topics (series, number programs, string handling, arrays, sorting/searching, recursion).

### 5.6 Installable offline PWA
- Web manifest, maskable icons, and a service worker that precaches the app shell, fonts, KaTeX assets and all data chunks, so **the entire app works with no network** after the first visit.
- Works as an installed app on Android and on iPhone via Safari "Add to Home Screen" (iOS meta tags, splash, safe-area insets).
- A friendly update prompt when a new version is available. An offline indicator is fine; an error is not.

## 6. Engineering expectations

- Strong typing for the data model and the solver registry. Keep components small. No giant files.
- Keep the print stylesheet working (clean formula sheets).
- Performance: virtualise long lists, render KaTeX lazily and cache results, keep first load fast on a mid-range phone. Report bundle sizes.
- Persist to localStorage/IndexedDB only inside try/catch, and render fine without it.

## 7. How to work and what "done" means

Work in this order, committing after each phase with a clear message: (1) scaffold + tooling + legacy copy, (2) data migration + dedupe, (3) design system + shell + formula views, (4) solver + dimension checker, (5) search, (6) practice/mistakes/SRS, (7) simulators, (8) PWA + performance, (9) `impeccable` audit/polish, final QA.

Verification you must actually run, not just claim:
- Unit tests: solver correctness (compare against hand-worked values for at least 40 formulas), dimension checker, search ranking for `have/want` queries, SRS scheduling, dedupe reconciliation counts, and Java interpreter output against known programs.
- Playwright: screenshots at 375, 768 and 1440 px in light and dark; zero console errors; keyboard-only run through search → open formula → solve → practice.
- Offline test: load once, go offline in Playwright, reload, and confirm every route, formula and simulator still works.
- Lighthouse: PWA installable, accessibility ≥ 95, performance reasonable on mobile.
- Look at the screenshots yourself and fix anything that looks generic, cramped or broken.

Finish with: a `README.md` (how to run, build, deploy), `DECISIONS.md`, `DESIGN.md`, `reports/dedupe-report.md` and `reports/dedupe-review.md`, and a short summary of what you built, anything you couldn't do, and what needs my input (especially the uncertain duplicates).
