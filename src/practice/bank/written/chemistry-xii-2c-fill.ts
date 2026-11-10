// Written by hand: batteries and corrosion, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const B = at(2, 'c');

const questions: BankDef[] = [
  figure(B(3, 1), 'Draw a labelled diagram of a dry cell, naming its anode, its cathode and what fills it.', ['A zinc container is the anode, the negative terminal.', 'A graphite rod down the middle is the cathode, surrounded by a paste of manganese dioxide and carbon.', 'The rest is filled with a moist paste of ammonium chloride and zinc chloride, the electrolyte.'], {
    answer: sketch(400, 215, 'A tall zinc can, open at the top, with a graphite rod standing in its middle and poking out of the top. Around the rod is a layer of manganese dioxide and carbon, and between that and the can is a paste of ammonium chloride and zinc chloride. Labels on the right name each part: the graphite rod as cathode, positive; the manganese dioxide and carbon; the ammonium chloride and zinc chloride paste; and the zinc can as anode, negative.', [
      line([[60, 30], [60, 200], [180, 200], [180, 30]]), { t: 'box', x: 88, y: 50, w: 64, h: 130, dash: 1 }, { t: 'box', x: 112, y: 18, w: 16, h: 160 },
      line([[128, 26], [196, 26]]), label(200, 30, 'graphite rod: cathode (+)', 'start'),
      line([[144, 90], [196, 76]]), label(200, 80, 'MnO₂ and carbon', 'start'),
      line([[168, 130], [196, 126]]), label(200, 130, 'NH₄Cl and ZnCl₂ paste', 'start'),
      line([[180, 180], [196, 180]]), label(200, 184, 'zinc can: anode (−)', 'start'),
    ]),
  }),
  figure(B(3, 2), 'A drop of water sits on a piece of iron. Draw it, and mark where iron is oxidised, where oxygen is reduced, and where rust forms, with the reactions.', ['Under the middle of the drop, where little oxygen reaches, iron is the anode: Fe → Fe²⁺ + 2e⁻.', 'The electrons flow through the iron to the edge of the drop, where oxygen is plentiful and is reduced: O₂ + 4H⁺ + 4e⁻ → 2H₂O.', 'Fe²⁺ ions move out through the water, are oxidised further by air, and form rust, Fe₂O₃·xH₂O, near the edge of the drop.'], {
    answer: sketch(320, 220, 'A drop of water sits on an iron surface. Under the middle of the drop, the iron is marked as the anode, where Fe gives Fe²⁺ and two electrons. An arrow below the surface shows electrons flowing through the iron to the edge of the drop, which is marked as the cathode, where oxygen is reduced to water. Rust is marked forming at the edge of the drop.', [
      line([[20, 140], [300, 140]]), label(30, 160, 'iron', 'start'),
      { t: 'path', d: 'M60 140 C 80 70, 240 70, 260 140' }, label(160, 116, 'water with O₂'),
      line([[160, 172], [160, 146]], { arrow: 1 }), label(160, 186, 'anode: Fe → Fe²⁺ + 2e⁻'),
      line([[150, 154], [84, 154]], { arrow: 1 }), label(118, 168, 'e⁻'),
      line([[48, 60], [66, 128]], { arrow: 1 }), label(48, 52, 'cathode', 'middle'),
      line([[276, 70], [258, 128]], { arrow: 1 }), label(276, 62, 'rust', 'middle'),
      label(160, 212, 'cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O'),
    ]),
  }),
  figure(B(3, 2), 'The figure shows a hydrogen–oxygen fuel cell. Name P, Q and R, and write the reaction at P and at Q.', ['P is the anode, where hydrogen is oxidised: 2H₂ + 4OH⁻ → 4H₂O + 4e⁻.', 'Q is the cathode, where oxygen is reduced: O₂ + 2H₂O + 4e⁻ → 4OH⁻.', 'R is the electrolyte, a concentrated solution of potassium hydroxide.'], {
    shown: sketch(320, 200, 'A tank of liquid, R, with two porous electrodes, P on the left and Q on the right, joined above by a wire through a bulb. Hydrogen is blown in at P from the left, and oxygen at Q from the right.', [
      { t: 'box', x: 80, y: 50, w: 160, h: 140 }, { t: 'box', x: 100, y: 34, w: 16, h: 140 }, { t: 'box', x: 204, y: 34, w: 16, h: 140 },
      line([[108, 34], [108, 14], [145, 14]]), { t: 'circle', x: 160, y: 14, r: 10 }, line([[175, 14], [212, 14], [212, 34]]),
      arrow([20, 90], [98, 90]), label(40, 82, 'H₂'), arrow([300, 90], [222, 90]), label(280, 82, 'O₂'),
      label(92, 150, 'P', 'end'), label(228, 150, 'Q', 'start'), label(160, 130, 'R'),
    ]),
  }),

  predict(B(2, 2), 'One iron nail is wrapped with copper wire and another with a strip of zinc, and both are left in salt water. Predict which rusts, and why.', 'The nail wrapped in copper rusts quickly, as iron is more reactive than copper and becomes the anode.', 'The nail wrapped in zinc doesn’t rust, as the zinc, more reactive, becomes the anode and corrodes instead.'),
  predict(B(2, 1), 'A lead accumulator is put on charge. Predict what happens to the density of its acid, and why.', 'The density rises.', 'Charging turns PbSO₄ back into Pb and PbO₂, and returns sulphuric acid to the solution.'),
  predict(B(2, 1), 'One iron nail is kept in a tube of dry air over calcium chloride, and another in boiled water under a layer of oil. Predict whether either rusts, and why.', 'Neither rusts.', 'Rusting needs both water and oxygen; the first nail has no water, and the second has no oxygen.'),

  odd(B(2, 1), ['a dry cell', 'a mercury cell', 'a lead accumulator', 'a Leclanché cell'], 'a lead accumulator', 'It is a secondary cell, which can be recharged; the others are primary cells.'),
  odd(B(2, 1), ['painting', 'oiling', 'greasing', 'joining to a block of magnesium'], 'joining to a block of magnesium', 'It protects by sacrificial, electrochemical action; the others only keep air and water away.'),
  odd(B(2, 2), ['Zn', 'Pb', 'H₂', 'MnO₂'], 'MnO₂', 'It is used at a cathode, in the dry cell; the others are oxidised at the anode of a dry cell, a lead accumulator and a fuel cell.'),

  long(B(5, 2), 'Answer each part on the lead accumulator.\n(a) Name its anode, cathode and electrolyte. [1]\n(b) Write the reaction at each electrode as it discharges. [2]\n(c) What happens at the electrodes when it is charged? [1]\n(d) Why is the density of its acid checked? [1]', '(a) Anode: lead; cathode: lead dioxide packed on a lead grid; electrolyte: about 38% sulphuric acid.', '(b) Anode: Pb + SO₄²⁻ → PbSO₄ + 2e⁻.', '(b) Cathode: PbO₂ + SO₄²⁻ + 4H⁺ + 2e⁻ → PbSO₄ + 2H₂O.', '(c) The reactions run backwards: PbSO₄ turns back into Pb at one plate and PbO₂ at the other.', '(d) The acid gets weaker as the cell discharges, so its density shows how charged the cell is.'),
  long(B(5, 2), 'Answer each part on the dry cell and the mercury cell.\n(a) Write the reactions at the anode and the cathode of a dry cell. [2]\n(b) Why does a dry cell’s voltage fall as it is used, while a mercury cell’s stays almost steady? [2]\n(c) Give one use of the mercury cell. [1]', '(a) Anode: Zn → Zn²⁺ + 2e⁻.', '(a) Cathode: MnO₂ + NH₄⁺ + e⁻ → MnO(OH) + NH₃.', '(b) In the dry cell, ions such as NH₄⁺ are used up and products build up, so the voltage falls.', '(b) The mercury cell’s overall reaction, Zn + HgO → ZnO + Hg, with the zinc as an amalgam, involves no ions in solution whose concentration changes, so it keeps about 1.35 V.', '(c) In hearing aids and watches.'),
  long(B(5, 3), 'Answer each part on protecting iron.\n(a) What is galvanising? [1]\n(b) Why does a scratched galvanised sheet still not rust, while a scratched tin-plated can rusts faster than bare iron? [2]\n(c) What is sacrificial protection? Give one place it is used. [2]', '(a) Coating iron with a layer of zinc.', '(b) At a scratch, zinc is more reactive than iron, so it corrodes and the iron stays the cathode.', '(b) Tin is less reactive than iron, so at a scratch the iron becomes the anode and corrodes faster.', '(c) Joining iron to a more reactive metal, such as magnesium, which corrodes in its place.', '(c) For ships’ hulls and buried pipelines.'),

  tell(B(2, 1), 'Distinguish between a dry cell and a mercury cell.', 'A dry cell has a zinc anode, a graphite cathode with MnO₂, and an NH₄Cl paste; its voltage, about 1.5 V, falls with use.', 'A mercury cell has a zinc–mercury anode and an HgO cathode in KOH; its voltage, about 1.35 V, stays nearly steady.'),
  tell(B(2, 2), 'Distinguish between galvanising and tin plating, by what happens when the coating is scratched.', 'Galvanising coats iron with zinc, which is more reactive, so the zinc still protects the iron at a scratch.', 'Tin plating coats iron with tin, which is less reactive, so at a scratch the iron rusts faster.'),
  tell(B(2, 2), 'Distinguish between a fuel cell and a dry cell.', 'A fuel cell is fed its reactants, such as hydrogen and oxygen, all the time, so it works as long as they are supplied.', 'A dry cell holds a fixed store of reactants, and stops when they are used up.'),

  match(B(4, 1), [['The anode of a dry cell', 'zinc'], ['The cathode of a dry cell', 'a graphite rod in MnO₂'], ['The anode of a lead accumulator', 'lead'], ['The cathode of a lead accumulator', 'lead dioxide']]),

  ar(B(1, 2), 'Tin plating makes iron rust faster once the tin is scratched.', 'Iron is more reactive than tin, so at the scratch iron becomes the anode.', 1, 'The iron is the anode, and corrodes faster than it would alone.'),
  ar(B(1, 1), 'A dry cell’s voltage stays exactly the same until it is used up.', 'A dry cell is a primary cell.', 4, 'The dry cell’s voltage falls gradually with use.'),
  ar(B(1, 2), 'The density of the acid in a lead accumulator rises as it is charged.', 'Lead accumulators are used in cars.', 2, 'Both are true, but the density rises because charging puts sulphuric acid back into the solution.'),
];

export default questions;
