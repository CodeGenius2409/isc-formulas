# Audit and polish

## v7: the real `/audit` and `/polish`

**How this was done.** The skills were installed by the owner, and `impeccable`'s own
`/audit` ran this time, with its detector, on a production build. It scanned the source
(675 files, no findings) and every main screen: Today, a unit of the book, find, the
solver, practice, the mock paper, the teacher generator, the projectile and graph
simulators, the Java and Python tracers, the formula editor and Settings, each at 375,
768, 1024 and 1440 px. Each finding was checked against the rendered page before it was
counted. The polish pass then went through the newer screens by eye, in both themes: the
generator, a mock paper with internal choices, Generated marks, figures and the slider.
axe and the keyboard-only test were run again afterwards, in both themes.

### Health score

| # | Dimension | Before | After | Key finding |
|---|-----------|------:|------:|-------------|
| 1 | Accessibility | 3 | 3 | axe passes on every main route in both themes, the generator now included; no AAA work done |
| 2 | Performance | 3 | 3 | First load 289 KB gzipped, everything else lazy; the first screen still carries KaTeX |
| 3 | Theming | 4 | 4 | Tokens only; the one set of literal colours is print's black and white |
| 4 | Responsive design | 3 | 4 | Long reading lines at 768 to 1440 px, and code running into its pane's edge, both fixed |
| 5 | Implementation integrity | 3 | 4 | The remaining detector findings are all checked false positives |
| | **Total** | **16/20, Good** | **18/20, Excellent** | |

### Implementation integrity verdict

**Pass.** The detector found nothing in the source, and on the rendered pages every
finding that remains was checked and is the design working as written in `DESIGN.md`:

- **"Text occlusion" on practice and the solver** at 375 to 1024 px. Below 1280 px the work
  page is a modal sheet over the book, with a scrim, so the page under it is covered on
  purpose.
- **"AI colour palette"** on Today and the graph plotter. It's `#d9abe7`, the Mathematics
  subject colour in Blackboard: flat chalk on slate, no gradient. `DESIGN.md` sets the
  subject colours, and it wins.
- **"Repeating stripes"** on the formula editor. It's the dashed margin rule that marks your
  own formulas, which `DESIGN.md` specifies.

### What was fixed

| Severity | Finding | Where | Fix |
|---|---|---|---|
| P2 | Lines of 90 to 146 characters at 768 to 1440 px | Generator, mock paper, Settings, plotter, formula notes, progress | `65ch` ran to about 90 characters, as Atkinson's digits are wide. A `--measure` token of 36em, about 70 characters, now holds every paragraph in `main`, and replaces each `65ch` and `72ch` |
| P3 | A last word alone on a line | Mock paper's sections | `text-wrap: pretty` on list items, as paragraphs had already |
| P3 | Code ran into the right edge of its pane | Java and Python tracers | Each code line is as wide as its text, with room after it |
| P3 | A two-line label's checkbox sat between its lines | Generator's formats | Checkboxes sit on their label's first line |
| P3 | Icon touching its words, and the second line wrapping under it | "Generate questions" on the mock paper | `gap` on `.text-action`, since flex drops the space |
| P3 | Generated label floating midway across a question's header on a phone | Mock paper, practice | It sits beside the question number, as `DESIGN.md` says; the marks go to the edge |
| P3 | A box for up to three digits running the full width | Settings, days before a fact returns | Now 6rem |
| P3 | axe didn't check the teacher generator | `tests/e2e/a11y.spec.ts` | Added to its routes |

### What holds up

- Selection, the caret, scrollbars and tabular figures are all themed from the palette.
- Generated questions are marked in words and a dotted margin, never colour alone, and the
  Generated label survives black-and-white printing.
- Figures are line drawings in `currentColor` and follow both themes.
- Focus is visible everywhere through `:focus-visible`; touch targets are 44 px on coarse
  pointers.

### Not checked

Real phones, other browsers than Edge, and a screen reader, as before. axe doesn't judge
how a page reads aloud.

---

## Earlier, by hand


**How this was done.** `impeccable` could not be installed, because the permission
system blocked its remote installer. So `/audit`, `/polish` and its detector **did not
run**. I followed the text of `audit.md`, `polish.md` and `craft-floor.md` by hand, wrote
my own checks for what the detector looks for, and reviewed the motion against Emil
Kowalski's `review-animations`. I also scored my own work, so read the scores with that
in mind. To get an independent result, install the tool using the commands in
`DECISIONS.md`.

The brief asked for a pass at the end of the UI phase and one at the very end. Only this
final pass was run.

### Health score

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 3 of 4 | axe finds nothing and the keyboard run passes, but no screen reader was tried |
| 2 | Performance | 4 of 4 | 92 KB gzip of first-load JavaScript, and Lighthouse 89 to 99 on the mobile preset |
| 3 | Theming | 4 of 4 | All interface colour comes from tokens, in both themes and high contrast |
| 4 | Responsive design | 3 of 4 | Clean from 320 to 1920 px and at double text size, but only emulated, not on real phones |
| 5 | Implementation integrity | 3 of 4 | Coherent and specific to this app, but the detector itself was not run |
| | **Total** | **17 of 20** | **Good** |

