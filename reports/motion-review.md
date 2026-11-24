# Motion review, v8

How v8's motion was checked: what moves, what each transition looked like frame by frame at phone
and desktop sizes, whether it feels premium, Emil Kowalski's `review-animations` on all of it,
impeccable's `/audit` and `/polish` afterwards, and frame rates on a throttled mid-range phone.
`DESIGN.md` (Motion) describes the system; `DECISIONS.md` (v8) says where it goes beyond the old one.

## How it was looked at

Each transition was recorded on a production build (`npm run preview`) in Edge, at 390 × 844 (a
phone, at 2×, with touch) and 1440 × 900, with the tools in `scripts/motion/`:

- `capture.mjs` freezes every animation the moment it starts, View Transition pseudo-elements
  included, and steps through time, screenshotting each frame: 0, 40, 80, 120, 180, 240, 320, 420,
  520 and 700 ms, plus a filmstrip of all of them.
- `slow.mjs` runs every animation at a tenth of its speed through the DevTools protocol and
  screenshots in real time. It was more trustworthy for sheets, whose CSS transitions the freezing
  method can misplace.
- `perf.mjs` traces each transition with Chrome's frame reporting, on the phone profile with the
  CPU slowed 4×.

The frames were looked at, not just taken. Everything they showed wrong is in the findings below,
with the fix and a fresh capture after it.

The captures themselves aren't committed (they're large and change with every tweak); the scenarios
are, so any of them can be recorded again.

## Premium check

Each main transition, judged honestly against the brief: does it feel premium, noticeable and
polished, and does it still read as the printed book? Where the first version fell short, what was
changed is in the last column, and the verdict is for the version that ships.

| Transition | Phone | Desktop | Verdict | What changed to get there |
|---|---|---|---|---|
| Page turn forward (contents → unit, unit → formula) | The new page is pushed over the whole width with a shadowed edge; the old one slides a third as far beneath and pales; the title arrives a beat later | The new page comes 3rem in as the old slips back and goes | **Premium.** Noticed at once, and it reads as a sheet laid on a sheet | First version: both pages at half strength at once (ghosting). Opacity staged: old gone by 30%, new from 20% |
| Page turn back (breadcrumb, Back, prev unit) | The top sheet lifts away to the right, shadow and all, and the page beneath comes forward | Mirror of forward | **Premium.** Back plainly feels different from forward | Nothing |
| A formula row growing into its page | The maths travels from its row to the big formula as the page turns under it | Same | **Premium.** The clearest "this is that" moment in the app | Both ends drawn tight (`fit-content`); a full-width end made the text balloon to twice its size |
| A subject on Today / its rail tab into its contents | "Physics" grows into "Physics, Class XI" | Same | **Polished.** A brief double image mid-morph as the two texts cross; kept short by fading the old one at twice the speed | Nothing further |
| A unit's line into its title | "Laws of Motion" lifts out of the contents and grows into the title | Same | **Premium** | The same `fit-content` fix |
| A tool into its page | The tool's name grows into the page title while the page widens | Same | **Polished** | The page box now travels when its size changes (a tool takes the full width); before, the old page was redrawn into the new box, shifted and enlarged |
| Between sections (Today, Tools, Saved…) | Old fades in 160 ms, new rises into place, title after | Same | **Polished, deliberately quieter** than a page turn: these are siblings, not a deeper page | Title layer delayed to 100 ms so it no longer crossed the fading old page |
| Theme | The blackboard is drawn down over the paper like a blind | Same | **Premium.** The one place motion is purely for pleasure, and it's seen rarely | First version: no blind at all (`inset()` to `none` jumped at 50%), and colour transitions under it. Both fixed |
| Work and contents sheets | Rise on the spring with the page dimming; swipe down to throw away | Slide from the edge | **Premium** on a phone; **polished** on a tablet | First version: the page behind jumped 776 px (focus scrolled to an off-screen dialog), the content emptied early on a slow phone, and a reopen jumped. All fixed |
| Find | Opens instantly; closes with a short fade | Same | **Right**, which here means fast | The first opening was 390 ms in v7 and v8 alike; Find is now put on the page when the browser is idle, so it's about 90 ms, then 8 ms |
| Tabs and segments | The ink fill (or red-pen underline) slides between choices | Same | **Polished** | Skipped during a theme change, where the old picture caught it half-way |
| Solver | Working written out line by line, the answer landing after | Same | **Premium.** It reads like working being written | Nothing after a key; it used to stagger after Enter |
| Marking | Tick written on, or a small shake and a cross | Same | **Polished, and serious**: no bounce on an answer | Pen marks drawn with `clip-path`, not stroke dashes, to keep to the allowed properties |
| Next question | The new one slides in from the right | Same | **Polished** | The first version faded a copy of the old question out over the new; it left disabled answers on the page for a moment, which a test and any assistive tool could find. The copy is gone |
| Lists | First sight: rows rise in a wave; FLIP for changes | Same | **Polished.** Quiet by design: it's the tens-of-times-a-day tier | Never during a page turn (one entrance per container) |
| Today, first visit | The date is written in, then the sections settle | Same | **Premium**, and once a visit | Rewritten on WAAPI: in v7 it never ran on first load, as GSAP wasn't there yet |
| Tour | The note travels from step to step | Same | **Polished** | Nothing |
| Checkboxes, slider thumb, star, copy | A drawn tick; a thumb that grows; a star that pops; a tick written in on Copy | Same | **Polished** | Baseline-aligned boxes sat 2 px high; moved down with `translate` |

