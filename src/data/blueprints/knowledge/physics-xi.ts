// Physics, Class XI: knowledge added to what physics-xi.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import MORE_A from './more/physics-xi-a';

/** Points along a curve, for a sketch in an answer. These carry no values from any question. */
const curve = (f: (x: number) => number, from: number, to: number, steps = 24): [number, number][] => Array.from({ length: steps + 1 }, (_, i) => {
  const x = from + ((to - from) * i) / steps;
  return [x, f(x)];
});

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['zero error', 'A screw gauge’s zero error must be corrected in every reading.', 'A screw gauge’s zero error goes away if many readings are taken.', 'It shifts all the readings by the same amount.', 'It changes at random from one reading to the next.', 'A screw gauge has a circular scale.'],
      ['significant figures', 'A result found by multiplying can’t have more significant figures than the least precise value used.', 'A product always has as many significant figures as the most precise value used.', 'A result can’t be more precise than the least precise value that went into it.', 'Multiplying always makes a measurement more precise.', 'Zeros between non-zero digits are significant.'],
      ['least count', 'A vernier calliper measures length more precisely than a metre rule.', 'A metre rule measures length more precisely than a vernier calliper.', 'The vernier calliper has the smaller least count.', 'A metre rule has the smaller least count.', 'The least count is the smallest value an instrument can measure directly.'],
    ],
  },
  '1b': {
    ar: [
      ['checking a formula', 'v = u + at is dimensionally correct.', 'v = u + at is dimensionally wrong.', 'Each term has the dimensions [L T⁻¹].', 'Each term has the dimensions [L T⁻²].', 'Dimensional analysis can show that a formula is wrong, but not that it is right.'],
      ['homogeneity of dimensions', 'Force and energy can’t be added together.', 'Force and energy can be added together.', 'Only quantities with the same dimensions can be added.', 'Only quantities with different dimensions can be added.', 'Each term of a correct equation has the same dimensions.'],
      ['dimensionless quantities', 'Strain has no dimensions.', 'Strain has the dimensions of length.', 'It is a ratio of two lengths.', 'It is a product of two lengths.', 'Angle, too, is a dimensionless quantity.'],
    ],
  },
  '2a': {
    answerFigures: {
      'Sketch the velocity–time graph': { kind: 'graph', x: 'Time', y: 'Velocity', lines: [{ points: [[0, 2], [4, -2]] }], ticksY: [[2, 'u'], [-2, '−u']], ticksX: [[2, 'top'], [4, 'return']] },
    },
    ar: [
      ['relative velocity', 'Two trains going the same way at 50 km/h and 40 km/h see each other move at 10 km/h.', 'Two trains going the same way at 50 km/h and 40 km/h see each other move at 90 km/h.', 'The relative velocity is the difference of their velocities.', 'The relative velocity is the sum of their speeds.', 'Trains going opposite ways approach at the sum of their speeds.'],
      ['the area under a graph', 'The area under a velocity–time graph gives the displacement.', 'The area under a velocity–time graph gives the acceleration.', 'Velocity multiplied by time is displacement.', 'Velocity divided by time is displacement.', 'A v–t graph below the time axis shows motion in the negative direction.'],
      ['distance and displacement', 'The magnitude of the displacement can never exceed the distance travelled.', 'The magnitude of the displacement can exceed the distance travelled.', 'The straight line between two points is the shortest path between them.', 'A curved path is the shortest path between two points.', 'Distance is a scalar, and displacement is a vector.'],
    ],
  },
  '2b': {
    ar: [
      ['the speed at the top', 'A projectile has its least speed at its highest point.', 'A projectile has zero speed at its highest point.', 'Its vertical velocity is zero there, leaving only the horizontal part.', 'Both parts of its velocity are zero there.', 'Its acceleration is g throughout its flight.'],
      ['the range of a projectile', 'Launch angles of 30° and 60° give the same range at the same speed.', 'Launch angles of 30° and 60° give ranges in the ratio 1 : 2 at the same speed.', 'The range depends on sin 2θ, which is the same for both.', 'The range depends on tan θ, which is the same for both.', 'The range is greatest at a launch angle of 45°.'],
      ['vector addition', 'Two equal vectors at 120° have a resultant equal to either of them.', 'Two equal vectors at 120° have a resultant twice as large as either of them.', 'R² = 2A² + 2A² cos 120° = A².', 'R² = 2A² − 2A² cos 120° = A².', 'The resultant of two vectors depends on the angle between them.'],
    ],
  },
  '3a': {
    answerFigures: {
      'Draw a free-body diagram of a person standing in a lift': { kind: 'block', m: 'person', forces: [{ dir: 'up', label: 'N' }, { dir: 'down', label: 'mg' }] },
    },
    ar: [
      ['the third law', 'Action and reaction don’t cancel each other.', 'Action and reaction cancel each other, as they are equal and opposite.', 'They act on different bodies.', 'They act on the same body.', 'Action and reaction forces are always equal in size.'],
      ['stopping time', 'A person jumping onto sand is hurt less than one jumping onto concrete.', 'A person jumping onto sand is hurt more than one jumping onto concrete.', 'Sand makes the stopping time longer, so the force is smaller for the same change of momentum.', 'Sand makes the change of momentum larger.', 'Impulse has the unit N s.'],
      ['the first law and inertia', 'A coin on a card drops into a glass when the card is flicked away quickly.', 'A coin on a card flies off with the card when the card is flicked away quickly.', 'The coin tends to stay at rest, because of its inertia.', 'The flick pushes the coin downwards.', 'Mass is a measure of inertia.'],
    ],
  },
  '3b': {
    ar: [
      ['the limit of static friction', 'Static friction can take any value up to a limit.', 'Static friction always has its greatest possible value.', 'It only has to balance the applied force until the body starts to slide.', 'It only depends on the speed of the body.', 'The limiting friction is equal to μₛN.'],
      ['kinetic and static friction', 'It takes less force to keep a box sliding than to start it.', 'It takes more force to keep a box sliding than to start it.', 'Kinetic friction is smaller than limiting static friction.', 'Kinetic friction is larger than limiting static friction.', 'Friction opposes relative motion between the surfaces.'],
      ['the angle of repose', 'A block on a rough slope begins to slide once tan θ exceeds μₛ.', 'A block on a rough slope begins to slide once sin θ exceeds 1.', 'Along the slope, mg sin θ then exceeds the limit μₛ mg cos θ.', 'Along the slope, the normal reaction then becomes zero.', 'The mass of the block doesn’t affect the angle at which it slides.'],
    ],
  },
  '3c': {
    ar: [
      ['banking a road', 'Roads are banked on curves.', 'Roads are banked on curves to increase friction.', 'A part of the normal reaction then provides the centripetal force.', 'A banked road makes the car’s weight smaller.', 'A banked road has a best speed at which no friction is needed.'],
      ['centripetal force', 'A body moving in a circle at a steady speed is accelerating.', 'A body moving in a circle at a steady speed has no acceleration.', 'The direction of its velocity keeps changing.', 'The size of its velocity keeps changing.', 'This acceleration is directed towards the centre of the circle.'],
      ['the size of the centripetal force', 'Doubling the speed in a circle makes the centripetal force four times as large.', 'Doubling the speed in a circle makes the centripetal force twice as large.', 'The force is proportional to the square of the speed.', 'The force is proportional to the speed itself.', 'A centripetal force does no work on the moving body.'],
    ],
  },
  '4a': {
    ar: [
      ['work by a perpendicular force', 'The tension in a string does no work on a stone in uniform circular motion.', 'The tension in a string does positive work on a stone in uniform circular motion.', 'The force is perpendicular to the displacement at every instant.', 'The force is parallel to the displacement at every instant.', 'The stone’s kinetic energy stays constant.'],
      ['conservative forces', 'The work done by gravity depends only on the start and end heights.', 'The work done by gravity depends on the path taken.', 'Gravity is a conservative force.', 'Gravity is a non-conservative force.', 'The spring force is also conservative.'],
      ['friction on a slope', 'A block reaches the bottom of a rough slope with less kinetic energy than on a smooth one.', 'A block reaches the bottom of a rough slope with more kinetic energy than on a smooth one.', 'Friction turns part of its energy into heat.', 'Friction adds energy to the block.', 'The block loses the same potential energy on both slopes.'],
    ],
  },
  '4b': {
    ar: [
      ['inelastic collisions', 'Momentum is conserved in an inelastic collision.', 'Momentum isn’t conserved in an inelastic collision.', 'No external force acts on the colliding bodies during the collision.', 'The kinetic energy of the bodies stays constant.', 'Kinetic energy isn’t conserved in an inelastic collision.'],
      ['the elastic collision of equal masses', 'Two equal masses exchange velocities in a head-on elastic collision.', 'Two equal masses stop dead in a head-on elastic collision.', 'Both momentum and kinetic energy are conserved, which together require this.', 'Kinetic energy is lost entirely in the collision.', 'The coefficient of restitution is 1 in an elastic collision.'],
      ['the coefficient of restitution', 'A ball that rebounds to a quarter of its height has e = 0.5.', 'A ball that rebounds to a quarter of its height has e = 0.25.', 'e is the square root of the ratio of the heights.', 'e is the ratio of the heights itself.', 'The coefficient of restitution lies between 0 and 1.'],
    ],
  },
  '5a': {
    ar: [
      ['the centre of mass in a body', 'The centre of mass of a ring lies at a point with no mass.', 'The centre of mass of a ring lies on the ring.', 'By symmetry it must be at the ring’s centre, which is empty.', 'The ring’s mass is concentrated at its centre.', 'A centre of mass need not lie within the material of a body.'],
      ['the motion of the centre of mass', 'A system’s centre of mass accelerates only when a net external force acts.', 'A system’s centre of mass accelerates even with no net external force.', 'The net external force equals the total mass times the centre of mass’s acceleration.', 'The net internal force equals the total mass times the centre of mass’s acceleration.', 'The centre of mass of a uniform rod is at its middle.'],
      ['position of the centre of mass', 'The centre of mass of two unequal masses lies nearer the heavier one.', 'The centre of mass of two unequal masses lies nearer the lighter one.', 'm₁r₁ = m₂r₂ about the centre of mass.', 'm₁r₂ = m₂r₁ about the centre of mass, and nothing else holds.', 'For two equal masses, it lies half-way between them.'],
    ],
  },
  '5b': {
    ar: [
      ['the conservation of angular momentum', 'A skater spins faster on pulling in the arms.', 'A skater spins slower on pulling in the arms.', 'The moment of inertia falls while the angular momentum stays the same.', 'The angular momentum rises when the arms are pulled in.', 'No external torque acts on the skater about the vertical axis.'],
      ['torque', 'A door handle is placed far from the hinges.', 'A door handle is placed near the hinges, to increase the torque.', 'The same force then gives a larger torque.', 'The same force then gives a smaller torque.', 'Torque is the force multiplied by its perpendicular distance from the axis.'],
      ['the equilibrium of a rigid body', 'A rigid body in equilibrium has no net force and no net torque on it.', 'A rigid body in equilibrium needs only no net force on it.', 'A body could rotate under a couple even with no net force.', 'A couple always moves a body in a straight line.', 'A couple is two equal and opposite forces with different lines of action.'],
    ],
  },
  '5c': {
    ar: [
      ['the distribution of mass', 'A ring has a larger moment of inertia than a disc of the same mass and radius.', 'A ring has a smaller moment of inertia than a disc of the same mass and radius.', 'All of the ring’s mass is at the greatest distance from the axis.', 'All of the disc’s mass is at the greatest distance from the axis.', 'Moment of inertia depends on the axis chosen.'],
      ['rolling', 'A solid sphere reaches the foot of a slope before a hollow sphere of the same size.', 'A hollow sphere reaches the foot of a slope before a solid sphere of the same size.', 'Less of the solid sphere’s energy goes into rotation.', 'More of the solid sphere’s energy goes into rotation.', 'A rolling body has both translational and rotational kinetic energy.'],
      ['the theorems of inertia', 'The perpendicular axes theorem applies only to flat bodies.', 'The perpendicular axes theorem applies to all bodies.', 'Its proof needs all the mass to lie in a single plane.', 'Its proof needs the mass to be a point.', 'The parallel axes theorem applies to any body.'],
    ],
  },
  '6a': {
    ar: [
      ['orbital speed', 'A satellite nearer the Earth moves faster than one further away.', 'A satellite nearer the Earth moves slower than one further away.', 'Orbital speed is √(GM/r), which rises as r falls.', 'Orbital speed is √(GMr), which rises as r rises.', 'A geostationary satellite has a period of 24 hours.'],
      ['g inside the Earth', 'The value of g is zero at the centre of the Earth.', 'The value of g is greatest at the centre of the Earth.', 'The pull of the mass around the centre cancels in every direction.', 'There is no matter at the centre of the Earth.', 'The value of g falls steadily with depth, if the density is taken as uniform.'],
      ['universal gravitation', 'The gravitational force between two bodies acts even with nothing between them.', 'The gravitational force between two bodies needs a medium between them.', 'Gravity doesn’t depend on the medium between the masses.', 'Gravity acts only through air.', 'The force falls off as the square of the distance.'],
    ],
  },
  '6b': {
    ar: [
      ['escape velocity', 'The escape velocity from a place doesn’t depend on the mass of the body.', 'The escape velocity is larger for a heavier body.', 'The mass cancels from ½mv² = GMm/R.', 'The mass of the body adds to the planet’s gravity.', 'The escape velocity from the Earth’s surface is about 11.2 km/s.'],
      ['the energy of a satellite', 'A satellite’s total energy is negative.', 'A satellite’s total energy is positive.', 'It is bound to the Earth, as its potential energy is twice its kinetic energy in size.', 'Its kinetic energy is twice its potential energy in size.', 'A satellite’s kinetic energy is half the size of its potential energy.'],
      ['orbits', 'A satellite’s orbital speed falls as its orbit gets larger.', 'A satellite’s orbital speed rises as its orbit gets larger.', 'v = √(GM/r), so v falls as r rises.', 'v = √(GMr), so v rises with r.', 'A geostationary satellite has a period of 24 hours.'],
    ],
  },
  '7a': {
    answerFigures: {
      'Sketch a stress–strain graph': { kind: 'graph', x: 'Strain', y: 'Stress', lines: [{ points: [[0, 0], [2, 4], [3, 4.5], [4, 4.8], [6, 5.2], [7, 4.8]] }], ticksX: [[2, 'Elastic limit'], [7, 'Breaking']] },
    },
    ar: [
      ['a thicker wire', 'A wire of twice the radius stretches a quarter as much under the same load.', 'A wire of twice the radius stretches half as much under the same load.', 'Its extension is inversely proportional to its area, which goes with r².', 'Its extension is inversely proportional to its radius.', 'Young’s modulus has the same unit as stress.'],
      ['ductile materials', 'Copper can be drawn into thin wires.', 'Copper snaps at once when drawn into thin wires.', 'It has a long plastic range before it breaks.', 'It breaks as soon as it passes its elastic limit.', 'Glass is a brittle material.'],
      ['the wire under load', 'Doubling a wire’s length doubles its extension under the same load.', 'Doubling a wire’s length halves its extension under the same load.', 'The extension is FL/AY, which is proportional to L.', 'The extension is FA/LY, which is inversely proportional to L.', 'Young’s modulus depends on the material, not on the size of the wire.'],
    ],
  },
  '7b': {
    ar: [
      ['Bernoulli’s principle', 'The pressure falls where a fluid speeds up.', 'The pressure rises where a fluid speeds up.', 'The sum of the pressure and kinetic energy per unit volume stays constant on level ground.', 'Fast fluid has more mass per unit volume.', 'The principle applies to steady, non-viscous flow.'],
      ['the equation of continuity', 'Water speeds up when a pipe narrows.', 'Water slows down when a pipe narrows.', 'The volume passing each second, Av, stays the same.', 'The pressure of the water is the same everywhere.', 'Water is nearly incompressible.'],
      ['terminal velocity', 'A falling raindrop reaches a steady speed.', 'A falling raindrop keeps accelerating at g until it lands.', 'The viscous drag grows until the forces on it balance.', 'Gravity stops acting on it after a while.', 'Larger drops have larger terminal velocities.'],
    ],
  },
  '7c': {
    ar: [
      ['a floating needle', 'A greased needle can float on still water.', 'A greased needle always sinks in still water.', 'The surface film of the water supports its weight.', 'Its density is less than that of water.', 'Steel is denser than water.'],
      ['capillary rise', 'Water rises higher in a thinner capillary tube.', 'Water rises lower in a thinner capillary tube.', 'h = 2S cos θ/(ρgr), so h is larger for smaller r.', 'h = 2Sr cos θ/(ρg), so h is larger for larger r.', 'Mercury is depressed in a glass capillary.'],
      ['the angle of contact', 'Mercury doesn’t wet glass.', 'Mercury wets glass.', 'Its angle of contact with glass is greater than 90°.', 'Its angle of contact with glass is 0°.', 'Water wets clean glass.'],
    ],
  },
  '8a': {
    ar: [
      ['expansion', 'Railway lines have small gaps between sections.', 'Railway lines have small gaps between sections, to reduce friction.', 'The lengths of rail expand when they get hot.', 'The lengths of rail shrink when they get hot.', 'Steel has a linear expansivity of about 1.2 × 10⁻⁵ per K.'],
      ['the anomalous expansion of water', 'A lake freezes from the top downwards.', 'A lake freezes from the bottom upwards.', 'Water is densest at 4 °C, so colder water stays on top.', 'Water is densest at 0 °C, so colder water stays on top.', 'Ice is less dense than liquid water.'],
      ['heat transfer', 'Metal feels colder than wood at the same temperature.', 'Metal feels warmer than wood at the same temperature.', 'Metal conducts heat away from the hand faster.', 'Metal is really at a lower temperature than the wood.', 'Radiation needs no medium.'],
    ],
  },
  '8b': {
    answerFigures: {
      'Sketch isothermal and adiabatic curves': { kind: 'graph', x: 'Volume', y: 'Pressure', lines: [{ label: 'Isothermal', points: curve((v) => 2 / v, 1, 5) }, { label: 'Adiabatic', points: curve((v) => 2 / v ** 1.4, 1, 5) }] },
    },
    ar: [
      ['the limit on an engine', 'No heat engine working between two temperatures can beat a Carnot engine.', 'A real heat engine can beat a Carnot engine at the same temperatures.', 'A reversible cycle has the greatest possible efficiency.', 'A Carnot engine wastes more heat than any other engine.', 'A Carnot engine’s efficiency is 1 − T₂/T₁.'],
      ['the first law', 'In an isothermal expansion of an ideal gas, all the heat taken in becomes work.', 'In an isothermal expansion of an ideal gas, all the heat taken in raises the internal energy.', 'The internal energy of an ideal gas depends only on its temperature.', 'The internal energy of an ideal gas depends only on its volume.', 'The first law is a statement of the conservation of energy.'],
      ['adiabatic change', 'A gas cools on expanding adiabatically.', 'A gas warms on expanding adiabatically.', 'The work is done at the cost of its own internal energy.', 'It takes in heat from its surroundings as it expands.', 'No heat enters or leaves in an adiabatic change.'],
    ],
  },
  '9a': {
    ar: [
      ['degrees of freedom', 'Cₚ of a diatomic gas is larger than that of a monatomic gas.', 'Cₚ of a diatomic gas is smaller than that of a monatomic gas.', 'Its molecules also store energy in rotation.', 'Its molecules are lighter.', 'A monatomic gas has three degrees of freedom.'],
      ['the meaning of temperature', 'All ideal gases at one temperature have the same mean kinetic energy per molecule.', 'A heavier gas at one temperature has a greater mean kinetic energy per molecule.', 'The mean kinetic energy per molecule is 3kT/2, which depends only on T.', 'The mean kinetic energy per molecule is 3kT/2m, which depends on the mass.', 'Lighter molecules have a larger rms speed at the same temperature.'],
      ['the pressure of a gas', 'A gas exerts pressure on the walls of its container.', 'A gas exerts pressure only on the base of its container.', 'Its molecules collide with the walls and change momentum.', 'Its molecules repel the walls from a distance.', 'P = ⅓ρc² for an ideal gas.'],
    ],
  },
  '10a': {
    answerFigures: {
      'Sketch how kinetic and potential energy vary': { kind: 'graph', x: 'Displacement', y: 'Energy', lines: [{ label: 'Potential', points: curve((x) => x * x, -2, 2) }, { label: 'Kinetic', points: curve((x) => 4 - x * x, -2, 2) }], ticksX: [[-2, '−A'], [2, 'A']] },
    },
    ar: [
      ['the period of a pendulum', 'A pendulum clock runs slow on a mountain.', 'A pendulum clock runs fast on a mountain.', 'The value of g is smaller there, so the period is longer.', 'The value of g is greater there, so the period is longer.', 'A pendulum’s period doesn’t depend on the mass of its bob.'],
      ['energy in SHM', 'In SHM, the kinetic energy is greatest at the mean position.', 'In SHM, the kinetic energy is greatest at the extreme positions.', 'The speed is greatest there.', 'The speed is zero there.', 'The total energy stays constant in undamped SHM.'],
      ['resonance', 'Soldiers break step when crossing a bridge.', 'Soldiers march in step when crossing a bridge, to make it safer.', 'Their steady steps could match the bridge’s natural frequency.', 'Their steady steps reduce the weight on the bridge.', 'At resonance, the amplitude of forced oscillation is at its largest.'],
    ],
  },
  '10b': {
    answerFigures: {
      'Draw the first two modes': { kind: 'graph', x: 'Along the string', y: 'Displacement', lines: [{ label: 'First mode', points: curve((x) => Math.sin(Math.PI * x), 0, 1) }, { label: 'Second mode', points: curve((x) => Math.sin(2 * Math.PI * x), 0, 1) }], ticksX: [[0.5, 'Node, second mode']] },
    },
    ar: [
      ['sound in gases', 'Sound travels faster in warm air than in cold air.', 'Sound travels slower in warm air than in cold air.', 'The speed of sound is proportional to the square root of the absolute temperature.', 'The speed of sound is proportional to the pressure of the air.', 'Sound travels at about 330 m/s in air at 0 °C.'],
      ['beats', 'Beats need two frequencies that are close to each other.', 'Beats need two frequencies that are exactly equal.', 'The ear can follow only slow changes of loudness, and the beat frequency is the difference.', 'The ear hears the sum of the two frequencies as the beat.', 'At one beat in each second, the two frequencies differ by 1 Hz.'],
      ['organ pipes', 'A closed pipe gives only odd harmonics.', 'A closed pipe gives only even harmonics.', 'It must have a node at the closed end and an antinode at the open end.', 'It must have an antinode at both ends.', 'An organ pipe’s note depends on its length.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A);
