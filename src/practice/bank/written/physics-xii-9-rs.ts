// Written by hand: electronic devices, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XII');
const A = at(9, 'a');
const B = at(9, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does the conductivity of a semiconductor rise with temperature?', 'More electrons cross the small band gap, so there are more charge carriers.'),
  reason(A(2, 2), 'Why is a p-type semiconductor still electrically neutral overall, though it has many holes?', 'Each dopant atom is neutral to begin with.', 'So adding them adds no net charge to the crystal.'),
  reason(A(2, 2), 'Why is silicon preferred to germanium in most devices?', 'Its larger band gap means fewer carriers from heat alone.', 'So it works better at high temperatures, with a small leakage current.'),
  reason(A(1, 2), 'Why does an insulator not conduct at room temperature?', 'Its band gap is too large for electrons to cross using thermal energy.'),
  reason(A(2, 3), 'Why is a trivalent atom called an acceptor?', 'It has one electron too few to complete four bonds, which leaves a hole.', 'That hole readily takes an electron from a nearby bond.'),
  tell(A(2, 1), 'Distinguish between an intrinsic and an extrinsic semiconductor.', 'An intrinsic one is pure, with equal numbers of electrons and holes.', 'An extrinsic one is doped, so one kind of carrier outnumbers the other.'),
  short(A(2, 2), 'Name the majority carriers in n-type and p-type semiconductors. What is added to silicon to make each?', 'n-type: electrons, by adding a pentavalent element like phosphorus.', 'p-type: holes, by adding a trivalent element like boron.'),
  short(A(3, 2), 'Use the energy-band picture to tell a conductor, an insulator and a semiconductor apart.', 'A conductor’s valence and conduction bands overlap.', 'An insulator has a wide gap, of over 3 eV.', 'A semiconductor has a narrow gap, of about 1 eV.'),
  short(A(3, 3), 'Name the donor level and acceptor level, and say where each lies in the band picture.', 'A donor level comes from a pentavalent impurity, and lies just below the conduction band.', 'An acceptor level comes from a trivalent impurity, and lies just above the valence band.', 'Both are close to the bands, so carriers form easily at room temperature.'),
  reason(B(1, 1), 'Why does a depletion region have no free charge carriers?', 'Electrons and holes near the junction have met and recombined, leaving only fixed ions.'),
  reason(B(2, 2), 'Why does the current through a p–n junction stay very small under reverse bias?', 'The barrier grows, so majority carriers can’t cross.', 'Only a few minority carriers move, giving a tiny saturation current.'),
  reason(B(2, 2), 'Why does a junction diode conduct only above a certain forward voltage?', 'The barrier potential has to be overcome first.', 'About 0.7 V for silicon, after which the current rises fast.'),
  reason(B(2, 3), 'Why is a Zener diode connected in reverse bias to steady a voltage?', 'In breakdown, the voltage across it hardly changes as the current changes.', 'So the load beside it gets a steady voltage.'),
  reason(B(1, 2), 'Why does a full-wave rectifier’s output need a capacitor to be smooth?', 'The capacitor charges at the peaks and gives current back between them, so the ripple falls.'),
  short(B(2, 1), 'What is rectification? Name the device used, and say why it works.', 'Changing a.c. to d.c.', 'A junction diode, as it conducts in only one direction.'),
  short(B(2, 2), 'What is the frequency of the output of a half-wave and of a full-wave rectifier, on a 50 Hz supply?', 'Half-wave: 50 Hz.', 'Full-wave: 100 Hz.'),
  short(B(3, 2), 'Compare a half-wave and a full-wave rectifier: how many diodes each uses, which part of a cycle each passes, and which gives the smoother output.', 'Half-wave uses one diode, and full-wave two with a centre-tapped transformer, or four in a bridge.', 'Half-wave passes one half of each cycle, and full-wave passes both.', 'Full-wave gives the smoother output.'),
  short(B(3, 3), 'What do an LED, a photodiode and a solar cell each do with light? Say in what bias each works.', 'An LED gives out light, in forward bias.', 'A photodiode detects light, in reverse bias.', 'A solar cell makes a voltage from light, with no bias at all.'),
];

export default questions;
