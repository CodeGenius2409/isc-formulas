// Written by hand: proteins, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const P = at(10, 'b');

/** A coil drawn from the side, as a sine running down the page. */
const helix: [number, number][] = Array.from({ length: 61 }, (_, i) => [Math.round((70 + 30 * Math.sin((i * Math.PI) / 7.5)) * 10) / 10, 20 + 2 * i]);

const questions: BankDef[] = [
  figure(P(2, 1), 'Draw the general structure of an α-amino acid, and label the amino group, the carboxyl group and the side chain.', ['A central carbon bonded to H, to –NH₂, to –COOH and to a group R.', 'The –NH₂ is the amino group, the –COOH the carboxyl group, and R the side chain, which differs from one amino acid to another.'], {
    answer: sketch(300, 175, 'A central carbon atom, with a hydrogen above it, an amino group H₂N on the left, a carboxyl group COOH on the right and a side chain R below. The amino group, the carboxyl group and the side chain are each labelled.', [
      label(150, 95, 'C'), line([[150, 80], [150, 54]]), label(150, 46, 'H'),
      line([[138, 90], [100, 90]]), label(84, 95, 'H₂N'), label(84, 116, 'amino group'),
      line([[162, 90], [196, 90]]), label(222, 95, 'COOH'), label(222, 116, 'carboxyl group'),
      line([[150, 102], [150, 130]]), label(150, 146, 'R'), label(162, 162, 'side chain', 'start'),
    ]),
  }),
  figure(P(3, 2), 'Draw simple sketches of an α-helix and a β-pleated sheet, and say what holds each in shape.', ['The α-helix is one chain coiled like a spring.', 'It is held by hydrogen bonds between the C=O of one amino acid and the N–H of one about four places along the same chain.', 'In a β-pleated sheet, chains lie side by side, zig-zagged, held by hydrogen bonds between neighbouring chains.'], {
    answer: sketch(320, 180, 'On the left, a single chain coiled like a spring, with dotted hydrogen bonds joining one turn to the next. On the right, two zig-zag chains side by side, joined by dotted hydrogen bonds between them.', [
      line(helix), ...[0, 1, 2, 3].map((k) => line([[100, 32 + 30 * k], [100, 54 + 30 * k]], { dash: 1 })),
      line([[180, 50], [195, 60], [210, 50], [225, 60], [240, 50], [255, 60], [270, 50], [285, 60], [300, 50]]),
      line([[180, 110], [195, 100], [210, 110], [225, 100], [240, 110], [255, 100], [270, 110], [285, 100], [300, 110]]),
      ...[195, 225, 255, 285].map((x) => line([[x, 63], [x, 97]], { dash: 1 })),
      label(70, 172, 'α-helix'), label(240, 140, 'β-pleated sheet'),
    ]),
  }),
  figure(P(2, 2), 'The graph shows how the activity of an enzyme changes with temperature. Read off its best temperature, and explain why its activity falls so sharply above it.', ['The activity is greatest at about 37 °C.', 'Above it the enzyme, a protein, is denatured: it loses its shape, and its active site no longer fits the substrate.'], {
    shown: graph('temperature (°C)', 'enzyme activity', [{ points: [[0, 5], [10, 15], [20, 35], [30, 65], [37, 100], [42, 80], [50, 25], [60, 3]] }], { x: [[37, '37']] }),
  }),

  predict(P(2, 2), 'Predict the form glycine takes in a strongly acidic solution and in a strongly basic solution.', 'In strong acid it takes up a proton: H₃N⁺CH₂COOH, a cation.', 'In strong base it loses one: H₂NCH₂COO⁻, an anion.'),
  predict(P(2, 1), 'Glycine and alanine are joined by a single peptide bond. Predict how many different dipeptides can form, and name them.', 'Two, depending on which amino acid keeps its free –NH₂ group.', 'Glycylalanine (Gly–Ala) and alanylglycine (Ala–Gly).'),
  predict(P(2, 3), 'A protein made of four polypeptide chains, such as haemoglobin, is treated so that the forces between its chains break. Predict which level of structure is lost, and whether the protein still does its job.', 'Its quaternary structure, the way the chains fit together.', 'It no longer works properly, as its function depends on the chains’ arrangement.'),

  odd(P(2, 1), ['glycine', 'alanine', 'valine', 'glucose'], 'glucose', 'It is a carbohydrate; the others are amino acids.'),
  odd(P(2, 2), ['keratin', 'collagen', 'myosin', 'insulin'], 'insulin', 'It is a globular protein, a hormone; the others are fibrous proteins.'),
  odd(P(2, 2), ['hydrogen bonds', 'disulphide bonds', 'peptide bonds', 'ionic interactions'], 'peptide bonds', 'They join the amino acids into the chain, its primary structure; the others hold the chain in its folded shape.'),

  long(P(5, 2), 'Answer each part on the structure of proteins.\n(a) What is meant by the primary structure? [1]\n(b) Describe the two kinds of secondary structure. [2]\n(c) What is the tertiary structure? [1]\n(d) What is the quaternary structure? Give an example. [1]', '(a) The order in which the amino acids are joined in the chain.', '(b) The α-helix: a chain coiled like a spring, held by hydrogen bonds within the chain.', '(b) The β-pleated sheet: chains side by side, held by hydrogen bonds between them.', '(c) The overall folding of the whole chain, held by interactions between side chains such as disulphide bridges.', '(d) How separate chains fit together, as the four chains of haemoglobin.'),
  long(P(5, 2), 'Answer each part on amino acids.\n(a) Classify amino acids as neutral, acidic and basic, giving an example of each. [3]\n(b) What is the isoelectric point of an amino acid? [1]\n(c) Which configuration, D or L, do the natural α-amino acids have? [1]', '(a) Neutral: one –NH₂ and one –COOH, as glycine.', '(a) Acidic: an extra –COOH, as glutamic acid.', '(a) Basic: an extra –NH₂, as lysine.', '(b) The pH at which it exists as a zwitter ion and doesn’t move in an electric field.', '(c) L.'),
  long(P(5, 1), 'Answer each part on hormones.\n(a) What is a hormone? [1]\n(b) Name a protein hormone and a steroid hormone, with the job of each. [2]\n(c) Why does too little insulin lead to a high level of sugar in the blood? [2]', '(a) A chemical messenger, made by a gland in small amounts and carried in the blood to where it acts.', '(b) Insulin, a protein: it lowers the level of glucose in the blood.', '(b) Testosterone or oestrogen, steroids: they control the development of the sexual characteristics.', '(c) Insulin lets cells take up glucose from the blood, and the liver store it.', '(c) Without enough of it, glucose stays in the blood, as in diabetes.'),

  tell(P(2, 1), 'Distinguish between a dipeptide and a polypeptide.', 'A dipeptide is two amino acids joined by one peptide bond.', 'A polypeptide is a long chain of many amino acids joined by many peptide bonds.'),
  tell(P(2, 2), 'Distinguish between the denaturation and the hydrolysis of a protein.', 'Denaturation destroys the protein’s folded shape, its secondary and tertiary structure, but leaves the peptide bonds.', 'Hydrolysis breaks the peptide bonds, giving the separate amino acids.'),

  match(P(4, 1), [['Haemoglobin', 'carries oxygen in the blood'], ['Insulin', 'controls the level of blood sugar'], ['Keratin', 'makes up hair and nails'], ['Pepsin', 'digests proteins in the stomach']]),
  match(P(4, 2), [['Glycine', 'neutral and optically inactive'], ['Alanine', 'neutral and optically active'], ['Lysine', 'basic'], ['Glutamic acid', 'acidic']]),
  match(P(4, 1), [['A peptide bond', 'the –CO–NH– link between amino acids'], ['An α-helix', 'a coil held by hydrogen bonds within one chain'], ['A β-pleated sheet', 'chains side by side, held by hydrogen bonds between them'], ['Denaturation', 'the loss of a protein’s shape and its function']]),

  ar(P(1, 2), 'A protein loses its biological activity when it is denatured.', 'Denaturation destroys the secondary and tertiary structure, while the peptide bonds remain.', 1, 'A protein’s activity depends on its folded shape.'),
  ar(P(1, 1), 'Insulin is a protein hormone.', 'Insulin is made in the pancreas.', 2, 'Both are true, but where it is made doesn’t explain what kind of molecule it is.'),
  ar(P(1, 1), 'Hydrolysis of a protein gives fatty acids.', 'Proteins are polymers of α-amino acids.', 4, 'Hydrolysis gives α-amino acids; fatty acids come from fats.'),
];

export default questions;
