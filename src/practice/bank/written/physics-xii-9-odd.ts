// Written by hand: the semiconductor diode, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const B = at(9, 'b');

const questions: BankDef[] = [
  odd(B(2, 1), ['LED', 'photodiode', 'solar cell', 'filament lamp'], 'filament lamp', 'It isn’t a junction diode; the others are.'),
  odd(B(2, 2), ['photodiode', 'Zener regulator', 'LED', 'reverse-biased junction'], 'LED', 'It works in forward bias; the others work in reverse bias.'),
  odd(B(2, 2), ['half-wave rectifier', 'full-wave rectifier', 'smoothing capacitor', 'Zener breakdown'], 'Zener breakdown', 'It is an effect in a diode; the others are parts of a power supply’s rectifying stage.'),
  odd(B(2, 3), ['knee voltage', 'barrier potential', 'breakdown voltage', 'rms voltage'], 'rms voltage', 'It describes an a.c. supply; the others describe a diode.'),
  odd(B(2, 3), ['diffusion of holes', 'diffusion of electrons', 'drift across the junction', 'emission of photons'], 'emission of photons', 'It happens only in an LED; the others happen in every p–n junction.'),
];

export default questions;
