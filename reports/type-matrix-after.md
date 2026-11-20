# Subtopic × question type, after

Written by `tests/unit/type-matrix.test.ts`. It counts the app’s own material, and holds no wording from any paper.

A cell meets the target with **5 questions written by hand** in the 38 most-asked subtopics, the top quarter by how often the papers ask them, marked ★, and **3** in every other subtopic. Fact-based and compiled questions don’t count, and several questions on one fact count once. Which types fit which subtopics is written down in `tests/unit/lib/type-fit.ts`. There is no longer a target for the number of questions bank and generator give together.

Still to write: **362** hand-written questions, all in the 114 subtopics outside the most-asked. At the start of this target, after Batch 11, it was **2,585**.

## By type

| Type | Cells that fit | Met at start | Met | Written | Still to write |
|---|---:|---:|---:|---:|---:|
| reason | 152 | 84 | 142 | 619 | 22 |
| short | 152 | 90 | 145 | 670 | 16 |
| match | 152 | 38 | 134 | 480 | 52 |
| diagram | 124 | 33 | 110 | 396 | 42 |
| predict | 152 | 38 | 134 | 488 | 44 |
| odd | 152 | 38 | 134 | 478 | 54 |
| distinguish | 152 | 43 | 137 | 495 | 38 |
| program | 20 | 7 | 16 | 58 | 7 |
| assertion | 152 | 44 | 137 | 515 | 35 |
| long | 152 | 47 | 134 | 500 | 43 |
| derivation | 76 | 39 | 72 | 310 | 9 |
| **All** | 1436 | 501 | 1295 | 5,009 | 362 |

## Work list

Subtopics outside the most-asked, in order of how often the papers ask them, with how many hand-written questions each type still needs, the emptiest kinds first.

