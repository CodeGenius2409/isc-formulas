// Original questions in the style of ISC Physics Class XII. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory, num } = bank('physics', 'XII');

const questions: BankDef[] = [
  // Section A style: one mark
  mcq([1, 'a', 1, 1], 'A hollow metal sphere carries a charge on its outer surface. The electric field at a point inside the cavity is:', ['zero', 'the same as at the surface', 'greatest at the centre', 'directed radially inwards'], 0, 'Excess charge on a conductor stays on the outer surface, and the field inside the cavity is zero.'),
  mcq([1, 'a', 1, 2], 'The flux through a closed cube with a charge q placed at its centre, and the flux through one face, are in the ratio:', ['1 : 1', '4 : 1', '6 : 1', '8 : 1'], 2, 'By symmetry each of the six faces carries one sixth of the total flux q/ε₀.'),
  mcq([1, 'b', 1, 1], 'A parallel plate capacitor stays connected to a battery while a dielectric slab is inserted. Which quantity stays unchanged?', ['Charge on the plates', 'Capacitance', 'Potential difference', 'Stored energy'], 2, 'The battery holds the potential difference fixed. Charge, capacitance and energy all increase.'),
  ar([1, 'b', 1, 2], 'No work is done in moving a test charge along an equipotential surface.', 'The electric field is perpendicular to an equipotential surface at every point.', 1, 'With the force perpendicular to the displacement, W = 0, and that is why no work is done.'),
  mcq([2, 'a', 1, 1], 'The drift velocity of electrons in a wire of uniform cross-section is doubled. The current in the wire:', ['is halved', 'stays the same', 'is doubled', 'becomes four times as large'], 2, 'I = neAv_d, so the current is proportional to the drift velocity.'),
  mcq([2, 'a', 1, 2], 'A wire of resistance R is stretched uniformly to twice its length. Its new resistance is:', ['R/2', 'R', '2R', '4R'], 3, 'Volume is constant, so doubling the length halves the area, and R = ρl/A becomes four times as large.'),
  ar([2, 'a', 1, 2], 'The resistance of a semiconductor falls as it is heated.', 'Heating increases the number of charge carriers available for conduction in a semiconductor.', 1),
  mcq([2, 'b', 1, 2], 'Kirchhoff’s junction rule is a statement of the conservation of:', ['energy', 'charge', 'momentum', 'mass'], 1, 'Charge cannot pile up at a junction. The loop rule is the one that expresses conservation of energy.'),
  mcq([3, 'a', 1, 1], 'An electron moves parallel to a uniform magnetic field. The magnetic force on it is:', ['zero', 'along its velocity', 'opposite to its velocity', 'perpendicular to its velocity'], 0, 'F = qvB sin θ, and here θ = 0.'),
  mcq([3, 'a', 1, 2], 'The work done by a uniform magnetic field on a charged particle moving in a circle in it, in one revolution, is:', ['qvB', '2πr qvB', 'zero', 'qB/m'], 2, 'The force stays perpendicular to the velocity, so it does no work.'),
  ar([3, 'a', 1, 2], 'A galvanometer is converted into an ammeter by connecting a low resistance in parallel with it.', 'An ammeter must have a very high overall resistance, so that it draws little current from the circuit.', 3, 'An ammeter is in series, so it needs a very low resistance.'),
  mcq([3, 'b', 1, 1], 'Which of these materials has a small, negative magnetic susceptibility?', ['Iron', 'Aluminium', 'Bismuth', 'Nickel'], 2, 'Bismuth is diamagnetic. Aluminium is paramagnetic, and iron and nickel are ferromagnetic.'),
  mcq([4, 'a', 1, 1], 'Lenz’s law is a consequence of the conservation of:', ['charge', 'energy', 'momentum', 'magnetic flux'], 1, 'If the induced current aided the change that caused it, energy would appear from nowhere.'),
  ar([4, 'a', 1, 2], 'The emf induced in a coil depends on the size of the flux through it, not on how quickly that flux changes.', 'Faraday’s law gives the emf as the rate of change of flux linkage.', 4, 'A large steady flux induces no emf at all.'),
  mcq([4, 'b', 1, 2], 'In a series LCR circuit at resonance, the phase difference between the applied voltage and the current is:', ['0°', '45°', '90°', '180°'], 0, 'At resonance X_L = X_C, so the circuit behaves as a pure resistance.'),
  mcq([4, 'b', 1, 1], 'A transformer works on the principle of:', ['self induction', 'mutual induction', 'electrostatic induction', 'the magnetic effect of a steady current'], 1),
  mcq([5, 'a', 1, 1], 'Which of these has the shortest wavelength?', ['Microwaves', 'Infrared', 'Ultraviolet', 'Gamma rays'], 3),
  mcq([5, 'a', 1, 2], 'The oscillating electric and magnetic fields of an electromagnetic wave are:', ['parallel to each other and to the direction of travel', 'perpendicular to each other and in phase', 'perpendicular to each other and 90° out of phase', 'parallel to each other and 90° out of phase'], 1),
  mcq([6, 'a', 1, 1], 'A ray passes from water into air at an angle of incidence greater than the critical angle. The ray:', ['bends away from the normal', 'bends towards the normal', 'goes straight on', 'is totally reflected inside the water'], 3),
  mcq([6, 'a', 1, 2], 'A convex lens of refractive index 1.5 is put in a liquid of refractive index 1.5. Its power becomes:', ['zero', 'half', 'double', 'unchanged'], 0, 'With no change of refractive index at its surfaces, the lens does not deviate light.'),
  ar([6, 'a', 1, 2], 'Violet light is deviated more than red light by a glass prism.', 'The refractive index of glass is greater for violet light than for red light.', 1),
  mcq([6, 'b', 1, 2], 'To increase the magnifying power of an astronomical telescope, you should use:', ['an objective of long focal length and an eyepiece of short focal length', 'an objective of short focal length and an eyepiece of long focal length', 'both of short focal length', 'both of long focal length'], 0, 'In normal adjustment m = f_o/f_e.'),
  mcq([6, 'c', 1, 1], 'In Young’s double slit experiment, using light of a longer wavelength makes the fringes:', ['narrower', 'wider', 'unchanged', 'disappear'], 1, 'Fringe width β = λD/d is proportional to λ.'),
  ar([6, 'c', 1, 3], 'Interference fringes disappear if the two slits are lit by two separate sodium lamps.', 'Two independent sources do not keep a constant phase difference.', 1),
  mcq([7, 'a', 1, 1], 'In the photoelectric effect, raising the intensity of the incident light at a fixed frequency above threshold increases:', ['the stopping potential', 'the maximum kinetic energy', 'the photocurrent', 'the work function'], 2),
  ar([7, 'a', 1, 2], 'Photoelectrons are emitted with no noticeable delay, however faint the light.', 'The stopping potential depends on the frequency of the incident light.', 2, 'Both are true, but the lack of delay comes from one electron absorbing one photon in a single event.'),
  mcq([7, 'a', 1, 2], 'A proton and an alpha particle have the same de Broglie wavelength. Which quantity must they share?', ['Speed', 'Kinetic energy', 'Momentum', 'Charge'], 2, 'λ = h/p, so equal wavelengths mean equal momenta.'),
  mcq([8, 'a', 1, 1], 'The Balmer series of hydrogen lies in the:', ['ultraviolet region only', 'visible region', 'far infrared region', 'microwave region'], 1),
  mcq([8, 'b', 1, 2], 'Nuclear density, compared across different nuclei, is:', ['proportional to mass number', 'proportional to atomic number', 'nearly the same for all nuclei', 'greatest for the lightest nuclei'], 2, 'R = R₀A^(1/3), so volume is proportional to A and the density does not depend on A.'),
  ar([8, 'b', 1, 2], 'Energy is released when a heavy nucleus undergoes fission.', 'The binding energy per nucleon of the fragments is greater than that of the heavy nucleus.', 1),
  mcq([9, 'a', 1, 1], 'Adding a pentavalent impurity to pure silicon makes:', ['a p-type semiconductor', 'an n-type semiconductor', 'an insulator', 'a superconductor'], 1),
  mcq([9, 'b', 1, 2], 'A p-n junction under forward bias has a depletion layer that:', ['becomes narrower', 'becomes wider', 'stays the same', 'disappears for any voltage'], 0),
  ar([9, 'b', 1, 2], 'A Zener diode can be used as a voltage regulator.', 'In reverse breakdown, the voltage across a Zener diode stays nearly constant over a wide range of current.', 1),

  // Section B style: two marks
  num([1, 'a', 2, 1], {
    text: 'Two point charges of {Q1} µC and {Q2} µC are placed {D} cm apart in air. Calculate the force between them.',
    vars: { Q1: [1, 9, 1], Q2: [2, 8, 2], D: [10, 40, 5] },
    parts: [{ ask: 'Force between the charges', use: 'p-xii-1-1', find: 'F', given: { q_1: 'Q1 uC', q_2: 'Q2 uC', r: 'D cm' }, marks: 2 }],
  }),
  num([1, 'b', 2, 1], {
    text: 'Find the electric potential at a point {D} cm away from a point charge of {Q} µC.',
    vars: { Q: [5, 60, 5], D: [5, 30, 5] },
    parts: [{ ask: 'Potential at the point', use: 'p-xii-1-6', find: 'V', given: { q: 'Q uC', r: 'D cm' }, marks: 2 }],
  }),
  num([1, 'b', 2, 2], {
    text: 'An air-filled parallel plate capacitor has plates of area {A} cm², set {D} mm apart. Calculate its capacitance.',
    vars: { A: [50, 400, 50], D: [1, 5, 1] },
    parts: [{ ask: 'Capacitance', use: 'p-xii-1-8', find: 'C', given: { A: 'A cm^2', d: 'D mm' }, unit: 'pF', marks: 2 }],
  }),
  theory('reason', [1, 'b', 2, 2], 'Explain why the electric field just outside a charged conductor is always perpendicular to its surface.', ['A conductor in electrostatic equilibrium has its whole surface at one potential, so the surface is an equipotential.', 'A field component along the surface would drive charges along it, which contradicts equilibrium, so only the normal component can exist.']),
  num([2, 'a', 2, 1], {
    text: 'A copper wire of length {L} m and cross-sectional area {A} mm² has resistivity 1.7 × 10⁻⁸ Ω m. Find its resistance.',
    vars: { L: [2, 20, 2], A: [1, 4, 1] },
    parts: [{ ask: 'Resistance of the wire', use: 'p-xii-2-2', find: 'R', given: { rho: '1.7e-8 ohm*m', l: 'L m', A: 'A mm^2' }, marks: 2 }],
  }),
  num([2, 'b', 2, 2], {
    text: 'The Wheatstone bridge in the figure is balanced, so the galvanometer reads zero. Find the resistance S.',
    vars: { P: [10, 40, 10], Q: [20, 50, 10], R: [15, 45, 15] },
    parts: [{ ask: 'Resistance S', use: 'p-xii-2-7', find: 'S_b', given: { P_b: 'P ohm', Q_b: 'Q ohm', R_b: 'R ohm' }, marks: 2 }],
  }, { diagram: { kind: 'wheatstone', p: '{P} Ω', q: '{Q} Ω', r: '{R} Ω', s: '?' } }),
  theory('definition', [2, 'b', 2, 1], 'State Kirchhoff’s two rules for electrical circuits.', ['Junction rule: the algebraic sum of the currents meeting at a junction is zero.', 'Loop rule: the algebraic sum of the emfs and potential drops around any closed loop is zero.']),
  num([3, 'a', 2, 1], {
    text: 'A long straight wire carries a current of {I} A. Calculate the magnetic flux density at a distance of {D} cm from it.',
    vars: { I: [2, 20, 2], D: [2, 10, 2] },
    parts: [{ ask: 'Magnetic flux density', use: 'p-xii-3-3', find: 'B', given: { I: 'I A', r: 'D cm' }, unit: 'uT', marks: 2 }],
  }),
  num([3, 'a', 2, 2], {
    text: 'A galvanometer of resistance {G} Ω gives full-scale deflection for {IG} mA. What shunt converts it into an ammeter of range {I} A?',
    vars: { G: [40, 120, 20], IG: [2, 10, 2], I: [1, 5, 1] },
    parts: [{ ask: 'Shunt resistance', use: 'p-xii-3-62', find: 'S', given: { I_g: 'IG mA', G_c: 'G ohm', I: 'I A' }, marks: 2 }],
  }),
  theory('distinguish', [3, 'b', 2, 1], 'Distinguish between diamagnetic and paramagnetic substances, giving one difference in behaviour in an external field and one in susceptibility.', ['A diamagnetic substance is weakly repelled by an external field and moves towards the weaker region, while a paramagnetic substance is weakly attracted and moves towards the stronger region.', 'Diamagnetic susceptibility is small and negative. Paramagnetic susceptibility is small and positive.']),
  num([4, 'a', 2, 1], {
    text: 'A straight conductor of length {L} cm moves at {V} m/s perpendicular to a uniform magnetic field of {B} T. Calculate the emf induced across its ends.',
    vars: { L: [10, 50, 10], V: [2, 10, 2], B: [0.2, 1, 0.2] },
    parts: [{ ask: 'Induced emf', use: 'p-xii-4-2', find: 'E_m', given: { B: 'B T', l: 'L cm', v: 'V m/s' }, marks: 2 }],
  }),
  num([4, 'b', 2, 1], {
    text: 'A step-down transformer has {NP} turns in the primary and {NS} turns in the secondary. If the primary is connected to {VP} V a.c., what is the secondary voltage?',
    vars: { NP: [1000, 3000, 500], NS: [100, 400, 100], VP: [220, 240, 20] },
    parts: [{ ask: 'Secondary voltage', use: 'p-xii-4-12', find: 'V_s', given: { V_p: 'VP V', N_s: 'NS', N_p: 'NP' }, marks: 2 }],
  }),
  theory('short', [5, 'a', 2, 1], 'Name the part of the electromagnetic spectrum used (a) to kill germs in water purifiers and (b) in the remote control of a television.', ['(a) Ultraviolet rays.', '(b) Infrared rays.']),
  theory('reason', [5, 'a', 2, 2], 'What is displacement current? Why did Maxwell need to introduce it?', ['Displacement current is the current associated with a changing electric flux, $I_d = \\varepsilon_0\\, d\\phi_E/dt$.', 'It makes Ampere’s circuital law consistent, since current is continuous through the gap of a charging capacitor where no charge flows.']),
  num([6, 'a', 2, 1], {
    text: 'The critical angle for light going from a transparent medium into air is {IC}°. Calculate the refractive index of the medium.',
    vars: { IC: [30, 60, 5] },
    parts: [{ ask: 'Refractive index', use: 'p-xii-6-41', find: 'n', given: { i_c: 'IC deg' }, marks: 2 }],
  }),
  num([6, 'c', 2, 2], {
    text: 'In Young’s experiment the slits are {D} mm apart and the screen is {L} m away. Light of wavelength {W} nm is used. Find the fringe width.',
    vars: { D: [0.5, 2, 0.5], L: [1, 2, 0.5], W: [450, 650, 50] },
    parts: [{ ask: 'Fringe width', use: 'p-xii-6-9', find: 'beta', given: { lambda: 'W nm', D: 'L m', d: 'D mm' }, unit: 'mm', marks: 2 }],
  }),
  theory('distinguish', [6, 'c', 2, 2], 'State two differences between the interference pattern and the diffraction pattern produced by a slit arrangement.', ['Interference comes from two separate wavefronts, and its fringes are of about equal width. Diffraction comes from different parts of one wavefront, and its central maximum is twice as wide as the others.', 'In interference, bright fringes all have nearly the same intensity. In diffraction, the intensity of successive maxima falls off rapidly.']),
  num([7, 'a', 2, 1], {
    text: 'The work function of a metal is {PHI} eV. Calculate its threshold wavelength.',
    vars: { PHI: [2, 5, 0.5] },
    parts: [{ ask: 'Threshold wavelength', use: 'p-xii-7-18', find: 'lambda_0', given: { phi: 'PHI eV' }, unit: 'nm', marks: 2 }],
  }),
  num([7, 'a', 2, 2], {
    text: 'An electron moves with a speed of {V} × 10⁶ m/s. Calculate its de Broglie wavelength. (Mass of electron = 9.1 × 10⁻³¹ kg)',
    vars: { V: [1, 5, 1] },
    parts: [{ ask: 'de Broglie wavelength', use: 'p-xii-7-2', find: 'lambda', given: { m: '9.1e-31 kg', v: 'V*1e6 m/s' }, unit: 'nm', marks: 2 }],
  }),
  theory('short', [8, 'a', 2, 1], 'State Bohr’s postulate about angular momentum, and write what the integer in it stands for.', ['An electron can revolve only in those orbits for which its angular momentum is an integral multiple of $h/2\\pi$: $mvr = nh/2\\pi$.', 'The integer n is the principal quantum number, with values 1, 2, 3 and so on.']),
  num([8, 'b', 2, 2], {
    text: 'A radioactive sample of mass {M} g has a half-life of {T} hours. What mass of it is left undecayed after {K} hours?',
    vars: { T: [2, 10, 2], M: [8, 32, 8], K: [3, 12, 3] },
    parts: [{ ask: 'Mass left', use: 'p-xii-8-112', find: 'm', given: { m_0: 'M g', t: 'K hour', T_half: 'T hour' }, unit: 'g', marks: 2 }],
  }),
  theory('short', [9, 'a', 2, 1], 'What is meant by doping? Name the majority charge carriers in a p-type semiconductor.', ['Doping is adding a small, controlled amount of a suitable impurity to a pure semiconductor to raise its conductivity.', 'Holes are the majority carriers in a p-type semiconductor.']),
  theory('short', [9, 'b', 2, 2], 'A p-n junction diode conducts in one direction only. State the bias in which it conducts, and what happens to the potential barrier in that bias.', ['It conducts in forward bias, with the p-side connected to the positive terminal.', 'The potential barrier and the width of the depletion layer are reduced.']),

  // Section C style: three marks
  num([1, 'b', 3, 2], {
    text: 'Two capacitors of {C1} µF and {C2} µF are joined in series across a {V} V supply, as shown. Calculate the equivalent capacitance and the energy stored in the combination.',
    vars: { C1: [2, 12, 2], C2: [3, 12, 3], V: [10, 60, 10] },
    parts: [
      { ask: 'Equivalent capacitance', use: 'p-xii-1-141', find: 'C', given: { C_1: 'C1 uF', C_2: 'C2 uF' }, unit: 'uF', marks: 1, save: 'Cs' },
      { ask: 'Energy stored', use: 'p-xii-1-18', find: 'U', given: { C: 'Cs', V: 'V V' }, unit: 'mJ', marks: 2 },
    ],
  }, { diagram: { kind: 'series-capacitors', c1: '{C1} µF', c2: '{C2} µF', v: '{V} V' } }),
  num([1, 'a', 3, 2], {
    text: 'An electric dipole of moment {P} × 10⁻⁸ C m is held at {TH}° to a uniform electric field of {E} × 10⁴ N/C. Calculate the torque acting on it.',
    vars: { P: [1, 6, 1], TH: [30, 60, 30], E: [1, 5, 1] },
    parts: [{ ask: 'Torque on the dipole', use: 'p-xii-1-44', find: 'tau', given: { p: 'P*1e-8 C*m', E: 'E*1e4 N/C', theta: 'TH deg' }, marks: 3 }],
  }),
  theory('derivation', [1, 'a', 3, 2], 'Use Gauss’s law to obtain the electric field due to an infinitely long straight wire with uniform linear charge density λ.', ['Choose a cylindrical Gaussian surface of radius r and length l, coaxial with the wire. The field is radial, so the flat ends contribute no flux.', 'Flux through the curved surface is $E(2\\pi r l)$, and the charge enclosed is $\\lambda l$.', 'Gauss’s law gives $E(2\\pi r l) = \\lambda l/\\varepsilon_0$, so $E = \\lambda/(2\\pi\\varepsilon_0 r)$.']),
  theory('reason', [1, 'b', 3, 2], 'Give reasons. (a) The potential is the same throughout a charged conductor. (b) A dielectric raises the capacitance of a capacitor. (c) Electric field lines never cross.', ['(a) The field inside is zero, so no work is done moving a charge from one point to another within it.', '(b) Induced surface charge on the dielectric lowers the field, and so the potential difference, for the same charge. So C = Q/V rises.', '(c) If lines crossed, the field at that point would have two directions, which is impossible.']),
  num([2, 'b', 3, 2], {
    text: 'A cell of emf {E} V and internal resistance {IR} Ω drives current through a {R1} Ω and a {R2} Ω resistor connected in parallel, as shown. Calculate the current drawn from the cell and the terminal voltage.',
    vars: { E: [6, 24, 6], IR: [0.5, 2, 0.5], R1: [4, 12, 4], R2: [6, 12, 6] },
    parts: [
      { ask: 'Combined resistance of the parallel pair', use: 'p-xii-2-47', find: 'R', given: { R_1: 'R1 ohm', R_2: 'R2 ohm' }, marks: 1, save: 'RP' },
      { ask: 'Current from the cell', use: 'p-xii-2-57', find: 'I', given: { E_m: 'E V', R: 'RP', r: 'IR ohm' }, marks: 1, save: 'CUR' },
      { ask: 'Terminal voltage', use: 'p-xii-2-22', find: 'V', given: { E_m: 'E V', I: 'CUR', r: 'IR ohm' }, marks: 1 },
    ],
  }, { diagram: { kind: 'cell-parallel', emf: '{E} V', r: '{IR} Ω', r1: '{R1} Ω', r2: '{R2} Ω' } }),
  num([2, 'a', 3, 3], {
    text: 'A wire of cross-section {A} mm² carries a current of {I} A. The number density of free electrons is 8.5 × 10²⁸ per m³. Calculate the drift speed of the electrons.',
    vars: { A: [1, 5, 1], I: [1, 8, 1] },
    parts: [{ ask: 'Drift speed', use: 'p-xii-2-11', find: 'v_d', given: { I: 'I A', n: '8.5e28 m^-3', A: 'A mm^2' }, unit: 'mm/s', marks: 3 }],
  }),
  theory('derivation', [2, 'a', 3, 2], 'Starting from the drift velocity of electrons, obtain the relation $I = neAv_d$.', ['In time t, all the free electrons in a length $v_d t$ of the wire pass through a cross-section, so the number crossing is $nAv_d t$.', 'The charge crossing in that time is $q = neAv_d t$.', 'Since $I = q/t$, this gives $I = neAv_d$.']),
  num([3, 'a', 3, 2], {
    text: 'A proton enters a uniform magnetic field of {B} T at right angles to the field, with a speed of {V} × 10⁶ m/s. Find the radius of its circular path and the time for one revolution. (Mass of proton = 1.67 × 10⁻²⁷ kg, charge = 1.6 × 10⁻¹⁹ C)',
    vars: { B: [0.2, 1, 0.2], V: [1, 5, 1] },
    parts: [
      { ask: 'Radius of the path', use: 'p-xii-3-38', find: 'r', given: { m: '1.67e-27 kg', v: 'V*1e6 m/s', q: '1.6e-19 C', B: 'B T' }, unit: 'cm', marks: 2 },
      { ask: 'Time for one revolution', use: 'p-xii-3-40', find: 'T', given: { m: '1.67e-27 kg', q: '1.6e-19 C', B: 'B T' }, unit: 'us', marks: 1 },
    ],
  }),
  theory('derivation', [3, 'a', 3, 2], 'Use Ampere’s circuital law to obtain the magnetic field inside a long solenoid with n turns per unit length, carrying a current I.', ['Take a rectangular loop with one side of length l inside the solenoid, parallel to the axis, and the opposite side outside.', 'Only the inside side contributes: the field outside is negligible, and the short sides are perpendicular to B. So $\\oint B\\cdot dl = Bl$.', 'The current enclosed is $nlI$, so $Bl = \\mu_0 nlI$ and $B = \\mu_0 nI$.']),
  theory('short', [3, 'b', 3, 2], 'Define magnetic susceptibility, and state how the susceptibility of a paramagnetic and of a ferromagnetic substance changes with temperature.', ['Magnetic susceptibility is the ratio of the intensity of magnetisation to the magnetising field: $\\chi = M/H$.', 'For a paramagnetic substance it varies inversely with absolute temperature (Curie’s law).', 'For a ferromagnetic substance it falls with temperature, and above the Curie temperature the substance becomes paramagnetic.']),
  num([4, 'b', 3, 2], {
    text: 'A series a.c. circuit has R = {R} Ω, X_L = {XL} Ω and X_C = {XC} Ω, connected to a {V} V supply (r.m.s.). Calculate the impedance and the r.m.s. current.',
    vars: { R: [30, 80, 10], XL: [60, 120, 20], XC: [10, 50, 20], V: [110, 220, 110] },
    parts: [
      { ask: 'Impedance', use: 'p-xii-4-7', find: 'Z', given: { R: 'R ohm', X_L: 'XL ohm', X_C: 'XC ohm' }, marks: 2, save: 'IMP' },
      { ask: 'R.m.s. current', use: 'p-xii-2-1', find: 'I', given: { V: 'V V', R: 'IMP' }, marks: 1 },
    ],
  }),
  num([4, 'b', 3, 2], {
    text: 'A coil of inductance {L} mH and a capacitor of {C} µF are connected in series. Calculate the resonant frequency of the circuit.',
    vars: { L: [10, 100, 10], C: [1, 10, 1] },
    parts: [{ ask: 'Resonant frequency', use: 'p-xii-4-20', find: 'f_0', given: { L: 'L mH', C: 'C uF' }, marks: 3 }],
  }),
  theory('derivation', [4, 'a', 3, 3], 'A rod of length l slides at speed v on parallel rails in a magnetic field B perpendicular to the plane of the rails. Obtain the emf across the rod from the change of flux.', ['In time dt the rod sweeps out an area $lv\\,dt$.', 'The change in flux is $d\\phi = Blv\\,dt$.', 'Faraday’s law gives the size of the emf as $e = d\\phi/dt = Blv$.']),
  num([6, 'a', 3, 2], {
    text: 'An object is placed {U} cm in front of a thin convex lens of focal length {F} cm. Find the position of the image and the magnification.',
    vars: { U: [30, 60, 10], F: [10, 20, 5] },
    when: (v) => v.U > v.F,
    parts: [
      { ask: 'Image distance from the lens', use: 'p-xii-6-3', find: 'v', given: { u: '-U cm', f: 'F cm' }, unit: 'cm', marks: 2, save: 'IMG' },
      { ask: 'Size of the magnification (ignore its sign)', use: 'p-xii-6-2', find: 'm', given: { v: 'IMG', u: '-U cm' }, marks: 1 },
    ],
  }),
  num([6, 'a', 3, 2], {
    text: 'Thin lenses of focal lengths {F1} cm and {F2} cm are placed in contact. Find the focal length of the combination.',
    vars: { F1: [10, 40, 10], F2: [20, 50, 10] },
    parts: [{ ask: 'Focal length of the combination', use: 'p-xii-6-56', find: 'F_c', given: { f_1: 'F1 cm', f_2: 'F2 cm' }, unit: 'cm', marks: 3 }],
  }),
  num([6, 'a', 3, 3], {
    text: 'For a prism of angle {A}°, the angle of minimum deviation is {D}°. What refractive index does this give for the glass?',
    vars: { A: [50, 60, 10], D: [30, 40, 5] },
    parts: [{ ask: 'Refractive index', use: 'p-xii-6-63', find: 'n', given: { A: 'A deg', delta_m: 'D deg' }, marks: 3 }],
  }),
  theory('short', [6, 'b', 3, 2], 'How does the magnifying power of a compound microscope, with the final image at the least distance of distinct vision, depend on the focal lengths? Show the relation, state one way of increasing it, and say why the objective has a small aperture and short focal length.', ['$m = \\dfrac{v_o}{u_o}\\left(1 + \\dfrac{D}{f_e}\\right)$', 'It rises if the focal lengths of the objective and the eyepiece are reduced.', 'A short focal length gives high magnification, and a small aperture reduces aberrations.']),
  theory('derivation', [6, 'c', 3, 3], 'Use Huygens’ principle to verify the law of refraction, stating what each step uses.', ['A plane wavefront AB meets the surface at A. In the time t for B to reach C, a wavelet from A travels $v_2 t$ in the second medium.', 'From the geometry, $\\sin i = v_1 t/AC$ and $\\sin r = v_2 t/AC$.', 'Dividing gives $\\sin i/\\sin r = v_1/v_2$, a constant, which is Snell’s law.']),
  num([7, 'a', 3, 2], {
    text: 'Light of frequency {F} × 10¹⁴ Hz falls on a metal with a work function of {PHI} eV. Calculate the maximum kinetic energy of the photoelectrons.',
    vars: { F: [8, 12, 1], PHI: [2, 3, 0.5] },
    parts: [{ ask: 'Maximum kinetic energy', use: 'p-xii-7-1', find: 'K_max', given: { nu: 'F*1e14 Hz', phi: 'PHI eV' }, unit: 'eV', marks: 3 }],
  }),
  theory('short', [7, 'a', 3, 2], 'State three features of the photoelectric effect that the wave theory of light cannot explain.', ['There is a threshold frequency below which no emission occurs, however intense the light.', 'Maximum kinetic energy depends on the frequency of the light, not on its intensity.', 'Emission is practically instantaneous.']),
  theory('short', [8, 'a', 3, 2], 'Explain, using the energy levels of hydrogen, why its spectrum consists of discrete lines. Name the series whose lines end on the level n = 2.', ['Electrons occupy only certain energy levels, so the atom’s energy is quantised.', 'When an electron drops between levels it emits one photon of energy $h\\nu = E_i - E_f$, so only certain frequencies appear.', 'Lines ending on n = 2 form the Balmer series.']),
  num([8, 'b', 3, 2], {
    text: 'A radioactive substance has a decay constant of {L} per hour. Find its half-life, and the number of nuclei left after {T} hours from an initial 10²⁰ nuclei.',
    vars: { L: [0.1, 0.5, 0.1], T: [2, 8, 2] },
    parts: [
      { ask: 'Half-life', use: 'p-xii-8-5', find: 'T_half', given: { lambda: 'L hour^-1' }, unit: 'hour', marks: 1 },
      { ask: 'Nuclei left', use: 'p-xii-8-4', find: 'N', given: { N_0: '1e20', lambda: 'L hour^-1', t: 'T hour' }, marks: 2 },
    ],
  }),
  theory('short', [8, 'b', 3, 2], 'Define mass defect and binding energy. Write the relation between them, and say what a high binding energy per nucleon tells you.', ['Mass defect is the difference between the sum of the masses of the separate nucleons and the mass of the nucleus.', 'Binding energy is the energy needed to split a nucleus into its nucleons, and $E_b = \\Delta m\\, c^2$.', 'A high binding energy per nucleon means the nucleus is more stable.']),
  theory('short', [9, 'b', 3, 2], 'With the help of the working principle, explain how a p-n junction diode can be used as a full-wave rectifier, using two diodes and a centre-tap transformer.', ['The secondary’s centre-tap gives two ends that are 180° out of phase.', 'In each half cycle, one diode is forward biased and conducts while the other is reverse biased.', 'Current through the load is in the same direction in both half cycles, so the output is pulsating d.c. over the full cycle.']),
  theory('distinguish', [9, 'a', 3, 2], 'Distinguish between conductors, semiconductors and insulators on the basis of energy bands.', ['Conductor: the valence and conduction bands overlap, so electrons move freely.', 'Semiconductor: a small forbidden gap, about 1 eV, can be crossed at room temperature by some electrons.', 'Insulator: a large forbidden gap, over about 3 eV, so almost no electrons can cross.']),

  // Section D style: five marks
  theory('derivation', [1, 'a', 5, 2], 'Obtain an expression for the electric field at a point on the axial line of an electric dipole, and show how it falls with distance for a short dipole.', ['Take charges −q and +q a distance 2a apart, and a point P on the axis at a distance r from the centre, on the +q side.', 'Field due to +q is $E_+ = \\dfrac{q}{4\\pi\\varepsilon_0 (r-a)^2}$, away from it. Field due to −q is $E_- = \\dfrac{q}{4\\pi\\varepsilon_0 (r+a)^2}$, towards it.', 'The net field is $E = E_+ - E_-$, along the dipole moment.', 'This simplifies to $E = \\dfrac{1}{4\\pi\\varepsilon_0}\\,\\dfrac{2pr}{(r^2-a^2)^2}$, with $p = 2qa$.', 'For $r \\gg a$, $E \\approx \\dfrac{1}{4\\pi\\varepsilon_0}\\,\\dfrac{2p}{r^3}$, so the field falls as $1/r^3$.']),
  theory('derivation', [1, 'b', 5, 3], 'Obtain the capacitance of a parallel plate capacitor with a dielectric of constant K filling the gap. Use it to show the effect of the dielectric on stored energy at constant charge.', ['With charge Q on plates of area A, the field in the gap without a dielectric is $E_0 = Q/(A\\varepsilon_0)$.', 'With the dielectric, $E = E_0/K$, so $V = Ed = Qd/(A\\varepsilon_0 K)$.', 'Then $C = Q/V = K\\varepsilon_0 A/d$.', 'The energy stored is $U = Q^2/2C$.', 'At constant Q, C rises by a factor K, so the energy falls to $U_0/K$.']),
  num([2, 'b', 5, 3], {
    text: 'The cell in the figure has emf {E} V and internal resistance {IR} Ω. The external resistors are {R1} Ω and {R2} Ω in parallel. Calculate the following.',
    vars: { E: [6, 24, 6], IR: [0.5, 2, 0.5], R1: [3, 12, 3], R2: [6, 18, 6] },
    parts: [
      { ask: 'Effective external resistance', use: 'p-xii-2-47', find: 'R', given: { R_1: 'R1 ohm', R_2: 'R2 ohm' }, marks: 1, save: 'RP' },
      { ask: 'Current from the cell', use: 'p-xii-2-57', find: 'I', given: { E_m: 'E V', R: 'RP', r: 'IR ohm' }, marks: 1, save: 'CUR' },
      { ask: 'Terminal voltage of the cell', use: 'p-xii-2-22', find: 'V', given: { E_m: 'E V', I: 'CUR', r: 'IR ohm' }, marks: 1, save: 'TV' },
      { ask: 'Current in the {R1} Ω resistor', use: 'p-xii-2-1', find: 'I', given: { V: 'TV', R: 'R1 ohm' }, marks: 1 },
      { ask: 'Power given to the external circuit', use: 'p-xii-2-4', find: 'P', given: { V: 'TV', I: 'CUR' }, marks: 1 },
    ],
  }, { diagram: { kind: 'cell-parallel', emf: '{E} V', r: '{IR} Ω', r1: '{R1} Ω', r2: '{R2} Ω' } }),
  theory('derivation', [2, 'b', 5, 2], 'Use Kirchhoff’s rules to obtain the balance condition of a Wheatstone bridge, with resistances P and Q in one branch, and R and S in the other.', ['Let $I_1$ flow through P and $I_2$ through R, with the galvanometer current $I_g$ between the middle points.', 'Loop through P, the galvanometer and R gives $I_1 P + I_g G - I_2 R = 0$.', 'Loop through Q, S and the galvanometer gives $(I_1 - I_g)Q - (I_2 + I_g)S - I_g G = 0$.', 'At balance, $I_g = 0$, so $I_1 P = I_2 R$ and $I_1 Q = I_2 S$.', 'Dividing gives $P/Q = R/S$.']),
  theory('derivation', [3, 'a', 5, 3], 'A circular loop of radius R carries a current I. Starting from the Biot-Savart law, find the flux density on its axis at a distance x from the centre, and then at the centre itself.', ['For an element dl, $dB = \\dfrac{\\mu_0 I\\,dl}{4\\pi (R^2+x^2)}$, since dl is perpendicular to the line to the point.', 'Components perpendicular to the axis cancel in pairs by symmetry.', 'The axial component is $dB\\sin\\alpha$ with $\\sin\\alpha = R/\\sqrt{R^2+x^2}$.', 'Integrating over the loop, with $\\oint dl = 2\\pi R$, gives $B = \\dfrac{\\mu_0 I R^2}{2(R^2+x^2)^{3/2}}$.', 'At the centre, x = 0, so $B = \\mu_0 I/2R$.']),
  theory('derivation', [4, 'b', 5, 3], 'For a series LCR circuit on an a.c. supply, use a phasor diagram to obtain the impedance. State the condition for resonance, and the value of the current there.', ['The voltage across R is in phase with the current. Across L it leads by 90°, and across C it lags by 90°.', 'So the resultant voltage is $V^2 = V_R^2 + (V_L - V_C)^2$.', 'With $V_R = IR$, $V_L = IX_L$ and $V_C = IX_C$, this gives $Z = V/I = \\sqrt{R^2 + (X_L - X_C)^2}$.', 'Resonance occurs when $X_L = X_C$, so $\\omega_0 = 1/\\sqrt{LC}$.', 'At resonance Z = R, so the current has its largest value, V/R.']),
  theory('derivation', [6, 'a', 5, 3], 'Obtain the lens maker’s formula for a thin double convex lens in air, stating your assumptions.', ['Assume a thin lens, a point object on the axis and small apertures, so that angles are small.', 'Refraction at the first surface gives $\\dfrac{n}{v_1} - \\dfrac{1}{u} = \\dfrac{n-1}{R_1}$.', 'Refraction at the second surface gives $\\dfrac{1}{v} - \\dfrac{n}{v_1} = \\dfrac{1-n}{R_2}$.', 'Adding gives $\\dfrac{1}{v} - \\dfrac{1}{u} = (n-1)\\left(\\dfrac{1}{R_1} - \\dfrac{1}{R_2}\\right)$.', 'For an object at infinity v = f, so $\\dfrac{1}{f} = (n-1)\\left(\\dfrac{1}{R_1} - \\dfrac{1}{R_2}\\right)$.']),
  theory('derivation', [6, 'c', 5, 2], 'Derive the expression for fringe width in Young’s double slit experiment. State how the width changes if the whole apparatus is immersed in water.', ['Path difference at a point y on the screen is $S_2P - S_1P \\approx yd/D$.', 'A bright fringe occurs when the path difference is $n\\lambda$, so $y_n = n\\lambda D/d$.', 'A dark fringe occurs when it is $(n + \\tfrac12)\\lambda$.', 'The separation of adjacent bright fringes is $\\beta = \\lambda D/d$.', 'In water, $\\lambda$ falls to $\\lambda/\\mu$, so the fringe width decreases by the factor $\\mu$.']),
  theory('derivation', [8, 'a', 5, 3], 'Use Bohr’s postulates to obtain the radius of the nth orbit of a hydrogen atom, and the total energy of its electron.', ['The Coulomb force provides the centripetal force: $\\dfrac{mv^2}{r} = \\dfrac{e^2}{4\\pi\\varepsilon_0 r^2}$.', 'The quantum condition is $mvr = nh/2\\pi$.', 'Eliminating v gives $r_n = \\dfrac{\\varepsilon_0 n^2 h^2}{\\pi m e^2}$.', 'Kinetic energy is $e^2/(8\\pi\\varepsilon_0 r)$, and potential energy is $-e^2/(4\\pi\\varepsilon_0 r)$.', 'Total energy is $E_n = -\\dfrac{e^2}{8\\pi\\varepsilon_0 r_n} = -\\dfrac{me^4}{8\\varepsilon_0^2 n^2 h^2}$, or $-13.6/n^2$ eV.']),
];

export default questions;
