// Written by hand: alcohols, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Primary alcohol, oxidised', 'Aldehyde, then acid'], ['Secondary alcohol, oxidised', 'Ketone'], ['Tertiary alcohol', 'Resists mild oxidation']]),
  match(A(4, 2), [['Lucas test, tertiary alcohol', 'Turbid at once'], ['Lucas test, secondary alcohol', 'Turbid in about five minutes'], ['Lucas test, primary alcohol', 'No turbidity at room temperature'], ['Lucas reagent', 'Concentrated HCl with ZnCl₂']]),
  match(A(3, 2), [['Ethanol with concentrated H₂SO₄ at 443 K', 'Ethene'], ['Ethanol with sodium', 'Hydrogen gas'], ['Ethanol with ethanoic acid and a little acid', 'Ethyl ethanoate']]),
  match(A(4, 3), [['Methanal with a Grignard reagent', 'Primary alcohol'], ['Ethanal with a Grignard reagent', 'Secondary alcohol'], ['Propanone with a Grignard reagent', 'Tertiary alcohol'], ['Hydroboration–oxidation of propene', 'Propan-1-ol']]),
  match(A(3, 3), [['Methanol', 'Poisonous, can cause blindness'], ['Ethanol', 'Made by fermenting sugars'], ['Glycerol', 'Has three –OH groups']]),
];

export default questions;
