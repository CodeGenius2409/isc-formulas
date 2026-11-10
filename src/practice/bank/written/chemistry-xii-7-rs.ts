// Written by hand: phenols and ethers, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('chemistry', 'XII');
const B = at(7, 'b');
const C = at(7, 'c');

const questions: BankDef[] = [
  reason(B(1, 1), 'Why is phenol more acidic than ethanol?', 'The phenoxide ion is stabilised by resonance, and the ethoxide ion isn’t.'),
  reason(B(2, 2), 'Why does phenol react readily with bromine water, while benzene doesn’t?', 'The –OH group gives electron density to the ring by resonance.', 'So the ortho and para positions are strongly activated.'),
  reason(B(2, 2), 'Why does o-nitrophenol boil lower than p-nitrophenol?', 'The ortho isomer has an internal hydrogen bond.', 'The para isomer forms hydrogen bonds between its molecules.'),
  reason(B(2, 3), 'Why is 4-nitrophenol a stronger acid than phenol?', 'The nitro group withdraws electrons by –I and –R effects.', 'That stabilises the phenoxide ion.'),
  reason(B(1, 2), 'Why doesn’t phenol give a carbon dioxide test with sodium bicarbonate?', 'It is a weaker acid than carbonic acid, so it can’t release CO₂.'),
  short(B(2, 1), 'Write the IUPAC names of the compounds known as catechol and quinol.', 'Catechol: benzene-1,2-diol.', 'Quinol: benzene-1,4-diol.'),
  short(B(2, 2), 'How is phenol made from chlorobenzene? Name the process.', 'Heat with NaOH at about 623 K and high pressure, which gives sodium phenoxide.', 'Acidify to free the phenol: this is Dow’s process.'),
  short(B(3, 2), 'What is the Kolbe reaction? Give its conditions, its product, and which position the new group takes.', 'Sodium phenoxide is treated with CO₂ at about 400 K and 4–7 atm, then acidified.', 'It gives salicylic acid, 2-hydroxybenzoic acid.', 'The –COOH group goes mainly ortho to the –OH.'),
  short(B(3, 3), 'What does phenol give with Br₂ in water and in CS₂? Say what changes the products.', 'In water, 2,4,6-tribromophenol, a white precipitate.', 'In CS₂ at low temperature, mainly 4-bromophenol.', 'Water helps ionise phenol, which makes the ring far more reactive.'),
  reason(C(1, 1), 'Why do ethers boil far lower than alcohols of the same mass?', 'Ether molecules don’t form hydrogen bonds with one another.'),
  reason(C(2, 2), 'Why do ethers dissolve in water to about the same extent as alcohols of the same mass?', 'Their oxygen can form hydrogen bonds with water.', 'So short ethers mix with water, though they can’t bond with each other.'),
  reason(C(2, 2), 'Why is the C–O–C angle in an ether slightly above the tetrahedral angle?', 'The two bulky alkyl groups repel each other.', 'So the angle is opened to about 111°.'),
  reason(C(2, 3), 'Why does tert-butyl bromide with sodium methoxide give an alkene rather than an ether?', 'A tertiary halide is crowded, so substitution is blocked.', 'Methoxide acts as a base, which causes elimination.'),
  reason(C(1, 2), 'Why are long-stored ether bottles dangerous to distil to dryness?', 'Ethers slowly form peroxides in air, which can explode on heating.'),
  short(C(2, 1), 'State and write the Williamson synthesis for making ethoxyethane.', 'An alkyl halide is heated with a sodium alkoxide.', 'C₂H₅Br + C₂H₅ONa → C₂H₅OC₂H₅ + NaBr.'),
  short(C(2, 2), 'What does methoxybenzene give with HI? Why not iodobenzene?', 'Phenol and iodomethane.', 'The C–O bond to the ring has partial double-bond character, so it doesn’t break.'),
  short(C(3, 2), 'How would you make these from ethanol: ethene and ethoxyethane? State the condition that decides which forms.', 'With concentrated H₂SO₄ at about 443 K: ethene.', 'With excess ethanol and H₂SO₄ at about 413 K: ethoxyethane.', 'Temperature and the amount of ethanol decide.'),
  short(C(3, 3), 'Give the products of anisole in each: with bromine in ethanoic acid; with nitrating mixture; with CH₃Cl and AlCl₃.', 'Mainly 4-bromomethoxybenzene.', 'Mainly 4-nitromethoxybenzene.', 'Mainly 4-methylmethoxybenzene.'),
];

export default questions;
