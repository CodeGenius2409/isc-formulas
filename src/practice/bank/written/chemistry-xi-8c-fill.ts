// Written by hand: electronic effects and types of reaction, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const E = at(8, 'c');

/** One resonance form of the ethanoate ion, with its carbon at (x, 80); top says whether the upper C–O bond is the double one. */
const ethanoate = (x: number, top: boolean): SketchMark[] => [
  label(x - 44, 84, 'CH₃', 'end'), line([[x - 40, 80], [x - 8, 80]]), label(x, 85, 'C'),
  line([[x + 4, 72], [x + 22, 46]]), ...(top ? [line([[x + 10, 76], [x + 28, 50]])] : []), label(x + 30, 42, top ? 'O' : 'O⁻', 'start'),
  line([[x + 4, 88], [x + 22, 114]]), ...(top ? [] : [line([[x + 10, 84], [x + 28, 110]])]), label(x + 30, 128, top ? 'O⁻' : 'O', 'start'),
];

const questions: BankDef[] = [
  figure(E(3, 2), 'Draw the two resonance structures of the ethanoate ion, CH₃COO⁻, and use them to explain why its two C–O bonds are the same length.', ['In one structure the upper C–O bond is double and the lower oxygen carries the negative charge; in the other it is the other way round.', 'They are joined by a double-headed arrow: the real ion is a hybrid of the two, not either one.', 'The π electrons and the charge are spread over both oxygens, so both C–O bonds are the same, between single and double.'], {
    answer: sketch(360, 150, 'Two structures side by side, joined by a double-headed arrow. Left: CH3 joined to C, which has a double bond up to O and a single bond down to O minus. Right: CH3 joined to C, with a single bond up to O minus and a double bond down to O.', [
      ...ethanoate(100, true), arrow([170, 84], [196, 84]), arrow([180, 84], [154, 84]), ...ethanoate(280, false),
    ]),
  }),
  figure(E(3, 1), 'Make a table comparing homolytic and heterolytic fission of a bond A–B, giving an equation and the kind of products for each.', ['Homolytic: A–B → A• + B•, each atom keeping one electron of the pair.', 'It gives free radicals, and happens with heat or light, often in non-polar conditions.', 'Heterolytic: A–B → A⁺ + B⁻, the more electronegative atom taking both electrons, giving ions such as carbocations and carbanions.'], {
    answer: table(['Fission', 'Equation', 'Products', 'Favoured by'], [['Homolytic', 'A–B → A• + B•', 'free radicals', 'heat or light, non-polar conditions'], ['Heterolytic', 'A–B → A⁺ + B⁻', 'ions: carbocations or carbanions', 'polar solvents, a polar bond']]),
  }),
  figure(E(3, 2), 'The figure shows the partial charges along the chain of 1-chloropropane. Explain them, and why the effect fades along the chain.', ['Chlorine is more electronegative than carbon, so it pulls the electrons of the C–Cl bond towards itself, taking a partial negative charge, δ−, and leaving C-1 with δ+.', 'C-1 then pulls a little on the electrons of the C1–C2 bond, giving C-2 a smaller charge, δδ+, and so on: the inductive effect.', 'Each step passes on only part of the pull, so the effect is very small beyond the third carbon.'], {
    shown: sketch(340, 110, 'A chain C3–C2–C1–Cl. Above each atom its partial charge: δδδ+ over C3, δδ+ over C2, δ+ over C1 and δ− over Cl. Small arrows on the bonds point towards chlorine.', [
      label(50, 70, 'C3'), label(130, 70, 'C2'), label(210, 70, 'C1'), label(290, 70, 'Cl'),
      arrow([64, 66], [114, 66]), arrow([144, 66], [194, 66]), arrow([224, 66], [274, 66]),
      label(50, 40, 'δδδ+'), label(130, 40, 'δδ+'), label(210, 40, 'δ+'), label(290, 40, 'δ−'),
    ]),
  }),

  predict(E(2, 2), 'Predict which is the stronger acid, fluoroethanoic acid, FCH₂COOH, or chloroethanoic acid, ClCH₂COOH, and why.', 'Fluoroethanoic acid is stronger.', 'Fluorine is more electronegative, so its −I effect pulls electrons more strongly, spreading the negative charge of the anion and stabilising it.'),
  predict(E(2, 2), 'Predict which carbocation is more stable, CH₃CH₂⁺ or CH₂=CH–CH₂⁺, and why.', 'CH₂=CH–CH₂⁺, the allyl cation.', 'Its positive charge is spread by resonance over two carbons, CH₂=CH–CH₂⁺ ↔ ⁺CH₂–CH=CH₂.'),
  predict(E(2, 1), 'Predict whether ammonia acts as an electrophile or a nucleophile, and why.', 'As a nucleophile.', 'Its nitrogen has a lone pair, which it can give to an electron-poor centre.'),

  odd(E(2, 1), ['H₂O', 'NH₃', 'OH⁻', 'BF₃'], 'BF₃', 'It is an electrophile, short of electrons; the others are nucleophiles, with lone pairs to give.'),
  odd(E(2, 1), ['substitution', 'addition', 'elimination', 'hyperconjugation'], 'hyperconjugation', 'It is an electronic effect; the others are types of organic reaction.'),
  odd(E(2, 2), ['–NO₂', '–CN', '–COOH', '–CH₃'], '–CH₃', 'It shows a +I effect, pushing electrons; the others show a −I effect.'),

  long(E(5, 2), 'Name the type of each reaction, and give a reason.\n(a) CH₃CH₂Cl + CN⁻ → CH₃CH₂CN + Cl⁻ [1]\n(b) CH≡CH + 2H₂ → CH₃CH₃ [1]\n(c) (CH₃)₃CBr → (CH₃)₂C=CH₂ + HBr [1]\n(d) CH₃CH₂CH₂CH₂CH₃ → (CH₃)₂CHCH₂CH₃, over a catalyst [1]\n(e) Which species is the nucleophile in (a)? [1]', '(a) Substitution: Cl is replaced by CN.', '(b) Addition: hydrogen adds across the triple bond, leaving a saturated product.', '(c) Elimination: HBr is removed from neighbouring carbons, forming a double bond.', '(d) Rearrangement: the atoms are rearranged into an isomer, with nothing added or removed.', '(e) CN⁻, which gives a lone pair to the carbon.'),
  long(E(5, 3), 'Answer each part on electronic effects.\n(a) What is the electromeric effect, and how does it differ from the inductive effect? [2]\n(b) What is hyperconjugation, and how does it make the ethyl cation more stable than the methyl cation? [2]\n(c) Why is the electromeric effect called temporary? [1]', '(a) The electromeric effect is the complete shift of a π electron pair of a multiple bond to one atom, when an attacking reagent comes near.', '(a) The inductive effect is a partial, permanent shift of σ electrons along a chain, present without any reagent.', '(b) Hyperconjugation is the spreading of the σ electrons of a C–H bond into a next-door empty p orbital or π bond.', '(b) The ethyl cation has three C–H bonds next to the positive carbon to spread its charge this way; the methyl cation has none.', '(c) It lasts only while the reagent is present; the electrons go back when it is removed.'),

  tell(E(2, 1), 'Distinguish between a carbocation and a carbanion, with an example of each.', 'A carbocation has a carbon with only six electrons and a positive charge, such as CH₃⁺; it is planar and an electrophile.', 'A carbanion has a carbon with a lone pair and a negative charge, such as CH₃⁻; it is pyramidal and a nucleophile.'),
  tell(E(2, 2), 'Distinguish between the inductive effect and the electromeric effect.', 'The inductive effect is a permanent, partial shift of σ electrons along a chain, caused by a more electronegative atom.', 'The electromeric effect is a temporary, complete shift of π electrons in a multiple bond, caused by an attacking reagent.'),
  tell(E(2, 1), 'Distinguish between the +I and −I effects, with one group showing each.', 'A group with a +I effect pushes electrons towards the chain, such as –CH₃.', 'A group with a −I effect pulls electrons away from the chain, such as –Cl or –NO₂.'),

  match(E(4, 2), [['CH₃⁺', 'carbocation, sp² and planar'], ['CH₃⁻', 'carbanion, sp³ and pyramidal'], ['CH₃•', 'free radical, with an unpaired electron'], ['NO₂⁺', 'electrophile in nitration']]),
  match(E(4, 2), [['The inductive effect', 'a permanent shift of σ electrons along a chain'], ['The electromeric effect', 'a temporary shift of π electrons when a reagent attacks'], ['Resonance', 'the spreading of π electrons or lone pairs over several atoms'], ['Hyperconjugation', 'the spreading of the σ electrons of C–H bonds']]),
  match(E(4, 1), [['CH₃Br + OH⁻ → CH₃OH + Br⁻', 'substitution'], ['CH₂=CH₂ + Br₂ → CH₂BrCH₂Br', 'addition'], ['CH₃CH₂OH → CH₂=CH₂ + H₂O', 'elimination'], ['n-butane → isobutane', 'rearrangement']]),

  reason(E(2, 2), 'Give reasons. (a) A tertiary free radical is more stable than a primary one. (b) Groups with a −I effect stabilise a carbanion.', '(a) Its three alkyl groups release electrons by +I and hyperconjugation, making up for the carbon’s missing electron.', '(b) They pull electron density away from the negative carbon, spreading the charge.'),
  reason(E(2, 2), 'Give reasons. (a) The two C–O bonds of the ethanoate ion are the same length. (b) The inductive effect is very small beyond the third carbon of a chain.', '(a) The ion is a resonance hybrid, with the double bond and the charge shared equally between the two oxygens.', '(b) Each bond passes on only part of the electron shift, so it dies away quickly along the chain.'),
  reason(E(2, 2), 'Give reasons. (a) Methylamine is a stronger base than ammonia. (b) Ethanoic acid is a weaker acid than methanoic acid.', '(a) The +I effect of the methyl group pushes electrons onto the nitrogen, making its lone pair more available.', '(b) The +I effect of the methyl group makes the ethanoate ion’s negative charge more concentrated, and so less stable.'),

  short(E(2, 1), 'Write an equation for the homolytic fission of Cl₂ and for the heterolytic fission of HBr.', 'Homolytic, in light or heat: Cl₂ → 2Cl•.', 'Heterolytic: HBr → H⁺ + Br⁻, the bromine taking both electrons.'),

  ar(E(1, 1), 'CH₃⁺ is planar.', 'Its carbon is sp² hybridised.', 1, 'Three sp² orbitals lie at 120° in one plane, with an empty p orbital at right angles to it.'),
  ar(E(1, 1), 'The –NO₂ group shows a +I effect.', 'Nitrogen and oxygen are more electronegative than carbon.', 4, 'It pulls electrons away, a −I effect, because of what R says.'),
];

export default questions;
