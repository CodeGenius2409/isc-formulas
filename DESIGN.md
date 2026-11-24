# Design system

The reference for keeping new work consistent. Values live in
[src/styles/tokens.css](src/styles/tokens.css), and motion lives in
[src/lib/motion.ts](src/lib/motion.ts).

## The idea

A ruled exercise book crossed with a printed handbook: the two objects an ISC
student actually studies from. Formulas are the content, so type and rules do the
work. There are no cards, gradients, glass or glow, and no shadows on anything at rest (only a
lifted sheet has one, while it is lifted; see Motion).

Two things carry the identity. Everything else stays quiet.

1. **The margin rule.** One continuous line runs down every formula list, with
   section numbers to its left, as in a ruled exercise book.
2. **The thumb index.** Subjects are coloured tabs on the edge of the page. The open
   subject's tab reaches the page, as if the book were open there.

The running head is a third, smaller borrowing from handbooks: it stays at the top
and names the section under it as you scroll.

**Layout.** Rail, contents, reading page, work page: the book open on the left and
your working on the facing page. Below 1280 px the work page becomes a sheet, and
below 1024 px so do the contents. Below 768 px the rail becomes a bottom dock, so
everything sits within thumb reach. Simulator pages drop the contents and work page,
because a plot needs the room. On a narrow screen their result comes above the
controls, and a lone plot stays on screen while you scroll.

Those breakpoints are written in `em`, and shell sizes in `rem`, so someone who sets
a larger text size in their browser gets the layout that fits it. Keep to that when
adding one: 1280 px is `80em`.

## Colour

Components use tokens only, and canvases read them at draw time so plots follow the
theme. There are two themes, each with a high-contrast variant.

| Token | Paper | Blackboard | Use |
|---|---|---|---|
| `--paper` | `#f7f8f4` | `#1d2a26` | Page |
| `--paper-2` | `#eef1ea` | `#24332e` | Work page, rail |
| `--paper-3` | `#e4e8e0` | `#2d3e38` | Hover |
| `--ink` | `#15202b` | `#eeece1` | Text |
| `--ink-2` | `#414d59` | `#cdd0c4` | Secondary text |
| `--ink-3` | `#5a6671` | `#a9b2a8` | Margin numbers, meta |
| `--rule` | `#cdd8dd` | `#3b4c46` | Hairlines between rows (decorative) |
| `--rule-2` | `#76838e` | `#7d8d86` | Control borders (at least 3:1) |
| `--margin` | `#c2283e` | `#d9bd57` | The margin rule |
| `--accent` | `#a8152d` | `#f0d264` | Red pen or yellow chalk: current item, active tab |
| `--focus` | `#1457c4` | `#8fc7f0` | Focus rings only |
| `--good`, `--bad` | green, carmine | chalk green, chalk pink | Marking. Always with an icon and words too |

Subject colours are `--physics`, `--chemistry`, `--mathematics` and
`--computerscience`. Setting `data-subject` on an element gives its children
`--subject`. They mark where you are in the book and nothing else.

Java uses only ink colours and weight: keywords `--accent` and semibold, primitive types
`--ink` and semibold, strings `--good`, numbers and literals `--warn`, comments `--ink-3`
in italic, operators `--ink-2`. Subject colours stay out of it. The classes are `.tok-*`.

Python uses the same classes: keywords `--accent` and semibold, the built-in type names (`int`, `str`,
`list` and so on) `--ink` and semibold, strings `--good`, numbers and `True`, `False` and `None` `--warn`,
comments `--ink-3` in italic. The Python tracer adds three things, in words rather than colour. A name that
shares its list with another has a note under its value, in `--ink-2` italic: "Same list as b." What was typed
into the input box follows its prompt in the console, in `--ink-2` italic, as a terminal shows it. And Python's
own error line is set in the mono face, with the plain-words reading under it in `--ink`. A download's
progress is a 4 px bar of `--accent` on `--paper-3`, which eases forward as the bytes arrive.

Questions in practice and mock papers use the same tokens. A code block sits on
`--paper-2`, and a generated circuit is drawn in `--ink` with `currentColor`, like the
structures. The right and wrong states of an option are `--good` and `--bad` with words, and a
chosen option is a heavier `--ink` border. A mock paper's clock sits in a plain bar on `--paper`.

A structure with lone pairs is drawn in `--ink` like the skeletal ones. A lone pair is two dots, and
the pair a structure is about is `--accent`, the red pen, so it reads as marked up by a teacher. They
appear only where the electrons are the point: functional groups stay plain.

