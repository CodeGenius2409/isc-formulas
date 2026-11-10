// Written by hand: quantum numbers and electronic configuration, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, tell, match, reason, short, ar, derive } = kit('chemistry', 'XI');
const Q = at(2, 'b');

/** An orbital lobe from (cx, cy), of length l and width w, pointing at angle a degrees. */
const lobe = (cx: number, cy: number, a: number, l = 32, w = 20): SketchMark => {
  const t = (a * Math.PI) / 180;
  const ex = Math.round((cx + l * Math.cos(t)) * 10) / 10;
  const ey = Math.round((cy + l * Math.sin(t)) * 10) / 10;
  return { t: 'path', d: `M${cx} ${cy} A ${l / 2} ${w / 2} ${a} 1 0 ${ex} ${ey} A ${l / 2} ${w / 2} ${a} 1 0 ${cx} ${cy}` };
};
const axes = (cx: number, cy: number): SketchMark[] => [line([[cx - 40, cy], [cx + 40, cy]], { dash: 1 }), line([[cx, cy - 40], [cx, cy + 40]], { dash: 1 })];

/** Electron spins drawn as arrows centred at (cx, cy): ↑ for one electron, ↑↓ for a pair. Drawn as lines, as arrow characters can show as coloured symbols. */
const spins = (cx: number, cy: number, s: string): SketchMark[] =>
  s === '↑↓' ? [line([[cx - 5, cy + 8], [cx - 5, cy - 8]], { arrow: 1 }), line([[cx + 5, cy - 8], [cx + 5, cy + 8]], { arrow: 1 })]
    : s === '↑' ? [line([[cx, cy + 8], [cx, cy - 8]], { arrow: 1 })] : [];

/** Orbital boxes for 1s, 2s and 2p, holding the spins given. */
const boxes = (y: number, fill: string[]): SketchMark[] => [70, 110, 160, 190, 220].flatMap((x, i) => [{ t: 'box' as const, x, y, w: 30, h: 26 }, ...spins(x + 15, y + 13, fill[i])]);

