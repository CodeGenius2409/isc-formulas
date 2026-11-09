# Generated papers against the real ones

Written by `tests/unit/paper-fidelity.test.ts`. Each row is 50 mock papers. The real figures are in `src/practice/bank/paper-targets.json`, counts only, from the recent board papers and specimens.

- **Shape** is sections, questions, marks per question, any-two sections and internal choices. It must match exactly, and the test fails if it doesn’t.
- **Mix** is out of 100: how much of a section’s questions fall on the same types as the real section’s, over the 50 papers.
- **Unit** is the same measure for marks by unit, against the syllabus. **Topic** is the correlation with how often the papers ask each topic, where 1 is perfect.
- **Figures** and **thinking** are real, then ours. Thinking is what the specimens tag as apply, analyse or evaluate. Boards don’t tag, so the real figure comes from the specimens.

## Summary

| Class | Generated | Shape | Mean mix | Lowest section | Unit | Topic |
|---|---:|---|---:|---|---:|---:|
| physics XI | 0% | Exact | 85 | Section D: 67 | 86 | 0.53 |
| physics XI | 50% | Exact | 92 | Section A: 87 | 89 | 0.68 |
| physics XI | 100% | Exact | 78 | Section D: 40 | 89 | 0.82 |
| physics XII | 0% | Exact | 96 | Section D: 92 | 92 | 0.79 |
| physics XII | 50% | Exact | 96 | Section D: 94 | 92 | 0.74 |
| physics XII | 100% | Exact | 81 | Section D: 40 | 92 | 0.6 |
| chemistry XI | 0% | Exact | 92 | Section C: 85 | 97 | 0.32 |
| chemistry XI | 50% | Exact | 95 | Section C: 86 | 94 | 0.37 |
| chemistry XI | 100% | Exact | 60 | Section D: 13 | 77 | 0.53 |
| chemistry XII | 0% | Exact | 98 | Section A: 95 | 94 | 0.92 |
| chemistry XII | 50% | Exact | 97 | Section A: 95 | 94 | 0.93 |
| chemistry XII | 100% | Exact | 73 | Section D: 12 | 85 | 0.92 |
| mathematics XI | 0% | Exact | 100 | Section C: 99 | 96 | 0.56 |
| mathematics XI | 50% | Exact | 100 | Section C: 98 | 94 | 0.6 |
| mathematics XI | 100% | Exact | 77 | Section D: 7 | 84 | 0.24 |
| mathematics XII | 0% | Exact | 100 | Section B: 99 | 93 | 0.75 |
| mathematics XII | 50% | Exact | 100 | Section D: 98 | 91 | 0.79 |
| mathematics XII | 100% | Exact | 83 | Section D: 34 | 88 | 0.77 |
| computerscience XI | 0% | Exact | 91 | Part I (1): 74 | 78 | -0.01 |
| computerscience XI | 50% | Exact | 98 | Part I (1): 96 | 70 | 0 |
| computerscience XI | 100% | Exact | 86 | Part II, Section C: 33 | 66 | 0.01 |
| computerscience XII | 0% | Exact | 90 | Part I (1): 74 | 92 | 0.78 |
| computerscience XII | 50% | Exact | 99 | Part I (1): 96 | 84 | 0.89 |
| computerscience XII | 100% | Exact | 87 | Part II, Section A: 67 | 80 | 0.83 |

## By section