| Subtopic | Asked | diagram | predict | odd | long | distinguish | match | reason | short | assertion | derivation | program | Left |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Chemistry XII 7b | 39 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XII 2a | 38 | · | · | · | · | · | · | · | · | · | – | – | done |
| Physics XII 5a | 37 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XII 4a | 37 | – | · | · | · | · | · | · | · | · | – | · | done |
| Chemistry XII 9a | 32 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XII 4b | 30 | · | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XI 1b | 30 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XII 1a | 30 | · | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XII 3d | 28 | · | · | · | · | · | · | · | · | · | · | – | done |
| Mathematics XII 6a | 28 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XII 9a | 27 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XI 7a | 26 | – | · | · | · | · | · | · | · | · | – | · | done |
| Physics XII 4a | 24 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XII 10b | 24 | · | · | · | · | · | · | · | · | · | – | – | done |
| Physics XII 3b | 22 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XII 6b | 21 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XII 2b | 20 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XII 9a | 20 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 6b | 19 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XII 9c | 19 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XI 1a | 19 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XI 5a | 19 | – | · | · | · | · | · | · | · | · | – | · | done |
| Computer Science XI 9a | 19 | – | · | · | · | · | · | · | · | · | – | · | done |
| Chemistry XII 10d | 17 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XII 7c | 15 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XII 10a | 15 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XI 6a | 15 | – | · | · | · | · | · | · | · | · | – | · | done |
| Mathematics XI 1a | 14 | · | · | · | · | · | · | · | · | · | · | – | done |
| Mathematics XI 3c | 14 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XII 6a | 14 | – | · | · | · | · | · | · | · | · | – | · | done |
| Computer Science XII 4b | 13 | – | · | · | · | · | · | · | · | · | – | · | done |
| Computer Science XII 5a | 13 | – | · | · | · | · | · | · | · | · | – | · | done |
| Computer Science XII 6b | 13 | – | · | · | · | · | · | · | · | · | – | · | done |
| Physics XI 10b | 12 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XI 3a | 12 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 1c | 11 | – | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 8a | 11 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XII 8b | 11 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XII 10c | 10 | · | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XI 5b | 10 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XII 3b | 9 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XII 9b | 9 | · | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XI 3a | 9 | · | · | · | · | · | · | · | · | · | · | – | done |
| Mathematics XI 3b | 9 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 4a | 8 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 1b | 8 | – | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XII 2c | 8 | · | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XI 2c | 8 | · | · | · | · | · | · | · | · | · | · | – | done |
| Mathematics XI 2e | 8 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XI 2a | 8 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 2b | 7 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XI 3b | 7 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XI 11b | 7 | – | · | · | · | · | · | · | · | · | – | · | done |
| Physics XI 2a | 6 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 4b | 6 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 9b | 6 | · | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XI 2b | 6 | · | · | · | · | · | · | · | · | · | · | – | done |
| Mathematics XI 4a | 6 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XI 5b | 6 | – | · | · | · | · | · | · | · | · | – | · | done |
| Physics XI 3a | 5 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 4a | 5 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 5b | 5 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XII 11c | 5 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XI 12a | 5 | – | · | · | · | · | · | · | · | · | – | · | done |
| Computer Science XI 13a | 5 | – | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 7a | 4 | – | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XI 2a | 4 | · | · | · | · | · | · | · | · | · | · | – | done |
| Mathematics XI 3d | 4 | · | · | · | · | · | · | · | · | · | · | – | done |
| Mathematics XI 5a | 4 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XI 10a | 4 | – | · | · | · | · | · | · | · | · | – | · | done |
| Physics XI 2b | 3 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 7a | 3 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 7c | 3 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 8b | 3 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 2a | 3 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 3a | 3 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XII 11a | 3 | · | · | · | · | · | · | · | · | · | – | – | done |
| Mathematics XI 2d | 3 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 1a | 2 | · | · | · | · | · | · | · | · | · | – | – | done |
| Physics XI 1b | 2 | · | · | · | · | · | · | · | · | · | – | – | done |
| Physics XI 5a | 2 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 6a | 2 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 1a | 2 | – | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 6a | 2 | · | · | · | · | · | · | · | · | · | · | – | done |
| Computer Science XI 11a | 2 | – | · | · | · | · | · | · | · | · | – | · | done |
| Physics XI 5c | 1 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 6b | 1 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 7b | 1 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 8a | 1 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 9a | 1 | · | · | · | · | · | · | · | · | · | · | – | done |
| Physics XI 10a | 1 | · | · | · | · | · | · | · | · | · | · | – | done |
| Chemistry XI 8b | 1 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 8c | 1 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 9a | 1 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XI 10a | 1 | · | · | · | · | · | · | · | · | · | – | – | done |
| Chemistry XII 6c | 1 | · | · | · | · | · | · | · | · | · | – | – | done |
| Computer Science XII 7a | 1 | – | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | – | 1 | 25 |
| Physics XI 1p | 0 | 3 | 1 | 3 | 1 | · | 2 | · | · | · | – | – | 10 |
| Physics XI 3b | 0 | 3 | 3 | 3 | 3 | 3 | 3 | · | · | 3 | 3 | – | 24 |
| Physics XI 3c | 0 | 3 | 3 | 3 | 3 | 3 | 3 | · | · | 2 | – | – | 20 |
| Physics XI 4b | 0 | 3 | 3 | 3 | 3 | 2 | 3 | · | · | 3 | 1 | – | 21 |
| Physics XI 5b | 0 | 3 | 3 | 3 | 3 | 3 | 3 | · | · | 3 | 3 | – | 24 |
| Physics XII 6p | 0 | 3 | 1 | 3 | 2 | · | 2 | · | · | · | – | – | 11 |
| Chemistry XI 5a | 0 | 3 | 3 | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 2 | – | 27 |
| Chemistry XI 9c | 0 | 3 | 3 | 3 | 1 | 3 | 3 | 3 | 1 | 2 | – | – | 22 |
| Chemistry XI 9d | 0 | 3 | 3 | 3 | 1 | 3 | 3 | 2 | · | 3 | – | – | 21 |
| Chemistry XI 10b | 0 | 3 | 2 | 3 | 3 | 1 | 3 | 1 | 1 | 1 | – | – | 18 |
| Chemistry XI 10c | 0 | 3 | 2 | 3 | 3 | 2 | 3 | · | · | 1 | – | – | 17 |
| Chemistry XI 10d | 0 | 3 | 2 | 3 | 3 | 2 | 3 | 1 | · | 1 | – | – | 18 |
| Chemistry XII 11b | 0 | 3 | 2 | 3 | 3 | 2 | 3 | 1 | · | 1 | – | – | 18 |
| Chemistry XII 11d | 0 | 3 | 1 | 3 | 2 | · | 3 | · | · | · | – | – | 12 |
| Computer Science XI 4a | 0 | – | 3 | 3 | 3 | 2 | 3 | 2 | 3 | 3 | – | 3 | 25 |
| Computer Science XII 7b | 0 | – | 3 | 3 | 2 | 3 | 3 | 3 | 3 | 3 | – | 1 | 24 |
| Computer Science XII 7c | 0 | – | 3 | 3 | 2 | 3 | 3 | 3 | 3 | 3 | – | 2 | 25 |