### Implementation integrity verdict

**Pass, with my own checks standing in for the detector.** The app looks and behaves like
one thing: a ruled exercise book crossed with a handbook. A search of the source finds no
gradients, glass, Inter, eyebrow labels, `transition: all`, or icons from outside lucide.
Corners are 4 px or less on ordinary controls. The only 10 px and 6 px values round the
edges of the phone sheet and the thumb tabs.

### What was found

18 findings: 0 P0, 7 P1, 9 P2 and 2 P3. All of the P1 and P2 findings are fixed. The P3s
were left on purpose.

### P1: fixed

| Finding | Where | Effect | Fix | Now checked by |
|---|---|---|---|---|
| No error boundary | `App.tsx`, `main.tsx` | If a page's code failed to load, the whole app went blank, with no message | `ErrorBoundary` explains and offers Reload | `resilience.spec.ts` |
| Content clipped at 320 px | Unit page, previous and next links | Part of the row was cut off (WCAG 1.4.10) | The links now shrink and truncate | `resilience.spec.ts` |
| Touch targets under 44 px | 8 kinds, such as sliders, breadcrumb, radio rows, formula names | Hard to tap, and the brief requires 44 px | Sized on coarse pointers. Formula names use a larger hit area with no change to layout | `resilience.spec.ts` |
| Breakpoints ignored text size | All stylesheets | With a larger browser font, columns stayed put and squeezed the page | Breakpoints in `em`, shell sizes in `rem` | Checked by hand at 32 px root font, up to 1920 px |
| Close button inside `role="tablist"` | `WorkArea.tsx` | A critical ARIA error for screen readers | Moved outside the tablist | `a11y.spec.ts` |
| `aria-label` on a plain `div` | `FormulaView.tsx` | The label was ignored | Added `role="group"` | `a11y.spec.ts` |
| Visible text missing from the accessible name | Rail tabs, solver symbols | Voice control couldn't match "Ph" (WCAG 2.5.3) | Rail says "Ph: Physics". Solver symbols use real text | `a11y.spec.ts` |

### P2: fixed

| Finding | Where | Fix |
|---|---|---|
| Formula names started at different positions | Desktop rows, 19 px off in rows with no Solve button | The actions column has one fixed width |
| Keyboard users had to tab a long way after choosing a formula | `SolvePane.tsx` | Focus moves to the first box, for keyboard users only |
| Scroll regions not reachable by keyboard | Circuits and Titration tables | Focusable, with labels |
| Plot labels clipped or crossed by curves | `plot.tsx` | Labels choose the side that fits, and have a halo |
| Long headings overflowed at large text | `base.css` | Headings may break within a word |
| Coloured bars down the side of selected items | Find palette, tracer | Background and weight instead, and a wavy underline for an error line |
| `prefers-reduced-motion` killed every transition | `base.css` | Colour and opacity still fade, and nothing moves |
| Three files had grown too large | `interp.ts` (1,074 lines), `parser.ts` (683), `maths.tsx` (538) | Split into focused files |
| Smaller landmark and heading issues | Contents title, search and saved headings, duplicate region name, two ungated hover rules, a repeated scrim colour, "Start practising" squeezed into a sentence | All fixed |

### P3: left on purpose

- **Titration indicator colours are hard-coded.** They describe real chemistry, not the
  theme: phenolphthalein is pink in every theme.
- **Long formula names wrap to three lines at 1440 px.** The contents and work columns
  share that screen, and the formula itself keeps the room.

### Checks that found nothing

- **Storage blocked:** every route works with `localStorage` throwing on every use. No
  storage access exists outside the guarded module.
- **Offline:** every route, all 41 simulators and all 8,422 formulas work with no network,
  and every formula typesets with no KaTeX error.
- **Off-site requests:** none, on any route.
- **High contrast:** clean in both themes.
- **Print:** a unit prints all its formulas, with none of the interface.
- **Debug leftovers:** no `console.log`, `TODO` or `debugger`. The one `console.error` is
  in the error boundary, on purpose.

### Motion review

Against Emil Kowalski's ten standards.

| Before | After | Why |
|---|---|---|
| `transition-duration: 1ms` on everything under reduced motion | `transition-property: color, background-color, border-color, opacity` | "Gentler, not zero": a state change stays noticeable, and only the movement goes |
| GSAP loaded with the first screen | Loaded after first paint, and not at all under reduced motion | Decoration never holds up content, which saves 27 KB gzip |

**Verdict: approve.** Every duration is 240 ms or less. Entrances use ease-out or
`expo.out`, and there is no `ease-in` or `scale(0)`. Only `transform` and `opacity`
animate. Nothing animates after a keyboard action, and the find palette opens instantly.
Hover motion is gated to devices that can hover. Toasts use CSS transitions, so they can
be interrupted.

**One knowing exception.** List reveals run on a screen students see constantly, which
the guidance would normally cut. The brief asks for them by name, so they stay, limited to
the first 10 rows at 180 ms, and never after a keyboard action.

### Polish pass

I walked the main path at 375, 768 and 1440 px in both themes, looking at the screenshots
rather than relying on the tests. That turned up the misaligned names, the clipped plot
labels and the awkward "Start practising" link, all of which automated checks had passed.
