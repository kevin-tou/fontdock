import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "packages", "registry", "combos.json");
const data = JSON.parse(readFileSync(path, "utf8"));

data.sources.fontsource = {
  label: "Fontsource (jsDelivr CDN)",
  license: "SIL Open Font License 1.1 (per-family)",
  licenseUrl: "https://fontsource.org",
  preconnect: ["https://cdn.jsdelivr.net"],
};

function gf(family, { slug, weights, category, role = "display", nextFont, variable = true } = {}) {
  slug = slug || family.toLowerCase().replaceAll(" ", "-");
  const enc = family.replaceAll(" ", "+");
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  let cdn;
  if (weights.length === 1) {
    cdn = `https://fonts.googleapis.com/css2?family=${enc}&display=swap`;
  } else if (variable && max !== min) {
    cdn = `https://fonts.googleapis.com/css2?family=${enc}:wght@${min}..${max}&display=swap`;
  } else {
    cdn = `https://fonts.googleapis.com/css2?family=${enc}:wght@${weights.join(";")}&display=swap`;
  }
  const stack =
    category === "serif"
      ? `"${family}", ui-serif, Georgia, serif`
      : family.includes(" ")
        ? `"${family}", ui-sans-serif, system-ui, sans-serif`
        : `${family}, ui-sans-serif, system-ui, sans-serif`;
  return {
    family,
    cssFamily: stack,
    role,
    category,
    source: "google",
    slug,
    weights,
    cdn,
    page: `https://fonts.google.com/specimen/${enc}`,
    nextFont: nextFont === undefined ? family.replaceAll(" ", "_") : nextFont,
  };
}

function fs(family, { slug, weights, category, role = "display" } = {}) {
  slug = slug || family.toLowerCase().replaceAll(" ", "-");
  const stack =
    category === "serif"
      ? `"${family}", ui-serif, Georgia, serif`
      : `"${family}", ui-sans-serif, system-ui, sans-serif`;
  return {
    family,
    cssFamily: stack,
    role,
    category,
    source: "fontshare",
    slug,
    weights,
    cdn: `https://api.fontshare.com/v2/css?f[]=${slug}@${weights.join(",")}&display=swap`,
    page: `https://www.fontshare.com/fonts/${slug}`,
    nextFont: null,
  };
}

const geist = {
  family: "Geist Sans",
  cssFamily: '"Geist Sans", ui-sans-serif, system-ui, sans-serif',
  role: "body",
  category: "sans",
  source: "fontsource",
  slug: "geist-sans",
  weights: [400, 500, 600, 700],
  cdn: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.3.0/index.css",
  page: "https://fontsource.org/fonts/geist-sans",
  nextFont: null,
};

const F = {
  bricolage: gf("Bricolage Grotesque", { weights: [400, 500, 600, 700, 800], category: "display" }),
  jakarta: gf("Plus Jakarta Sans", { weights: [400, 500, 600, 700], category: "sans", role: "body" }),
  cinzel: gf("Cinzel", { weights: [400, 500, 600, 700], category: "serif" }),
  fauna: gf("Fauna One", { weights: [400], category: "serif", role: "body", variable: false, nextFont: "Fauna_One" }),
  epilogue: gf("Epilogue", { weights: [400, 500, 600, 700, 800], category: "sans" }),
  manrope: gf("Manrope", { weights: [400, 500, 600, 700], category: "sans", role: "body" }),
  prata: gf("Prata", { weights: [400], category: "serif", variable: false }),
  lato: gf("Lato", { weights: [400, 700], category: "sans", role: "body", variable: false }),
  chivo: gf("Chivo", { weights: [400, 500, 700], category: "sans" }),
  overpass: gf("Overpass", { weights: [400, 500, 600, 700], category: "sans", role: "body" }),
  bodoni: gf("Bodoni Moda", { weights: [400, 500, 600, 700], category: "serif" }),
  albert: gf("Albert Sans", { weights: [400, 500, 600, 700], category: "sans", role: "body" }),
  unbounded: gf("Unbounded", { weights: [400, 500, 600, 700], category: "display" }),
  space: gf("Space Grotesk", { weights: [400, 500, 700], category: "sans", role: "body" }),
  cormorant: gf("Cormorant Garamond", { weights: [400, 500, 600, 700], category: "serif", variable: false }),
  proza: gf("Proza Libre", { weights: [400, 500, 600, 700], category: "sans", role: "body", variable: false }),
  outfit: gf("Outfit", { weights: [400, 500, 600, 700], category: "sans" }),
  source: gf("Source Sans 3", {
    slug: "source-sans-3",
    weights: [400, 500, 600, 700],
    category: "sans",
    role: "body",
    nextFont: "Source_Sans_3",
  }),
  sentient: fs("Sentient", { weights: [400, 500, 700], category: "serif" }),
  satoshi: fs("Satoshi", { weights: [400, 500, 700], category: "sans", role: "body" }),
  ranade: fs("Ranade", { weights: [400, 500, 700], category: "sans" }),
  general: fs("General Sans", { weights: [400, 500, 600], category: "sans", role: "body" }),
  zodiak: fs("Zodiak", { weights: [400, 500, 700], category: "serif" }),
  switzer: fs("Switzer", { weights: [400, 500, 600, 700], category: "sans", role: "body" }),
  young: gf("Young Serif", { weights: [400], category: "serif", variable: false }),
  urbanist: gf("Urbanist", { weights: [400, 500, 600, 700], category: "sans", role: "body" }),
  instrument: gf("Instrument Serif", { weights: [400], category: "serif", variable: false }),
  geist,
};

function role(font, r) {
  return { ...font, role: r };
}

