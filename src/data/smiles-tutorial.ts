// The SMILES guide, written fresh for the editor. Every example and answer is checked by tests/unit/smiles-guide.test.ts.

export interface TryIt {
  ask: string;
  answer: string;
  /** Shown one at a time after each wrong try. */
  hints: string[];
}

export interface GuideExample {
  label: string;
  smiles: string;
}

export interface GuideStep {
  title: string;
  /** One or two short paragraphs. */
  explain: string[];
  /** What the box starts with. It can be edited. */
  example: string;
  /** Others to load with one press. */
  more: GuideExample[];
  tryIt?: TryIt;
}

export const GUIDE: GuideStep[] = [
  {
    title: 'Atoms and hidden hydrogens',
    explain: [
      'Each capital letter is an atom, and letters side by side are bonded to each other. You leave the hydrogens out: SMILES adds as many as each atom needs.',
      'So C is methane, CC is ethane, and CCO is ethanol. Change the example and watch the formula underneath.',
    ],
    example: 'CCO',
    more: [
      { label: 'Methane', smiles: 'C' },
      { label: 'Ethane', smiles: 'CC' },
      { label: 'Methoxymethane', smiles: 'COC' },
    ],
    tryIt: { ask: 'Write the SMILES for propan-1-ol.', answer: 'CCCO', hints: ['It has three carbons in a row.', 'The oxygen goes on the end, after the third carbon.'] },
  },
  {
    title: 'Double and triple bonds',
    explain: ['A single bond needs no symbol. Write = for a double bond and # for a triple bond, between the two atoms it joins.'],
    example: 'CC=O',
    more: [
      { label: 'Ethene', smiles: 'C=C' },
      { label: 'Ethyne', smiles: 'C#C' },
      { label: 'Ethanenitrile', smiles: 'CC#N' },
    ],
    tryIt: { ask: 'Write the SMILES for propene.', answer: 'CC=C', hints: ['Propene has three carbons and one double bond.', 'Put the = between the second and third carbons.'] },
  },
  {
    title: 'Branches in brackets',
    explain: ['A branch goes in round brackets straight after the atom it hangs from. The chain then carries on from that same atom.', 'CC(C)C has a three-carbon chain with a methyl on the middle carbon, which is 2-methylpropane. An atom can have more than one branch.'],
    example: 'CC(C)C',
    more: [
      { label: 'Propan-2-ol', smiles: 'CC(O)C' },
      { label: 'Ethanoic acid', smiles: 'CC(=O)O' },
      { label: 'Trichloromethane', smiles: 'ClC(Cl)Cl' },
    ],
    tryIt: { ask: 'Write the SMILES for 2-methylpropan-2-ol.', answer: 'CC(C)(C)O', hints: ['The middle carbon has three methyl groups and one –OH.', 'Try C, then C with two branches of (C), then the O.'] },
  },
  {
    title: 'Rings, with closure numbers',
    explain: [
      'To make a ring, write a number on two atoms. The number means those two are bonded, closing the ring. Any digit works, as long as the two match.',
      'To find the ring size, count every atom from the first number to the second, including both. C1CCCCC1 has six, so it is cyclohexane.',
    ],
    example: 'C1CCCCC1',
    more: [
      { label: 'Cyclopropane', smiles: 'C1CC1' },
      { label: 'Cyclohexene', smiles: 'C1=CCCCC1' },
      { label: 'Methylcyclohexane', smiles: 'CC1CCCCC1' },
    ],
    tryIt: { ask: 'Write the SMILES for cyclopentane.', answer: 'C1CCCC1', hints: ['A five-membered ring needs five carbons in all.', 'The first carbon and the fifth carbon both carry the number 1.'] },
  },
  {
    title: 'Aromatic rings in lowercase',
    explain: ['Lowercase letters mean aromatic atoms, and SMILES works out the alternating double bonds for you. So c1ccccc1 is benzene.', 'The Kekulé form with the double bonds written out, C1=CC=CC=C1, is the same compound, and any correct form is accepted here.'],
    example: 'c1ccccc1',
    more: [
      { label: 'Benzene, Kekulé form', smiles: 'C1=CC=CC=C1' },
      { label: 'Phenol', smiles: 'Oc1ccccc1' },
      { label: 'Pyridine', smiles: 'n1ccccc1' },
    ],
    tryIt: { ask: 'Write the SMILES for toluene.', answer: 'Cc1ccccc1', hints: ['Toluene is a benzene ring with one methyl group.', 'Put one capital C in front of the benzene ring from the example.'] },
  },
  {
    title: 'Ortho, meta and para',
    explain: [
      'Walk round the ring from the atom with the first group. A second group on the next atom is ortho, two atoms along is meta, and three along is para.',
      'The three nitrophenols below differ only in where the nitro group sits, so they share a molecular formula. Load each one and compare the drawings.',
    ],
    example: 'Oc1ccc(cc1)[N+](=O)[O-]',
    more: [
      { label: '2-Nitrophenol (ortho)', smiles: 'Oc1ccccc1[N+](=O)[O-]' },
      { label: '3-Nitrophenol (meta)', smiles: 'Oc1cccc(c1)[N+](=O)[O-]' },
      { label: '4-Nitrophenol (para)', smiles: 'Oc1ccc(cc1)[N+](=O)[O-]' },
    ],
    tryIt: { ask: 'Write the SMILES for 4-chlorotoluene, with methyl and chlorine para to each other.', answer: 'Cc1ccc(Cl)cc1', hints: ['Start with the methyl on the first ring atom: Cc1', 'Walk three atoms along the ring and put (Cl) on that one, then finish the ring.'] },
  },
  {
    title: 'Charges and square brackets',
    explain: ['Anything unusual goes in square brackets: a charge, a metal, or a set number of hydrogens. Inside them nothing is added for you, so you say how many hydrogens there are.', 'A nitro group is written [N+](=O)[O-], with the charges shown. [NH4+] is the ammonium ion, and [O-] is an oxygen with a negative charge.'],
    example: 'C[N+](=O)[O-]',
    more: [
      { label: 'Ammonium ion', smiles: '[NH4+]' },
      { label: 'Hydroxide ion', smiles: '[OH-]' },
      { label: 'Sodium ion', smiles: '[Na+]' },
    ],
    tryIt: { ask: 'Write the SMILES for the ethanoate ion, CH₃COO⁻.', answer: 'CC(=O)[O-]', hints: ['Start from ethanoic acid, CC(=O)O.', 'The last oxygen has lost its hydrogen, so write it as [O-].'] },
  },
  {
    title: 'Fused and several rings',
    explain: ['Use a new number for each ring. Two rings that share an edge each need their own, as in naphthalene: the number 2 opens and closes the second ring.', 'Numbers can be used again once they have closed. After 9, write a percent sign and two digits, like %10.'],
    example: 'c1ccc2ccccc2c1',
    more: [
      { label: 'Biphenyl', smiles: 'c1ccc(cc1)-c1ccccc1' },
      { label: 'Anthracene', smiles: 'c1ccc2cc3ccccc3cc2c1' },
      { label: 'Cyclohexane, with %10', smiles: 'C%10CCCCC%10' },
    ],
    tryIt: { ask: 'Write the SMILES for naphthalene, without looking at the example.', answer: 'c1ccc2ccccc2c1', hints: ['Naphthalene is ten aromatic carbons in two rings that share an edge.', 'Four atoms of the first ring, then open ring 2, go round four more, close ring 2, and close ring 1.'] },
  },
  {
    title: 'Reactions',
    explain: ['A reaction is reactants>>products. Separate compounds on the same side with a dot.', 'Each compound is drawn on its own, and the formulas are listed so you can check the atoms balance. SMILES has no place for a coefficient.'],
    example: 'CCO>>CC=O',
    more: [
      { label: 'Ethene and water', smiles: 'C=C.O>>CCO' },
      { label: 'Making an ester', smiles: 'CC(=O)O.CCO>>CC(=O)OCC.O' },
    ],
    tryIt: { ask: 'Write the reaction of ethene with bromine to give 1,2-dibromoethane.', answer: 'C=C.BrBr>>BrCCBr', hints: ['Two compounds on the left, joined by a dot: ethene and bromine.', 'Bromine is BrBr, and the product is BrCCBr.'] },
  },
];

/** The cheat sheet: what each symbol means, in a line. */
export const CHEAT_SHEET: { symbol: string; means: string }[] = [
  { symbol: 'C N O P S F Cl Br I', means: 'Atoms. Hydrogens are added for you' },
  { symbol: 'CC', means: 'Side by side means bonded' },
  { symbol: '=  #', means: 'Double bond, triple bond' },
  { symbol: '( )', means: 'A branch on the atom before it' },
  { symbol: '1 … 1', means: 'These two atoms close a ring' },
  { symbol: '%10', means: 'Ring number above 9' },
  { symbol: 'c n o s', means: 'Lowercase: aromatic atoms' },
  { symbol: '[NH4+]', means: 'Square brackets: element, hydrogens, charge' },
  { symbol: '[O-]  [N+]', means: 'Charged atoms' },
  { symbol: '.', means: 'Separate compounds, not bonded' },
  { symbol: '>>', means: 'Reactants on the left, products on the right' },
];
