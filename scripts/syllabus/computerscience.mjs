// How the old Computer Science units map onto the 2028 syllabus, and what it leaves out.

export const map = {
  XI: {
    1: {
      unit: 1,
      topic: 'a',
      sub: {
        Encodings: [2, 'a'],
        'Storage Units': [2, 'a'],
        'Boolean Algebra': [3, 'a'],
        'Propositional Logic': [3, 'a'],
        'Logic Gates & Universality': [3, 'b'],
      },
    },
    2: { unit: 7, topic: 'a', sub: {} },
    3: { unit: 10, topic: 'a', sub: {} },
    4: { unit: 4, topic: 'a', sub: {} },
    5: { unit: 5, topic: 'a', sub: { Exceptions: 'b' } },
    6: { unit: 6, topic: 'a', sub: {} },
    7: { unit: 7, topic: 'a', sub: {} },
    8: { unit: 8, topic: 'a', sub: {} },
    9: { unit: 9, topic: 'a', sub: {} },
    10: { unit: 10, topic: 'a', sub: {} },
    11: { unit: 11, topic: 'a', sub: { 'Text File Handling': 'b' } },
    12: { unit: 12, topic: 'a', sub: {} },
  },
  XII: {
    1: {
      unit: 1,
      topic: 'b',
      sub: {
        'Propositional Logic Laws': 'a',
        'Gates & Circuits': [2, 'a'],
        'Adders & Subtractors': [2, 'b'],
        Multiplexers: [2, 'b'],
        'Decoders & Encoders': [2, 'b'],
        'NAND/NOR Implementation': [2, 'b'],
      },
    },
    2: { unit: 8, topic: 'a', sub: {} },
    3: { unit: 3, topic: 'a', sub: {} },
    4: { unit: 4, topic: 'a', sub: { StringBuffer: 'b', 'String Handling (Class XII)': 'b' } },
    5: { unit: 5, topic: 'a', sub: {} },
    6: { unit: 6, topic: 'a', sub: { Interfaces: 'b' } },
    7: { unit: 7, topic: 'a', sub: { Lists: 'b', Tuples: 'c' } },
    11: { unit: 9, topic: 'a', sub: {} },
    12: { unit: 9, topic: 'a', sub: {} },
    13: { unit: 9, topic: 'a', sub: {} },
  },
};

const out = (name, reason, ref, extra = {}) => ({ name, verdict: 'out', reason, ref, ...extra });
const notNeeded = (name, reason) => ({ name, verdict: 'not-needed', reason });
const review = (test, question) => ({ ...test, verdict: 'review', reason: question, force: true });

export const rules = [
  { level: 'XII', unit: 12, verdict: 'out', reason: 'Databases and SQL are not in the 2028 syllabus.', ref: 'XII units 1 to 9', force: true },
  { level: 'XII', unit: 13, verdict: 'out', reason: 'Networking is not in the 2028 syllabus.', ref: 'XII units 1 to 9', force: true },

  review({ level: 'XII', sub: 'Stacks, Queues, Linked Lists' }, 'The 2028 syllabus has only "Data structures - Binary trees [Conceptual]", but stacks, queues and linked lists were in papers up to 2025. Remove them?'),
  review({ level: 'XII', name: /^(Space complexity stack|Queue operations|Stack operations)$/ }, 'The 2028 syllabus has only "Data structures - Binary trees [Conceptual]", but stacks, queues and linked lists were in papers up to 2025. Remove them?'),
  review({ level: 'XI', sub: 'Bitwise Operators (supporting)' }, 'Unit 7 says "expressions (arithmetic and logical)". Bitwise operators are not named. Keep them?'),

  out(/Number of binary trees with n nodes|Array representation of a binary tree|Expression tree|Binary search tree ordering/, 'Unit 8 is conceptual, and lists terminology and the three traversals.', 'XII Unit 8'),
  out(/^Demultiplexer$/, 'Unit 2 names encoders, decoders and multiplexers. Demultiplexers are not listed.', 'XII Unit 2(b)'),
  out(/Labelled break/, 'Unit 8 lists continue and break, not labelled forms.', 'XI Unit 8'),

  notNeeded(/^(Bit, nibble, byte|Storage unit conversions|Binet's formula|Leibniz series for pi|Largest factorial in int and long|Largest Fibonacci number in int|Evil and odious numbers)$/, 'Trivia, not used in answering ISC questions.'),
];

export const supportingSubs = new Set(['Pattern Programs']);
