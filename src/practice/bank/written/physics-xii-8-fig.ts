// Written by hand: atoms and nuclei, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, label, line, sketch, table } from '../figures';

const { figure } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  figure(A(2, 1), 'Draw the energy levels of hydrogen for n = 1 to 4, with their energies, and show the transition that gives the first Balmer line.', ['Levels at −13.6, −3.4, −1.51 and −0.85 eV, closer together as n rises.', 'The first Balmer line is the jump from n = 3 down to n = 2.'], {
    answer: { kind: 'levels', levels: [{ n: 'n = 1', E: '−13.6 eV', at: 0 }, { n: 'n = 2', E: '−3.4 eV', at: 0.6 }, { n: 'n = 3', E: '−1.51 eV', at: 0.8 }, { n: 'n = 4', E: '−0.85 eV', at: 0.95 }], from: 2, to: 1 },
  }),
  figure(A(2, 2), 'The figure shows energy levels of an atom. Which transition gives the photon of shortest wavelength, and which the longest?', ['The shortest wavelength comes from the largest energy gap: n = 3 to n = 1.', 'The longest comes from the smallest gap: n = 3 to n = 2.'], {
    shown: { kind: 'levels', levels: [{ n: 'n = 1', E: '−13.6 eV', at: 0 }, { n: 'n = 2', E: '−3.4 eV', at: 0.65 }, { n: 'n = 3', E: '−1.51 eV', at: 0.9 }] },
  }),
  figure(A(3, 2), 'Draw the paths of alpha particles past a gold nucleus in Rutherford’s experiment: one passing far away, one closer, and one heading straight at it. What did the result show?', ['The distant one goes almost straight, and the closer one turns through a larger angle.', 'The one heading straight at the nucleus stops and comes straight back.', 'Most of the atom is empty, with its positive charge and mass in a tiny nucleus.'], {
    answer: sketch(320, 170, 'A gold nucleus as a dot in the middle right. Three alpha paths come from the left: the top one, far from the nucleus, bends only slightly; the middle one bends sharply away; the bottom one heads straight at the nucleus and returns along its path.', [
      { t: 'dot', x: 200, y: 110 }, label(200, 130, 'nucleus'),
      { t: 'path', d: 'M10 30 L 180 30 C 220 30, 260 25, 310 15', arrow: 1 },
      { t: 'path', d: 'M10 80 L 170 80 C 210 80, 215 60, 230 20', arrow: 1 },
      line([[10, 110], [185, 110]], { arrow: 1 }), line([[185, 116], [40, 116]], { arrow: 1 }),
    ]),
  }),
  figure(A(2, 3), 'Draw the energy level diagram of hydrogen and mark the transitions that give the Lyman and the Balmer series. In which part of the spectrum does each lie?', ['Lyman: jumps from n = 2, 3, … down to n = 1, in the ultraviolet.', 'Balmer: jumps from n = 3, 4, … down to n = 2, in the visible.'], {
    answer: { kind: 'levels', levels: [{ n: 'n = 1', E: '−13.6 eV', at: 0 }, { n: 'n = 2', E: '−3.4 eV', at: 0.6 }, { n: 'n = 3', E: '−1.51 eV', at: 0.8 }, { n: 'n = 4', E: '−0.85 eV', at: 0.95 }], from: 1, to: 0 },
  }),
  figure(A(3, 1), 'The figure shows the apparatus of the alpha-particle scattering experiment. Name the parts P, Q and R.', ['P is a radioactive source of alpha particles in a lead block, which sends out a narrow beam.', 'Q is a very thin gold foil.', 'R is a zinc sulphide screen with a microscope, which can turn round the foil to count flashes at each angle.'], {
    shown: sketch(320, 160, 'A lead block P on the left sends a narrow beam to a thin foil Q in the middle. A screen R with a microscope sits on a circle around the foil, at an angle to the beam.', [
      { t: 'box', x: 20, y: 65, w: 40, h: 30 }, label(40, 112, 'P'), line([[60, 80], [150, 80]], { arrow: 1 }),
      line([[160, 40], [160, 120]]), label(160, 34, 'Q'),
      { t: 'circle', x: 160, y: 80, r: 70, dash: 1 }, { t: 'box', x: 205, y: 20, w: 30, h: 16 }, label(250, 24, 'R', 'start'), line([[160, 80], [220, 36]], { dash: 1 }),
    ]),
  }),
  figure(B(2, 1), 'Draw the curve of binding energy per nucleon against mass number. Mark where it is highest.', ['It rises steeply for light nuclei, peaks near A = 56, at about 8.8 MeV, then falls slowly.', 'The peak is marked near iron.'], {
    answer: graph('mass number A', 'binding energy per nucleon (MeV)', [{ points: [[2, 1.1], [4, 7.1], [12, 7.7], [20, 8.0], [40, 8.6], [56, 8.8], [100, 8.6], [150, 8.3], [200, 7.9], [238, 7.6]] }], { x: [[56, '56']], y: [[8.8, '8.8']] }),
  }),
  figure(B(2, 2), 'Use the masses in the table to find the energy released in the fusion ²H + ²H → ³He + n.', ['Mass lost = 2 × 2.014102 − (3.016029 + 1.008665) = 0.003510 u.', 'Energy = 0.003510 × 931.5 ≈ 3.27 MeV.'], {
    shown: table(['Particle', 'Mass (u)'], [['²H', '2.014102'], ['³He', '3.016029'], ['n', '1.008665']]),
  }),
  figure(B(2, 2), 'Draw a graph of the potential energy of a pair of nucleons against their separation. Mark where the force turns from attractive to repulsive.', ['The energy has a deep minimum near 0.8 fm, and rises steeply at smaller separations.', 'Beyond the minimum the force attracts, inside it the force repels; it dies away beyond a few fm.'], {
    answer: graph('separation r (fm)', 'potential energy', [{ points: [[0.4, 60], [0.6, 0], [0.8, -100], [1.2, -60], [2, -20], [3, -5], [4, 0]] }], { x: [[0.8, '0.8']] }),
  }),
  figure(B(3, 3), 'The graph shows the nuclear radius R against A^(1/3). Find R₀, and say what the straight line tells you about nuclear density.', ['R = R₀A^(1/3), so the slope is R₀ = 6.0/5 = 1.2 fm.', 'R³ is proportional to A, so the volume is proportional to the number of nucleons.', 'So every nucleus has about the same density.'], {
    shown: graph('A^(1/3)', 'radius R (fm)', [{ points: [[0, 0], [5, 6]] }], { x: [[5, '5']], y: [[6, '6.0']] }),
  }),
  figure(B(2, 3), 'Draw a graph of the mass defect against the mass number, roughly, and say why it isn’t the best guide to how stable a nucleus is.', ['The mass defect grows roughly in proportion to A.', 'Binding energy per nucleon is the better guide, as a large nucleus has a large defect simply by having more nucleons.'], {
    answer: graph('mass number A', 'mass defect', [{ points: [[0, 0], [60, 0.55], [120, 1.05], [240, 1.95]] }]),
  }),
];

export default questions;
