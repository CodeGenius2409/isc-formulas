// Written by hand: numericals on optics, for Physics XII at 0% generated. Answers come from the solver. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { num } = bank('physics', 'XII');
const R = (marks: number, d: 1 | 2 | 3): Place => [6, 'a', marks, d];
const I = (marks: number, d: 1 | 2 | 3): Place => [6, 'b', marks, d];
const W = (marks: number, d: 1 | 2 | 3): Place => [6, 'c', marks, d];

const questions: BankDef[] = [
  // ---- 6a Ray optics
  num(R(2, 1), { text: 'An object sits 30 cm in front of a concave mirror of focal length 10 cm. Find the image distance. (Use u = −30 cm and f = −10 cm.)', vars: {}, parts: [{ ask: 'Image distance', use: 'p-xii-6-1', find: 'v', given: { u: '-30 cm', f: '-10 cm' }, unit: 'cm', marks: 2 }] }),
  num(R(3, 2), { text: 'A dentist’s concave mirror forms a virtual image 30 cm behind it, of a tooth 10 cm in front of it. Find the focal length. (Use u = −10 cm and v = +30 cm.)', vars: {}, parts: [{ ask: 'Focal length', use: 'p-xii-6-1', find: 'f', given: { u: '-10 cm', v: '30 cm' }, unit: 'cm', marks: 3 }] }),
  num(R(2, 1), { text: 'An object sits 20 cm from a convex lens of focal length 15 cm. Find the image distance. (Use u = −20 cm and f = +15 cm.)', vars: {}, parts: [{ ask: 'Image distance', use: 'p-xii-6-3', find: 'v', given: { u: '-20 cm', f: '15 cm' }, unit: 'cm', marks: 2 }] }),
  num(R(2, 2), { text: 'A lens forms a real image 40 cm from it, of an object 40 cm from it. Find its focal length. (Use u = −40 cm and v = +40 cm.)', vars: {}, parts: [{ ask: 'Focal length', use: 'p-xii-6-3', find: 'f', given: { u: '-40 cm', v: '40 cm' }, unit: 'cm', marks: 2 }] }),
  num(R(1, 1), { text: 'A concave mirror has a radius of curvature of 40 cm. Find its focal length, in size.', vars: {}, parts: [{ ask: 'Focal length', use: 'p-xii-6-25', find: 'f', given: { R: '40 cm' }, unit: 'cm', marks: 1 }] }),
  num(R(2, 1), { text: 'Light passes from air into glass of refractive index 1.5, at an angle of incidence of 45°. Find the angle of refraction.', vars: {}, parts: [{ ask: 'Angle of refraction', use: 'p-xii-6-7', find: 'r', given: { mu_1: '1', i: '45 deg', mu_2: '1.5' }, unit: 'deg', marks: 2 }] }),
  num(R(2, 1), { text: 'Find the critical angle for light going from glass of refractive index 1.5 into air.', vars: {}, parts: [{ ask: 'Critical angle', use: 'p-xii-6-8', find: 'i_c', given: { mu_1: '1.5', mu_2: '1' }, unit: 'deg', marks: 2 }] }),
  num(R(3, 2), { text: 'An optical fibre’s core has a refractive index of 1.6, and its cladding has 1.4. Find the critical angle at the boundary.', vars: {}, parts: [{ ask: 'Critical angle', use: 'p-xii-6-8', find: 'i_c', given: { mu_1: '1.6', mu_2: '1.4' }, unit: 'deg', marks: 3 }] }),
  num(R(2, 2), { text: 'Light travels at 2 × 10⁸ m/s in a certain glass. Find its refractive index.', vars: {}, parts: [{ ask: 'Refractive index', use: 'p-xii-6-31', find: 'n', given: { v: '2e8 m/s' }, marks: 2 }] }),
  num(R(3, 2), { text: 'A prism of angle 60° has a minimum deviation of 40°. Find its refractive index.', vars: {}, parts: [{ ask: 'Refractive index', use: 'p-xii-6-63', find: 'n', given: { A: '60 deg', delta_m: '40 deg' }, marks: 3 }] }),
  num(R(1, 1), { text: 'A thin prism of angle 5° is made of glass of refractive index 1.5. Find the deviation it gives.', vars: {}, parts: [{ ask: 'Deviation', use: 'p-xii-6-65', find: 'delta', given: { n: '1.5', A: '5 deg' }, unit: 'deg', marks: 1 }] }),
  num(R(3, 3), { text: 'A double convex lens of glass, n = 1.5, has faces of radius 20 cm and 30 cm. Find its focal length. (Use R₁ = +20 cm and R₂ = −30 cm.)', vars: {}, parts: [{ ask: 'Focal length', use: 'p-xii-6-4', find: 'f', given: { mu: '1.5', R_1: '20 cm', R_2: '-30 cm' }, unit: 'cm', marks: 3 }] }),
  num(R(2, 1), { text: 'Thin lenses of focal lengths +20 cm and +30 cm are placed in contact. Find the focal length of the pair.', vars: {}, parts: [{ ask: 'Combined focal length', use: 'p-xii-6-56', find: 'F_c', given: { f_1: '20 cm', f_2: '30 cm' }, unit: 'cm', marks: 2 }] }),
  // ---- 6b Optical instruments
  num(I(2, 1), { text: 'A simple microscope has a lens of focal length 5 cm. Find its magnifying power when the image is at 25 cm.', vars: {}, parts: [{ ask: 'Magnifying power', use: 'p-xii-6-15', find: 'm', given: { D: '25 cm', f: '5 cm' }, marks: 2 }] }),
  num(I(2, 1), { text: 'A telescope has an objective of focal length 100 cm, and an eyepiece of 5 cm. Find its magnifying power in normal adjustment.', vars: {}, parts: [{ ask: 'Magnifying power', use: 'p-xii-6-17', find: 'm', given: { f_o: '100 cm', f_e: '5 cm' }, marks: 2 }] }),
  num(I(1, 1), { text: 'A telescope has lenses of focal lengths 80 cm and 4 cm. Find its length in normal adjustment.', vars: {}, parts: [{ ask: 'Tube length', use: 'p-xii-6-81', find: 'L', given: { f_o: '80 cm', f_e: '4 cm' }, unit: 'cm', marks: 1 }] }),
  num(I(3, 2), { text: 'A telescope in normal adjustment must magnify 30 times, with an eyepiece of 2.5 cm. Find the focal length of the objective.', vars: {}, parts: [{ ask: 'Objective focal length', use: 'p-xii-6-17', find: 'f_o', given: { m: '30', f_e: '2.5 cm' }, unit: 'cm', marks: 3 }] }),
  // ---- 6c Wave optics
  num(W(2, 1), { text: 'In Young’s experiment, the slits are 0.2 mm apart, the screen is 1 m away, and the wavelength is 600 nm. Find the fringe width.', vars: {}, parts: [{ ask: 'Fringe width', use: 'p-xii-6-9', find: 'beta', given: { lambda: '600e-9 m', D: '1 m', d: '0.2 mm' }, unit: 'mm', marks: 2 }] }),
  num(W(3, 2), { text: 'In Young’s experiment, the slits are 0.5 mm apart and the screen is 1.5 m away. The fringes are 1.8 mm wide. Find the wavelength.', vars: {}, parts: [{ ask: 'Wavelength', use: 'p-xii-6-9', find: 'lambda', given: { beta: '1.8 mm', D: '1.5 m', d: '0.5 mm' }, marks: 3 }] }),
  num(W(2, 1), { text: 'Polarised light of intensity 80 W/m² falls on an analyser at 60° to its axis. Find the transmitted intensity.', vars: {}, parts: [{ ask: 'Transmitted intensity', use: 'p-xii-6-20', find: 'I', given: { I_0: '80 W/m^2', theta: '60 deg' }, marks: 2 }] }),
  num(W(2, 2), { text: 'Light of wavelength 600 nm in air enters water of refractive index 1.33. Find its wavelength in the water.', vars: {}, parts: [{ ask: 'Wavelength in the medium', use: 'p-xii-6-34', find: 'lambda_m', given: { lambda_0: '600e-9 m', n: '1.33' }, marks: 2 }] }),
  num(W(3, 2), { text: 'A single slit is lit by light of wavelength 500 nm. The screen is 2 m away, and the central maximum is 4 mm wide. Find the width of the slit.', vars: {}, parts: [{ ask: 'Slit width', use: 'p-xii-6-115', find: 'a', given: { beta_0: '4 mm', lambda: '500e-9 m', D: '2 m' }, unit: 'mm', marks: 3 }] }),
];

export default questions;
