// Written by hand: ionic and covalent bonding, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Electronegativities on Pauling’s scale: H 2.1, Na 0.9, Cl 3.0.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, ar } = kit('chemistry', 'XI');
const B = at(4, 'a');

const questions: BankDef[] = [
  figure(B(2, 1), 'Draw the Lewis structure of the nitrogen molecule, N₂, and say how each atom reaches an octet.', ['The two N atoms share three pairs of electrons, a triple bond, and each keeps one lone pair.', 'Each N then has 6 shared and 2 unshared electrons around it: an octet.'], {
    answer: sketch(280, 130, 'Two N atoms side by side joined by three lines, a triple bond. Each N has a pair of dots, a lone pair, on its outer side.', [
      label(110, 75, 'N'), label(170, 75, 'N'), line([[121, 63], [159, 63]]), line([[121, 69], [159, 69]]), line([[121, 75], [159, 75]]),
      { t: 'dot', x: 94, y: 64 }, { t: 'dot', x: 94, y: 74 }, { t: 'dot', x: 186, y: 64 }, { t: 'dot', x: 186, y: 74 },
      label(140, 112, 'triple bond, one lone pair on each N'),
    ]),
  }),
  figure(B(3, 1), 'Show how sodium and chlorine atoms form sodium chloride, giving the electron arrangement of each atom and ion.', ['Na, 2,8,1, gives up its outer electron to become Na⁺, 2,8, with the arrangement of neon.', 'Cl, 2,8,7, takes that electron to become Cl⁻, 2,8,8, with the arrangement of argon.', 'The oppositely charged ions attract each other strongly: an ionic bond.'], {
    answer: sketch(360, 160, 'Top: sodium, 2,8,1, gives an electron and becomes a sodium ion, 2,8. Middle: chlorine, 2,8,7, takes an electron and becomes a chloride ion, 2,8,8. Bottom: the two ions attract each other, forming an ionic bond.', [
      label(20, 35, 'Na (2,8,1)', 'start'), arrow([110, 30], [180, 30]), label(190, 35, 'Na⁺ (2,8) + e⁻', 'start'),
      label(20, 85, 'Cl (2,8,7) + e⁻', 'start'), arrow([130, 80], [180, 80]), label(190, 85, 'Cl⁻ (2,8,8)', 'start'),
      label(180, 140, 'Na⁺ and Cl⁻ attract: an ionic bond'),
    ]),
  }),
  figure(B(3, 2), 'The table gives the electronegativity difference across three bonds. Say what kind of bond each is.', ['H–H, with no difference, is a non-polar covalent bond: the pair is shared equally.', 'H–Cl, with a difference of 0.9, is a polar covalent bond: the pair is pulled towards Cl.', 'Na–Cl, with a difference of 2.1, is ionic: the electron passes over to Cl.'], {
    shown: table(['Bond', 'Electronegativities', 'Difference'], [['H–H', '2.1 and 2.1', '0'], ['H–Cl', '2.1 and 3.0', '0.9'], ['Na–Cl', '0.9 and 3.0', '2.1']]),
  }),

  predict(B(2, 2), 'Predict which is more covalent, AlCl₃ or NaCl, and explain.', 'AlCl₃.', 'Al³⁺ is small and highly charged, so it distorts the electron cloud of Cl⁻ much more than Na⁺ does, by Fajans’ rules.'),
  predict(B(2, 3), 'Predict which has the larger dipole moment, NH₃ or NF₃, and explain.', 'NH₃.', 'In NH₃ the N–H bond dipoles point towards N, the same way as the lone pair’s, and add; in NF₃ the N–F dipoles point away from N and partly cancel the lone pair’s.'),
  predict(B(2, 2), 'Predict which boils higher, o-nitrophenol or p-nitrophenol, and explain.', 'p-Nitrophenol.', 'Its molecules hydrogen bond to each other, holding them together; in o-nitrophenol the hydrogen bond forms within one molecule.'),

  odd(B(2, 1), ['NaCl', 'MgO', 'CaF₂', 'HCl'], 'HCl', 'It is covalent; the others are ionic.'),
  odd(B(2, 1), ['H₂O', 'NH₃', 'HF', 'CH₄'], 'CH₄', 'Its molecules can’t form hydrogen bonds; the others can.'),
  odd(B(2, 2), ['NH₄⁺', 'H₃O⁺', 'H₃N→BF₃', 'CH₄'], 'CH₄', 'It has no coordinate bond; each of the others has one.'),

  long(B(5, 1), 'Answer each part on bond parameters.\n(a) Define bond length, bond angle and bond enthalpy. [3]\n(b) How do the bond length and bond enthalpy of N₂ compare with those of O₂? Explain using bond order. [2]', '(a) Bond length: the distance between the nuclei of two bonded atoms.', '(a) Bond angle: the angle between two bonds from the same atom.', '(a) Bond enthalpy: the energy needed to break one mole of a given bond in gaseous molecules.', '(b) N₂ has a triple bond, bond order 3, and O₂ a double bond, bond order 2.', '(b) A higher bond order holds the atoms closer and more firmly, so N₂ has the shorter bond and the larger bond enthalpy.'),
  long(B(5, 2), 'Answer each part on ionic and covalent character.\n(a) Give three conditions that favour the forming of an ionic bond. [3]\n(b) Use Fajans’ rules to explain why LiI is more covalent than LiF. [2]', '(a) A low ionisation enthalpy for the metal, so it gives up electrons easily.', '(a) A high electron gain enthalpy for the non-metal, so it takes electrons readily.', '(a) A high lattice enthalpy, which releases a lot of energy as the ions pack together.', '(b) I⁻ is much larger than F⁻, so its electron cloud is held less tightly.', '(b) The Li⁺ ion distorts it more easily, pulling electrons back between the nuclei: more covalent character.'),

  tell(B(2, 1), 'Distinguish between a polar and a non-polar covalent bond, with an example of each.', 'In a non-polar bond, between atoms of equal electronegativity, the pair is shared equally, as in Cl₂.', 'In a polar bond, between atoms of different electronegativity, the pair is pulled towards one atom, as in HCl.'),
  tell(B(2, 2), 'Distinguish between a coordinate bond and an ordinary covalent bond.', 'In an ordinary covalent bond, each atom gives one electron to the shared pair.', 'In a coordinate bond, one atom gives both electrons of the pair, as nitrogen does to H⁺ in NH₄⁺.'),
  tell(B(2, 2), 'Distinguish between intermolecular and intramolecular hydrogen bonds, with an example of each.', 'An intermolecular hydrogen bond joins two molecules, as between water molecules.', 'An intramolecular hydrogen bond forms within one molecule, as between the OH and NO₂ groups of o-nitrophenol.'),

  match(B(4, 1), [['N₂', 'a triple bond'], ['O₂', 'a double bond'], ['F₂', 'a single bond'], ['NH₄⁺', 'a coordinate bond']]),
  match(B(4, 2), [['C–C', '154 pm'], ['C=C', '134 pm'], ['C≡C', '120 pm'], ['C–H', '109 pm']]),
  match(B(4, 2), [['Formal charge', 'valence electrons − lone-pair electrons − ½ of the bonding electrons'], ['Bond order', 'the number of bonds between two atoms'], ['Resonance', 'needed when no one structure shows the bonding'], ['Dipole moment', 'charge × distance between the charges']]),

  reason(B(2, 1), 'Why is BF₃ an exception to the octet rule?', 'Boron has only three valence electrons, and forms three bonds with them.', 'So it has only six electrons round it, two short of an octet.'),
  reason(B(2, 1), 'Why does ammonia dissolve so well in water?', 'NH₃ molecules form hydrogen bonds with water molecules.', 'These strong attractions let ammonia mix readily with water.'),
  reason(B(2, 1), 'Why is a covalent bond between two different atoms usually polar?', 'Different atoms usually have different electronegativities.', 'The shared pair is pulled towards the more electronegative atom, giving it a partial negative charge.'),

  ar(B(1, 1), 'The C–O bonds in CO₂ are polar.', 'Oxygen is more electronegative than carbon.', 1, 'The shared pairs are pulled towards oxygen.'),
  ar(B(1, 2), 'HF boils lower than HCl.', 'HF molecules form hydrogen bonds with each other.', 4, 'The hydrogen bonds make HF boil higher than HCl.'),
  ar(B(1, 1), 'The bond in N₂ is shorter than the bond in O₂.', 'Nitrogen and oxygen are in the same period.', 2, 'Both are true, but N₂’s bond is shorter because its bond order is higher.'),
];

export default questions;
