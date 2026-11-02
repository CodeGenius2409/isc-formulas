// How the old Physics units map onto the 2028 syllabus, and what the syllabus leaves out.
// Each `out` rule quotes or names the part of the syllabus it relies on. Everything here is
// a human decision, made after reading both the syllabus and the entries.

/** Old unit number -> { unit: official number, sub: { old subtopic -> topic key } }. */
export const map = {
  XI: {
    1: { unit: 1, topic: 'a', sub: { 'Dimensions of Physical Quantities': 'b', 'Dimensional Analysis': 'b', 'Units & Dimensions': 'b', 'Vernier Callipers, Screw Gauge and Spherometer': 'p' } },
    2: { unit: 2, topic: 'b', sub: { 'Motion in a Straight Line': 'a', 'Calculus for Kinematics': 'a', 'Speed, Velocity and Frames of Reference': 'a', 'Uniformly Accelerated Motion': 'a', 'Motion Graphs': 'a', 'Motion Under Gravity': 'a' } },
    3: { unit: 3, topic: 'a', sub: { 'Equilibrium of Concurrent Forces': 'b', Friction: 'b', 'Newton’s Laws & Friction': 'b', 'Dynamics of Circular Motion': 'c' } },
    4: { unit: 4, topic: 'a', sub: { 'Collisions in One Dimension': 'b', 'Collisions in Two Dimensions': 'b' } },
    5: { unit: 5, topic: 'b', sub: { 'Centre of Mass': 'a', 'Moment of Inertia': 'c' } },
    6: { unit: 6, topic: 'b', sub: { 'Universal Law of Gravitation': 'a', 'Acceleration due to Gravity: Variation': 'a', 'Kepler’s Laws of Planetary Motion': 'a' } },
    7: { unit: 7, topic: 'b', sub: { Elasticity: 'a', 'Surface Tension': 'c' } },
    8: { unit: 8, topic: 'b', sub: { 'Temperature Scales': 'a', 'Thermal Expansion': 'a', Calorimetry: 'a', 'Heat Transfer: Conduction and Convection': 'a', 'Heat Transfer: Radiation': 'a', 'Newton’s Law of Cooling': 'a' } },
    9: { unit: 9, topic: 'a', sub: {} },
    10: { unit: 10, topic: 'b', sub: { 'Periodic Motion and SHM Fundamentals': 'a', 'Energy in SHM': 'a', 'Spring-Mass System': 'a', 'Simple and Physical Pendulum': 'a', 'Damped and Forced Oscillations': 'a' } },
  },
  XII: {
    1: { unit: 1, topic: 'a', sub: { 'Potential & Potential Energy': 'b', 'Capacitors & Dielectrics': 'b' } },
    2: { unit: 2, topic: 'a', sub: { 'Series, Parallel & Kirchhoff': 'b', 'Cells, EMF & Internal Resistance': 'b', 'Wheatstone, Metre Bridge & Potentiometer': 'b', 'Practical: Current Electricity': 'b' } },
    3: { unit: 3, topic: 'a', sub: { 'Magnetic Dipole & Bar Magnet': 'b', 'Magnetism of Matter': 'b', "Earth's Magnetism & Tangent Galvanometer": 'b' } },
    4: { unit: 4, topic: 'b', sub: { 'Faraday, Lenz & Induced EMF': 'a', Inductance: 'a', 'Units & Dimensions (EMI and AC)': 'a' } },
    5: { unit: 5, topic: 'a', sub: {} },
    6: { unit: 6, topic: 'a', sub: { 'Optical Instruments': 'b', 'Wave Optics: Huygens Principle': 'c', 'Interference & YDSE': 'c', Diffraction: 'c', Polarisation: 'c', 'Practical: Optics': 'p' } },
    7: { unit: 7, topic: 'a', sub: {} },
    8: { unit: 8, topic: 'a', sub: { 'Nuclear Size, Composition and Mass': 'b', 'Nuclear Reactions: Fission & Fusion': 'b', 'Radioactive Decay': 'b' } },
    9: { unit: 9, topic: 'b', sub: { 'Energy Bands & Intrinsic Semiconductors': 'a', 'Conductivity of Semiconductors': 'a' } },
  },
};

