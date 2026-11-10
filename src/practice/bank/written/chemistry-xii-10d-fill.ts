// Written by hand: nucleic acids, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const N = at(10, 'd');

/** Two strands as sine curves half a turn apart, crossing every 80 px, with base-pair rungs between them. */
const strand = (phase: number) => {
  const pts: string[] = [];
  for (let x = 20; x <= 300; x += 5) pts.push(`${x} ${Math.round((80 + 40 * Math.sin(((x - 20) * Math.PI) / 80 + phase)) * 10) / 10}`);
  return { t: 'path' as const, d: `M${pts.join(' L')}` };
};
const rungs = [30, 45, 60, 75, 115, 130, 145, 160, 190, 205, 220, 235, 275, 290].map((x) => {
  const s = 40 * Math.sin(((x - 20) * Math.PI) / 80);
  return line([[x, Math.round((80 + s) * 10) / 10], [x, Math.round((80 - s) * 10) / 10]]);
});

/** One strand's bases on the left, and the other strand's on the right, as given. */
const pairs = (right: string[]) => [
  line([[60, 20], [60, 160]]), line([[200, 20], [200, 160]]),
  ...['A', 'G', 'C', 'T', 'T'].flatMap((b, i) => [line([[60, 30 + i * 30], [100, 30 + i * 30]]), label(110, 34 + i * 30, b, 'start'), line([[160, 30 + i * 30], [200, 30 + i * 30]]), label(150, 34 + i * 30, right[i], 'end')]),
];

