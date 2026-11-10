// Written by hand: vitamins, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const V = at(10, 'c');

const questions: BankDef[] = [
  figure(V(2, 1), 'Draw a chart that classifies vitamins by what they dissolve in, with the vitamins in each group.', ['Vitamins divide into fat-soluble and water-soluble vitamins.', 'Fat-soluble: A, D, E and K. Water-soluble: the B group and C.'], {
    answer: sketch(320, 150, 'A box labelled Vitamins at the top, with lines down to two boxes. The left box is fat-soluble, with A, D, E and K written under it. The right box is water-soluble, with the B group and C written under it.', [
      { t: 'box', x: 115, y: 10, w: 90, h: 30 }, label(160, 30, 'Vitamins'),
      line([[140, 40], [90, 70]]), line([[180, 40], [230, 70]]),
      { t: 'box', x: 30, y: 70, w: 120, h: 30 }, label(90, 90, 'fat-soluble'),
      { t: 'box', x: 170, y: 70, w: 120, h: 30 }, label(230, 90, 'water-soluble'),
      label(90, 128, 'A, D, E, K'), label(230, 128, 'B group, C'),
    ]),
  }),
  figure(V(3, 1), 'The table gives a source and the deficiency disease of five vitamins, with three left blank. Fill in P, Q and R.', ['P: a source of vitamin B₁, such as yeast, cereals or milk.', 'Q: scurvy.', 'R: a source of vitamin D, such as sunlight on the skin, fish or egg yolk.'], {
    shown: table(['Vitamin', 'A good source', 'Deficiency disease'], [['A', 'carrots', 'night blindness'], ['B₁', 'P', 'beri-beri'], ['C', 'citrus fruits', 'Q'], ['D', 'R', 'rickets'], ['K', 'green leafy vegetables', 'slow clotting of blood']]),
  }),
  figure(V(2, 2), 'Make a table of the four fat-soluble vitamins, giving one job of each in the body.', ['A: needed for vision in dim light and for healthy skin; D: lets the body take up calcium and phosphate for bones.', 'E: protects the membranes of red blood cells, keeping them from breaking; K: needed for blood to clot.'], {
    answer: table(['Vitamin', 'One job in the body'], [['A', 'vision in dim light, and healthy skin'], ['D', 'taking up calcium and phosphate, for strong bones'], ['E', 'protecting red blood cells from breaking'], ['K', 'making blood clot']]),
  }),

  predict(V(2, 1), 'A sailor eats no fresh fruit or vegetables for several months. Predict the deficiency disease, and two of its signs.', 'Scurvy, from a lack of vitamin C.', 'The gums bleed, and wounds heal slowly.'),
  predict(V(2, 1), 'A person’s diet lacks vitamin K for a long time. Predict what happens when they cut themselves.', 'The cut bleeds for longer than usual.', 'Vitamin K is needed for blood to clot, so clotting takes longer.'),
  predict(V(2, 2), 'People live mainly on polished rice. Predict which deficiency disease may spread among them, and why.', 'Beri-beri, from a lack of vitamin B₁.', 'Much of the rice’s vitamin B₁ is in its outer layer, which polishing removes.'),

  odd(V(2, 1), ['vitamin A', 'vitamin D', 'vitamin E', 'vitamin C'], 'vitamin C', 'It is water-soluble; the others are fat-soluble.'),
  odd(V(2, 1), ['beri-beri', 'scurvy', 'rickets', 'diabetes'], 'diabetes', 'It isn’t caused by the lack of a vitamin; the others are vitamin deficiency diseases.'),
  odd(V(2, 1), ['vitamin B₁', 'vitamin B₂', 'vitamin B₆', 'vitamin K'], 'vitamin K', 'It is fat-soluble; the B vitamins are water-soluble.'),

  long(V(5, 1), 'Answer each part on vitamin D.\n(a) How can the body make its own vitamin D? [1]\n(b) What is its main job? [1]\n(c) Name its deficiency disease in children and in adults. [2]\n(d) Why can the body keep a store of it? [1]', '(a) It is made in the skin when sunlight falls on it.', '(b) It lets the body take up calcium and phosphate, to build strong bones.', '(c) Rickets in children, with soft, bent bones.', '(c) Osteomalacia in adults, with soft, weak bones.', '(d) It is fat-soluble, so it is stored in the liver and fatty tissue.'),
  long(V(5, 1), 'Answer each part on vitamin C.\n(a) Give its chemical name, and say whether it is fat-soluble or water-soluble. [1]\n(b) Give two jobs it does in the body. [2]\n(c) Name its deficiency disease, with one sign. [1]\n(d) Name two good sources of it. [1]', '(a) Ascorbic acid; it is water-soluble.', '(b) It keeps the gums, skin and blood vessels healthy.', '(b) It helps wounds to heal.', '(c) Scurvy, in which the gums bleed.', '(d) Citrus fruits such as oranges and lemons, and amla.'),
  long(V(5, 1), 'Answer each part on vitamin A.\n(a) Give its main job in the body. [1]\n(b) Name two diseases caused by its lack. [2]\n(c) Name two good sources of it. [1]\n(d) How can a person who eats no animal food still get it? [1]', '(a) It is needed for vision, especially in dim light, and for healthy skin.', '(b) Night blindness.', '(b) Xerophthalmia, a hardening and drying of the cornea of the eye.', '(c) Fish liver oil and carrots.', '(d) Carrots and other orange or green vegetables hold carotene, which the body turns into vitamin A.'),

  tell(V(2, 2), 'Distinguish between rickets and osteomalacia.', 'Rickets is a lack of vitamin D in children, whose growing bones become soft and bent.', 'Osteomalacia is a lack of vitamin D in adults, whose bones become soft and weak.'),
  tell(V(2, 1), 'Distinguish between scurvy and beri-beri, by the vitamin lacking and one sign of each.', 'Scurvy comes from a lack of vitamin C; the gums bleed.', 'Beri-beri comes from a lack of vitamin B₁; the nerves and muscles are weakened.'),
  tell(V(2, 1), 'Distinguish between vitamin A and vitamin K, by their jobs and their deficiency diseases.', 'Vitamin A is needed for vision; its lack causes night blindness.', 'Vitamin K is needed for blood to clot; its lack makes clotting slow.'),

  match(V(4, 1), [['Vitamin A', 'night blindness'], ['Vitamin B₁', 'beri-beri'], ['Vitamin C', 'scurvy'], ['Vitamin K', 'slow clotting of blood']]),
  match(V(4, 1), [['Vitamin A', 'carrots and fish liver oil'], ['Vitamin C', 'citrus fruits and amla'], ['Vitamin D', 'sunlight on the skin'], ['Vitamin E', 'vegetable oils and wheat germ']]),
  match(V(4, 2), [['Vitamin B₂', 'cracks at the corners of the mouth'], ['Vitamin B₆', 'convulsions'], ['Vitamin B₁₂', 'pernicious anaemia'], ['Vitamin E', 'fragile red blood cells and weak muscles']]),

  ar(V(1, 1), 'The body can make its own vitamin D.', 'Sunlight falling on the skin makes vitamin D in it.', 1, 'That is how the body makes it, so enough sunlight can meet much of the need.'),
  ar(V(1, 1), 'Vitamin C is fat-soluble.', 'Vitamin C is easily destroyed by heat.', 4, 'Vitamin C is water-soluble.'),
  ar(V(1, 2), 'A lack of vitamin K slows the clotting of blood.', 'Vitamin K is fat-soluble.', 2, 'Both are true, but clotting is slow because vitamin K is needed to make the clotting factors, not because it is fat-soluble.'),
];

export default questions;
