// Written by hand: d- and f-block elements, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('chemistry', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between a d-block element and a transition element, with an example.', 'A d-block element has its last electron in a d orbital, as zinc does.', 'A transition element has a partly filled d set in the atom or a common ion, which zinc, 3d¹⁰ in both, doesn’t.'),
  tell(A(2, 2), 'Distinguish between paramagnetic and diamagnetic substances, with an example of each from the 3d series.', 'Paramagnetic: has unpaired electrons and is drawn into a magnetic field, as Mn²⁺ is.', 'Diamagnetic: all electrons paired, and is weakly pushed out, as Zn²⁺ is.'),
  tell(A(2, 2), 'Distinguish between an interstitial compound and an alloy.', 'An interstitial compound has small atoms, such as H, C or N, trapped in the gaps of a metal lattice.', 'An alloy is a mixture of metals, often of similar size, that replace each other in the lattice.'),
  tell(A(2, 3), 'Distinguish between ferromagnetic and paramagnetic substances, with an example of each from the 3d series.', 'Ferromagnetic substances are strongly attracted, and can become permanent magnets, as iron, cobalt and nickel can.', 'Paramagnetic substances are only weakly attracted, and lose it when the field is removed, as Mn²⁺ salts do.'),
  tell(A(2, 3), 'Distinguish between Cu⁺ and Cu²⁺ in water by their colour and stability.', 'Cu⁺ is 3d¹⁰ and colourless, but unstable in water: it disproportionates.', 'Cu²⁺ is 3d⁹ and blue, and stable in water, as it is strongly hydrated.'),
];

export default questions;