Your own formulas read as a note handwritten into a printed book, using nothing new. A pen mark
(`PenLine`, in `--accent`) takes the place of the margin number. The margin rule breaks into a dashed
stretch beside the row, alternating `--margin` and `--paper`. A small italic "Your formula" sits by the
name in `--ink-2`. A formula just saved holds on `--paper-3` and fades. With reduced motion it holds
without fading. Edit and Delete appear on these rows and on no others.

In the SMILES box, the atom being talked about is marked in `--accent` in both the text and the drawing, with a dot-free ring on the drawing and a solid underline in the text. A mistake is marked in `--bad` with a dotted underline, always with words beside it.

Blackboard is designed separately, not inverted: slate green rather than black,
chalk white rather than grey, and subjects in coloured chalk. Don't derive one theme
from the other.

### Generated questions

A generated question reads as a note of caution, using nothing new. This covers questions made from a blueprint and compiled bank questions, which are frozen from one and weren't read one by one (`isMarkedGenerated` in `src/practice/bank/define.ts`). The slider counts both, so nothing marked appears at 0%. These are the rules, and they're in `src/components/bank/GeneratedMark.tsx`:

- A small **Generated** label with the `Dices` icon, beside the question number, in `--ink-2`. No colour of its own, so it survives black-and-white printing.
- The margin beside the question becomes a **dotted** rule in `--ink-2`. That's what tells it apart from your own formulas, whose margin is **dashed** and marked with a pen. Hand-written and fact-based bank questions have no mark beside the number. They carry the small note "Original practice question, not an official ISC question." in `--ink-3`, under the question; a paper says it once at the top.
- Under the label, the notice "Generated practice question. This is not an official ISC question and may contain mistakes." sits in an expandable note, so it's one tap away and doesn't crowd the question.
- A mock paper shows a small **legend** once, at the top of the first page, with the label and what it means, and the notice beside it.
- In print, the label and the dotted margin remain. A printed paper has a small footer saying it contains generated questions.

### The tour and tips

The first-visit tour is a note on the page, like a teacher's slip tucked into a book: `--paper`, a `--rule-2` hairline, sharp corners, no shadow, and nothing dimmed behind it, so the app keeps working under it. A small notch in its edge points at what the step is about, and that is circled in the red pen or the yellow chalk, a 2 px `--accent` outline drawn inside its edge. When a pointer moves it on, the note travels to its next target and fades in over 160 ms; after a key it simply appears there. One-time tips are quieter still: a `--rule` hairline and `--ink-2` text with a lightbulb, and a Got it button. The tour's `?` sits beside Today's date.

### Figures

Physics figures are line drawings from `src/components/bank/BankDiagram.tsx`, in `currentColor` so they follow both themes, with `--paper` to mask lines behind labels and `--paper-3` for water and glass. No other fill. Each has a text description as its accessible name. On screen, it opens larger when tapped, and it scales to the page's width up to 20rem. In a Word file, it's a black PNG on white.

## Type

Chosen with the `ui-ux-pro-max` data. Its "Academic" pairing proposed Atkinson
Hyperlegible for text. Crimson Pro, its heading choice, breaks up on low-density
phones and on the dark theme, so headings use Besley instead.

| Role | Face | Why |
|---|---|---|
| Headings | Besley | A Clarendon, the look of older textbooks. Sturdy at small sizes. |
| Text and controls | Atkinson Hyperlegible Next | Made for legibility. `l`, `1` and `I` stay distinct, which matters for symbols. |
| Numbers, units, code | Atkinson Hyperlegible Mono | Tabular. Only for real data, never as decoration. |
| Mathematics | KaTeX fonts | Set 1.22× the surrounding text, since it is the content. |

All are bundled. Greek letters in plain text fall back to the system font.

| Step | Size | Use |
|---|---|---|
| `--step--1` | 13 px | Margin numbers, notes, meta |
| `--step-0` | 15 px | Rows, controls |
| `--step-1` | 17 px | Section heads |
| `--step-2` | 22 px | Subject name |
| `--step-3` | 28 px | View titles |
| `--step-4` | 36 px | Today's date only |

Reading text holds a measure of about 70 characters, `--measure` (36em), which every paragraph in `main` takes. Don't use `ch` for it: Atkinson's digits are wide, so `65ch` runs to about 90.