Nothing was judged cheap or unfinished in the version that ships. Two are judged polished rather
than premium on purpose (section changes, lists), because they're seen many times a day.

## Emil Kowalski's `review-animations`, on every transition

The review was run on the code and on the frames, transition by transition, against its ten
standards. Each finding was fixed and checked again on a fresh capture.

### Part 1: findings

| Before | After | Why |
| --- | --- | --- |
| Page turn: old page `opacity 1 → 0` and new page `0 → 1` over the same 460 ms | Old page gone by 30%, new page from 20% to 70%; the movement runs the whole way (`turn-in`, `turn-under`) | Frames at 40–120 ms showed both pages at half strength: two pictures fighting, not one turn |
| Morph from a unit's line (a tight span) into a full-width `h1` | `width: fit-content` on both ends of a morph | The old picture was stretched to a column's width: "Laws of Motion" flashed up at twice its size |
| `.thumb` animated `margin-right` | `transform: translateX(-15px)`, `none` when open, `-8px` on hover | A layout property, animated; it re-laid out the rail every frame |
| `@keyframes row-flash` animated `background` | A `::after` wash of `--paper-3` whose `opacity` fades | Paint every frame on a row; opacity composites |
| `flash()` animated `backgroundColor` | `.value-flash::after`, `opacity` only, through WAAPI's `pseudoElement` | Same |
| `@starting-style { .sheet[open] { transform: translateY(100%) } }` | Open in place, then `dialog.animate()` from the edge | `showModal()` focused a dialog below the screen and the document scrolled 776 px to reach it: the page behind jumped |
| Sheet content mounted with `showModal()` | Mounted a frame later; focus moved into it once it's there | The first frame of the slide waited ~100 ms for the work pane to draw, so the sheet appeared already half-way up |
| Sheet content removed on a 420 ms timer | Removed on the slide's `transitionend` (timer as a fallback) | On a slow phone the sheet could empty before it had gone |
| `@keyframes blind { from { clip-path: inset(0 0 100% 0) } }` | An explicit `to { clip-path: inset(0 0 0 0) }`; the same for `pen-write`, `pen-rule`, `unroll` | `inset()` to `none` doesn't interpolate: the theme flipped at 50% with no blind at all |
| `animation: unroll … both` | `backwards` fill | Holding `clip-path: inset(0)` afterwards would clip focus rings for good |
| Theme blind over live colour transitions | `transition: none !important` under `:root[data-vt]` | The blind uncovered a page still fading between themes, so nothing seemed to happen until the end |
| Segment slide during a theme change | Skipped when `data-vt` is set | The old picture caught the fill half-way, with two labels invisible, for the whole 620 ms |
| `stepsReveal` ran after Enter | Skipped after a key; `landResult` too; a right answer's fade too | The working was hidden for up to a second after a keyboard submit |
| A list reveal with a uniform 12 ms step | `staggerDelay`: gaps that shrink (`42·i^0.78` ms, capped at 260 ms) | A metronome, in choreography terms |
| A list revealing while the page turned | Skipped while `data-page` is set | Two entrances in one container |
| `@media (hover: hover)` alone on the rail's subject tabs | `(hover: hover) and (pointer: fine)` | Touch screens that claim hover leave the tab stuck out |
| `::view-transition-group(page) { animation: none }` | The group travels between boxes; its pictures keep their own size, from the top left | Opening a tool, which takes the whole width, redrew the old page into the new box, shifted and enlarged |
| A sheet arriving by WAAPI **and** a CSS transition from the same rule | The transition only on the closing state; a drag's snap back sets its own | Two animations on one transform on every opening |
| A thrown sheet's inline `transition: transform …` | `transform, overlay, display` together | Without `overlay` and `display` the sheet vanished mid-throw |
| `:root[data-input='key'] details[open] > :not(summary)` | `details[data-instant]`, set on the element from the keyboard | A rule under a root attribute ending in a near-universal selector restyled the whole page (350 ms at 4× CPU) each time input switched between keys and pointer |
| A skipped page turn left `ready` rejected | `transition.ready.catch()` | An unhandled `AbortError` whenever a turn was interrupted; a test caught it |
| Toast on `--spring-pop` (9% overshoot) | `--spring-sheet` | A message bouncing; the detector flagged it as bounce easing, rightly |
| A page turn after any change of address | Only after a press or tap in the last second, or a move through history | The tour and code that set the address found the old page still drawn for a frame |
| `.dock-item` active state had no press feedback | `scale(0.96)` on `:active`, `touch-action: manipulation` | Taps felt late on a phone |

