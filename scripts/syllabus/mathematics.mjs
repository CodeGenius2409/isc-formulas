// How the old Mathematics units map onto the 2028 syllabus, and what it leaves out.

const TRIG = ['Trigonometric Functions', 'Angle Measure & Arcs', 'Trigonometric Ratios & Unit Circle', 'Fundamental Identities', 'Signs & Quadrants', 'Domain, Range & Periodicity', 'Graphs of Trigonometric Functions', 'Values at Standard Angles', 'Reduction Formulas (Allied Angles)', 'Compound Angle Formulas', 'Double Angle Formulas', 'Triple Angle Formulas', 'Half-Angle Formulas', 'Sum-to-Product Identities', 'Product-to-Sum Identities', 'Conditional Identities', 'Special Angle Results', 'Maximum and Minimum Values'];
const RELATIONS = ['Relations & Functions', 'Cartesian Product', 'Relations', 'Functions', 'Algebra of Functions', 'Standard Real Functions'];
const VECTOR_SUBS = ['Vectors', 'Vector Basics', 'Direction Cosines and Ratios of a Vector', 'Position and Section Formulae', 'Dot Product', 'Cross Product'];
const each = (list, value) => Object.fromEntries(list.map((name) => [name, value]));

export const map = {
  XI: {
    1: { unit: 1, topic: 'a', sub: { ...each(TRIG, 'c'), ...each(RELATIONS, 'b') } },
    2: {
      unit: 2,
      topic: 'e',
      sub: {
        'Complex Numbers': 'a',
        'Quadratic Equations': 'b',
        'Quadratic Functions & Sign': 'b',
        Inequalities: 'b',
        'Modulus & Absolute Value': 'b',
        'Algebraic Identities & Special Values': 'b',
        'Exponents, Surds & Logarithms': 'b',
        'Constants & Approximations': 'b',
        'Permutations & Combinations': 'c',
        'Binomial Theorem': 'd',
      },
    },
    3: { unit: 3, topic: 'a', sub: { Circles: 'b', 'Conic Sections': 'c', 'Conic Sections (General)': 'c', Parabola: 'c', Ellipse: 'c', Hyperbola: 'c', '3-D Geometry (Intro)': 'd' } },
    4: { unit: 4, topic: 'a', sub: {} },
    5: { unit: 5, topic: 'a', sub: { Probability: 'b', 'Sample Space & Events': 'b', 'Probability Laws': 'b', 'Standard Probability Situations': 'b' } },
  },
  XII: {
    1: { unit: 1, topic: 'b', sub: { 'Types of Relations': 'a', 'Counting Relations': 'a', 'Types of Functions': 'a', 'Counting Functions': 'a', 'Standard Real Functions': 'a', 'Composite and Inverse Functions': 'a' } },
    2: { unit: 2, topic: 'b', sub: { 'Types of Matrices': 'a', 'Matrix Operations': 'a', 'Transpose, Symmetric and Skew-Symmetric': 'a', 'Matrices & Determinants': 'a' } },
    3: {
      unit: 3,
      topic: 'a',
      sub: {
        'Rate of Change': 'b',
        'Mensuration Formulas': 'b',
        'Increasing and Decreasing Functions': 'b',
        'Tangents and Normals': 'b',
        'Maxima and Minima': 'b',
        'Optimisation Results': 'b',
        Integrals: 'c',
        'Basic Integration Rules': 'c',
        'Standard Integrals': 'c',
        'Integrals of Quadratic Expressions': 'c',
        'Trigonometric Integrals': 'c',
        'Special Integrals': 'c',
        'Integration by Parts': 'c',
        'Partial Fractions': 'c',
        'Definite Integral Basics': 'c',
        'Properties of Definite Integrals': 'c',
        'Definite Integral Values': 'c',
        'Area Under Curves': 'd',
        'Differential Equations': 'e',
        'Differential Equation Basics': 'e',
        'Formation of Differential Equations': 'e',
        'Variable Separable': 'e',
        'Useful Differentials': 'e',
        'Homogeneous Differential Equations': 'e',
        'Linear Differential Equations': 'e',
        'Differential Equation Applications': 'e',
      },
    },
    4: { unit: 5, topic: 'a', sub: Object.fromEntries(VECTOR_SUBS.map((name) => [name, [4, 'a']])) },
    5: { unit: 6, topic: 'a', sub: {} },
    6: { unit: 7, topic: 'a', sub: {} },
  },
};

const out = (name, reason, ref, extra = {}) => ({ name, verdict: 'out', reason, ref, ...extra });
const notNeeded = (name, reason) => ({ name, verdict: 'not-needed', reason });

