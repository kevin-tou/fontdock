# Changelog

All notable changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/), and the project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

## 0.1.1 — 2026-10-10

### Fixed

- Live toolbar now remaps common body tokens (`--body`, `--font-sans`, `--font-text`, …) and targets `p` / lists, so copy on sites like `.site { font-family: var(--body) }` actually changes.

## 0.1.0 — 2026-10-10

### Added

- `npx fontdock init` installs the Cursor `/fontdock` skill, combo registry, and live toolbar.
- Toolbar: Display / Body / optional **UI**, per-role weights, curated presets, Random, Done, collapse (`Ctrl+Shift+F`).
- `npx fontdock apply <combo-id>` or `--display` / `--body` / `--ui` prints an AI apply prompt (does not write CSS).
- `npx fontdock uninstall` removes toolbar, `__fontdock` / `.fontdock`, and the Cursor skill; applied CSS stays.
- 25 curated pairings (six core moods plus extras: Instrument/Geist, Bricolage/Jakarta, Outfit/Urbanist, Bricolage/Satoshi/Space Grotesk, …).
- CI validates registry schema and CDN URLs.

### Changed

- **`/fontdock` is the auditor.** After the audit: three choices (pairing 1, pairing 2, or live bar). The bar is not injected by default. If they pick 3, the agent places it on the real layout and waits for the Done prompt.
- Preview specimen is a long fontdock page instead of a fake branded landing.
- Toolbar UX: chip + panel picker (search, weights, presets), mix icon, responsive wrap.
- **Done / `npx fontdock apply` copy an AI prompt** (roles, families, weights, CDN links). The Cursor agent writes fonts, then uninstall removes the preview.
