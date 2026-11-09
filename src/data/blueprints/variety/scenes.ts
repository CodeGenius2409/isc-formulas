// Original settings for numerical questions, by subject and unit. A setting names a real situation and which quantities it
// suits, by a pattern tested against the entry's quantities: a coil setting only reaches formulas with turns or a coil in
// them. The tag is the kind of context, and tests/unit/variety.test.ts checks that no kind dominates a topic.
import type { SubjectId } from '../../types';
import type { Scene } from './engine';

type Bank = Record<string, readonly Scene[]>;

const MOTION: readonly Scene[] = [
  ['vehicles', 'A road-safety team studies a car on a test track.', /speed|velocity|acceleration|time|distance|displacement/],
  ['sport', 'A sprint coach analyses a training run with a motion sensor.', /speed|velocity|acceleration|time|distance|displacement/],
  ['transport', 'A metro operator studies a train pulling out of a station.', /speed|velocity|acceleration|time|distance|displacement/],
  ['lab', 'A student tracks a trolley on a laboratory runway.'],
  ['space', 'Engineers test a small lander on a drop rig.', /speed|velocity|height|time|acceleration/],
  ['nature', 'A wildlife researcher scales film of a running cheetah to a simple model.', /speed|velocity|acceleration|distance/],
  ['household', 'A robot vacuum cleaner is timed across a measured strip of floor.', /speed|velocity|time|distance/],
  ['medicine', 'A physiotherapist studies a patient’s walking trial on a treadmill.', /speed|velocity|time|distance/],
  ['sport', 'A cricket coach studies a ball’s flight from video.', /angle|range|height|projectile|horizontal/],
  ['environment', 'A firefighter’s hose throws a jet of water across a yard.', /angle|range|height|projectile|horizontal/],
  ['industry', 'A sprinkler in a plant nursery throws water in an arc.', /angle|range|height|projectile|horizontal/],
];

const FORCES: readonly Scene[] = [
  ['vehicles', 'A brake-testing rig in a garage holds a small car model.', /force|mass|acceleration|friction/],
  ['sport', 'A cricket academy studies a ball with a force plate and a speed gun.', /force|impulse|momentum|time/],
  ['space', 'A team models a small thruster on a low-friction air table.', /force|mass|acceleration|momentum|thrust/],
  ['industry', 'A crate moves along a factory’s roller line.', /force|mass|friction|acceleration/],
  ['lab', 'A student uses a force sensor and a dynamics trolley.'],
  ['construction', 'A site engineer tests a small hoist on a building site.', /force|mass|tension|acceleration/],
  ['household', 'Someone drags a loaded box across a tiled kitchen floor.', /friction|force|mass/],
  ['medicine', 'A hospital traction frame is being set up.', /force|tension|mass/],
  ['transport', 'A road designer checks a curve on a new highway.', /radius|centripetal|banking|speed/],
  ['sport', 'A cyclist leans into a bend on a velodrome track.', /radius|centripetal|banking|speed/],
  ['nature', 'A hailstone’s fall is modelled as a simple force problem.', /force|mass|acceleration/],
];

const ENERGY: readonly Scene[] = [
  ['vehicles', 'An electric-car team tests a regenerative brake.', /energy|mass|speed|work/],
  ['sport', 'A pole-vault coach models an athlete’s run-up.', /energy|mass|speed|height/],
  ['industry', 'A small pile driver on a test bench lifts and drops a block.', /energy|mass|height|work/],
  ['energy', 'A micro-hydro scheme is being sized for a hill village.', /power|energy|height|mass/],
  ['lab', 'A student lets a glider run along an air track.'],
  ['household', 'A water pump lifts water to a rooftop tank.', /power|work|energy|height|time/],
  ['construction', 'A small crane lifts bags of cement on a building site.', /power|work|force|time|height|energy/],
  ['environment', 'A wind-tunnel test measures a model wind turbine.', /power|energy|time/],
  ['medicine', 'A rehabilitation clinic measures a patient’s work on an exercise bike.', /power|work|time|energy/],
  ['transport', 'Two railway wagons meet in a shunting yard.', /collision|velocity|momentum|mass|coefficient/],
  ['sport', 'A snooker player’s cue ball strikes another ball.', /collision|velocity|momentum|mass|coefficient/],
];

