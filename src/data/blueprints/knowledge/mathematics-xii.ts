// Mathematics, Class XII: knowledge added to what mathematics-xii.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import MORE_A from './more/mathematics-xii-a';
import MORE_B from './more/mathematics-xii-b';

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['one-one functions', 'f(x) = x² on all real numbers isn’t one-one.', 'f(x) = x² on all real numbers is one-one.', 'f(2) = f(−2), so two inputs share an output.', 'f(2) and f(−2) are different.', 'f(x) = x³ is one-one on all real numbers.'],
      ['invertible functions', 'A function has an inverse exactly when it is a bijection.', 'Every function has an inverse.', 'Each output must come from exactly one input.', 'Each input must have several outputs.', 'A bijection is both one-one and onto.'],
      ['equivalence relations', 'The relation “is congruent to” on triangles is an equivalence relation.', 'The relation “is congruent to” on triangles isn’t reflexive.', 'It is reflexive, symmetric and transitive.', 'It is reflexive only.', 'An equivalence relation splits a set into classes.'],
    ],
  },
  '1b': {
    ar: [
      ['the principal value', 'sin⁻¹(sin 2π/3) isn’t equal to 2π/3.', 'sin⁻¹(sin 2π/3) is equal to 2π/3.', 'The principal range of sin⁻¹ is [−π/2, π/2], and 2π/3 lies outside it.', 'The principal range of sin⁻¹ is [0, π].', 'The value is π/3.'],
      ['complementary inverse functions', 'sin⁻¹x + cos⁻¹x = π/2 for x in [−1, 1].', 'sin⁻¹x + cos⁻¹x = π for x in [−1, 1].', 'If sin θ = x, then cos(π/2 − θ) = x.', 'If sin θ = x, then cos θ = x.', 'tan⁻¹x + cot⁻¹x = π/2 for all real x.'],
      ['the odd inverse functions', 'sin⁻¹(−x) = −sin⁻¹x.', 'sin⁻¹(−x) = sin⁻¹x.', 'sine is an odd function.', 'sine is an even function.', 'cos⁻¹(−x) = π − cos⁻¹x.'],
    ],
  },
  '2a': {
    ar: [
      ['the order of multiplying', 'AB and BA aren’t equal in general.', 'AB and BA are always equal.', 'Matrix multiplication isn’t commutative.', 'Matrix multiplication is commutative.', 'Matrix addition is commutative.'],
      ['symmetric and skew-symmetric parts', 'Every square matrix can be written as a symmetric matrix plus a skew-symmetric one.', 'Only symmetric matrices can be split in this way.', 'A = ½(A + A′) + ½(A − A′).', 'A = ½(A × A′) − ½(A′ × A).', 'A skew-symmetric matrix has zeros on its diagonal.'],
      ['the transpose of a product', '(AB)′ = B′A′.', '(AB)′ = A′B′.', 'The rows and columns exchange, which reverses the order.', 'The rows and columns stay the same.', '(A′)′ = A.'],
    ],
  },
  '2b': {
    ar: [
      ['the inverse', 'A matrix with a zero determinant has no inverse.', 'A matrix with a zero determinant always has an inverse.', 'A⁻¹ = adj A/|A|, and |A| = 0 can’t be divided by.', 'A⁻¹ = |A| × adj A, which is then the zero matrix.', 'Such a matrix is called singular.'],
      ['two equal rows', 'A determinant with two equal rows has the value 0.', 'A determinant with two equal rows has the value 1.', 'Interchanging them changes the sign and leaves it the same.', 'Interchanging them doesn’t change the sign.', 'Adding a multiple of one row to another leaves it unchanged.'],
      ['scaling a determinant', 'For a square matrix of order 3, |kA| = k³|A|.', 'For a square matrix of order 3, |kA| = k|A|.', 'Each of the three rows has a factor of k.', 'Only one row has a factor of k.', '|AB| = |A||B| for square matrices of the same order.'],
    ],
  },
  '3a': {
    ar: [
      ['continuity and differentiability', 'f(x) = |x| is continuous at x = 0, but not differentiable there.', 'f(x) = |x| is differentiable at x = 0, but not continuous there.', 'Its left and right slopes differ at the corner.', 'Its value jumps at x = 0.', 'Differentiability at a point implies continuity there.'],
      ['the chain rule', 'The derivative of sin(x²) is 2x cos(x²).', 'The derivative of sin(x²) is cos(2x).', 'The chain rule multiplies by the derivative of the inner function.', 'The chain rule replaces the inner function by its derivative.', 'The derivative of sin x is cos x.'],
      ['Rolle’s theorem', 'x² on [−1, 1] satisfies Rolle’s theorem.', 'x² on [−1, 2] satisfies Rolle’s theorem.', 'Its values at both ends are equal, and it is continuous and differentiable.', 'Its values at both ends are different.', 'Rolle’s theorem is a special case of the mean value theorem.'],
    ],
  },
  '3b': {
    ar: [
      ['the derivative at an extremum', 'At a local maximum, a differentiable function’s derivative is zero.', 'At a local maximum, a differentiable function’s derivative is positive.', 'The slope changes from positive to negative through it.', 'The slope stays positive through it.', 'A zero derivative doesn’t guarantee a maximum.'],
      ['the second derivative test', 'If f′(c) = 0 and f″(c) < 0, then f has a local maximum at c.', 'If f′(c) = 0 and f″(c) < 0, then f has a local minimum at c.', 'The slope is decreasing through zero there.', 'The slope is increasing through zero there.', 'If f″(c) = 0, the test gives no answer.'],
      ['increasing functions', 'x³ is increasing on all real numbers.', 'x³ is decreasing on all real numbers.', 'Its derivative, 3x², is never negative, and is zero at one point only.', 'Its derivative, 3x², is negative.', 'A function can be strictly increasing with a zero derivative at a point.'],
    ],
  },
  '3c': {
    ar: [
      ['the constant of integration', 'An indefinite integral has an arbitrary constant.', 'An indefinite integral never has a constant.', 'The derivative of a constant is zero.', 'The derivative of a constant is one.', 'A definite integral has no arbitrary constant.'],
      ['the integral of 1/x', '∫(1/x) dx = log|x| + C.', '∫(1/x) dx = x⁰/0 + C.', 'The power rule fails for n = −1, and the derivative of log|x| is 1/x.', 'The derivative of log|x| is x.', '∫xⁿ dx = xⁿ⁺¹/(n + 1) + C, for n ≠ −1.'],
      ['odd functions', 'The integral of an odd function from −a to a is zero.', 'The integral of an odd function from −a to a is twice that from 0 to a.', 'Its area on one side cancels the area on the other.', 'Its area on both sides is the same in sign.', 'For an even function, the integral is twice that from 0 to a.'],
    ],
  },
  '3d': {
    ar: [
      ['areas', 'An area is taken as positive.', 'An area can be left as negative.', 'A definite integral under the x-axis comes out negative, so its modulus is taken.', 'A definite integral is always positive.', 'The area between two curves is the integral of the upper minus the lower.'],
      ['a symmetrical region', 'The area of a circle can be found as four times one quadrant.', 'The area of a circle can be found only by adding many small squares.', 'A circle is symmetric about both axes.', 'A circle is symmetric about no axis.', 'The area of a circle of radius a is πa².'],
      ['the limits of integration', 'To find the area between a curve and a line, first find where they meet.', 'The area between a curve and a line can always use the limits 0 and 1.', 'The points where they meet give the limits of the integral.', 'The points where they meet give the upper curve.', 'y = x² and y = x meet at x = 0 and x = 1.'],
    ],
  },
  '3e': {
    ar: [
      ['the order and degree', 'The order of (y″)² + y′ = 0 is 2.', 'The order of (y″)² + y′ = 0 is 1.', 'The highest derivative in it is the second.', 'The highest derivative in it is the first.', 'Its degree is 2.'],
      ['particular solutions', 'A particular solution has no arbitrary constants.', 'A particular solution always has two arbitrary constants.', 'They are fixed by the given condition.', 'They are left free by the given condition.', 'The general solution of a first-order equation has one arbitrary constant.'],
      ['the integrating factor', 'The integrating factor of dy/dx + Py = Q is e^(∫P dx).', 'The integrating factor of dy/dx + Py = Q is ∫P dx.', 'Multiplying by it makes the left side the derivative of y × IF.', 'Multiplying by it removes the variable y.', 'P and Q are functions of x only.'],
    ],
  },
  '4a': {
    ar: [
      ['coplanar vectors', 'Three coplanar vectors have a scalar triple product of zero.', 'Three coplanar vectors have a scalar triple product of one.', 'The parallelepiped they form has no volume.', 'The parallelepiped they form has a volume of one.', 'The scalar triple product gives a volume.'],
      ['the cross product’s order', 'a × b = −(b × a).', 'a × b = b × a.', 'The right-hand rule gives opposite directions for the two orders.', 'The right-hand rule gives the same direction for the two orders.', 'a · b = b · a.'],
      ['perpendicular vectors', 'If a · b = 0 for non-zero vectors, they are perpendicular.', 'If a · b = 0 for non-zero vectors, they are parallel.', 'a · b = |a||b| cos θ, so cos θ = 0.', 'a · b = |a||b| sin θ, so sin θ = 0.', 'If a × b = 0 for non-zero vectors, they are parallel.'],
    ],
  },
  '5a': {
    ar: [
      ['direction cosines', 'For direction cosines l, m and n, l² + m² + n² = 1.', 'For direction cosines l, m and n, l + m + n = 1.', 'They are the components of a unit vector along the line.', 'They are the coordinates of the origin.', 'Direction ratios are any multiples of them.'],
      ['skew lines', 'The shortest distance between two skew lines is along their common perpendicular.', 'The shortest distance between two skew lines is along one of the lines.', 'Any other line between them is longer, as a hypotenuse is longer.', 'All lines between them have equal lengths.', 'Skew lines are neither parallel nor intersecting.'],
      ['the normal to a plane', 'The normal to ax + by + cz = d has direction ratios a, b and c.', 'The normal to ax + by + cz = d has direction ratios x, y and z.', 'r · n = d is the same equation, with n = ai + bj + ck.', 'r · n = 0 is the same equation, with n = xi + yj + zk.', 'Parallel planes have proportional direction ratios.'],
    ],
  },
  '6a': {
    ar: [
      ['the corner point theorem', 'An LP’s best value is found at a corner of a bounded feasible region.', 'An LP’s best value is found only at the centre of its feasible region.', 'A linear function changes steadily, so it peaks at an edge and so at a corner.', 'A linear function peaks in the middle of any region.', 'A corner is where two constraint lines meet.'],
      ['non-negativity', 'x ≥ 0 and y ≥ 0 are usually constraints in an LP.', 'x < 0 and y < 0 are usually constraints in an LP.', 'A number of items can’t be negative.', 'A number of items must be negative.', 'A feasible point satisfies all the constraints.'],
      ['unbounded regions', 'An LP with an unbounded feasible region may have no maximum.', 'An LP with an unbounded feasible region always has a maximum.', 'The objective can keep growing as x and y do.', 'The objective is the same everywhere.', 'It may still have a minimum.'],
    ],
  },
  '7a': {
    ar: [
      ['independent events', 'If A and B are independent, then P(A ∩ B) = P(A)P(B).', 'If A and B are independent, then P(A ∩ B) = 0.', 'P(A | B) = P(A) then, as B has no effect on A.', 'P(A | B) = 1 then, as B forces A.', 'Mutually exclusive events aren’t independent, if both have positive probability.'],
      ['the theorem of total probability', 'Bayes’ theorem needs total probability for its denominator.', 'Bayes’ theorem has no denominator.', 'P(A) is found by adding over all the causes.', 'P(A) is found by multiplying over all the causes.', 'Bayes’ theorem finds the probability of a cause, given the effect.'],
      ['a binomial distribution', 'In a binomial distribution, the mean is np.', 'In a binomial distribution, the mean is npq.', 'Each of n trials has an expected p successes.', 'Each of n trials has an expected pq successes.', 'The variance is npq.'],
      ['a probability distribution', 'The probabilities in a distribution add up to 1.', 'The probabilities in a distribution add up to 0.', 'One of the values must occur.', 'None of the values can occur.', 'The mean is also called the expected value.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A, MORE_B);
