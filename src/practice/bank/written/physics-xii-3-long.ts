// Written by hand: moving charges and magnetism, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('physics', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on the Biot–Savart law.\n(a) State the Biot–Savart law. [2]\n(b) Use it to find the field at the centre of a circular loop of radius R carrying current I. [2]\n(c) How does the field change if the loop has N turns? [1]', '(a) The field dB from a small element dl carrying I is (μ₀/4π)(I dl sin θ)/r².', '(a) Its direction is that of dl × r̂.', '(b) Every element is at distance R and at right angles to r, so dB = (μ₀/4π) I dl/R², all in the same direction.', '(b) Adding round the loop, B = (μ₀/4π) I × 2πR/R² = μ₀I/2R.', '(c) It becomes N times as large: μ₀NI/2R.'),
  long(A(5, 2), 'Answer each part on a charged particle in a magnetic field.\n(a) Show that a charge moving at right angles to a uniform field moves in a circle, and find its radius. [3]\n(b) Show that its period doesn’t depend on its speed. [2]', '(a) The force qvB is always at right angles to the velocity, so it changes only the direction.', '(a) This gives uniform circular motion, with qvB = mv²/r.', '(a) So r = mv/qB.', '(b) T = 2πr/v = 2πm/qB.', '(b) v cancels, so the period is the same at every speed.'),
  long(A(5, 2), 'Answer each part on the moving coil galvanometer.\n(a) Explain why the coil turns when a current flows, and what stops it. [2]\n(b) Why is the field made radial? [1]\n(c) Show that the deflection is proportional to the current. [2]', '(a) The field exerts a torque NIAB on the coil.', '(a) A spring gives an opposing torque kθ, and the coil settles where they balance.', '(b) So the plane of the coil is always along the field, and the torque is NIAB at every angle.', '(c) At balance, NIAB = kθ.', '(c) So θ = (NAB/k) I, proportional to I.'),
  long(A(5, 3), 'Answer each part on the force between parallel wires.\n(a) Show that the force per unit length between two long parallel wires is μ₀I₁I₂/2πd. [3]\n(b) Use it to define the ampere. [2]', '(a) Wire 1 makes a field B₁ = μ₀I₁/2πd at wire 2.', '(a) A length l of wire 2 feels F = B₁I₂l, so F/l = μ₀I₁I₂/2πd.', '(a) Like currents attract, and unlike ones repel.', '(b) One ampere is the current which, flowing in each of two long parallel wires 1 m apart in vacuum,', '(b) makes each feel a force of 2 × 10⁻⁷ N per metre of length.'),
];

export default questions;
