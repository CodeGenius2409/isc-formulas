// Written by hand: phenols, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const P = at(7, 'b');

// Steam distillation of the nitrophenols, drawn with letters and with names.
const still = [
  { t: 'box' as const, x: 15, y: 90, w: 45, h: 50 },
  line([[37, 90], [37, 45], [112, 45], [112, 112]]),
  { t: 'circle' as const, x: 115, y: 120, r: 26 },
  line([[128, 98], [150, 70]]),
  line([[160, 65], [240, 105]]), line([[160, 85], [240, 125]]), line([[160, 65], [160, 85]]), line([[240, 105], [240, 125]]),
  line([[150, 70], [262, 126]]),
  { t: 'box' as const, x: 250, y: 130, w: 40, h: 30 },
];

const questions: BankDef[] = [
  figure(P(2, 1), 'Draw the structure of phenol, and mark the positions of the ring where an electrophile attacks.', ['A benzene ring with –OH on one carbon.', 'The two ortho positions (2 and 6) and the para position (4) are marked, where resonance puts extra electron density.'], {
    answer: sketch(320, 170, 'A benzene ring drawn as a hexagon with a circle inside, and an –OH group at the top. The two carbons next to it are marked ortho, positions 2 and 6, and the carbon opposite it is marked para, position 4.', [
      line([[160, 60], [194.6, 80], [194.6, 120], [160, 140], [125.4, 120], [125.4, 80], [160, 60]]),
      { t: 'circle', x: 160, y: 100, r: 25 },
      line([[160, 60], [160, 42]]), label(160, 34, 'OH'),
      label(204, 78, '2 (ortho)', 'start'), label(116, 78, '6 (ortho)', 'end'), label(160, 158, '4 (para)'),
    ]),
  }),
  figure(P(3, 2), 'The table gives the pKa values of some compounds. Arrange them in order of falling acid strength, and explain where 4-nitrophenol and 4-methylphenol come.', ['4-nitrophenol > 4-chlorophenol > phenol > 4-methylphenol > ethanol, as a lower pKa means a stronger acid.', 'The nitro group withdraws electrons by resonance and induction, spreading the phenoxide ion’s charge, so the ion is more stable.', 'The methyl group releases electrons, which concentrates the charge on the ion, so 4-methylphenol is weaker than phenol.'], {
    shown: table(['Compound', 'pKa'], [['Phenol', '10.0'], ['4-nitrophenol', '7.2'], ['4-chlorophenol', '9.4'], ['4-methylphenol', '10.3'], ['Ethanol', '15.9']]),
  }),
  figure(P(3, 2), 'The figure shows apparatus for separating the mixture of nitrophenols formed when phenol is nitrated. Name the parts P, Q, R and S, and say which isomer collects in S.', ['P makes steam, and Q holds the mixture of o- and p-nitrophenol that the steam passes through.', 'R is a condenser, and S a receiver.', 'o-Nitrophenol collects in S, as it is steam-volatile; p-nitrophenol stays behind in Q.'], {
    shown: sketch(320, 180, 'Apparatus for steam distillation. A closed can P on the left sends steam through a tube into a round flask Q. A tube from Q’s neck leads into a sloping condenser R, which runs down into a receiver S on the right.', [
      ...still,
      label(37, 158, 'P'), label(115, 164, 'Q'), label(200, 70, 'R'), label(300, 150, 'S', 'start'),
    ]),
    answer: sketch(320, 180, 'The same apparatus with its parts named: a steam generator, a flask holding the mixture of nitrophenols, a condenser, and a receiver, where o-nitrophenol collects.', [
      ...still,
      label(37, 158, 'steam'), label(37, 172, 'generator'),label(115, 164, 'mixture'), label(196, 70, 'condenser', 'start'), label(318, 176, 'receiver: o-isomer', 'end'),
    ]),
  }),

  predict(P(2, 1), 'Phenol is shaken with aqueous sodium hydroxide, and carbon dioxide is then bubbled through the solution. Predict what is seen at each stage.', 'The phenol dissolves, as it forms sodium phenoxide, giving a clear solution.', 'With carbon dioxide the solution turns milky, as carbonic acid, the stronger acid, sets phenol free.'),
  predict(P(2, 3), 'Predict the main product when 4-methylphenol is nitrated with dilute nitric acid, and explain.', '4-methyl-2-nitrophenol.', 'The –OH group activates the ring far more strongly than the methyl group, and its para position is taken, so the nitro group goes ortho to –OH.'),
  predict(P(2, 2), 'Predict whether 2,4,6-trinitrophenol gives off carbon dioxide with sodium hydrogencarbonate solution, and explain.', 'Yes, it fizzes.', 'Three nitro groups make it a strong acid, stronger than carbonic acid, unlike phenol itself.'),

  odd(P(2, 1), ['o-cresol', 'catechol', 'resorcinol', 'hydroquinone'], 'o-cresol', 'It is a monohydric phenol, with one –OH; the others are dihydric, with two.'),
  odd(P(2, 2), ['bromine water', 'dilute nitric acid', 'chloroform with sodium hydroxide', 'zinc dust'], 'zinc dust', 'Heating with zinc dust removes the –OH group, giving benzene; the others substitute a group into the ring.'),
  odd(P(2, 2), ['cumene, oxidised in air and then treated with acid', 'chlorobenzene, with NaOH at 623 K and high pressure', 'benzene diazonium chloride, warmed with water', 'benzyl chloride, boiled with aqueous NaOH'], 'benzyl chloride, boiled with aqueous NaOH', 'It gives benzyl alcohol, whose –OH is on the side chain; the other three give phenol.'),

  long(P(5, 2), 'Answer each part on the acidity of phenols.\n(a) Write the equations for phenol reacting with sodium and with sodium hydroxide. [2]\n(b) m-Nitrophenol and p-nitrophenol are both stronger acids than phenol, but m-nitrophenol is the weaker of the two. Explain. [2]\n(c) What does phenol’s failure to react with sodium hydrogencarbonate show? [1]', '(a) 2C₆H₅OH + 2Na → 2C₆H₅ONa + H₂.', '(a) C₆H₅OH + NaOH → C₆H₅ONa + H₂O.', '(b) At the para position the nitro group draws the negative charge onto itself by resonance, as well as by induction.', '(b) At the meta position only the inductive effect acts, so the ion is less stabilised.', '(c) Phenol is a weaker acid than carbonic acid.'),
  long(P(5, 2), 'Answer each part on preparing phenol.\n(a) How is phenol made from benzenesulphonic acid? [2]\n(b) How is it made from aniline? Give the conditions. [2]\n(c) Why does chlorobenzene need such harsh conditions to give phenol? [1]', '(a) The acid is neutralised and the sodium salt fused with sodium hydroxide, giving sodium phenoxide.', '(a) Acidifying the phenoxide gives phenol.', '(b) Aniline is diazotised with NaNO₂ and HCl at 273–278 K, giving benzene diazonium chloride.', '(b) The diazonium salt is warmed with water, giving phenol and nitrogen.', '(c) The C–Cl bond has partial double-bond character from resonance with the ring, so it is hard to break.'),

  tell(P(2, 1), 'Distinguish between phenol and benzyl alcohol by a chemical test.', 'Add neutral iron(III) chloride solution to each.', 'Phenol gives a violet colour; benzyl alcohol gives none, as its –OH isn’t on the ring.'),
  tell(P(2, 2), 'Distinguish between the nitration of phenol with dilute nitric acid and with concentrated nitric acid.', 'Dilute acid at room temperature gives a mixture of o- and p-nitrophenol.', 'Concentrated acid, with concentrated sulphuric acid, gives 2,4,6-trinitrophenol, picric acid.'),
  tell(P(3, 2), 'Distinguish between the Kolbe reaction and the Reimer–Tiemann reaction, giving the reagents, the product and the group that enters the ring.', 'Kolbe: sodium phenoxide with CO₂ at about 400 K and 4–7 atm; Reimer–Tiemann: phenol with chloroform and aqueous NaOH.', 'Kolbe gives salicylic acid; Reimer–Tiemann gives salicylaldehyde, after acid in both.', 'Kolbe puts in –COOH, and Reimer–Tiemann –CHO, both at the ortho position.'),

  match(P(4, 1), [['Kolbe reaction', 'salicylic acid'], ['Reimer–Tiemann reaction', 'salicylaldehyde'], ['Excess bromine water', '2,4,6-tribromophenol'], ['Heating with zinc dust', 'benzene']]),
  match(P(4, 2), [['4-nitrophenol', 'stronger than phenol, by resonance and induction'], ['3-nitrophenol', 'stronger than phenol, by induction alone'], ['4-methylphenol', 'weaker than phenol, as the group releases electrons'], ['2,4,6-trinitrophenol', 'stronger than carbonic acid']]),
  match(P(4, 2), [['Cumene', 'oxidised by air to a hydroperoxide, then split by dilute acid'], ['Chlorobenzene', 'NaOH at 623 K and 300 atm, then acid'], ['Benzene diazonium chloride', 'warmed with water'], ['Sodium benzenesulphonate', 'fused with NaOH, then acidified']]),

  ar(P(1, 2), 'm-Nitrophenol is a stronger acid than phenol.', 'A nitro group at the meta position withdraws electrons by its inductive effect, which stabilises the phenoxide ion.', 1, 'The inductive effect alone is enough to make it stronger than phenol, though weaker than the para isomer.'),
  ar(P(1, 3), 'Salicylaldehyde is formed in the Reimer–Tiemann reaction.', 'The electrophile in the reaction is chloroform itself.', 3, 'The electrophile is dichlorocarbene, :CCl₂, formed from chloroform by the base.'),
  ar(P(1, 2), 'Phenol reacts readily with HBr to give bromobenzene.', 'The C–O bond of phenol has partial double-bond character.', 4, 'Because the C–O bond is strengthened by resonance, phenol’s –OH can’t be replaced by bromide the way an alcohol’s can.'),
];

export default questions;
