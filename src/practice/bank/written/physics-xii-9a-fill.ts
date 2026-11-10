// Written by hand: semiconductors and the p-n junction, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XII');
const S = at(9, 'a');

/** Silicon atoms on a 3 × 3 grid, 80 px apart, with the centre one named as given and bonds to its neighbours. */
const lattice = (centre: string) => [
  ...[60, 140, 220].flatMap((x) => [40, 110, 180].flatMap((y) => [label(x, y + 5, x === 140 && y === 110 ? centre : 'Si')])),
  ...[40, 110, 180].map((y) => line([[74, y], [126, y]])), ...[40, 110, 180].map((y) => line([[154, y], [206, y]])),
  ...[60, 140, 220].map((x) => line([[x, 50], [x, 96]])), ...[60, 140, 220].map((x) => line([[x, 120], [x, 166]])),
];

const questions: BankDef[] = [
  figure(S(2, 2), 'Draw the energy band diagram of an n-type semiconductor, showing where the donor level lies.', ['A valence band and a conduction band, with the band gap between them.', 'The donor level is drawn just below the conduction band, about 0.05 eV below it in silicon, so its electrons easily enter the conduction band.'], {
    answer: sketch(320, 190, 'Two shaded bands, the conduction band at the top and the valence band at the bottom, with a gap between them. A dashed line just below the conduction band is the donor level, with dots on it for electrons.', [
      { t: 'shade', p: [[40, 20], [220, 20], [220, 55], [40, 55]] }, { t: 'box', x: 40, y: 20, w: 180, h: 35 },
      { t: 'shade', p: [[40, 140], [220, 140], [220, 175], [40, 175]] }, { t: 'box', x: 40, y: 140, w: 180, h: 35 },
      line([[40, 70], [220, 70]], { dash: 1 }), ...[70, 110, 150, 190].map((x) => ({ t: 'dot' as const, x, y: 70 })),
      label(130, 42, 'conduction band'), label(130, 162, 'valence band'), label(228, 74, 'donor level', 'start'),
      arrow([24, 140], [24, 55]), label(16, 105, 'Eg', 'end'),
    ]),
  }),
  figure(S(3, 2), 'Draw a p-n junction just after it forms, showing the depletion region, the fixed ions on each side and the direction of the electric field across it.', ['Holes diffuse from p to n and electrons from n to p, and recombine near the junction.', 'This leaves fixed negative acceptor ions on the p side and fixed positive donor ions on the n side: the depletion region, with no free carriers.', 'The field across it points from the n side to the p side, setting up the barrier potential.'], {
    answer: sketch(320, 170, 'A bar with p on the left and n on the right. In the middle, a narrow depletion region is marked: minus signs for fixed ions on its p side and plus signs on its n side. An arrow below it, labelled E, points from the n side to the p side.', [
      { t: 'box', x: 20, y: 30, w: 280, h: 80 }, line([[120, 30], [120, 110]], { dash: 1 }), line([[200, 30], [200, 110]], { dash: 1 }), line([[160, 30], [160, 110]]),
      ...[50, 75, 100].flatMap((y) => [label(140, y, '−'), label(180, y, '+')]),
      label(65, 75, 'p'), label(255, 75, 'n'), label(160, 22, 'depletion region'),
      arrow([200, 130], [120, 130]), label(160, 150, 'E'),
    ]),
  }),
  figure(S(2, 2), 'Draw part of a silicon crystal in which one atom has been replaced by arsenic, showing what happens to arsenic’s fifth valence electron.', ['Arsenic forms four covalent bonds with its silicon neighbours, using four of its five valence electrons.', 'The fifth is only loosely held and becomes a free electron, so arsenic is a donor and the crystal is n-type.'], {
    answer: sketch(300, 200, 'A square grid of nine atoms joined by bonds. The centre atom is As and the rest are Si. A dot just beside the arsenic atom is its fifth electron, labelled free electron.', [
      ...lattice('As'), { t: 'dot', x: 180, y: 97 }, label(180, 68, 'free'), label(180, 84, 'electron'),
    ]),
  }),

  predict(S(2, 1), 'Pure silicon is doped with indium. Predict the kind of semiconductor formed, its majority carriers, and where the new energy level lies.', 'A p-type semiconductor, with holes as the majority carriers.', 'An acceptor level appears just above the valence band.'),
  predict(S(2, 3), 'A piece of n-type silicon is doped again, with boron atoms equal in number to its donor atoms. Predict how it now behaves, and why.', 'Each acceptor takes up the electron given by a donor.', 'So it has few extra carriers and behaves much like pure, intrinsic silicon.'),
  predict(S(2, 2), 'Germanium has a band gap of about 0.7 eV and silicon about 1.1 eV. Predict which has more free electrons when both are pure and at room temperature, and why.', 'Germanium.', 'Its smaller gap lets far more electrons gain enough thermal energy to cross into the conduction band.'),

  odd(S(2, 1), ['phosphorus', 'arsenic', 'antimony', 'boron'], 'boron', 'It is trivalent, an acceptor that makes p-type silicon; the others are pentavalent donors.'),
  odd(S(2, 1), ['silicon', 'germanium', 'gallium arsenide', 'diamond'], 'diamond', 'Its band gap, about 6 eV, makes it an insulator; the others are semiconductors.'),
  odd(S(2, 2), ['diffusion of majority carriers', 'drift of minority carriers', 'formation of a depletion region', 'doping with a donor'], 'doping with a donor', 'It is done before the junction is made; the other three happen as the junction forms.'),

  long(S(5, 2), 'Answer each part on semiconductors.\n(a) Using energy bands, describe pure silicon at 0 K and at room temperature. [2]\n(b) How does adding donor atoms change its conduction? Use the band picture. [2]\n(c) Name the charge carriers in a pure semiconductor, and compare their numbers. [1]', '(a) At 0 K the valence band is full and the conduction band empty, so it is an insulator.', '(a) At room temperature some electrons cross the gap of about 1.1 eV, leaving holes, so it conducts a little.', '(b) Each donor gives a level just below the conduction band.', '(b) Its fifth electron is easily raised into the conduction band, so there are many more free electrons and conduction rises sharply.', '(c) Electrons and holes, in equal numbers.'),
  long(S(5, 2), 'Answer each part on the forming of a p-n junction.\n(a) Describe the diffusion and drift that happen at the junction. [2]\n(b) Explain how the depletion region and the barrier potential arise. [2]\n(c) How does heavier doping change the width of the depletion region? [1]', '(a) Holes diffuse from the p side to the n side, and electrons from n to p, as each is more concentrated on its own side.', '(a) The field that builds up drives minority carriers back across: drift, opposite to diffusion.', '(b) Carriers that cross recombine, leaving uncovered fixed ions: negative on the p side and positive on the n side.', '(b) These ions make a field and a potential difference that stop further diffusion; at balance diffusion and drift are equal.', '(c) It becomes narrower, as fewer layers of the denser ions are needed to give the same barrier.'),
  long(S(5, 3), 'Answer each part on p-type semiconductors.\n(a) How does boron make silicon p-type? [2]\n(b) Where does the acceptor level lie? [1]\n(c) Explain how a hole moves through the crystal. [2]', '(a) Boron has three valence electrons, so one of its four bonds with silicon is short of an electron.', '(a) That gap is a hole, and there are now more holes than free electrons.', '(b) Just above the valence band.', '(c) An electron from a neighbouring bond moves into the hole, leaving a hole where it came from.', '(c) So the hole moves step by step opposite to the electrons, like a positive charge.'),

  tell(S(2, 1), 'Distinguish between the valence band and the conduction band.', 'The valence band holds the valence electrons that form the bonds; in a pure semiconductor at 0 K it is full.', 'The conduction band is the higher band; electrons in it are free to move and carry current.'),

  match(S(4, 1), [['Diamond', 'a gap of about 6 eV'], ['Silicon', 'a gap of about 1.1 eV'], ['Germanium', 'a gap of about 0.7 eV'], ['Copper', 'no gap: the bands overlap']]),
  match(S(4, 2), [['Electrons in n-type silicon', 'majority carriers'], ['Holes in n-type silicon', 'minority carriers'], ['Donor ions', 'fixed positive charges'], ['Acceptor ions', 'fixed negative charges']]),
  match(S(4, 2), [['The p side, away from the junction', 'holes as the majority carriers'], ['The n side, away from the junction', 'free electrons as the majority carriers'], ['The depletion region on the p side', 'uncovered acceptor ions'], ['The depletion region on the n side', 'uncovered donor ions']]),

  ar(S(1, 2), 'The depletion region has almost no free charge carriers.', 'Electrons and holes that cross the junction recombine there.', 1, 'So the region is left with only fixed ions.'),
  ar(S(1, 2), 'A pure semiconductor has equal numbers of free electrons and holes.', 'Silicon has four valence electrons.', 2, 'Both are true, but the reason is that each electron freed from a bond leaves exactly one hole.'),
  ar(S(1, 2), 'Adding a donor raises the number of holes in silicon.', 'A donor gives a free electron to the crystal.', 4, 'The extra electrons fill many holes, so the number of holes falls.'),
];

export default questions;
