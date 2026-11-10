// Written by hand: haloalkanes, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(6, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['CH₃CH₂Br', 'Primary halide'], ['(CH₃)₂CHBr', 'Secondary halide'], ['(CH₃)₃CBr', 'Tertiary halide']]),
  match(A(4, 2), [['C₂H₅Br with aqueous KOH', 'Ethanol'], ['C₂H₅Br with alcoholic KOH', 'Ethene'], ['C₂H₅Br with KCN', 'Propanenitrile'], ['C₂H₅Br with AgCN', 'Ethyl isocyanide']]),
  match(A(3, 2), [['SN1', 'Goes through a carbocation'], ['SN2', 'Goes in one step, with inversion'], ['Elimination', 'Gives an alkene']]),
  match(A(4, 3), [['Wurtz reaction', 'Alkyl halide with sodium in dry ether'], ['Finkelstein reaction', 'Alkyl chloride with NaI in acetone'], ['Swarts reaction', 'Alkyl bromide with AgF'], ['Grignard reagent', 'Alkyl halide with magnesium in dry ether']]),
  match(A(3, 3), [['Optically active halide by SN1', 'Racemic mixture'], ['Optically active halide by SN2', 'Inverted product'], ['Chiral carbon', 'Four different groups']]),
];

export default questions;
