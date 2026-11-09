// Written by hand: numericals on photons and matter waves, for Physics XII at 0% generated. Answers come from the solver.
// Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { num } = bank('physics', 'XII');
const D = (marks: number, d: 1 | 2 | 3): Place => [7, 'a', marks, d];

const questions: BankDef[] = [
  num(D(1, 1), { text: 'Find the energy of a photon of frequency 6 × 10¹⁴ Hz, in joules.', vars: {}, parts: [{ ask: 'Photon energy', use: 'p-xii-7-4', find: 'E', given: { nu: '6e14 Hz' }, marks: 1 }] }),
  num(D(2, 1), { text: 'Find the momentum of a photon of wavelength 500 nm.', vars: {}, parts: [{ ask: 'Photon momentum', use: 'p-xii-7-10', find: 'p', given: { lambda: '500e-9 m' }, marks: 2 }] }),
  num(D(2, 2), { text: 'A photon has a momentum of 2.21 × 10⁻²⁷ kg m/s. Find its wavelength.', vars: {}, parts: [{ ask: 'Wavelength', use: 'p-xii-7-10', find: 'lambda', given: { p: '2.21e-27 kg*m/s' }, marks: 2 }] }),
  num(D(2, 2), { text: 'A metal has a work function of 3.2 × 10⁻¹⁹ J. Find its threshold frequency.', vars: {}, parts: [{ ask: 'Threshold frequency', use: 'p-xii-7-19', find: 'nu_0', given: { phi: '3.2e-19 J' }, marks: 2 }] }),
  num(D(2, 2), { text: 'A metal has a work function of 4 × 10⁻¹⁹ J. Find its threshold wavelength.', vars: {}, parts: [{ ask: 'Threshold wavelength', use: 'p-xii-7-18', find: 'lambda_0', given: { phi: '4e-19 J' }, marks: 2 }] }),
  num(D(3, 2), { text: 'Light of frequency 8 × 10¹⁴ Hz falls on a metal of work function 3 × 10⁻¹⁹ J. Find the greatest kinetic energy of the electrons given off.', vars: {}, parts: [{ ask: 'Maximum kinetic energy', use: 'p-xii-7-1', find: 'K_max', given: { nu: '8e14 Hz', phi: '3e-19 J' }, marks: 3 }] }),
  num(D(3, 3), { text: 'Light of frequency 1.5 × 10¹⁵ Hz falls on a metal of work function 4.8 × 10⁻¹⁹ J. Find the stopping potential.', vars: {}, parts: [{ ask: 'Stopping potential', use: 'p-xii-7-8', find: 'V_0', given: { nu: '1.5e15 Hz', phi: '4.8e-19 J' }, marks: 3 }] }),
  num(D(2, 1), { text: 'An electron (mass 9.1 × 10⁻³¹ kg) moves at 2 × 10⁶ m/s. Find its de Broglie wavelength.', vars: {}, parts: [{ ask: 'De Broglie wavelength', use: 'p-xii-7-2', find: 'lambda', given: { m: '9.1e-31 kg', v: '2e6 m/s' }, marks: 2 }] }),
  num(D(3, 2), { text: 'In an electron microscope, an electron (mass 9.1 × 10⁻³¹ kg) has a kinetic energy of 1.6 × 10⁻¹⁶ J. Find its de Broglie wavelength.', vars: {}, parts: [{ ask: 'De Broglie wavelength', use: 'p-xii-7-31', find: 'lambda', given: { m: '9.1e-31 kg', K: '1.6e-16 J' }, marks: 3 }] }),
  num(D(5, 2), { text: 'A metal has a work function of 3.2 × 10⁻¹⁹ J, and is lit by light of frequency 7 × 10¹⁴ Hz.\n(i) Find the photon energy. (ii) Find the threshold frequency. (iii) Find the stopping potential.', vars: {}, parts: [{ ask: 'Photon energy', use: 'p-xii-7-4', find: 'E', given: { nu: '7e14 Hz' }, marks: 1 }, { ask: 'Threshold frequency', use: 'p-xii-7-19', find: 'nu_0', given: { phi: '3.2e-19 J' }, marks: 2 }, { ask: 'Stopping potential', use: 'p-xii-7-8', find: 'V_0', given: { nu: '7e14 Hz', phi: '3.2e-19 J' }, marks: 2 }] }),
];

export default questions;
