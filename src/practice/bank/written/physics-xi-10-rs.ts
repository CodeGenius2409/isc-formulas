// Written by hand: oscillations and waves, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XI');
const A = at(10, 'a');
const B = at(10, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why is the Earth’s spin a periodic motion, but not an oscillation?', 'It repeats, but it doesn’t move to and fro about a mean position.'),
  reason(A(2, 2), 'Why does a pendulum’s period not depend on the mass of its bob?', 'Both the restoring force and the inertia are proportional to the mass.', 'So the mass cancels, and T = 2π√(l/g).'),
  reason(A(2, 2), 'Why is a body in SHM fastest at its mean position?', 'All its energy is kinetic there, as its displacement is zero.', 'v = ω√(A² − x²) is greatest at x = 0.'),
  reason(A(2, 3), 'Why does the formula T = 2π√(l/g) hold only for small swings?', 'It assumes sin θ ≈ θ, which holds only for small angles.', 'Only then is the restoring force proportional to the displacement, which SHM needs.'),
  reason(A(1, 2), 'Why is the acceleration in SHM greatest at the ends of the swing?', 'a = −ω²x, and x is largest at the ends.'),
  short(A(2, 1), 'Define simple harmonic motion.', 'Motion in which the acceleration is proportional to the displacement from a fixed point.', 'It is always directed towards that point: a = −ω²x.'),
  short(A(2, 2), 'Write the displacement of a body in SHM as a function of time, and name each term.', 'x = A sin(ωt + φ).', 'A is the amplitude, ω the angular frequency, and φ the phase constant.'),
  short(A(3, 2), 'Give the kinetic, potential and total energy of a body in SHM at displacement x.', 'K = ½mω²(A² − x²).', 'U = ½mω²x².', 'E = ½mω²A², the same at every point.'),
  short(A(3, 3), 'A spring of constant k has a mass m. Give its period, and say how it changes if the spring is cut in half and the same mass hung on one half.', 'T = 2π√(m/k).', 'Each half has a spring constant 2k.', 'So the period falls by a factor of √2.'),
  short(A(2, 3), 'Define phase in SHM. What is the phase difference between the displacement and the velocity?', 'The phase is the angle ωt + φ, which fixes where the body is in its cycle and which way it moves.', 'The velocity is π/2 ahead of the displacement.'),
  reason(B(1, 1), 'Why can sound be heard around a corner, though light can’t be seen around it?', 'Sound’s wavelength is about the size of a doorway, so it bends around, while light’s is far smaller.'),
  reason(B(2, 2), 'Why does a closed organ pipe give only the odd harmonics?', 'It has a node at the closed end and an antinode at the open end.', 'So only odd numbers of quarter wavelengths fit: λ/4, 3λ/4 and so on.'),
  reason(B(2, 2), 'Why does a pulse on a string come back upside down from a fixed end?', 'The fixed end can’t move, so it pulls back on the string.', 'That gives a phase change of π, so the reflected pulse is inverted.'),
  reason(B(2, 3), 'Why does a stretched string give a higher note when it is tightened?', 'The wave speed on it rises, as v = √(T/μ).', 'The length fixes the wavelength, so a higher speed gives a higher frequency.'),
  reason(B(1, 2), 'Why is a progressive wave said to carry energy, while a standing wave doesn’t?', 'In a standing wave the energy is trapped between the nodes, while a progressive wave carries it along.'),
  short(B(2, 1), 'Define wavelength and the frequency of a wave, and give their link with its speed.', 'Wavelength is the distance between two particles in the same phase; frequency is the number of waves a second.', 'v = fλ.'),
  short(B(2, 2), 'State the principle of superposition of waves.', 'When two waves meet, the displacement at each point is the vector sum of the two.', 'Each wave goes on unchanged after they part.'),
  short(B(3, 2), 'Give three differences between a progressive wave and a standing wave.', 'A progressive wave moves on, and a standing wave stays in place.', 'In a progressive wave, every particle has the same amplitude, while in a standing wave it varies from zero at a node.', 'In a progressive wave the phase changes along the wave, while in a standing wave all particles between two nodes are in phase.'),
  short(B(3, 3), 'Write the equation of a progressive wave moving in the +x direction. Give the meaning of k and ω, and the wave’s speed in terms of them.', 'y = A sin(ωt − kx).', 'k = 2π/λ is the wave number, and ω = 2πf is the angular frequency.', 'v = ω/k.'),
  short(B(2, 3), 'Give the frequencies of the first three modes of an open pipe of length L, with sound speed v.', 'f₁ = v/2L, f₂ = 2v/2L, f₃ = 3v/2L.', 'All the harmonics are present, unlike in a closed pipe.'),
];

export default questions;