const ROTATION: readonly Scene[] = [
  ['vehicles', 'A workshop balances a car wheel on a spin rig.', /moment of inertia|angular|torque|radius/],
  ['sport', 'A gymnastics coach models a turn on the bars.', /moment of inertia|angular|torque/],
  ['space', 'A satellite team tests a reaction wheel on the bench.', /moment of inertia|angular|torque/],
  ['industry', 'A flywheel on a factory press is being checked.', /moment of inertia|angular|torque|energy/],
  ['lab', 'A student spins a disc on a low-friction axle.'],
  ['household', 'The drum of a washing machine runs up to speed.', /angular|moment of inertia|torque/],
  ['construction', 'A heavy door on a site office is being rehung.', /torque|force|moment|distance/],
  ['transport', 'A loaded crane jib is checked for balance.', /torque|force|moment|centre of mass|position/],
  ['nature', 'A diver’s somersault is modelled from slow-motion video.', /angular|moment of inertia/],
];

const GRAVITY: readonly Scene[] = [
  ['space', 'A mission planner compares figures for a satellite’s orbit.', /orbit|radius|period|height|speed/],
  ['communication', 'A broadcaster plans a communications satellite.', /orbit|radius|period|height|speed/],
  ['environment', 'A weather-satellite team reviews its orbit.', /orbit|radius|period|height|speed/],
  ['lab', 'A student works through a data sheet on gravity.'],
  ['exploration', 'A probe team studies a planet from flyby data.', /mass|radius|gravity|escape|acceleration/],
  ['astronomy', 'An astronomy club analyses a moon of Jupiter.', /mass|radius|period|orbit|force/],
  ['industry', 'A launch company estimates what a small rocket must do.', /escape|speed|energy|height/],
  ['mining', 'A mining geologist compares gravity down a deep shaft.', /depth|height|gravity|acceleration/],
  ['transport', 'An aircraft designer looks at gravity at cruising height.', /height|gravity|acceleration/],
];

const MATERIALS: readonly Scene[] = [
  ['construction', 'A site engineer tests a steel tie rod.', /stress|strain|modulus|force|length|area|extension/],
  ['industry', 'A cable for a factory hoist is being checked.', /stress|strain|modulus|force|length|area|extension/],
  ['medicine', 'A lab tests a material for a surgical implant.', /stress|strain|modulus/],
  ['sport', 'A climbing-rope maker tests a short sample.', /stress|strain|force|length|extension/],
  ['lab', 'A student loads a wire in a Searle’s apparatus.'],
  ['transport', 'A bridge inspector samples a suspension hanger.', /stress|strain|modulus|force|length/],
  ['household', 'A bicycle brake cable is tested at home.', /stress|force|area|length/],
  ['environment', 'A water authority tests a pipeline joint.', /stress|force|area/],
];

const FLUIDS: readonly Scene[] = [
  ['medicine', 'A nurse sets up a saline drip and checks the flow.', /flow|speed|pressure|height|density|area/],
  ['industry', 'A hydraulic press in a workshop is being serviced.', /pressure|force|area/],
  ['transport', 'A ship designer tests a small hull model.', /density|volume|upthrust|buoyan|mass/],
  ['household', 'A plumber checks the water supply to a flat.', /pressure|flow|speed|height|area|density/],
  ['environment', 'A hydrologist studies water moving through a channel.', /flow|speed|area/],
  ['lab', 'A student drops a steel ball through glycerine.', /viscosity|terminal|radius|density/],
  ['nature', 'A biologist studies water rising in a thin plant stem.', /surface tension|capillary|radius|rise|contact/],
  ['space', 'A team models the propellant feed in a rocket stage.', /flow|speed|pressure/],
  ['sport', 'A swimmer’s drag is studied in a flow tank.', /viscosity|speed|flow/],
  ['lab', 'A student reads a manometer and a stopwatch in the lab.'],
  ['household', 'Soap bubbles are studied in a school project.', /surface tension|radius|bubble|drop|energy/],
];

const HEAT: readonly Scene[] = [
  ['household', 'An electric kettle is tested in a kitchen.', /heat|temperature|specific|mass|power/],
  ['industry', 'A heat exchanger in a dairy is being checked.', /heat|temperature|specific|conduct/],
  ['environment', 'A climate class analyses data from a weather station.', /temperature|radiat|emiss/],
  ['vehicles', 'An engineer studies a small engine on a test bench.', /efficiency|work|heat|temperature|volume|pressure|gas/],
  ['lab', 'A student runs a calorimeter experiment.'],
  ['medicine', 'A lab calibrates a blood warmer.', /heat|temperature|specific/],
  ['energy', 'A solar water heater on a roof is being sized.', /heat|temperature|specific|power|radiat/],
  ['construction', 'A builder compares wall insulation for a house.', /conduct|thickness|area|temperature|heat/],
  ['food', 'A food plant pasteurises a batch of milk.', /heat|temperature|specific|mass/],
  ['construction', 'A railway track’s expansion gap is being set.', /expansion|length|temperature/],
];

