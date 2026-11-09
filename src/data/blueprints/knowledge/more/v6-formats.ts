// Written for v6: arrange in order, odd one out, and predict and explain, for the topics the papers ask most. They join each
// topic's facts, so they also reach the bank. Keyed by subject and class, then "unit+topic", as other knowledge files are.
import type { Facts } from '../../dsl';

export const PHYSICS_XII: Record<string, Facts> = {
  '3a': {
    order: [['Arrange in increasing order of the radius of the circle each follows in the same field, at the same speed', ['an electron', 'a proton', 'an alpha particle'], 'r = mv/(qB), and m/q is least for the electron and greatest for the alpha particle.']],
    odd: [[['ammeter', 'voltmeter', 'galvanometer', 'rheostat'], 'rheostat', 'The other three are built on a moving coil and measure something. A rheostat only varies resistance.'], [['F = qvB', 'F = BIl', 'F = qE', 'τ = NIAB'], 'F = qE', 'The other three are magnetic effects. This one is an electric force.']],
    predict: [['A charged particle moving in a circle in a uniform magnetic field has its speed doubled.', 'Its radius doubles, and its period stays the same.', 'r = mv/(qB) rises with v, while T = 2πm/(qB) has no v in it.'], ['The current in only one of two parallel wires that attract each other is reversed.', 'They now repel, with the same size of force.', 'The force depends on I₁I₂, and parallel currents attract, while opposite ones repel.'], ['A solenoid’s turns are stretched so that its length doubles, with the same current and total turns.', 'The field inside falls to half.', 'B = μ₀nI, and n falls to half.']],
  },
  '4b': {
    order: [['Arrange in increasing order of the phase by which the current leads the voltage', ['a pure inductor', 'a pure resistor', 'a pure capacitor'], 'The current lags by 90° in an inductor, is in phase in a resistor, and leads by 90° in a capacitor.']],
    odd: [[['resistor', 'inductor', 'capacitor', 'choke coil'], 'resistor', 'A resistor’s opposition doesn’t depend on frequency, and it uses power. The others store energy, and use almost none.']],
    predict: [['The frequency of the supply to a capacitor is doubled, at the same voltage.', 'The current doubles.', 'X_C = 1/(2πfC) falls to half.'], ['A soft iron rod is pushed into an inductor in series with a lamp on an a.c. supply.', 'The lamp dims.', 'L rises, so X_L rises and the current falls.'], ['A resistor is added to a series LCR circuit at resonance.', 'The peak current falls, and the resonance becomes broader, at the same frequency.', 'f₀ depends only on L and C, while R sets the peak and the sharpness.']],
  },
  '6a': {
    order: [['Arrange in increasing order of the speed of light in each', ['diamond', 'glass', 'water', 'air'], 'Speed is c/n, and n falls from diamond to air.'], ['Arrange in increasing order of the deviation produced by a prism', ['red', 'yellow', 'green', 'violet'], 'n rises towards the violet, so the deviation does.']],
    odd: [[['plane mirror', 'convex mirror', 'concave lens', 'concave mirror'], 'concave mirror', 'It alone can form a real image of a real object. The others only give virtual images of one.']],
    predict: [['A glass prism is placed in water.', 'It deviates light less.', 'The refractive index of glass relative to water is less than relative to air.'], ['The lower half of a convex lens is covered.', 'The whole image still forms, but it’s dimmer.', 'Every point on the image still receives light from the uncovered half.'], ['The angle of incidence in glass is raised above the critical angle.', 'No light leaves, and it’s all reflected inside.', 'Total internal reflection occurs beyond the critical angle.']],
  },
};

