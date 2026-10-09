# fontdock

**Audit a codebase, preview curated type pairings live, then hand the choice to Cursor as a prompt.**

[![npm](https://img.shields.io/npm/v/fontdock)](https://www.npmjs.com/package/fontdock)
[![license](https://img.shields.io/npm/l/fontdock)](./LICENSE)
[![validate](https://img.shields.io/github/actions/workflow/status/kevin-tou/fontdock/validate.yml?label=validate)](https://github.com/kevin-tou/fontdock/actions)

```bash
npx fontdock@latest init
```

Then type **`/fontdock`** in Cursor.

## What you get

1. **A Cursor skill (`/fontdock`)** that inspects the repo (Next.js, Astro, Vite, HTML, Tailwind v3/v4), infers the artistic direction, and proposes two pairings.
2. **A live toolbar** (`<fontdock-toolbar>`) — white, black, rounded pill. Mix **Display**, **Body**, and optional **UI** independently. No rebuild.
3. **Done copies an apply prompt** (families, weights, CDN links). Paste it in Cursor: the agent writes stack-native CSS, then `npx fontdock uninstall` removes the preview.

## Quick start

```bash
npx fontdock@latest init
```

```text
Ready. Type /fontdock in Cursor Composer / Chat to start.
```

```bash
npx fontdock detect
npx fontdock inject              # floating bar on the local site
npx fontdock apply <combo-id>    # print the AI prompt (does not write CSS)
npx fontdock apply --display fraunces --body inter --ui public-sans
npx fontdock uninstall
npx fontdock list --fonts
```

## `/fontdock` flow

1. **Audit** — framework, CSS, mood.
2. **Dialogue** — two combos; commit via prompt or live toolbar.
3. **Apply** — agent writes idiomatic fonts from the prompt.
4. **Uninstall** — preview files gone; the fonts you wrote stay.

Toolbar: tap Display / Body / UI chips to pick a face **and weight**, Presets panel, shuffle, **Done** (copies the prompt), `Ctrl+Shift+F`. The format menu still copies a CSS snippet if you need one.

## Registry

| Mood | Display | Body | Source |
| --- | --- | --- | --- |
| SaaS & Modern Tech | Cabinet Grotesk | Satoshi | Fontshare |
| Creative Studio & Agency | Clash Display | General Sans | Fontshare |
| Warm Editorial & Luxe | Fraunces | Plus Jakarta Sans | Google Fonts |
| Tech Neo-Brutalist | Space Grotesk | Space Mono | Google Fonts |
| Artisanal & Humanist | Playfair Display | Work Sans | Google Fonts |
| Contemporary Indie | Syne | Inter | Open Foundry / GF |

New pairings: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Specimen

```bash
npm run preview
```

`http://localhost:4177`

## License

MIT. Font files remain under their foundry licenses (ITF Fontshare or SIL OFL).
