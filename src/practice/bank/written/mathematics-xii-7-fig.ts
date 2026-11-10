// Written by hand: probability, figures to draw and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure } = kit('mathematics', 'XII');
const P = at(7, 'a');

const questions: BankDef[] = [
  figure(P(3, 2), 'The tree diagram shows a bag being chosen at random, then a ball drawn from it. Find the probability that the ball is red, and the probability that it came from bag I given that it is red.', ['$P(R) = \\frac{1}{2} \\times \\frac{3}{5} + \\frac{1}{2} \\times \\frac{1}{4} = \\frac{3}{10} + \\frac{1}{8} = \\frac{17}{40}$.', 'By Bayes’ theorem, $P(\\text{I} | R) = \\frac{3/10}{17/40}$.', '$= \\frac{12}{17}$.'], {
    shown: sketch(320, 170, 'A tree. From the start, two branches of probability one half go to Bag I and Bag II. From Bag I, red has probability three fifths and black two fifths. From Bag II, red has probability one quarter and black three quarters.', [
      line([[20, 85], [120, 40]]), line([[20, 85], [120, 130]]), label(66, 52, '1/2'), label(66, 128, '1/2'), label(130, 44, 'Bag I', 'start'), label(130, 134, 'Bag II', 'start'),
      line([[180, 40], [270, 15]]), line([[180, 40], [270, 65]]), label(222, 18, '3/5'), label(222, 66, '2/5'), label(276, 19, 'red', 'start'), label(276, 69, 'black', 'start'),
      line([[180, 130], [270, 105]]), line([[180, 130], [270, 155]]), label(222, 108, '1/4'), label(222, 156, '3/4'), label(276, 109, 'red', 'start'), label(276, 159, 'black', 'start'),
    ]),
  }),
  figure(P(2, 1), 'Draw a tree diagram for tossing a fair coin twice, and use it to find the probability of exactly one head.', ['Each toss branches into H and T, with probability $\\frac{1}{2}$ each, giving HH, HT, TH and TT.', 'HT and TH give exactly one head: $\\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}$.'], {
    answer: sketch(300, 170, 'A tree. The first toss branches into H and T, each one half. Each of those branches again into H and T, each one half, giving the outcomes HH, HT, TH and TT.', [
      line([[20, 85], [110, 40]]), line([[20, 85], [110, 130]]), label(120, 44, 'H', 'start'), label(120, 134, 'T', 'start'), label(60, 54, '½'), label(60, 124, '½'),
      line([[140, 40], [220, 18]]), line([[140, 40], [220, 62]]), label(228, 22, 'H: HH', 'start'), label(228, 66, 'T: HT', 'start'),
      line([[140, 130], [220, 108]]), line([[140, 130], [220, 152]]), label(228, 112, 'H: TH', 'start'), label(228, 156, 'T: TT', 'start'),
    ]),
  }),
  figure(P(3, 2), 'The table gives the probability distribution of $X$. Find $k$, $P(X \\ge 2)$ and the mean of $X$.', ['The probabilities add up to 1: $0.1 + k + 0.3 + 2k = 1$, so $k = 0.2$.', '$P(X \\ge 2) = 0.3 + 0.4 = 0.7$.', 'Mean $= 0 \\times 0.1 + 1 \\times 0.2 + 2 \\times 0.3 + 3 \\times 0.4 = 2.0$.'], {
    shown: table(['x', '0', '1', '2', '3'], [['P(X = x)', '0.1', 'k', '0.3', '2k']]),
  }),
  figure(P(2, 2), 'The Venn diagram shows the probabilities of events $A$ and $B$. Find $P(A | B)$, and say whether $A$ and $B$ are independent.', ['$P(A \\cap B) = 0.2$ and $P(B) = 0.2 + 0.3 = 0.5$, so $P(A | B) = 0.4$.', '$P(A) = 0.4$ too, so $P(A | B) = P(A)$: they are independent.'], {
    shown: sketch(300, 160, 'Two overlapping circles A and B in a rectangle. A alone holds 0.2, the overlap holds 0.2, B alone holds 0.3, and the region outside both holds 0.3.', [
      { t: 'box', x: 10, y: 10, w: 280, h: 140 }, { t: 'circle', x: 115, y: 80, r: 55 }, { t: 'circle', x: 185, y: 80, r: 55 },
      label(85, 84, '0.2'), label(150, 84, '0.2'), label(215, 84, '0.3'), label(260, 140, '0.3'), label(80, 32, 'A'), label(220, 32, 'B'),
    ]),
  }),
  figure(P(2, 3), 'Draw a bar diagram of the probability distribution of the number of heads in two tosses of a fair coin, and find its mean.', ['Bars at 0, 1 and 2 heads, of heights $\\frac{1}{4}$, $\\frac{1}{2}$ and $\\frac{1}{4}$.', 'Mean $= 0 \\times \\frac{1}{4} + 1 \\times \\frac{1}{2} + 2 \\times \\frac{1}{4} = 1$.'], {
    answer: sketch(300, 170, 'A bar diagram with three bars: at 0 heads, height one quarter; at 1 head, height one half; at 2 heads, height one quarter.', [
      line([[40, 140], [270, 140]]), line([[40, 140], [40, 20]]),
      { t: 'box', x: 70, y: 90, w: 30, h: 50 }, { t: 'box', x: 140, y: 40, w: 30, h: 100 }, { t: 'box', x: 210, y: 90, w: 30, h: 50 },
      label(85, 158, '0'), label(155, 158, '1'), label(225, 158, '2'), label(34, 94, '¼', 'end'), label(34, 44, '½', 'end'), label(155, 30, 'P(X = x)'),
    ]),
  }),
];

export default questions;
