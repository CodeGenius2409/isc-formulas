// Written by hand: aromatic hydrocarbons, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, ar } = kit('chemistry', 'XI');
const B = at(9, 'd');

/** A regular hexagon of side 30 centred at (cx, cy), flat sides left and right; doubles lists the sides drawn as double bonds, 0 being the top-right side. */
const ring = (cx: number, cy: number, doubles: number[] = [], circle = false): SketchMark[] => {
  const v = Array.from({ length: 6 }, (_, k) => [cx + 30 * Math.cos(((k * 60 - 90) * Math.PI) / 180), cy + 30 * Math.sin(((k * 60 - 90) * Math.PI) / 180)] as [number, number]);
  return [
    ...v.map((p, k) => line([p, v[(k + 1) % 6]])),
    ...doubles.map((k) => {
      const [a, b] = [v[k], v[(k + 1) % 6]];
      const t = (p: [number, number]): [number, number] => [p[0] + (cx - p[0]) * 0.2, p[1] + (cy - p[1]) * 0.2];
      return line([t(a), t(b)]);
    }),
    ...(circle ? [{ t: 'circle' as const, x: cx, y: cy, r: 17 }] : []),
  ];
};

const questions: BankDef[] = [
  figure(B(3, 2), 'Draw the two Kekulé structures of benzene and the resonance hybrid, and say what the hybrid shows about its bonds.', ['Two Kekulé structures, each a ring of six carbons with alternating single and double bonds, the double bonds in different places, joined by a double-headed arrow.', 'The hybrid is drawn as a hexagon with a circle inside, standing for six π electrons spread over the whole ring.', 'So all six C–C bonds are the same, 139 pm, between a single and a double bond.'], {
    answer: sketch(360, 120, 'Two hexagons with alternating double bonds, the double bonds in different positions, joined by a double-headed arrow. Then an equals sign and a hexagon with a circle inside.', [
      ...ring(50, 60, [0, 2, 4]), arrow([100, 60], [126, 60]), arrow([110, 60], [84, 60]), ...ring(160, 60, [1, 3, 5]),
      label(222, 66, '≡'), ...ring(290, 60, [], true),
    ]),
  }),
  figure(B(3, 2), 'Make a table of the three steps of the bromination of benzene with Br₂ and FeBr₃, showing the electrophile.', ['Step 1, making the electrophile: Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻.', 'Step 2: Br⁺ attacks the ring, forming a carbocation, the arenium ion, whose charge is spread by resonance; the ring loses its aromatic stability.', 'Step 3: FeBr₄⁻ takes the H⁺ from the carbon carrying Br, giving bromobenzene and HBr, and setting FeBr₃ free again.'], {
    answer: table(['Step', 'What happens'], [['1. Electrophile formed', 'Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻'], ['2. Attack on the ring', 'Br⁺ adds, giving the arenium ion, a carbocation'], ['3. Loss of H⁺', 'FeBr₄⁻ removes H⁺: C₆H₅Br + HBr + FeBr₃']]),
  }),
  figure(B(3, 1), 'Draw a benzene ring carrying an –OH group, and mark the ortho, meta and para positions. Where does an incoming electrophile go, and why?', ['The two carbons next to the one carrying –OH are ortho, the next two are meta, and the one opposite is para.', 'An electrophile goes mainly to the ortho and para positions.', 'The lone pairs on oxygen are released into the ring by resonance, making those positions richest in electrons.'], {
    answer: sketch(260, 180, 'A hexagon with a circle inside and OH on the top carbon. The two carbons next to it are marked o, the next two m, and the bottom carbon p.', [
      ...ring(130, 100, [], true), line([[130, 70], [130, 46]]), label(130, 40, 'OH'),
      label(164, 84, 'o', 'start'), label(96, 84, 'o', 'end'), label(164, 124, 'm', 'start'), label(96, 124, 'm', 'end'), label(130, 150, 'p'),
    ]),
  }),

  predict(B(2, 1), 'Toluene is nitrated with a mixture of concentrated nitric and sulphuric acids. Predict the main products.', '2-nitrotoluene and 4-nitrotoluene, the ortho and para products.', 'The –CH₃ group releases electrons and directs the incoming NO₂⁺ to these positions.'),
  predict(B(2, 2), 'Chlorobenzene is nitrated. Predict where the nitro group goes, and whether the reaction is faster or slower than for benzene.', 'Mainly to the ortho and para positions, as chlorine’s lone pairs feed electrons to them by resonance.', 'It is slower than for benzene, as chlorine’s −I effect withdraws electrons from the ring overall.'),
  predict(B(2, 1), 'Benzene is warmed with chloromethane and anhydrous AlCl₃. Predict the product, and name the reaction.', 'Methylbenzene, toluene, and HCl.', 'It is Friedel–Crafts alkylation, an electrophilic substitution.'),

  odd(B(2, 1), ['–OH', '–NH₂', '–CH₃', '–NO₂'], '–NO₂', 'It deactivates the ring and directs to meta; the others activate it and direct to ortho and para.'),
  odd(B(2, 1), ['benzene', 'naphthalene', 'cyclohexene', 'toluene'], 'cyclohexene', 'It isn’t aromatic; the others are.'),
  odd(B(2, 1), ['nitration', 'sulphonation', 'Friedel–Crafts alkylation', 'hydrogenation'], 'hydrogenation', 'It is an addition reaction; the others are electrophilic substitutions.'),

  long(B(5, 2), 'Answer each part on Friedel–Crafts reactions.\n(a) Write the equation for the alkylation of benzene with chloromethane. [1]\n(b) What is the part played by anhydrous AlCl₃? [1]\n(c) What is the product of acylation with ethanoyl chloride? [1]\n(d) Why doesn’t nitrobenzene undergo Friedel–Crafts reactions? [1]\n(e) Why does acylation give a single product more easily than alkylation? [1]', '(a) C₆H₆ + CH₃Cl → C₆H₅CH₃ + HCl, with anhydrous AlCl₃.', '(b) It is a Lewis acid that takes Cl⁻ from CH₃Cl, making the electrophile CH₃⁺: CH₃Cl + AlCl₃ → CH₃⁺ + AlCl₄⁻.', '(c) Acetophenone, C₆H₅COCH₃.', '(d) The –NO₂ group withdraws electrons so strongly that the ring is too unreactive to attack the electrophile.', '(e) The alkyl group activates the ring, so more alkyl groups join; the acyl group deactivates it, so the reaction stops after one.'),

  tell(B(2, 1), 'Distinguish between benzene and cyclohexene by a simple test.', 'Cyclohexene decolourises bromine water at once, by adding bromine across its double bond.', 'Benzene doesn’t, as its stable aromatic ring resists addition.'),
  tell(B(2, 1), 'Distinguish between ortho-and-para-directing and meta-directing groups, with one example of each.', 'An ortho-and-para-directing group sends an incoming electrophile to positions 2 and 4: –OH.', 'A meta-directing group sends it to position 3: –NO₂.'),
  tell(B(2, 1), 'Distinguish between Friedel–Crafts alkylation and acylation.', 'Alkylation adds an alkyl group, such as –CH₃, from an alkyl halide, and can go on to add more than one.', 'Acylation adds an acyl group, such as –COCH₃, from an acid chloride, and gives a ketone, adding only one group.'),

  match(B(4, 1), [['Nitration', 'concentrated HNO₃ with concentrated H₂SO₄'], ['Sulphonation', 'fuming H₂SO₄'], ['Chlorination', 'Cl₂ with anhydrous FeCl₃'], ['Friedel–Crafts acylation', 'CH₃COCl with anhydrous AlCl₃']]),
  match(B(4, 2), [['The electrophile in nitration', 'NO₂⁺'], ['The electrophile in sulphonation', 'SO₃'], ['The electrophile in chlorination', 'Cl⁺'], ['The electrophile in Friedel–Crafts methylation', 'CH₃⁺']]),
  match(B(4, 2), [['–OH on the ring', 'activating; ortho and para'], ['–NO₂ on the ring', 'deactivating; meta'], ['–Cl on the ring', 'deactivating; ortho and para'], ['–CH₃ on the ring', 'weakly activating; ortho and para']]),

  reason(B(2, 1), 'Give reasons. (a) Benzene doesn’t decolourise bromine water. (b) Nitrobenzene is nitrated much more slowly than benzene.', '(a) Addition would destroy its stable, delocalised ring, so it doesn’t add bromine in these mild conditions.', '(b) The –NO₂ group withdraws electrons from the ring, making it less attractive to the electrophile NO₂⁺.'),
  reason(B(2, 2), 'Give reasons. (a) Phenol reacts with electrophiles more readily than benzene. (b) Benzene is unusually stable for a compound with three double bonds.', '(a) The –OH group releases electrons into the ring by resonance, making it richer in electrons.', '(b) Its six π electrons are spread over the whole ring, giving it a large resonance energy.'),

  ar(B(1, 2), 'The –CH₃ group of toluene directs an incoming electrophile to the ortho and para positions.', 'It releases electrons by its +I effect and hyperconjugation, mostly to those positions.', 1, 'The positions with the most electron density attract the electrophile.'),
  ar(B(1, 2), 'Chlorobenzene is less reactive than benzene towards nitration.', 'Chlorine directs an incoming group to the ortho and para positions.', 2, 'Both are true, but chlorobenzene is less reactive because of chlorine’s −I effect, not because of where it directs.'),
  ar(B(1, 2), 'Cyclooctatetraene, C₈H₈, is aromatic.', 'An aromatic ring has (4n + 2) π electrons.', 4, 'It has 8 π electrons, which isn’t 4n + 2, and its ring isn’t flat, so it isn’t aromatic.'),
];

export default questions;
