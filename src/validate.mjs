import { loadRegistry, listFonts } from "./registry.mjs";

const MOODS = new Set(["saas", "studio", "editorial", "brutalist", "artisanal", "indie"]);
const ROLES = new Set(["display", "body", "ui"]);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 fontdock/0.1";

export function validateRegistry(registry = loadRegistry()) {
  const errors = [];
  const warnings = [];
  if (registry.version !== 1) errors.push("registry.version must be 1");
  if (!Array.isArray(registry.combos) || registry.combos.length === 0) {
    errors.push("registry.combos must be a non-empty array");
    return { ok: false, errors, warnings };
  }

  const ids = new Set();
  for (const combo of registry.combos) {
    const prefix = combo?.id ?? "(missing id)";
    if (!combo.id || !/^[a-z0-9-]+$/.test(combo.id)) {
      errors.push(`${prefix}: id must be kebab-case`);
    }
    if (ids.has(combo.id)) errors.push(`${prefix}: duplicate id`);
    ids.add(combo.id);
    if (!combo.name) errors.push(`${prefix}: missing name`);
    if (!MOODS.has(combo.mood)) errors.push(`${prefix}: mood must be one of ${[...MOODS].join(", ")}`);
    if (!Array.isArray(combo.keywords) || combo.keywords.length < 3) {
      errors.push(`${prefix}: at least 3 keywords required`);
    }
    if (!combo.rationale) errors.push(`${prefix}: missing rationale`);
    validateFont(combo.display, `${prefix}.display`, errors);
    validateFont(combo.body, `${prefix}.body`, errors);
    if (combo.ui) {
      validateFont(combo.ui, `${prefix}.ui`, errors);
      if (combo.ui.role !== "ui") errors.push(`${prefix}: ui.role must be "ui"`);
    }
    if (combo.display?.family && combo.display.family === combo.body?.family) {
      errors.push(`${prefix}: display and body cannot be the same family`);
    }
    if (combo.display?.category === "display" && combo.body?.category === "display") {
      errors.push(`${prefix}: two display faces — no hierarchy`);
    }
    if (combo.display?.role !== "display") errors.push(`${prefix}: display.role must be "display"`);
    if (combo.body?.role !== "body") errors.push(`${prefix}: body.role must be "body"`);
  }

  return { ok: errors.length === 0, errors, warnings };
}

function validateFont(font, prefix, errors) {
  if (!font) {
    errors.push(`${prefix}: missing`);
    return;
  }
  for (const key of ["family", "cssFamily", "role", "category", "source", "cdn", "page", "slug"]) {
    if (!font[key]) errors.push(`${prefix}: missing ${key}`);
  }
  if (!Array.isArray(font.weights) || font.weights.length === 0) {
    errors.push(`${prefix}: weights must be a non-empty array`);
  }
  if (font.role && !ROLES.has(font.role)) errors.push(`${prefix}: invalid role`);
  if (font.cdn && !font.cdn.startsWith("https://")) errors.push(`${prefix}: cdn must be https`);
  if (font.page && !font.page.startsWith("https://")) errors.push(`${prefix}: page must be https`);
  if (font.cdn && /[?&]key=/.test(font.cdn)) errors.push(`${prefix}: CDN must not require an API key`);
  if (font.cdnPattern && !font.cdnPattern.includes("{weight}")) {
    errors.push(`${prefix}: cdnPattern must include {weight}`);
  }
}

export async function validateCdns(registry = loadRegistry()) {
  const errors = [];
  const urls = new Set();
  const fonts = registry === loadRegistry() ? listFonts() : uniqueFonts(registry);
  for (const font of fonts) {
    urls.add(font.cdn);
    urls.add(font.page);
  }
  for (const url of urls) {
    const result = await ping(url);
    if (!result.ok) errors.push(`${url} → ${result.status}`);
  }
  return { ok: errors.length === 0, errors };
}

function uniqueFonts(registry) {
  const bySlug = new Map();
  for (const combo of registry.combos) {
    for (const font of [combo.display, combo.body, combo.ui]) {
      if (font?.slug) bySlug.set(font.slug, font);
    }
  }
  return [...bySlug.values()];
}

async function ping(url) {
  try {
    const head = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": UA } });
    if (head.ok || [301, 302, 303, 307, 308].includes(head.status)) {
      return { ok: true, status: head.status };
    }
    const get = await fetch(url, { method: "GET", redirect: "follow", headers: { "User-Agent": UA } });
    return { ok: get.ok, status: get.status };
  } catch (error) {
    return { ok: false, status: error.message };
  }
}