## Physics

Each cell is the number written by hand, with the count at the start of this target before the arrow where it has changed. A dash is a type that doesn’t fit that subtopic.

| Subtopic | reason | short | match | diagram | predict | odd | distinguish | program | assertion | long | derivation |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a | 4 | 7 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | 3 | – | 3 | 0 → 3 | – |
| XI 1b | 4 | 13 | 0 → 3 | 0 → 3 | 0 → 3 | 2 → 3 | 2 → 3 | – | 5 | 0 → 3 | – |
| XI 1p | 6 | 11 | 1 | 0 | 2 | 0 | 3 | – | 4 | 2 | – |
| XI 2a | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 0 → 3 | 2 → 3 |
| XI 2b | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 1 → 3 | 0 → 3 | 4 |
| XI 3a | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 3 |
| XI 3b | 6 | 5 | 0 | 0 | 0 | 0 | 0 | – | 0 | 0 | 0 |
| XI 3c | 5 | 5 | 0 | 0 | 0 | 0 | 0 | – | 1 | 0 | – |
| XI 4a | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 |
| XI 4b | 5 | 4 | 0 | 0 | 0 | 0 | 1 | – | 0 | 0 | 2 |
| XI 5a | 5 | 6 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XI 5b | 5 | 5 | 0 | 0 | 0 | 0 | 0 | – | 0 | 0 | 0 |
| XI 5c | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 |
| XI 6a | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 3 |
| XI 6b | 5 | 6 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 0 → 3 | 3 |
| XI 7a | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XI 7b | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 |
| XI 7c | 6 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 |
| XI 8a | 5 | 4 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XI 8b | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 5 |
| XI 9a | 6 | 6 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 0 → 3 | 1 → 3 |
| XI 10a | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 3 |
| XI 10b | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 |
| XII 1a ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 8 |
| XII 1b ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 2a ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 2b ★ | 8 | 10 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 6 |
| XII 3a ★ | 7 | 5 | 5 | 5 | 5 | 5 | 5 | – | 8 | 5 | 14 |
| XII 3b | 5 | 6 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XII 4a | 5 | 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 1 → 3 | 0 → 3 | 4 |
| XII 4b ★ | 9 | 8 | 5 | 5 | 5 | 5 | 5 | – | 7 | 5 | 7 |
| XII 5a | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 6a ★ | 6 | 5 | 5 | 5 | 5 | 5 | 5 | – | 7 | 5 | 12 |
| XII 6b ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 6c ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 6 |
| XII 6p | 6 | 9 | 1 | 0 | 2 | 0 | 3 | – | 4 | 1 | – |
| XII 7a ★ | 5 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 8a ★ | 5 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 8b ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 9a | 5 | 4 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 2 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 9b ★ | 5 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | – |

