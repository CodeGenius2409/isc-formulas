// Written by hand: periodic law and periodic trends, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// First ionisation enthalpies (kJ/mol) and atomic radii (pm) of period 2 are the usual data-book values.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const P = at(3, 'a');

const period2: [number, string][] = [[3, 'Li'], [4, 'Be'], [5, 'B'], [6, 'C'], [7, 'N'], [8, 'O'], [9, 'F'], [10, 'Ne']];

// The ionisation enthalpy graph drawn by hand, so the axis title can sit above the axis: origin (60, 190), 32 px to each element, 0.08 px to each kJ/mol.
const ie = [520, 899, 801, 1086, 1402, 1314, 1681, 2081];
const ieGraph: SketchMark[] = [
  arrow([60, 190], [334, 190]), arrow([60, 190], [60, 14]), label(66, 14, 'first ionisation enthalpy (kJ/mol)', 'start'), label(334, 222, 'element', 'end'),
  ...[500, 1000, 1500, 2000].flatMap((v) => [line([[56, 190 - 0.08 * v], [60, 190 - 0.08 * v]]), label(52, 194 - 0.08 * v, `${v}`, 'end')]),
  line(ie.map((v, i) => [92 + 32 * i, 190 - 0.08 * v] as [number, number])),
  ...period2.map(([, s], i) => label(92 + 32 * i, 206, s)),
];

