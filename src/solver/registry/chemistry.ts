import type { SolverEntry } from '../types';

const G = 'Gas laws';
const Q = 'Stoichiometry';
const N = 'Concentration';
const A = 'Atomic structure';
const T = 'Thermodynamics';
const E = 'Equilibrium';
const S = 'Solutions';
const L = 'Electrochemistry';
const K = 'Kinetics';

export const CHEMISTRY: SolverEntry[] = [
  // Stoichiometry and the mole
  { id: 'c-xi-1-2', topic: Q, eq: 'N = n*N_A', vars: { N: 'number of particles|positive', n: 'amount|amount', N_A: 'c:N_A' } },
  { id: 'c-xi-1-37', topic: Q, eq: 'x_A + x_B = 1', ask: 'x_A', vars: { x_A: 'mole fraction of A|fraction', x_B: 'mole fraction of B|fraction' } },
  { id: 'c-xi-1-56', topic: Q, eq: 'w_A = m_A/(m_A + m_B)', ask: 'w_A', vars: { w_A: 'mass fraction of A|fraction', m_A: 'mass of A|massg', m_B: 'mass of B|massg' } },
  { id: 'c-xi-1-68', topic: Q, eq: 'm_B = (m_A/M_A)*(b/a)*M_B', ask: 'm_B', vars: { m_B: 'mass of B|massg', m_A: 'mass of A|massg', M_A: 'molar mass of A|molarmass', b: 'coefficient of B|count', a: 'coefficient of A|count', M_B: 'molar mass of B|molarmass' } },
  { id: 'c-xi-1-110', topic: Q, eq: 'd = m/V', vars: { d: 'density|densitygml', m: 'mass|massg', V: 'volume|millilitres' } },
  { id: 'c-xi-1-52', topic: Q, eq: 'M_A*V_A/a = M_B*V_B/b', ask: 'M_B', vars: { M_A: 'molarity of A|molarity', V_A: 'volume of A|millilitres', a: 'coefficient of A|count', M_B: 'molarity of B|molarity', V_B: 'volume of B|millilitres', b: 'coefficient of B|count' } },

  // Concentration
  { id: 'c-xi-1-28', topic: N, eq: 'n = M*V', vars: { n: 'amount of solute|amount', M: 'molarity|molarity', V: 'volume of solution|litres' } },
  { id: 'c-xi-1-50', topic: N, eq: 'N_1*V_1 = N_2*V_2', ask: 'N_2', vars: { N_1: 'first normality|molarity', V_1: 'first volume|millilitres', N_2: 'second normality|molarity', V_2: 'second volume|millilitres' } },
  { id: 'c-xi-1-51', topic: N, eq: 'M_1*V_1 = M_2*V_2', ask: 'M_2', vars: { M_1: 'initial molarity|molarity', V_1: 'initial volume|millilitres', M_2: 'final molarity|molarity', V_2: 'final volume|millilitres' } },
  { id: 'c-xi-1-53', topic: N, eq: 'M = (M_1*V_1 + M_2*V_2)/(V_1 + V_2)', ask: 'M', vars: { M: 'molarity of the mixture|molarity', M_1: 'first molarity|molarity', V_1: 'first volume|millilitres', M_2: 'second molarity|molarity', V_2: 'second volume|millilitres' } },
  { id: 'c-xii-2-6', topic: N, eq: 'M = n/V', vars: { M: 'molarity|molarity', n: 'amount of solute|amount', V: 'volume of solution|litres' } },
  { id: 'c-xii-2-15', topic: N, eq: 'm = n/W', vars: { m: 'molality|molality', n: 'amount of solute|amount', W: 'mass of solvent|mass' } },
  { id: 'c-xii-2-18', topic: N, eq: 'x_A = n_A/(n_A + n_B)', ask: 'x_A', vars: { x_A: 'mole fraction of A|fraction', n_A: 'moles of A|amount', n_B: 'moles of B|amount' } },
  { id: 'c-xii-2-27', topic: N, convention: true, eq: 'M = p_w*d*10/M_2', vars: { M: 'molarity|molarity', p_w: ['mass percent', 'positive', { gen: [1, 70] }], d: 'density|densitygml', M_2: 'molar mass of solute|molarmass' } },

  // Atomic structure
  { id: 'c-xi-2-4', topic: A, eq: 'E_n = -E_R*Z^2/n^2', ask: 'E_n', vars: { E_n: ['energy of the orbit', 'electronVolt', {}], E_R: ['13.6 eV', 'electronVolt', { value: 13.6 }], Z: 'atomic number|count', n: 'principal quantum number|count' } },
  { id: 'c-xi-2-5', topic: A, eq: 'r_n = a_0*n^2/Z', vars: { r_n: 'radius of the orbit|pmLength', a_0: ['Bohr radius', 'pmLength', { value: 52.9 }], n: 'principal quantum number|count', Z: 'atomic number|count' } },
  { id: 'c-xi-2-24', topic: A, eq: 'c = nu*lambda', ask: 'nu', vars: { c: 'c:c', nu: 'frequency|lightFrequency', lambda: 'wavelength|wavelength' } },
  { id: 'c-xi-2-26', topic: A, eq: 'nu_bar = 1/lambda', vars: { nu_bar: 'wave number|wavenumber', lambda: 'wavelength|wavelength' } },
  { id: 'c-xi-2-28', topic: A, eq: 'E = n*h*nu', vars: { E: 'energy|energy', n: 'number of quanta|count', h: 'c:h', nu: 'frequency|lightFrequency' } },
  { id: 'c-xi-2-29', topic: A, eq: 'E = N_A*h*c/lambda', vars: { E: 'energy per mole of photons|molarEnergy', N_A: 'c:N_A', h: 'c:h', c: 'c:c', lambda: 'wavelength|wavelength' } },
  { id: 'c-xi-2-49', topic: A, eq: 'nu = DeltaE/h', vars: { nu: 'frequency|lightFrequency', DeltaE: ['energy gap', 'energy', { gen: [3e-19, 2e-18] }], h: 'c:h' } },
  { id: 'c-xi-2-77', topic: A, eq: 'Deltav = h/(4*pi*m*Deltax)', vars: { Deltav: 'uncertainty in velocity|speed', h: 'c:h', m: ['mass', 'mass', { gen: [9e-31, 2e-27] }], Deltax: ['uncertainty in position', 'length', { gen: [1e-11, 1e-9] }] } },
  { id: 'c-xi-2-100', topic: A, eq: 'L = sqrt(l*(l + 1))*h/(2*pi)', ask: 'L', vars: { L: 'orbital angular momentum|angmom', l: ['azimuthal quantum number', 'count', { gen: [1, 4] }], h: 'c:h' } },
  { id: 'c-xi-2-40', topic: A, eq: 'm_e*v*r = n*h/(2*pi)', ask: 'v', vars: { m_e: 'c:m_e', v: ['speed of the electron', 'speed', { gen: [1e5, 3e6] }], r: ['orbit radius', 'length', { gen: [5e-11, 5e-10] }], n: 'principal quantum number|count', h: 'c:h' } },
  { id: 'c-xi-4-1', topic: A, eq: 'FC = V_e - N_e - B_e/2', ask: 'FC', vars: { FC: 'formal charge|real', V_e: ['valence electrons', 'count', { gen: [1, 8] }], N_e: ['non-bonding electrons', 'count', { gen: [1, 6] }], B_e: ['bonding electrons', 'count', { gen: [2, 8] }] } },
  { id: 'c-xi-4-2', topic: A, eq: 'BO = (N_b - N_a)/2', ask: 'BO', vars: { BO: 'bond order|real', N_b: ['bonding electrons', 'count', { gen: [2, 10] }], N_a: ['antibonding electrons', 'count', { gen: [1, 6] }] } },
  { id: 'c-xi-4-3', topic: A, eq: 'mu = q*d', vars: { mu: 'dipole moment|dipole', q: ['charge', 'charge', { gen: [1e-20, 1.6e-19] }], d: ['bond length', 'length', { gen: [1e-10, 3e-10] }] } },

  // Gas laws
  { id: 'c-xi-5-9', topic: G, eq: 'P*M = d*R*T', ask: 'd', vars: { P: 'pressure|pressure', M: 'molar mass|molarmassSI', d: ['density', 'density', { gen: [0.5, 5] }], R: 'c:R', T: 'temperature|temperature' } },

  // Thermodynamics
  { id: 'c-xi-6-1', topic: T, eq: 'DeltaU = q + w', vars: { DeltaU: 'change in internal energy|energy', q: 'heat absorbed|energy', w: 'work done on the system|energy' } },
  { id: 'c-xi-6-5', topic: T, eq: 'DeltaG = DeltaH - T*DeltaS', vars: { DeltaG: 'Gibbs energy change|molarEnergy', DeltaH: 'enthalpy change|molarEnergy', T: 'temperature|temperature', DeltaS: 'entropy change|molarEntropy' } },
  { id: 'c-xi-6-6', topic: T, eq: 'DeltaG0 = -R*T*log(K)', ask: 'DeltaG0', vars: { DeltaG0: 'standard Gibbs energy change|molarEnergy', R: 'c:R', T: 'temperature|temperature', K: ['equilibrium constant', 'positive', {}] } },
  { id: 'c-xi-6-7', topic: T, eq: 'DeltaG = DeltaG0 + R*T*log(Q)', ask: 'DeltaG', vars: { DeltaG: 'Gibbs energy change|molarEnergy', DeltaG0: 'standard Gibbs energy change|molarEnergy', R: 'c:R', T: 'temperature|temperature', Q: ['reaction quotient', 'positive', {}] } },
  { id: 'c-xi-6-28', topic: T, eq: 'w = -P*DeltaV', ask: 'w', vars: { w: 'work|energy', P: 'external pressure|pressure', DeltaV: 'change in volume|volume' } },
  { id: 'c-xi-6-30', topic: T, eq: 'w = -2.303*n*R*T*log10(V_2/V_1)', ask: 'w', vars: { w: 'work|energy', n: 'amount|amount', R: 'c:R', T: 'temperature|temperature', V_2: 'final volume|volume', V_1: 'initial volume|volume' } },
  { id: 'c-xi-6-40', topic: T, eq: 'DeltaH = n*C_P*DeltaT', vars: { DeltaH: 'enthalpy change|energy', n: 'amount|amount', C_P: 'molar heat capacity|molarheat', DeltaT: 'temperature change|tempdiff' } },
  { id: 'c-xi-6-41', topic: T, eq: 'DeltaH - DeltaU = Deltan_g*R*T', ask: 'DeltaH', vars: { DeltaH: 'enthalpy change|molarEnergy', DeltaU: 'internal energy change|molarEnergy', Deltan_g: ['change in moles of gas', 'index', { gen: [-3, 4] }], R: 'c:R', T: 'temperature|temperature' } },
  { id: 'c-xi-6-47', topic: T, eq: 'q = m*c*DeltaT', vars: { q: 'heat|energy', m: 'mass|mass', c: 'specific heat|specheat', DeltaT: 'temperature change|tempdiff' } },
  { id: 'c-xi-6-92', topic: T, eq: 'DeltaS = DeltaH/T', vars: { DeltaS: 'entropy of fusion|molarEntropy', DeltaH: 'enthalpy of fusion|molarEnergy', T: 'melting point|temperature' } },
  { id: 'c-xi-6-93', topic: T, eq: 'DeltaS = DeltaH/T', vars: { DeltaS: 'entropy of vaporisation|molarEntropy', DeltaH: 'enthalpy of vaporisation|molarEnergy', T: 'boiling point|temperature' } },
  { id: 'c-xi-6-124', topic: T, eq: 'T = DeltaH/DeltaS', vars: { T: 'transition temperature|temperature', DeltaH: ['enthalpy change', 'molarEnergy', { gen: [1e4, 1e5], min: 0, exclusiveMin: true }], DeltaS: ['entropy change', 'molarEntropy', { gen: [30, 300], min: 0, exclusiveMin: true }] } },
  { id: 'c-xi-6-127', topic: T, eq: 'DeltaG0 = -n*F*E0', ask: 'DeltaG0', vars: { DeltaG0: 'standard Gibbs energy change|molarEnergy', n: ['electrons transferred', 'count', { gen: [1, 6] }], F: 'c:F', E0: ['standard cell potential', 'voltage', { gen: [0.1, 3] }] } },

  // Equilibrium
  { id: 'c-xi-7-3', topic: E, eq: 'pH = -log10(H)', vars: { pH: 'pH|ph', H: ['value of [H⁺] in mol/L', 'concValue', { tex: '[\\mathrm{H^+}]' }] } },
  { id: 'c-xi-7-4', topic: E, eq: 'pOH = -log10(OH)', vars: { pOH: 'pOH|ph', OH: ['value of [OH⁻] in mol/L', 'concValue', { tex: '[\\mathrm{OH^-}]' }] } },
  { id: 'c-xi-7-5', topic: E, eq: 'K_w = H*OH', ask: 'K_w', vars: { K_w: 'ionic product of water|equilibrium', H: ['value of [H⁺]', 'concValue', { tex: '[\\mathrm{H^+}]' }], OH: ['value of [OH⁻]', 'concValue', { tex: '[\\mathrm{OH^-}]' }] } },
  { id: 'c-xi-7-6', topic: E, eq: 'pH = pK_a + log10(S_c/A_c)', ask: 'pH', vars: { pH: 'pH of the buffer|ph', pK_a: ['pKa', 'ph', { gen: [3, 10] }], S_c: ['value of [salt]', 'concValue', { tex: '[\\mathrm{salt}]' }], A_c: ['value of [acid]', 'concValue', { tex: '[\\mathrm{acid}]' }] } },
  { id: 'c-xi-7-9', topic: E, eq: 'K_a*K_b = K_w', ask: 'K_b', vars: { K_a: 'acid constant|equilibrium', K_b: 'base constant|equilibrium', K_w: ['ionic product of water', 'equilibrium', { value: 1e-14 }] } },
  { id: 'c-xi-7-10', topic: E, eq: 'alpha = sqrt(K_a/C_c)', vars: { alpha: 'degree of dissociation|fraction', K_a: ['acid constant', 'equilibrium', { gen: [1e-6, 1e-4] }], C_c: ['value of the concentration', 'concValue', { gen: [0.01, 1] }] } },
  { id: 'c-xi-7-13', topic: E, eq: 'K_h = K_w/K_a', vars: { K_h: 'hydrolysis constant|equilibrium', K_w: ['ionic product of water', 'equilibrium', { value: 1e-14 }], K_a: 'acid constant|equilibrium' } },
  { id: 'c-xi-7-17', topic: E, eq: 'K_c = k_f/k_r', vars: { K_c: 'equilibrium constant|positive', k_f: 'forward rate constant|rate1', k_r: 'reverse rate constant|rate1' } },
  { id: 'c-xi-7-95', topic: E, eq: 'pK_a = -log10(K_a)', vars: { pK_a: 'pKa|ph', K_a: 'acid constant|equilibrium' } },
  { id: 'c-xi-7-96', topic: E, eq: 'pK_a + pK_b = pK_w', ask: 'pK_b', vars: { pK_a: ['pKa', 'ph', { gen: [3, 10] }], pK_b: 'pKb|ph', pK_w: ['pKw', 'ph', { value: 14 }] } },
  { id: 'c-xi-7-147', topic: E, eq: 'h_d = sqrt(K_h/C_c)', ask: 'h_d', vars: { h_d: 'degree of hydrolysis|fraction', K_h: ['hydrolysis constant', 'equilibrium', { gen: [1e-10, 1e-6] }], C_c: ['value of the concentration', 'concValue', { gen: [0.01, 1] }] } },
  { id: 'c-xi-7-177', topic: E, eq: 'K_sp = s^2', vars: { K_sp: 'solubility product|equilibrium', s: ['solubility value', 'concValue', { gen: [1e-6, 1e-3] }] } },
  { id: 'c-xi-7-178', topic: E, eq: 'K_sp = 4*s^3', vars: { K_sp: 'solubility product|equilibrium', s: ['solubility value', 'concValue', { gen: [1e-5, 1e-2] }] } },
  { id: 'c-xi-7-179', topic: E, eq: 'K_sp = 27*s^4', vars: { K_sp: 'solubility product|equilibrium', s: ['solubility value', 'concValue', { gen: [1e-5, 1e-2] }] } },
  { id: 'c-xi-7-180', topic: E, eq: 'K_sp = 108*s^5', vars: { K_sp: 'solubility product|equilibrium', s: ['solubility value', 'concValue', { gen: [1e-5, 1e-2] }] } },
  { id: 'c-xi-7-54', topic: E, eq: 'K_p = alpha^2*P/(1 - alpha^2)', ask: 'K_p', vars: { K_p: 'Kp|positive', alpha: 'degree of dissociation|fraction', P: ['total pressure', 'positive', { gen: [0.5, 5] }] } },

  // Solutions
  { id: 'c-xii-2-1', topic: S, eq: 'P_A = x_A*P_0', vars: { P_A: 'partial vapour pressure|pressure', x_A: 'mole fraction|fraction', P_0: 'vapour pressure of the pure liquid|pressure' } },
  { id: 'c-xii-2-2', topic: S, eq: '(P_0 - P)/P_0 = x_s', ask: 'x_s', vars: { P_0: ['vapour pressure of pure solvent', 'pressure', { gen: [5e3, 1e5] }], P: ['vapour pressure of the solution', 'pressure', { gen: [1e3, 4e3] }], x_s: 'mole fraction of solute|fraction' } },
  { id: 'c-xii-2-3', topic: S, eq: 'DeltaT_b = K_b*m', vars: { DeltaT_b: 'elevation of boiling point|tempdiff', K_b: 'ebullioscopic constant|ebullioscopic', m: 'molality|molality' } },
  { id: 'c-xii-2-4', topic: S, eq: 'DeltaT_f = K_f*m', vars: { DeltaT_f: 'depression of freezing point|tempdiff', K_f: 'cryoscopic constant|ebullioscopic', m: 'molality|molality' } },
  { id: 'c-xii-2-5', topic: S, eq: 'pi_o = C*R*T', ask: 'pi_o', vars: { pi_o: ['osmotic pressure', 'pressure', {}], C: ['molar concentration', 'molarityM3', {}], R: 'c:R', T: 'temperature|temperature' } },
  { id: 'c-xii-2-9', topic: S, eq: 'p = K_H*x', vars: { p: 'partial pressure of the gas|pressure', K_H: "Henry's constant|henry", x: ['mole fraction', 'fraction', { gen: [1e-5, 1e-2] }] } },
  { id: 'c-xii-2-12', topic: S, eq: 'pi_o = i*C*R*T', ask: 'pi_o', vars: { pi_o: ['osmotic pressure', 'pressure', {}], i: ["van 't Hoff factor", 'positive', { gen: [1, 3] }], C: ['molar concentration', 'molarityM3', {}], R: 'c:R', T: 'temperature|temperature' } },
  { id: 'c-xii-2-13', topic: S, eq: 'DeltaT_b = i*K_b*m', vars: { DeltaT_b: 'elevation of boiling point|tempdiff', i: ["van 't Hoff factor", 'positive', { gen: [1, 3] }], K_b: 'ebullioscopic constant|ebullioscopic', m: 'molality|molality' } },
  { id: 'c-xii-2-14', topic: S, eq: 'DeltaT_f = i*K_f*m', vars: { DeltaT_f: 'depression of freezing point|tempdiff', i: ["van 't Hoff factor", 'positive', { gen: [1, 3] }], K_f: 'cryoscopic constant|ebullioscopic', m: 'molality|molality' } },
  { id: 'c-xii-2-56', topic: S, convention: true, eq: 'M_2 = 1000*K_b*w_2/(DeltaT_b*w_1)', ask: 'M_2', vars: { M_2: 'molar mass of solute|molarmass', K_b: 'ebullioscopic constant|ebullioscopic', w_2: 'mass of solute|massg', DeltaT_b: ['elevation of boiling point', 'tempdiff', { gen: [0.1, 5] }], w_1: 'mass of solvent|massg' } },
  { id: 'c-xii-2-57', topic: S, convention: true, eq: 'M_2 = 1000*K_f*w_2/(DeltaT_f*w_1)', ask: 'M_2', vars: { M_2: 'molar mass of solute|molarmass', K_f: 'cryoscopic constant|ebullioscopic', w_2: 'mass of solute|massg', DeltaT_f: ['depression of freezing point', 'tempdiff', { gen: [0.1, 5] }], w_1: 'mass of solvent|massg' } },
  { id: 'c-xii-2-88', topic: S, eq: 'alpha = (i - 1)/(n - 1)', ask: 'alpha', vars: { alpha: 'degree of dissociation|fraction', i: ["van 't Hoff factor", 'positive', { gen: [1.1, 1.9] }], n: ['ions per formula unit', 'count', { gen: [2, 4] }] } },

  // Electrochemistry
  { id: 'c-xii-3-1', topic: L, eq: 'E = E0 - (R*T/(n*F))*log(Q)', ask: 'E', vars: { E: 'cell potential|voltage', E0: ['standard cell potential', 'voltage', { gen: [0.1, 3] }], R: 'c:R', T: 'temperature|temperature', n: ['electrons transferred', 'count', { gen: [1, 6] }], F: 'c:F', Q: ['reaction quotient', 'positive', {}] } },
  { id: 'c-xii-3-55', topic: L, eq: 'E = E0 - (N_v/n)*log10(Q)', ask: 'E', vars: { E: 'cell potential|voltage', E0: ['standard cell potential', 'voltage', { gen: [0.1, 3] }], N_v: ['0.0591 V at 298 K', 'voltage', { value: 0.0591 }], n: ['electrons transferred', 'count', { gen: [1, 6] }], Q: ['reaction quotient', 'positive', {}] } },
  { id: 'c-xii-3-3', topic: L, eq: 'DeltaG0 = -n*F*E0', ask: 'DeltaG0', vars: { DeltaG0: 'standard Gibbs energy change|molarEnergy', n: ['electrons transferred', 'count', { gen: [1, 6] }], F: 'c:F', E0: ['standard cell potential', 'voltage', { gen: [0.1, 3] }] } },
  { id: 'c-xii-3-4', topic: L, eq: 'log10(K) = n*E0/N_v', ask: 'K', vars: { K: 'equilibrium constant|positive', n: ['electrons transferred', 'count', { gen: [1, 4] }], E0: ['standard cell potential', 'voltage', { gen: [0.05, 0.6] }], N_v: ['0.059 V at 298 K', 'voltage', { value: 0.059 }] } },
  { id: 'c-xii-3-6', topic: L, eq: 'Lambda_m = kappa/c', ask: 'Lambda_m', vars: { Lambda_m: 'molar conductivity|molarCond', kappa: 'conductivity|conductivityE2', c: ['concentration', 'molarityM3', {}] } },
  { id: 'c-xii-3-7', topic: L, eq: 'm = M*I*t/(n*F)', ask: 'm', vars: { m: 'mass deposited|massg', M: 'molar mass|molarmass', I: 'current|current', t: ['time', 'time', { gen: [60, 3600] }], n: ['electrons per ion', 'count', { gen: [1, 3] }], F: 'c:F' } },
  { id: 'c-xii-3-8', topic: L, eq: 'kappa = 1/rho', vars: { kappa: 'conductivity|conductivityE', rho: 'resistivity|resistivity' } },
  { id: 'c-xii-3-9', topic: L, eq: 'G_c = l/A', vars: { G_c: 'cell constant|cellConstant', l: ['electrode separation', 'length', { gen: [0.005, 0.05] }], A: ['electrode area', 'area', { gen: [1e-4, 1e-2] }] } },
  { id: 'c-xii-3-13', topic: L, eq: 'G = 1/R', vars: { G: 'conductance|conductance', R: 'resistance|resistance' } },
  { id: 'c-xii-3-18', topic: L, eq: 'kappa = G*G_c', vars: { kappa: 'conductivity|conductivityE2', G: 'conductance|conductance', G_c: 'cell constant|cellConstant' } },
  { id: 'c-xii-3-26', topic: L, eq: 'alpha = Lambda_m/Lambda_0', ask: 'alpha', vars: { alpha: 'degree of dissociation|fraction', Lambda_m: ['molar conductivity', 'molarCond', { gen: [0.0005, 0.005] }], Lambda_0: ['limiting molar conductivity', 'molarCond', { gen: [0.01, 0.05] }] } },
  { id: 'c-xii-3-69', topic: L, eq: 'Q = I*t', vars: { Q: 'charge|charge', I: 'current|current', t: 'time|time' } },
  { id: 'c-xii-3-72', topic: L, eq: 'n_e = I*t/F', vars: { n_e: 'moles of electrons|amount', I: 'current|current', t: ['time', 'time', { gen: [60, 3600] }], F: 'c:F' } },
  { id: 'c-xii-3-64', topic: L, eq: 'E = (N_v/n)*log10(c_2/c_1)', ask: 'E', vars: { E: 'cell potential|voltage', N_v: ['0.0591 V at 298 K', 'voltage', { value: 0.0591 }], n: ['electrons transferred', 'count', { gen: [1, 3] }], c_2: ['larger concentration', 'concValue', { gen: [0.1, 1] }], c_1: ['smaller concentration', 'concValue', { gen: [0.001, 0.05] }] } },

  // Kinetics
  { id: 'c-xii-4-2', topic: K, eq: 'k = (2.303/t)*log10(A_0/A)', ask: 'k', vars: { k: 'rate constant|rate1', t: ['time', 'period', { gen: [10, 600] }], A_0: ['initial concentration', 'molarity', { gen: [0.5, 2] }], A: ['concentration at time t', 'molarity', { gen: [0.05, 0.4] }] } },
  { id: 'c-xii-4-39', topic: K, eq: 't_half = 0.693/k', vars: { t_half: 'half-life|period', k: 'rate constant|rate1' } },
  { id: 'c-xii-4-40', topic: K, eq: 'k = 0.693/t_half', vars: { k: 'rate constant|rate1', t_half: 'half-life|period' } },
  { id: 'c-xii-4-5', topic: K, eq: 'k = A*exp(-E_a/(R*T))', ask: 'k', vars: { k: 'rate constant|rate1', A: ['frequency factor', 'rate1', { gen: [1e8, 1e13] }], E_a: 'activation energy|activation', R: 'c:R', T: 'temperature|temperature' } },
  { id: 'c-xii-4-6', topic: K, eq: 'log10(k_2/k_1) = (E_a/(2.303*R))*(1/T_1 - 1/T_2)', ask: 'E_a', vars: { k_2: ['rate constant at T₂', 'rate1', { gen: [0.1, 0.5] }], k_1: ['rate constant at T₁', 'rate1', { gen: [0.001, 0.05] }], E_a: 'activation energy|activation', R: 'c:R', T_1: ['lower temperature', 'temperature', { gen: [280, 320] }], T_2: ['higher temperature', 'temperature', { gen: [330, 400] }] } },
  { id: 'c-xii-4-7', topic: K, eq: 'A = A_0 - k*t', ask: 'A', vars: { A: 'concentration at time t|molarity', A_0: ['initial concentration', 'molarity', { gen: [1, 2] }], k: ['rate constant', 'rate0', { gen: [0.001, 0.01] }], t: ['time', 'time', { gen: [1, 60] }] } },
  { id: 'c-xii-4-8', topic: K, eq: 't_half = A_0/(2*k)', vars: { t_half: 'half-life|period', A_0: 'initial concentration|molarity', k: 'rate constant|rate0' } },
  { id: 'c-xii-4-34', topic: K, eq: 'C = C_0*exp(-k*t)', ask: 'C', vars: { C: 'concentration at time t|molarity', C_0: 'initial concentration|molarity', k: 'rate constant|rate1', t: ['time', 'time', { gen: [1, 100] }] } },
  { id: 'c-xii-4-62', topic: K, eq: 'DeltaH = E_f - E_r', vars: { DeltaH: 'enthalpy change|molarEnergy', E_f: 'forward activation energy|activation', E_r: 'reverse activation energy|activation' } },
];
