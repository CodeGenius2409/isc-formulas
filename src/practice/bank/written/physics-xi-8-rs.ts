// Written by hand: heat and thermodynamics, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XI');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why are gaps left between rails on a railway track?', 'The rails expand in summer, and without gaps they would buckle.'),
  reason(A(2, 2), 'Why does a lake freeze from the top down, and not the bottom up?', 'Water is densest at 4 °C, so as the surface cools below that, it stays on top.', 'The ice then forms at the surface, and floats as it is less dense.'),
  reason(A(2, 2), 'Why does a thick glass tumbler crack when hot water is poured in, while a thin one often doesn’t?', 'Glass conducts heat badly, so the inside heats and expands before the outside.', 'In thick glass the difference is larger, so the strain cracks it.'),
  reason(A(2, 3), 'Why does a black body glow red, then white, as it is heated?', 'By Wien’s law, λ_max T is constant.', 'As T rises, the peak moves to shorter wavelengths, so more of the visible colours join in.'),
  reason(A(1, 2), 'Why are cooking pots made with copper bottoms and wooden handles?', 'Copper conducts heat well to the food, and wood conducts it badly to the hand.'),
  tell(A(2, 1), 'Distinguish between heat and temperature.', 'Heat is energy that flows because of a difference in temperature.', 'Temperature tells how hot a body is, and which way heat will flow.'),
  short(A(2, 2), 'State Wien’s displacement law and Stefan’s law.', 'λ_max T = b, a constant.', 'The power radiated per unit area of a black body is σT⁴.'),
  short(A(3, 2), 'Name the three ways heat moves, and give an everyday example of each.', 'Conduction: a spoon in hot tea warms along its handle.', 'Convection: warm air rising from a heater.', 'Radiation: the Sun warming the Earth across space.'),
  short(A(3, 3), 'Define specific heat capacity and specific latent heat. Why doesn’t temperature rise while ice melts?', 'Specific heat capacity: heat for 1 kg to rise by 1 K.', 'Specific latent heat: heat for 1 kg to change state at a fixed temperature.', 'The heat goes into breaking the bonds of the solid, not into faster motion.'),
  short(A(2, 3), 'Define the coefficient of thermal conductivity, and give its SI unit.', 'The rate of heat flow per unit area per unit temperature gradient: k = (Q/t)/(A ΔT/l).', 'W m⁻¹ K⁻¹.'),
  reason(B(1, 1), 'Why can’t heat flow by itself from a cold body to a hot one?', 'The second law forbids it: it needs work from outside, as in a refrigerator.'),
  reason(B(2, 2), 'Why does a gas cool when it expands adiabatically?', 'No heat enters, so the work it does must come from its internal energy.', 'Less internal energy means a lower temperature.'),
  reason(B(2, 2), 'Why must an isothermal change be slow, and an adiabatic change quick?', 'Isothermal needs time for heat to flow in or out, so the temperature stays steady.', 'Adiabatic must be quick, so no heat has time to flow.'),
  reason(B(2, 3), 'Why is no real process quite reversible?', 'Friction, and heat flowing across a finite temperature difference, always waste energy.', 'Those can’t be undone without changes elsewhere.'),
  reason(B(1, 2), 'Why is the zeroth law the basis for using a thermometer?', 'If the thermometer and each body are in equilibrium, the bodies have the same temperature.'),
  short(B(2, 1), 'State the zeroth law of thermodynamics.', 'If two bodies are each in thermal equilibrium with a third, they are in equilibrium with each other.', 'It defines temperature as what such bodies share.'),
  short(B(2, 2), 'State the first law of thermodynamics, with the meaning of each term.', 'ΔQ = ΔU + ΔW.', 'ΔQ is heat given to the system, ΔU the rise in internal energy, and ΔW the work done by it.'),
  short(B(3, 2), 'For an ideal gas, what is ΔU, and what is ΔQ, in an isothermal change? In an adiabatic change, what is ΔQ?', 'Isothermal: ΔU = 0, as the temperature doesn’t change.', 'So ΔQ = ΔW, all the heat taken goes into work.', 'Adiabatic: ΔQ = 0, so ΔW = −ΔU.'),
  short(B(3, 3), 'State the second law in the Kelvin–Planck and the Clausius forms.', 'Kelvin–Planck: no engine can take heat from one source and turn it all into work.', 'Clausius: no device can move heat from a colder body to a hotter one with no other effect.', 'Both say the same, as a breach of one would break the other.'),
  short(B(2, 3), 'Give the equations for an isothermal and an adiabatic change of an ideal gas.', 'Isothermal: PV = constant.', 'Adiabatic: PV^γ = constant.'),
];

export default questions;