const GAS: readonly Scene[] = [
  ['vehicles', 'A tyre-testing lab checks a pressurised sample of air.', /pressure|volume|temperature|amount|gas/],
  ['medicine', 'A hospital checks an oxygen cylinder before use.', /pressure|volume|temperature|amount|gas|speed/],
  ['industry', 'A compressor in a workshop fills a storage tank.', /pressure|volume|temperature|amount/],
  ['environment', 'A weather balloon is prepared for launch.', /pressure|volume|temperature|amount/],
  ['lab', 'A student traps gas in a syringe with a pressure sensor.'],
  ['household', 'A cooking-gas cylinder is being inspected.', /pressure|volume|temperature|amount/],
  ['sport', 'A diver’s air tank is being checked before a dive.', /pressure|volume|temperature|amount/],
  ['space', 'A team studies the thin atmosphere of a planet from probe data.', /speed|temperature|molar|pressure|molecul/],
];

const WAVES: readonly Scene[] = [
  ['music', 'A violin maker tests a string on the bench.', /tension|frequency|length|wavelength|string|mass per/],
  ['medicine', 'An ultrasound technician checks a scanner’s settings.', /frequency|wavelength|speed/],
  ['industry', 'A vibration sensor is fitted to a factory motor.', /frequency|amplitude|period|angular/],
  ['environment', 'A coastal station records waves on a tide gauge.', /wavelength|frequency|speed|period/],
  ['lab', 'A student uses a signal generator and a resonance tube.'],
  ['transport', 'A car-suspension spring is tested on a shaker.', /spring|mass|period|frequency|amplitude/],
  ['construction', 'An engineer studies the sway of a model tower.', /period|frequency|amplitude|spring/],
  ['household', 'A wall clock’s pendulum is being adjusted.', /pendulum|length|period/],
  ['nature', 'A biologist records the wingbeat of an insect.', /frequency|period/],
  ['music', 'An organ pipe is being tuned.', /pipe|length|frequency|wavelength|harmonic/],
];

const ELECTROSTATICS: readonly Scene[] = [
  ['industry', 'A paint-spray gun gives each droplet a small charge.', /charge|force|field/],
  ['environment', 'An electrostatic precipitator cleans a chimney’s smoke.', /field|charge|force|potential/],
  ['household', 'A photocopier’s drum is being checked for charge.', /charge|potential|field/],
  ['nature', 'A class studies charge in a thundercloud with a simple model.', /charge|potential|field|force/],
  ['lab', 'A student works with charged spheres on insulating stands.'],
  ['medicine', 'A defibrillator’s capacitor is being tested by a technician.', /capacit|energy|charge|voltage|potential/],
  ['transport', 'A fuel tanker’s earthing strap is being inspected.', /charge|potential|energy/],
  ['electronics', 'A touch-screen sensor’s electrodes are being modelled.', /capacit|plate|area|distance/],
  ['space', 'A team studies charging on a small satellite’s panel.', /charge|potential|field/],
  ['household', 'A camera’s flash capacitor is being tested.', /capacit|energy|charge|voltage|potential/],
  ['research', 'A student looks at the dipole of a water molecule in a field.', /dipole|torque/],
];

const CIRCUITS: readonly Scene[] = [
  ['household', 'An electrician checks an extension lead at home.', /current|voltage|resistance|power|energy/],
  ['vehicles', 'A mechanic tests the wiring of a car’s headlamp.', /current|voltage|resistance|power/],
  ['industry', 'A technician tests a heater element in a factory.', /current|voltage|resistance|power|temperature/],
  ['lab', 'A student sets up a circuit on a lab bench.'],
  ['medicine', 'A technician checks a battery-powered infusion pump.', /current|voltage|emf|resistance|power/],
  ['electronics', 'A phone charger’s output is measured.', /current|voltage|power|energy/],
  ['energy', 'A rooftop solar panel’s wiring is tested.', /current|voltage|resistance|resistivity|length|power/],
  ['environment', 'A remote weather sensor’s battery circuit is being sized.', /emf|internal|current|resistance/],
  ['transport', 'A railway signal’s long cable is being checked.', /resistivity|length|area|resistance/],
  ['household', 'A family works out what its appliances cost to run.', /power|energy|time/],
];