const questions: BankDef[] = [
  figure(N(2, 1), 'Draw a simple diagram of a nucleotide, naming its three parts and showing how they are joined.', ['A pentose sugar in the middle, with a nitrogenous base joined to its C-1′.', 'A phosphate group joined to the sugar’s C-5′, through an ester link.'], {
    answer: sketch(320, 130, 'A pentagon in the middle stands for the pentose sugar. A bond on its right, from C-1′, goes to a box labelled base. A bond on its left, from C-5′, goes to a circle labelled phosphate.', [
      { t: 'circle', x: 48, y: 65, r: 38 }, label(48, 69, 'phosphate'),
      line([[86, 65], [122, 65]]), label(104, 84, 'C-5′'),
      { t: 'path', d: 'M160 30 L198 58 L184 102 L136 102 L122 58 Z' }, label(160, 74, 'sugar'),
      line([[198, 65], [232, 65]]), label(215, 84, 'C-1′'),
      { t: 'box', x: 232, y: 45, w: 76, h: 40 }, label(270, 69, 'base'),
    ]),
  }),
  figure(N(2, 2), 'The figure shows five bases on one strand of a stretch of DNA. Write the bases on the other strand, and find the number of hydrogen bonds holding the stretch together.', ['The other strand reads T, C, G, A, A, as A pairs with T and G with C.', 'A–T pairs have two hydrogen bonds and G–C pairs three: 2 + 3 + 3 + 2 + 2 = 12.'], {
    shown: sketch(260, 180, 'Two vertical strands. The left strand carries the bases A, G, C, T and T from top to bottom. Each faces a question mark on the right strand.', pairs(['?', '?', '?', '?', '?'])),
    answer: sketch(260, 180, 'The same two strands, with the right strand carrying T, C, G, A and A opposite A, G, C, T and T.', pairs(['T', 'C', 'G', 'A', 'A'])),
  }),
  figure(N(2, 2), 'Sketch the double helix of DNA, labelling the sugar–phosphate backbones and the base pairs.', ['Two sugar–phosphate strands wind round one axis, as a double helix.', 'Base pairs, A with T and G with C, join the strands like the rungs of a twisted ladder, held by hydrogen bonds.'], {
    answer: sketch(320, 170, 'Two wavy strands cross each other over and over along a horizontal axis, like a twisted ladder. Short vertical rungs join them between the crossings. One strand is labelled sugar–phosphate backbone and a rung is labelled base pair.', [
      strand(0), strand(Math.PI), ...rungs,
      label(120, 160, 'sugar–phosphate backbone'), line([[76, 148], [62, 124]], { arrow: 1 }), label(270, 22, 'base pair'), line([[262, 28], [237, 58]], { arrow: 1 }),
    ]),
  }),

  predict(N(2, 1), 'A sample of DNA contains 35% thymine. Predict the percentages of adenine, guanine and cytosine.', 'Adenine is 35%, as every thymine pairs with an adenine.', 'Guanine and cytosine make up the other 30%, in equal amounts: 15% each.'),
  predict(N(2, 2), 'A sample of RNA is hydrolysed completely. Predict the products.', 'The sugar ribose and phosphoric acid.', 'The four bases adenine, guanine, cytosine and uracil.'),
  predict(N(2, 2), 'A cell could no longer make ribosomal RNA. Predict the effect on the cell, and why.', 'It could no longer make proteins.', 'rRNA makes up much of the ribosomes, where amino acids are joined into proteins.'),

  odd(N(2, 1), ['thymine', 'cytosine', 'uracil', 'adenine'], 'adenine', 'It is a purine, with two rings; the others are pyrimidines, with one.'),
  odd(N(2, 1), ['2-deoxyribose', 'phosphate', 'thymine', 'uracil'], 'uracil', 'It isn’t found in DNA; the other three are parts of DNA.'),
  odd(N(2, 2), ['mRNA', 'tRNA', 'rRNA', 'DNA'], 'DNA', 'It is double-stranded and keeps the genetic code; the others are single-stranded RNAs that make proteins.'),

  long(N(5, 1), 'Answer each part on DNA.\n(a) Name the sugar and the four bases in DNA. [2]\n(b) What holds its two strands together, and why does adenine pair only with thymine? [2]\n(c) Where in the cell is most DNA found? [1]', '(a) The sugar is 2-deoxyribose.', '(a) The bases are adenine, guanine, cytosine and thymine.', '(b) Hydrogen bonds between the bases on the two strands.', '(b) A purine must pair with a pyrimidine to fit the gap, and only A and T line up to make two hydrogen bonds.', '(c) In the nucleus, in the chromosomes.'),
  long(N(5, 2), 'Answer each part on replication.\n(a) What is meant by replication of DNA? [1]\n(b) How does base pairing let a DNA molecule make two copies of itself? [2]\n(c) A sample of DNA has 22% guanine. Find the percentage of each other base. [2]', '(a) The copying of a DNA molecule to make two identical molecules, before a cell divides.', '(b) The two strands separate, and each acts as a pattern on which a new strand is built.', '(b) As A pairs only with T and G only with C, each new strand matches the old one it pairs with, so both molecules are copies of the first.', '(c) Cytosine is 22%, the same as guanine.', '(c) Adenine and thymine are 28% each, sharing the other 56% equally.'),
  long(N(5, 2), 'Answer each part on the chain of a nucleic acid.\n(a) What is a phosphodiester link, and which carbon atoms of the sugars does it join? [2]\n(b) What is the difference between the 5′ end and the 3′ end of a strand? [2]\n(c) Why is a nucleic acid called a polynucleotide? [1]', '(a) A phosphate group joined by ester links to two sugars, linking one nucleotide to the next.', '(a) It joins C-3′ of one sugar to C-5′ of the next.', '(b) At the 5′ end, the last sugar’s C-5′ carries a phosphate not joined to another nucleotide.', '(b) At the 3′ end, the last sugar’s C-3′ carries a free OH group.', '(c) It is a long chain of many nucleotides joined by phosphodiester links.'),

  tell(N(2, 2), 'Distinguish between messenger RNA and transfer RNA.', 'Messenger RNA carries a copy of the code of a gene from the DNA to the ribosome.', 'Transfer RNA is a small molecule that brings one kind of amino acid to the ribosome and puts it where the code asks for it.'),

  match(N(4, 1), [['Adenine', 'a purine that pairs with thymine'], ['Guanine', 'a purine that pairs with cytosine'], ['Cytosine', 'a pyrimidine in both DNA and RNA'], ['Thymine', 'a pyrimidine found only in DNA']]),
  match(N(4, 2), [['A with T', 'two hydrogen bonds'], ['G with C', 'three hydrogen bonds'], ['Base to sugar', 'a bond to C-1′ of the sugar'], ['Sugar to phosphate', 'an ester link at C-5′']]),
  match(N(4, 1), [['Ribose', 'the sugar in RNA'], ['2-Deoxyribose', 'the sugar in DNA'], ['Uracil', 'a base found only in RNA'], ['Phosphoric acid', 'gives nucleic acids their acid nature']]),

  ar(N(1, 2), 'RNA is usually single-stranded.', 'RNA has uracil in place of thymine.', 2, 'Both are true, but having uracil isn’t what makes RNA single-stranded.'),
  ar(N(1, 1), 'The two strands of a DNA molecule have the same order of bases.', 'Each base on one strand pairs with a complementary base on the other.', 4, 'The strands are complementary, not the same: where one has A, the other has T.'),
  ar(N(1, 1), 'Nucleic acids are acids.', 'The phosphate groups in their chains can give up hydrogen ions.', 1, 'It is the phosphoric acid part that makes them acidic.'),
];

export default questions;
