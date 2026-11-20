// Written by hand: polyhalogen compounds, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The DDT figures are an illustration of how it builds up along a food chain, rising about ten times or more at each level.
import { at, kit, type BankDef } from '../define';
import { arrow, label, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const P = at(6, 'c');

const questions: BankDef[] = [
  figure(P(3, 2), 'Draw a cycle to show how one chlorine atom from a freon destroys many ozone molecules in the stratosphere.', ['Ultraviolet light breaks a C–Cl bond in the freon, giving a chlorine atom: CF₂Cl₂ → •CF₂Cl + Cl•.', 'Cl• + O₃ → ClO• + O₂.', 'ClO• + O → Cl• + O₂: the chlorine atom is set free again, so the cycle repeats thousands of times.'], {
    answer: sketch(360, 220, 'A cycle of two arrows. At the top, Cl• reacts with O3, giving O2 and ClO•. At the bottom, ClO• reacts with an O atom, giving O2 and Cl• again, which goes back to the top. At the left, a freon split by ultraviolet light feeds Cl• into the cycle.', [
      label(180, 40, 'Cl•'), label(180, 190, 'ClO•'),
      { t: 'path', d: 'M200 46 C 280 70, 280 160, 204 184' }, arrow([212, 180], [204, 184]), label(282, 110, '+ O₃ → O₂', 'start'),
      { t: 'path', d: 'M160 184 C 80 160, 80 70, 156 46' }, arrow([148, 50], [156, 46]), label(78, 110, '+ O → O₂', 'end'),
      arrow([92, 28], [160, 36]), label(10, 22, 'freon + UV', 'start'),
    ]),
  }),
  figure(P(3, 1), 'Make a table of one use and one harmful effect of dichloromethane, trichloromethane and tetrachloromethane.', ['Dichloromethane: a paint remover and solvent; breathing it harms the nervous system, and it can cause dizziness.', 'Trichloromethane: a solvent for fats and alkaloids; in air and light it forms poisonous phosgene, and it harms the liver.', 'Tetrachloromethane: once used in fire extinguishers and dry cleaning; it damages the liver and helps deplete the ozone layer.'], {
    answer: table(['Compound', 'A use', 'A harmful effect'], [['Dichloromethane, CH₂Cl₂', 'paint remover, solvent', 'harms the nervous system'], ['Trichloromethane, CHCl₃', 'solvent for fats', 'forms phosgene; harms the liver'], ['Tetrachloromethane, CCl₄', 'once in fire extinguishers', 'liver damage; ozone depletion']]),
  }),
  figure(P(3, 2), 'The table shows the concentration of DDT at each level of a food chain near a lake that was sprayed with it. Name the process shown, explain why it happens, and give one effect on the birds at the top.', ['It is biomagnification: the concentration rises at each step up the food chain.', 'DDT isn’t broken down, and dissolves in fat rather than water, so it stays in each animal’s body and passes on to whatever eats it.', 'Birds at the top get so much that they lay eggs with thin shells, which break, so their numbers fall.'], {
    shown: table(['Level', 'DDT (parts per million)'], [['Lake water', '0.00005'], ['Plankton', '0.04'], ['Small fish', '0.5'], ['Large fish', '2'], ['Fish-eating birds', '25']]),
  }),

  predict(P(2, 1), 'A little ethanol is warmed with iodine and sodium hydroxide solution. Predict what is seen, and name the product.', 'Yellow crystals form, with a strong, medicinal smell.', 'They are iodoform, CHI₃.'),
  predict(P(2, 2), 'A refrigerant must not be toxic or flammable, and must be easy to liquefy. Predict whether CCl₂F₂ is suitable, and the problem it causes.', 'It is suitable: it is unreactive, non-toxic, non-flammable and easily liquefied.', 'But it drifts up to the stratosphere, where it releases chlorine atoms that destroy ozone.'),
  predict(P(2, 2), 'A molecule of freon escapes from an old refrigerator. Predict what happens to it over the following years.', 'Being unreactive and insoluble, it isn’t removed in the lower air, and slowly rises to the stratosphere.', 'There, ultraviolet light breaks its C–Cl bond, releasing a chlorine atom that destroys ozone.'),

  odd(P(2, 1), ['CH₂Cl₂', 'CHCl₃', 'CCl₄', 'CH₃Cl'], 'CH₃Cl', 'It has only one halogen atom; the others are polyhalogen compounds.'),
  odd(P(2, 1), ['CCl₂F₂', 'CCl₃F', 'CClF₃', 'CHCl₃'], 'CHCl₃', 'It is chloroform, not a freon; the others are chlorofluorocarbons.'),
  odd(P(2, 1), ['dichloromethane', 'trichloromethane', 'tetrachloromethane', 'DDT'], 'DDT', 'It is an insecticide; the others are mainly used as solvents.'),

  long(P(5, 2), 'Answer each part on trichloromethane, chloroform.\n(a) Give two uses of it. [1]\n(b) Why is it no longer used as an anaesthetic? [1]\n(c) Write the equation for its slow oxidation in air and light. [1]\n(d) Give two ways in which this is prevented when it is stored. [2]', '(a) A solvent for fats, alkaloids and iodine, and in making freon refrigerants.', '(b) It damages the liver and can cause heart problems, so safer anaesthetics are used.', '(c) 2CHCl₃ + O₂ → 2COCl₂ + 2HCl.', '(d) It is kept in dark bottles filled to the top, keeping out light and air.', '(d) About 1% of ethanol is added, which turns any phosgene into harmless ethyl carbonate.'),
  long(P(5, 2), 'Answer each part on DDT.\n(a) Give its full name. [1]\n(b) Why was it so widely used? [1]\n(c) Why does it last so long in the environment, and build up in animals? [2]\n(d) Why has its use been banned or restricted? [1]', '(a) p,p′-dichlorodiphenyltrichloroethane.', '(b) It killed the mosquitoes that spread malaria, and insects that damage crops.', '(c) It is chemically stable and isn’t broken down by living things, so it lasts for years.', '(c) It dissolves in fat, not water, so it is stored in fatty tissue and passed up food chains.', '(d) Insects became resistant to it, and it harmed fish and birds, thinning their eggshells.'),
  long(P(5, 1), 'Answer each part on tetrachloromethane and dichloromethane.\n(a) Give one past use of tetrachloromethane. [1]\n(b) Give two effects of tetrachloromethane on health. [2]\n(c) How does tetrachloromethane harm the environment? [1]\n(d) Give one effect of breathing in dichloromethane. [1]', '(a) In fire extinguishers, or as a dry-cleaning solvent.', '(b) It damages the liver and can cause liver cancer.', '(b) It can cause dizziness, nausea and damage to the nervous system.', '(c) It rises to the upper atmosphere and helps deplete the ozone layer.', '(d) It affects the nervous system, causing dizziness and numbness in the fingers and toes.'),

  tell(P(2, 1), 'Distinguish between chloroform and iodoform.', 'Chloroform, CHCl₃, is a colourless, sweet-smelling liquid, used as a solvent.', 'Iodoform, CHI₃, is a yellow solid with a strong smell, once used as an antiseptic.'),
  tell(P(2, 1), 'Distinguish between dichloromethane and tetrachloromethane.', 'Dichloromethane, CH₂Cl₂, still has two hydrogens; it is used as a paint remover and solvent.', 'Tetrachloromethane, CCl₄, has all four hydrogens replaced by chlorine; it was used in fire extinguishers, and is now limited because it is toxic and harms ozone.'),
  tell(P(2, 2), 'Distinguish between a biodegradable and a non-biodegradable pesticide, with DDT as an example.', 'A biodegradable pesticide is broken down by living things into harmless substances, so it doesn’t last.', 'A non-biodegradable pesticide, such as DDT, isn’t broken down, so it lasts for years and builds up in food chains.'),

  match(P(4, 1), [['Dichloromethane', 'paint remover'], ['Trichloromethane', 'solvent for fats and alkaloids'], ['Tetrachloromethane', 'once used in fire extinguishers'], ['Iodoform', 'antiseptic']]),
  match(P(4, 1), [['Freon-12', 'CCl₂F₂'], ['Chloroform', 'CHCl₃'], ['Iodoform', 'CHI₃'], ['Carbon tetrachloride', 'CCl₄']]),
  match(P(4, 2), [['DDT', 'builds up along food chains'], ['Freons', 'deplete the ozone layer'], ['Chloroform in air and light', 'forms phosgene'], ['Dichloromethane breathed in', 'harms the nervous system']]),

  ar(P(1, 1), 'Iodoform was once used as an antiseptic.', 'It releases free iodine when it comes into contact with the skin.', 1, 'The iodine set free kills germs.'),
];

export default questions;