const MAGNETISM: readonly Scene[] = [
  ['medicine', 'A technician checks a test coil for an MRI scanner.', /turns|loop|coil|solenoid/],
  ['industry', 'A lifting electromagnet in a scrapyard is being tested.', /turns|solenoid|coil/],
  ['transport', 'An overhead railway line’s field is measured.', /wire|distance/],
  ['lab', 'A student uses a current balance in the lab.'],
  ['household', 'A loudspeaker’s voice coil is being measured.', /force on|length|turns|coil/],
  ['electronics', 'An old cathode-ray tube’s beam is being studied.', /charge|speed|radius of path|magnetic force/],
  ['energy', 'A power cable’s field is measured near a substation.', /wire|distance/],
  ['research', 'A mass spectrometer in a research lab is being calibrated.', /charge|mass|speed|radius of path/],
  ['vehicles', 'An electric motor from a scooter is tested on the bench.', /torque|turns|coil|area|moment/],
  ['medicine', 'A cyclotron for making hospital isotopes is being studied.', /charge|mass|speed|radius of path|frequency/],
  ['lab', 'A student adjusts a moving-coil meter.', /galvanometer|shunt|torque|moment|turns/],
];

const INDUCTION: readonly Scene[] = [
  ['energy', 'A small generator for a micro-hydro scheme is being tested.', /emf|turns|flux|speed|angular/],
  ['household', 'An induction cooktop’s coil is examined by a repair technician.', /emf|flux|turns|inductance|time/],
  ['transport', 'A train’s eddy-current brake is modelled on a bench.', /emf|speed|length|field/],
  ['electronics', 'A wireless phone charger’s coils are being tested.', /emf|flux|turns|mutual|inductance/],
  ['lab', 'A student moves a magnet through a coil with a data logger.'],
  ['industry', 'A metal detector at a factory gate is being tuned.', /inductance|emf|current|time/],
  ['vehicles', 'A car’s ignition coil is tested in a workshop.', /inductance|emf|current|time|energy/],
  ['medicine', 'A hearing-aid loop in a clinic is being checked.', /emf|flux|turns|area/],
  ['environment', 'A wind turbine’s small generator is tested on a rig.', /emf|turns|flux|speed|angular/],
];

const AC: readonly Scene[] = [
  ['household', 'A fan regulator in a home is being repaired.', /current|voltage|impedance|reactance|inductance|capacit/],
  ['energy', 'A substation transformer is being checked.', /turns|primary|secondary|efficiency|transformer/],
  ['electronics', 'A radio’s tuning circuit is being adjusted.', /resonan|frequency|inductance|capacit/],
  ['lab', 'A student connects an LCR circuit to a signal generator.'],
  ['industry', 'A factory’s power-factor correction unit is being sized.', /power|factor|impedance|resistance/],
  ['medicine', 'An X-ray machine’s supply circuit is being serviced.', /turns|primary|secondary|rms|peak|voltage/],
  ['communication', 'A filter in a broadband router is being designed.', /frequency|reactance|capacit|inductance/],
  ['transport', 'An electric locomotive’s supply is being examined.', /rms|peak|voltage|current|power/],
  ['environment', 'A street-lighting circuit is being checked for efficiency.', /power|factor|rms|voltage|current/],
];

const EM: readonly Scene[] = [
  ['communication', 'A radio station’s transmitter is being checked.', /frequency|wavelength/],
  ['medicine', 'A hospital reviews its X-ray equipment.', /frequency|wavelength|energy/],
  ['household', 'A microwave oven’s output is studied.', /frequency|wavelength/],
  ['space', 'A radio telescope receives a signal from a probe.', /frequency|wavelength|speed|distance/],
  ['environment', 'A satellite measures infrared from the Earth’s surface.', /frequency|wavelength/],
  ['lab', 'A student works through data on a spectrum chart.'],
  ['transport', 'An airport’s radar is being calibrated.', /frequency|wavelength/],
  ['industry', 'A UV curing lamp in a print shop is being tested.', /frequency|wavelength|energy/],
];