const newCombos = [
  {
    id: "instrument-geist",
    name: "Instrument & Geist",
    mood: "saas",
    keywords: ["product", "vercel", "developer", "dashboard", "clean"],
    rationale: "Instrument Serif adds editorial sharpness; Geist Sans is the modern product UI workhorse.",
    display: role(F.instrument, "display"),
    body: role(F.geist, "body"),
    ui: role(F.geist, "ui"),
  },
  {
    id: "bricolage-jakarta",
    name: "Bricolage & Jakarta",
    mood: "studio",
    keywords: ["playful", "brand", "startup", "friendly", "creative"],
    rationale: "Bricolage Grotesque is quirky on titles; Plus Jakarta Sans keeps long copy calm.",
    display: role(F.bricolage, "display"),
    body: role(F.jakarta, "body"),
  },
  {
    id: "cinzel-fauna",
    name: "Cinzel & Fauna",
    mood: "editorial",
    keywords: ["luxury", "heritage", "wedding", "classic", "elegant"],
    rationale: "Cinzel carries ceremonial display energy; Fauna One softens reading with a human serif.",
    display: role(F.cinzel, "display"),
    body: role(F.fauna, "body"),
  },
  {
    id: "epilogue-manrope",
    name: "Epilogue & Manrope",
    mood: "saas",
    keywords: ["geometric", "app", "modern", "mobile", "clean"],
    rationale: "Epilogue is a confident geometric display; Manrope is rounded and highly legible in UI.",
    display: role(F.epilogue, "display"),
    body: role(F.manrope, "body"),
    ui: role(F.manrope, "ui"),
  },
  {
    id: "prata-lato",
    name: "Prata & Lato",
    mood: "editorial",
    keywords: ["fashion", "magazine", "classic", "blog", "serif"],
    rationale: "Prata is a high-contrast fashion display; Lato is a neutral humanist body.",
    display: role(F.prata, "display"),
    body: role(F.lato, "body"),
  },
  {
    id: "chivo-overpass",
    name: "Chivo & Overpass",
    mood: "saas",
    keywords: ["tech", "industrial", "neutral", "docs", "system"],
    rationale: "Chivo is sturdy and slightly mechanical; Overpass reads cleanly in dense interfaces.",
    display: role(F.chivo, "display"),
    body: role(F.overpass, "body"),
    ui: role(F.overpass, "ui"),
  },
  {
    id: "bodoni-albert",
    name: "Bodoni & Albert",
    mood: "editorial",
    keywords: ["fashion", "luxe", "editorial", "high-fashion", "chic"],
    rationale: "Bodoni Moda delivers classic high fashion; Albert Sans keeps captions modern.",
    display: role(F.bodoni, "display"),
    body: role(F.albert, "body"),
  },
  {
    id: "unbounded-space",
    name: "Unbounded & Space",
    mood: "indie",
    keywords: ["bold", "experimental", "tech", "sport", "display"],
    rationale: "Unbounded is loud and contemporary; Space Grotesk grounds it with engineered body copy.",
    display: role(F.unbounded, "display"),
    body: role(F.space, "body"),
  },
  {
    id: "cormorant-proza",
    name: "Cormorant & Proza",
    mood: "editorial",
    keywords: ["literature", "book", "heritage", "story", "reading"],
    rationale: "Cormorant Garamond is literary display; Proza Libre is a readable humanist text face.",
    display: role(F.cormorant, "display"),
    body: role(F.proza, "body"),
  },
  {
    id: "outfit-source",
    name: "Outfit & Source Sans",
    mood: "saas",
    keywords: ["friendly", "product", "docs", "neutral", "ui"],
    rationale: "Outfit is soft-geometric for headlines; Source Sans 3 is a proven UI/text family.",
    display: role(F.outfit, "display"),
    body: role(F.source, "body"),
    ui: role(F.source, "ui"),
  },
  {
    id: "sentient-satoshi",
    name: "Sentient & Satoshi",
    mood: "studio",
    keywords: ["brand", "agency", "serif", "modern", "portfolio"],
    rationale: "Sentient brings contemporary serif character; Satoshi is the Fontshare product default.",
    display: role(F.sentient, "display"),
    body: role(F.satoshi, "body"),
  },
  {
    id: "ranade-general",
    name: "Ranade & General Sans",
    mood: "saas",
    keywords: ["clean", "startup", "dashboard", "minimal", "b2b"],
    rationale: "Ranade is a sharp Indian Type Foundry display; General Sans handles UI copy with ease.",
    display: role(F.ranade, "display"),
    body: role(F.general, "body"),
    ui: role(F.general, "ui"),
  },
  {
    id: "zodiak-switzer",
    name: "Zodiak & Switzer",
    mood: "editorial",
    keywords: ["magazine", "editorial", "news", "serif", "refined"],
    rationale: "Zodiak is a versatile editorial serif; Switzer is a neutral grotesque for interface chrome.",
    display: role(F.zodiak, "display"),
    body: role(F.switzer, "body"),
    ui: role(F.switzer, "ui"),
  },
  {
    id: "young-urbanist",
    name: "Young Serif & Urbanist",
    mood: "indie",
    keywords: ["culture", "blog", "friendly", "city", "editorial"],
    rationale: "Young Serif is warm and slightly naive; Urbanist keeps the system geometric and current.",
    display: role(F.young, "display"),
    body: role(F.urbanist, "body"),
    ui: role(F.urbanist, "ui"),
  },
];

const existing = new Set(data.combos.map((combo) => combo.id));
let added = 0;
for (const combo of newCombos) {
  if (existing.has(combo.id)) continue;
  data.combos.push(combo);
  existing.add(combo.id);
  added += 1;
}

data.updated = "2026-10-09";
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`added ${added}; total ${data.combos.length}`);
