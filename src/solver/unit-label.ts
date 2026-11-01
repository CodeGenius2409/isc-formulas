/** Turns a unit as written in code (m/s^2, ohm, degC) into how a person reads it. */
export function unitLabel(unit: string): string {
  return unit
    .replace(/\^-1/g, '⁻¹')
    .replace(/\^-2/g, '⁻²')
    .replace(/\^-3/g, '⁻³')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^4/g, '⁴')
    .replace(/\^6/g, '⁶')
    .replace(/\*/g, '·')
    .replace(/degC/g, '°C')
    .replace(/\bdeg\b/g, '°')
    .replace(/kohm/g, 'kΩ')
    .replace(/Mohm/g, 'MΩ')
    .replace(/ohm/g, 'Ω')
    .replace(/hour/g, 'h')
    .replace(/angstrom/g, 'Å')
    .replace(/^u(?=[A-Z])/, 'μ');
}