const OPTICS: readonly Scene[] = [
  ['medicine', 'An optician tests a lens for a pair of spectacles.', /focal|lens|power|object|image/],
  ['space', 'An astronomy club sets up its telescope.', /objective|eyepiece|magnif|focal/],
  ['vehicles', 'A car’s rear-view mirror is examined in a workshop.', /mirror|radius|focal|object|image|curvature/],
  ['lab', 'A student sets up an optical bench with a lens and a screen.'],
  ['communication', 'An engineer checks light in an optical fibre.', /critical|refractive|angle/],
  ['nature', 'A diver looks up at the surface of a still pool.', /refractive|critical|depth|angle/],
  ['photography', 'A photographer tests a camera lens.', /focal|lens|object|image|magnif/],
  ['industry', 'A projector’s optics are being aligned in a factory.', /focal|lens|object|image|magnif/],
  ['energy', 'A solar concentrator’s mirror is being tested.', /mirror|focal|radius|curvature/],
  ['research', 'A lab bench experiment measures fringes on a screen.', /fringe|slit|wavelength|screen/],
  ['environment', 'A gemstone’s sparkle is studied by a jeweller.', /refractive|critical|prism|angle/],
];

const MODERN: readonly Scene[] = [
  ['electronics', 'A light sensor in a door opener is being tested.', /photo|work function|stopping|threshold|frequency/],
  ['medicine', 'A lab reviews the X-ray tube in a dental clinic.', /wavelength|energy|voltage|photon/],
  ['space', 'A solar panel on a satellite is tested in a vacuum chamber.', /photo|work function|stopping|threshold/],
  ['lab', 'A student takes readings with a photocell in a dark room.'],
  ['energy', 'A research group compares nuclear fuels on paper.', /binding|mass defect|nucleon|energy released|nucleus|fission|fusion/],
  ['astronomy', 'An astronomy class studies the spectrum of hydrogen in a nebula.', /orbit|level|wavelength|rydberg|quantum|transition/],
  ['research', 'A physicist reviews data from an electron microscope.', /de broglie|wavelength|momentum|voltage/],
  ['industry', 'A semiconductor plant tests a laser’s photons.', /photon|wavelength|frequency|energy/],
  ['environment', 'A monitoring station samples sunlight in the ultraviolet.', /photon|wavelength|frequency|energy/],
];

const DEVICES: readonly Scene[] = [
  ['electronics', 'A phone charger’s rectifier is being tested.', /ripple|rectif|voltage|peak|frequency/],
  ['energy', 'A solar panel’s cells are measured on a rooftop.', /current|voltage|power|efficien/],
  ['household', 'An LED torch is being repaired.', /voltage|current|resistance|wavelength|gap/],
  ['lab', 'A student plots a diode’s characteristic.'],
  ['industry', 'A voltage regulator in a control panel is being checked.', /zener|voltage|current|resistance/],
  ['communication', 'A signal detector in a radio is being tested.', /frequency|voltage|ripple/],
  ['vehicles', 'A car’s voltage stabiliser is examined.', /zener|voltage|current|resistance/],
  ['medicine', 'A pulse oximeter’s photodiode is being calibrated.', /wavelength|gap|current|energy/],
];

const MOLES: readonly Scene[] = [
  ['industry', 'A fertiliser plant checks a batch.', /mass|moles|amount|percent|molar/],
  ['medicine', 'A hospital pharmacy prepares a dose.', /mass|moles|amount|molar|volume|concentration/],
  ['environment', 'A water authority tests a river sample.', /molar|normal|volume|concentration|mass/],
  ['food', 'A food lab analyses a batch of baking soda.', /mass|moles|amount|molar|percent/],
  ['lab', 'A student weighs out a sample for a practical.'],
  ['household', 'A cleaning product’s label is checked in a school project.', /molar|normal|volume|percent|mass/],
  ['agriculture', 'An agricultural lab tests a soil sample.', /mass|percent|molar|normal|volume/],
  ['energy', 'A biofuel team analyses a small sample of fuel.', /mass|percent|moles|amount/],
  ['mining', 'A mining firm assays a sample of ore.', /mass|percent|moles|amount|molar/],
];

