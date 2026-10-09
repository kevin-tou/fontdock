# Changelog

All notable changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/), and the project adheres to [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- Optional third face **UI** (nav / buttons) in toolbar, registry, and `apply --ui`.
- Per-role **font-weight** controls in the live toolbar (and CSS variables in snippets).
- 16 new curated pairings (Instrument/Geist, Bricolage/Jakarta, Cinzel/Fauna, Epilogue/Manrope, Prata/Lato, Chivo/Overpass, Bodoni/Albert, Unbounded/Space, Cormorant/Proza, Outfit/Source Sans, Sentient/Satoshi, Ranade/General Sans, Zodiak/Switzer, Young Serif/Urbanist, Outfit/Urbanist, Bricolage/Satoshi/Space Grotesk). Syne/Inter was already shipped as Contemporary Indie.

### Changed

- **Renamed the project to fontdock** (CLI, skill `/fontdock`, npm package, GitHub repo). `fonty` was already taken on npm.
- Preview specimen is a long fontdock page (roles, type scale, reading, UI chrome) instead of a fake “Northstar” landing.
- Toolbar UX: chip + panel picker (search, weights, presets), mix icon, responsive wrap, smoother motion.
- **Done / `npx fontdock apply` copy an AI prompt** (roles, families, weights, CDN links) instead of writing CSS. The Cursor agent applies fonts to the stack, then `uninstall` removes the preview.
- Wider, more readable toolbar; search no longer rebuilds the input on each keystroke.

## 0.1.0 — 2026-10-09

### Added

- `npx fontdock init` installs the Cursor `/fontdock` skill, combo registry, and live toolbar.
- Toolbar: Display and Body dropdowns, curated presets, Random, Done, collapse (`Ctrl+Shift+F`).
- `npx fontdock apply <combo-id>` or `--display` / `--body`, then uninstalls preview scaffolding.
- `npx fontdock uninstall` removes toolbar, `public/__fontdock`, and the Cursor skill; applied CSS stays.
- Six core moods plus three extra OFL pairings.
- CI validates registry schema and CDN URLs.