export const rules = [
  // Class XI
  out(/De Moivre/, 'Unit 2(i) covers the square root of a complex number and cube roots of unity. De Moivre\'s theorem is not listed.', 'XI Unit 2(i)'),
  out(/HP relation|Harmonic mean|Relation G² = A|AM ≥ GM ≥ HM|Cauchy–Schwarz|Sum of squares inequality/, 'Unit 2(v) covers A.P. and G.P. with their means. Harmonic progressions and Cauchy-Schwarz are not listed.', 'XI Unit 2(v)'),
  out(/General second-degree equation|Classification by h²|Degeneracy condition|Rectangular hyperbola|Conjugate hyperbola|Eccentricities of conjugate|Asymptotes of a hyperbola|Auxiliary circle|Perimeter of an ellipse|Parametric form of the (parabola|ellipse|hyperbola)|Sphere with centre|Centroid of a tetrahedron/, 'Not in the list for conic sections or 3-D geometry, which ask for standard equations and simple properties.', 'XI Unit 3'),
  out(/Mean deviation about the median|Coefficient of range|Coefficient of mean deviation|Coefficient of standard deviation|^Weighted mean$/, 'The syllabus says "Mean deviation about mean", and lists range, variance and standard deviation.', 'XI Unit 5(i)'),

  notNeeded(/^(Golden ratio|Squares of small numbers|Cubes of small numbers|Powers of 2|Small factorials|Natural logs of 2, 3, 10|Common logs of 2, 3, 5, 7|log₁₀ e|Complex constants|One radian in degrees|One degree in radians|Square roots of small integers)$/, 'A table of values, not used in answering questions. A calculator or log table is allowed.'),
  notNeeded(/Approximation \(1 \+ x\)|Small-angle approximations|Approximation of e\^x|Sophie Germain|Lagrange identity|General difference of powers|Sum of odd powers|Square root of a ± |Rationalising 1\/\(a\^/, 'Prerequisite algebra at a level the syllabus does not reach.'),
  { level: 'XI', sub: 'Special Angle Results', verdict: 'not-needed', reason: 'Results at specific angles, such as cos 20° cos 40° cos 80°. Each can be worked out with the product and multiple-angle formulas that are kept.' },
  notNeeded(/^(Maximum|Minimum) of |Clock hand speeds|Angle between clock hands|Distance covered by a rolling wheel|Interior angle of regular polygon|Sum of interior angles|Area of a circular segment|53 Sundays|Bounds on (P|n)\(|Subadditivity|Monotonicity of probability|Upper bound for union|Golden/, 'A narrow worked result, rather than a formula a student looks up.'),

  // Class XII
  out(/Rolle|Lagrange's mean value/, 'Mean value theorems are not in the 2028 Calculus unit, though they appeared in papers before it.', 'XII Unit 3'),
  out(/Approximate error|Point of inflexion/, 'Not listed under Applications of Derivatives.', 'XII Unit 3(ii)'),
  out(/Binomial (probability|mean|mode|standard|probab)|^Binomial /, 'The 2028 syllabus stops at a random variable, its distribution and its mean. The binomial distribution is not listed.', 'XII Unit 7'),
  out(/Variance of random variable|Variance by shortcut|Variance of aX|Variance of a fair die|^Standard deviation$/, 'Unit 7 says "mean of random variable". Variance is not listed for random variables.', 'XII Unit 7', { level: 'XII', sub: /Random Variable|Conditional & Bayes/ }),
  out(/Cramer/, 'The syllabus solves systems by the matrix method, which it calls Martin\'s Rule. Cramer\'s rule is not listed.', 'XII Unit 2'),
  out(/Vandermonde|Idempotent matrix|Involutory matrix|Nilpotent matrix|Antisymmetric relation|Conjugation B/, 'Not listed under Matrices and Determinants or Relations.', 'XII Units 1, 2'),
  out(/Scalar triple product|Vector triple product|Lagrange identity|Cauchy–Schwarz inequality/, 'Unit 4 covers the scalar (dot) and vector (cross) products of two vectors. Triple products are not listed.', 'XII Unit 4'),

  notNeeded(/Number of equivalence relations \(small sets\)|^Work as dot product$|Sum of unit vectors is a unit vector/, 'A narrow result, rather than a formula a student looks up.'),
];

export const supportingSubs = new Set(['Algebraic Identities & Special Values', 'Exponents, Surds & Logarithms', 'Constants & Approximations', 'Modulus & Absolute Value', 'Conditional Identities', 'Values at Standard Angles', 'Mensuration Formulas', 'Useful Differentials', 'Optimisation Results', 'Definite Integral Values', 'Standard Simplifications', 'Differential Equation Applications', 'Counting Relations', 'Counting Functions', 'Limits at Infinity']);