const ATOMS: readonly Scene[] = [
  ['lab', 'A student analyses a flame-test spectrum.', /wavelength|frequency|energy/],
  ['astronomy', 'An astronomer studies a line in a star’s spectrum.', /wavelength|frequency|energy|rydberg/],
  ['medicine', 'A lab calibrates a laser for eye surgery.', /wavelength|frequency|energy|photon/],
  ['household', 'A class studies the colour of sodium street lamps.', /wavelength|frequency|energy/],
  ['industry', 'A spectrometer in a steel plant is being set up.', /wavelength|frequency|energy/],
  ['electronics', 'A chip-maker checks a light source used for etching.', /wavelength|frequency|energy/],
  ['environment', 'A pollution monitor uses atomic absorption.', /wavelength|frequency|energy/],
  ['research', 'A research group measures electrons in a microscope.', /momentum|mass|de broglie|speed|uncertainty/],
  ['lab', 'A student works through a data sheet on atoms.'],
];

const THERMO: readonly Scene[] = [
  ['energy', 'A power-station chemist compares fuels.', /enthalpy|heat|energy/],
  ['food', 'A food lab uses a bomb calorimeter on a snack bar.', /heat|enthalpy|energy|mass/],
  ['vehicles', 'A team studies the combustion of a car fuel.', /enthalpy|heat|energy|work/],
  ['industry', 'A plant engineer reviews a reaction’s heat budget.', /enthalpy|heat|entropy|gibbs|free energy/],
  ['lab', 'A student measures a temperature rise in a coffee-cup calorimeter.'],
  ['household', 'A class compares the heat from LPG and kerosene.', /enthalpy|heat|energy/],
  ['environment', 'A team studies heat released when a fuel burns.', /enthalpy|heat|energy/],
  ['medicine', 'A lab studies a cold pack used for sports injuries.', /enthalpy|heat|entropy|gibbs|free energy/],
];

const EQUILIBRIUM: readonly Scene[] = [
  ['industry', 'A plant manager studies a synthesis reactor.', /equilibrium constant|K_c|K_p|pressure/],
  ['environment', 'A team measures acidity in industrial waste water.', /pH|pOH|H⁺|acid|concentration|hydrogen/],
  ['food', 'A food lab tests the acidity of a batch of pickle.', /pH|pOH|H⁺|acid|hydrogen/],
  ['lab', 'A student uses a pH meter on a prepared solution.'],
  ['household', 'A class tests the acidity of household vinegar.', /pH|H⁺|acid|hydrogen/],
  ['agriculture', 'An agronomist tests a soil extract.', /pH|pOH|H⁺|OH|hydrogen/],
  ['pool', 'A swimming-pool technician checks the water.', /pH|pOH|H⁺|OH|hydrogen/],
  ['medicine', 'A pharmacist checks how soluble a salt is for an antacid.', /solubility|K_sp|ionic/],
  ['mining', 'A lab checks a metal salt’s solubility in mine water.', /solubility|K_sp|ionic/],
];

