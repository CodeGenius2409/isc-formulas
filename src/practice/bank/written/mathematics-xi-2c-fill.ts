// Written by hand: permutations and combinations, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('mathematics', 'XI');
const P = at(2, 'c');

/** Three shirts, each branching into two pairs of trousers. */
const outfits = (): SketchMark[] => {
  const out: SketchMark[] = [{ t: 'dot', x: 20, y: 95 }];
  [0, 1, 2].forEach((s) => {
    const sy = 35 + 60 * s;
    out.push(line([[20, 95], [92, sy]]), label(104, sy + 5, `S${'₁₂₃'[s]}`));
    [0, 1].forEach((t) => {
      const ty = sy - 15 + 30 * t;
      out.push(line([[118, sy], [182, ty]]), label(194, ty + 5, `T${'₁₂'[t]}`), label(226, ty + 5, `S${'₁₂₃'[s]}T${'₁₂'[t]}`, 'start'));
    });
  });
  return out;
};

/** Pascal’s triangle to row 5, with three entries replaced as given. */
const pascal = (blanks: Record<string, string>): SketchMark[] => {
  const out: SketchMark[] = [];
  for (let n = 0; n <= 5; n++) {
    let c = 1;
    for (let k = 0; k <= n; k++) {
      out.push(label(160 + (k - n / 2) * 40, 24 + 28 * n, blanks[`${n},${k}`] ?? `${c}`));
      c = (c * (n - k)) / (k + 1);
    }
  }
  return out;
};

