// Mathematics, Class XI: knowledge added to what mathematics-xi.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import MORE_A from './more/mathematics-xi-a';

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['subsets', 'A set with n elements has 2ⁿ subsets.', 'A set with n elements has n² subsets.', 'Each element is either in a subset or not, which gives 2 choices for each.', 'Each subset has exactly two elements.', 'A proper subset leaves out at least one element.'],
      ['disjoint sets', 'The even and the odd integers are disjoint sets.', 'The even and the odd integers have common elements.', 'No integer is both even and odd.', 'Every even number is also odd.', 'Their union is the set of integers.'],
      ['De Morgan’s laws', '(A ∪ B)′ = A′ ∩ B′.', '(A ∪ B)′ = A′ ∪ B′.', 'An element outside A ∪ B is outside both A and B.', 'An element outside A ∪ B is inside both A and B.', 'De Morgan’s laws can be checked with a Venn diagram.'],
    ],
  },
  '1b': {
    ar: [
      ['the definition of a function', 'In a function, each input has exactly one output.', 'In a function, an input can have several outputs.', 'A relation with two outputs for one input doesn’t meet the definition.', 'A function must have two outputs for each input.', 'Two inputs can have the same output.'],
      ['the domain of a square root', 'The domain of √x is x ≥ 0, over the real numbers.', 'The domain of √x is all real numbers.', 'A negative number has no real square root.', 'Zero has no real square root.', 'The range of √x is also y ≥ 0.'],
      ['the modulus function', 'The range of f(x) = |x| is y ≥ 0.', 'The range of f(x) = |x| is all real numbers.', 'The modulus of a real number is never negative.', 'The modulus of a real number is always negative.', 'The graph of |x| is V-shaped.'],
    ],
  },
  '1c': {
    ar: [
      ['the range of the sine', 'sin θ can’t be 2 for any real angle θ.', 'sin θ can be 2 for some real angle θ.', 'The value of sin θ always lies between −1 and 1.', 'The value of sin θ always lies between 2 and 3.', 'sin² θ + cos² θ = 1.'],
      ['radians', 'An arc of length equal to its radius subtends one radian.', 'An arc of length equal to its radius subtends one degree.', 'The angle in radians is the arc length divided by the radius.', 'The angle in radians is the radius divided by the arc length.', 'π radians make 180°.'],
      ['the signs of the ratios', 'cos θ is negative in the second quadrant.', 'cos θ is positive in the second quadrant.', 'The x-coordinate there is negative.', 'The x-coordinate there is positive.', 'sin θ is positive in the second quadrant.'],
    ],
  },
  '2a': {
    ar: [
      ['conjugate roots', 'Non-real roots of a real quadratic come in conjugate pairs.', 'Non-real roots of a real quadratic can occur singly.', 'The quadratic formula gives them as p ± iq.', 'The quadratic formula gives them as ±p.', 'The product of the roots is real.'],
      ['the modulus', 'A complex number and its conjugate have the same modulus.', 'A complex number and its conjugate have different moduli.', 'They differ only in the sign of the imaginary part, which is squared.', 'They differ only in the sign of the real part.', 'z times its conjugate is |z|².'],
      ['the powers of i', 'i⁴ = 1.', 'i⁴ = −1.', 'i² = −1, and (−1)² = 1.', 'i² = 1, and 1² = 1.', 'The powers of i repeat every four.'],
    ],
  },
  '2b': {
    ar: [
      ['the discriminant', 'A real quadratic with a negative discriminant has no real roots.', 'A real quadratic with a negative discriminant has two real roots.', 'The formula needs the square root of the discriminant.', 'The formula needs the cube root of the discriminant.', 'A zero discriminant gives equal roots.'],
      ['the sum of the roots', 'The sum of the roots of ax² + bx + c = 0 is −b/a.', 'The sum of the roots of ax² + bx + c = 0 is b/a.', 'Expanding a(x − α)(x − β) gives −a(α + β) as the coefficient of x.', 'Expanding a(x − α)(x − β) gives a(α + β) as the coefficient of x.', 'The product of the roots is c/a.'],
      ['the parabola of a quadratic', 'When a > 0, the graph of ax² + bx + c opens upwards.', 'When a > 0, the graph of ax² + bx + c opens downwards.', 'The x² term dominates for large x.', 'The constant term dominates for large x.', 'The vertex lies at x = −b/2a.'],
    ],
  },
  '2c': {
    ar: [
      ['order', 'ⁿPᵣ is larger than ⁿCᵣ when r ≥ 2.', 'ⁿCᵣ is larger than ⁿPᵣ when r ≥ 2.', 'Each selection can be arranged in r! ways.', 'Each arrangement can be selected in r! ways.', '⁵P₂ = 20.'],
      ['the symmetry of selections', 'ⁿCᵣ = ⁿCₙ₋ᵣ.', 'ⁿCᵣ = ⁿCₙ₊ᵣ.', 'Choosing r items is the same as leaving out n − r.', 'Choosing r items is the same as choosing n items.', 'Among 5 people there are 10 handshakes, one for each pair.'],
      ['factorials', '0! is taken to be 1.', '0! is taken to be 0.', 'This makes ⁿCₙ = 1 come out correctly.', 'This makes ⁿCₙ = 0 come out correctly.', 'n! = n × (n − 1)!.'],
    ],
  },
  '2d': {
    ar: [
      ['the number of terms', '(a + b)ⁿ has n + 1 terms.', '(a + b)ⁿ has n terms.', 'The power of a takes each value from n down to 0.', 'The power of a takes each value from n down to 1.', 'The sum of the indices in each term is n.'],
      ['the sum of the coefficients', 'The coefficients in the expansion of (1 + x)ⁿ add up to 2ⁿ.', 'The coefficients in the expansion of (1 + x)ⁿ add up to n².', 'Putting x = 1 gives this sum.', 'Putting x = 0 gives this sum.', 'The coefficients are symmetric.'],
      ['the middle term', '(a + b)⁶ has one middle term.', '(a + b)⁶ has two middle terms.', 'It has seven terms, an odd number.', 'It has six terms, an even number.', 'The middle term has the largest coefficient.'],
    ],
  },
  '2e': {
    ar: [
      ['the infinite GP', 'A GP with |r| < 1 has a finite sum to infinity.', 'A GP with |r| < 1 has no finite sum to infinity.', 'Its terms shrink towards zero fast enough for the sum to settle at a/(1 − r).', 'Its terms grow without limit.', 'A GP with r = 2 has no finite sum to infinity.'],
      ['means', 'For two positive numbers, the AM is at least the GM.', 'For two positive numbers, the GM is at least the AM.', '(√a − √b)² ≥ 0 gives this when expanded.', '(√a + √b)² ≤ 0 gives this when expanded.', 'They are equal only when the two numbers are equal.'],
      ['the AP and its differences', 'The nth term of an AP is a linear function of n.', 'The nth term of an AP is an exponential function of n.', 'aₙ = a + (n − 1)d.', 'aₙ = a × dⁿ.', 'The sum of n terms is a quadratic in n.'],
    ],
  },
  '3a': {
    ar: [
      ['the slopes of perpendicular lines', 'Lines of slopes m₁ and m₂ are perpendicular if m₁m₂ = −1.', 'Lines of slopes m₁ and m₂ are perpendicular if m₁ = m₂.', 'tan 90° has no value, which needs 1 + m₁m₂ = 0.', 'tan 0° is 0, which needs m₁ − m₂ = 0.', 'Lines of slopes 2 and −1/2 are perpendicular.'],
      ['the distance of a point from a line', 'The point (0, 0) is at a distance of |c|/√(a² + b²) from ax + by + c = 0.', 'The point (0, 0) is at a distance of |c| from ax + by + c = 0, for all a and b.', 'The formula |ax₁ + by₁ + c|/√(a² + b²) gives this at the origin.', 'The formula gives a distance of zero at the origin.', 'Distance is measured along the perpendicular.'],
      ['the slope of a vertical line', 'A vertical line has no defined slope.', 'A vertical line has a slope of 0.', 'It makes 90° with the x-axis, and tan 90° isn’t defined.', 'It makes 0° with the x-axis.', 'Its equation has the form x = k.'],
    ],
  },
  '3b': {
    ar: [
      ['the general equation of a circle', 'x² + y² + 2gx + 2fy + c = 0 has the centre (−g, −f).', 'x² + y² + 2gx + 2fy + c = 0 has the centre (g, f).', 'Completing the squares gives (x + g)² + (y + f)² = g² + f² − c.', 'Completing the squares gives (x − g)² + (y − f)² = c.', 'Two circles are concentric if they share a centre.'],
      ['concentric circles', 'x² + y² = 4 and x² + y² = 9 never meet.', 'x² + y² = 4 and x² + y² = 9 meet at two points.', 'They are concentric, with radii 2 and 3.', 'They have the same radius.', 'Their radii add up to 5.'],
      ['the tangent', 'A tangent is perpendicular to the radius at the point of contact.', 'A tangent is parallel to the radius at the point of contact.', 'The radius is the shortest distance from the centre to the tangent.', 'The radius is the longest distance from the centre to the tangent.', 'A tangent meets a circle at just one point.'],
    ],
  },
  '3c': {
    ar: [
      ['the eccentricity', 'The eccentricity of an ellipse is less than 1.', 'The eccentricity of an ellipse is greater than 1.', 'c = ae is less than a.', 'c = ae is greater than a.', 'Eccentricity has no unit.'],
      ['the asymptotes', 'A hyperbola comes ever closer to two lines without meeting them.', 'A hyperbola crosses its asymptotes at its vertices.', 'As x grows, y/x approaches ±b/a, so the curve nears y = ±(b/a)x.', 'The asymptotes pass through the vertices.', 'A rectangular hyperbola has perpendicular asymptotes.'],
      ['the parabola', 'A parabolic mirror sends rays from its focus out in a parallel beam.', 'A parabolic mirror scatters rays from its focus in all directions.', 'Each point on it is the same distance from the focus and the directrix, and reflection follows this shape.', 'It has no focus at all.', 'Car headlights use parabolic reflectors.'],
    ],
  },
  '3d': {
    ar: [
      ['the distance from the origin', 'The distance of (x, y, z) from the origin is √(x² + y² + z²).', 'The distance of (x, y, z) from the origin is x + y + z.', 'Pythagoras’ theorem is applied twice.', 'The three values are simply added.', 'In two dimensions, the distance is √(x² + y²).'],
      ['the coordinate planes', 'A point on the xy-plane has z = 0.', 'A point on the xy-plane has x = 0.', 'Its height above that plane is zero.', 'Its distance from the y-axis is zero.', 'A point on the x-axis has y = 0 and z = 0.'],
      ['the section formula', 'The midpoint of two points in space is found by averaging each coordinate.', 'The midpoint of two points in space is found by multiplying the coordinates.', 'It divides the line in the ratio 1 : 1.', 'It divides the line in the ratio 1 : 2.', 'The section formula also works for external division, with a sign change.'],
    ],
  },
  '4a': {
    ar: [
      ['limits and values', 'A limit can exist at a point where the function isn’t defined.', 'A limit can exist only where the function is defined.', 'A limit depends on values near the point, not on the value at it.', 'A limit is simply the value of the function at the point.', 'The limit of (x² − 1)/(x − 1) as x → 1 is 2.'],
      ['the standard limit', 'The limit of (sin x)/x as x → 0 is 1, with x in radians.', 'The limit of (sin x)/x as x → 0 is 0, with x in radians.', 'sin x is nearly equal to x for small x in radians.', 'sin x is nearly equal to 1 for small x.', 'In degrees, the limit is π/180.'],
      ['the derivative', 'The derivative of a constant is zero.', 'The derivative of a constant is one.', 'A constant doesn’t change as x changes.', 'A constant changes at a steady rate as x changes.', 'The derivative of xⁿ is nxⁿ⁻¹.'],
    ],
  },
  '5a': {
    ar: [
      ['the effect of shifting data', 'Adding 5 to every value leaves the standard deviation unchanged.', 'Adding 5 to every value raises the standard deviation by 5.', 'It only shifts the data, without changing how spread out they are.', 'It makes the data more spread out.', 'Adding 5 raises the mean by 5.'],
      ['the effect of scaling data', 'Doubling every value doubles the standard deviation.', 'Doubling every value leaves the standard deviation unchanged.', 'Each deviation from the mean is doubled.', 'Each deviation from the mean stays the same.', 'Doubling every value makes the variance four times as large.'],
      ['the squares in variance', 'Variance is found from the squares of the deviations.', 'Variance is found by simply adding the deviations.', 'Without squares, positive and negative deviations would cancel.', 'Without squares, the deviations would all be equal.', 'The sum of the deviations from the mean is zero.'],
    ],
  },
  '5b': {
    ar: [
      ['the range of probability', 'A probability can’t be greater than 1.', 'A probability can be greater than 1.', 'Favourable outcomes can’t outnumber all the possible ones.', 'Favourable outcomes always outnumber the possible ones.', 'Probabilities can be written as fractions, decimals or percentages.'],
      ['complementary events', 'P(A) + P(not A) = 1.', 'P(A) + P(not A) = 0.', 'An event either happens or doesn’t, and both can’t happen together.', 'An event and its opposite can both happen together.', 'It is sometimes easier to find P(not A) first.'],
      ['mutually exclusive events', 'For mutually exclusive events, P(A ∪ B) = P(A) + P(B).', 'For mutually exclusive events, P(A ∪ B) = P(A) × P(B).', 'They can’t happen together, so P(A ∩ B) = 0.', 'They always happen together, so P(A ∩ B) = 1.', 'A head and a tail on one toss are mutually exclusive.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A);
