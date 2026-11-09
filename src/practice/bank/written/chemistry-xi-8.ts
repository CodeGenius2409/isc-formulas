// Written by hand: Purification and analysis. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, theory } = bank('chemistry', 'XI');
const P = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [8, 'b', marks, d];

const questions: BankDef[] = [
  mcq(P(1, 2), 'Aniline is purified from a mixture with water by:', ['sublimation', 'steam distillation', 'crystallisation', 'filtration'], 1),
  mcq(P(1, 2), 'In Lassaigne’s test, nitrogen is detected as:', ['Prussian blue', 'a white precipitate', 'a violet colour', 'a yellow precipitate'], 0),
  mcq(P(1, 3), 'The sodium extract is boiled with dilute HNO₃ before testing for chloride with AgNO₃, because:', ['it colours the solution', 'it removes cyanide and sulphide, which would also give precipitates', 'it forms silver nitrate', 'it adds chloride'], 1),
  theory('reason', P(1, 2), 'Give a reason: Kjeldahl’s method can’t be used for nitro compounds.', ['Their nitrogen doesn’t change to ammonium sulphate when heated with concentrated H₂SO₄.']),
  theory('distinguish', P(2, 2), 'Distinguish between simple and fractional distillation.', ['Simple distillation separates liquids whose boiling points differ widely.', 'Fractional distillation uses a column, to separate liquids with close boiling points.']),
  theory('short', P(3, 3), 'On combustion, 0.30 g of an organic compound gives 0.44 g of CO₂ and 0.18 g of H₂O. Find the percentages of carbon and hydrogen.', ['Carbon: 0.44 × 12/44 = 0.12 g, which is 40%.', 'Hydrogen: 0.18 × 2/18 = 0.02 g.', 'Hydrogen is 6.7% of the compound.'], { format: 'numerical' }),
  theory('short', P(2, 2), 'A student sees a white precipitate with AgNO₃ on a sodium extract, without first boiling it with HNO₃, and says the compound has chlorine. Find the mistake.', ['Cyanide and sulphide ions in the extract also give precipitates.', 'The extract must first be boiled with dilute HNO₃, to remove them.'], { format: 'mistake' }),
];

export default questions;
