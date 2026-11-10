// Written by hand: trends in computing and ethics, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('computerscience', 'XI');
const A = at(13, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on ethics in computing.\n(i) What is plagiarism? Give one way to avoid it in a school project. [2]\n(ii) Distinguish between freeware and open source software. [2]\n(iii) State what a software licence does. [1]', ['(i) Presenting someone else’s work as your own.', '(i) Cite your sources, or write it in your own words.', '(ii) Freeware costs nothing, but its source code usually stays closed.', '(ii) Open source software lets anyone read and change its source code.', '(iii) It sets out what a user may and may not do with the software.']),
  long(A(5, 2), 'A school keeps its students’ marks and health records online. Answer each part.\n(i) Name two ways the data could be misused if it were leaked. [2]\n(ii) State two technical steps that would protect it. [2]\n(iii) Why does the school need its students’ or parents’ consent to share it? [1]', ['(i) Identity theft, or fraud using personal details.', '(i) Discrimination or embarrassment from private health details.', '(ii) Strong passwords and access limited to those who need it.', '(ii) Encryption of the data, and regular backups or updates.', '(iii) The data belongs to the people it describes, and they have a right to privacy.']),
  long(A(5, 2), 'Answer each part on current trends.\n(i) What does cloud computing offer a small business, and what is one risk? [2]\n(ii) What is the difference between artificial intelligence and machine learning? [2]\n(iii) Give one way an AI system can be unfair. [1]', ['(i) It can rent computing and storage as needed, with no hardware to buy.', '(i) It relies on the provider and on a connection, or has less control of its data.', '(ii) Artificial intelligence is the wider aim of machines doing tasks that seem to need intelligence.', '(ii) Machine learning is one way to do that, in which a system learns patterns from data.', '(iii) If it learns from biased data, it can treat some groups worse.']),
];

export default questions;