### Part 2: verdict

1. **Feel-breaking regressions.** None left. The two found (the page behind a sheet jumping, and
   the theme flipping with no blind) were bugs of the first version and are fixed.
2. **Missed simplifications.** The Find palette, typing in it, and a page changed from the keyboard
   don't animate. The palette's results don't either: they change on every key.
3. **Performance.** Everything moves by transform, opacity or clip-path; the one exception, the
   OR choice's note, changes `visibility` with no frames in between. Frame rates are below.
4. **Interruptibility.** Page turns are skipped where they are by the next one; sheets retarget
   from where they're drawn; the sliding fills start from wherever the last slide had got to; FLIP
   items start from where they're drawn. Tests cover each.
5. **Origin and cohesion.** Sheets come from their edge, pages from the side they're going, the
   tour note from the last step. Pen marks are written left to right. One curve family for
   everything that enters, one for what moves across.
6. **Accessibility.** Reduced motion is honoured from the device or the new setting, keeps fades,
   and is tested.

**Approve**, with the page turn (460 ms), sheets (440 ms) and theme (620 ms) over 300 ms as the
documented exceptions, explained in `DECISIONS.md`.

## Frame rates on a mid-range phone

`node scripts/motion/perf.mjs`, on a production build, in Edge with the real GPU (headed, off
screen, so frames are paced by a display), at 390 × 844 and 2× with touch, and the CPU slowed 4×
as Lighthouse does for a mid-range phone. Each transition was traced; the frames counted are the
ones the GPU process drew and swapped from the first frame of motion to the last. A gap of more
than one and a half frames counts the frames missing from it as dropped. v7 was measured doing the
same things on its own build. It mostly has no motion, so its dropped frames are the page drawing.

| Transition | v8 frames | v8 dropped | v8 longest frame | v7 dropped | v7 longest frame |
|---|---:|---:|---:|---:|---:|
| Page turn forward, contents to a unit (phone) | 42 | 2 | 40 ms | 7 | 128 ms |
| Page turn back, up to the contents (phone) | 47 | 1 | 34 ms | 6 | 94 ms |
| Formula row growing into its page (phone) | 35 | 1 | 32 ms | 8 | 69 ms |
| Between sections, Today to Tools (phone) | 32 | 9 | 142 ms | 5 | 109 ms |
| Work sheet opening (phone) | 24 | 9 | 147 ms | 19 | 336 ms |
| Work sheet dragged and thrown down (phone) | 26 | 6 | 90 ms | (no drag in v7) | |
| Theme, Paper to Blackboard (phone) | 38 | 0 | 19 ms | 0 | 26 ms |
| Page turn forward (desktop, 1440 px) | 41 | 1 | 33 ms | 19 | 263 ms |
| Long list: the biggest unit scrolled through (phone) | 108 | 627 | 1330 ms | 375 | 903 ms |

What the numbers say:

- **Page turns, morphs and the theme hold the display rate** with at most two dropped frames,
  because they're View Transitions: the compositor moves pictures while the main thread is free to
  draw the new page.