const questions: BankDef[] = [
  figure(Q(3, 1), 'Draw the shapes of an s orbital, the px and py orbitals, and a d orbital such as dxy.', ['An s orbital is a sphere round the nucleus.', 'A p orbital is a dumbbell of two lobes on opposite sides of the nucleus: px along the x-axis and py along the y-axis.', 'The dxy orbital has four lobes, lying between the x- and y-axes.'], {
    answer: sketch(370, 140, 'Four drawings side by side, each with dashed x and y axes. The first is a circle, the s orbital. The second has two lobes along the x-axis, px. The third has two lobes along the y-axis, py. The fourth has four lobes between the axes, dxy.', [
      ...axes(45, 60), { t: 'circle', x: 45, y: 60, r: 24 }, label(45, 128, 's'),
      ...axes(135, 60), lobe(135, 60, 0), lobe(135, 60, 180), label(135, 128, 'px'),
      ...axes(225, 60), lobe(225, 60, 90), lobe(225, 60, 270), label(225, 128, 'py'),
      ...axes(315, 60), lobe(315, 60, 45), lobe(315, 60, 135), lobe(315, 60, 225), lobe(315, 60, 315), label(315, 128, 'dxy'),
    ]),
  }),
  figure(Q(2, 2), 'Draw orbital box diagrams for nitrogen (Z = 7) and oxygen (Z = 8), and give the number of unpaired electrons in each.', ['Nitrogen, 1s² 2s² 2p³: the three 2p electrons sit one in each 2p orbital, with parallel spins, by Hund’s rule, so it has 3 unpaired electrons.', 'Oxygen, 1s² 2s² 2p⁴: the fourth 2p electron pairs up in one orbital, so it has 2 unpaired electrons.'], {
    answer: sketch(280, 150, 'Two rows of boxes for 1s, 2s and the three 2p orbitals. Nitrogen: 1s and 2s each hold a pair of arrows, and each 2p box holds one up arrow. Oxygen: 1s and 2s each hold a pair, the first 2p box holds a pair, and the other two each hold one up arrow.', [
      label(50, 46, 'N', 'end'), ...boxes(28, ['↑↓', '↑↓', '↑', '↑', '↑']),
      label(50, 106, 'O', 'end'), ...boxes(88, ['↑↓', '↑↓', '↑↓', '↑', '↑']),
      label(85, 136, '1s'), label(125, 136, '2s'), label(205, 136, '2p'),
    ]),
  }),
  figure(Q(3, 2), 'The table gives n, l and n + l for four subshells. Put them in the order in which they are filled, and state the rule used.', ['A subshell with a lower n + l is filled first.', 'When n + l is the same, the one with the lower n is filled first.', 'So the order is 4s, 3d, 4p, 5s.'], {
    shown: table(['Subshell', 'n', 'l', 'n + l'], [['3d', '3', '2', '5'], ['4s', '4', '0', '4'], ['5s', '5', '0', '5'], ['4p', '4', '1', '5']]),
  }),

  predict(Q(2, 2), 'Predict the number of unpaired electrons in an iron atom (Z = 26).', 'Iron is [Ar] 3d⁶ 4s², with six electrons in the five 3d orbitals.', 'By Hund’s rule five go in singly and the sixth pairs up, leaving 4 unpaired electrons.'),
  predict(Q(2, 1), 'An electron has n = 3 and l = 2. Predict its subshell, and how many orbitals that subshell has.', 'l = 2 is a d subshell, so it is 3d.', 'm can be −2, −1, 0, +1 or +2, so the subshell has 5 orbitals.'),
  predict(Q(2, 2), 'Predict which is filled first, 2p or 3s, and explain.', '2p has n + l = 2 + 1 = 3, and 3s has 3 + 0 = 3.', 'With n + l equal, the lower n fills first, so 2p fills before 3s.'),

  odd(Q(2, 1), ['(2, 1, 0)', '(3, 2, −2)', '(1, 0, 0)', '(2, 2, 1)'], '(2, 2, 1)', 'As a set (n, l, m) it isn’t allowed, as l must be less than n; the others are allowed.'),
  odd(Q(2, 1), ['1s', '2p', '3d', '2d'], '2d', 'It doesn’t exist, as the shell n = 2 has only l = 0 and 1; the others exist.'),
  odd(Q(2, 2), ['Cr', 'Cu', 'Fe', 'Ag'], 'Fe', 'Its configuration follows the filling order; the others have one electron moved from the outer s subshell to make a half-filled or filled d subshell.'),

  tell(Q(2, 1), 'Distinguish between a shell and a subshell.', 'A shell is the set of orbitals with the same principal quantum number n, such as n = 2.', 'A subshell is the set of orbitals in a shell with the same l, such as 2s or 2p.'),
  tell(Q(2, 1), 'Distinguish between the azimuthal and the magnetic quantum numbers.', 'The azimuthal quantum number l gives the subshell and the shape of the orbital, and runs from 0 to n − 1.', 'The magnetic quantum number m gives the orientation of the orbital in space, and runs from −l to +l.'),
  tell(Q(2, 2), 'Distinguish between Hund’s rule and Pauli’s exclusion principle.', 'Hund’s rule: electrons enter the orbitals of a subshell singly, with parallel spins, before any pair up.', 'Pauli’s principle: no two electrons in an atom have the same four quantum numbers, so an orbital holds at most two, with opposite spins.'),

  match(Q(4, 1), [['n', 'the shell, and the main energy level'], ['l', 'the subshell, and the shape of the orbital'], ['m', 'the orientation of the orbital'], ['s', 'the spin of the electron']]),
  match(Q(4, 1), [['l = 0', 'an s subshell, 1 orbital'], ['l = 1', 'a p subshell, 3 orbitals'], ['l = 2', 'a d subshell, 5 orbitals'], ['l = 3', 'an f subshell, 7 orbitals']]),
  match(Q(4, 2), [['N (Z = 7)', '1s² 2s² 2p³'], ['Na (Z = 11)', '[Ne] 3s¹'], ['Cr (Z = 24)', '[Ar] 3d⁵ 4s¹'], ['Zn (Z = 30)', '[Ar] 3d¹⁰ 4s²']]),

  reason(Q(2, 1), 'Why has the third shell no f subshell?', 'l can take only the values 0 to n − 1.', 'For n = 3, l is 0, 1 or 2, giving s, p and d; f needs l = 3.'),
  reason(Q(2, 2), 'Why are half-filled and completely filled subshells especially stable?', 'Their electrons are spread evenly and symmetrically over the orbitals.', 'And they have the largest number of pairs of parallel-spin electrons that can exchange places, which lowers the energy.'),
  reason(Q(2, 1), 'Why is a fourth quantum number, s, needed besides n, l and m?', 'An orbital, fixed by n, l and m, can hold two electrons.', 'They differ only in spin, so s, +½ or −½, is needed to tell them apart.'),

  short(Q(2, 1), 'Write the four quantum numbers of the outermost electron of sodium (Z = 11).', 'Sodium is [Ne] 3s¹, so the electron is in 3s.', 'n = 3, l = 0, m = 0 and s = +½ (or −½).'),
  short(Q(2, 1), 'How many electrons in an atom can have n = 3 and l = 1?', 'n = 3 and l = 1 is the 3p subshell, with 3 orbitals.', 'Each holds 2 electrons, so 6 in all.'),

  ar(Q(1, 2), 'The 4s subshell is filled before the 3d.', '4s has a lower value of n + l than 3d.', 1, '4s has n + l = 4 and 3d has 5, so 4s is lower in energy and fills first.'),
  ar(Q(1, 1), 'A p orbital is spherical.', 'The magnetic quantum number gives an orbital’s orientation in space.', 4, 'A p orbital is dumbbell-shaped; it is the s orbital that is spherical.'),

  derive(Q(3, 2), 'Show that the shell with principal quantum number n has n² orbitals.', ['The shell has subshells with l = 0, 1, …, n − 1.', 1], ['A subshell with a given l has 2l + 1 orbitals, one for each value of m from −l to +l.', 1], ['So the shell has 1 + 3 + 5 + … + (2n − 1) orbitals, the sum of the first n odd numbers, which is n².', 1]),
  derive(Q(3, 1), 'Show that a subshell with azimuthal quantum number l can hold at most 2(2l + 1) electrons, and find it for s, p and d.', ['m runs from −l to +l, so the subshell has 2l + 1 orbitals.', 1], ['By Pauli’s principle each orbital holds at most 2 electrons, so the subshell holds 2(2l + 1).', 1], ['For s, p and d, with l = 0, 1 and 2, that is 2, 6 and 10 electrons.', 1]),
  derive(Q(3, 1), 'Show that a shell can hold at most 2n² electrons, and find it for n = 1 to 4.', ['The shell has n² orbitals.', 1], ['Each orbital holds at most two electrons, by Pauli’s principle, so the shell holds 2n².', 1], ['For n = 1, 2, 3 and 4, that is 2, 8, 18 and 32 electrons.', 1]),
];

export default questions;