Write in sentence case, with no all-caps labels and no label above a heading. Name
controls by what they do, such as "Solve with this" or "Copy LaTeX".

## Spacing and structure

Spacing is on a 4 px base: 4, 8, 12, 16, 24, 32 and 48.

Structure comes from hairlines and space. Before adding a border, ask whether space
alone would do. Corners are 3 px on controls, and sharp everywhere else.

Touch targets are at least 44 px on coarse pointers, handled in the stylesheets with
`@media (pointer: coarse)`. Inputs are 16 px there, because iOS zooms in on anything
smaller.

## Motion

Motion is how the book behaves when it is handled: a page laid over the last, a sheet of paper
slid in from the edge, a pen mark written on. It should be noticed, and it should feel made with
care, but it is never decoration. Every movement answers something the reader did, or shows where
something went.

The values live in [src/styles/tokens.css](src/styles/tokens.css) and, for scripts, in
[src/lib/motion.ts](src/lib/motion.ts). Nothing uses a value of its own.

### Tokens

| Token | Value | For |
|---|---|---|
| `--dur-press` | 110 ms | Press feedback |
| `--dur-quick` | 160 ms | Hover, colour, small exits |
| `--dur-standard` | 240 ms | Controls: tabs, segments, toasts, a list item leaving |
| `--dur-emphasis` | 380 ms | Something that matters arriving: an answer, a list item, the working |
| `--dur-page` | 460 ms | A page turn and a morph |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Anything entering or exiting |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Something moving across the screen, such as the theme blind |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Page turns, and sheets where springs aren't available |
| `--spring-sheet` | response 0.4 s, damping 0.9, settles in 440 ms | Sheets, the sliding fills of tabs and segments, FLIP lists |
| `--spring-pop` | response 0.3 s, damping 0.6, settles in 520 ms | Small controls only: a star filling, a slider's thumb |

Springs are `linear()` curves sampled from a damped spring, so they run on the compositor like
any other easing. Browsers without `linear()` get the drawer curve or ease-out. The sheet spring
barely overshoots (0.1%), because paper doesn't bounce; only `--spring-pop` does, and only on
controls.

### What moves

| What | Motion | Where |
|---|---|---|
| Moving deeper (book, unit, formula, a tool) | A page turn. Desktop: the new page comes 3rem in from the right as the old one slips 1.75rem left and goes; their opacity is staged so the two never show through each other. Phone: the new page is pushed over the whole width with a shadowed edge, and the old one slides a third as far beneath it and pales. The title arrives a beat later, as its own layer | View Transitions: `page-transition.ts`, `motion.css` |
| Going back, or up | The top sheet is lifted away to the right and the one beneath comes forward | Same |
| Between the main sections, or the classes | The old page fades in 160 ms, the new one rises 0.75rem into place | Same |
| Something pressed that becomes the page | A morph: a formula row's maths into the formula page, a subject on Today or its rail tab into the subject's contents, a unit's line into its title, a tool into its page | `data-morph`, `data-morph-hero` |
| Without View Transitions | The new page slides in from the side it came from, by GSAP | `page-transition.ts` |
| The theme | The new theme is drawn down over the old like a blind, 620 ms, ease-in-out | View Transitions |
| Sheets (work, contents) | In on the sheet spring from their edge as the page dims; out in 380 ms on the drawer curve. On a phone they follow the finger and can be thrown down: past a third of their height, or a flick faster than about 0.45 px/ms, and they go at the speed they were thrown | `Sheet.tsx`, `controls-motion.ts`, `sheet-drag.ts` |
| Find | Opens instantly, always. Closes with a 160 ms fade | `motion.css` |
| Toast, update prompt | Up on the sheet spring, down in 160 ms | `motion.css` |
| Press | Buttons `scale(0.97)`; dock, rail, tabs and segments `scale(0.96)`; links in lists `scale(0.99)` | CSS |
| Tabs and segmented controls | The fill, or the tabs' red-pen underline, slides from the old choice to the new on the sheet spring. So does the solver's symbol to find, across rows | `controls-motion.ts` |
| Dock and rail | The current place is underlined in the red pen, drawn out from the middle; the rail's subject tabs slide out from under its edge | `shell.css` |
| Checkboxes | The tick is written on, left to right | `motion-later.css` |
| Collapsible sections | Unroll downward, clipped from the top edge, as a folded note opens | `motion-later.css` |
| Lists | Reveal on first sight only: the first 10 items rise 8 px in a wave whose gaps shrink, never while a page turn carries them in. Items entering, leaving and reordering glide (FLIP); a leaving one fades where it was while the rest close the gap. Rows below a formula that opens glide to their places | `motion-kit.tsx` |
| Reordering a paper | The question picked up lifts and pales; the red pen draws the line where it will land | `motion-later.css` |
| The solver | The working is written out line by line, each revealed from the left like a pen stroke, then the answer lands with a small settle | `motion-kit.tsx` |
| Marking | Right: the notice settles in and a tick is written on. Wrong: three small shakes, 5 px at most, and a cross is written on. No bounce on any answer, mark or formula | `PenMark.tsx`, `motion-kit.tsx` |
| Practice and papers | The next question comes in from the right as the last goes; the session's red-pen line fills; marks count up to their value; of an OR pair, "Answering this one" cross-fades to the one chosen | `motion-kit.tsx` |
| Tracers | The current line's highlight is one band that glides from line to line; a value that changes is washed with the highlighter, which fades | `tracer-parts.tsx` |
| Plots | A change that arrives on its own (a preset, a button) dissolves from the old drawing into the new; a drag stays direct | `plot.tsx` |
| Sliders | A round thumb in the red pen that grows under the finger | `motion-later.css` |
| Loading | "Opening" appears only if a page takes more than 260 ms, and fades in. A download's 4 px red-pen line eases forward as bytes arrive, or a short stroke travels along it while the size is unknown | `LoadBar.tsx` |
| The tour | The note travels from one step's target to the next | `Tour.tsx` |
| Today, first visit | The date is written in from the left, then the sections settle in below it, once a visit | `AnimatedContent.tsx` |
| Small marks | A star fills with a pop; Copy shows a tick written in, in `--good`, for a moment; your own formula, just saved, has its dashed margin drawn down and its pen mark written in | Rows and the formula page |

