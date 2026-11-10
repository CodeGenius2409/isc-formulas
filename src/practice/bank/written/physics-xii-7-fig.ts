// Written by hand: dual nature of radiation and matter, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, plot } from '../figures';

const { figure } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  figure(A(2, 1), 'Draw a graph of the photoelectric current against the anode potential, for two different intensities of the same light.', ['Both curves level off at saturation, and the brighter light gives the higher saturation current.', 'Both fall to zero at the same stopping potential, as the frequency is the same.'], {
    answer: graph('anode potential', 'photoelectric current', [{ label: 'bright', points: [[-2, 0], ...plot((v) => 4 * (1 - Math.exp(-(v + 2))), -2, 6, 24)] }, { label: 'dim', points: [[-2, 0], ...plot((v) => 2 * (1 - Math.exp(-(v + 2))), -2, 6, 24)] }], { x: [[-2, '−V₀']] }),
  }),
  figure(A(2, 2), 'Draw a graph of the photoelectric current against the anode potential for two frequencies ν₁ > ν₂ of light of the same intensity.', ['The higher frequency has the larger stopping potential, so its curve meets the axis further left.', 'Both reach the same saturation current, as the intensity is the same.'], {
    answer: graph('anode potential', 'photoelectric current', [{ label: 'ν₁', points: [[-3, 0], ...plot((v) => 3 * (1 - Math.exp(-(v + 3))), -3, 6, 24)] }, { label: 'ν₂', points: [[-1.5, 0], ...plot((v) => 3 * (1 - Math.exp(-1.5 * (v + 1.5))), -1.5, 4, 24)] }], { x: [[-3, '−V₁'], [-1.5, '−V₂']] }),
  }),
  figure(A(3, 2), 'The graph shows the stopping potential V₀ against the frequency ν of the light for a metal. Find the threshold frequency and the work function, and say what the slope gives.', ['The line meets the ν axis at the threshold: ν₀ = 5 × 10¹⁴ Hz.', 'φ = hν₀ = 6.6 × 10⁻³⁴ × 5 × 10¹⁴ = 3.3 × 10⁻¹⁹ J, about 2.1 eV.', 'The slope is h/e.'], {
    shown: graph('frequency ν (×10¹⁴ Hz)', 'stopping potential V₀ (V)', [{ points: [[5, 0], [10, 2.07]] }], { x: [[5, '5'], [10, '10']], y: [[2.07, '2.07']] }),
  }),
  figure(A(2, 3), 'On the same axes, draw the graphs of stopping potential against frequency for two metals with work functions φ₁ < φ₂. What is the same about the two lines?', ['Two parallel straight lines, the one for φ₂ meeting the ν axis at a higher threshold frequency.', 'They have the same slope, h/e, which doesn’t depend on the metal.'], {
    answer: graph('frequency ν', 'stopping potential V₀', [{ label: 'φ₁', points: [[4, 0], [10, 3]] }, { label: 'φ₂', points: [[6, 0], [12, 3]] }]),
  }),
  figure(A(2, 2), 'Draw a graph of the de Broglie wavelength λ of an electron against its momentum p, and against 1/√V for an electron accelerated through V volts.', ['λ = h/p, so λ against p is a hyperbola.', 'λ = h/√(2meV), so λ against 1/√V is a straight line through the origin.'], {
    answer: graph('momentum p, or 1/√V', 'wavelength λ', [{ label: 'against p', points: plot((p) => 4 / p, 0.6, 6, 24) }, { label: 'against 1/√V', points: [[0, 0], [6, 4]] }]),
  }),
];

export default questions;
