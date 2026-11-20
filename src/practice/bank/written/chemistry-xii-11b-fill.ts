// Written by hand: rate of reaction, pH and cells in practical work, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The hydrogen graph is V = 60(1 − e^(−t/30)) cm³; the Nernst equation is used at 298 K as E = E° − (0.0591/2) log([Zn²⁺]/[Cu²⁺]).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, ar } = kit('chemistry', 'XII');
const R = at(11, 'b');

const questions: BankDef[] = [
  figure(R(3, 2), 'The graph shows the volume of hydrogen given off when magnesium ribbon reacts with excess dilute HCl. Explain its shape, and find the average rate over the first 20 s.', ['The graph is steepest at the start, when the acid is most concentrated and the magnesium largest; it gets less steep as they are used up.', 'It levels off at 60 cm³ when all the magnesium has reacted.', 'About 29 cm³ is given off in the first 20 s: an average rate of about 1.5 cm³/s.'], {
    shown: graph('time (s)', 'volume of hydrogen (cm³)', [{ points: plot((t) => 60 * (1 - Math.exp(-t / 30)), 0, 150, 40) }], { x: [[20, '20'], [50, '50'], [100, '100'], [150, '150']], y: [[29, '29'], [60, '60']] }),
  }),
  figure(R(3, 1), 'Draw a labelled diagram of the cell Zn/Zn²⁺//Cu²⁺/Cu, showing the salt bridge and the direction in which electrons flow.', ['A zinc rod in ZnSO₄ solution, and a copper rod in CuSO₄ solution, in separate beakers.', 'A salt bridge of KNO₃ or KCl in agar joins the solutions, and a voltmeter joins the rods.', 'Electrons flow in the wire from zinc, the negative anode, to copper, the positive cathode.'], {
    answer: sketch(340, 220, 'Two beakers side by side. The left holds a zinc rod in zinc sulphate solution; the right holds a copper rod in copper sulphate solution. An upside-down U-tube, the salt bridge, dips into both solutions. A wire from the zinc rod goes through a voltmeter to the copper rod, with an arrow showing electrons moving from zinc to copper.', [
      { t: 'path', d: 'M30 110 L30 200 L130 200 L130 110' }, { t: 'path', d: 'M210 110 L210 200 L310 200 L310 110' },
      line([[32, 130], [128, 130]], { dash: 1 }), line([[212, 130], [308, 130]], { dash: 1 }),
      { t: 'box', x: 64, y: 60, w: 12, h: 120 }, { t: 'box', x: 264, y: 60, w: 12, h: 120 },
      { t: 'path', d: 'M110 170 L110 90 L230 90 L230 170' }, label(170, 82, 'salt bridge'),
      line([[70, 60], [70, 30], [150, 30]]), { t: 'circle', x: 170, y: 30, r: 14 }, label(170, 35, 'V'), line([[190, 30], [270, 30], [270, 60]]),
      arrow([100, 20], [140, 20]), label(120, 12, 'e⁻'),
      label(70, 216, 'Zn in ZnSO₄'), label(270, 216, 'Cu in CuSO₄'),
    ]),
  }),
  figure(R(3, 2), 'The table gives the time for the cross to disappear in the thiosulphate–acid reaction, at three temperatures, with the same amounts each time. Find 1/time for each, and say what the results show.', ['1/time is 0.016, 0.031 and 0.063 s⁻¹, a measure of the rate.', 'The rate doubles for each rise of 10 °C.', 'At higher temperature more particles have the energy needed to react, so successful collisions are more frequent.'], {
    shown: table(['Temperature (°C)', 'Time for the cross to disappear (s)'], [['20', '64'], ['30', '32'], ['40', '16']]),
  }),

  predict(R(2, 2), 'In the cell Zn/Zn²⁺//Cu²⁺/Cu, the Zn²⁺ solution is made more concentrated. Predict the effect on the cell potential.', 'It falls a little.', 'E = E° − (0.0591/2) log([Zn²⁺]/[Cu²⁺]), so a larger [Zn²⁺] makes the log term larger.'),
  predict(R(2, 1), 'A drop of universal indicator is added to each of 0.1 M NaOH, pure water and vinegar. Predict the colours.', 'NaOH, pH about 13: violet; pure water, pH 7: green.', 'Vinegar, pH about 3: orange-red.'),

  odd(R(2, 1), ['temperature', 'concentration', 'surface area of a solid', 'the colour of the flask'], 'the colour of the flask', 'It has no effect on the rate; the others change it.'),
  odd(R(2, 1), ['lemon juice', 'vinegar', 'soap solution', 'dilute HCl'], 'soap solution', 'It is alkaline; the others are acidic.'),
  odd(R(2, 1), ['a salt bridge', 'a zinc electrode', 'a copper electrode', 'a burette'], 'a burette', 'It isn’t part of a voltaic cell; the others are.'),

  long(R(5, 2), 'Answer each part on the reaction of sodium thiosulphate with dilute HCl.\n(a) Write the equation. [1]\n(b) Describe how the rate is measured. [2]\n(c) Why is 1/time a measure of the rate? [1]\n(d) If the cross takes 50 s to disappear at 0.10 M thiosulphate, and the rate is proportional to its concentration, how long will it take at 0.05 M? [1]', '(a) Na₂S₂O₃ + 2HCl → 2NaCl + SO₂ + S + H₂O.', '(b) A flask of thiosulphate solution stands on a cross drawn on paper; acid is added and a clock started.', '(b) The time is taken when the sulphur formed makes the solution so cloudy that the cross can’t be seen from above.', '(c) The same amount of sulphur forms each time, so a reaction twice as fast takes half the time.', '(d) Half the rate, so twice the time: 100 s.'),
  long(R(5, 3), 'For the cell Zn/Zn²⁺//Cu²⁺/Cu, E° = 1.10 V at 298 K.\n(a) Find the cell potential with [Zn²⁺] = 0.010 M and [Cu²⁺] = 1.0 M. [2]\n(b) Find it with [Zn²⁺] = 0.10 M and [Cu²⁺] = 0.010 M. [1]\n(c) Write the half-reactions at the two electrodes. [2]', '(a) E = 1.10 − (0.0591/2) log(0.010/1.0) = 1.10 − 0.0296 × (−2).', '(a) = 1.16 V.', '(b) E = 1.10 − 0.0296 × log(10) = 1.07 V.', '(c) At the zinc anode: Zn → Zn²⁺ + 2e⁻.', '(c) At the copper cathode: Cu²⁺ + 2e⁻ → Cu.'),
  long(R(5, 1), 'Answer each part on finding pH.\n(a) How is the pH of a solution found with universal indicator paper? [1]\n(b) Give the pH of 0.01 M HCl and of 0.01 M NaOH. [2]\n(c) What is the pH when equal volumes of these two are mixed? [1]\n(d) Why does indicator paper give only an approximate pH? [1]', '(a) A drop of the solution is put on the paper with a glass rod, and the colour is compared with the chart.', '(b) 0.01 M HCl: [H⁺] = 10⁻² M, pH 2.', '(b) 0.01 M NaOH: [OH⁻] = 10⁻² M, pOH 2, pH 12.', '(c) 7: they neutralise each other exactly.', '(d) Colours are judged by eye against a chart, usually only to the nearest whole number.'),

  tell(R(2, 1), 'Distinguish between a voltaic cell and an electrolytic cell.', 'A voltaic cell turns the energy of a spontaneous reaction into electrical energy.', 'An electrolytic cell uses electrical energy from outside to drive a reaction that wouldn’t happen by itself.'),
  tell(R(2, 2), 'Distinguish between the initial rate and the average rate of a reaction.', 'The initial rate is the rate at the very start, the gradient of the tangent to the curve at time zero.', 'The average rate is the total change divided by the time taken, over some interval.'),

  match(R(4, 1), [['Sodium thiosulphate with HCl', 'a pale yellow cloud of sulphur'], ['Magnesium with dilute HCl', 'hydrogen gas'], ['A zinc rod left in CuSO₄ solution', 'a reddish coating of copper'], ['A salt bridge', 'KNO₃ in agar jelly']]),
  match(R(4, 1), [['pH 1 to 2', 'red'], ['pH 7', 'green'], ['pH 10', 'blue'], ['pH 13 to 14', 'violet']]),
  match(R(4, 1), [['Raising the temperature by 10 °C', 'roughly doubles the rate'], ['Powdering a solid', 'gives more surface for reaction'], ['Diluting the acid', 'slows the reaction'], ['A steeper volume–time graph', 'a faster reaction']]),

  reason(R(2, 1), 'In the cell Zn/Zn²⁺//Cu²⁺/Cu, give reasons. (a) The zinc electrode loses mass. (b) The copper electrode gains mass.', '(a) Zinc atoms lose electrons and go into the solution as Zn²⁺ ions.', '(b) Cu²⁺ ions from the solution gain electrons and are deposited on it as copper.'),

  ar(R(1, 1), 'When the concentration of thiosulphate is doubled, the time for the cross to disappear is halved.', 'The rate of this reaction is proportional to the concentration of thiosulphate.', 1, 'Twice the rate makes the same amount of sulphur in half the time.'),
];

export default questions;
