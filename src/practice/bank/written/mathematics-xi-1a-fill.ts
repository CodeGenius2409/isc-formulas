// Written by hand: sets, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const S = at(1, 'a');

/** Points round a circle from angle a0 to a1, in degrees, measured the way the screen's y axis points. */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 24): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [Math.round((cx + r * Math.cos(t)) * 10) / 10, Math.round((cy + r * Math.sin(t)) * 10) / 10] as [number, number];
  });

// Two circles of radius 55, centres (120, 95) and (190, 95), meet where x = 155, at angles ±50.5° from A's centre and 180° ∓ 50.5° from B's.
const venn = (inside: SketchMark[]): SketchMark[] => [
  ...inside,
  { t: 'box', x: 20, y: 20, w: 270, h: 150 }, label(32, 38, 'U', 'start'),
  { t: 'circle', x: 120, y: 95, r: 55 }, { t: 'circle', x: 190, y: 95, r: 55 },
  label(78, 42, 'A'), label(232, 42, 'B'),
];

/** A number line from −3 to 5, 30 px to a unit, with 0 at x = 110. */
const numberLine = (y: number): SketchMark[] => [
  arrow([10, y], [320, y]),
  ...[-3, -2, -1, 0, 1, 2, 3, 4, 5].flatMap((k) => [line([[110 + 30 * k, y - 4], [110 + 30 * k, y + 4]]), label(110 + 30 * k, y + 18, k < 0 ? `−${-k}` : `${k}`)]),
];

