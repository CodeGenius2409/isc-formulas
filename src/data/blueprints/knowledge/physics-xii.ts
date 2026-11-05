// Physics, Class XII: knowledge added to what physics-xii.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import MORE_A from './more/physics-xii-a';
import MORE_B from './more/physics-xii-b';
import MORE_C from './more/physics-xii-c';
import MORE_D from './more/physics-xii-d';

/** Points along a curve, for a sketch in an answer. These carry no values from any question. */
const curve = (f: (x: number) => number, from: number, to: number, steps = 24): [number, number][] => Array.from({ length: steps + 1 }, (_, i) => {
  const x = from + ((to - from) * i) / steps;
  return [x, f(x)];
});

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['field lines', 'Two electric field lines never cross.', 'Two electric field lines often cross.', 'At a crossing, the field would have two directions at one point.', 'At a crossing, the charge would be zero.', 'Field lines start on positive charges and end on negative ones.'],
      ['the field inside a conductor', 'The electric field inside a charged conductor is zero under static conditions.', 'The electric field inside a charged conductor is greatest at its centre.', 'Free charges move until they cancel any field inside.', 'A conductor has no free charges.', 'Excess charge on a conductor stays on its outer surface.'],
      ['Gauss’s theorem', 'The total flux through a closed surface doesn’t depend on charges outside it.', 'The total flux through a closed surface depends on charges outside it.', 'Each field line from an outside charge enters and also leaves the surface.', 'An outside charge has no field at all at the surface.', 'The flux through a closed surface is q/ε₀, where q is the charge enclosed.'],
      ['a dipole in a uniform field', 'A dipole in a uniform field feels a torque, but no net force.', 'A dipole in a uniform field feels a net force, but no torque.', 'The forces on its two charges are equal and opposite, and don’t share a line.', 'The forces on its two charges are equal and in the same direction.', 'The torque on a dipole is pE sin θ.'],
    ],
  },
  '1b': {
    ar: [
      ['the capacitor and a dielectric', 'Putting a dielectric in a capacitor raises its capacitance.', 'Putting a dielectric in a capacitor lowers its capacitance.', 'The induced charges on the dielectric reduce the field and the potential difference for the same charge.', 'A dielectric conducts charge between the plates.', 'The factor by which it rises is the dielectric constant.'],
      ['equipotential surfaces', 'No work is done in moving a charge along an equipotential surface.', 'Work is always done in moving a charge along an equipotential surface.', 'The potential difference between any two points on it is zero.', 'The field along it is greatest.', 'An electric field is perpendicular to an equipotential surface.'],
      ['the potential on a conductor', 'The potential inside a charged hollow conductor is the same as on its surface.', 'The potential inside a charged hollow conductor is zero.', 'The field inside is zero, so no work is needed to move a charge there.', 'The charge is spread evenly through its inside.', 'A sharp point on a conductor has the highest charge density.'],
      ['the energy of a capacitor', 'Half the energy from the battery is lost in charging a capacitor through a resistance.', 'All the energy from the battery is stored in a capacitor charged through a resistance.', 'The battery gives QV, while the capacitor stores ½QV.', 'The battery gives ½QV, while the capacitor stores QV.', 'The energy stored in a capacitor is ½CV².'],
    ],
  },
  '2a': {
    answerFigures: {
      'Sketch how the resistivity of a metal': { kind: 'graph', x: 'Temperature', y: 'Resistivity', lines: [{ points: curve((t) => 1 + 0.2 * t + 0.01 * t * t, 0, 6) }] },
    },
    ar: [
      ['the resistivity of metals', 'The resistance of a metal rises with temperature.', 'The resistance of a metal falls with temperature.', 'Its ions vibrate more, so electrons collide with them more often.', 'It has fewer free electrons at higher temperatures.', 'The temperature coefficient of a metal is positive.'],
      ['resistance and resistivity', 'Resistivity doesn’t depend on the size of a wire.', 'Resistivity is doubled when a wire’s length is doubled.', 'It is a property of the material at a given temperature.', 'It is a property only of the wire’s shape.', 'The resistance of a wire is proportional to its length.'],
      ['drift speed', 'A bulb lights almost at once, though electrons drift very slowly.', 'A bulb takes hours to light, as electrons drift very slowly.', 'The electric field travels along the wire at nearly the speed of light.', 'The electrons travel along the wire at nearly the speed of light.', 'Drift speeds are of the order of a millimetre per second.'],
      ['heating and power', 'In a series circuit, the larger resistance has the larger heating.', 'In a series circuit, the smaller resistance has the larger heating.', 'The current is the same, and P = I²R.', 'The voltage is the same, and P = V²/R.', 'In a parallel circuit, the smaller resistance has the larger heating.'],
    ],
  },
  '2b': {
    ar: [
      ['the emf and terminal voltage', 'The terminal voltage of a cell delivering current is less than its emf.', 'The terminal voltage of a cell delivering current is greater than its emf.', 'Some voltage is lost across its internal resistance.', 'The cell’s emf rises as current is drawn.', 'The terminal voltage equals the emf on an open circuit.'],
      ['Kirchhoff’s laws', 'Kirchhoff’s junction rule is a statement of the conservation of charge.', 'Kirchhoff’s junction rule is a statement of the conservation of energy.', 'Charge can’t pile up at a junction.', 'Energy can’t pile up at a junction.', 'Kirchhoff’s loop rule is a statement of the conservation of energy.'],
      ['the potentiometer', 'A potentiometer measures emf better than a voltmeter.', 'A voltmeter measures emf better than a potentiometer.', 'At balance, it draws no current from the cell.', 'At balance, it draws the largest current from the cell.', 'A long, uniform wire makes a potentiometer more sensitive.'],
      ['the Wheatstone bridge', 'A balanced Wheatstone bridge has no current through its galvanometer.', 'A balanced Wheatstone bridge has its largest current through its galvanometer.', 'The two ends of the galvanometer are at the same potential.', 'The galvanometer has no resistance.', 'At balance, P/Q = R/S.'],
    ],
  },
  '3a': {
    ar: [
      ['the magnetic force and work', 'A magnetic field does no work on a moving charge.', 'A magnetic field always does work on a moving charge.', 'The force is perpendicular to the velocity at every instant.', 'The force is parallel to the velocity at every instant.', 'The speed of a charge in a magnetic field alone stays the same.'],
      ['parallel currents', 'Two parallel wires with currents in the same direction attract each other.', 'Two parallel wires with currents in the same direction repel each other.', 'Each lies in the other’s magnetic field, which gives a force towards it.', 'Like charges in the two wires attract each other.', 'The ampere can be defined from this force.'],
      ['the shunt and the ammeter', 'An ammeter has a very low resistance.', 'An ammeter has a very high resistance.', 'It is connected in series, and mustn’t change the current much.', 'It is connected in parallel, and mustn’t change the voltage much.', 'A galvanometer is made into an ammeter with a small shunt.'],
      ['the cyclotron', 'A cyclotron’s frequency doesn’t depend on the speed of the particle.', 'A cyclotron’s frequency rises as the particle speeds up.', 'The radius grows with the speed, so the time for each circle stays the same.', 'The magnetic field weakens as the particle speeds up.', 'The period of a charge in a field is 2πm/(qB).'],
    ],
  },
  '3b': {
    answerFigures: {
      'Sketch a hysteresis loop': { kind: 'graph', x: 'H', y: 'B', lines: [{ points: [...curve((h) => 2 * Math.tanh(h + 1), -3, 3), ...curve((h) => 2 * Math.tanh(h - 1), 3, -3)] }], ticksY: [[1.52, 'Retentivity']], ticksX: [[-1, 'Coercivity']] },
    },
    ar: [
      ['soft iron', 'Soft iron is used in electromagnets.', 'Steel is used in electromagnets, as it stays magnetised.', 'It magnetises and demagnetises easily, as it has low coercivity.', 'It has very high coercivity.', 'Permanent magnets are made of materials with high retentivity.'],
      ['types of magnetic material', 'A diamagnetic material is pushed out of a strong field.', 'A diamagnetic material is pulled into a strong field.', 'Its induced moment opposes the applied field.', 'Its permanent moments line up with the field.', 'Its susceptibility is small and negative.'],
      ['the Curie point', 'A ferromagnet loses its strong magnetism on heating past a certain temperature.', 'A ferromagnet gets more strongly magnetised the more it is heated.', 'Heat destroys the alignment of its domains.', 'Heat creates new domains that are all aligned.', 'That temperature is called the Curie temperature.'],
    ],
  },
  '4a': {
    ar: [
      ['Lenz’s law', 'Lenz’s law agrees with the conservation of energy.', 'Lenz’s law goes against the conservation of energy.', 'If the induced current helped the change, energy would appear from nothing.', 'The induced current does no work.', 'An induced current opposes the change causing it.'],
      ['eddy currents', 'A transformer’s core is made of thin laminated sheets.', 'A transformer’s core is made of one solid block, to carry eddy currents better.', 'Thin sheets cut down the eddy currents, which waste energy.', 'Thin sheets increase the flux through the coil greatly.', 'Induction cookers make use of eddy currents.'],
      ['self-induction', 'A spark can appear when a switch in an inductive circuit is opened.', 'A spark can appear only when a switch in an inductive circuit is closed.', 'The rapid fall in current induces a large emf.', 'The current rises suddenly when the switch opens.', 'The energy stored in an inductor is ½LI².'],
    ],
  },
  '4b': {
    answerFigures: {
      'Sketch how the current in a series LCR circuit': { kind: 'graph', x: 'Frequency', y: 'Current', lines: [{ points: curve((f) => 1 / Math.sqrt(0.04 + (f - 1 / f) ** 2), 0.2, 3) }], ticksX: [[1, 'f₀']] },
      'Sketch how inductive and capacitive reactance': { kind: 'graph', x: 'Frequency', y: 'Reactance', lines: [{ label: 'X_L', points: [[0, 0], [4, 4]] }, { label: 'X_C', points: curve((f) => 2 / f, 0.5, 4) }] },
    },
    ar: [
      ['the power factor', 'A pure inductor uses no average power in an a.c. circuit.', 'A pure inductor uses a large average power in an a.c. circuit.', 'The current and voltage are 90° out of phase, so the power factor is zero.', 'The current and voltage are in phase, so the power factor is one.', 'The average power is VI cos φ.'],
      ['reactance', 'A capacitor blocks steady current, but passes alternating current.', 'A capacitor passes steady current, but blocks alternating current.', 'Its reactance is 1/(2πfC), which is infinite for f = 0.', 'Its reactance is 2πfC, which is zero for f = 0.', 'An inductor’s reactance rises with frequency.'],
      ['resonance in a series circuit', 'At resonance, the current in a series LCR circuit is largest.', 'At resonance, the current in a series LCR circuit is smallest.', 'The reactances of L and C cancel, leaving only R as the impedance.', 'The resistance becomes zero at resonance.', 'The resonant frequency is 1/(2π√(LC)).'],
      ['the transformer', 'A transformer works only on a.c.', 'A transformer works best on steady d.c.', 'It needs a changing flux to induce an emf in the secondary.', 'It needs the current to stay perfectly steady.', 'Power is sent over long lines at a high voltage, to cut the losses.'],
    ],
  },
  '5a': {
    ar: [
      ['displacement current', 'A changing electric field produces a magnetic field.', 'A changing electric field has no effect on magnetic fields.', 'It acts as a displacement current in Ampère’s law.', 'It removes all the charge from the plates.', 'Maxwell’s idea of it predicted electromagnetic waves.'],
      ['the nature of electromagnetic waves', 'Electromagnetic waves can travel through a vacuum.', 'Electromagnetic waves need a medium to travel through.', 'They are changing electric and magnetic fields, which sustain each other.', 'They are vibrations of the particles of a medium.', 'Their speed in a vacuum is about 3 × 10⁸ m/s.'],
      ['the uses of the spectrum', 'Infrared is used in TV remote controls.', 'Gamma rays are used in TV remote controls.', 'It is cheap to produce, and harmless at low power.', 'It has the shortest wavelength in the spectrum.', 'Infrared is sometimes called heat radiation.'],
    ],
  },
  '6a': {
    answerFigures: {
      'Draw a ray diagram for a convex lens': { kind: 'lens', lens: 'convex', f: 10, u: 15, fLabel: 'f', uLabel: 'between F and 2F', rays: 1 },
      'Draw the ray path through a prism': { kind: 'prism', angle: 'A' },
      'Draw a ray diagram for a convex mirror': { kind: 'mirror', mirror: 'convex', f: 10, u: 20, fLabel: 'f', uLabel: 'u', rays: 1 },
    },
    ar: [
      ['the sparkle of diamond', 'A diamond sparkles strongly.', 'A diamond sparkles only because it has many colours inside.', 'Its small critical angle traps light by total internal reflection.', 'Its large critical angle lets light straight through.', 'Diamond has a very high refractive index.'],
      ['the colour of the sky', 'The sky looks blue.', 'The sky looks blue because the air itself is a blue gas.', 'Air scatters blue light much more than red.', 'Air scatters red light much more than blue.', 'The scattering is inversely proportional to the fourth power of the wavelength.'],
      ['the optical fibre', 'Light can travel along a bent optical fibre with little loss.', 'Light can’t travel round a bend in an optical fibre.', 'It is totally reflected at the walls again and again.', 'It is refracted out at each wall and comes back.', 'The core has a higher refractive index than the cladding.'],
      ['the lens in water', 'A glass lens has a longer focal length in water than in air.', 'A glass lens has a shorter focal length in water than in air.', 'The refractive index of glass relative to water is smaller.', 'The refractive index of glass relative to water is larger.', 'A lens’s focal length depends on the medium around it.'],
      ['the prism’s dispersion', 'A prism splits white light into colours.', 'A prism adds colours to white light.', 'Its refractive index is different for each wavelength.', 'Its angle changes for each colour.', 'Violet is deviated most, and red least.'],
    ],
  },
  '6b': {
    answerFigures: {
      'Draw a labelled ray diagram of an astronomical telescope': { kind: 'telescope', fo: 'fₒ', fe: 'fₑ' },
    },
    ar: [
      ['the telescope’s lenses', 'An astronomical telescope has an objective of long focal length.', 'An astronomical telescope has an objective of short focal length.', 'The magnifying power is fₒ/fₑ in normal adjustment.', 'The magnifying power is fₑ/fₒ in normal adjustment.', 'A large aperture gathers more light.'],
      ['the microscope’s lenses', 'Both lenses of a compound microscope have short focal lengths.', 'Both lenses of a compound microscope have long focal lengths.', 'Short focal lengths give a larger magnifying power.', 'Short focal lengths give a smaller magnifying power.', 'The objective forms a real, enlarged image.'],
      ['the eye’s accommodation', 'The eye can focus on objects at different distances.', 'The eye can only focus on objects at one distance.', 'Its ciliary muscles change the focal length of its lens.', 'The eye moves its retina forwards and backwards.', 'The normal near point is about 25 cm away.'],
    ],
  },
  '6c': {
    answerFigures: {
      'Sketch the intensity against distance': { kind: 'graph', x: 'Distance on the screen', y: 'Intensity', lines: [{ points: curve((x) => Math.cos(Math.PI * x) ** 2, -2.5, 2.5, 80) }], ticksX: [[1, 'β']] },
      'Sketch how intensity varies across the screen in single-slit': { kind: 'graph', x: 'Distance on the screen', y: 'Intensity', lines: [{ points: curve((x) => (x === 0 ? 1 : (Math.sin(Math.PI * x) / (Math.PI * x)) ** 2), -3, 3, 90) }] },
    },
    ar: [
      ['coherent sources', 'Two separate lamps can’t give a steady interference pattern.', 'Two separate lamps always give a steady interference pattern.', 'Their phase difference isn’t constant.', 'They have no wavelength.', 'Young’s experiment gets two coherent sources from one.'],
      ['fringe width', 'Fringes get wider if the slits are moved closer together.', 'Fringes get narrower if the slits are moved closer together.', 'The fringe width is λD/d.', 'The fringe width is dD/λ.', 'Fringes are narrower in water than in air.'],
      ['diffraction', 'Diffraction is more noticeable through a narrower slit.', 'Diffraction is less noticeable through a narrower slit.', 'The angular width of the central maximum is 2λ/a.', 'The angular width of the central maximum is 2a/λ.', 'The central maximum is twice as wide as the others.'],
      ['polarisation', 'Only transverse waves can be polarised.', 'Only longitudinal waves can be polarised.', 'A longitudinal wave has just one direction of vibration, along its path.', 'A transverse wave vibrates along its path.', 'Light can be polarised, and sound can’t.'],
    ],
  },
  '7a': {
    answerFigures: {
      'Sketch how photocurrent varies': { kind: 'graph', x: 'Collector potential', y: 'Photocurrent', lines: [{ label: 'Brighter', points: [[-2, 0], [0, 1.6], [1, 2], [3, 2]] }, { label: 'Dimmer', points: [[-2, 0], [0, 0.8], [1, 1], [3, 1]] }], ticksX: [[-2, 'V₀']] },
      'Sketch how maximum kinetic energy': { kind: 'graph', x: 'Frequency', y: 'Maximum kinetic energy', lines: [{ points: [[2, 0], [6, 3]] }], ticksX: [[2, 'ν₀']] },
    },
    ar: [
      ['the threshold frequency', 'Bright red light may eject no electrons from a metal, though dim violet light does.', 'Bright red light always ejects more electrons from a metal than dim violet light.', 'Ejection depends on each photon’s energy, not on the brightness.', 'Ejection depends only on the brightness.', 'A photon’s energy is hν.'],
      ['intensity and photocurrent', 'A brighter light gives a larger photocurrent, above the threshold.', 'A brighter light gives a smaller photocurrent, above the threshold.', 'More photons each second eject more electrons.', 'Each photon is more energetic in a brighter light.', 'Stopping potential doesn’t depend on the intensity.'],
      ['de Broglie waves', 'A moving car shows no noticeable wave effects.', 'A moving car shows very obvious wave effects.', 'λ = h/p, and a car’s momentum is enormous.', 'λ = hp, and a car’s momentum is enormous.', 'Electron diffraction confirms that electrons have wave properties.'],
    ],
  },
  '8a': {
    answerFigures: {
      'Draw an energy level diagram for hydrogen': { kind: 'levels', levels: [{ n: 'n = 1', E: '−13.6 eV', at: -13.6 }, { n: 'n = 2', E: '−3.4 eV', at: -3.4 }, { n: 'n = 3', E: '−1.5 eV', at: -1.5 }, { n: 'n = 4', E: '−0.85 eV', at: -0.85 }], from: 1, to: 0 },
    },
    ar: [
      ['the line spectrum', 'An atom’s spectrum is made of lines, not a continuous band.', 'An atom’s spectrum is a continuous band.', 'Its energy levels are discrete, so only certain photon energies are emitted.', 'Its electrons can have any energy at all.', 'Each element has its own line spectrum.'],
      ['the nuclear model', 'Most α-particles pass straight through a thin gold foil.', 'Most α-particles are turned straight back by a thin gold foil.', 'An atom is mostly empty space.', 'An atom is a solid sphere of positive charge.', 'A few α-particles are scattered through large angles.'],
      ['Bohr’s orbits', 'An orbit’s radius grows as n².', 'An orbit’s radius grows as √n.', 'r = ε₀n²h²/(πme²).', 'r = ε₀h²/(πme²n²).', 'The ground state of hydrogen has an energy of −13.6 eV.'],
    ],
  },
  '8b': {
    answerFigures: {
      'Sketch binding energy per nucleon': { kind: 'graph', x: 'Mass number', y: 'Binding energy per nucleon', lines: [{ points: [[2, 1.1], [4, 7.1], [12, 7.7], [56, 8.8], [120, 8.5], [238, 7.6]] }], ticksX: [[56, '56']] },
      'Sketch the number of undecayed nuclei': { kind: 'graph', x: 'Time', y: 'Undecayed nuclei', lines: [{ points: curve((t) => 2 ** -t, 0, 5) }], ticksY: [[1, 'N₀'], [0.5, 'N₀/2']], ticksX: [[1, 'T½']] },
    },
    ar: [
      ['fusion and temperature', 'Fusion needs a very high temperature.', 'Fusion happens easily at room temperature.', 'Nuclei must have enough kinetic energy to overcome their repulsion.', 'Nuclei attract each other strongly at any distance.', 'Fusion powers the Sun.'],
      ['binding energy', 'Both fission of heavy nuclei and fusion of light ones release energy.', 'Only fusion of light nuclei releases energy.', 'Each makes a product with more binding energy per nucleon.', 'Each makes a product with less binding energy per nucleon.', 'Binding energy per nucleon is greatest near iron.'],
      ['the half-life', 'The half-life of a sample doesn’t depend on how much of it there is.', 'The half-life of a sample falls as it gets smaller.', 'Each nucleus decays with the same chance per second.', 'The nuclei in a small sample decay faster.', 'The half-life is 0.693/λ.'],
      ['the nuclear force', 'The nucleus holds together despite the repulsion of its protons.', 'The nucleus flies apart unless its protons have no charge.', 'A strong, short-range nuclear force binds the nucleons.', 'Gravity between the protons is what binds them.', 'The nuclear force acts on both protons and neutrons.'],
    ],
  },
  '9a': {
    ar: [
      ['doping', 'A small amount of doping greatly raises a semiconductor’s conductivity.', 'A small amount of doping greatly lowers a semiconductor’s conductivity.', 'It adds a large number of charge carriers.', 'It removes all the charge carriers.', 'Pentavalent impurities give an n-type semiconductor.'],
      ['the temperature of a semiconductor', 'A semiconductor’s resistance falls as it gets hotter.', 'A semiconductor’s resistance rises as it gets hotter.', 'More electrons cross the band gap.', 'Its band gap gets much larger.', 'Silicon has a band gap of about 1.1 eV.'],
      ['the charge of a doped crystal', 'An n-type semiconductor is electrically neutral.', 'An n-type semiconductor has a large negative charge.', 'Each donor atom that gives up an electron stays behind as a positive ion.', 'It takes in extra electrons from the air.', 'In n-type material, electrons are the majority carriers.'],
    ],
  },
  '9b': {
    answerFigures: {
      'Sketch the V–I characteristic': { kind: 'graph', x: 'Voltage', y: 'Current', lines: [{ points: [[-4, -0.1], [0, 0], [0.6, 0.1], [0.8, 1], [1, 3]] }], ticksX: [[0.7, 'Knee']] },
    },
    ar: [
      ['the depletion region', 'A depletion region has almost no free charge carriers.', 'A depletion region is full of free charge carriers.', 'Electrons and holes diffuse across and recombine there.', 'It has been heavily doped with extra atoms.', 'A barrier potential forms across it.'],
      ['the diode as a rectifier', 'A p-n junction diode can be used as a rectifier.', 'A p-n junction diode can’t be used as a rectifier.', 'It conducts well in only one direction.', 'It conducts equally well in both directions.', 'A full-wave rectifier makes use of both half-cycles.'],
      ['the Zener diode', 'A Zener diode can keep a voltage steady.', 'A Zener diode can’t work when it is reverse-biased.', 'In breakdown, its voltage hardly changes as the current changes.', 'In breakdown, its current hardly changes as the voltage changes.', 'It is used in reverse bias.'],
      ['the LED', 'An LED gives light only when forward-biased.', 'An LED gives light only when reverse-biased.', 'Electrons and holes recombine at the junction, and give out energy as light.', 'Its junction glows because of its heat.', 'An LED’s colour depends on its band gap.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A, MORE_B, MORE_C, MORE_D);