## Chemistry

Each cell is the number written by hand, with the count at the start of this target before the arrow where it has changed. A dash is a type that doesn’t fit that subtopic.

| Subtopic | reason | short | match | diagram | predict | odd | distinguish | program | assertion | long | derivation |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a | 1 → 3 | 1 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 | – | 1 → 3 | 0 → 3 | – |
| XI 1b | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 3 | 0 → 3 |
| XI 1c | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XI 2a | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | 0 → 3 |
| XI 2b | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 3 | 0 → 3 |
| XI 3a | 1 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 1 → 3 | – |
| XI 4a | 0 → 3 | 9 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XI 4b | 0 → 3 | 4 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 3 | – |
| XI 5a | 0 | 1 | 0 | 0 | 0 | 0 | 0 | – | 0 | 1 | 1 |
| XI 5b | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 2 → 3 | 0 → 3 |
| XI 6a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | 2 → 3 |
| XI 6b | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 2 → 3 | 1 → 3 |
| XI 7a | 0 → 3 | 2 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 2 → 3 | – |
| XI 8a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XI 8b | 1 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 1 → 3 | – |
| XI 8c | 0 → 3 | 2 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 1 → 3 | – |
| XI 9a | 1 → 3 | 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XI 9b | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XI 9c | 0 | 2 | 0 | 0 | 0 | 0 | 0 | – | 1 | 2 | – |
| XI 9d | 1 | 3 | 0 | 0 | 0 | 0 | 0 | – | 0 | 2 | – |
| XI 10a | 1 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | – |
| XI 10b | 2 | 2 | 0 | 0 | 1 | 0 | 2 | – | 2 | 0 | – |
| XI 10c | 3 | 3 | 0 | 0 | 1 | 0 | 1 | – | 2 | 0 | – |
| XI 10d | 2 | 4 | 0 | 0 | 1 | 0 | 1 | – | 2 | 0 | – |
| XII 1a ★ | 8 | 6 | 5 | 5 | 5 | 5 | 5 | – | 8 | 5 | 6 |
| XII 2a ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 2b ★ | 5 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 2c | 5 | 6 | 2 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 3a ★ | 6 | 5 | 5 | 5 | 5 | 5 | 6 | – | 6 | 5 | 8 |
| XII 3b | 5 | 4 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 0 → 3 | 0 → 3 |
| XII 4a ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | – |
| XII 4b | 4 | 6 | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 5a ★ | 5 | 7 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | – |
| XII 6a ★ | 5 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | – |
| XII 6b | 5 | 4 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XII 6c | 6 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 2 → 3 | 0 → 3 | – |
| XII 7a ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | – |
| XII 7b | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XII 7c | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 0 → 3 | – |
| XII 8a ★ | 5 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | – |
| XII 8b | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 0 → 3 | – |
| XII 9a | 5 | 7 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XII 9b | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 9c | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 0 → 3 | – |
| XII 10a | 5 | 6 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 10b | 5 | 4 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 10c | 5 | 5 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 10d | 5 | 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 2 → 3 | – | 0 → 3 | 0 → 3 | – |
| XII 11a | 3 | 2 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | – | 3 | 0 → 3 | – |
| XII 11b | 2 | 4 | 0 | 0 | 1 | 0 | 1 | – | 2 | 0 | – |
| XII 11c | 2 → 3 | 1 → 3 | 1 → 3 | 0 → 3 | 1 → 3 | 0 → 3 | 3 | – | 2 → 3 | 0 → 3 | – |
| XII 11d | 4 | 3 | 0 | 0 | 2 | 0 | 3 | – | 3 | 1 | – |

## Mathematics

Each cell is the number written by hand, with the count at the start of this target before the arrow where it has changed. A dash is a type that doesn’t fit that subtopic.

