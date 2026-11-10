// Written by hand: chemical kinetics, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on first-order reactions.\n(a) Write the integrated rate equation for a first-order reaction. [1]\n(b) Show that its half-life is 0.693/k. [2]\n(c) A first-order reaction has k = 0.0693 min⁻¹. How long does it take to be 75% complete? [2]', '(a) k = (2.303/t) log([A]₀/[A]).', '(b) At t½, [A] = [A]₀/2, so k = (2.303/t½) log 2.', '(b) t½ = 2.303 × 0.301/k = 0.693/k.', '(c) t½ = 0.693/0.0693 = 10 min.', '(c) 75% done is two half-lives: 20 min.'),
  long(A(5, 2), 'Answer each part on zero-order reactions.\n(a) Write its rate law and integrated rate equation. [2]\n(b) Show that its half-life is [A]₀/2k. [1]\n(c) Give an example, and say why it is zero order. [2]', '(a) Rate = k, which doesn’t depend on concentration.', '(a) [A] = [A]₀ − kt.', '(b) At t½, [A]₀/2 = [A]₀ − kt½, so t½ = [A]₀/2k.', '(c) Ammonia decomposing on hot platinum at high pressure.', '(c) The metal surface is fully covered, so the rate is fixed by the surface, not by how much gas there is.'),
  long(A(5, 2), 'Answer each part on finding the order of a reaction.\n(a) The table gives initial rates for A + B → products. Find the order in A and in B, and the rate law.\n[A] 0.1, [B] 0.1: rate 2 × 10⁻³\n[A] 0.2, [B] 0.1: rate 4 × 10⁻³\n[A] 0.1, [B] 0.2: rate 8 × 10⁻³ [3]\n(b) Find k, with units. [2]', '(a) Doubling [A] doubles the rate: first order in A.', '(a) Doubling [B] makes the rate four times: second order in B.', '(a) Rate = k[A][B]², third order overall.', '(b) k = 2 × 10⁻³ / (0.1 × 0.01) = 2.', '(b) Units: L² mol⁻² s⁻¹, taking the rates in mol L⁻¹ s⁻¹.'),
  long(A(5, 3), 'Answer each part on order and molecularity.\n(a) Give three differences between order and molecularity. [3]\n(b) Why does hydrolysis of an ester in a large excess of water behave as first order? [2]', '(a) Order is found by experiment; molecularity comes from the mechanism of one step.', '(a) Order can be zero or a fraction; molecularity is a whole number, 1, 2 or 3.', '(a) Order applies to the overall reaction; molecularity to each elementary step.', '(b) Water is in such excess that its concentration hardly changes.', '(b) So the rate depends only on the ester: it is pseudo first order.'),
];

export default questions;
