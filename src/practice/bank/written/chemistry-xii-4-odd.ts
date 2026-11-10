// Written by hand: d- and f-block elements, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['Ti³⁺', 'V³⁺', 'Cu²⁺', 'Zn²⁺'], 'Zn²⁺', 'It is colourless, with a full d¹⁰ set; the others are coloured.'),
  odd(A(2, 2), ['Fe', 'Co', 'Ni', 'Zn'], 'Zn', 'It isn’t a typical transition element and isn’t magnetic; the others are ferromagnetic.'),
  odd(A(2, 2), ['V₂O₅', 'Fe', 'Ni', 'NaCl'], 'NaCl', 'It isn’t a catalyst; the others are transition-metal catalysts.'),
  odd(A(2, 3), ['Mn²⁺', 'Fe³⁺', 'Cr³⁺', 'Sc³⁺'], 'Sc³⁺', 'It has no unpaired electrons; the others are paramagnetic.'),
  odd(A(2, 3), ['Ce', 'Eu', 'Lu', 'U'], 'U', 'It is an actinoid; the others are lanthanoids.'),
];

export default questions;