const questions: BankDef[] = [
  figure(S(2, 1), 'Draw a Venn diagram of two overlapping sets $A$ and $B$ in a universal set $U$, shade $A - B$, and write $A - B$ in set-builder form.', ['The shaded part is the part of $A$ outside $B$.', '$A - B = \\{x : x \\in A, x \\notin B\\}$.'], {
    answer: sketch(310, 190, 'A rectangle U holds two overlapping circles, A on the left and B on the right. The part of circle A that lies outside circle B is shaded.', venn([{ t: 'shade', p: [...arc(120, 95, 55, 50.5, 309.5), ...arc(190, 95, 55, 230.5, 129.5)] }])),
  }),
  figure(S(3, 1), 'The Venn diagram shows the number of elements in each region. Find $n(A)$, $n(B)$, $n(A \\cup B)$, $n(U)$ and $n(A - B)$.', ['$n(A) = 12 + 5 = 17$ and $n(B) = 5 + 8 = 13$.', '$n(A \\cup B) = 12 + 5 + 8 = 25$, and $n(U) = 25 + 10 = 35$.', '$n(A - B) = 12$.'], {
    shown: sketch(310, 190, 'A rectangle U holds two overlapping circles, A and B. The part of A outside B holds 12 elements, the overlap holds 5, the part of B outside A holds 8, and 10 lie outside both circles.', venn([label(95, 100, '12'), label(155, 100, '5'), label(215, 100, '8'), label(270, 160, '10', 'end')])),
  }),
  figure(S(3, 2), 'Show the intervals $[-2, 3)$ and $(1, \\infty)$ on number lines, and write their intersection and union.', ['$[-2, 3)$: a filled dot at $-2$ and an open dot at 3, joined by a thick line.', '$(1, \\infty)$: an open dot at 1, with the line running on to the right without end.', 'Intersection $(1, 3)$; union $[-2, \\infty)$.'], {
    answer: sketch(330, 150, 'Two number lines from −3 to 5. On the upper one, a thick segment runs from a filled dot at −2 to an open dot at 3. On the lower one, a thick line runs from an open dot at 1 to the right-hand end, with an arrow.', [
      ...numberLine(40), line([[50, 34], [197, 34]]), { t: 'dot', x: 50, y: 34 }, { t: 'circle', x: 200, y: 34, r: 3 }, label(320, 20, '[−2, 3)', 'end'),
      ...numberLine(110), arrow([143, 104], [318, 104]), { t: 'circle', x: 140, y: 104, r: 3 }, label(320, 90, '(1, ∞)', 'end'),
    ]),
  }),

  predict(S(2, 1), 'If $A \\subset B$, predict $A \\cup B$ and $A \\cap B$ without drawing a diagram.', 'Every element of $A$ is already in $B$, so $A \\cup B = B$.', 'The elements in both are just those of $A$, so $A \\cap B = A$.'),
  predict(S(2, 2), 'If $A = \\{1, 2\\}$, predict how many elements $P(P(A))$, the power set of the power set of $A$, has.', '$P(A)$ has $2^2 = 4$ elements.', 'So $P(P(A))$ has $2^4 = 16$ elements.'),
  predict(S(2, 2), 'For two sets $A$ and $B$, $A \\cap B = A \\cup B$. Predict how $A$ and $B$ are related, and explain.', 'Any $x \\in A$ is in $A \\cup B = A \\cap B$, so it is in $B$; in the same way every element of $B$ is in $A$.', 'So $A = B$.'),

  odd(S(2, 1), ['$\\{x : x^2 = 4\\}$', '$\\{2, -2\\}$', '$\\{x : x^2 - 4 = 0\\}$', '$\\{x \\in \\mathbb{R} : x^2 = -4\\}$'], '$\\{x \\in \\mathbb{R} : x^2 = -4\\}$', 'It is the empty set; the other three are all $\\{-2, 2\\}$.'),
  odd(S(2, 1), ['$\\phi$', '$\\{0\\}$', '$\\{x : x \\neq x\\}$', '$\\{x \\in \\mathbb{N} : x < 1\\}$'], '$\\{0\\}$', 'It has one element, 0; the other three are the empty set.'),
  odd(S(2, 1), ['$(2, 5)$', '$[2, 5]$', '$(2, 5]$', '$\\{2, 3, 4, 5\\}$'], '$\\{2, 3, 4, 5\\}$', 'It is a finite set of four integers; the others are intervals, with infinitely many elements.'),

  long(S(6, 1), 'Let $U = \\{1, 2, 3, \\ldots, 10\\}$, $A = \\{1, 2, 3, 4, 5\\}$ and $B = \\{4, 5, 6, 7\\}$.\n(a) Find $A \\cup B$ and $A \\cap B$. [2]\n(b) Find $A\'$, $B\'$, $(A \\cup B)\'$ and $A\' \\cap B\'$, and say what they show. [3]\n(c) Find $A - B$. [1]', '(a) $A \\cup B = \\{1, 2, 3, 4, 5, 6, 7\\}$.', '(a) $A \\cap B = \\{4, 5\\}$.', '(b) $A\' = \\{6, 7, 8, 9, 10\\}$ and $B\' = \\{1, 2, 3, 8, 9, 10\\}$.', '(b) $(A \\cup B)\' = \\{8, 9, 10\\}$ and $A\' \\cap B\' = \\{8, 9, 10\\}$.', '(b) They are equal, as De Morgan’s law says.', '(c) $A - B = \\{1, 2, 3\\}$.'),
  long(S(6, 2), 'Let $A = \\{a, b, c\\}$.\n(a) Write the power set $P(A)$. [2]\n(b) How many of these subsets contain $a$? [1]\n(c) Is $\\{a\\} \\in P(A)$? Is $\\{a\\} \\subset P(A)$? Give reasons. [2]\n(d) If $n(P(B)) = 64$, find $n(B)$. [1]', '(a) $P(A) = \\{\\phi, \\{a\\}, \\{b\\}, \\{c\\}, \\{a, b\\}, \\{a, c\\}, \\{b, c\\}, \\{a, b, c\\}\\}$.', '(a) It has $2^3 = 8$ elements.', '(b) 4: each is $a$ together with one of the 4 subsets of $\\{b, c\\}$.', '(c) $\\{a\\} \\in P(A)$, as $\\{a\\}$ is a subset of $A$.', '(c) $\\{a\\} \\not\\subset P(A)$, as its element $a$ is not itself an element of $P(A)$.', '(d) $2^{n(B)} = 64 = 2^6$, so $n(B) = 6$.'),
  long(S(6, 2), 'In a group of 70 people, 37 like coffee and 52 like tea, and each likes at least one of the two.\n(a) How many like both? [2]\n(b) How many like coffee but not tea? [1]\n(c) How many like tea but not coffee? [1]\n(d) Show these numbers on a Venn diagram, and check that they add up to 70. [2]', '(a) $n(C \\cup T) = n(C) + n(T) - n(C \\cap T)$, with $n(C \\cup T) = 70$.', '(a) $70 = 37 + 52 - n(C \\cap T)$, so $n(C \\cap T) = 19$.', '(b) $37 - 19 = 18$.', '(c) $52 - 19 = 33$.', '(d) Two overlapping circles, $C$ and $T$, with 18 in $C$ only, 19 in the overlap and 33 in $T$ only, and none outside.', '(d) $18 + 19 + 33 = 70$.'),

  tell(S(2, 1), 'Distinguish between a finite set and an infinite set, with an example of each.', 'A finite set has a definite number of elements that counting can finish, such as the vowels of English.', 'An infinite set has no end to its elements, such as $\\mathbb{N}$ or the interval $(0, 1)$.'),
  tell(S(2, 1), 'Distinguish between the symbols $\\in$ and $\\subset$, with an example of each.', '$\\in$ joins an element to a set: $2 \\in \\{1, 2, 3\\}$.', '$\\subset$ joins a set to a set: $\\{2\\} \\subset \\{1, 2, 3\\}$.'),
  tell(S(2, 2), 'Distinguish between a subset and a proper subset.', '$A \\subseteq B$ if every element of $A$ is in $B$, which allows $A = B$.', '$A$ is a proper subset of $B$ if, in addition, $A \\neq B$, so $B$ has at least one element not in $A$.'),

  match(S(4, 1), [['$\\{x : 2 < x < 5\\}$', '$(2, 5)$'], ['$\\{x : 2 \\le x \\le 5\\}$', '$[2, 5]$'], ['$\\{x : 2 \\le x < 5\\}$', '$[2, 5)$'], ['$\\{x : x > 2\\}$', '$(2, \\infty)$']]),
  match(S(4, 1), [['$\\{1, 2, 3\\} \\cup \\{2, 3, 4\\}$', '$\\{1, 2, 3, 4\\}$'], ['$\\{1, 2, 3\\} \\cap \\{2, 3, 4\\}$', '$\\{2, 3\\}$'], ['$\\{1, 2, 3\\} - \\{2, 3, 4\\}$', '$\\{1\\}$'], ['$\\{2, 3, 4\\} - \\{1, 2, 3\\}$', '$\\{4\\}$']]),
  match(S(4, 2), [["$A \\cup A'$", '$U$'], ["$A \\cap A'$", '$\\phi$'], ["$(A')'$", '$A$'], ["$(A \\cup B)'$", "$A' \\cap B'$"]]),

  reason(S(2, 1), 'Why is the empty set a subset of every set $A$?', '$\\phi \\subseteq A$ would fail only if $\\phi$ had an element not in $A$.', '$\\phi$ has no elements at all, so this can’t happen.'),
  reason(S(2, 1), 'Why are $\\{1, 2, 3\\}$ and $\\{3, 1, 2, 2\\}$ equal sets?', 'Two sets are equal when they have exactly the same elements.', 'Order and repetition don’t matter, and both have just the elements 1, 2 and 3.'),
  reason(S(2, 2), 'Why are $A - B$, $A \\cap B$ and $B - A$ disjoint, and what is their union?', 'An element of $A \\cup B$ is in $A$ only, in both, or in $B$ only, and in exactly one of these.', 'So no two of the sets share an element, and together they make $A \\cup B$.'),

  short(S(2, 1), 'Write $A = \\{1, 4, 9, 16, 25\\}$ in set-builder form, and $B = \\{x : x \\in \\mathbb{Z}, x^2 < 5\\}$ in roster form.', '$A = \\{x : x = n^2, n \\in \\mathbb{N}, n \\le 5\\}$.', '$B = \\{-2, -1, 0, 1, 2\\}$.'),
  short(S(2, 1), 'Find $[-3, 2) \\cap (0, 5]$ and $[-3, 2) \\cup (0, 5]$.', 'The intersection is $(0, 2)$.', 'The union is $[-3, 5]$.'),

  ar(S(1, 1), '$[2, 5] \\cap (5, 8) = \\phi$.', '5 belongs to $[2, 5]$ but not to $(5, 8)$.', 1, 'The only point the two could share is 5, and $(5, 8)$ leaves it out.'),
  ar(S(1, 2), '$\\{a\\} \\in P(\\{a, b\\})$.', 'The empty set is a subset of every set.', 2, 'Both are true, but $\\{a\\} \\in P(\\{a, b\\})$ because $\\{a\\}$ is a subset of $\\{a, b\\}$.'),
  ar(S(1, 1), '$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$.', 'Every real number is rational.', 3, 'Irrational numbers such as $\\sqrt{2}$ are real but not rational.'),

  derive(S(3, 2), 'Prove that $A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$.', ['$x \\in A \\cup (B \\cap C) \\iff x \\in A$ or ($x \\in B$ and $x \\in C$).', 1], ['$\\iff (x \\in A$ or $x \\in B)$ and $(x \\in A$ or $x \\in C)$.', 1], ['$\\iff x \\in (A \\cup B) \\cap (A \\cup C)$, so the sets are equal.', 1]),
  derive(S(3, 2), "Prove De Morgan's law $(A \\cap B)' = A' \\cup B'$.", ["$x \\in (A \\cap B)' \\iff x \\notin A \\cap B$.", 1], ['$\\iff x \\notin A$ or $x \\notin B$.', 1], ["$\\iff x \\in A'$ or $x \\in B'$, that is $x \\in A' \\cup B'$, so the sets are equal.", 1]),
];

export default questions;
