# Generated papers against the real ones

Written by `tests/unit/paper-fidelity.test.ts`. Each row is 50 mock papers. The real figures are in `src/practice/bank/paper-targets.json`, counts only, from the recent board papers and specimens.

- **Shape** is sections, questions, marks per question, any-two sections and internal choices. It must match exactly, and the test fails if it doesn’t.
- **Mix** is out of 100: how much of a section’s questions fall on the same types as the real section’s, over the 50 papers.
- **Unit** is the same measure for marks by unit, against the syllabus. **Topic** is the correlation with how often the papers ask each topic, where 1 is perfect.
- **Figures** and **thinking** are real, then ours. Thinking is what the specimens tag as apply, analyse or evaluate. Boards don’t tag, so the real figure comes from the specimens.

## Summary

| Class | Generated | Shape | Mean mix | Lowest section | Unit | Topic |
|---|---:|---|---:|---|---:|---:|
| physics XI | 0% | Exact | 85 | Section D: 67 | 88 | 0.4 |
| physics XI | 50% | Exact | 90 | Section A: 87 | 97 | 0.53 |
| physics XI | 100% | Exact | 78 | Section D: 40 | 89 | 0.82 |
| physics XII | 0% | Exact | 95 | Section D: 89 | 92 | 0.75 |
| physics XII | 50% | Exact | 95 | Section D: 88 | 99 | 0.72 |
| physics XII | 100% | Exact | 81 | Section D: 40 | 92 | 0.6 |
| chemistry XI | 0% | Exact | 92 | Section C: 85 | 97 | 0.32 |
| chemistry XI | 50% | Exact | 95 | Section C: 86 | 97 | 0.59 |
| chemistry XI | 100% | Exact | 60 | Section D: 13 | 77 | 0.53 |
| chemistry XII | 0% | Exact | 97 | Section D: 94 | 94 | 0.94 |
| chemistry XII | 50% | Exact | 98 | Section A: 94 | 98 | 0.77 |
| chemistry XII | 100% | Exact | 73 | Section D: 12 | 85 | 0.92 |
| mathematics XI | 0% | Exact | 100 | Section D: 99 | 96 | 0.68 |
| mathematics XI | 50% | Exact | 100 | Section D: 99 | 100 | 0.49 |
| mathematics XI | 100% | Exact | 77 | Section D: 7 | 84 | 0.24 |
| mathematics XII | 0% | Exact | 100 | Section D: 98 | 93 | 0.78 |
| mathematics XII | 50% | Exact | 99 | Section D: 97 | 100 | 0.86 |
| mathematics XII | 100% | Exact | 83 | Section D: 34 | 88 | 0.77 |
| computerscience XI | 0% | Exact | 91 | Part I (1): 74 | 78 | -0.01 |
| computerscience XI | 50% | Exact | 99 | Part I (1): 97 | 82 | 0.4 |
| computerscience XI | 100% | Exact | 86 | Part II, Section C: 33 | 66 | 0.01 |
| computerscience XII | 0% | Exact | 90 | Part I (1): 74 | 91 | 0.77 |
| computerscience XII | 50% | Exact | 99 | Part I (1): 97 | 94 | 0.31 |
| computerscience XII | 100% | Exact | 87 | Part II, Section A: 67 | 80 | 0.83 |

## By section

