// Written by hand: coordination compounds, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure } = kit('chemistry', 'XII');
const A = at(5, 'a');

/** Short level lines, side by side, with any electrons written on them. */
const levels = (y: number, xs: number[], electrons: string[] = []): SketchMark[] => xs.flatMap((x, i) => [line([[x - 14, y], [x + 14, y]]), ...(electrons[i] ? [label(x, y - 4, electrons[i])] : [])]);

const splitting = (kind: 'octahedral' | 'tetrahedral', electrons?: { low: string[]; high: string[] }): SketchMark[] => {
  const [lowName, highName, lowX, highX] = kind === 'octahedral' ? ['t₂g', 'eg', [170, 205, 240], [187, 222]] : ['e', 't₂', [187, 222], [170, 205, 240]];
  return [
    ...levels(90, [40, 75, 110, 145].slice(0, 4).map((x) => x - 10), []),
    line([[10, 90], [150, 90]], { dash: 1 }), label(75, 108, 'free ion'),
    ...levels(130, lowX as number[], electrons?.low), label(270, 134, lowName as string, 'start'),
    ...levels(40, highX as number[], electrons?.high), label(270, 44, highName as string, 'start'),
    line([[150, 90], [160, 130]], { dash: 1 }), line([[150, 90], [160, 40]], { dash: 1 }),
    line([[300, 40], [300, 130]]), label(306, 90, kind === 'octahedral' ? 'Δo' : 'Δt', 'start'),
  ];
};

const questions: BankDef[] = [
  figure(A(2, 1), 'Draw the splitting of the d orbitals in an octahedral field, and label the two sets and the splitting energy.', ['The five d orbitals split into three lower t₂g orbitals and two higher eg orbitals.', 'The gap between them is Δo.'], {
    answer: sketch(330, 160, 'Five d orbitals of a free ion, drawn as one dashed level, split in an octahedral field into three lower orbitals, t₂g, and two higher ones, eg. The gap is marked Δo.', splitting('octahedral')),
  }),
  figure(A(2, 2), 'Draw the splitting of the d orbitals in a tetrahedral field. How does Δt compare with Δo for the same metal and ligands?', ['The d orbitals split the other way: two lower e orbitals and three higher t₂ orbitals.', 'Δt is smaller, about 4/9 of Δo, so tetrahedral complexes are nearly always high spin.'], {
    answer: sketch(330, 160, 'Five d orbitals of a free ion split in a tetrahedral field into two lower orbitals, e, and three higher ones, t₂. The gap is marked Δt.', splitting('tetrahedral')),
  }),
  figure(A(3, 3), 'The figure shows how the six d electrons of Fe²⁺ are arranged in [Fe(CN)₆]⁴⁻. Is it high or low spin? Is it paramagnetic? Why does CN⁻ give this arrangement?', ['Low spin: all six electrons are paired in the t₂g set.', 'It has no unpaired electrons, so it is diamagnetic.', 'CN⁻ is a strong-field ligand, so Δo is larger than the pairing energy.'], {
    shown: sketch(330, 160, 'An octahedral splitting diagram. The three lower t₂g orbitals each hold a pair of electrons, and the two higher eg orbitals are empty.', splitting('octahedral', { low: ['↑↓', '↑↓', '↑↓'], high: [] })),
  }),
  figure(A(2, 2), 'Draw the cis and trans isomers of [Pt(NH₃)₂Cl₂].', ['Cis: the two Cl atoms are next to each other on the square, at 90°.', 'Trans: they are opposite each other, at 180°.'], {
    answer: sketch(320, 150, 'Two square planar structures. In the cis isomer on the left, the two chlorine atoms are on adjacent corners. In the trans isomer on the right, they are on opposite corners.', [
      label(80, 80, 'Pt'), line([[70, 72], [45, 45]]), line([[90, 72], [115, 45]]), line([[70, 86], [45, 113]]), line([[90, 86], [115, 113]]),
      label(40, 40, 'Cl'), label(120, 40, 'Cl'), label(40, 128, 'NH₃'), label(122, 128, 'NH₃'), label(80, 146, 'cis'),
      label(240, 80, 'Pt'), line([[230, 72], [205, 45]]), line([[250, 72], [275, 45]]), line([[230, 86], [205, 113]]), line([[250, 86], [275, 113]]),
      label(200, 40, 'Cl'), label(282, 40, 'NH₃'), label(200, 128, 'NH₃'), label(280, 128, 'Cl'), label(240, 146, 'trans'),
    ]),
  }),
  figure(A(3, 3), 'Draw the two geometrical isomers of the octahedral ion [Co(NH₃)₄Cl₂]⁺. Which of them has no dipole moment?', ['Cis: the two Cl ligands are on neighbouring corners of the octahedron.', 'Trans: they are on opposite corners, above and below the cobalt.', 'The trans isomer is symmetrical, so its dipoles cancel.'], {
    answer: sketch(320, 170, 'Two octahedra around cobalt. In the cis isomer, the two chlorine ligands are at the top and on the right, next to each other. In the trans isomer, they are at the top and the bottom, opposite each other.', [
      label(80, 88, 'Co'), line([[80, 76], [80, 40]]), line([[80, 96], [80, 132]]), line([[66, 84], [36, 84]]), line([[94, 84], [124, 84]]), line([[72, 92], [52, 110]]), line([[88, 78], [108, 60]]),
      label(80, 32, 'Cl'), label(136, 88, 'Cl', 'start'), label(80, 146, 'NH₃'), label(30, 88, 'NH₃', 'end'), label(46, 122, 'NH₃'), label(116, 56, 'NH₃', 'start'), label(80, 166, 'cis'),
      label(240, 88, 'Co'), line([[240, 76], [240, 40]]), line([[240, 96], [240, 132]]), line([[226, 84], [196, 84]]), line([[254, 84], [284, 84]]), line([[232, 92], [212, 110]]), line([[248, 78], [268, 60]]),
      label(240, 32, 'Cl'), label(240, 146, 'Cl'), label(190, 88, 'NH₃', 'end'), label(290, 88, 'NH₃', 'start'), label(206, 122, 'NH₃'), label(276, 56, 'NH₃', 'start'), label(240, 166, 'trans'),
    ]),
  }),
];

export default questions;