| Subtopic | reason | short | match | diagram | predict | odd | distinguish | program | assertion | long | derivation |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 |
| XI 1b | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XI 1c ★ | 5 | 6 | 5 | – | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XI 2a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | 1 → 3 |
| XI 2b | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XI 2c | 0 → 3 | 2 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 3 |
| XI 2d | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 2 → 3 |
| XI 2e | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 1 → 3 | 3 |
| XI 3a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 |
| XI 3b | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | 0 → 3 |
| XI 3c | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XI 3d | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XI 4a | 0 → 3 | 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 1 → 3 | 4 |
| XI 5a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | 0 → 3 |
| XI 5b | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 |
| XII 1a ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 1b ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 2a ★ | 5 | 5 | 5 | – | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 2b ★ | 5 | 5 | 5 | – | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 3a ★ | 5 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 3b ★ | 5 | 10 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 3c ★ | 5 | 11 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 3d | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | 1 → 3 |
| XII 3e ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 4a ★ | 6 | 6 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 5a ★ | 5 | 7 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | 5 |
| XII 6a | 0 → 3 | 2 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | 0 → 3 |
| XII 7a ★ | 6 | 10 | 5 | 5 | 5 | 5 | 5 | – | 6 | 5 | 5 |

## Computer Science

Each cell is the number written by hand, with the count at the start of this target before the arrow where it has changed. A dash is a type that doesn’t fit that subtopic.

| Subtopic | reason | short | match | diagram | predict | odd | distinguish | program | assertion | long | derivation |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| XI 1a | 0 → 3 | 2 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 4 | – |
| XI 2a | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 1 → 3 | 2 → 3 | 0 → 3 |
| XI 3a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 4 | – |
| XI 3b | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 2 → 3 | – |
| XI 4a | 1 | 0 | 0 | – | 0 | 0 | 1 | 0 | 0 | 0 | – |
| XI 5a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – |
| XI 5b | 0 → 3 | 1 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – |
| XI 6a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – |
| XI 7a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – |
| XI 8a ★ | 5 | 5 | 5 | – | 5 | 5 | 5 | 5 | 5 | 5 | – |
| XI 9a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 3 | 0 → 3 | 0 → 3 | – |
| XI 10a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 4 | 0 → 3 | 0 → 3 | – |
| XI 11a | 1 → 3 | 1 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – |
| XI 11b | 1 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 2 → 3 | 0 → 3 | 0 → 3 | – |
| XI 12a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 3 | 0 → 3 | 5 | – |
| XI 13a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 5 | – |
| XII 1a | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 2 → 3 | – |
| XII 1b ★ | 7 | 7 | 5 | 5 | 5 | 5 | 5 | – | 7 | 7 | 6 |
| XII 2a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 1 → 3 | – |
| XII 2b | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 4 | – |
| XII 3a ★ | 6 | 5 | 5 | – | 5 | 5 | 5 | 5 | 5 | 5 | – |
| XII 4a | 0 → 3 | 1 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 3 | 0 → 3 | 0 → 3 | – |
| XII 4b | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 2 → 3 | 0 → 3 | 0 → 3 | – |
| XII 5a | 0 → 3 | 1 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 3 | 1 → 3 | 0 → 3 | – |
| XII 6a | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 2 → 3 | 0 → 3 | 0 → 3 | – |
| XII 6b | 0 → 3 | 1 → 3 | 0 → 3 | – | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 1 → 3 | – |
| XII 7a | 0 | 0 | 0 | – | 0 | 0 | 0 | 2 | 0 | 0 | – |
| XII 7b | 0 | 0 | 0 | – | 0 | 0 | 0 | 2 | 0 | 1 | – |
| XII 7c | 0 | 0 | 0 | – | 0 | 0 | 0 | 1 | 0 | 1 | – |
| XII 8a ★ | 5 | 5 | 5 | 5 | 5 | 5 | 5 | – | 5 | 5 | – |
| XII 9a | 0 → 3 | 1 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | 0 → 3 | – | 0 → 3 | 5 | 0 → 3 |
