# Contributing to fontdock

Repo: [github.com/kevin-tou/fontdock](https://github.com/kevin-tou/fontdock)

New type pairings go through GitHub Issues (`Propose a new combo`) then a PR that only touches `packages/registry/combos.json` unless you are also changing code.

## Combo eligibility

A pairing is accepted only if **all** of the following hold:

1. **Commercial + open license** — Fontshare (ITF), Google Fonts (OFL / Apache 2.0), or Open Foundry with a verifiable license URL. Rejected: Fontesk, Pixel Surplus, “Personal use only”.
2. **Public CDN, no key** — HTTPS stylesheet on `api.fontshare.com` or `fonts.googleapis.com`.
3. **Typographic contrast** — not two display faces, not two interchangeable UI grotesks.
4. **Stable identity** — kebab-case `id`; `mood` is `saas` | `studio` | `editorial` | `brutalist` | `artisanal` | `indie`; at least 3 audit `keywords`.

Each family needs `family`, `cssFamily`, `role`, `category`, `source`, `slug`, `weights`, `cdn`, `page`, `nextFont` (`null` when not on `next/font/google`).

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(toolbar): mix display and body independently
fix(cli): keep CSS markers when uninstalling
docs: describe the uninstall flow
chore(ci): ping CDN URLs on pull requests
```

- Imperative, present tense, 72-char subject.
- `feat` / `fix` bump the corresponding semver once a maintainer cuts a release.
- Do not mix a registry combo and a CLI refactor in the same commit.

## Releases

1. Move items from **Unreleased** in `CHANGELOG.md` into `## x.y.z — YYYY-MM-DD`.
2. Set `"version"` in `package.json` to `x.y.z`.
3. Commit `chore(release): x.y.z`.
4. Tag annotated: `git tag -a vX.Y.Z -m "fontdock vX.Y.Z"` and push the tag.
5. The **Release** workflow publishes a GitHub Release from the tag.

First public line is **0.1.0**. After that: patch for fixes, minor for features, major for breaking CLI / registry schema.

## Local checks

```bash
npm test
npm run validate
npm run validate:cdn
```

Keep the CLI dependency-free (Node 18+). The toolbar stays a single ES module / Web Component.
