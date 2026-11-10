// Written by hand: laws of motion, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XI');
const A = at(3, 'a');
const B = at(3, 'b');
const C = at(3, 'c');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does a gun recoil when it is fired?', 'The bullet gains forward momentum, so the gun gains equal momentum backwards, keeping the total zero.'),
  reason(A(2, 2), 'Why does a tablecloth jerked quickly from under the dishes leave them nearly in place?', 'The dishes have inertia, which resists a change in their state of rest.', 'The jerk is so short that friction gives them only a tiny impulse.'),
  reason(A(2, 2), 'Why are cars built with crumple zones at the front?', 'The crumpling makes the collision last longer.', 'For the same change of momentum, a longer time means a smaller force on the passengers.'),
  reason(A(2, 3), 'A horse pulls a cart, and the cart pulls back on the horse with an equal force. Why do they move at all?', 'The two forces act on different bodies, so they don’t cancel.', 'The horse moves forward because the ground pushes it forward harder than the cart pulls back.'),
  reason(A(1, 2), 'Why does a person jumping from a height bend the knees on landing?', 'It lengthens the time of stopping, which lowers the force on the legs.'),
  short(A(2, 1), 'State Newton’s first law, and say what property of a body it describes.', 'A body stays at rest or in uniform motion in a straight line unless an external force acts on it.', 'It describes inertia.'),
  short(A(2, 2), 'Define impulse, and give its link with momentum.', 'Impulse is force multiplied by the time it acts, or ∫F dt.', 'It equals the change of momentum of the body.'),
  short(A(3, 2), 'State the law of conservation of linear momentum. Show how it follows from Newton’s third law for two colliding bodies.', 'With no external force, the total momentum of a system stays constant.', 'In the collision, F₁₂ = −F₂₁ act for the same time, so the impulses are equal and opposite.', 'So the momentum one gains, the other loses, and the total is unchanged.'),
  short(A(3, 3), 'State Newton’s second law in terms of momentum. Show that it gives F = ma, and say when that form fails.', 'The rate of change of momentum equals the applied force, F = dp/dt.', 'With p = mv and m constant, dp/dt = m dv/dt = ma.', 'It fails when the mass changes, as for a rocket burning fuel.'),
  short(A(2, 3), 'A rocket in space has nothing to push against. Explain how it speeds up, in terms of momentum.', 'It throws hot gas backwards at high speed, giving the gas backward momentum.', 'The rocket gains equal forward momentum, so the total stays the same.'),
  reason(B(1, 1), 'Why is it easier to keep a heavy box sliding than to start it?', 'Kinetic friction is smaller than the greatest static friction.'),
  reason(B(2, 2), 'Why does a lubricant make machine parts last longer?', 'It puts a thin film between the surfaces, which keeps them apart.', 'So there is less friction, heat and wear.'),
  reason(B(2, 2), 'Why do tyres have treads, though a smooth tyre has more rubber on the road?', 'On a wet road, treads let water escape from under the tyre.', 'Otherwise the tyre rides on water and loses its grip.'),
  reason(B(2, 3), 'Why is rolling friction far less than sliding friction?', 'A rolling body touches the surface over a very small area at a time.', 'It doesn’t have to drag its surface across the other, so there is little to resist.'),
  reason(B(1, 2), 'Why can a body stay in equilibrium with three forces on it, but not with one?', 'One force can’t be balanced, while three concurrent forces can add up to zero.'),
  short(B(2, 1), 'State two laws of limiting friction.', 'It acts along the surface, opposite to the motion that would happen.', 'It is proportional to the normal reaction, and doesn’t depend on the area in contact.'),
  short(B(2, 2), 'Define the angle of friction, and give its link with the coefficient of friction.', 'The angle between the normal reaction and the resultant of it with limiting friction.', 'tan θ = μ.'),
  short(B(3, 2), 'Give the condition for three concurrent forces to be in equilibrium. How can it be shown with a triangle?', 'Their vector sum must be zero.', 'Drawn head to tail in order, they form a closed triangle.', 'Each side is in proportion to one force, and parallel to it.'),
  short(B(3, 3), 'A block rests on a rough slope tilted at θ. Show that it just begins to slip when tan θ = μ.', 'Down the slope, mg sin θ pulls it, and the normal reaction is mg cos θ.', 'Limiting friction is μ mg cos θ, up the slope.', 'Slipping starts when mg sin θ = μ mg cos θ, so tan θ = μ.'),
  short(B(2, 3), 'Name two ways friction is reduced in machines, and one place where friction is needed.', 'Using ball bearings, and oiling the moving parts.', 'It is needed in brakes, to stop a vehicle.'),
  reason(C(1, 1), 'Why does mud fly off a spinning wheel along a tangent?', 'Once it leaves, no force pulls it to the centre, so it goes on in the direction it was moving.'),
  reason(C(2, 2), 'Why is there a greatest safe speed for a car on a level curve?', 'Friction between the tyres and road gives the centripetal force.', 'At higher speeds, mv²/r is more than the greatest friction, μmg, so the car skids out.'),
  reason(C(2, 2), 'Why is the outer rail raised above the inner one on a curved railway track?', 'The tilt makes part of the normal reaction point to the centre.', 'That gives the centripetal force, so the rails and flanges aren’t worn by sideways thrust.'),
  reason(C(2, 3), 'Why doesn’t water fall out of a bucket swung fast in a vertical circle, even at the top?', 'At the top, gravity and the bucket’s push together give the centripetal force.', 'If v²/r is at least g, gravity alone isn’t enough, so the water presses on the bucket and stays in.'),
  reason(C(1, 2), 'Why doesn’t a centripetal force do work on a body in uniform circular motion?', 'It is always at right angles to the velocity, so it does no work.'),
  short(C(2, 1), 'What provides the centripetal force in each: a stone whirled on a string; the Moon going around the Earth?', 'The tension in the string.', 'The Earth’s gravitational pull on the Moon.'),
  short(C(2, 2), 'Give the greatest safe speed on a level curve of radius r. Does it depend on the car’s mass?', 'v = √(μrg).', 'No, as the mass cancels on both sides.'),
  short(C(3, 2), 'For a road banked at θ with no friction, give the speed at which a car needs no friction to turn. Name the forces that act.', 'v = √(rg tan θ).', 'Its weight, mg, acts down.', 'The normal reaction acts at right angles to the road, and its horizontal part is the centripetal force.'),
  short(C(3, 3), 'A car takes a banked curve at a speed above the design speed. Which way does friction act, and why does that let it go faster?', 'Friction acts down the slope.', 'It adds to the horizontal part of the normal reaction.', 'So there is more centripetal force, which allows a higher speed.'),
  short(C(2, 3), 'Define centripetal acceleration, and give its size and direction for a body moving at v in a circle of radius r.', 'The acceleration a body needs to keep moving in a circle.', 'Its size is v²/r, towards the centre.'),
];

export default questions;