export const CHEMISTRY_XII: Record<string, Facts> = {
  '1a': {
    order: [['Arrange the 0.1 m aqueous solutions in increasing order of their freezing points', ['K₂SO₄', 'NaCl', 'glucose'], 'More particles lower the freezing point more, and K₂SO₄ gives three ions, NaCl two and glucose one particle.']],
    odd: [[['molarity', 'molality', 'osmotic pressure', 'mole fraction'], 'osmotic pressure', 'It is a colligative property. The others are ways of stating concentration.']],
    predict: [['A red blood cell is placed in pure water.', 'It swells, and may burst.', 'Water passes in by osmosis, from the lower to the higher solute concentration.'], ['The pressure of CO₂ above a soft drink is raised.', 'More CO₂ dissolves.', 'By Henry’s law, solubility rises with pressure.'], ['Sugar is added to water at its boiling point.', 'Boiling stops until it is heated further.', 'The solute lowers the vapour pressure, so a higher temperature is needed to reach 1 atm.']],
  },
  '3a': {
    order: [['For a first order reaction, arrange these in increasing order of the time taken to reach them', ['three-quarters left', 'half left', 'one-eighth left'], 'A first order reaction falls by the same fraction in equal times, so a smaller fraction left takes longer.']],
    odd: [[['temperature', 'catalyst', 'surface area', 'molar mass of the product'], 'molar mass of the product', 'The other three change a reaction’s rate.']],
    predict: [['The temperature of a reaction with a high activation energy is raised by 10 K.', 'The rate rises sharply.', 'A larger Eₐ makes k more sensitive to T, by the Arrhenius equation.'], ['The concentration of a reactant is doubled in a zero order reaction.', 'The rate doesn’t change.', 'For zero order, rate = k, with no concentration in it.'], ['A catalyst is added to a reaction at equilibrium.', 'The position of equilibrium doesn’t change.', 'It speeds up both directions equally, and K is unchanged.']],
  },
  '7a': {
    order: [['Arrange in increasing order of reactivity with the Lucas reagent', ['primary alcohol', 'secondary alcohol', 'tertiary alcohol'], 'Reaction goes through a carbocation, and a tertiary one is the most stable.'], ['Arrange in increasing order of boiling point', ['propane', 'methoxyethane', 'propan-1-ol'], 'Alcohols hydrogen-bond strongly, and ethers are polar but have no such hydrogen bonds with each other.']],
    odd: [[['ethanol', 'propan-1-ol', 'butan-2-ol', 'phenol'], 'phenol', 'Its OH is on a benzene ring. The others are aliphatic alcohols.']],
    predict: [['Ethanol is heated with concentrated sulphuric acid at 443 K.', 'Ethene forms.', 'It’s dehydrated, losing water at this temperature.'], ['Ethanol is warmed with acidified potassium dichromate.', 'The orange solution turns green.', 'The alcohol is oxidised, and Cr(VI) is reduced to Cr(III).']],
  },
  '5a': {
    order: [['Arrange in increasing order of conductivity in water', ['[Co(NH₃)₃Cl₃]', '[Co(NH₃)₄Cl₂]Cl', '[Co(NH₃)₆]Cl₃'], 'They give no ions, then two, then four ions per formula unit.'], ['Arrange these ligands in increasing order of field strength', ['Cl⁻', 'H₂O', 'NH₃', 'CN⁻'], 'This follows the spectrochemical series.']],
    odd: [[['NH₃', 'H₂O', 'CN⁻', 'en'], 'en', 'It is bidentate. The others are monodentate.']],
    predict: [['Silver nitrate is added to a solution of [Co(NH₃)₅Cl]Cl₂.', 'Two moles of AgCl form per mole of complex.', 'Only the chlorides outside the coordination sphere are free ions.'], ['Water ligands round Ti³⁺ are replaced by a stronger field ligand.', 'The colour shifts, as light of a shorter wavelength is absorbed.', 'A stronger ligand raises Δ, the splitting between the d orbitals.']],
  },
};

