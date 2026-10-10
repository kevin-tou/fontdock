# fontdock

**Install a Cursor skill, preview type pairings live, then let the agent write them into your stack.**

[![npm](https://img.shields.io/npm/v/fontdock)](https://www.npmjs.com/package/fontdock)
[![license](https://img.shields.io/npm/l/fontdock)](./LICENSE)
[![validate](https://img.shields.io/github/actions/workflow/status/kevin-tou/fontdock/validate.yml?label=validate)](https://github.com/kevin-tou/fontdock/actions)

```bash
npx fontdock@latest init
```

Then type **`/fontdock`** in Cursor. The agent audits the repo, then you pick **1**, **2** (a pairing, applied now) or **3** (live bar on your site — mix, Done, paste the next prompt). No `detect` script, no bar until you choose 3.

## What you get

1. **A Cursor skill (`/fontdock`)** — stack-aware audit, then three choices.
2. **A live toolbar** (choice 3) — Display / Body / optional UI. **Done** copies the next prompt.
3. **Clean uninstall** — `npx fontdock uninstall` removes the preview. Fonts you wrote stay.

## Quick start

```bash
npx fontdock@latest init
```

```text
Type /fontdock in Cursor, or paste:

  Analyse ce repo (stack-aware) : stack, CSS, direction artistique.
  Propose deux paires + la barre live (choix 1 / 2 / 3), puis attends.
```

```bash
npx fontdock list --fonts
npx fontdock apply <combo-id>    # print the AI prompt (does not write CSS)
npx fontdock uninstall
```

## `/fontdock` flow

1. **Audit** — the agent reads the repo. No file edits yet.
2. **Three choices** — pairing 1, pairing 2, or the live bar. Then it waits.
3. **1 / 2** — fonts written now. **3** — bar on the real layout, wait for Done, apply on the next prompt.
4. **Uninstall** — preview files gone.

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
