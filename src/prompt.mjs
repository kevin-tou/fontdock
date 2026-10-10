import { stylesheetUrls } from "./snippets.mjs";

export function buildApplyPrompt(pair) {
  const lines = [
    "Apply these typefaces to the current project.",
    "You inspect the stack yourself (Next.js, Astro, Vite, Pug, HTML, Tailwind v3/v4). Do not run `npx fontdock detect`. Write idiomatic integration:",
    "- Google Fonts on Next.js → next/font/google when nextFont is set",
    "- Fontshare / Fontsource → <link> or CSS @import (never a fake next/font import)",
    "- Map headings (h1-h6, .font-display) to Display, body copy to Body, nav/buttons/.font-ui to UI if present",
    "- Then remove the live preview: `npx fontdock uninstall`",
    "- Do not invent other families.",
    "",
  ];

  if (pair.name && pair.name !== "Custom") {
    lines.push(`Preset: ${pair.name} (${pair.id})`);
    lines.push("");
  }

  lines.push(roleBlock("Display", "headings h1–h6 and .font-display", pair.display));
  lines.push(roleBlock("Body", "html, paragraphs, long copy", pair.body));
  if (pair.ui) lines.push(roleBlock("UI", "nav, buttons, labels, .font-ui", pair.ui));
  else lines.push("UI: none — reuse Body for chrome.");

  return lines.join("\n").trim() + "\n";
}

function roleBlock(label, usage, font) {
  const weight = font.weight ?? defaultWeight(font, label.toLowerCase());
  const urls = stylesheetUrls(font, weight);
  return [
    `${label} (${usage}): ${font.family} ${weight}`,
    `  font-family: ${font.cssFamily};`,
    `  font-weight: ${weight};`,
    ...urls.map((url) => `  CDN: ${url}`),
    font.page ? `  specimen: ${font.page}` : "",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

function defaultWeight(font, role) {
  const weights = font.weights?.length ? font.weights : [400, 500, 600, 700];
  if (role === "display") return weights.includes(700) ? 700 : weights[weights.length - 1];
  if (role === "ui") return weights.includes(500) ? 500 : weights[0];
  return weights.includes(400) ? 400 : weights[0];
}
