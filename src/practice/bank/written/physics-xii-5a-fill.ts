// Written by hand: electromagnetic waves, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import type { SketchMark } from '../diagram';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XII');
const W = at(5, 'a');

/** Two wavelengths of a sine along the axis, displaced by (dx, dy) at each crest. */
const wave = (dx: number, dy: number, dash?: 1): SketchMark => line(Array.from({ length: 41 }, (_, i): [number, number] => { const s = Math.sin((i * Math.PI) / 10); return [Math.round((20 + 7 * i + dx * s) * 10) / 10, Math.round((90 - dy * s) * 10) / 10]; }), dash ? { dash } : {});

/** The spectrum as a bar of seven cells, lowest frequency on the left. */
const bar: SketchMark[] = [
  { t: 'box', x: 4, y: 40, w: 322, h: 30 },
  ...[50, 96, 142, 188, 234, 280].map((x) => line([[x, 40], [x, 70]])),
  arrow([60, 22], [270, 22]), label(165, 14, 'frequency increases'),
];

const questions: BankDef[] = [
  figure(W(2, 2), 'Draw an electromagnetic wave travelling along the x-axis, showing its electric and magnetic fields.', ['E and B are sine curves at right angles to each other and to the direction of travel, which is what makes the wave transverse.', 'They are in phase: both reach their peaks and zeros at the same places.'], {
    answer: sketch(320, 180, 'An axis runs left to right, the direction of travel. A solid sine curve rises and falls in the vertical plane, labelled E. A dashed sine curve, drawn sloping out of the page, is labelled B. Their crests and zeros line up.', [
      arrow([20, 90], [310, 90]), wave(0, 40), wave(-16, -16, 1),
      label(55, 42, 'E'), label(38, 124, 'B'), label(305, 172, 'direction of travel', 'end'),
    ]),
  }),
  figure(W(3, 1), 'The figure shows the electromagnetic spectrum in order of rising frequency, with three parts lettered. Name P, Q and R, and give one use of each.', ['P is microwaves, used in radar or in microwave ovens.', 'Q is ultraviolet, used to sterilise water or instruments.', 'R is gamma rays, used to treat cancer or to sterilise medical equipment.'], {
    shown: sketch(330, 120, 'A bar divided into seven parts, with an arrow above showing frequency increasing to the right. Under the parts, from left to right: radio, P, infrared, visible, Q, X-rays, R.', [
      ...bar,
      label(27, 90, 'radio'), label(73, 108, 'P'), label(119, 90, 'infrared'), label(165, 108, 'visible'), label(211, 90, 'Q'), label(257, 108, 'X-rays'), label(303, 90, 'R'),
    ]),
    answer: sketch(330, 120, 'The same bar with every part named: radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays.', [
      ...bar,
      label(27, 90, 'radio'), label(73, 108, 'microwaves'), label(119, 90, 'infrared'), label(165, 108, 'visible'), label(211, 90, 'ultraviolet'), label(257, 108, 'X-rays'), label(303, 90, 'γ rays'),
    ]),
  }),
  figure(W(2, 2), 'Draw a parallel-plate capacitor being charged, and show where there is conduction current and where there is displacement current.', ['Conduction current I flows in the wires on both sides, bringing charge to the plates.', 'Between the plates the electric field is changing, which is a displacement current ε₀ dΦ/dt, Φ being the electric flux; it equals I, so the current is continuous.'], {
    answer: sketch(320, 158, 'Two vertical plates with a gap between them, marked +q and −q. Wires lead to each plate, with arrows marked I. In the gap, dashed arrows show the changing electric field, labelled as the displacement current.', [
      line([[20, 75], [150, 75]]), line([[170, 75], [300, 75]]), line([[150, 40], [150, 110]]), line([[170, 40], [170, 110]]),
      arrow([60, 75], [100, 75]), label(80, 66, 'I'), arrow([220, 75], [260, 75]), label(240, 66, 'I'),
      line([[153, 55], [167, 55]], { dash: 1, arrow: 1 }), line([[153, 75], [167, 75]], { dash: 1, arrow: 1 }), line([[153, 95], [167, 95]], { dash: 1, arrow: 1 }),
      label(140, 34, '+q', 'end'), label(180, 34, '−q', 'start'), label(160, 126, 'changing E'), label(160, 144, 'displacement current'),
    ]),
  }),

  predict(W(2, 2), 'A charge oscillates up and down at 10¹⁰ Hz. Predict whether it sends out electromagnetic waves, which part of the spectrum they belong to, and the direction of their electric field to the side.', 'It radiates, as an oscillating charge is accelerating; λ = c/f = 3 cm, so the waves are microwaves.', 'To the side, the electric field is vertical, along the line in which the charge oscillates.'),
  predict(W(2, 1), 'The frequency of an electromagnetic wave in vacuum is doubled. Predict what happens to its speed and its wavelength.', 'Its speed stays c, as every electromagnetic wave travels at c in vacuum.', 'Its wavelength halves, as λ = c/f.'),
  predict(W(2, 2), 'A capacitor is charged by a current I, and then the charging current is halved. Predict what happens to the displacement current between its plates.', 'It halves too.', 'Between the plates the displacement current always equals the conduction current in the wires, as the electric field now changes half as fast.'),

  odd(W(2, 1), ['radio waves', 'microwaves', 'sound waves', 'infrared'], 'sound waves', 'They are mechanical and longitudinal, and need a medium; the others are electromagnetic.'),
  odd(W(2, 2), ['infrared', 'visible light', 'ultraviolet', 'gamma rays'], 'gamma rays', 'They are given off by nuclei; the others come from changes in the energy of atoms or molecules.'),
  odd(W(2, 1), ['radar', 'microwave oven', 'satellite communication', 'sterilising water'], 'sterilising water', 'It uses ultraviolet; the other three use microwaves.'),

  long(W(5, 2), 'Answer each part on displacement current.\n(a) What inconsistency did Maxwell find in Ampere’s circuital law for a capacitor being charged? [2]\n(b) Write Ampere’s law as Maxwell changed it. [1]\n(c) Show that the displacement current between the plates equals the conduction current in the wires. [2]', '(a) A loop round the wire gives a current through a flat surface, but a surface passing between the plates has no conduction current through it.', '(a) So the law gives two different answers for the same loop.', '(b) ∮B·dl = μ₀(I + ε₀ dΦ/dt), where Φ is the electric flux and ε₀ dΦ/dt the displacement current.', '(c) Φ = EA = (q/ε₀A)·A = q/ε₀.', '(c) So the displacement current ε₀ dΦ/dt = dq/dt = I.'),
  long(W(5, 2), 'Answer each part on how electromagnetic waves arise and what they carry.\n(a) Why does an oscillating charge give off electromagnetic waves, but a steady current doesn’t? [2]\n(b) What is it about these waves that is transverse? [1]\n(c) Give two everyday examples showing that electromagnetic waves carry energy. [2]', '(a) An accelerating charge makes a changing electric field, which makes a changing magnetic field, and each keeps regenerating the other as a wave.', '(a) A steady current makes fields that don’t change, so nothing travels outward.', '(b) The electric and magnetic fields are both at right angles to the direction of travel.', '(c) Sunlight warms the Earth.', '(c) Microwaves heat food, or a solar cell gives a current.'),
  long(W(5, 3), 'Answer each part on the spectrum.\n(a) Arrange microwaves, gamma rays, visible light and radio waves in order of rising frequency. [1]\n(b) Give the approximate range of wavelengths of visible light and of X-rays. [2]\n(c) Why can ultraviolet cause sunburn, while radio waves can’t, however long the exposure? [2]', '(a) Radio waves, microwaves, visible light, gamma rays.', '(b) Visible light: about 400 nm to 700 nm.', '(b) X-rays: about 1 nm down to 10⁻³ nm.', '(c) Ultraviolet has a much higher frequency, so each photon carries enough energy to damage molecules in skin cells.', '(c) A radio photon carries far too little energy for that, however many arrive.'),

  tell(W(2, 1), 'Distinguish between radio waves and microwaves, by wavelength and by use.', 'Radio waves are longer than about 0.1 m; microwaves run from about 0.1 m down to 1 mm.', 'Radio waves carry broadcasts; microwaves are used for radar and for cooking.'),
  tell(W(2, 2), 'Distinguish between ultraviolet rays and X-rays, by how each is produced and one use.', 'Ultraviolet comes from very hot bodies such as the Sun, or from gas discharge lamps; X-rays come from fast electrons striking a metal target.', 'Ultraviolet sterilises water; X-rays show bones and fractures.'),

  match(W(4, 1), [['Radio waves', 'longer than about 0.1 m'], ['Microwaves', 'about 0.1 m down to 1 mm'], ['Visible light', 'about 700 nm down to 400 nm'], ['X-rays', 'about 1 nm down to 10⁻³ nm']]),
  match(W(4, 2), [['Radio waves', 'electrons accelerated in an aerial'], ['Microwaves', 'a magnetron or klystron valve'], ['X-rays', 'fast electrons hitting a metal target'], ['Gamma rays', 'the decay of radioactive nuclei']]),
  match(W(4, 2), [['Radio waves', 'the aerial of a receiver'], ['Microwaves', 'a point-contact diode'], ['Infrared', 'a thermopile or bolometer'], ['Visible light', 'the human eye']]),

  ar(W(1, 2), 'There is a displacement current between the plates of a capacitor only while it is charging or discharging.', 'Displacement current is proportional to the rate of change of electric flux.', 1, 'When the charge is steady the flux doesn’t change, so there is no displacement current.'),
  ar(W(1, 2), 'X-rays are used to study the arrangement of atoms in crystals.', 'X-rays are produced when fast electrons strike a metal target.', 2, 'Both are true, but X-rays suit crystals because their wavelength is close to the spacing of the atoms.'),
  ar(W(1, 1), 'Ultraviolet rays can cause sunburn.', 'Ultraviolet rays have a longer wavelength than visible light.', 3, 'Ultraviolet has a shorter wavelength, and so more energy per photon, than visible light.'),
];

export default questions;