const SOLUTIONS: readonly Scene[] = [
  ['medicine', 'A hospital lab prepares an intravenous solution.', /osmotic|molarity|concentration|van 't Hoff/],
  ['vehicles', 'A workshop mixes antifreeze for a radiator.', /freezing|molality|cryoscopic|van 't Hoff/],
  ['industry', 'A soft-drinks plant checks a batch of syrup.', /molarity|molality|mole fraction|mass|density/],
  ['food', 'A cook studies salted water in a test kitchen.', /boiling|molality|ebullioscopic|van 't Hoff/],
  ['environment', 'A desalination plant tests a sample of sea water.', /osmotic|molarity|concentration/],
  ['lab', 'A student measures a solution’s vapour pressure in the lab.'],
  ['nature', 'A biologist studies water movement in plant cells.', /osmotic|molarity|concentration/],
  ['agriculture', 'An agricultural lab prepares a fertiliser solution.', /molarity|molality|mass|mole fraction/],
  ['household', 'A class studies a sugar solution in a school project.', /boiling|freezing|molality|molarity/],
  ['research', 'A chemist compares a mixture of two volatile liquids.', /vapour pressure|mole fraction|partial|Raoult/],
];

const ELECTROCHEM: readonly Scene[] = [
  ['vehicles', 'A battery lab tests a car battery cell.', /emf|potential|Nernst|free energy|gibbs/],
  ['industry', 'A plating shop prepares to plate a batch of parts.', /mass|current|time|charge|Faraday|electrochemical/],
  ['electronics', 'A team tests a cell for a small device.', /emf|potential|Nernst/],
  ['environment', 'A team tests the conductivity of river water.', /conductivity|conductance|molar conductivity|resistance|cell constant/],
  ['lab', 'A student sets up a cell with a salt bridge.'],
  ['energy', 'A research group tests a fuel cell.', /emf|potential|free energy|gibbs/],
  ['household', 'A class measures the voltage of a homemade cell.', /emf|potential/],
  ['medicine', 'A lab checks the conductivity of a saline solution.', /conductivity|conductance|cell constant/],
  ['mining', 'A refinery purifies copper by electrolysis.', /mass|current|time|charge|Faraday/],
];

const KINETICS: readonly Scene[] = [
  ['medicine', 'A pharmacist studies how a drug breaks down in storage.', /rate|half|order|time|concentration/],
  ['food', 'A food lab studies how quickly milk spoils.', /rate|temperature|activation|Arrhenius|time/],
  ['industry', 'A plant chemist studies a reaction in a batch reactor.', /rate|order|concentration|activation|time/],
  ['environment', 'A team studies how a pollutant breaks down in a lake.', /rate|half|order|time|concentration/],
  ['lab', 'A student follows a reaction by measuring gas given off.'],
  ['vehicles', 'A team studies a catalytic converter’s reaction.', /rate|temperature|activation|Arrhenius/],
  ['agriculture', 'An agronomist studies how a pesticide decays in soil.', /rate|half|order|time|concentration/],
  ['household', 'A class times a stain breaking down in bleach.', /rate|order|time|concentration/],
];

const COUNTING: readonly Scene[] = [
  ['finance', 'A bank is reviewing a savings plan.', /term|ratio|difference|sum/],
  ['agriculture', 'A farmer is planning rows of crops.', /term|difference|sum/],
  ['construction', 'A builder is stacking rows of bricks.', /term|difference|sum/],
  ['sport', 'A club is planning its training over a season.', /term|difference|sum/],
];

const CHANCE: readonly Scene[] = [
  ['medicine', 'A clinic is studying its test results.'],
  ['sport', 'A coach is looking at a team’s record.'],
  ['industry', 'A factory is sampling items for defects.'],
  ['environment', 'A weather station is reviewing its records.'],
  ['education', 'A teacher is looking at a class’s results.'],
  ['agriculture', 'A farmer is comparing crop trials.'],
  ['transport', 'A bus company is reviewing its arrival times.'],
  ['communication', 'A phone company is studying dropped calls.'],
];

const LINES: readonly Scene[] = [
  ['construction', 'A site surveyor is marking out a plot on squared paper.'],
  ['navigation', 'A ship’s navigator is plotting positions on a chart.'],
  ['architecture', 'An architect is setting out a plan on a grid.'],
  ['transport', 'A road engineer is laying out a junction on a map grid.'],
  ['sport', 'A groundsman is marking out a playing field on a plan.'],
  ['industry', 'A machinist is programming a cutter’s path.'],
  ['astronomy', 'A student is plotting a comet’s path on a chart.'],
  ['communication', 'An engineer is placing transmitter sites on a grid.'],
];

const BANKS: Record<string, Bank> = {
  'physics XI': { '1': MOTION, '2': MOTION, '3': FORCES, '4': ENERGY, '5': ROTATION, '6': GRAVITY, '7': MATERIALS, '7b': FLUIDS, '7c': FLUIDS, '8': HEAT, '9': GAS, '10': WAVES },
  'physics XII': { '1': ELECTROSTATICS, '2': CIRCUITS, '3': MAGNETISM, '4': INDUCTION, '4b': AC, '5': EM, '6': OPTICS, '7': MODERN, '8': MODERN, '9': DEVICES },
  'chemistry XI': { '1': MOLES, '2': ATOMS, '4': ATOMS, '5': THERMO, '6': EQUILIBRIUM },
  'chemistry XII': { '1': SOLUTIONS, '2': ELECTROCHEM, '3': KINETICS, '11': KINETICS },
  'mathematics XI': { '2e': COUNTING, '3a': LINES, '3c': LINES, '5a': CHANCE, '5b': CHANCE },
  'mathematics XII': { '7a': CHANCE },
};

export function scenesFor(subject: SubjectId, level: string): (unit: number, topic: string) => readonly Scene[] {
  const bank = BANKS[`${subject} ${level}`] ?? {};
  return (unit, topic) => bank[`${unit}${topic}`] ?? bank[String(unit)] ?? [];
}
