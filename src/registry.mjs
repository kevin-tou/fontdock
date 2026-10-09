import { readFileSync } from "node:fs";
import { COMBOS_PATH } from "./paths.mjs";

let cached;

export function loadRegistry(path = COMBOS_PATH) {
  if (cached && path === COMBOS_PATH) return cached;
  const raw = JSON.parse(readFileSync(path, "utf8"));
  if (!raw || !Array.isArray(raw.combos)) {
    throw new Error(`Invalid combos registry at ${path}`);
  }
  if (path === COMBOS_PATH) cached = raw;
  return raw;
}

export function listCombos() {
  return loadRegistry().combos;
}

export function getCombo(id) {
  return listCombos().find((combo) => combo.id === id) ?? null;
}

export function comboLabel(combo) {
  const base = `${combo.display.family} + ${combo.body.family}`;
  return combo.ui ? `${base} + ${combo.ui.family}` : base;
}

export function listFonts() {
  const byId = new Map();
  for (const combo of listCombos()) {
    for (const font of [combo.display, combo.body, combo.ui]) {
      if (!font?.slug) continue;
      const existing = byId.get(font.slug);
      if (existing) {
        if (font.role && !existing.roles.includes(font.role)) existing.roles.push(font.role);
        continue;
      }
      byId.set(font.slug, { ...font, id: font.slug, roles: [font.role].filter(Boolean) });
    }
  }
  return [...byId.values()].sort((a, b) => a.family.localeCompare(b.family));
}

export function getFont(id) {
  if (!id) return null;
  const needle = String(id).toLowerCase();
  return (
    listFonts().find(
      (font) =>
        font.id === needle ||
        font.slug === needle ||
        font.family.toLowerCase() === needle,
    ) ?? null
  );
}

export function fontsForRole(role) {
  const fonts = listFonts();
  const preferred = fonts.filter((font) => font.roles.includes(role));
  const rest = fonts.filter((font) => !font.roles.includes(role));
  return { preferred, rest, all: fonts };
}

export function pairFromFonts(display, body, ui = null) {
  const match = listCombos().find((combo) => {
    if (combo.display.slug !== display.slug || combo.body.slug !== body.slug) return false;
    const comboUi = combo.ui?.slug ?? null;
    const currentUi = ui?.slug ?? null;
    return comboUi === currentUi;
  });
  if (match) return match;
  return {
    id: `custom:${display.slug}+${body.slug}${ui ? `+${ui.slug}` : ""}`,
    name: "Custom",
    custom: true,
    display: { ...display, role: "display" },
    body: { ...body, role: "body" },
    ...(ui ? { ui: { ...ui, role: "ui" } } : {}),
  };
}

export function resolvePair({ comboId, display, body, ui } = {}) {
  if (comboId) {
    const combo = getCombo(comboId);
    if (!combo) {
      const ids = listCombos()
        .map((item) => item.id)
        .join(", ");
      throw new Error(`Unknown combo "${comboId}". Available: ${ids}`);
    }
    return combo;
  }
  const displayFont = getFont(display);
  const bodyFont = getFont(body);
  if (!displayFont) throw new Error(`Unknown display font "${display}". Try: npx fontdock list --fonts`);
  if (!bodyFont) throw new Error(`Unknown body font "${body}". Try: npx fontdock list --fonts`);
  const uiFont = ui ? getFont(ui) : null;
  if (ui && !uiFont) throw new Error(`Unknown UI font "${ui}". Try: npx fontdock list --fonts`);
  return pairFromFonts(displayFont, bodyFont, uiFont);
}
