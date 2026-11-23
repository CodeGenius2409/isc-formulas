# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: ISC Class XI and XII students (Physics, Chemistry, Mathematics, Computer Science) revising, looking up formulas, solving problems and practising, very often on a phone, and often with no connection.

Second: teachers, who build question papers with the teacher generator (sets A, B and C, answer keys, Word export).

## Product Purpose

Every ISC 2028 formula in one installable book that works offline, with the tools to use them: a problem solver, spaced-repetition practice, exam-style questions and timed mock papers, simulators, and step-through tracers for Java and Python. Success is a student finding the right formula fast, understanding it, and practising it until it sticks.

## Positioning

Mapped to the official 2028 syllabus, verified by machine where it can be (solver dimensions, RDKit structures, a real JDK and real Python for program answers), and fully usable offline after one visit.

## Operating Context

Students study at home and on the move, from a phone more than a laptop, alongside their textbook and exercise book. Teachers prepare papers on a laptop and print or export them to Word.

## Capabilities and Constraints

- Static site (Vite, React), deployed to GitHub Pages under a sub-path or to Vercel; installs as a PWA.
- Everything except Pyodide works offline after the first visit. Python is kept offline only on request.
- The first load must not grow without good reason.
- Private past papers (`papers/`, `data-private/`) never ship or get committed; `check-private` enforces it.

## Brand Commitments

- Name: ISC Formula Book.
- Free and unofficial. Nothing may imply CISCE endorsement. Generated questions are always marked as generated and possibly mistaken.

## Evidence on Hand

The formula data, question bank, blueprints, syllabus map and reports in `reports/`. No testimonials, user counts or endorsements exist; none may be invented.

## Product Principles

1. The formulas are the content; everything else serves finding and using them.
2. Works offline, on a phone, without waiting.
3. Correct before clever: answers are checked by machine wherever possible, and uncertainty is said, not hidden.
4. Honest about what is generated, unreviewed or outside the syllabus.

## Accessibility & Inclusion

WCAG 2.1 AA, in both themes and high contrast. Fully keyboard-usable; touch targets of 44 px on coarse pointers; motion respects `prefers-reduced-motion`.
