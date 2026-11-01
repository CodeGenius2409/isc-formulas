import type { SolverEntry } from '../types';

const A = 'Algebra';
const S = 'Sequences';
const T = 'Trigonometry';
const C = 'Coordinate geometry';
const D = 'Calculus';
const V = 'Vectors';
const P = 'Probability';
const X = 'Statistics';

export const MATHEMATICS: SolverEntry[] = [
  // Algebra
  { id: 'm-xi-2-1', topic: A, eq: 'z_m = sqrt(a^2 + b^2)', ask: 'z_m', vars: { z_m: 'modulus|positive', a: 'real part|real', b: 'imaginary part|real' } },
  { id: 'm-xi-2-9', topic: A, eq: 'D = b^2 - 4*a*c', ask: 'D', vars: { D: 'discriminant|real', b: 'coefficient of x|real', a: 'coefficient of x²|real', c: 'constant term|real' } },
  { id: 'm-xi-2-101', topic: A, eq: 'a*x^2 + b*x + c = 0', ask: 'x', vars: { a: ['coefficient of x²', 'real', { gen: [1, 5] }], x: 'unknown x|real', b: ['coefficient of x', 'real', { gen: [-20, 20] }], c: ['constant term', 'real', { gen: [-20, 0] }] } },
  { id: 'm-xi-2-133', topic: A, eq: 'b^2 = 4*a*c', ask: 'c', vars: { b: 'coefficient of x|real', a: ['coefficient of x²', 'positive', {}], c: 'constant term|real' } },
  { id: 'm-xi-2-468', topic: A, eq: 'L_a = log(x)/log(a)', ask: 'L_a', vars: { L_a: 'value of the logarithm|real', x: 'number|positive', a: ['base', 'positive', { gen: [2, 12] }] } },
  { id: 'm-xi-2-404', topic: A, eq: 'y = a^2 + 2*a*b + b^2', ask: 'y', vars: { y: 'value of (a + b)²|real', a: 'a|real', b: 'b|real' } },
  { id: 'm-xi-2-260', topic: A, eq: 'H = 2*a*b/(a + b)', ask: 'H', vars: { H: 'harmonic mean|positive', a: 'first number|positive', b: 'second number|positive' } },
  { id: 'm-xi-2-243', topic: A, eq: 'G = sqrt(a*c)', vars: { G: 'geometric mean|positive', a: 'first number|positive', c: 'second number|positive' } },
  { id: 'm-xi-2-261', topic: A, eq: 'G^2 = A_m*H', ask: 'G', vars: { G: 'geometric mean|positive', A_m: 'arithmetic mean|positive', H: 'harmonic mean|positive' } },

  // Sequences
  { id: 'm-xi-2-10', topic: S, eq: 'a_n = a + (n - 1)*d', vars: { a_n: 'nth term|real', a: 'first term|real', n: 'term number|count', d: 'common difference|real' } },
  { id: 'm-xi-2-12', topic: S, eq: 'a_n = a*r^(n - 1)', vars: { a_n: 'nth term|real', a: 'first term|positive', r: ['common ratio', 'positive', { gen: [1.2, 3] }], n: 'term number|count' } },
  { id: 'm-xi-2-13', topic: S, eq: 'S_n = a*(r^n - 1)/(r - 1)', ask: 'S_n', vars: { S_n: 'sum of n terms|real', a: 'first term|positive', r: ['common ratio', 'positive', { gen: [1.2, 3] }], n: 'number of terms|count' } },
  { id: 'm-xi-2-14', topic: S, eq: 'S = a/(1 - r)', ask: 'S', vars: { S: 'sum to infinity|real', a: 'first term|positive', r: ['common ratio', 'ratio', { max: 1 }] } },
  { id: 'm-xi-2-209', topic: S, eq: 'd = a_2 - a_1', vars: { d: 'common difference|real', a_2: 'second term|real', a_1: 'first term|real' } },
  { id: 'm-xi-2-211', topic: S, eq: 'l = a + (n - 1)*d', vars: { l: 'last term|real', a: 'first term|real', n: 'number of terms|count', d: 'common difference|real' } },
  { id: 'm-xi-2-214', topic: S, eq: 'S_n = (n/2)*(a + l)', vars: { S_n: 'sum of n terms|real', n: 'number of terms|count', a: 'first term|real', l: 'last term|real' } },
  { id: 'm-xi-2-215', topic: S, eq: 'S_n = n*a + (n*(n - 1)/2)*d', ask: 'S_n', vars: { S_n: 'sum of n terms|real', n: 'number of terms|count', a: 'first term|real', d: 'common difference|real' } },
  { id: 'm-xi-2-223', topic: S, eq: 'd = (a_m - a_n)/(m - n)', ask: 'd', vars: { d: 'common difference|real', a_m: 'term a_m|real', a_n: 'term a_n|real', m: ['position m', 'count', { gen: [11, 20] }], n: ['position n', 'count', { gen: [2, 10] }] } },
  { id: 'm-xi-2-236', topic: S, eq: 'r = a_2/a_1', vars: { r: 'common ratio|real', a_2: 'second term|positive', a_1: 'first term|positive' } },
  { id: 'm-xi-2-240', topic: S, eq: 'l = a*r^(n - 1)', vars: { l: 'last term|real', a: 'first term|positive', r: ['common ratio', 'positive', { gen: [1.2, 3] }], n: 'number of terms|count' } },
  { id: 'm-xi-2-257', topic: S, eq: 'a = S*(1 - r)', vars: { a: 'first term|real', S: 'sum to infinity|positive', r: ['common ratio', 'ratio', { max: 1 }] } },
  { id: 'm-xi-2-294', topic: S, eq: 'T_n = S_n - S_p', vars: { T_n: 'nth term|real', S_n: 'sum of n terms|real', S_p: 'sum of (n − 1) terms|real' } },

  // Trigonometry
  { id: 'm-xi-1-19', topic: T, eq: 's = r*theta', vars: { s: 'arc length|positive', r: 'radius|positive', theta: ['angle at the centre', 'rotation', { gen: [0.3, 3] }] } },
  { id: 'm-xi-1-19b', topic: T, eq: 'A = (1/2)*r^2*theta', vars: { A: 'area of the sector|positive', r: 'radius|positive', theta: ['angle at the centre', 'rotation', { gen: [0.3, 3] }] } },
  { id: 'm-xi-1-175', topic: T, eq: 'l = pi*r*theta_d/180', vars: { l: 'arc length|positive', r: 'radius|positive', theta_d: ['angle in degrees', 'positive', { gen: [10, 170] }] } },
  { id: 'm-xi-1-177', topic: T, eq: 'A = (1/2)*l*r', vars: { A: 'area of the sector|positive', l: 'arc length|positive', r: 'radius|positive' } },
  { id: 'm-xi-1-178', topic: T, eq: 'A = (theta_d/360)*pi*r^2', vars: { A: 'area of the sector|positive', theta_d: ['angle in degrees', 'positive', { gen: [10, 350] }], r: 'radius|positive' } },
  { id: 'm-xi-1-179', topic: T, eq: 'P = r*(2 + theta)', ask: 'P', vars: { P: 'perimeter of the sector|positive', r: 'radius|positive', theta: ['angle at the centre', 'rotation', { gen: [0.3, 3] }] } },
  { id: 'm-xi-1-20j', topic: T, eq: 'a/sin(A_a) = b/sin(B_a)', ask: 'b', vars: { a: 'side a|positive', A_a: ['angle A', 'mathAngle', { gen: [0.5, 1.4] }], b: 'side b|positive', B_a: ['angle B', 'mathAngle', { gen: [0.5, 1.4] }] } },
  { id: 'm-xi-1-20k', topic: T, eq: 'c^2 = a^2 + b^2 - 2*a*b*cos(C_a)', ask: 'c', vars: { c: 'side c|positive', a: 'side a|positive', b: 'side b|positive', C_a: 'angle C|mathAngle' } },
  { id: 'm-xi-1-20m', topic: T, eq: 'A = (1/2)*a*b*sin(C_a)', vars: { A: 'area of the triangle|positive', a: 'side a|positive', b: 'side b|positive', C_a: 'angle C|mathAngle' } },

  // Coordinate geometry
  { id: 'm-xi-3-1', topic: C, eq: 'm = (y_2 - y_1)/(x_2 - x_1)', ask: 'm', vars: { m: 'slope|real', y_2: 'y of the second point|real', y_1: 'y of the first point|real', x_2: ['x of the second point', 'real', { gen: [6, 20] }], x_1: ['x of the first point', 'real', { gen: [-20, 5] }] } },
  { id: 'm-xi-3-2', topic: C, eq: 'y - y_1 = m*(x - x_1)', ask: 'y', vars: { y: 'y on the line|real', y_1: 'y of the known point|real', m: 'slope|real', x: 'x on the line|real', x_1: 'x of the known point|real' } },
  { id: 'm-xi-3-4', topic: C, eq: 'y = m*x + c', vars: { y: 'y|real', m: 'slope|real', x: 'x|real', c: 'y-intercept|real' } },
  { id: 'm-xi-3-5', topic: C, eq: 'x/a + y/b = 1', ask: 'y', vars: { x: 'x|real', a: ['x-intercept', 'positive', {}], y: 'y|real', b: ['y-intercept', 'positive', {}] } },
  { id: 'm-xi-3-9', topic: C, eq: 'd = sqrt((x_2 - x_1)^2 + (y_2 - y_1)^2)', ask: 'd', vars: { d: 'distance|positive', x_2: 'x of the second point|real', x_1: 'x of the first point|real', y_2: 'y of the second point|real', y_1: 'y of the first point|real' } },
  { id: 'm-xi-3-11', topic: C, eq: '(x - h)^2 + (y - k)^2 = r^2', ask: 'r', vars: { x: 'x of a point on the circle|real', h: 'x of the centre|real', y: 'y of a point on the circle|real', k: 'y of the centre|real', r: 'radius|positive' } },
  { id: 'm-xi-3-13', topic: C, eq: 'y^2 = 4*a*x', ask: 'a', vars: { y: 'y|real', a: 'focal distance|positive', x: 'x|positive' } },
  { id: 'm-xi-3-18', topic: C, eq: 'd = sqrt(x^2 + y^2)', ask: 'd', vars: { d: 'distance from the origin|positive', x: 'x|real', y: 'y|real' } },
  { id: 'm-xi-3-46', topic: C, eq: 'D_a = (sqrt(3)/4)*a^2', vars: { D_a: 'area|positive', a: 'side|positive' } },
  { id: 'm-xi-3-52', topic: C, eq: 'AD = (1/2)*sqrt(2*b^2 + 2*c^2 - a^2)', ask: 'AD', vars: { AD: 'length of the median|positive', b: 'side b|positive', c: 'side c|positive', a: ['side a', 'positive', { gen: [1, 10] }] } },
  { id: 'm-xi-3-61', topic: C, eq: 'm = -a/b', ask: 'm', vars: { m: 'slope|real', a: 'coefficient of x|real', b: ['coefficient of y', 'positive', {}] } },
  { id: 'm-xi-3-102', topic: C, eq: 'd = abs(c_1 - c_2)/sqrt(a^2 + b^2)', ask: 'd', vars: { d: 'distance between the lines|positive', c_1: 'first constant|real', c_2: 'second constant|real', a: 'coefficient of x|real', b: 'coefficient of y|real' } },
  { id: 'm-xi-3-204', topic: C, eq: 'A = pi*a*b', vars: { A: 'area of the ellipse|positive', a: 'semi-major axis|positive', b: 'semi-minor axis|positive' } },
  { id: 'm-xi-3-229', topic: C, eq: 'd = sqrt(x^2 + y^2 + z^2)', ask: 'd', vars: { d: 'distance from the origin|positive', x: 'x|real', y: 'y|real', z: 'z|real' } },
  { id: 'm-xi-3-111', topic: C, eq: 'h = 2*D_a/b', vars: { h: 'height|positive', D_a: 'area of the triangle|positive', b: 'base|positive' } },

  // Calculus
  { id: 'm-xi-4-163', topic: D, eq: 'dA = 2*x', vars: { dA: 'dA/dx|positive', x: 'side|positive' } },
  { id: 'm-xi-4-161', topic: D, eq: 'dA = 2*pi*r', vars: { dA: 'dA/dr|positive', r: 'radius|positive' } },
  { id: 'm-xi-4-162', topic: D, eq: 'dV = 4*pi*r^2', vars: { dV: 'dV/dr|positive', r: 'radius|positive' } },
  { id: 'm-xii-3-126', topic: D, eq: 'dA_dt = 2*pi*r*dr_dt', vars: { dA_dt: 'rate of change of area|real', r: 'radius|positive', dr_dt: 'rate of change of radius|real' } },
  { id: 'm-xii-3-127', topic: D, eq: 'dV_dt = 4*pi*r^2*dr_dt', vars: { dV_dt: 'rate of change of volume|real', r: 'radius|positive', dr_dt: 'rate of change of radius|real' } },
  { id: 'p-xi-2-18', topic: D, eq: 'dy = n*x^(n - 1)', ask: 'dy', vars: { dy: 'derivative of xⁿ at x|real', n: 'power|count', x: 'x|positive' } },
  { id: 'p-xi-2-26', topic: D, eq: 'I_d = (b^(n + 1) - a^(n + 1))/(n + 1)', ask: 'I_d', vars: { I_d: 'value of the integral|real', b: ['upper limit', 'real', { gen: [3, 8] }], a: ['lower limit', 'real', { gen: [0, 2] }], n: ['power', 'count', { gen: [1, 4] }] } },

  // Vectors
  { id: 'p-xi-2-95', topic: V, eq: 'A = sqrt(A_x^2 + A_y^2 + A_z^2)', ask: 'A', vars: { A: 'magnitude|positive', A_x: 'x component|real', A_y: 'y component|real', A_z: 'z component|real' } },
  { id: 'p-xi-2-131', topic: V, eq: 'D_p = A*B*cos(theta)', vars: { D_p: 'dot product|real', A: 'magnitude of the first vector|positive', B: 'magnitude of the second vector|positive', theta: 'angle between them|mathAngle' } },
  { id: 'p-xi-2-132', topic: V, eq: 'D_p = A_x*B_x + A_y*B_y + A_z*B_z', ask: 'D_p', vars: { D_p: 'dot product|real', A_x: 'first x component|real', B_x: 'second x component|real', A_y: 'first y component|real', B_y: 'second y component|real', A_z: 'first z component|real', B_z: 'second z component|real' } },
  { id: 'p-xi-2-143', topic: V, eq: 'C_p = A*B*sin(theta)', vars: { C_p: 'magnitude of the cross product|positive', A: 'magnitude of the first vector|positive', B: 'magnitude of the second vector|positive', theta: 'angle between them|mathAngle' } },
  { id: 'p-xi-2-107', topic: V, eq: 'A_x = A*cos(theta)', vars: { A_x: 'x component|real', A: 'magnitude|positive', theta: 'angle with the x axis|mathAngle' } },
  { id: 'm-xii-4-61', topic: V, eq: 'cos(theta) = D_p/(a*b)', ask: 'theta', vars: { theta: 'angle between the vectors|mathAngle', D_p: ['dot product', 'real', { gen: [-15, 15] }], a: ['magnitude of a', 'positive', { gen: [5, 20] }], b: ['magnitude of b', 'positive', { gen: [5, 20] }] } },

  // Probability
  { id: 'm-xi-5-5', topic: P, eq: 'P_E = n_E/n_S', vars: { P_E: 'probability of the event|probability', n_E: ['favourable outcomes', 'count', { gen: [1, 10] }], n_S: ['total outcomes', 'count', { gen: [11, 52] }] } },
  { id: 'm-xi-5-6', topic: P, eq: 'P_U = P_A + P_B - P_I', ask: 'P_U', vars: { P_U: 'P(A ∪ B)|probability', P_A: ['P(A)', 'probability', { gen: [0.2, 0.5] }], P_B: ['P(B)', 'probability', { gen: [0.2, 0.5] }], P_I: ['P(A ∩ B)', 'probability', { gen: [0.01, 0.15] }] } },
  { id: 'm-xi-5-7', topic: P, eq: 'P_C = 1 - P_A', vars: { P_C: "P(A′)|probability", P_A: 'P(A)|probability' } },
  { id: 'm-xi-5-14', topic: P, eq: 'P_I = P_A*P_B', vars: { P_I: 'P(A ∩ B)|probability', P_A: 'P(A)|probability', P_B: 'P(B)|probability' } },
  { id: 'm-xi-5-84', topic: P, eq: 'P_D = P_A - P_I', vars: { P_D: "P(A ∩ B′)|probability", P_A: ['P(A)', 'probability', { gen: [0.5, 0.9] }], P_I: ['P(A ∩ B)', 'probability', { gen: [0.05, 0.4] }] } },
  { id: 'm-xii-6-29', topic: P, eq: 'P_G = P_I/P_B', vars: { P_G: 'P(A | B)|probability', P_I: ['P(A ∩ B)', 'probability', { gen: [0.05, 0.3] }], P_B: ['P(B)', 'probability', { gen: [0.4, 0.9] }] } },
  { id: 'm-xii-6-70', topic: P, eq: 'E_Y = a*E_X + b', vars: { E_Y: 'E(aX + b)|real', a: 'a|real', E_X: 'E(X)|real', b: 'b|real' } },

  // Statistics
  { id: 'p-xi-1-142', topic: X, eq: 'a_mean = S_x/n', vars: { a_mean: 'mean|real', S_x: 'sum of the readings|real', n: 'number of readings|count' } },
  { id: 'm-xi-5-4', topic: X, eq: 'CV = (sigma_x/x_bar)*100', vars: { CV: 'coefficient of variation|positive', sigma_x: 'standard deviation|positive', x_bar: 'mean|positive' } },
  { id: 'm-xi-5-34', topic: X, eq: 'V_x = S_2/n - x_bar^2', ask: 'V_x', vars: { V_x: 'variance|positive', S_2: ['sum of squares', 'positive', { gen: [500, 2000] }], n: ['number of observations', 'count', { gen: [5, 10] }], x_bar: ['mean', 'positive', { gen: [1, 6] }] } },
  { id: 'm-xi-5-51', topic: X, eq: 'sigma_x = abs(a - b)/2', ask: 'sigma_x', vars: { sigma_x: 'standard deviation|positive', a: 'first number|real', b: 'second number|real' } },
  { id: 'm-xi-1-168', topic: X, eq: 'R_d = D_g*pi/180', vars: { R_d: 'radians|real', D_g: 'degrees|real' } },
  { id: 'm-xi-1-169', topic: X, eq: 'D_g = R_d*180/pi', vars: { D_g: 'degrees|real', R_d: 'radians|real' } },
];
