// mathjs is used for two things: parsing expressions and handling units. The
// expression trees it produces are converted to our own, smaller form (expr.ts).
import { create, createUnitDependencies, parseDependencies, unitDependencies } from 'mathjs';

export const math = create({ parseDependencies, unitDependencies, createUnitDependencies });

const EXTRA_UNITS: Record<string, string> = {
  molar: '1 mol/L',
  amu: '1.66053906660e-27 kg',
  rpm: `${(2 * Math.PI) / 60} rad/s`,
};

for (const [name, definition] of Object.entries(EXTRA_UNITS)) {
  try {
    math.createUnit(name, definition);
  } catch {
    /* already defined by this mathjs version */
  }
}

try {
  math.unit('1 cal');
} catch {
  math.createUnit('cal', '4.184 J');
}
