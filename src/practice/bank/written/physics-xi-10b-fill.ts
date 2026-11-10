// Written by hand: waves, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const W = at(10, 'b');

/** A closed pipe from x = 50 (closed) to x = 290 (open), centred at height y, with the displacement envelope of harmonic n (1, 3 or 5): a node at the closed end and an antinode at the open end. */
const pipe = (y: number, n: number, f: string): SketchMark[] => {
  const env = (s: 1 | -1) => `M${Array.from({ length: 49 }, (_, i) => {
    const x = 50 + i * 5;
    return `${x} ${Math.round((y + s * 14 * Math.sin((n * Math.PI * (x - 50)) / 480)) * 10) / 10}`;
  }).join(' L')}`;
  return [
    line([[50, y - 20], [290, y - 20]]), line([[50, y + 20], [290, y + 20]]), line([[50, y - 20], [50, y + 20]]),
    { t: 'path', d: env(1) }, { t: 'path', d: env(-1) },
    label(44, y + 4, 'N', 'end'), label(298, y + 4, 'A', 'start'), label(318, y + 4, f, 'start'),
  ];
};

/** A string from x = 110 to 340 at height y, with an upward bump centred at a and a downward one at b. */
const pulses = (y: number, up: number, down: number): SketchMark => ({
  t: 'path',
  d: `M110 ${y} L${Math.min(up, down) - 20} ${y} Q${Math.min(up, down)} ${up < down ? y - 40 : y + 40} ${Math.min(up, down) + 20} ${y} L${Math.max(up, down) - 20} ${y} Q${Math.max(up, down)} ${up < down ? y + 40 : y - 40} ${Math.max(up, down) + 20} ${y} L340 ${y}`,
});

