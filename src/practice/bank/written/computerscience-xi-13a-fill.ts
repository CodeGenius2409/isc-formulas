// Written by hand: trends in computing and ethical issues, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, tell, match, reason, short, ar } = kit('computerscience', 'XI');
const T = at(13, 'a');

const questions: BankDef[] = [
  predict(T(2, 1), 'A student copies an essay from a website and hands it in as their own work. Predict what this is called, and what may follow.', 'It is plagiarism, passing off someone else’s work as one’s own.', 'The work may get no marks or lead to action by the school; quoting with credit to the source avoids it.'),
  predict(T(2, 2), 'A caller on a video call claims to be a police officer, says the listener is under “digital arrest”, and demands money at once. Predict what this is, and what the listener should do.', 'It is a scam: the police don’t arrest anyone over a video call or ask for money that way.', 'The listener should end the call, pay nothing, and report it to the cyber crime helpline or police.'),
  predict(T(2, 2), 'All the smart devices in a home, such as cameras and door locks, still have their factory passwords. Predict a risk this brings.', 'Attackers who know the factory passwords can take control of the devices over the internet.', 'They could watch through the cameras or open the locks, so each password should be changed.'),

  odd(T(2, 1), ['phishing', 'spam', 'a digital arrest scam', 'netiquette'], 'netiquette', 'It means good conduct online; the others are online threats or nuisances.'),
  odd(T(2, 1), ['copyright', 'a patent', 'a trademark', 'a firewall'], 'a firewall', 'It is a security tool; the others are forms of intellectual property.'),
  odd(T(2, 2), ['a virtual reality game played in a headset', 'a smartwatch sending heart rate to a phone', 'a smart thermostat controlled from an app', 'a fitness band syncing its step count'], 'a virtual reality game played in a headset', 'It is virtual reality; the others are Internet of Things devices sharing data over a network.'),

  tell(T(2, 1), 'Distinguish between virtual reality and augmented reality.', 'Virtual reality places the user inside a world made wholly by the computer, usually through a headset.', 'Augmented reality lays computer images over the real world, as seen through a phone camera or glasses.'),
  tell(T(2, 1), 'Distinguish between spam and phishing.', 'Spam is unwanted bulk messages, often advertising, sent to many people.', 'Phishing is a fake message, made to look as if it comes from a trusted source, to trick people into giving passwords or bank details.'),
  tell(T(2, 2), 'Distinguish between free software, as the Free Software Foundation means it, and proprietary software.', 'Free software gives users the freedom to run, study, change and share it; “free” refers to freedom, not price.', 'Proprietary software is owned by a company that keeps its source code and limits how it may be used and copied.'),

  match(T(4, 1), [['Artificial intelligence', 'machines doing tasks that need human-like thinking'], ['The Internet of Things', 'everyday devices connected to the internet'], ['Virtual reality', 'a computer-made world the user seems to be inside'], ['Augmented reality', 'computer images laid over the real world']]),
  match(T(4, 1), [['Copyright', 'protects the expression of a work, such as program code'], ['A patent', 'protects a new invention'], ['The Free Software Foundation', 'promotes the freedom to run, study, share and change software'], ['A software licence', 'states how a program may be used']]),
  match(T(4, 1), [['Netiquette', 'good manners online'], ['Spam', 'unwanted bulk messages'], ['Phishing', 'fake messages that steal personal details'], ['A digital arrest scam', 'a false threat of arrest over a video call']]),

  reason(T(2, 1), 'Why should a different, strong password be used for each account?', 'A strong password is hard to guess or crack.', 'If one password is stolen, the other accounts stay safe because their passwords are different.'),
  reason(T(2, 1), 'Why does software copyright matter to programmers?', 'It protects their code from being copied and sold by others without permission.', 'So they can earn from their work and decide how it is shared.'),
  reason(T(2, 2), 'Why do Internet of Things devices raise privacy concerns?', 'They collect data about people’s homes, health and habits, and send it over the internet.', 'If the data is leaked or misused, it can reveal private details of people’s lives.'),

  short(T(2, 1), 'Give two rules of netiquette.', 'Be polite, and don’t write in capital letters, which reads as shouting.', 'Respect others’ privacy: don’t share their messages or photos without permission.'),
  short(T(2, 1), 'Give two uses of artificial intelligence in daily life.', 'Voice assistants that answer spoken questions.', 'Apps that suggest videos, products or routes based on what a person has done before.'),
  short(T(2, 2), 'State the four freedoms that free software gives its users.', 'To run the program for any purpose, and to study how it works and change it.', 'To give copies to others, and to share copies of changed versions.'),

  ar(T(1, 1), 'Phishing emails often seem to come from a bank.', 'They try to win the reader’s trust, so the reader gives away personal details.', 1, 'Looking like a bank makes people more likely to trust the message.'),
  ar(T(1, 1), 'Augmented reality replaces the real world with one made wholly by the computer.', 'Virtual reality places the user in a computer-made world.', 4, 'Augmented reality adds images to the real world; it is virtual reality that replaces it.'),
  ar(T(1, 1), 'A patent protects an invention.', 'Copyright lasts for many years.', 2, 'Both are true, but how long copyright lasts has nothing to do with what a patent protects.'),
];

export default questions;
