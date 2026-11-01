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
