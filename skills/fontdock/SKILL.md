---
name: fontdock
description: Audits the current project, detects stack and visual identity (DA), recommends curated type pairings from fontdock, previews them with a live toolbar, then writes stack-native font integration from an apply prompt. Use when the user runs /fontdock, asks to pair fonts, pick typefaces, set typography, or define the project's artistic direction.
---

# fontdock — `/fontdock`

Reply in the user's language. Never invent fonts: only use combos from the registry.

Registry, in order of preference:

1. `public/__fontdock/combos.json` or `.fontdock/combos.json` in the current project
2. the `fontdock` package (`npx fontdock list`)
3. this skill's sibling knowledge in [snippets.md](snippets.md)

If `npx fontdock` is available, prefer CLI commands over hand-rolled file edits.

## Workflow

```
fontdock
- [ ] 1. Audit (stack, CSS, DA)
- [ ] 2. Recommend 2 combos + ask
- [ ] 3. Live toolbar, or apply from a prompt
- [ ] 4. Write fonts idiomatically, then uninstall scaffolding
```

## 1. Automatic audit

Inspect `package.json`, `tailwind.config.*`, CSS with `@theme` / `@tailwind` / `:root`, the homepage, and README.

Determine:

- **Stack**: Next.js App Router, Next.js Pages, Astro, Vite (React/Vue), Nuxt, SvelteKit, Remix, or plain HTML
- **CSS**: Tailwind v4 (`@theme` or `tailwindcss@4`), Tailwind v3 (`tailwind.config`), or native CSS variables
- **DA / mood**: SaaS tech, creative studio, warm editorial, neo-brutalist, artisanal, contemporary indie

Preferred:

```bash
npx fontdock detect --json
```

If the CLI is not installed, do the same inspection by reading files. Do not walk `node_modules`.

## 2. Recommend and ask

Print a short report, then stop and wait:

```markdown
**Stack & CSS:** {stack} + {css}
**DA:** {mood label} ({confidence})
**Evidence:** {2–5 signals}

**Option 1 — {combo.name}**
{Display} + {Body}
{rationale}

**Option 2 — {combo.name}**
{Display} + {Body}
{rationale}

Souhaitez-vous :
1. Appliquer définitivement l'Option 1 ou 2 (je l'écris dans le projet) ?
2. Lancer la **barre flottante** sur le site en local pour tester en direct ?
```

If the user writes in English, translate that question. Recommend the top two combos from detect scores; if scores are tied or empty, default to `saas-modern-tech` then `creative-studio-agency`.

Do not edit files in this phase.

## 3. Apply the choice

`npx fontdock apply` does **not** write CSS. It prints a prompt. You (the agent) apply that prompt.

### Permanent option 1 or 2

1. Run `npx fontdock apply {id}` (or `--display` / `--body` / `--ui`) and follow the printed prompt.
2. Inspect the stack yourself. Write idiomatic integration (`next/font/google` only when `nextFont` is set; Fontshare / Fontsource stay on `<link>` or `@import`).
3. Map headings to Display, body copy to Body, nav/buttons to UI if present.
4. **Uninstall immediately** (see §4).

Optional CSS dump if you want a starting snippet:

```bash
npx fontdock snippet {combo-id}
```

### Live toolbar

```bash
npx fontdock inject
```

Then tell the user to refresh the **dev** server. The toolbar is a white rounded pill (`<fontdock-toolbar>`):

- **Display**, **Body**, and optional **UI** chips (family + weight)
- curated **Presets**, shuffle, **Done**, collapse, `Ctrl+Shift+F`

**Done copies an apply prompt** to the clipboard. When the user pastes it (or tells you the families), follow it: write fonts, then `npx fontdock uninstall`.

## 4. Clean uninstall (mandatory when finished)

Never leave fontdock preview files in the consumer repo. After fonts are written:

```bash
npx fontdock uninstall
```

Removes:

- toolbar `<script>` from layouts
- `public/__fontdock/` or `.fontdock/`
- `.cursor/skills/fontdock` and `.cursor/rules/fontdock.mdc`

Keeps the CSS / `next/font` integration you just wrote.

Do not uninstall if the user is still previewing.

## 5. Guardrails

- Commercial-open licenses only (Fontshare ITF, Google Fonts OFL, Open Foundry OFL).
- Never pair two display faces from outside the registry.
- Toolbar script stays behind `development` / `import.meta.env.DEV` when the layout supports it.