export const MATHEMATICS_XII: Record<string, Facts> = {
  '3b': {
    odd: [[['$x^2$', '$e^x$', '$\\log x$', '$\\frac{1}{x}$'], '$\\frac{1}{x}$', 'For $x > 0$, it alone decreases. The other three all increase there.']],
  },
  '7a': {
    odd: [[['$P(A \\cap B) = P(A)P(B)$', '$P(A | B) = P(A)$', '$P(B | A) = P(B)$', '$P(A \\cap B) = 0$'], '$P(A \\cap B) = 0$', 'The other three say the events are independent. This one says they’re mutually exclusive.']],
  },
};

export const COMPUTERSCIENCE_XII: Record<string, Facts> = {
  '1b': {
    order: [['Arrange the groups in a Karnaugh map in increasing order of the variables they remove', ['pair', 'quad', 'octet'], 'A pair removes one, a quad two and an octet three.']],
    odd: [[['A + 0 = A', 'A·1 = A', 'A + A′ = 1', 'A + A = A'], 'A + A′ = 1', 'It’s the complement law. The others leave A as it was.']],
  },
  '3a': {
    odd: [[['int', 'double', 'char', 'String'], 'String', 'It is a class, and a variable of it holds a reference. The others are primitive types.']],
    predict: [['A method’s int parameter is changed inside the method.', 'The caller’s variable doesn’t change.', 'Java passes a primitive by value, so the method has a copy.'], ['An element of an array parameter is changed inside a method.', 'The caller sees the change.', 'The reference is copied, and both refer to one array.']],
  },
  '5a': {
    predict: [['A recursive method’s base case is removed.', 'It never stops by itself, and ends with an error when memory for its calls runs out.', 'Each call makes another call, and each one needs memory until it returns.']],
  },
};

export const PHYSICS_XI: Record<string, Facts> = {
  '4a': {
    order: [['Arrange in increasing order of the size of each unit of energy', ['electronvolt', 'joule', 'kilowatt-hour'], '1 eV = 1.6 × 10⁻¹⁹ J, and 1 kWh = 3.6 × 10⁶ J.']],
    predict: [['A car’s speed is doubled.', 'Its kinetic energy becomes four times as large, and so does its stopping distance under the same braking force.', 'KE = ½mv², and the work done by the brakes is F × d.']],
  },
  '10b': {
    odd: [[['light', 'radio waves', 'sound in air', 'X-rays'], 'sound in air', 'It is mechanical and longitudinal. The others are electromagnetic and transverse.']],
    predict: [['A guitar string’s tension is made four times as large.', 'Its pitch rises by an octave.', 'f is proportional to √T, so f doubles.'], ['The temperature of the air in an organ pipe rises.', 'The pitch rises.', 'Sound travels faster, and f = v/λ, with λ fixed by the pipe.']],
  },
};

export const CHEMISTRY_XI: Record<string, Facts> = {
  '3a': {
    order: [['Arrange in increasing order of atomic radius', ['F', 'O', 'N', 'C'], 'Radius falls from left to right across a period.'], ['Arrange in increasing order of first ionisation enthalpy', ['Na', 'Al', 'Mg'], 'Na is lowest. Mg is above Al, because its full 3s² subshell is more stable than aluminium’s single 3p electron.']],
    odd: [[['Na', 'K', 'Ca', 'Rb'], 'Ca', 'It’s in group 2. The others are alkali metals.']],
  },
  '6b': {
    order: [['Arrange in increasing order of pH', ['HCl solution', 'vinegar', 'pure water', 'NaOH solution'], 'A strong acid is lowest, a weak acid next, then neutral, then a strong base.']],
    predict: [['Sodium acetate is added to a solution of acetic acid.', 'The pH rises.', 'The common acetate ion pushes the acid’s dissociation back, so [H⁺] falls.']],
  },
};

export const MATHEMATICS_XI: Record<string, Facts> = {};
export const COMPUTERSCIENCE_XI: Record<string, Facts> = {
  '8a': {
    odd: [[['for', 'while', 'do-while', 'switch'], 'switch', 'It selects a branch. The others are loops.']],
    predict: [['A while loop’s condition is false the first time.', 'Its body doesn’t run at all.', 'A while loop tests before its body. A do-while would run once.']],
  },
};
