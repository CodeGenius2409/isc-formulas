# Design system

The reference for keeping new work consistent. Values live in
[src/styles/tokens.css](src/styles/tokens.css), and motion lives in
[src/lib/motion.ts](src/lib/motion.ts).

## The idea

A ruled exercise book crossed with a printed handbook: the two objects an ISC
student actually studies from. Formulas are the content, so type and rules do the
work. There are no cards, shadows, gradients, glass or glow.

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

A generated question reads as a note of caution, using nothing new. These are the rules, and they're in `src/components/bank/GeneratedMark.tsx`:

- A small **Generated** label with the `Dices` icon, beside the question number, in `--ink-2`. No colour of its own, so it survives black-and-white printing.
- The margin beside the question becomes a **dotted** rule in `--ink-2`. That's what tells it apart from your own formulas, whose margin is **dashed** and marked with a pen. Bank questions have no mark beside the number. They carry the small note "Original practice question, not an official ISC question." in `--ink-3`, under the question; a paper says it once at the top.
- Under the label, the notice "Generated practice question. This is not an official ISC question and may contain mistakes." sits in an expandable note, so it's one tap away and doesn't crowd the question.
- A mock paper shows a small **legend** once, at the top of the first page, with the label and what it means, and the notice beside it.
- In print, the label and the dotted margin remain. A printed paper has a small footer saying it contains generated questions.

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

| What | Duration | Easing | How |
|---|---|---|---|
| Press feedback | 120 ms | `--ease-out` | CSS, `scale(0.97)` |
| Hover, colour | 160 ms | `ease` | CSS |
| View change | 200 ms | `expo.out` | GSAP, `viewEnter` |
| List reveal | 180 ms, 12 ms stagger, first 10 rows only | `expo.out` | GSAP, `listReveal` |
| Solver steps | 200 ms, 40 ms stagger | `expo.out` | GSAP, `stepsReveal` |
| Sheet | 240 ms | `expo.out` | GSAP, `sheetEnter` |
| Today page entrance | 220 ms, 30 ms stagger | `expo.out` | GSAP, `AnimatedContent` (once) |

Rules:

- Motion answers an action or shows what changed. Nothing animates to look lively.
- Nothing animates after a keyboard action. The find palette opens instantly, always.
- Never use ease-in on interface motion, or start from `scale(0)`.
- Animate only `transform` and `opacity`.
- With `prefers-reduced-motion`, colour and opacity still change gently, so a state
  change is easy to notice, but nothing moves. GSAP isn't even fetched.
- GSAP loads after first paint. Motion is decoration, so nothing may wait for it, and
  until it arrives things just appear.

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