const questions: BankDef[] = [
  figure(P(2, 1), 'A boy has 3 shirts and 2 pairs of trousers. Draw a tree diagram of the outfits he can wear, and state the principle it shows.', ['Each of the 3 shirts branches into 2 pairs of trousers, giving $3 \\times 2 = 6$ outfits.', 'This is the fundamental principle of counting: if one thing can be done in $m$ ways and then another in $n$ ways, both can be done in $mn$ ways.'], {
    answer: sketch(300, 190, 'A tree from a single point. It branches into three shirts, S1, S2 and S3. Each shirt branches into two pairs of trousers, T1 and T2. The six outfits S1T1, S1T2, S2T1, S2T2, S3T1 and S3T2 are listed at the ends.', outfits()),
  }),
  figure(P(2, 2), 'Draw four boxes for the places of a four-digit number with no digit repeated, write in each how many digits can go there, and find how many such numbers there are.', ['The first place can’t be 0, so it has 9 choices; then 9, 8 and 7 are left for the other places in turn.', '$9 \\times 9 \\times 8 \\times 7 = 4536$ numbers.'], {
    answer: sketch(300, 110, 'Four boxes in a row, for the thousands, hundreds, tens and units places, holding the numbers 9, 9, 8 and 7. Below them is written 9 × 9 × 8 × 7 = 4536.', [
      ...[9, 9, 8, 7].flatMap((n, i) => [{ t: 'box' as const, x: 40 + 60 * i, y: 20, w: 44, h: 40 }, label(62 + 60 * i, 46, `${n}`)]),
      label(150, 90, '9 × 9 × 8 × 7 = 4536'),
    ]),
  }),
  figure(P(3, 2), 'The figure shows Pascal’s triangle to the row for $n = 5$, with three numbers replaced by P, Q and R. Find them, and state the rule they follow in terms of $^nC_r$.', ['$P = 3 + 3 = 6$, which is $^4C_2$; $Q = 1 + 4 = 5$, which is $^5C_1$.', '$R = 4 + 6 = 10$, which is $^5C_2$.', 'Each number is the sum of the two above it: $^nC_r = {}^{n-1}C_{r-1} + {}^{n-1}C_r$.'], {
    shown: sketch(320, 180, 'Pascal’s triangle with six rows. Row 0 is 1; row 1 is 1, 1; row 2 is 1, 2, 1; row 3 is 1, 3, 3, 1; row 4 is 1, 4, P, 4, 1; row 5 is 1, Q, R, 10, 5, 1.', pascal({ '4,2': 'P', '5,1': 'Q', '5,2': 'R' })),
  }),

  predict(P(2, 1), 'Without working out either, predict which is larger, $^{10}C_3$ or $^{10}C_7$, and explain.', 'They are equal.', 'Choosing 3 of the 10 to take is the same as choosing 7 to leave, so $^{10}C_3 = {}^{10}C_7 = 120$.'),
  predict(P(2, 2), 'In a room of $n$ people, each pair shakes hands once. Predict how many more handshakes there are when one more person comes in.', 'The newcomer shakes hands once with each of the $n$ people already there.', 'So there are $n$ more: $^{n+1}C_2 - {}^nC_2 = n$.'),
  predict(P(2, 2), 'If $^nP_r = 6 \\times {}^nC_r$, predict $r$.', '$^nP_r = r! \\times {}^nC_r$, so $r! = 6$.', 'So $r = 3$.'),

  odd(P(2, 1), ['$^5P_2$', '$^5C_2 \\times 2!$', '$5 \\times 4$', '$^5C_3$'], '$^5C_3$', 'It is 10; the other three are all 20.'),
  odd(P(2, 1), ['arranging books on a shelf', 'forming numbers from given digits', 'choosing a team of 5 from 11 players', 'seating people in a row'], 'choosing a team of 5 from 11 players', 'Order doesn’t matter, so it is a combination; the others are permutations.'),
  odd(P(2, 1), ['$^7C_2$', '$^7C_5$', '21', '$^7P_2$'], '$^7P_2$', 'It is 42; the other three are all 21.'),

  long(P(6, 2), 'Consider the letters of the word ARRANGE.\n(a) How many arrangements of all its letters are there? [2]\n(b) In how many are the two Rs together? [2]\n(c) How many begin with N? [2]', '(a) There are 7 letters, with A twice and R twice.', '(a) $\\dfrac{7!}{2!\\,2!} = \\dfrac{5040}{4} = 1260$.', '(b) Treating RR as one letter leaves 6 letters, with A twice.', '(b) $\\dfrac{6!}{2!} = 360$.', '(c) With N fixed first, the other 6 letters have A twice and R twice.', '(c) $\\dfrac{6!}{2!\\,2!} = 180$.'),
  long(P(6, 2), 'A team of 6 is chosen from 7 boys and 5 girls. In how many ways can it be chosen if it has:\n(a) no restriction [1]\n(b) exactly 3 girls [2]\n(c) at least 4 girls? [3]', '(a) $^{12}C_6 = 924$.', '(b) $^5C_3 \\times {}^7C_3$.', '(b) $= 10 \\times 35 = 350$.', '(c) 4 girls and 2 boys: $^5C_4 \\times {}^7C_2 = 5 \\times 21 = 105$.', '(c) 5 girls and 1 boy: $^5C_5 \\times {}^7C_1 = 7$.', '(c) In all, $105 + 7 = 112$.'),
  long(P(6, 3), 'Four-digit numbers are formed from the digits 0, 1, 2, 3, 4 and 5, with no digit repeated.\n(a) How many such numbers are there? [2]\n(b) How many of them are even? [3]\n(c) How many are divisible by 5? [1]', '(a) The first digit can’t be 0, so it has 5 choices, and the rest $5 \\times 4 \\times 3$.', '(a) $5 \\times 5 \\times 4 \\times 3 = 300$.', '(b) Ending in 0: $5 \\times 4 \\times 3 = 60$.', '(b) Ending in 2 or in 4: the first digit has 4 choices, then $4 \\times 3$, so 48 each.', '(b) In all, $60 + 48 + 48 = 156$.', '(c) Ending in 0 gives 60 and ending in 5 gives 48, so 108.'),

  tell(P(2, 1), 'Distinguish between the multiplication and addition principles of counting.', 'Multiplication: if one job can be done in $m$ ways and then a second in $n$ ways, both together can be done in $mn$ ways.', 'Addition: if a job can be done in $m$ ways or in $n$ other ways, with no overlap, it can be done in $m + n$ ways.'),
  tell(P(2, 2), 'Distinguish between the arrangements of $n$ different objects and of $n$ objects of which $p$ are alike.', '$n$ different objects can be arranged in $n!$ ways.', 'If $p$ of them are alike, swapping those changes nothing, so there are only $\\dfrac{n!}{p!}$.'),
  tell(P(2, 2), 'Distinguish between choosing $r$ of $n$ things when one particular thing must be included and when it must be left out.', 'If it must be included, the other $r - 1$ are chosen from the remaining $n - 1$: $^{n-1}C_{r-1}$ ways.', 'If it must be left out, all $r$ are chosen from the other $n - 1$: $^{n-1}C_r$ ways.'),

  match(P(4, 1), [['$5!$', '120'], ['$^6P_2$', '30'], ['$^6C_2$', '15'], ['$0!$', '1']]),
  match(P(4, 2), [['Arrangements of the letters of LEVEL', '30'], ['Arrangements of the letters of BOOK', '12'], ['Arrangements of the letters of APPLE', '60'], ['Arrangements of the letters of NOON', '6']]),
  match(P(4, 2), [['Handshakes among 6 people', '15'], ['Diagonals of a hexagon', '9'], ['Triangles with vertices among 6 points, no three in a line', '20'], ['Ways to give 3 different prizes to 6 people, one each', '120']]),

  reason(P(2, 1), 'Why is $^nC_r = \\dfrac{^nP_r}{r!}$?', 'Each selection of $r$ things can be arranged in $r!$ orders.', 'So $^nP_r = r! \\times {}^nC_r$, and dividing by $r!$ gives the result.'),
  reason(P(2, 2), 'Why are there $2^n - 1$ ways of choosing at least one of $n$ different things?', 'Each thing can be taken or left: 2 ways each, so $2^n$ choices in all.', 'One of these takes nothing, which must be left out, leaving $2^n - 1$.'),
  reason(P(2, 1), 'Why is the first digit counted separately when forming numbers from digits that include 0?', 'A number can’t begin with 0, or it would have fewer digits.', 'So the first place has one choice fewer than the digits available.'),

  short(P(2, 1), 'Find $n$ if $^nC_2 = 28$.', '$\\dfrac{n(n - 1)}{2} = 28$, so $n(n - 1) = 56$.', '$n = 8$, as $8 \\times 7 = 56$.'),

  ar(P(1, 1), '$^nC_0 = 1$.', 'There is exactly one way to choose nothing.', 1, 'Choosing none of the things can be done only one way.'),
  ar(P(1, 2), 'A polygon with $n$ sides has $^nC_2$ diagonals.', 'Any two vertices of a polygon are joined by a line segment.', 4, '$^nC_2$ counts all the segments, including the $n$ sides, so there are $^nC_2 - n$ diagonals.'),
  ar(P(1, 1), '$^8C_3 = 56$.', '$^8C_3 = {}^8C_5$.', 2, 'Both are true, but the value comes from $\\dfrac{8 \\times 7 \\times 6}{3!} = 56$.'),
];

export default questions;
