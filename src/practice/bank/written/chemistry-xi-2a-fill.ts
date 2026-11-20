// Written by hand: particles and atomic models, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('chemistry', 'XI');
const A = at(2, 'a');

const questions: BankDef[] = [
  figure(A(3, 1), 'Draw the set-up of Rutherford’s scattering experiment, and the paths of the α-particles, and state what each kind of path showed.', ['Most α-particles passed straight through the gold foil, showing that most of an atom is empty space.', 'A few were turned through small or large angles, showing a small region of concentrated positive charge.', 'Very few bounced straight back, showing that this nucleus is tiny, dense and holds nearly all the mass.'], {
    answer: sketch(340, 200, 'On the left, a box marked α source sends a beam to the right at a thin vertical gold foil. A curved screen surrounds the foil. Most paths go straight through the foil; a few bend through small angles; one bounces straight back.', [
      { t: 'box', x: 6, y: 85, w: 66, h: 30 }, label(39, 104, 'α source'), arrow([72, 100], [150, 100]),
      line([[160, 40], [160, 160]]), label(160, 32, 'gold foil'),
      { t: 'path', d: 'M200 20 A 90 90 0 0 1 200 180', dash: 1 }, label(300, 104, 'screen', 'end'),
      arrow([160, 100], [240, 100]), arrow([160, 92], [236, 66]), arrow([160, 108], [236, 134]), arrow([158, 96], [110, 70]),
    ]),
  }),
  figure(A(3, 2), 'The diagram shows some energy levels of hydrogen and three jumps, X, Y and Z. Which jump gives the photon of greatest energy? Find the energy of the photon for Y, and say which jump gives visible light.', ['Z, from n = 2 to n = 1, has the largest energy gap: 13.6 − 3.4 = 10.2 eV.', 'Y, from n = 3 to n = 2: 3.40 − 1.51 = 1.89 eV.', 'Y gives visible light, as it is a jump to n = 2, in the Balmer series, of 656 nm.'], {
    shown: sketch(320, 210, 'Horizontal lines for the levels n = 1 at −13.6 eV, n = 2 at −3.4 eV, n = 3 at −1.51 eV and n = 4 at −0.85 eV, with the gaps getting smaller going up. Arrow X goes down from n = 4 to n = 2, arrow Y from n = 3 to n = 2, and arrow Z from n = 2 to n = 1.', [
      line([[60, 190], [260, 190]]), label(56, 194, 'n = 1', 'end'), label(264, 194, '−13.6 eV', 'start'),
      line([[60, 90], [260, 90]]), label(56, 94, 'n = 2', 'end'), label(264, 94, '−3.4 eV', 'start'),
      line([[60, 60], [260, 60]]), label(56, 64, 'n = 3', 'end'), label(264, 64, '−1.51 eV', 'start'),
      line([[60, 40], [260, 40]]), label(56, 44, 'n = 4', 'end'), label(264, 44, '−0.85 eV', 'start'),
      arrow([110, 40], [110, 90]), label(116, 74, 'X', 'start'), arrow([160, 60], [160, 90]), label(166, 80, 'Y', 'start'), arrow([210, 90], [210, 190]), label(216, 144, 'Z', 'start'),
    ]),
  }),
  figure(A(2, 1), 'Draw Thomson’s model of the atom and Rutherford’s model side by side, and give the main difference.', ['Thomson: a sphere of positive charge with electrons scattered through it, like seeds in a fruit.', 'Rutherford: a tiny, dense, positive nucleus at the centre, with electrons moving round it in mostly empty space.'], {
    answer: sketch(320, 150, 'Left: a large circle filled with plus signs, with small dots, the electrons, scattered inside it. Right: a tiny dot at the centre, the nucleus, with electrons on circles around it and empty space between.', [
      { t: 'circle', x: 80, y: 70, r: 50 }, label(60, 55, '+'), label(95, 50, '+'), label(70, 90, '+'), label(100, 85, '+'), label(80, 70, '+'),
      { t: 'dot', x: 75, y: 45 }, { t: 'dot', x: 105, y: 68 }, { t: 'dot', x: 58, y: 75 }, { t: 'dot', x: 88, y: 100 }, label(80, 140, 'Thomson'),
      { t: 'dot', x: 240, y: 70 }, label(246, 66, '+', 'start'), { t: 'circle', x: 240, y: 70, r: 28, dash: 1 }, { t: 'circle', x: 240, y: 70, r: 50, dash: 1 },
      { t: 'dot', x: 268, y: 70 }, { t: 'dot', x: 205, y: 35 }, { t: 'dot', x: 240, y: 120 }, label(240, 140, 'Rutherford'),
    ]),
  }),

  predict(A(2, 2), 'The gold foil in Rutherford’s experiment is replaced by an aluminium foil of the same thickness. Predict how the scattering changes, and why.', 'Fewer α-particles are turned through large angles.', 'The aluminium nucleus has a much smaller positive charge, 13 against 79, so it repels the α-particles less strongly.'),
  predict(A(2, 2), 'Predict the de Broglie wavelength of a 0.1 kg ball moving at 10 m/s, and say why its wave nature isn’t noticed. (h = 6.6 × 10⁻³⁴ J s)', 'λ = h/mv = 6.6 × 10⁻³⁴/(0.1 × 10) = 6.6 × 10⁻³⁴ m.', 'This is far smaller than anything that could diffract it, so it can’t be detected.'),
  predict(A(2, 1), 'An electron in hydrogen falls from n = 3 to n = 1, and in another atom from n = 3 to n = 2. Predict which photon has the longer wavelength, and why.', 'The one from n = 3 to n = 2.', 'Its energy gap is smaller, and λ = hc/E, so a smaller energy means a longer wavelength.'),

  odd(A(2, 1), ['¹H', '²H', '³H', '³He'], '³He', 'It is helium; the others are isotopes of hydrogen.'),
  odd(A(2, 1), ['electron', 'proton', 'neutron', 'α-particle'], 'α-particle', 'It isn’t a fundamental particle: it is a helium nucleus of two protons and two neutrons.'),
  odd(A(2, 2), ['¹⁴C and ¹⁴N', '⁴⁰Ar and ⁴⁰Ca', '¹²C and ¹³C', '³H and ³He'], '¹²C and ¹³C', 'They are isotopes, with the same atomic number; the other pairs are isobars, with the same mass number.'),

  long(A(5, 2), 'Answer each part on Rutherford’s model.\n(a) Give the three conclusions Rutherford drew from his scattering experiment. [3]\n(b) Give two ways in which his model fails. [2]', '(a) Most of the atom is empty space.', '(a) The positive charge and nearly all the mass are packed into a tiny nucleus at the centre.', '(a) Electrons move round the nucleus, and the nucleus is about 10⁻¹⁵ m across, against 10⁻¹⁰ m for the atom.', '(b) By classical physics, an electron moving in a circle should give out energy and spiral into the nucleus, so the atom couldn’t be stable.', '(b) It doesn’t explain the line spectrum of hydrogen, or how the electrons are arranged.'),
  long(A(5, 3), 'Answer each part on the uncertainty principle.\n(a) State Heisenberg’s uncertainty principle. [1]\n(b) The speed of an electron is known to within 1000 m/s. Find the least uncertainty in its position. (h = 6.626 × 10⁻³⁴ J s, mass 9.11 × 10⁻³¹ kg) [2]\n(c) Why does the principle rule out Bohr’s fixed orbits? [2]', '(a) The position and momentum of a particle can’t both be known exactly at once: Δx × Δp ≥ h/4π.', '(b) Δx ≥ h/(4πmΔv) = 6.626 × 10⁻³⁴/(4π × 9.11 × 10⁻³¹ × 1000).', '(b) = 5.8 × 10⁻⁸ m, far larger than an atom.', '(c) A fixed orbit would give an electron an exact position and an exact speed at every moment.', '(c) The principle forbids this, so an electron can only be described by the probability of finding it in a region.'),

  tell(A(2, 1), 'Distinguish between isotopes and isobars, with an example of each.', 'Isotopes have the same atomic number but different mass numbers, as ¹²C and ¹⁴C.', 'Isobars have the same mass number but different atomic numbers, as ⁴⁰Ar and ⁴⁰Ca.'),
  tell(A(2, 1), 'Distinguish between Thomson’s and Rutherford’s models of the atom.', 'Thomson pictured a sphere of positive charge with electrons scattered through it.', 'Rutherford pictured a tiny, dense, positive nucleus with electrons round it in mostly empty space.'),
  tell(A(2, 1), 'Distinguish between atomic number and mass number.', 'The atomic number, Z, is the number of protons in the nucleus, which fixes the element.', 'The mass number, A, is the number of protons and neutrons together.'),

  match(A(4, 1), [['The electron', 'found by Thomson using cathode rays'], ['The proton', 'found in canal rays'], ['The neutron', 'discovered by Chadwick'], ['The nucleus', 'found by Rutherford’s scattering experiment']]),
  match(A(4, 2), [['de Broglie', 'λ = h/mv'], ['Heisenberg', 'Δx × Δp ≥ h/4π'], ['Planck', 'E = hν'], ['Bohr', 'mvr = nh/2π']]),
  match(A(4, 1), [['n = 1 in hydrogen', '−13.6 eV'], ['n = 2 in hydrogen', '−3.4 eV'], ['n = 3 in hydrogen', '−1.51 eV'], ['n = ∞', '0 eV']]),

  reason(A(2, 1), 'Why are the energies of an electron in an atom given as negative numbers?', 'The energy of an electron is taken as zero when it is free, far from the nucleus.', 'A bound electron has less energy than a free one, so its energy is negative.'),
  reason(A(2, 1), 'Why don’t we notice the wave nature of a moving cricket ball?', 'Its de Broglie wavelength, h/mv, is extremely small, as its mass is large.', 'No slit or obstacle is small enough to show it diffracting.'),
  reason(A(2, 1), 'Why was Thomson’s model of the atom given up?', 'In it the positive charge is spread out, so it couldn’t turn α-particles through large angles.', 'Rutherford found that some were turned back, which needed a small, concentrated nucleus.'),

  short(A(2, 1), 'Give the number of protons, neutrons and electrons in the ion ³⁵Cl⁻ (Z = 17).', '17 protons and 35 − 17 = 18 neutrons.', '17 + 1 = 18 electrons, as the ion has one extra.'),
  short(A(2, 2), 'Find the de Broglie wavelength of an electron moving at 1.0 × 10⁶ m/s. (h = 6.626 × 10⁻³⁴ J s, mass 9.11 × 10⁻³¹ kg)', 'λ = h/mv = 6.626 × 10⁻³⁴/(9.11 × 10⁻³¹ × 1.0 × 10⁶).', '= 7.3 × 10⁻¹⁰ m, about the size of an atom.'),
  short(A(2, 1), 'Find the frequency of light whose photons have an energy of 3.3 × 10⁻¹⁹ J. (h = 6.6 × 10⁻³⁴ J s)', 'ν = E/h = 3.3 × 10⁻¹⁹/6.6 × 10⁻³⁴.', '= 5.0 × 10¹⁴ Hz.'),

  ar(A(1, 1), 'An electron in an atom can’t have just any energy.', 'The energy of an electron in an atom is quantised.', 1, 'It can have only certain values, the energies of its allowed levels.'),
  ar(A(1, 1), 'The nucleus takes up most of the volume of an atom.', 'Most of the mass of an atom is in its nucleus.', 4, 'The nucleus is tiny; most of the atom is empty space.'),
  ar(A(1, 1), 'Cathode rays are the same whatever gas is in the tube.', 'The neutron has no charge.', 2, 'Both are true, but cathode rays are the same because they are electrons, which are found in every atom.'),

  derive(A(3, 2), 'Starting from E = mc² and E = hν for a photon, derive de Broglie’s relation λ = h/p, and apply it to a particle of mass m and speed v.', ['For a photon, mc² = hν = hc/λ, so mc = h/λ.', 1], ['mc is the momentum p of the photon, so λ = h/p.', 1], ['De Broglie applied this to any particle: λ = h/mv.', 1]),
  derive(A(3, 2), 'Show that Bohr’s condition mvr = nh/2π means a whole number of electron waves fits round each orbit.', ['The electron’s wavelength is λ = h/mv.', 1], ['For the wave to join up with itself round an orbit of radius r, 2πr = nλ = nh/mv.', 1], ['Rearranging, mvr = nh/2π, which is Bohr’s condition.', 1]),
  derive(A(3, 3), 'Using Eₙ = −13.6/n² eV for hydrogen, show that the photon given out when an electron falls from n = 3 to n = 2 has an energy of 1.89 eV and a wavelength of about 656 nm. (hc = 1240 eV nm)', ['ΔE = 13.6(1/2² − 1/3²) = 13.6 × 5/36.', 1], ['ΔE = 1.89 eV.', 1], ['λ = hc/ΔE = 1240/1.89 = 656 nm, red light in the Balmer series.', 1]),
];

export default questions;
