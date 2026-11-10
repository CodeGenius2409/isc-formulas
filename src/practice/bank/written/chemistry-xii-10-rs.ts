// Written by hand: biomolecules, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('chemistry', 'XII');
const A = at(10, 'a');
const B = at(10, 'b');
const C = at(10, 'c');
const D = at(10, 'd');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does glucose give a silver mirror, while sucrose doesn’t?', 'Glucose has a free aldehyde group, and sucrose has no free reducing group.'),
  reason(A(2, 2), 'Why is sucrose called invert sugar after hydrolysis?', 'Its solution rotates plane-polarised light to the right.', 'After hydrolysis, it rotates it to the left, as fructose’s rotation outweighs that of glucose.'),
  reason(A(2, 2), 'Why do humans digest starch but not cellulose?', 'Starch has α-glycosidic links, which our enzymes can break.', 'Cellulose has β-links, which they can’t.'),
  reason(A(2, 3), 'Why is glucose said to have a ring structure, though it reacts with HCN as an open chain?', 'It doesn’t give Schiff’s test, and its pentaacetate has no free aldehyde.', 'A small amount of open chain is in equilibrium with the ring, and that reacts.'),
  reason(A(1, 2), 'Why is glucose a reducing sugar, even though it exists mostly as a ring?', 'The ring opens readily, which gives a free aldehyde group.'),
  short(A(2, 1), 'Classify glucose and fructose as aldoses or ketoses, and give the number of carbons in each.', 'Glucose is an aldose and fructose is a ketose.', 'Each has six carbons.'),
  short(A(2, 2), 'Name the two monosaccharides that make each of sucrose and lactose.', 'Sucrose: glucose and fructose.', 'Lactose: glucose and galactose.'),
  short(A(3, 2), 'State where each is found, and what its job is: starch, glycogen, cellulose.', 'Starch: in plants, as a food store.', 'Glycogen: in animals’ liver and muscle, as a food store.', 'Cellulose: in plants’ cell walls, for structure.'),
  short(A(3, 3), 'Give the products when glucose reacts with each: bromine water; HI on long heating; nitric acid.', 'Gluconic acid.', 'n-hexane.', 'Saccharic acid.'),
  reason(B(1, 1), 'Why does an amino acid behave as both an acid and a base?', 'It has a –COOH group and an –NH₂ group, so it exists as a zwitterion.'),
  reason(B(2, 2), 'Why does boiling an egg harden its white?', 'Heat breaks the hydrogen bonds that hold the protein’s shape.', 'This denaturation is permanent, so it can’t go back.'),
  reason(B(2, 2), 'Why are amino acids solids with high melting points?', 'They exist as dipolar ions, called zwitterions.', 'The ions are held by strong attractions in the solid.'),
  reason(B(2, 3), 'Why are enzymes so specific?', 'Each active site fits only a certain shape of substrate.', 'So an enzyme usually catalyses just one reaction, or one kind.'),
  reason(B(1, 2), 'Why isn’t a protein’s primary structure changed by denaturation?', 'Only its weak forces are broken, and the peptide bonds stay whole.'),
  short(B(2, 1), 'What is a peptide bond? Write it.', 'The link between –COOH and –NH₂ of two amino acids.', '–CO–NH–.'),
  tell(B(2, 2), 'Distinguish between essential and non-essential amino acids, with an example of each.', 'Essential ones can’t be made in the body, as with lysine.', 'Non-essential ones can, as with glycine.'),
  short(B(3, 2), 'Name what holds the primary, secondary and tertiary structures of a protein.', 'Primary: peptide bonds.', 'Secondary: hydrogen bonds.', 'Tertiary: disulphide bridges, hydrogen bonds and other side-chain forces.'),
  short(B(3, 3), 'What is the difference between α-helix and β-pleated sheet? State one difference between fibrous and globular proteins too.', 'An α-helix is a coil, held by hydrogen bonds within a chain.', 'A β-sheet has chains side by side, held by bonds between them.', 'Fibrous proteins are long and insoluble, and globular ones are round and soluble.'),
  reason(C(1, 1), 'Why does vitamin C have to be eaten every day, while vitamin A doesn’t?', 'It dissolves in water and leaves in urine, so it can’t be stored, unlike vitamin A.'),
  reason(C(2, 2), 'Why are excess fat-soluble vitamins harmful, though excess vitamin C is usually not?', 'Fat-soluble vitamins are stored in the liver and fat, so they can build up.', 'Water-soluble ones are removed in urine.'),
  reason(C(2, 3), 'Why are vitamins described as accessory food factors?', 'They are needed in only small amounts for normal growth.', 'They mostly can’t be made in the body, and they give no energy themselves.'),
  reason(C(1, 2), 'Why can vitamin C be lost by boiling vegetables for long?', 'It dissolves in water, and heat breaks it down.'),
  short(C(2, 1), 'Name one deficiency disease for each: vitamin A and vitamin D.', 'Vitamin A: night blindness.', 'Vitamin D: rickets.'),
  short(C(2, 2), 'Classify as fat-soluble or water-soluble: vitamin A, vitamin B₁, vitamin C, vitamin K.', 'Fat-soluble: A and K.', 'Water-soluble: B₁ and C.'),
  short(C(3, 2), 'Name the deficiency disease for each: vitamin B₁, vitamin C, vitamin K.', 'Beri-beri.', 'Scurvy.', 'Blood takes too long to clot.'),
  short(C(3, 3), 'Name one natural source each for vitamins A, C and D.', 'A: carrots or fish liver oil.', 'C: citrus fruit.', 'D: sunlight on skin, or fish oil.'),
  reason(D(1, 1), 'Why is DNA described as a double helix?', 'Two strands wind around each other, held by hydrogen bonds between their bases.'),
  reason(D(2, 2), 'Why do adenine and thymine always appear in equal amounts in DNA?', 'Adenine pairs only with thymine.', 'The same goes for guanine and cytosine.'),
  reason(D(2, 2), 'Why is RNA less stable than DNA?', 'Ribose has a –OH group at C-2, which can attack the phosphate.', 'DNA’s deoxyribose lacks it.'),
  reason(D(1, 2), 'Why is base pairing important when DNA copies itself?', 'Each strand can act as a template, which fixes the order of bases on the new strand.'),
  reason(D(2, 3), 'Why does a G–C pair hold together more firmly than an A–T pair?', 'A G–C pair has three hydrogen bonds.', 'An A–T pair has only two.'),
  short(D(2, 1), 'What are the three parts of a nucleotide?', 'A base and a pentose sugar.', 'A phosphate group.'),
  short(D(2, 2), 'State two differences between DNA and RNA.', 'DNA has deoxyribose, and RNA has ribose.', 'DNA has thymine, and RNA has uracil.'),
  tell(D(3, 2), 'Distinguish between a nucleoside and a nucleotide, and name the link joining nucleotides.', 'A nucleoside is a base with a sugar.', 'A nucleotide also has a phosphate.', 'Phosphodiester links join them.'),
  short(D(3, 3), 'What does each of these do: DNA, mRNA and tRNA?', 'DNA holds genetic information.', 'mRNA carries the code to the ribosome.', 'tRNA brings each amino acid to its place.'),
];

export default questions;