const questions: BankDef[] = [
  figure(W(3, 2), 'Draw the first three modes of vibration of the air in a pipe closed at one end, marking the nodes and antinodes, and give the frequency of each in terms of the speed of sound v and the length L.', ['There is always a node at the closed end and an antinode at the open end.', 'The pipe holds λ/4, 3λ/4 and 5λ/4 in turn.', 'So the frequencies are v/4L, 3v/4L and 5v/4L: only odd harmonics.'], {
    answer: sketch(380, 210, 'Three pipes, one above another, each closed at the left end and open at the right. In each, two curves show how far the air moves along the pipe: they meet at a node, N, at the closed end, and are widest at an antinode, A, at the open end. The top pipe holds a quarter of a wave, frequency v/4L; the middle one three quarters, with one more node inside, frequency 3v/4L; the bottom one five quarters, with two more nodes inside, frequency 5v/4L.', [
      ...pipe(35, 1, 'v/4L'), ...pipe(105, 3, '3v/4L'), ...pipe(175, 5, '5v/4L'),
    ]),
  }),
  figure(W(3, 1), 'The graph shows the shape of a string carrying a wave of frequency 50 Hz at one instant. Read off the amplitude and the wavelength, and find the speed of the wave.', ['The amplitude is 2 cm, the greatest displacement.', 'The wavelength is 80 cm, the distance from one crest to the next, at 20 cm and 100 cm.', 'v = fλ = 50 × 0.8 = 40 m/s.'], {
    shown: graph('distance along the string (cm)', 'displacement (cm)', [{ points: plot((x) => 2 * Math.sin((2 * Math.PI * x) / 80), 0, 160, 64) }], { x: [[20, '20'], [60, '60'], [100, '100'], [140, '140']], y: [[2, '2'], [-2, '−2']] }),
  }),
  figure(W(2, 2), 'Two equal pulses, one upwards and one downwards, travel towards each other along a string. Sketch the string before they meet, at the moment they overlap exactly, and after they have passed, and state the principle that explains it.', ['When the pulses overlap, their displacements add; being equal and opposite, they cancel, and the string is straight for that moment.', 'Afterwards each pulse goes on unchanged, as if the other had not been there: the principle of superposition.'], {
    answer: sketch(350, 270, 'Three views of a string, one above another. Before: an upward pulse on the left moves right, and a downward pulse on the right moves left. As they overlap: the string is straight. After: the downward pulse is on the left, moving left, and the upward pulse is on the right, moving right.', [
      label(10, 49, 'before', 'start'), pulses(45, 170, 280), line([[155, 15], [185, 15]], { arrow: 1 }), line([[295, 75], [265, 75]], { arrow: 1 }),
      label(10, 139, 'overlapping', 'start'), line([[110, 135], [340, 135]]),
      label(10, 229, 'after', 'start'), pulses(225, 280, 170), line([[185, 255], [155, 255]], { arrow: 1 }), line([[265, 195], [295, 195]], { arrow: 1 }),
    ]),
  }),

  predict(W(2, 2), 'The closed end of a pipe closed at one end is opened. Predict what happens to its fundamental frequency, and to the harmonics it can give.', 'The fundamental doubles, from v/4L to v/2L, as the pipe now holds half a wavelength instead of a quarter.', 'It can now give all the harmonics, even as well as odd.'),
  predict(W(2, 2), 'Tuning forks of 256 Hz and 260 Hz are sounded together. Predict what is heard, and what changes if the 260 Hz fork is loaded with a little wax.', 'The loudness rises and falls 4 times a second: 4 beats per second.', 'Wax lowers the second fork’s frequency towards 256 Hz, so the beats become slower.'),
  predict(W(2, 3), 'A wave travels along a light string into a heavier string joined to it, under the same tension. Predict what happens to its frequency, speed and wavelength in the heavier string.', 'The frequency stays the same, as it is set by the source.', 'The speed, √(T/μ), falls as μ is larger, so the wavelength, v/f, becomes shorter.'),

  odd(W(2, 1), ['sound in air', 'a wave sent along a slinky by pushing its end', 'ultrasound in water', 'a wave on a plucked guitar string'], 'a wave on a plucked guitar string', 'It is transverse; the others are longitudinal.'),
  odd(W(2, 2), ['the fundamental of a closed pipe', 'its third harmonic', 'its fifth harmonic', 'its fourth harmonic'], 'its fourth harmonic', 'A closed pipe can’t give it, as it gives only odd harmonics.'),
  odd(W(2, 1), ['a node', 'an antinode', 'a loop', 'a compression'], 'a compression', 'It belongs to a progressive longitudinal wave; the others describe a stationary wave.'),

  long(W(5, 2), 'A progressive wave is given by y = 0.05 sin(20πt − 0.5πx), in SI units.\n(a) Find its amplitude, frequency and wavelength. [3]\n(b) Find its speed, and give its direction. [1]\n(c) Find the phase difference between two points 1 m apart along it. [1]', '(a) The amplitude is 0.05 m.', '(a) ω = 20π rad/s, so f = ω/2π = 10 Hz.', '(a) k = 0.5π rad/m, so λ = 2π/k = 4 m.', '(b) v = fλ = 40 m/s, in the +x direction.', '(c) Δφ = kΔx = 0.5π × 1 = π/2 rad.'),
  long(W(5, 2), 'A string 1.2 m long is fixed at both ends, and waves travel along it at 240 m/s.\n(a) How does a stationary wave form on it? [1]\n(b) Find the frequencies of its first three harmonics. [3]\n(c) Find the distance between two neighbouring nodes in the third harmonic. [1]', '(a) Waves reflected from the fixed ends travel back and overlap the waves going out, and at the right frequencies they add up to a stationary wave.', '(b) The fundamental has a node at each end, so L = λ/2 and f₁ = v/2L = 240/2.4 = 100 Hz.', '(b) The harmonics are whole-number multiples of it.', '(b) So 100 Hz, 200 Hz and 300 Hz.', '(c) In the third harmonic λ = 2L/3 = 0.8 m, and nodes are λ/2 = 0.4 m apart.'),
  long(W(5, 3), 'Answer each part on beats.\n(a) What are beats, and how do they arise? [2]\n(b) A fork A of 384 Hz and a fork B give 4 beats per second. When B is loaded with a little wax, they give 6 beats per second. Find the frequency of B. [2]\n(c) What is the beat frequency of two notes of 300 Hz and 330 Hz, and why aren’t these beats heard as beats? [1]', '(a) Beats are a regular rise and fall in the loudness of two notes of nearly equal frequency sounded together.', '(a) The waves drift in and out of step, so they add up to a large amplitude and then cancel, again and again.', '(b) B is 380 Hz or 388 Hz. Wax lowers B’s frequency.', '(b) The beats became faster, so B moved away from 384 Hz; it must have been below it: 380 Hz.', '(c) 30 per second, which is too fast for the ear to follow as separate changes in loudness.'),

  tell(W(2, 2), 'Distinguish between a harmonic and an overtone, using a closed pipe as an example.', 'A harmonic is a frequency that is a whole-number multiple of the fundamental: the fundamental is the first harmonic.', 'An overtone is any note above the fundamental that the pipe can give: for a closed pipe, the first overtone is the third harmonic.'),
  tell(W(2, 2), 'Distinguish between the reflection of a wave on a string at a fixed end and at a free end.', 'At a fixed end the reflected wave is inverted, with a phase change of π, and there is a node at the end.', 'At a free end it comes back the same way up, with no phase change, and there is an antinode at the end.'),

  match(W(4, 2), [['A closed pipe of length L', 'fundamental v/4L'], ['An open pipe of length L', 'fundamental v/2L, with antinodes at the ends'], ['A string of length L fixed at both ends', 'fundamental v/2L, with nodes at the ends'], ['Two notes of frequencies f₁ and f₂', 'f₁ − f₂ beats per second']]),
  match(W(4, 1), [['A in y = A sin(ωt − kx)', 'the amplitude'], ['ω', 'the angular frequency, 2πf'], ['k', 'the wave number, 2π/λ'], ['ω/k', 'the speed of the wave']]),
  match(W(4, 2), [['Reflection at a fixed end', 'a phase change of π'], ['Reflection at a free end', 'no phase change'], ['Two waves meeting in step', 'a larger displacement'], ['Two equal waves meeting exactly out of step', 'no displacement']]),

  ar(W(1, 2), 'Doubling the frequency of a wave on a given stretched string halves its wavelength.', 'The speed of the wave depends only on the tension and the mass per unit length.', 1, 'As v stays the same, λ = v/f halves when f doubles.'),
  ar(W(1, 1), 'Sound waves in air are longitudinal.', 'Sound travels faster in solids than in air.', 2, 'Both are true, but the speed in solids doesn’t explain why sound in air is longitudinal: air has no rigidity, so only compressions can travel through it.'),
  ar(W(1, 1), 'At a node of a stationary wave, the particles vibrate with the largest amplitude.', 'At a node, the two waves forming the stationary wave always cancel.', 4, 'As they cancel, the particles at a node don’t move at all; the largest amplitude is at an antinode.'),

  derive(W(3, 2), 'Show that a string of length L fixed at both ends can vibrate only at the frequencies fₙ = nv/2L, where v is the wave speed and n = 1, 2, 3, ….', ['Each fixed end must be a node, and neighbouring nodes are λ/2 apart.', 1], ['So the string holds a whole number of half wavelengths: L = nλ/2, giving λ = 2L/n.', 1], ['f = v/λ, so fₙ = nv/2L.', 1]),
  derive(W(3, 3), 'Two sound waves of equal amplitude a and frequencies f₁ and f₂, close together, reach the ear. By adding them, show that the beat frequency is f₁ − f₂.', ['y = a sin 2πf₁t + a sin 2πf₂t = 2a cos π(f₁ − f₂)t × sin π(f₁ + f₂)t.', 1], ['This is a note of frequency (f₁ + f₂)/2 whose amplitude, 2a cos π(f₁ − f₂)t, rises and falls slowly.', 1], ['The amplitude is greatest whenever cos π(f₁ − f₂)t = ±1, which happens f₁ − f₂ times a second, so there are f₁ − f₂ beats per second.', 1]),
];

export default questions;
