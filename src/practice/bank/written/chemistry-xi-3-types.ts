// Written by hand: periodicity, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(3, 'a');

const questions: BankDef[] = [
  long(A(5, 2), 'Answer each part on periodic trends.\n(a) How does atomic radius change across a period and down a group? Give a reason for each. [2]\n(b) Why is the first ionisation enthalpy of nitrogen higher than that of oxygen? [1]\n(c) Why does beryllium have a higher first ionisation enthalpy than boron? [1]\n(d) Which is larger, Na or Na⁺, and why? [1]', ['(a) It falls across a period, as nuclear charge grows while the shell stays the same.', '(a) It rises down a group, as new shells are added.', '(b) Nitrogen’s half-filled 2p subshell is extra stable.', '(c) Boron’s electron is in a 2p orbital, which is higher in energy and shielded by 2s.', '(d) Na, as Na⁺ has lost its outer shell.']),
];

export default questions;