| Class | Generated | Section | Mix | Figures, real then ours | Thinking, real then ours | Internal choices |
|---|---:|---|---:|---|---|---:|
| physics XI | 0% | Section A | 87 | 17%, 0% | 31%, 22% | 0 of 0 |
| physics XI | 0% | Section B | 97 | 35%, 4% | 52%, 63% | 2 of 2 |
| physics XI | 0% | Section C | 90 | 57%, 16% | 44%, 54% | 2 of 2 |
| physics XI | 0% | Section D | 67 | 57%, 5% | 89%, 37% | 2 of 2 |
| physics XI | 50% | Section A | 87 | 17%, 10% | 31%, 20% | 0 of 0 |
| physics XI | 50% | Section B | 97 | 35%, 12% | 52%, 54% | 2 of 2 |
| physics XI | 50% | Section C | 89 | 57%, 18% | 44%, 47% | 2 of 2 |
| physics XI | 50% | Section D | 88 | 57%, 12% | 89%, 67% | 2 of 2 |
| physics XI | 100% | Section A | 86 | 17%, 12% | 31%, 23% | 0 of 0 |
| physics XI | 100% | Section B | 98 | 35%, 17% | 52%, 37% | 2 of 2 |
| physics XI | 100% | Section C | 88 | 57%, 23% | 44%, 39% | 2 of 2 |
| physics XI | 100% | Section D | 40 | 57%, 33% | 89%, 69% | 2 of 2 |
| physics XII | 0% | Section A | 96 | 17%, 4% | 31%, 24% | 0 of 0 |
| physics XII | 0% | Section B | 96 | 35%, 5% | 52%, 45% | 2 of 2 |
| physics XII | 0% | Section C | 97 | 57%, 28% | 44%, 53% | 2 of 2 |
| physics XII | 0% | Section D | 89 | 57%, 48% | 89%, 91% | 2 of 2 |
| physics XII | 50% | Section A | 95 | 17%, 11% | 31%, 19% | 0 of 0 |
| physics XII | 50% | Section B | 97 | 35%, 16% | 52%, 40% | 2 of 2 |
| physics XII | 50% | Section C | 98 | 57%, 34% | 44%, 48% | 2 of 2 |
| physics XII | 50% | Section D | 88 | 57%, 54% | 89%, 95% | 2 of 2 |
| physics XII | 100% | Section A | 92 | 17%, 14% | 31%, 20% | 0 of 0 |
| physics XII | 100% | Section B | 98 | 35%, 21% | 52%, 36% | 2 of 2 |
| physics XII | 100% | Section C | 93 | 57%, 39% | 44%, 40% | 2 of 2 |
| physics XII | 100% | Section D | 40 | 57%, 63% | 89%, 100% | 2 of 2 |
| chemistry XI | 0% | Section A | 95 | 1%, 0% | 45%, 22% | 0 of 0 |
| chemistry XI | 0% | Section B | 99 | 0%, 0% | 50%, 27% | 2 of 2 |
| chemistry XI | 0% | Section C | 85 | 2%, 0% | 43%, 23% | 2 of 2 |
| chemistry XI | 0% | Section D | 87 | 10%, 0% | 78%, 39% | 2 of 2 |
| chemistry XI | 50% | Section A | 95 | 1%, 2% | 45%, 22% | 0 of 0 |
| chemistry XI | 50% | Section B | 99 | 0%, 0% | 50%, 28% | 2 of 2 |
| chemistry XI | 50% | Section C | 86 | 2%, 0% | 43%, 18% | 2 of 2 |
| chemistry XI | 50% | Section D | 98 | 10%, 0% | 78%, 32% | 2 of 2 |
| chemistry XI | 100% | Section A | 94 | 1%, 1% | 45%, 22% | 0 of 0 |
| chemistry XI | 100% | Section B | 89 | 0%, 0% | 50%, 27% | 2 of 2 |
| chemistry XI | 100% | Section C | 42 | 2%, 0% | 43%, 62% | 2 of 2 |
| chemistry XI | 100% | Section D | 13 | 10%, 0% | 78%, 100% | 2 of 2 |
| chemistry XII | 0% | Section A | 95 | 1%, 0% | 45%, 28% | 0 of 0 |
| chemistry XII | 0% | Section B | 99 | 0%, 0% | 50%, 38% | 2 of 2 |
| chemistry XII | 0% | Section C | 99 | 2%, 0% | 43%, 59% | 2 of 2 |
| chemistry XII | 0% | Section D | 94 | 10%, 0% | 78%, 65% | 2 of 2 |
| chemistry XII | 50% | Section A | 94 | 1%, 4% | 45%, 24% | 0 of 0 |
| chemistry XII | 50% | Section B | 99 | 0%, 0% | 50%, 32% | 2 of 2 |
| chemistry XII | 50% | Section C | 99 | 2%, 0% | 43%, 45% | 2 of 2 |
| chemistry XII | 50% | Section D | 98 | 10%, 0% | 78%, 86% | 2 of 2 |
| chemistry XII | 100% | Section A | 94 | 1%, 2% | 45%, 22% | 0 of 0 |
| chemistry XII | 100% | Section B | 99 | 0%, 0% | 50%, 28% | 2 of 2 |
| chemistry XII | 100% | Section C | 86 | 2%, 0% | 43%, 13% | 2 of 2 |
| chemistry XII | 100% | Section D | 12 | 10%, 0% | 78%, 100% | 2 of 2 |
| mathematics XI | 0% | Section A | 100 | 5%, 0% | 16%, 16% | 0 of 0 |
| mathematics XI | 0% | Section B | 100 | 0%, 0% | 29%, 29% | 3 of 3 |
| mathematics XI | 0% | Section C | 100 | 14%, 0% | 57%, 70% | 3 of 3 |
| mathematics XI | 0% | Section D | 99 | 0%, 0% | 100%, 100% | 3 of 3 |
| mathematics XI | 50% | Section A | 100 | 5%, 0% | 16%, 16% | 0 of 0 |
| mathematics XI | 50% | Section B | 100 | 0%, 0% | 29%, 29% | 3 of 3 |
| mathematics XI | 50% | Section C | 100 | 14%, 0% | 57%, 76% | 3 of 3 |
| mathematics XI | 50% | Section D | 99 | 0%, 0% | 100%, 99% | 3 of 3 |
| mathematics XI | 100% | Section A | 100 | 5%, 0% | 16%, 16% | 0 of 0 |
| mathematics XI | 100% | Section B | 100 | 0%, 0% | 29%, 29% | 3 of 3 |
| mathematics XI | 100% | Section C | 100 | 14%, 0% | 57%, 81% | 3 of 3 |
| mathematics XI | 100% | Section D | 7 | 0%, 0% | 100%, 86% | 3 of 3 |
| mathematics XII | 0% | Section A | 100 | 11%, 0% | 37%, 35% | 0 of 0 |
| mathematics XII | 0% | Section B | 100 | 0%, 0% | 57%, 79% | 3 of 3 |
| mathematics XII | 0% | Section C | 100 | 29%, 0% | 71%, 76% | 3 of 3 |
| mathematics XII | 0% | Section D | 98 | 20%, 0% | 100%, 88% | 3 of 3 |
| mathematics XII | 50% | Section A | 100 | 11%, 0% | 37%, 28% | 0 of 0 |
| mathematics XII | 50% | Section B | 99 | 0%, 0% | 57%, 79% | 3 of 3 |
| mathematics XII | 50% | Section C | 100 | 29%, 3% | 71%, 72% | 3 of 3 |
| mathematics XII | 50% | Section D | 97 | 20%, 0% | 100%, 96% | 3 of 3 |
| mathematics XII | 100% | Section A | 100 | 11%, 0% | 37%, 21% | 0 of 0 |
| mathematics XII | 100% | Section B | 98 | 0%, 0% | 57%, 77% | 3 of 3 |
| mathematics XII | 100% | Section C | 100 | 29%, 7% | 71%, 61% | 3 of 3 |
| mathematics XII | 100% | Section D | 34 | 20%, 18% | 100%, 100% | 3 of 3 |
| computerscience XI | 0% | Part I (1) | 74 | 0%, 0% | 72%, 51% | 0 of 0 |
| computerscience XI | 0% | Part I (2) | 80 | 0%, 0% | 100%, 37% | 0 of 0 |
| computerscience XI | 0% | Part II, Section A | 100 | 61%, 0% | 50%, 38% | 1 of 1 |
| computerscience XI | 0% | Part II, Section B | 99 | 0%, 0% | 17%, 97% | 0 of 0 |
| computerscience XI | 0% | Part II, Section C | 100 | 0%, 0% | 67%, 61% | 0 of 0 |
| computerscience XI | 50% | Part I (1) | 97 | 0%, 0% | 72%, 53% | 0 of 0 |
| computerscience XI | 50% | Part I (2) | 99 | 0%, 0% | 100%, 38% | 0 of 0 |
| computerscience XI | 50% | Part II, Section A | 100 | 61%, 0% | 50%, 56% | 1 of 1 |
| computerscience XI | 50% | Part II, Section B | 99 | 0%, 0% | 17%, 99% | 0 of 0 |
| computerscience XI | 50% | Part II, Section C | 99 | 0%, 0% | 67%, 60% | 0 of 0 |
| computerscience XI | 100% | Part I (1) | 96 | 0%, 0% | 72%, 52% | 0 of 0 |
| computerscience XI | 100% | Part I (2) | 100 | 0%, 0% | 100%, 39% | 0 of 0 |
| computerscience XI | 100% | Part II, Section A | 100 | 61%, 0% | 50%, 68% | 1 of 1 |
| computerscience XI | 100% | Part II, Section B | 99 | 0%, 0% | 17%, 98% | 0 of 0 |
| computerscience XI | 100% | Part II, Section C | 33 | 0%, 0% | 67%, 91% | 0 of 0 |
| computerscience XII | 0% | Part I (1) | 74 | 0%, 0% | 72%, 54% | 0 of 0 |
| computerscience XII | 0% | Part I (2) | 80 | 0%, 0% | 100%, 40% | 0 of 0 |
| computerscience XII | 0% | Part II, Section A | 100 | 61%, 0% | 50%, 38% | 1 of 1 |
| computerscience XII | 0% | Part II, Section B | 100 | 0%, 0% | 17%, 97% | 0 of 0 |
| computerscience XII | 0% | Part II, Section C | 97 | 0%, 0% | 67%, 76% | 0 of 0 |
| computerscience XII | 50% | Part I (1) | 97 | 0%, 0% | 72%, 54% | 0 of 0 |
| computerscience XII | 50% | Part I (2) | 99 | 0%, 0% | 100%, 38% | 0 of 0 |
| computerscience XII | 50% | Part II, Section A | 100 | 61%, 0% | 50%, 61% | 1 of 1 |
| computerscience XII | 50% | Part II, Section B | 100 | 0%, 0% | 17%, 99% | 0 of 0 |
| computerscience XII | 50% | Part II, Section C | 100 | 0%, 11% | 67%, 89% | 0 of 0 |
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
| physics XI | 50% | 88 |
| physics XI | 100% | 75 |
| physics XII | 0% | 95 |
| physics XII | 50% | 94 |
| physics XII | 100% | 81 |
| chemistry XI | 0% | 91 |
| chemistry XI | 50% | 94 |
| chemistry XI | 100% | 58 |
| chemistry XII | 0% | 96 |
| chemistry XII | 50% | 97 |
| chemistry XII | 100% | 72 |
| mathematics XI | 0% | 99 |
| mathematics XI | 50% | 99 |
| mathematics XI | 100% | 77 |
| mathematics XII | 0% | 98 |
| mathematics XII | 50% | 99 |
| mathematics XII | 100% | 83 |
| computerscience XI | 0% | 89 |
| computerscience XI | 50% | 97 |
| computerscience XI | 100% | 85 |
| computerscience XII | 0% | 90 |
| computerscience XII | 50% | 98 |
| computerscience XII | 100% | 86 |