const questions: BankDef[] = [
  figure(P(3, 2), 'The graph shows the first ionisation enthalpies of the elements from lithium to neon. Explain the general trend, and the two places where it falls.', ['Across the period the nuclear charge rises while electrons go into the same shell, so they are held more tightly and the ionisation enthalpy generally rises.', 'It falls from Be to B, as boron’s outer electron is in a 2p subshell, higher in energy and more shielded than beryllium’s full 2s.', 'It falls from N to O, as nitrogen’s half-filled 2p subshell is extra stable, while oxygen’s fourth 2p electron is paired and repelled.'], {
    shown: sketch(340, 230, 'A line graph of first ionisation enthalpy against element, Li to Ne. It rises from 520 kJ/mol at Li to 899 at Be, dips to 801 at B, rises through 1086 at C to 1402 at N, dips to 1314 at O, then rises through 1681 at F to 2081 at Ne.', ieGraph),
  }),
  figure(P(2, 1), 'The atomic radii of the period 2 elements, in pm, are Li 152, Be 111, B 88, C 77, N 74, O 66 and F 64. Sketch a graph of them, and explain its shape.', ['The radius falls across the period, steeply at first and then more slowly.', 'The nuclear charge rises by one each step while the electrons are added to the same shell, so the whole atom is pulled in more tightly.'], {
    answer: graph('element', 'atomic radius (pm)', [{ points: [[3, 152], [4, 111], [5, 88], [6, 77], [7, 74], [8, 66], [9, 64]] }], { x: period2.slice(0, 7), y: [[50, '50'], [100, '100'], [150, '150']], xFrom: 2 }),
  }),
  figure(P(3, 2), 'Make a table giving the IUPAC name and symbol for the elements of atomic number 101, 105 and 120, showing the roots used for each digit.', ['101: un + nil + un + ium gives unnilunium, Unu.', '105: un + nil + pent + ium gives unnilpentium, Unp.', '120: un + bi + nil + ium gives unbinilium, Ubn.'], {
    answer: table(['Atomic number', 'Roots', 'Name', 'Symbol'], [['101', 'un + nil + un', 'unnilunium', 'Unu'], ['105', 'un + nil + pent', 'unnilpentium', 'Unp'], ['120', 'un + bi + nil', 'unbinilium', 'Ubn']]),
  }),

  predict(P(2, 1), 'An element has the electronic configuration 2, 8, 6. Predict its valency and the formula of its compound with hydrogen.', 'It needs two more electrons to complete its octet, so its valency is 2.', 'Its hydride is XH₂, like H₂S.'),
  predict(P(2, 2), 'The first three ionisation enthalpies of an element are 738, 1451 and 7733 kJ/mol. Predict the group it belongs to, and explain.', 'It is in group 2.', 'The big jump comes after two electrons are removed, as the third must come from a full inner shell much nearer the nucleus.'),
  predict(P(2, 2), 'Element 119 hasn’t been made yet. Predict where it would go in the periodic table, and two of its properties.', 'It would start period 8 in group 1, below francium, with one electron in an 8s orbital.', 'It would be a very reactive metal, with a very low first ionisation enthalpy, forming a +1 ion.'),

  odd(P(2, 1), ['Na⁺', 'Mg²⁺', 'F⁻', 'Cl⁻'], 'Cl⁻', 'It has 18 electrons; the other three each have 10, so they are isoelectronic with neon.'),
  odd(P(2, 1), ['ionisation enthalpy', 'electronegativity', 'non-metallic character', 'atomic radius'], 'atomic radius', 'It falls across a period from left to right; the other three generally rise.'),
  odd(P(2, 2), ['Unq', 'Unp', 'Unh', 'Fm'], 'Fm', 'Fermium is element 100, which has only an ordinary name and symbol; the others are systematic IUPAC symbols, built from the digits, for elements 104, 105 and 106.'),

  long(P(5, 2), 'Answer each part on Mendeleev’s periodic table.\n(a) State Mendeleev’s periodic law. [1]\n(b) Give two achievements of his table. [2]\n(c) Give a limitation of it. [1]\n(d) State the modern periodic law, and say how it puts argon and potassium in the right order. [1]', '(a) The properties of the elements are a periodic function of their atomic masses.', '(b) He left gaps for elements not yet discovered, and predicted their properties, as for eka-aluminium, later found as gallium.', '(b) He corrected the atomic masses of some elements, such as beryllium, to fit their properties.', '(c) The position of hydrogen wasn’t fixed, and isotopes, with different masses, had no separate places; some heavier elements had to come before lighter ones.', '(d) The properties are a periodic function of atomic number; argon (18) comes before potassium (19), though it is heavier.'),
  long(P(5, 1), 'Answer each part on valency.\n(a) How is the valency of a main-group element related to the number of its outer electrons? [2]\n(b) Write the formulae of the oxides of sodium, magnesium, aluminium and silicon, using their usual valencies. [2]\n(c) How does valency change down a group, and why? [1]', '(a) For groups 1, 2, 13 and 14, the valency usually equals the number of outer electrons.', '(a) For groups 15 to 17, it is usually 8 minus the number of outer electrons.', '(b) Na₂O and MgO.', '(b) Al₂O₃ and SiO₂.', '(c) It stays the same, as the elements of a group have the same number of outer electrons.'),

  tell(P(2, 1), 'Distinguish between ionisation enthalpy and electron gain enthalpy.', 'Ionisation enthalpy is the energy needed to remove the most loosely held electron from an isolated gaseous atom; it is always positive.', 'Electron gain enthalpy is the enthalpy change when an isolated gaseous atom gains an electron; it is negative for most elements.'),
  tell(P(2, 2), 'Distinguish between the covalent radius and the van der Waals radius of an atom.', 'The covalent radius is half the distance between the nuclei of two like atoms joined by a single covalent bond.', 'The van der Waals radius is half the distance between the nuclei of two like atoms in neighbouring molecules, not bonded, so it is larger.'),
  tell(P(2, 1), 'Distinguish between the first and second ionisation enthalpies of an element.', 'The first is the energy needed to remove one electron from the neutral gaseous atom.', 'The second is the energy needed to remove an electron from the gaseous +1 ion, and is always larger.'),

  match(P(4, 2), [['Element 104', 'unnilquadium'], ['Element 107', 'unnilseptium'], ['Element 110', 'ununnilium'], ['Element 118', 'ununoctium']]),
  match(P(4, 1), [['The largest atomic radius in period 3', 'Na'], ['The highest first ionisation enthalpy in period 3', 'Ar'], ['The most negative electron gain enthalpy of all the elements', 'Cl'], ['The highest electronegativity of all the elements', 'F']]),
  match(P(3, 2), [['Mendeleev’s eka-aluminium', 'gallium'], ['Mendeleev’s eka-silicon', 'germanium'], ['Mendeleev’s eka-boron', 'scandium']]),

  reason(P(2, 1), 'Give reasons. (a) The second ionisation enthalpy of an element is always greater than its first. (b) An anion is larger than its parent atom.', '(a) The second electron is removed from a positive ion, whose nucleus holds the remaining electrons more tightly.', '(b) The extra electrons repel each other while the nuclear charge is the same, so the electron cloud spreads out.'),
  reason(P(2, 1), 'Give reasons. (a) Noble gases have very high ionisation enthalpies. (b) Ionisation enthalpy falls down a group.', '(a) Their outer shells are full, a very stable arrangement, so an electron is hard to remove.', '(b) Down a group the outer electron is in a higher shell, further from the nucleus and better shielded, so it is held less tightly.'),

  short(P(2, 2), 'Arrange N³⁻, O²⁻, F⁻ and Na⁺ in decreasing order of size, and explain.', 'N³⁻ > O²⁻ > F⁻ > Na⁺.', 'All have 10 electrons, so the one with the most protons, Na⁺ with 11, pulls them in most and is smallest, while N³⁻, with 7, is largest.'),
  short(P(2, 1), 'Give the IUPAC name and symbol of the element of atomic number 112, and show how they are formed.', 'The digits 1, 1 and 2 give the roots un, un and bi, with -ium added.', 'Ununbium, symbol Uub.'),

  ar(P(1, 2), 'Mendeleev placed tellurium before iodine, though its atomic mass is greater.', 'He gave more weight to the similarities of properties than to the order of atomic masses.', 1, 'Iodine is like chlorine and bromine, so he put it in their group; the modern law, by atomic number, shows he was right.'),
  ar(P(1, 1), 'Electronegativity rises across a period from left to right.', 'The atomic radius falls across a period from left to right.', 1, 'A smaller atom with a larger nuclear charge pulls the shared electrons of a bond more strongly.'),
];

export default questions;
