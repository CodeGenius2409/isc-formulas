// Written by hand: electromagnetic induction, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XII');
const I = at(4, 'a');

const questions: BankDef[] = [
  figure(I(3, 1), 'Draw a labelled diagram of a step-up transformer.', ['A laminated soft-iron core, with a primary coil wound on one limb and a secondary coil on the other.', 'The secondary has more turns than the primary.', 'An alternating voltage Vp across the primary, and the larger output Vs taken from the secondary.'], {
    answer: sketch(320, 190, 'A rectangular iron core with a hole in the middle. On its left limb is a primary coil of a few turns, with leads to an input voltage Vp. On its right limb is a secondary coil of many more turns, with leads to the output voltage Vs.', [
      { t: 'box', x: 60, y: 30, w: 200, h: 120 }, { t: 'box', x: 100, y: 70, w: 120, h: 40 },
      ...[0, 1, 2, 3, 4, 5].map((k) => line([[52, 46 + 16 * k], [108, 54 + 16 * k]])),
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => line([[212, 46 + 9 * k], [268, 54 + 9 * k]])),
      line([[52, 46], [25, 46]]), line([[52, 126], [25, 126]]), label(20, 92, 'Vp', 'end'),
      line([[268, 54], [295, 54]]), line([[268, 135], [295, 135]]), label(300, 98, 'Vs', 'start'),
      label(160, 22, 'laminated iron core'), label(80, 172, 'primary'), label(240, 172, 'secondary'),
    ]),
  }),
  figure(I(3, 2), 'The graph shows the magnetic flux through each turn of a coil of 10 turns. Find the induced emf from 0 to 2 s, from 2 to 4 s and from 4 to 5 s.', ['0 to 2 s: e = N dΦ/dt = 10 × 0.04/2 = 0.2 V.', '2 to 4 s: the flux doesn’t change, so e = 0.', '4 to 5 s: e = 10 × 0.04/1 = 0.4 V, in the opposite direction, as the flux now falls.'], {
    shown: graph('time (s)', 'flux (Wb)', [{ points: [[0, 0], [2, 0.04], [4, 0.04], [5, 0]] }], { x: [[2, '2'], [4, '4'], [5, '5']], y: [[0.04, '0.04']] }),
  }),
  figure(I(2, 2), 'The N pole of a bar magnet is pushed towards a coil. Draw the arrangement, and mark the pole that appears on each face of the coil.', ['The face of the coil nearer the magnet becomes an N pole, repelling the magnet as it comes.', 'This is Lenz’s law: the induced current opposes the change that causes it; the far face is S.'], {
    answer: sketch(320, 160, 'A bar magnet on the left, S at its far end and N facing a coil on the right. An arrow shows the magnet moving towards the coil. The coil’s near face is marked N and its far face S.', [
      { t: 'box', x: 20, y: 65, w: 100, h: 30 }, label(35, 85, 'S'), label(105, 85, 'N'),
      arrow([50, 120], [100, 120]), label(75, 140, 'moving in'),
      ...[0, 1, 2, 3, 4].map((k) => ({ t: 'path' as const, d: `M${180 + 12 * k} 45 A 6 35 0 0 0 ${180 + 12 * k} 115 A 6 35 0 0 0 ${180 + 12 * k} 45` })),
      label(166, 84, 'N', 'end'), label(240, 84, 'S', 'start'), label(204, 140, 'coil'),
    ]),
  }),

  predict(I(2, 1), 'The N pole of a magnet is pushed into a coil joined to a galvanometer, held still inside it, and then pulled out. Predict the galvanometer’s reading at each stage.', 'Pushed in: it deflects one way; held still: it reads zero, as the flux isn’t changing.', 'Pulled out: it deflects the opposite way.'),
  predict(I(2, 3), 'A light aluminium ring rests on the iron core of a coil, round the core. The coil is suddenly connected to an alternating supply. Predict what happens to the ring, and why.', 'The ring jumps up the core.', 'The changing flux induces a current in the ring which, by Lenz’s law, opposes the change, so the ring is repelled by the coil.'),
  predict(I(2, 2), 'Two coils lie close together. The current in the first is switched on and then becomes steady. Predict what happens in the second coil.', 'While the current rises, a brief current is induced in the second coil, opposite in direction to the first, by mutual induction.', 'Once the current is steady the flux stops changing, and the induced current stops.'),

  odd(I(2, 1), ['an induction furnace', 'electromagnetic braking', 'a speedometer', 'an electric fuse'], 'an electric fuse', 'It works by the heating effect of a current; the others use eddy currents.'),
  odd(I(2, 2), ['henry', 'weber per ampere', 'volt second per ampere', 'tesla'], 'tesla', 'It is the unit of magnetic field; the other three are all the same unit, that of inductance.'),
  odd(I(2, 1), ['moving a magnet into a coil', 'turning a coil in a magnetic field', 'changing the current in a nearby coil', 'keeping a steady current in a nearby coil'], 'keeping a steady current in a nearby coil', 'It gives a flux that doesn’t change, so no emf; each of the others changes the flux through the coil.'),

  long(I(5, 2), 'Answer each part on the transformer.\n(a) State the principle on which it works. [1]\n(b) Write the relation between the voltages and the numbers of turns. [1]\n(c) A transformer steps 230 V down to 11.5 V, and has 2000 turns on its primary. Find the turns on its secondary. [1]\n(d) If it is ideal and its secondary gives 4 A, find the primary current. [1]\n(e) Why can’t a transformer work on direct current? [1]', '(a) Mutual induction: a changing current in one coil induces an emf in a coil linked to it.', '(b) Vs/Vp = Ns/Np.', '(c) Ns = 2000 × 11.5/230 = 100.', '(d) VpIp = VsIs, so Ip = 11.5 × 4/230 = 0.2 A.', '(e) A steady current makes a steady flux, which induces no emf in the secondary.'),
  long(I(5, 2), 'Answer each part on mutual induction.\n(a) Define the mutual inductance M of two coils, and give its unit. [1]\n(b) The current in one coil changes at 50 A/s, and M = 0.2 H. Find the emf in the other. [1]\n(c) Why does putting a soft-iron core through both coils raise M? [1]\n(d) Give one device that uses mutual induction. [1]\n(e) What does Lenz’s law say about the direction of the emf in (b)? [1]', '(a) The emf induced in one coil per unit rate of change of current in the other, e = M dI/dt; unit henry.', '(b) e = 0.2 × 50 = 10 V.', '(c) Iron greatly increases the flux, so more of it links the second coil for the same current.', '(d) A transformer, or an induction coil.', '(e) It opposes the change of current in the first coil.'),
  long(I(5, 3), 'A square loop of side 10 cm and resistance 0.5 Ω is pulled at a steady 2 m/s out of a uniform field of 0.5 T, at right angles to its plane.\n(a) Why must a force be applied to keep its speed steady, and where does the work done go? [2]\n(b) Find the induced emf and current while one side is still in the field. [2]\n(c) Find the force needed. [1]', '(a) The induced current, in the side still in the field, feels a force opposing the motion, by Lenz’s law.', '(a) The work done against it becomes heat in the loop’s resistance.', '(b) e = Blv = 0.5 × 0.1 × 2 = 0.1 V.', '(b) I = e/R = 0.1/0.5 = 0.2 A.', '(c) F = BIl = 0.5 × 0.2 × 0.1 = 0.01 N.'),

  tell(I(2, 2), 'Distinguish between a motional emf and the emf induced in a stationary coil by a changing field.', 'A motional emf comes from a conductor moving through a field, cutting field lines; it is Blv for a straight rod.', 'In a stationary coil the field itself changes, so the flux through it changes, with nothing moving.'),
  tell(I(2, 1), 'Distinguish between a step-up and a step-down transformer.', 'A step-up transformer has more turns on its secondary, giving a higher voltage and a smaller current.', 'A step-down transformer has fewer turns on its secondary, giving a lower voltage and a larger current.'),

  match(I(4, 1), [['A transformer', 'mutual induction'], ['An induction cooker', 'eddy currents'], ['A spark at a switch as a coil’s current is cut off', 'self-induction'], ['A magnet slowed as it falls through a copper pipe', 'Lenz’s law']]),
  match(I(4, 1), [['Magnetic flux', 'weber'], ['Self-inductance', 'henry'], ['Induced emf', 'volt'], ['Magnetic field', 'tesla']]),
  match(I(4, 2), [['Faraday’s first law', 'a changing flux induces an emf'], ['Faraday’s second law', 'the emf equals the rate of change of flux linkage'], ['Lenz’s law', 'the induced current opposes the change causing it'], ['Fleming’s right-hand rule', 'the direction of the current in a moving conductor']]),

  ar(I(1, 1), 'An emf is induced in a coil only while the flux through it is changing.', 'Faraday’s law gives the emf as the rate of change of flux linkage.', 1, 'A steady flux, however large, has no rate of change.'),
  ar(I(1, 1), 'A transformer can step up a steady direct voltage.', 'A transformer works by mutual induction.', 4, 'A steady current gives no change of flux, so a transformer can’t work on it.'),
];

export default questions;
