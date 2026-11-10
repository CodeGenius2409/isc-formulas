// Written by hand: dual nature of radiation and matter, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Work function', 'Least energy to free an electron'], ['Threshold frequency', 'Least frequency to free an electron'], ['Stopping potential', 'Stops the fastest photoelectrons']]),
  match(A(4, 2), [['Energy of a photon', 'hν'], ['Einstein’s equation', 'hν = φ + K_max'], ['de Broglie wavelength', 'h/p'], ['Wavelength of an electron through V volts', 'h/√(2meV)']]),
  match(A(3, 2), [['Intensity raised', 'More photoelectrons'], ['Frequency raised', 'Faster photoelectrons'], ['Frequency below threshold', 'No photoelectrons, however bright']]),
  match(A(4, 3), [['Photoelectric effect', 'Light behaves as particles'], ['Davisson and Germer experiment', 'Electrons behave as waves'], ['Instant emission of photoelectrons', 'Energy comes in packets'], ['Stopping potential against frequency', 'A straight line of slope h/e']]),
  match(A(3, 3), [['Proton and electron with the same speed', 'The electron has the longer wavelength'], ['Proton and electron with the same momentum', 'The same wavelength'], ['Electron accelerated through a larger voltage', 'Shorter wavelength']]),
];

export default questions;
