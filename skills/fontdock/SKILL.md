---
name: fontdock
description: Audits a project's stack and visual identity, recommends two type pairings, then waits. The user picks pairing 1, pairing 2, or the live preview bar. Use when the user runs /fontdock, asks to pair fonts, pick typefaces, set typography, or define the artistic direction.
---

# fontdock — `/fontdock`

You are the auditor. **Read the repo yourself.** Do not run `npx fontdock detect`. Reply in the user's language. Never invent fonts: only use the registry. **Do not inject the toolbar and do not write CSS until the user picks 1, 2, or 3.**

Registry, in order:

1. `.fontdock/combos.json` in the current project
2. `npx fontdock list` / `npx fontdock list --fonts`
3. [snippets.md](snippets.md)

## Workflow

```
/fontdock
- [ ] 1. Audit stack, CSS, DA — no file edits
- [ ] 2. Show 3 choices, then STOP
- [ ] 3. User replies 1 / 2 / 3
- [ ] 4. Act, then wait if they chose the bar
```

## 1. Audit (no edits)

Open `package.json`, configs, CSS, the real homepage / layout (Pug, Astro, `app/layout`, HTML). Treat `dist/` as build output only. Skip `node_modules`.

Determine, stack-aware:

- **Stack** — Next App/Pages, Astro, Vite, Nuxt, SvelteKit, Remix, Pug+static `dist`, or plain HTML
- **CSS** — Tailwind v4 / v3, Bootstrap, SCSS, CSS variables
- **DA** — SaaS, studio, editorial, brutalist, artisanal, indie — from copy, palette, current type, layout

If the DA is unclear, default combos: `saas-modern-tech` then `creative-studio-agency`.

## 2. Three choices, then wait

Print this, then **stop**. Do not inject. Do not write fonts.

```markdown
**Stack & CSS:** {stack} + {css}
**DA:** {mood} ({confidence})
**Evidence:** {2–5 signals}

**1 — {combo.name}**
{Display} {weight} + {Body} {weight}
{rationale}

**2 — {combo.name}**
{Display} {weight} + {Body} {weight}
{rationale}

**3 — Barre live**
Je pose la barre flottante sur le site. Tu mixes en local, tu fais Done, tu colles le prompt.

Réponds **1**, **2** ou **3**.
```

## 3. After they reply

### 1 or 2 — apply now

Write idiomatic fonts for this stack (`next/font/google` only when `nextFont` is set; Fontshare / Fontsource stay on `<link>` or `@import`). Headings → Display, body → Body, nav/buttons → UI if present. Then `npx fontdock uninstall` if preview files exist. Done.

### 3 — bar, then wait for the next prompt

Do **not** rely on `npx fontdock inject`. You:

1. Copy `.fontdock/fontdock-toolbar.js` and `.fontdock/combos.json` to the folder the **dev server actually serves** (`public/__fontdock`, `src/assets/__fontdock` if the build copies into `dist/assets`, …).
2. Add a module `<script>` to the **source** layout so rebuilds keep it. `src` must match the URL the browser will request.
3. Tell them to start / refresh the **dev** server, mix, hit **Done**.

Then **stop**. Do not apply fonts yet. The next user message is the Done prompt — write fonts from that, then uninstall.

The bar: Display / Body / UI chips, Presets, shuffle, **Done**, `Ctrl+Shift+F`. Keep it behind `development` / `import.meta.env.DEV` when the layout supports it.

## 4. Uninstall

```bash
npx fontdock uninstall
```

Keep the CSS you wrote. If the CLI is missing, delete the script + `__fontdock` / `.fontdock` + `.cursor/skills/fontdock`.

## Guardrails

- Commercial-open licenses only (Fontshare ITF, Google Fonts OFL, Open Foundry OFL).
- Never pair two display faces from outside the registry.