| Class | Generated | Section | Mix | Figures, real then ours | Thinking, real then ours | Internal choices |
|---|---:|---|---:|---|---|---:|
| physics XI | 0% | Section A | 87 | 17%, 0% | 31%, 22% | 0 of 0 |
| physics XI | 0% | Section B | 97 | 35%, 5% | 52%, 46% | 2 of 2 |
| physics XI | 0% | Section C | 89 | 57%, 13% | 44%, 63% | 2 of 2 |
| physics XI | 0% | Section D | 67 | 57%, 0% | 89%, 43% | 2 of 2 |
| physics XI | 50% | Section A | 87 | 17%, 10% | 31%, 22% | 0 of 0 |
| physics XI | 50% | Section B | 98 | 35%, 13% | 52%, 41% | 2 of 2 |
| physics XI | 50% | Section C | 90 | 57%, 19% | 44%, 46% | 2 of 2 |
| physics XI | 50% | Section D | 91 | 57%, 6% | 89%, 64% | 2 of 2 |
| physics XI | 100% | Section A | 86 | 17%, 12% | 31%, 23% | 0 of 0 |
| physics XI | 100% | Section B | 98 | 35%, 17% | 52%, 37% | 2 of 2 |
| physics XI | 100% | Section C | 88 | 57%, 23% | 44%, 39% | 2 of 2 |
| physics XI | 100% | Section D | 40 | 57%, 33% | 89%, 69% | 2 of 2 |
| physics XII | 0% | Section A | 96 | 17%, 4% | 31%, 25% | 0 of 0 |
| physics XII | 0% | Section B | 98 | 35%, 7% | 52%, 40% | 2 of 2 |
| physics XII | 0% | Section C | 98 | 57%, 28% | 44%, 51% | 2 of 2 |
| physics XII | 0% | Section D | 92 | 57%, 51% | 89%, 92% | 2 of 2 |
| physics XII | 50% | Section A | 95 | 17%, 11% | 31%, 20% | 0 of 0 |
| physics XII | 50% | Section B | 96 | 35%, 16% | 52%, 37% | 2 of 2 |
| physics XII | 50% | Section C | 98 | 57%, 31% | 44%, 46% | 2 of 2 |
| physics XII | 50% | Section D | 94 | 57%, 54% | 89%, 93% | 2 of 2 |
| physics XII | 100% | Section A | 92 | 17%, 14% | 31%, 20% | 0 of 0 |
| physics XII | 100% | Section B | 98 | 35%, 21% | 52%, 36% | 2 of 2 |
| physics XII | 100% | Section C | 93 | 57%, 39% | 44%, 40% | 2 of 2 |
| physics XII | 100% | Section D | 40 | 57%, 63% | 89%, 100% | 2 of 2 |
| chemistry XI | 0% | Section A | 95 | 1%, 0% | 45%, 22% | 0 of 0 |
| chemistry XI | 0% | Section B | 99 | 0%, 0% | 50%, 27% | 2 of 2 |
| chemistry XI | 0% | Section C | 85 | 2%, 0% | 43%, 23% | 2 of 2 |
| chemistry XI | 0% | Section D | 87 | 10%, 0% | 78%, 39% | 2 of 2 |
| chemistry XI | 50% | Section A | 95 | 1%, 2% | 45%, 22% | 0 of 0 |
| chemistry XI | 50% | Section B | 99 | 0%, 0% | 50%, 27% | 2 of 2 |
| chemistry XI | 50% | Section C | 86 | 2%, 0% | 43%, 17% | 2 of 2 |
| chemistry XI | 50% | Section D | 100 | 10%, 0% | 78%, 39% | 2 of 2 |
| chemistry XI | 100% | Section A | 94 | 1%, 1% | 45%, 22% | 0 of 0 |
| chemistry XI | 100% | Section B | 89 | 0%, 0% | 50%, 27% | 2 of 2 |
| chemistry XI | 100% | Section C | 42 | 2%, 0% | 43%, 62% | 2 of 2 |
| chemistry XI | 100% | Section D | 13 | 10%, 0% | 78%, 100% | 2 of 2 |
| chemistry XII | 0% | Section A | 95 | 1%, 0% | 45%, 29% | 0 of 0 |
| chemistry XII | 0% | Section B | 99 | 0%, 0% | 50%, 30% | 2 of 2 |
| chemistry XII | 0% | Section C | 99 | 2%, 0% | 43%, 55% | 2 of 2 |
| chemistry XII | 0% | Section D | 100 | 10%, 0% | 78%, 59% | 2 of 2 |
| chemistry XII | 50% | Section A | 95 | 1%, 3% | 45%, 25% | 0 of 0 |
| chemistry XII | 50% | Section B | 99 | 0%, 0% | 50%, 28% | 2 of 2 |
| chemistry XII | 50% | Section C | 99 | 2%, 0% | 43%, 35% | 2 of 2 |
| chemistry XII | 50% | Section D | 95 | 10%, 0% | 78%, 56% | 2 of 2 |
| chemistry XII | 100% | Section A | 94 | 1%, 2% | 45%, 22% | 0 of 0 |
| chemistry XII | 100% | Section B | 99 | 0%, 0% | 50%, 28% | 2 of 2 |
| chemistry XII | 100% | Section C | 86 | 2%, 0% | 43%, 13% | 2 of 2 |
| chemistry XII | 100% | Section D | 12 | 10%, 0% | 78%, 100% | 2 of 2 |
| mathematics XI | 0% | Section A | 100 | 5%, 0% | 16%, 16% | 0 of 0 |
| mathematics XI | 0% | Section B | 100 | 0%, 0% | 29%, 29% | 3 of 3 |
| mathematics XI | 0% | Section C | 99 | 14%, 0% | 57%, 70% | 3 of 3 |
| mathematics XI | 0% | Section D | 99 | 0%, 0% | 100%, 100% | 3 of 3 |
| mathematics XI | 50% | Section A | 100 | 5%, 0% | 16%, 16% | 0 of 0 |
| mathematics XI | 50% | Section B | 100 | 0%, 0% | 29%, 29% | 3 of 3 |
| mathematics XI | 50% | Section C | 98 | 14%, 0% | 57%, 76% | 3 of 3 |
| mathematics XI | 50% | Section D | 100 | 0%, 0% | 100%, 100% | 3 of 3 |
| mathematics XI | 100% | Section A | 100 | 5%, 0% | 16%, 16% | 0 of 0 |
| mathematics XI | 100% | Section B | 100 | 0%, 0% | 29%, 29% | 3 of 3 |
| mathematics XI | 100% | Section C | 100 | 14%, 0% | 57%, 81% | 3 of 3 |
| mathematics XI | 100% | Section D | 7 | 0%, 0% | 100%, 86% | 3 of 3 |
| mathematics XII | 0% | Section A | 100 | 11%, 0% | 37%, 35% | 0 of 0 |
| mathematics XII | 0% | Section B | 99 | 0%, 0% | 57%, 79% | 3 of 3 |
| mathematics XII | 0% | Section C | 100 | 29%, 0% | 71%, 67% | 3 of 3 |
| mathematics XII | 0% | Section D | 100 | 20%, 0% | 100%, 87% | 3 of 3 |
| mathematics XII | 50% | Section A | 100 | 11%, 0% | 37%, 29% | 0 of 0 |
| mathematics XII | 50% | Section B | 100 | 0%, 0% | 57%, 79% | 3 of 3 |
| mathematics XII | 50% | Section C | 100 | 29%, 5% | 71%, 64% | 3 of 3 |
| mathematics XII | 50% | Section D | 98 | 20%, 2% | 100%, 96% | 3 of 3 |
| mathematics XII | 100% | Section A | 100 | 11%, 0% | 37%, 21% | 0 of 0 |
| mathematics XII | 100% | Section B | 98 | 0%, 0% | 57%, 77% | 3 of 3 |
| mathematics XII | 100% | Section C | 100 | 29%, 7% | 71%, 61% | 3 of 3 |
| mathematics XII | 100% | Section D | 34 | 20%, 18% | 100%, 100% | 3 of 3 |
| computerscience XI | 0% | Part I (1) | 74 | 0%, 0% | 72%, 51% | 0 of 0 |
| computerscience XI | 0% | Part I (2) | 80 | 0%, 0% | 100%, 37% | 0 of 0 |
| computerscience XI | 0% | Part II, Section A | 100 | 61%, 0% | 50%, 39% | 1 of 1 |
| computerscience XI | 0% | Part II, Section B | 100 | 0%, 0% | 17%, 97% | 0 of 0 |
| computerscience XI | 0% | Part II, Section C | 100 | 0%, 0% | 67%, 61% | 0 of 0 |
| computerscience XI | 50% | Part I (1) | 96 | 0%, 0% | 72%, 54% | 0 of 0 |
| computerscience XI | 50% | Part I (2) | 98 | 0%, 0% | 100%, 37% | 0 of 0 |
| computerscience XI | 50% | Part II, Section A | 100 | 61%, 0% | 50%, 72% | 1 of 1 |
| computerscience XI | 50% | Part II, Section B | 99 | 0%, 0% | 17%, 96% | 0 of 0 |
| computerscience XI | 50% | Part II, Section C | 98 | 0%, 0% | 67%, 63% | 0 of 0 |
| computerscience XI | 100% | Part I (1) | 96 | 0%, 0% | 72%, 52% | 0 of 0 |
| computerscience XI | 100% | Part I (2) | 100 | 0%, 0% | 100%, 39% | 0 of 0 |
| computerscience XI | 100% | Part II, Section A | 100 | 61%, 0% | 50%, 68% | 1 of 1 |
| computerscience XI | 100% | Part II, Section B | 99 | 0%, 0% | 17%, 98% | 0 of 0 |
| computerscience XI | 100% | Part II, Section C | 33 | 0%, 0% | 67%, 91% | 0 of 0 |
| computerscience XII | 0% | Part I (1) | 74 | 0%, 0% | 72%, 54% | 0 of 0 |
| computerscience XII | 0% | Part I (2) | 80 | 0%, 0% | 100%, 39% | 0 of 0 |
| computerscience XII | 0% | Part II, Section A | 100 | 61%, 0% | 50%, 34% | 1 of 1 |
| computerscience XII | 0% | Part II, Section B | 99 | 0%, 0% | 17%, 99% | 0 of 0 |
| computerscience XII | 0% | Part II, Section C | 98 | 0%, 0% | 67%, 79% | 0 of 0 |
| computerscience XII | 50% | Part I (1) | 96 | 0%, 0% | 72%, 55% | 0 of 0 |
| computerscience XII | 50% | Part I (2) | 100 | 0%, 0% | 100%, 39% | 0 of 0 |
| computerscience XII | 50% | Part II, Section A | 100 | 61%, 0% | 50%, 71% | 1 of 1 |
| computerscience XII | 50% | Part II, Section B | 99 | 0%, 0% | 17%, 100% | 0 of 0 |
| computerscience XII | 50% | Part II, Section C | 100 | 0%, 9% | 67%, 93% | 0 of 0 |
| computerscience XII | 100% | Part I (1) | 96 | 0%, 0% | 72%, 52% | 0 of 0 |
| computerscience XII | 100% | Part I (2) | 99 | 0%, 0% | 100%, 38% | 0 of 0 |
| computerscience XII | 100% | Part II, Section A | 67 | 61%, 0% | 50%, 100% | 1 of 1 |
| computerscience XII | 100% | Part II, Section B | 99 | 0%, 0% | 17%, 100% | 0 of 0 |
| computerscience XII | 100% | Part II, Section C | 72 | 0%, 15% | 67%, 100% | 0 of 0 |

## Teacher’s full papers

They come through the same builder, so a smaller sample shows that they agree.

| Class | Generated | Mean mix |
|---|---:|---:|
| physics XI | 0% | 84 |
| physics XI | 50% | 89 |
| physics XI | 100% | 75 |
| physics XII | 0% | 93 |
| physics XII | 50% | 93 |
| physics XII | 100% | 81 |
| chemistry XI | 0% | 91 |
| chemistry XI | 50% | 95 |
| chemistry XI | 100% | 58 |
| chemistry XII | 0% | 97 |
| chemistry XII | 50% | 98 |
| chemistry XII | 100% | 72 |
| mathematics XI | 0% | 100 |
| mathematics XI | 50% | 99 |
| mathematics XI | 100% | 77 |
| mathematics XII | 0% | 99 |
| mathematics XII | 50% | 97 |
| mathematics XII | 100% | 83 |
| computerscience XI | 0% | 89 |
| computerscience XI | 50% | 98 |
| computerscience XI | 100% | 85 |
| computerscience XII | 0% | 90 |
| computerscience XII | 50% | 98 |
| computerscience XII | 100% | 86 |
