import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { listCombos } from "./registry.mjs";

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  ".output",
  ".vercel",
  ".turbo",
  "coverage",
  ".astro",
  "out",
  ".svelte-kit",
  ".cache",
]);

const TEXT_EXTS = new Set([
  ".json",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".css",
  ".scss",
  ".html",
  ".astro",
  ".vue",
  ".svelte",
  ".md",
  ".mdx",
  ".mjs",
]);

const INTERESTING_NAMES = [
  "package.json",
  "tailwind.config.js",
  "tailwind.config.ts",
  "tailwind.config.mjs",
  "tailwind.config.cjs",
  "postcss.config.js",
  "astro.config.mjs",
  "astro.config.ts",
  "vite.config.ts",
  "vite.config.js",
  "vite.config.mjs",
  "next.config.js",
  "next.config.mjs",
  "next.config.ts",
  "nuxt.config.ts",
  "nuxt.config.js",
  "remix.config.js",
  "svelte.config.js",
  "index.html",
  "globals.css",
  "global.css",
  "app.css",
  "index.css",
  "styles.css",
  "README.md",
];

export async function detectProject(root) {
  const pkg = readJson(join(root, "package.json"));
  const deps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
  const sampled = sampleProjectText(root, pkg);
  const stack = detectStack(root, pkg, deps);
  const cssFiles = findCssFiles(root);
  const css = detectCss(root, deps, cssFiles);
  const staging = detectStaging(root, stack);
  const layoutFiles = findLayoutFiles(root, stack);
  const da = detectDirection(sampled.text, sampled.files);
  const recommendations = recommendCombos(da);

  return {
    root,
    name: pkg?.name ?? null,
    stack,
    css,
    staging,
    layoutFiles,
    cssFiles,
    da,
    recommendations,
    sampledFiles: sampled.files,
  };
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function detectStack(root, pkg, deps) {
  const has = (...names) => names.some((name) => Boolean(deps[name]));
  const appLayout = firstExisting(root, [
    "app/layout.tsx",
    "app/layout.jsx",
    "app/layout.js",
    "src/app/layout.tsx",
    "src/app/layout.jsx",
    "src/app/layout.js",
  ]);
  const pagesApp = firstExisting(root, [
    "pages/_app.tsx",
    "pages/_app.jsx",
    "pages/_document.tsx",
    "src/pages/_app.tsx",
    "src/pages/_app.jsx",
  ]);

  if (has("next")) {
    const version = String(deps.next).replace(/^[^\d]*/, "") || null;
    if (appLayout) {
      return {
        id: "next-app",
        label: `Next.js${version ? ` ${version.split(".")[0]}` : ""} (App Router)`,
        framework: "next",
        version,
        layoutHint: appLayout,
      };
    }
    return {
      id: "next-pages",
      label: `Next.js${version ? ` ${version.split(".")[0]}` : ""} (Pages Router)`,
      framework: "next",
      version,
      layoutHint: pagesApp,
    };
  }

  if (has("astro")) {
    return {
      id: "astro",
      label: "Astro",
      framework: "astro",
      version: deps.astro,
      layoutHint: firstExisting(root, [
        "src/layouts/Layout.astro",
        "src/layouts/BaseLayout.astro",
        "src/pages/index.astro",
      ]),
    };
  }

  if (has("nuxt")) {
    return {
      id: "nuxt",
      label: "Nuxt",
      framework: "nuxt",
      version: deps.nuxt,
      layoutHint: firstExisting(root, ["app.vue", "app/app.vue"]),
    };
  }

  if (has("@sveltejs/kit")) {
    return {
      id: "sveltekit",
      label: "SvelteKit",
      framework: "sveltekit",
      version: deps["@sveltejs/kit"],
      layoutHint: firstExisting(root, ["src/app.html"]),
    };
  }

  if (has("remix", "@remix-run/react")) {
    return {
      id: "remix",
      label: "Remix",
      framework: "remix",
      version: deps.remix ?? deps["@remix-run/react"],
      layoutHint: firstExisting(root, ["app/root.tsx", "app/root.jsx"]),
    };
  }

  if (has("vite") && has("vue")) {
    return {
      id: "vite-vue",
      label: "Vite + Vue",
      framework: "vite",
      version: deps.vite,
      layoutHint: firstExisting(root, ["index.html"]),
    };
  }

  if (has("vite") && (has("react") || has("react-dom"))) {
    return {
      id: "vite-react",
      label: "Vite + React",
      framework: "vite",
      version: deps.vite,
      layoutHint: firstExisting(root, ["index.html"]),
    };
  }

  if (has("vite")) {
    return {
      id: "vite",
      label: "Vite",
      framework: "vite",
      version: deps.vite,
      layoutHint: firstExisting(root, ["index.html"]),
    };
  }

  if (existsSync(join(root, "index.html"))) {
    return {
      id: "html",
      label: "HTML / CSS",
      framework: "html",
      version: null,
      layoutHint: "index.html",
    };
  }

  return {
    id: "unknown",
    label: "Unknown (HTML fallback)",
    framework: "html",
    version: null,
    layoutHint: firstExisting(root, ["index.html"]),
  };
}

function detectCss(root, deps, cssFiles) {
  const cssText = cssFiles.map((file) => readCapped(join(root, file))).join("\n");
  const hasConfig = Boolean(
    firstExisting(root, [
      "tailwind.config.js",
      "tailwind.config.ts",
      "tailwind.config.mjs",
      "tailwind.config.cjs",
    ]),
  );
  const hasTwDep = Boolean(deps.tailwindcss) || Boolean(deps["@tailwindcss/vite"]);
  const hasTwInCss =
    /@import\s+["']tailwindcss["']/.test(cssText) ||
    /@tailwind\s+base/.test(cssText) ||
    /@theme\b/.test(cssText);
  const hasTw = hasTwDep || hasConfig || hasTwInCss;

  const twVersion = String(deps.tailwindcss ?? deps["@tailwindcss/vite"] ?? "");
  const isV4 =
    /@theme\b/.test(cssText) ||
    Boolean(deps["@tailwindcss/vite"]) ||
    /^\^?4/.test(twVersion.replace(/^[^\d]*/, ""));

  if (hasTw && isV4) {
    return { id: "tailwind-v4", label: "Tailwind CSS v4", tailwind: 4 };
  }
  if (hasTw) {
    return { id: "tailwind-v3", label: "Tailwind CSS v3", tailwind: 3 };
  }
  if (/:root\s*\{/.test(cssText) || /--[a-z0-9-]+\s*:/.test(cssText)) {
    return { id: "css-variables", label: "Native CSS variables", tailwind: 0 };
  }
  return { id: "css", label: "Plain CSS", tailwind: 0 };
}

function detectStaging(root, stack) {
  const publicDir = firstExisting(root, ["public", "static", "src/public", "src/assets"]);
  if (publicDir) {
    return {
      dir: join(root, publicDir, "__fontdock"),
      urlBase: publicDir === "src/assets" ? "/assets/__fontdock" : "/__fontdock",
      publicDir,
    };
  }
  if (["next-app", "next-pages", "astro", "vite", "vite-react", "vite-vue", "nuxt", "sveltekit", "remix"].includes(stack.id)) {
    return {
      dir: join(root, "public", "__fontdock"),
      urlBase: "/__fontdock",
      publicDir: "public",
      createPublic: true,
    };
  }
  return {
    dir: join(root, ".fontdock"),
    urlBase: "/.fontdock",
    publicDir: null,
    localOnly: true,
  };
}

function findLayoutFiles(root, stack) {
  const candidates = {
    "next-app": [
      "app/layout.tsx",
      "app/layout.jsx",
      "src/app/layout.tsx",
      "src/app/layout.jsx",
    ],
    "next-pages": [
      "pages/_document.tsx",
      "pages/_app.tsx",
      "src/pages/_document.tsx",
      "src/pages/_app.tsx",
    ],
    astro: ["src/layouts/Layout.astro", "src/pages/index.astro"],
    nuxt: ["app.vue", "nuxt.config.ts"],
    sveltekit: ["src/app.html"],
    remix: ["app/root.tsx"],
    "vite-react": ["index.html"],
    "vite-vue": ["index.html"],
    vite: ["index.html"],
    html: ["src/pug/index.pug", "index.html", "dist/index.html"],
    unknown: ["src/pug/index.pug", "index.html", "dist/index.html"],
  };
  return (candidates[stack.id] ?? ["index.html"]).filter((file) => existsSync(join(root, file)));
}

function findCssFiles(root) {
  const candidates = [
    "app/globals.css",
    "src/app/globals.css",
    "src/styles/globals.css",
    "src/index.css",
    "src/assets/index.css",
    "src/app.css",
    "src/styles/global.css",
    "styles/globals.css",
    "src/global.css",
    "app.css",
    "index.css",
    "styles.css",
  ];
  return candidates.filter((file) => existsSync(join(root, file)));
}

function detectDirection(text, files) {
  const haystack = text.toLowerCase();
  const combos = listCombos();
  const scores = combos.map((combo) => {
    const hits = [];
    let score = 0;
    for (const keyword of combo.keywords) {
      const pattern = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, "g");
      const count = (haystack.match(pattern) || []).length;
      if (count) {
        score += count;
        hits.push(keyword);
      }
    }
    return { id: combo.id, name: combo.name, mood: combo.mood, score, hits };
  });
  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const dark = /\b(dark|noir|midnight|slate-950|#0[a-f0-9]{5})\b/i.test(haystack);
  const evidence = [];
  if (top?.score) evidence.push(`keywords: ${top.hits.slice(0, 6).join(", ")}`);
  if (dark) evidence.push("dark palette signals");
  if (files.includes("README.md")) evidence.push("README copy");

  const moodLabel = top?.score
    ? `${top.name}${dark ? " · dark" : ""}`
    : dark
      ? "Undetermined · dark UI"
      : "Undetermined — defaulting to SaaS / Modern Tech";

  return {
    mood: top?.mood ?? "saas",
    label: moodLabel,
    confidence: top?.score ? Math.min(0.95, 0.35 + top.score * 0.08) : 0.2,
    scores,
    evidence,
  };
}

function recommendCombos(da) {
  const combos = listCombos();
  const byId = Object.fromEntries(combos.map((combo) => [combo.id, combo]));
  const ranked = da.scores
    .filter((row) => row.score > 0)
    .map((row) => byId[row.id])
    .filter(Boolean);

  const unique = [];
  for (const combo of [...ranked, byId["saas-modern-tech"], byId["creative-studio-agency"], ...combos]) {
    if (combo && !unique.some((item) => item.id === combo.id)) unique.push(combo);
    if (unique.length === 2) break;
  }
  return unique;
}

function sampleProjectText(root, pkg) {
  const files = [];
  const chunks = [];
  if (pkg) {
    chunks.push(JSON.stringify({ name: pkg.name, description: pkg.description, keywords: pkg.keywords }));
    files.push("package.json");
  }

  for (const name of INTERESTING_NAMES) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    files.push(name);
    chunks.push(readCapped(path));
  }

  walk(root, (file) => {
    const rel = relative(root, file).replaceAll("\\", "/");
    if (files.includes(rel)) return;
    if (shouldSkipSample(rel)) return;
    const ext = extname(file);
    if (!TEXT_EXTS.has(ext)) return;
    if (rel.split("/").length > 4) return;
    files.push(rel);
    chunks.push(readCapped(file));
  }, { maxFiles: 40, maxDepth: 4 });

  return { text: chunks.join("\n"), files };
}

function walk(dir, visit, { maxFiles, maxDepth, depth = 0, count = { n: 0 } }) {
  if (depth > maxDepth || count.n >= maxFiles) return;
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (count.n >= maxFiles) return;
    if (IGNORE_DIRS.has(entry) || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      walk(full, visit, { maxFiles, maxDepth, depth: depth + 1, count });
    } else if (stat.isFile()) {
      count.n += 1;
      visit(full);
    }
  }
}

function readCapped(path, max = 12_000) {
  try {
    return readFileSync(path, "utf8").slice(0, max);
  } catch {
    return "";
  }
}

function shouldSkipSample(rel) {
  return (
    rel.includes("/__fontdock/") ||
    rel.startsWith("__fontdock/") ||
    rel.includes("/__fonty/") ||
    rel.includes("/__typo/") ||
    rel.includes(".fontdock/") ||
    rel.includes(".fonty/") ||
    rel.includes(".typos/") ||
    rel.endsWith("combos.json") ||
    rel.endsWith("fontdock-toolbar.js") ||
    rel.endsWith("fonty-toolbar.js") ||
    rel.endsWith("typo-toolbar.js") ||
    rel.startsWith("packages/") ||
    rel.startsWith("skills/") ||
    rel.startsWith("rules/") ||
    rel.startsWith("tests/")
  );
}

function firstExisting(root, rels) {
  return rels.find((rel) => existsSync(join(root, rel))) ?? null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatDetect(report) {
  const recs = report.recommendations
    .map((combo, index) => `  ${index + 1}. ${combo.name} — ${combo.display.family} + ${combo.body.family}`)
    .join("\n");
  return [
    "fontdock",
    "────────",
    `Stack     ${report.stack.label}`,
    `CSS       ${report.css.label}`,
    `DA        ${report.da.label} (${Math.round(report.da.confidence * 100)}%)`,
    `Staging   ${relative(report.root, report.staging.dir) || report.staging.dir}`,
    "",
    "Top pairings",
    recs,
  ].join("\n");
}
