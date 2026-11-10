// Written by hand: electromagnetic waves, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why are electromagnetic waves able to travel through a vacuum, though sound can’t?', 'They need no medium, as changing electric and magnetic fields keep each other going.'),
  reason(A(1, 2), 'Why is infrared used in remote controls, and not X-rays?', 'Infrared is low in energy, cheap to make and harmless, while X-rays are dangerous and need costly tubes.'),
  reason(A(2, 2), 'Why is ultraviolet from the Sun dangerous high in the atmosphere, but much less so at ground level?', 'The ozone layer absorbs most of it.', 'So little of its high-energy part reaches the ground.'),
  reason(A(2, 3), 'Maxwell added a displacement current to Ampere’s law. Why was it needed?', 'Between a capacitor’s plates no charge flows, yet a magnetic field is found there.', 'So a changing electric field must also make a magnetic field.'),
  short(A(2, 1), 'State two properties of electromagnetic waves.', 'They are transverse, with E and B at right angles to each other and to the direction of travel.', 'In a vacuum they all travel at 3 × 10⁸ m s⁻¹.'),
  short(A(2, 1), 'Arrange in order of rising frequency: X-rays, radio waves, visible light, microwaves. Name one use of the last.', 'Radio waves, microwaves, visible light, X-rays.', 'Microwaves: radar, or heating food.'),
  tell(A(2, 2), 'Distinguish between conduction current and displacement current.', 'Conduction current is the flow of charge in a conductor.', 'Displacement current comes from a changing electric field, even in empty space.'),
  short(A(3, 2), 'Name the part of the spectrum used for each: sterilising water; photographing bones; seeing in the dark with a camera.', 'Ultraviolet.', 'X-rays.', 'Infrared.'),
  short(A(3, 3), 'Write the wavelength range of the visible region. How does the speed of light relate to the permittivity and permeability of free space?', 'About 400 nm to 700 nm.', 'c = 1 / √(μ₀ε₀).', 'Showing that light is an electromagnetic wave.'),
];

export default questions;