### Rules

- Motion answers an action or shows what changed. Nothing animates to look lively.
- Only `transform`, `opacity` and `clip-path` move. A layout change is a FLIP. Colours may still
  cross-fade, as they always have.
- A keyboard action never waits for motion. Find opens instantly from `/` or Ctrl or ⌘ K; a page
  changed from the keyboard is simply there; a sheet opened or closed from the keyboard appears or
  goes; the working and a result are shown at once. `<html data-input="key">` lets a stylesheet tell.
- Nothing blocks input. Pages are usable mid-turn (the overlay passes pointer events through), a
  closing sheet stops being modal at once, and a new action cancels an old one where it is drawn.
- Entering is ease-out, never ease-in, and nothing starts from `scale(0)`. Exits are faster than
  entrances.
- One entrance per container: when the page turns, its contents ride with it rather than staggering.
- Shadows appear only on something lifted, while it is lifted: an open sheet, and the sheet on top
  in a phone's page turn. Nothing at rest has one.
- Reduced motion is a setting (Match device, Reduced, Full) as well as the device's preference.
  It is set on `<html data-motion>` before first paint. Reduced keeps every fade and cross-fade and
  removes all movement.
- The first screen pays almost nothing: page turns, the springs and the sliding fills load just
  after first paint, as GSAP does, and the motion for later pages loads with them. Until then,
  things simply change.


## Accessibility floor

- WCAG AA contrast in every theme. `tests/e2e` runs axe on the main views.
- Visible focus through `:focus-visible`, in the `--focus` colour.
- Every feature is reachable by keyboard. `/` and Ctrl or ⌘ K open find. The edge of the work page
  takes the arrow keys, Home and End to resize it, and Enter to reset it.
- Landmarks: subject nav, main nav, the contents `aside`, `main`, and the work `aside`.
- A failure is explained, never blank. Pages sit inside `ErrorBoundary`.
- Right and wrong are shown with an icon and words, never colour alone.

## Printing

`print.css` removes all chrome and prints the whole unit as a clean sheet. The
virtual list renders every row on `beforeprint`.

The teacher's paper prints from its own sheet, `PrintSheet`, with the header it was given,
at the chosen font size, with lines for answers if wanted. Simulators never print: the
figure of the same set-up does.

## When adding something

- A new screen: reading page or work page? Don't add a third surface.
- A new colour: don't. Pick a token.
- Long lists go through `FormulaList`, which virtualises them.
- Never use a React Bits component in the formula-reading area.
- A selected item is marked by background and weight, not by a coloured bar down its
  side.
