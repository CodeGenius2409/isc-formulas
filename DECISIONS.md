# Decisions

Calls made while building, so you can overrule any of them.

## Tooling: what was and wasn't installed

The Claude Code permission system blocked running remote installers
(`npx skills add ...`, flagged as "code from external"). I did not try to get
around that. So the **skills below were not installed**. I downloaded their text
as plain data and followed it by hand. Nothing from those repos was executed.

| Requested | Status | What actually happened |
|---|---|---|
| `frontend-design` | Not installed, text read | Followed `SKILL.md` from `anthropics/skills`, including its plan-and-review process and its list of generic defaults to avoid. |
| `ui-ux-pro-max` | Not installed, data read | Its search script was not run. I queried its CSV files (`typography`, `colors`, `products`, `motion`) directly. |
| Emil Kowalski's motion skills | Not installed, text read | Followed `emil-design-eng`, `animate`, `review-animations`, `animation-performance` and `mobile-native` from `emilkowalski/skills`. |
| `impeccable` | Not installed, text read | `/audit` and `/polish` cannot be run as commands, and its 62-rule detector binary was not run. I followed `audit.md`, `polish.md` and `craft-floor.md` by hand. See `reports/` for the results. |
| `gsap`, `lucide-react` | Installed | Normal npm dependencies. |
| React Bits | Copied in by hand | See the section below once it is used. |

To install the skills properly on your own machine, run these from the project root:

    npx skills@latest add emilkowalski/skills
    npx skills@latest add anthropics/skills --skill frontend-design
    npx impeccable install
    npx -p ui-ux-pro-max-cli uipro init --ai claude

npm dependencies were installed with `--ignore-scripts`, so no package lifecycle
scripts ran. Nothing in the build needs them.

## Git

Work is on a `rebuild` branch. `master` still holds your original files.

## Data and dedupe

- **A merged entry still shows in other units.** You asked for one entry shown in
  both places when two subjects need it. I applied the same rule across classes
  and units: a Class XII reader's table of standard derivatives must not have
  holes because the same rows exist in Class XI. It is stored once, so search,
  favourites and practice each see it once, and each place is tagged with where
  else it appears. Repeats inside the same unit collapse to one row. To change
  this, edit `resolvePlacements` in `scripts/lib/dedupe.mjs`.
- **Your near-duplicate example was kept apart.** `p-xi-1-11` and `p-xi-1-5` are
  the definition and the propagation rule, so they are not repeats. See
  `reports/dedupe-review.md`.
- **Your group counts did not reproduce.** The total of 8,736 and the subject
  split match, but I get 52 identical-LaTeX groups (you measured 65) and 199
  same-name groups (you measured 143). `reports/dedupe-report.md` shows the counts.
- **Conflicting entries were not merged.** Where two entries disagree on a fact,
  such as the d-block configuration or the nitration temperature, merging would
  silently pick one, so they went to the review file.
- **Data stays in per-chunk JSON.** Entries shown in more than one unit live in
  `shared.json`, which loads with any chunk.