const out = (name, reason, ref, extra = {}) => ({ name, verdict: 'out', reason, ref, ...extra });
const notNeeded = (name, reason) => ({ name, verdict: 'not-needed', reason });
const review = (test, question) => ({ ...test, verdict: 'review', reason: question, force: true });

export const rules = [
  // Class XI
  { level: 'XI', sub: 'Rocket Propulsion', verdict: 'out', reason: 'Rockets and variable mass are not in Unit 3.', ref: 'XI Unit 3' },
  out(/Second law for variable mass/, 'Rockets and variable mass are not in Unit 3.', 'XI Unit 3'),
  out(/Range on inclined plane/, 'The syllabus says: "projectile motion on an inclined plane not included".', 'XI Unit 2(ii)(d)'),
  { level: 'XI', sub: 'Relative Velocity in a Plane', verdict: 'out', reason: 'Unit 2(ii) lists vectors, projectile motion and circular motion only. Relative velocity in a plane is not listed.', ref: 'XI Unit 2(ii)' },
  out(/Scalar triple product|Vector triple product/, 'Unit 2(ii) covers scalar and vector products of two vectors only.', 'XI Unit 2(ii)(c)'),
  out(/^Rolling|rolling body|Total KE rolling|Rolling without slipping|Rolling KE|Order of arrival on an incline|^Acceleration on incline|Friction force for rolling|Condition for rolling|Minimum friction coefficients on incline|Smooth incline \(pure sliding\)/, 'Rolling of rigid bodies is not in Unit 5. Only "rolling friction" appears, in Unit 3.', 'XI Unit 5'),
  out(/Pseudo force|Centrifugal force|Effective gravity in accelerating|Surface of liquid in accelerating|Block on accelerated wedge|Friction on block in accelerating|Hanging pendulum in accelerating|Free surface of liquid in horizontal|Rotating liquid surface|Pendulum in an accelerating lift|Pendulum in horizontally accelerating/, 'Non-inertial frames are not in the syllabus.', 'XI Unit 3'),
  out(/Centre of mass of (a rod with density|triangular|semicircular|solid hemisphere|hollow hemisphere|solid cone|hollow cone|a circular arc|a circular sector)|Centre of mass with a cavity/, 'The syllabus stops at the two-particle system and the uniform rod: "need not go into more details".', 'XI Unit 5'),
  out(/MI of (rectangular|square|cuboid|solid cone|thin triangular|annular|rod inclined|disc wi)|Composite bodies|MI in terms of density/, 'Only the ring, solid and hollow cylinder, thin rod, solid and hollow sphere, and disc are listed.', 'XI Unit 5'),
  out(/Binary star|Vis-viva|Self gravitational energy|(Field|Potential) on axis of a|Potential at centre of ring|Energy of a planet in elliptical orbit/, 'Not listed under Gravitation, which treats circular orbits and spherical bodies.', 'XI Unit 6'),
  out(/Pitot tube|Time to empty a tank|Fluid resistance|Velocity profile in a tube|Maximum and mean speed in a tube|Kinematic viscosity|Velocity of sphere before terminal/, 'Not listed under Mechanical Properties of Fluids.', 'XI Unit 7(ii)'),
  out(/Polytropic|polytropic|Heat pump|Entropy|entropy|Second law \(entropy|Efficiency of engine and refrigerator/, 'Physics covers the second law through the Kelvin and Clausius statements and Carnot\'s cycle. Entropy and polytropic processes are not listed.', 'XI Unit 8(ii)(e)'),
  out(/Luminosity of a star|Heat conduction through a (cylindrical|spherical) shell|Ice formation on a pond/, 'Not listed under Thermal Properties of Matter.', 'XI Unit 8(i)'),
  out(/Maxwell (speed )?distribution|Graham|Time of diffusion|Dulong/, 'Not listed under Kinetic Theory.', 'XI Unit 9'),
  { level: 'XI', sub: 'Damped and Forced Oscillations', verdict: 'out', reason: 'Damped and forced oscillations are not in Unit 10.', ref: 'XI Unit 10(i)' },
  out(/Doppler/, 'The Doppler effect is not in Unit 10.', 'XI Unit 10(ii)'),
  out(/Intensity level|Sound level|Bel and decibel|Threshold of hearing/, 'Sound level and decibels are not in Unit 10.', 'XI Unit 10(ii)'),
  out(/Melde/, 'Unit 10 names the sonometer, not Melde\'s experiment.', 'XI Unit 10(ii)(d)'),
  out(/[Cc]ompound pendulum|Physical \(compound\)|Uniform rod pivoted|Disc pivoted|Ring pivoted|Torsional pendulum|Liquid column in a U-tube|Floating cylinder in a liquid|Tunnel through the Earth|Ball rolling in a spherical bowl|Gas in a cylinder with a piston|Angular SHM|Pendulum with bob in a liquid|Pendulum of infinite length|Pendulum with a large amplitude|Combination of two SHM|Two masses connected by a spring/, 'Unit 10 names only the simple pendulum and a mass on a spring as SHM systems.', 'XI Unit 10(i)'),
  out(/Relativistic (momentum|kinetic energy)|Total relativistic energy/, 'Only m = m₀/√(1 − v²/c²) is mentioned, as a limit of F = ma.', 'XI Unit 3(a)'),

  notNeeded(/Dimensions of (jerk|mass flow rate|linear mass density|volume flow rate)|Dimension of angular frequency product|Dimensions of pressure and force relation/, 'A dimensional formula nobody is asked for.'),
  notNeeded(/^Barn$|Tonne, quintal and carat|Inch, foot, mile|Kinematic viscosity: stokes/, 'Not a unit the syllabus uses. It says "only S.I. units" apart from the ones it names.'),
  notNeeded(/Typical orders of magnitude/, 'Trivia, not used in answering questions.'),
  notNeeded(/^(Mass of Moon|Radius of Moon|Moon period of revolution|Sidereal day of Earth|Surface temperature of Sun|Radius of Sun|Escape speed from Moon|Speed of sound in water and steel|Young modulus of steel, copper, aluminium|Thermal conductivity of copper and aluminium|Coefficient of linear expansion of metals|Viscosity of air|Density of air \(STP\)|Density of ice|g on Moon and Sun)$/, 'A reference value. Papers give the data they need, in a table at the end.'),
  notNeeded(/Angular speed of clock hands|Time between two overlaps of clock hands|Reaction time from ruler drop|Time for trains to cross|Range equals maximum height|Ratio of maximum range to height at 45|Angle of projection when R = n|Maximum height at 45|Effect of g on range and height|Graph shapes for constant acceleration|Uniform acceleration graph facts|Distance vs displacement|Carnot efficiency cannot be 100|Why g varies on the surface|Fixed points of thermometers|Electrical analogue \(LC circuit\)|Needle floating on water|Capillary rise in an inclined tube|Capillary rise between two parallel plates|Detaching drop from a tube|Soap film between two plates/, 'A narrow worked result or restated fact, rather than a formula a student looks up.'),

  // Class XII
  { level: 'XII', sub: "Earth's Magnetism & Tangent Galvanometer", verdict: 'out', reason: "Earth's magnetism and the tangent galvanometer are not in Unit 3.", ref: 'XII Unit 3' },
  out(/Cyclotron|cyclotron|mass spectrometer|Thomson's method|Helmholtz coils|Coulomb's law for magnetic poles|Oscillation magnetometer/, 'Not listed in Unit 3.', 'XII Unit 3'),
  out(/LR time constant|Growth of current|RC time constant|Charging of capacitor|Current after one time constant|Initial rate of rise|Decay of current|Potential differences during LR|Heat dissipated during LR|Current during capacitor charging|Voltages during capacitor charging|Discharging of a capacitor|Charge at one time constant|Half-time of an RC|Time constants: dimensions/, 'Transient growth and decay in LR and RC circuits are not in Unit 4. Only LC oscillations appear, qualitatively.', 'XII Unit 4(ii)'),
  out(/Maxwell's equations|Poynting vector|Momentum of an EM wave|Radiation pressure|Force exerted by radiation|Force exerted by a beam|Plane EM wave fields|Energy densities of E and B|Total and average energy density|Intensity in terms of B|Intensity of spherical and cylindrical/, 'Unit 5 is "qualitative ideas only", and its marks are 2.', 'XII Unit 5'),
  out(/Cauchy's relation|Scattering of light|Newton's formula \(mirror and lens\)|Longitudinal magnification|Achromatic combination|Dispersion without deviation|Myopia|Hypermetropia|Terrestrial telescope|Galilean telescope|Fresnel distance|Visibility of fringes|Rayleigh criterion/, 'Not listed in Unit 6.', 'XII Unit 6'),
  out(/Duane|Moseley|Maximum photon energy from an X-ray|Bragg's law/, 'X-ray production and Bragg\'s law are not in Unit 7.', 'XII Unit 7'),
  out(/Impact parameter|Angular distribution of scattered/, 'The syllabus says: "mathematical theory of scattering excluded".', 'XII Unit 8(i)'),
  out(/Diode equation|Thermal voltage/, 'Unit 9 treats the diode through its V-I characteristic, not the diode equation.', 'XII Unit 9'),
  out(/Polarisation vector|Bound surface charge|Electric susceptibility|Electric displacement|Gauss law with dielectric|Van de Graaff|Millikan oil-drop|Spherical capacitor|Cylindrical capacitor|Flux through cube with charge at a vertex|Flux through a disc|Flux in terms of solid angle|Finite line charge|Charged ring on its axis|Maximum field on axis of a ring|Uniformly charged disc on|Semicircular charged wire|Hemispherical shell|Electrostatic pressure|Uniformly charged solid sphere|Self-energy of|Potential inside a uniformly charged solid|Potential on the axis of a (ring|disc)|Force on dipole in non-uniform|Oscillation of dipole|Induced dipole moment/, 'Unit 1 applies Gauss\'s theorem to the line, plane sheet and thin shell only, and treats the parallel plate capacitor only.', 'XII Unit 1'),
  out(/Resistor colour code|Colour code digits|Colour code tolerance/, 'The colour code is not in the 2028 syllabus.', 'XII Unit 2'),

  notNeeded(/^(Horse power|Fine-structure constant|Bohr magneton|Rydberg energy of hydrogen|Coulomb energy product in nuclear units)$/, 'Not used in ISC questions.'),
  notNeeded(/Lens cut (perpendicular|along)|Rotation of a plane mirror|Images formed by two inclined plane mirrors|Plane mirror image|Recoil of an atom on photon|Mass equivalent of a photon|Illuminated circle for a source/, 'A narrow result outside what Unit 6 and Unit 8 ask for.'),

  // Questions for the student
  review({ level: 'XII', sub: 'Radioactive Decay' }, 'Radioactivity is not in the 2028 syllabus and last appeared in the 2020 papers. Remove it, or keep it for reference?'),
  review({ name: /^(Radioactive decay law|Half-life|Mean life)$/ }, 'Radioactivity is not in the 2028 syllabus and last appeared in the 2020 papers. Remove it, or keep it for reference?'),
  review({ level: 'XII', sub: 'Polarisation' }, 'Polarisation is mentioned only in passing in Unit 7 ("exhibited in interference, diffraction and polarisation") and has not appeared since 2020. Remove it?'),
  review({ name: /^(Brewster’s law|Malus law)$/ }, 'Polarisation is mentioned only in passing in Unit 7 ("exhibited in interference, diffraction and polarisation") and has not appeared since 2020. Remove it?'),
  review({ level: 'XII', sub: 'Rectifiers', name: /ripple|Ripple|efficiency|Efficiency|rms current|dc current|Form factor/ }, 'The syllabus says rectifier circuits are "qualitative only". Are these numerical results worth keeping?'),
  review({ name: /^(Emissive power|Absorptive power|Kirchhoff’s law|Reflection, absorption, transmission)$/ }, 'Radiation terms like these are not named, but "qualitative ideas of Blackbody radiation" could include them. Keep them?'),
];

/** Subtopics of mostly narrow worked results: minor even when in the syllabus. */
export const supportingSubs = new Set(['Physical Constants', 'Standard Unit Conversions', 'Dimensions of Physical Quantities', 'Derived Units in SI Base Units', 'Prefixes and Other Units', 'Units & Dimensions (Electrostatics)', 'Units & Dimensions (Current Electricity)', 'Units & Dimensions (Magnetism)', 'Units & Dimensions (EMI and AC)', 'Physical Constants (Class XII)', 'Practical: Current Electricity', 'Practical: Optics', 'Vernier Callipers, Screw Gauge and Spherometer']);
