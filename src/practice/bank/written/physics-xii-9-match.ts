// Written by hand: the semiconductor diode, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const B = at(9, 'b');

const questions: BankDef[] = [
  match(B(3, 1), [['Forward bias', 'p side to the positive terminal'], ['Reverse bias', 'n side to the positive terminal'], ['Depletion layer', 'A region with no free charge carriers']]),
  match(B(4, 2), [['Half-wave rectifier', 'One diode, output on half of each cycle'], ['Full-wave rectifier', 'Output on both halves of each cycle'], ['Capacitor across the output', 'Smooths the output'], ['Zener diode', 'Keeps a voltage steady']]),
  match(B(3, 2), [['Forward bias', 'Depletion layer narrows'], ['Reverse bias', 'Depletion layer widens'], ['Reverse breakdown', 'Current rises sharply']]),
  match(B(4, 3), [['Light-emitting diode', 'Forward biased'], ['Photodiode', 'Reverse biased'], ['Solar cell', 'No bias, gives an emf'], ['Zener regulator', 'Reverse biased past breakdown']]),
  match(B(3, 3), [['Diffusion current', 'Carriers move from high to low concentration'], ['Drift current', 'Carriers pushed by the junction’s field'], ['Barrier potential of silicon', 'About 0.7 V']]),
];

export default questions;
