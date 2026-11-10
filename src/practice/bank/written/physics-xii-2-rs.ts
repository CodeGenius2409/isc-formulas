// Written by hand: current electricity, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why do the electrons in a wire have a drift speed of only about a millimetre a second, though a lamp lights at once?', 'The field that drives them travels along the wire at nearly the speed of light, so they all start moving almost at once.'),
  reason(A(2, 2), 'Why does a wire’s resistance rise with temperature?', 'The positive ions vibrate more strongly.', 'So electrons collide with them more often, and the relaxation time falls.'),
  reason(A(2, 2), 'Why is manganin used for standard resistors, and not copper?', 'Its resistivity is high, so a short length gives the resistance needed.', 'Its temperature coefficient is very small, so its value hardly changes with heat.'),
  reason(A(1, 2), 'Why is a thick wire used for a heater’s lead, while its element is thin?', 'Heat goes as I²R, and the lead’s small resistance means it stays cool while the thin, high-resistance element gets hot.'),
  reason(A(2, 3), 'A wire is stretched to double its length. Why does its resistance rise four times, not two?', 'Its length doubles.', 'Its volume stays the same, so its area halves, and R = ρL/A gives four times.'),
  short(A(2, 1), 'State Ohm’s law, and name two conductors that do not follow it.', 'At constant temperature, the current in a conductor is proportional to the potential difference across it.', 'A semiconductor diode, and a thermistor or an electrolyte.'),
  short(A(2, 2), 'Define drift velocity and relaxation time.', 'Drift velocity is the average velocity of the free electrons under an electric field.', 'Relaxation time is the average time between their collisions.'),
  short(A(2, 2), 'Define the resistivity of a material, and state its SI unit.', 'The resistance of a piece of it with unit length and unit area of cross-section.', 'The ohm metre.'),
  short(A(3, 2), 'Why is electric power sent over long distances at high voltage? Use the formula for the heat lost in the lines.', 'For a given power, a higher voltage means a smaller current, as P = VI.', 'Heat lost in the lines is I²R.', 'So less current means much less heat wasted.'),
  short(A(3, 3), 'How do resistivity and temperature relate for a metal, a semiconductor and an alloy?', 'For a metal, it rises roughly in a straight line.', 'For a semiconductor, it falls steeply, as more charge carriers are freed.', 'For an alloy, it rises very slightly.'),
  reason(B(1, 1), 'A cell’s terminal voltage falls as it gives more current. Why?', 'More of its emf is dropped across its internal resistance.'),
  reason(B(2, 2), 'A potentiometer can measure the emf of a cell, while a voltmeter cannot. Why?', 'At balance, the potentiometer takes no current from the cell, so nothing is lost across the internal resistance.', 'A voltmeter draws some current, so it reads below the emf.'),
  reason(B(2, 2), 'Why is a Wheatstone bridge most sensitive when all four arms have about the same resistance?', 'Then a small change in one arm gives the largest current through the galvanometer.', 'So the balance point can be found most exactly.'),
  reason(B(2, 3), 'Why is a thick copper strip used to join the wires in a metre bridge?', 'It has almost no resistance.', 'So nothing unknown is added to the arms of the bridge.'),
  short(B(2, 1), 'State Kirchhoff’s two laws. Which law of conservation does each follow from?', 'The currents meeting at a junction add up to zero: conservation of charge.', 'Round a closed loop, the emfs equal the sum of IR: conservation of energy.'),
  short(B(2, 2), 'A cell’s terminals are joined by a thick copper wire. What is its terminal voltage then, and why?', 'Zero, as the wire’s resistance is nearly zero, so the current is E/r.', 'V = E − Ir = E − (E/r)r = 0: all of the emf drives current through the cell itself.'),
  short(B(3, 2), 'n identical cells, each of emf E and internal resistance r, are joined in series. Give the emf and internal resistance of the group, and repeat for n in parallel.', 'In series: nE and nr.', 'In parallel: E and r/n.', 'Series suits a large external load, and parallel a small one.'),
  short(B(3, 3), 'Give three ways of making a potentiometer more sensitive.', 'Use a longer wire.', 'Reduce the current in the wire with a rheostat in the main circuit.', 'Both lower the potential gradient, so a small voltage difference moves the balance point further.'),
];

export default questions;
