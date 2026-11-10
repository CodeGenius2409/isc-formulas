// Written by hand: d- and f-block elements, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, label, line, sketch, table } from '../figures';

const { figure } = kit('chemistry', 'XII');
const A = at(4, 'a');
const B = at(4, 'b');

const across: [number, string][] = [[21, 'Sc'], [25, 'Mn'], [30, 'Zn']];

const questions: BankDef[] = [
  figure(A(2, 2), 'Draw how the number of unpaired d electrons changes across the M²⁺ ions from Ti²⁺ to Zn²⁺. Name a pair of ions with the same number.', ['It rises from 2 for Ti²⁺ to 5 for Mn²⁺, then falls to 0 for Zn²⁺, as the d electrons begin to pair.', 'Cr²⁺ and Fe²⁺ both have four, as d⁴ and d⁶ fall either side of the half-filled d⁵.'], {
    answer: graph('atomic number', 'unpaired d electrons in M²⁺', [{ points: [[22, 2], [23, 3], [24, 4], [25, 5], [26, 4], [27, 3], [28, 2], [29, 1], [30, 0]] }], { x: [[22, 'Ti'], [25, 'Mn'], [30, 'Zn']], xFrom: 22 }),
  }),
  figure(A(2, 1), 'Draw roughly how the number of oxidation states changes across the 3d series, from Sc to Zn.', ['It rises from Sc to a peak at Mn, which shows every state from +2 to +7.', 'It then falls, as the d electrons pair up and fewer are free to be lost, to just +2 at Zn.'], {
    answer: graph('atomic number', 'number of oxidation states', [{ points: [[21, 1], [22, 3], [23, 4], [24, 5], [25, 6], [26, 4], [27, 3], [28, 3], [29, 2], [30, 1]] }], { x: across, xFrom: 21 }),
  }),
  figure(A(2, 2), 'Draw how the atomic radius changes across the 3d series. Why does it change so little in the middle?', ['It falls at first, then stays nearly level in the middle, and rises slightly at Cu and Zn.', 'Each added electron goes into an inner d orbital, which screens the outer 4s electrons from the extra nuclear charge.'], {
    answer: graph('atomic number', 'atomic radius', [{ points: [[21, 164], [22, 147], [23, 135], [24, 129], [25, 137], [26, 126], [27, 125], [28, 125], [29, 128], [30, 137]] }], { x: across, xFrom: 21, yFrom: 115 }),
  }),
  figure(A(3, 2), 'The table gives some ions of the 3d series. Which is colourless, which is the most paramagnetic, and what is its spin-only magnetic moment?', ['Zn²⁺, with a full 3d¹⁰, has no d–d transition, so it is colourless.', 'Mn²⁺, 3d⁵, has five unpaired electrons, the most.', 'μ = √(n(n + 2)) = √35 ≈ 5.92 BM.'], {
    shown: table(['Ion', '3d electrons'], [['Ti³⁺', '1'], ['Mn²⁺', '5'], ['Cu²⁺', '9'], ['Zn²⁺', '10']]),
  }),
  figure(A(2, 2), 'Draw how the radius of the Ln³⁺ ions changes from La³⁺ to Lu³⁺. Name the effect and give one result of it.', ['It falls steadily across the series: the lanthanoid contraction.', 'As a result, Zr and Hf, in the next rows, are almost the same size.'], {
    answer: graph('atomic number', 'radius of Ln³⁺ (pm)', [{ points: [[57, 103], [60, 98], [63, 95], [66, 91], [69, 88], [71, 86]] }], { x: [[57, 'La'], [71, 'Lu']], xFrom: 57, yFrom: 80 }),
  }),
  figure(B(3, 3), 'The figure shows the structure of the dichromate ion. Give the oxidation state of chromium, and say how the two parts are joined. What does the ion change to in alkali?', ['Each chromium is in the +6 state.', 'Two CrO₄ tetrahedra share one oxygen atom, through a Cr–O–Cr bridge.', 'In alkali it changes to the yellow chromate ion, CrO₄²⁻.'], {
    shown: sketch(320, 150, 'Two chromium atoms, each surrounded by four oxygen atoms, joined through one oxygen atom shared between them.', [
      label(100, 80, 'Cr'), label(220, 80, 'Cr'), label(160, 64, 'O'),
      line([[110, 72], [150, 62]]), line([[170, 62], [210, 72]]),
      label(100, 30, 'O'), line([[100, 66], [100, 38]]), label(55, 100, 'O'), line([[90, 84], [64, 96]]), label(100, 130, 'O⁻'), line([[100, 86], [100, 118]]),
      label(220, 30, 'O'), line([[220, 66], [220, 38]]), label(265, 100, 'O'), line([[230, 84], [256, 96]]), label(220, 130, 'O⁻'), line([[220, 86], [220, 118]]),
    ]),
  }),
];

export default questions;
