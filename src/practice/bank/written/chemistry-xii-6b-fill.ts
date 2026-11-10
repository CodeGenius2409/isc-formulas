// Written by hand: haloarenes, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import type { SketchMark } from '../diagram';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const H = at(6, 'b');

/** A benzene ring of radius 30 about (cx, cy), with a circle inside. */
const ring = (cx: number, cy: number): SketchMark[] => [
  line([[cx, cy - 30], [cx + 26, cy - 15], [cx + 26, cy + 15], [cx, cy + 30], [cx - 26, cy + 15], [cx - 26, cy - 15], [cx, cy - 30]]),
  { t: 'circle', x: cx, y: cy, r: 18 },
];

const questions: BankDef[] = [
  figure(H(3, 2), 'Draw the structures of the two products formed when chlorobenzene is nitrated with concentrated nitric and sulphuric acids, and say which is the major one.', ['1-chloro-2-nitrobenzene, with the nitro group next to chlorine, at the ortho position.', '1-chloro-4-nitrobenzene, with it opposite chlorine, at the para position.', 'The para product is the major one, as the ortho position is crowded by the chlorine.'], {
    answer: sketch(320, 185, 'Two benzene rings, each with Cl at the top. The left ring has NO₂ on the carbon next to Cl, and is labelled ortho, minor. The right ring has NO₂ on the carbon opposite Cl, and is labelled para, major.', [
      ...ring(80, 95), line([[80, 65], [80, 48]]), label(80, 40, 'Cl'), line([[106, 80], [124, 70]]), label(128, 72, 'NO₂', 'start'),
      ...ring(230, 95), line([[230, 65], [230, 48]]), label(230, 40, 'Cl'), line([[230, 125], [230, 142]]), label(230, 156, 'NO₂'),
      label(80, 176, 'ortho (minor)'), label(230, 178, 'para (major)'),
    ]),
  }),
  figure(H(2, 2), 'The table gives the dipole moments of chloromethane and chlorobenzene. Explain why chlorobenzene’s is smaller.', ['In chlorobenzene the carbon bonded to chlorine is sp² hybridised, more electronegative than an sp³ carbon, so the bond is less polar.', 'Resonance also moves some of chlorine’s electron density into the ring, against the pull of the C–Cl bond.'], {
    shown: table(['Compound', 'Dipole moment (D)'], [['Chloromethane, CH₃Cl', '1.86'], ['Chlorobenzene, C₆H₅Cl', '1.69']]),
  }),
  figure(H(3, 3), 'The table gives the percentages of the three nitro products when chlorobenzene is nitrated. Explain why so little of the meta product forms, and why there is more para than ortho.', ['Chlorine’s lone pairs, by resonance, raise the electron density at the ortho and para positions, so the electrophile attacks there.', 'The meta position gets no such help, so very little meta product forms.', 'The ortho positions are next to the bulky chlorine, so attack there is hindered, and para is the main product.'], {
    shown: table(['Product', 'Percentage'], [['ortho (1-chloro-2-nitrobenzene)', '30'], ['meta (1-chloro-3-nitrobenzene)', '1'], ['para (1-chloro-4-nitrobenzene)', '69']]),
  }),

  predict(H(2, 2), 'Predict the main product when chlorobenzene is heated with concentrated sulphuric acid, and explain.', '4-chlorobenzenesulphonic acid, with a little of the 2-isomer.', 'Chlorine directs to the ortho and para positions, and para is favoured as it is less crowded.'),
  predict(H(2, 2), 'Predict whether bromobenzene is nitrated faster or slower than benzene, and where the nitro group mostly goes.', 'Slower, as bromine withdraws electrons from the ring by its inductive effect.', 'Mostly to the para position, with some ortho, as its lone pairs give electrons to those positions by resonance.'),
  predict(H(2, 2), 'Predict which reacts more easily with aqueous sodium hydroxide, chlorobenzene or benzyl chloride, and why.', 'Benzyl chloride, which is hydrolysed on warming.', 'Its C–Cl bond is an ordinary single bond to an sp³ carbon, and the benzyl carbocation is stabilised by the ring; in chlorobenzene the bond has partial double-bond character.'),

  odd(H(2, 1), ['chlorobenzene', 'bromobenzene', 'iodobenzene', 'benzyl chloride'], 'benzyl chloride', 'Its halogen is on an sp³ carbon of a side chain; in the others it is bonded to the ring itself.'),
  odd(H(2, 2), ['–Cl', '–Br', '–NO₂', '–OCH₃'], '–NO₂', 'It directs a new group to the meta position; the other three direct to ortho and para.'),
  odd(H(2, 2), ['nitration', 'sulphonation', 'Friedel–Crafts methylation', 'hydrolysis by aqueous NaOH at room temperature'], 'hydrolysis by aqueous NaOH at room temperature', 'Chlorobenzene doesn’t undergo it; the other three are electrophilic substitutions it does undergo.'),

  long(H(5, 2), 'Answer each part on the Friedel–Crafts reactions of chlorobenzene.\n(a) Write the equation for its reaction with chloromethane and anhydrous AlCl₃, naming the products. [2]\n(b) Write the equation for its reaction with ethanoyl chloride and anhydrous AlCl₃, naming the products. [2]\n(c) What does the AlCl₃ do? [1]', '(a) C₆H₅Cl + CH₃Cl → ClC₆H₄CH₃ + HCl.', '(a) The main product is 1-chloro-4-methylbenzene, with some 1-chloro-2-methylbenzene.', '(b) C₆H₅Cl + CH₃COCl → ClC₆H₄COCH₃ + HCl.', '(b) The main product is 4-chloroacetophenone, with some 2-chloroacetophenone.', '(c) As a Lewis acid it pulls chloride from the reagent, making the electrophile, CH₃⁺ or CH₃CO⁺.'),
  long(H(5, 3), 'Answer each part on nitro groups and the nucleophilic substitution of chlorobenzene.\n(a) How does a nitro group at the ortho or para position help hydroxide replace chlorine? [2]\n(b) Arrange chlorobenzene, 1-chloro-4-nitrobenzene and 1-chloro-2,4-dinitrobenzene in order of how easily they react with hydroxide, and say how the conditions change. [2]\n(c) Why does a nitro group at the meta position help much less? [1]', '(a) It withdraws electrons from the ring, so the hydroxide ion can attack the carbon bearing chlorine more easily.', '(a) The negative charge of the intermediate is spread onto the nitro group by resonance, which stabilises it.', '(b) 1-chloro-2,4-dinitrobenzene > 1-chloro-4-nitrobenzene > chlorobenzene.', '(b) Chlorobenzene needs about 623 K and high pressure; one nitro group lowers this to about 443 K, and two to about 368 K.', '(c) From the meta position the nitro group can’t take the negative charge by resonance; only its weaker inductive effect acts.'),

  tell(H(2, 2), 'Distinguish between chlorobenzene and benzyl chloride by a chemical test.', 'Warm each with aqueous NaOH, acidify with dilute nitric acid, and add silver nitrate solution.', 'Benzyl chloride gives a white precipitate of silver chloride; chlorobenzene gives none.'),
  tell(H(2, 2), 'Distinguish between electrophilic and nucleophilic substitution in chlorobenzene.', 'In electrophilic substitution, an electrophile replaces a hydrogen on the ring; chlorobenzene undergoes it fairly readily, at ortho and para.', 'In nucleophilic substitution, a nucleophile would replace the chlorine itself; this is very difficult, needing harsh conditions.'),
  tell(H(2, 3), 'Distinguish between the inductive and the resonance effects of chlorine on the benzene ring.', 'By its inductive effect chlorine withdraws electrons from the whole ring, making it less reactive than benzene.', 'By its resonance effect it gives electrons to the ortho and para positions, so new groups go there.'),

  match(H(4, 2), [['Conc. HNO₃ and conc. H₂SO₄', '1-chloro-4-nitrobenzene'], ['Conc. H₂SO₄, heated', '4-chlorobenzenesulphonic acid'], ['CH₃Cl and anhydrous AlCl₃', '1-chloro-4-methylbenzene'], ['CH₃COCl and anhydrous AlCl₃', '4-chloroacetophenone']]),
  match(H(4, 1), [['C₆H₅Cl', 'an aryl halide'], ['C₆H₅CH₂Cl', 'a benzylic halide'], ['CH₂=CHCl', 'a vinylic halide'], ['CH₃CH₂Cl', 'an alkyl halide']]),
  match(H(4, 3), [['Its C–Cl bond is shorter than in CH₃Cl', 'partial double-bond character from resonance'], ['It doesn’t undergo SN1', 'the phenyl cation is not stabilised'], ['It doesn’t undergo SN2', 'the ring blocks attack from behind the carbon'], ['Its dipole moment is smaller than that of CH₃Cl', 'the sp² carbon is more electronegative']]),

  ar(H(1, 2), 'Chlorobenzene undergoes electrophilic substitution more slowly than benzene.', 'Chlorine withdraws electrons from the ring by its inductive effect.', 1, 'The ring is made less rich in electrons, so electrophiles attack it less readily.'),
  ar(H(1, 2), 'Nitrating chlorobenzene gives mainly the ortho and para products.', 'Chlorobenzene is a haloarene.', 2, 'Both are true, but the reason is that chlorine’s lone pairs raise the electron density at those positions by resonance.'),
  ar(H(1, 1), 'Chlorobenzene readily gives phenol with aqueous sodium hydroxide at room temperature.', 'The C–Cl bond in chlorobenzene has partial double-bond character.', 4, 'Because of that partial double bond, it needs about 623 K and high pressure.'),
];

export default questions;
