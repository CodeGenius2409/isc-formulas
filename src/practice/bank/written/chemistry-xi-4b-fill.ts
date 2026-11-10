// Written by hand: VSEPR, hybridisation and molecular orbitals, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, tell, match, reason, ar } = kit('chemistry', 'XI');
const V = at(4, 'b');

/** Electron spins drawn as arrows centred at (cx, cy): ↑ for one electron, ↑↓ for a pair. Drawn as lines, as arrow characters can show as coloured symbols. */
const spins = (cx: number, cy: number, s: string): SketchMark[] =>
  s === '↑↓' ? [line([[cx - 4, cy + 7], [cx - 4, cy - 7]], { arrow: 1 }), line([[cx + 4, cy - 7], [cx + 4, cy + 7]], { arrow: 1 })]
    : s === '↑' ? [line([[cx, cy + 7], [cx, cy - 7]], { arrow: 1 })] : [];

/** A short energy level from x1 to x2 at height y, with its electrons drawn on it. */
const level = (x1: number, x2: number, y: number, e: string): SketchMark[] => [line([[x1, y], [x2, y]]), ...spins((x1 + x2) / 2, y - 10, e)];

const questions: BankDef[] = [
  figure(V(3, 3), 'Draw the molecular orbital energy diagram for the valence electrons of N₂, and use it to find its bond order and say whether it is attracted to a magnet.', ['The 10 valence electrons fill σ2s², σ*2s², π2p⁴ and σ2p², in that order of energy, leaving π*2p and σ*2p empty.', 'Bond order = (bonding − antibonding)/2 = (8 − 2)/2 = 3.', 'Every electron is paired, so N₂ is diamagnetic and isn’t attracted to a magnet.'], {
    answer: sketch(380, 230, 'Atomic levels of nitrogen on the left and right, 2s low and three 2p levels higher. In the middle are the molecular orbitals, from the bottom: σ2s and σ*2s, each with a pair of electrons; two π2p levels, each with a pair; σ2p with a pair; then two empty π*2p levels and an empty σ*2p level at the top.', [
      ...level(30, 80, 195, '↑↓'), label(30, 214, '2s', 'start'), ...[30, 50, 70].flatMap((x) => level(x, x + 14, 110, '↑')), label(30, 128, '2p', 'start'),
      ...level(300, 350, 195, '↑↓'), ...[300, 320, 340].flatMap((x) => level(x, x + 14, 110, '↑')),
      ...level(160, 220, 215, '↑↓'), label(156, 215, 'σ2s', 'end'),
      ...level(160, 220, 175, '↑↓'), label(156, 175, 'σ*2s', 'end'),
      ...level(155, 185, 135, '↑↓'), ...level(195, 225, 135, '↑↓'), label(151, 135, 'π2p', 'end'),
      ...level(160, 220, 100, '↑↓'), label(156, 100, 'σ2p', 'end'),
      ...level(155, 185, 65, ''), ...level(195, 225, 65, ''), label(151, 65, 'π*2p', 'end'),
      ...level(160, 220, 30, ''), label(156, 30, 'σ*2p', 'end'),
    ]),
  }),
  figure(V(2, 1), 'Draw the shapes of BeCl₂ and BF₃, marking the bond angles.', ['BeCl₂ is linear: Cl–Be–Cl at 180°, with two bond pairs and no lone pair on Be.', 'BF₃ is trigonal planar: three B–F bonds at 120° in one plane, with no lone pair on B.'], {
    answer: sketch(340, 150, 'Left: Cl, Be and Cl in a straight line, marked 180°. Right: B in the middle with three F atoms around it, one above and two below on either side, all in one plane, with the angle between two bonds marked 120°.', [
      label(30, 75, 'Cl'), line([[42, 70], [78, 70]]), label(90, 75, 'Be'), line([[104, 70], [140, 70]]), label(152, 75, 'Cl'), label(90, 52, '180°'),
      label(260, 85, 'B'), line([[260, 72], [260, 34]]), label(260, 28, 'F'), line([[250, 88], [218, 108]]), label(208, 118, 'F'), line([[270, 88], [302, 108]]), label(312, 118, 'F'),
      label(278, 64, '120°', 'start'),
    ]),
  }),
  figure(V(3, 2), 'The table gives the bond pairs and lone pairs on the central atom of three molecules. Give the shape and the hybridisation of each.', ['SiF₄: four bond pairs and no lone pair, so tetrahedral, sp³.', 'PH₃: three bond pairs and one lone pair, so pyramidal, sp³.', 'H₂S: two bond pairs and two lone pairs, so bent, sp³.'], {
    shown: table(['Molecule', 'Bond pairs', 'Lone pairs'], [['SiF₄', '4', '0'], ['PH₃', '3', '1'], ['H₂S', '2', '2']]),
  }),

  predict(V(2, 2), 'An electron is removed from N₂ to give N₂⁺. Predict how its bond order and bond length change.', 'The electron leaves the bonding σ2p orbital, so the bond order falls from 3 to 2.5.', 'A lower bond order means a weaker bond, so the bond becomes longer.'),
  predict(V(2, 1), 'Predict the shape, bond angle and hybridisation of the ammonium ion, NH₄⁺.', 'Nitrogen has four bond pairs and no lone pair.', 'So the ion is tetrahedral, with angles of 109.5°, and the nitrogen is sp³ hybridised.'),
  predict(V(2, 2), 'Use molecular orbital theory to predict whether Be₂ can exist as a stable molecule.', 'Its four electrons fill σ1s², σ*1s², σ2s² and σ*2s², with as many in antibonding as in bonding orbitals.', 'Its bond order is (4 − 4)/2 = 0, so it doesn’t exist as a stable molecule.'),

  odd(V(2, 1), ['CH₄', 'NH₄⁺', 'CCl₄', 'NH₃'], 'NH₃', 'It is pyramidal; the other three are tetrahedral.'),
  odd(V(2, 2), ['O₂', 'B₂', 'N₂', 'O₂⁻'], 'N₂', 'It is diamagnetic, with all its electrons paired; the others have unpaired electrons and are paramagnetic.'),
  odd(V(2, 1), ['BeCl₂', 'CO₂', 'C₂H₂', 'H₂O'], 'H₂O', 'It is bent; the other three are linear.'),

  tell(V(2, 1), 'Distinguish between sp² and sp³ hybridisation, with an example of each.', 'In sp², one s and two p orbitals mix to give three hybrid orbitals at 120° in a plane, as in BF₃.', 'In sp³, one s and three p orbitals mix to give four hybrid orbitals pointing to the corners of a tetrahedron, at 109.5°, as in CH₄.'),
  tell(V(2, 2), 'Distinguish between valence bond theory and molecular orbital theory.', 'Valence bond theory pictures a bond as the overlap of atomic orbitals of two atoms, with the electrons staying with their atoms’ orbitals.', 'Molecular orbital theory combines the atomic orbitals into new orbitals that spread over the whole molecule, and the electrons fill these.'),

  match(V(4, 1), [['sp', 'linear, 180°'], ['sp²', 'trigonal planar, 120°'], ['sp³', 'tetrahedral, 109.5°'], ['sp³d²', 'octahedral, 90°']]),
  match(V(4, 2), [['H₂', '1'], ['He₂⁺', '½'], ['N₂', '3'], ['O₂', '2']]),
  match(V(4, 1), [['H₂O', 'two bond pairs, two lone pairs'], ['NH₃', 'three bond pairs, one lone pair'], ['CH₄', 'four bond pairs, no lone pair'], ['SF₄', 'four bond pairs, one lone pair']]),

  reason(V(2, 1), 'Why is NH₃ pyramidal and not trigonal planar?', 'Nitrogen has three bond pairs and one lone pair, four electron pairs in all.', 'They point to the corners of a tetrahedron; with one corner taken by the lone pair, the atoms form a pyramid.'),
  reason(V(2, 1), 'Why is a σ bond stronger than a π bond?', 'A σ bond forms by head-on overlap of orbitals along the line joining the nuclei.', 'This overlap is greater than the sideways overlap of a π bond, so the σ bond is stronger.'),
  reason(V(2, 2), 'Why is nitrogen gas very unreactive?', 'N₂ has a triple bond, with a bond order of 3.', 'This bond is very strong, so a great deal of energy is needed to break it.'),

  ar(V(1, 1), 'N₂ is diamagnetic.', 'All its electrons are paired in its molecular orbitals.', 1, 'With no unpaired electron, N₂ isn’t attracted to a magnet.'),
  ar(V(1, 2), 'The H–N–H bond angle in NH₃ is 109.5°.', 'The nitrogen in NH₃ is sp³ hybridised.', 4, 'The lone pair pushes the bond pairs closer, so the angle is about 107°.'),
  ar(V(1, 1), 'Ethene has a carbon–carbon double bond.', 'Ethene is a gas at room temperature.', 2, 'Both are true, but being a gas doesn’t explain the double bond.'),
];

export default questions;