- **The sheet still drops frames at its start**, 9 to 11 at 4× CPU. The trace shows why: opening a
  native modal `<dialog>` makes the rest of the page inert, and the browser restyles the whole page
  for it (about 400 ms of main-thread work at 4× CPU on a unit's page). v7 paid it too, and worse.
  Two things were fixed on the way: the content is now drawn after the slide has carried the sheet
  most of the way (it was drawn in the slide's first frames), and a stylesheet rule that restyled the
  whole page on the first tap is gone (see the findings). What's left would need the sheet to stop
  being a native modal, which is a bigger change than this brief, and is noted below.
- **Between sections** drops its frames after the movement has ended (the longest frame is 607 ms
  in, while the Tools page finishes drawing and the dock's underline settles); the cross-fade and
  rise themselves were smooth.
- **The long list** is the same story in both versions: scrolled from script a step a frame under a
  4× CPU, the list draws its rows (and their maths) as they arrive. v8 adds no motion to scrolling.
  The numbers move by tens of percent between runs on this machine; v7 and v8 aren't distinguishable.
  A real finger fling is scrolled by the compositor, which this setup couldn't measure (a
  synthesized fling drew too few frames to count).

Not measured: a real phone. The traces are a desktop GPU with a slowed CPU, which is how Lighthouse
models a mid-range phone, but a real mid-range GPU and thermal throttling aren't in them.

## impeccable `/audit`

Run on the production build, the detector against the source and the rendered pages (Today, a
unit, a formula, Tools, Settings, Progress) at 1440 and 390 px, then the five dimensions by hand.

| # | Dimension | v7 (after its polish) | v8 | Key finding |
|---|---|---:|---:|---|
| 1 | Accessibility | 3 | 3 | Reduced motion is now a setting as well as the device's, set before first paint, and tested; axe passes at 375 and 1440 px in both themes; still no AAA work |
| 2 | Performance | 3 | 3 | First load +1.74 KB gzipped, within budget; transitions at the display rate; the sheet's opening stall is the modal's own restyle (above) |
| 3 | Theming | 4 | 4 | Every motion value is a token; the theme change is drawn as a whole new picture, with no half-changed colours |
| 4 | Responsive design | 4 | 4 | Phone sheets follow the finger and can be thrown; desktop page turns are shorter than the phone's full push |
| 5 | Implementation integrity | 4 | 4 | One motion system: `motion.ts`, `motion.css`, `motion-later.css`, `motion-kit.tsx`; no one-off values |
| | **Total** | **18/20** | **18/20** | Held, with motion added throughout |

Detector: the source scan found one advisory, "bounce or elastic easing", on the update prompt's
spring. That spring overshoots 0.1%, so it's a false positive, but the toast beside it did bounce
(9%) and was moved to the same spring. The rendered scan found one warning on Tools and Today in
Blackboard, the Mathematics chalk colour, which v7's audit already recorded as checked and intended.

## impeccable `/polish`

The whole path, looked at in both themes at phone and desktop sizes after the motion was in:

- Drawn checkboxes sat 2 px high in rows that line a box up with the first line of its label
  (`.gen-check` aligns by baseline, and a drawn box's baseline is its bottom edge). Moved down with
  `translate`, which moves nothing else.
- Find's first opening took 390 ms in v7 and in v8 alike, because Find was only built then. It's now
  built, closed, when the browser is idle after first paint: about 90 ms the first time, 8 ms after.
- Two capture tools were written and kept (`scripts/motion/`), so the next person can look at a
  transition the same way rather than by eye at full speed.
- Slider thumbs, the dock's red-pen underline and the drawn checkboxes were checked against both
  themes and high contrast: each uses `--accent`, `--rule-2` and `--paper` only.

## Tests

`tests/e2e/motion.spec.ts`:

- **Reduced motion moves nothing**: from the device, a page change, a sheet opening and closing, and
  a page turn back record no animation that changes a transform; a cross-fade does run. With the
  setting on Reduced, the same on a desktop. The setting overrides the device both ways and is
  there after a reload, before the app's code runs.
- **Keyboard actions aren't delayed**: Find opens from `/` and Ctrl+K with nothing animating it, the
  first time in under 200 ms and after that in under 60; a link followed with Enter changes the page
  with no page turn; the work sheet opened and closed from the keyboard moves nothing.
- **Interrupting a transition leaves the right state**: a second page change mid-turn lands on the
  second page with nothing left named or running, and Back twice lands where history says; a sheet
  closed while opening, and opened again while closing, ends open, in place, with its content and no
  animation running; a short slow pull lets a sheet settle back, and a quick short flick closes it.
- **The page works mid-turn**: with every animation slowed twenty times, a row on the new page
  opens when pressed while the turn is still running.
- **The first load stays within 2 KB**: the gzipped first load, measured as `npm run sizes` does,
  against v7's 291,994 bytes.

## Left out, and why

- **Tooltips.** The app's are the browser's own `title` tooltips, which can't be animated. Custom
  ones built only to animate would be a second way of naming every icon button.
- **Switches.** There are none; every on/off choice is a checkbox, and those now have a drawn tick.
- **Find's results.** They change with every key typed, so they don't move.
- **The sheet's opening stall on a slow phone** (above). The cure is a sheet that isn't a native
  modal `<dialog>`, which would mean rebuilding its focus trap, Escape and inert page by hand.
- **A real phone.** Everything here was measured in Edge on this machine, with the CPU slowed and a
  phone's screen size and touch. Please try a sheet's swipe and a page turn on your own phone.
