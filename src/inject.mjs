import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { COMBOS_PATH, TOOLBAR_FILE, TOOLBAR_PATH } from "./paths.mjs";
import { detectProject } from "./detect.mjs";
import { toolbarScriptTag } from "./snippets.mjs";

export const BEGIN = "fontdock:toolbar";
export const END = "/fontdock:toolbar";
const LEGACY = [
  { begin: "fontdock:toolbar", end: "/fontdock:toolbar" },
  { begin: "fonty:toolbar", end: "/fonty:toolbar" },
  { begin: "typo-pair:toolbar", end: "/typo-pair:toolbar" },
];

export function ensureToolbarAssets(root, report) {
  mkdirSync(report.staging.dir, { recursive: true });
  copyFileSync(TOOLBAR_PATH, join(report.staging.dir, TOOLBAR_FILE));
  copyFileSync(COMBOS_PATH, join(report.staging.dir, "combos.json"));
}

export function injectToolbar(root, report) {
  if (!report) throw new Error("injectToolbar requires a detect report");
  ensureToolbarAssets(root, report);
  const target = pickInjectTarget(root, report);
  if (!target) {
    return {
      ok: false,
      reason: "Could not find a layout/HTML file to inject. Add the script tag manually.",
      snippet: toolbarScriptTag({
        urlBase: report.staging.urlBase,
        stack: report.stack.id,
        css: report.css.id,
      }),
    };
  }

  const path = join(root, target.file);
  const original = readFileSync(path, "utf8");
  if (original.includes(BEGIN) || original.includes("fonty:toolbar") || original.includes("typo-pair:toolbar")) {
    return { ok: true, file: target.file, skipped: true };
  }

  const snippet = buildInjectSnippet(report, target.kind);
  const next = splice(original, snippet, target.kind);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, next, "utf8");
  return { ok: true, file: target.file, skipped: false };
}

export function ejectToolbar(root, report) {
  const files = new Set([
    ...(report?.layoutFiles ?? []),
    "index.html",
    "dist/index.html",
    "app/layout.tsx",
    "src/app/layout.tsx",
    "pages/_document.tsx",
    "src/layouts/Layout.astro",
    "src/app.html",
    "app/root.tsx",
  ]);
  const changed = [];
  for (const file of files) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    const original = readFileSync(path, "utf8");
    const next = stripMarkers(original);
    if (next === original) continue;
    writeFileSync(path, next, "utf8");
    changed.push(file);
  }
  return { changed };
}

function pickInjectTarget(root, report) {
  const ranked = [
    ...report.layoutFiles.map((file) => ({ file, kind: kindFor(file, report.stack.id) })),
    { file: "index.html", kind: "html" },
    { file: "dist/index.html", kind: "html" },
  ];
  return ranked.find((row) => existsSync(join(root, row.file))) ?? null;
}

function kindFor(file, stackId) {
  if (file.endsWith(".astro")) return "astro";
  if (file.endsWith(".html")) return "html";
  if (stackId === "next-app" || stackId === "next-pages") return "next";
  if (file.endsWith(".tsx") || file.endsWith(".jsx")) return "jsx";
  return "html";
}

function buildInjectSnippet(report, kind) {
  const src = `${report.staging.urlBase}/${TOOLBAR_FILE}`;
  const stack = report.stack.id;
  const css = report.css.id;
  if (kind === "next") {
    return `{/* ${BEGIN} */}
{process.env.NODE_ENV === "development" ? (
  <script type="module" src="${src}" data-fontdock-stack="${stack}" data-fontdock-css="${css}" />
) : null}
{/* ${END} */}`;
  }
  if (kind === "jsx") {
    return `{/* ${BEGIN} */}
<script type="module" src="${src}" data-fontdock-stack="${stack}" data-fontdock-css="${css}" />
{/* ${END} */}`;
  }
  if (kind === "astro") {
    return `<!-- ${BEGIN} -->
{import.meta.env.DEV && <script type="module" src="${src}" data-fontdock-stack="${stack}" data-fontdock-css="${css}" />}
<!-- ${END} -->`;
  }
  return `<!-- ${BEGIN} -->
<script type="module" src="${src}" data-fontdock-stack="${stack}" data-fontdock-css="${css}"></script>
<!-- ${END} -->`;
}

function splice(original, snippet, kind) {
  if (kind === "html" || kind === "astro") {
    if (/<\/body>/i.test(original)) {
      return original.replace(/<\/body>/i, `${snippet}\n</body>`);
    }
    if (/<\/head>/i.test(original)) {
      return original.replace(/<\/head>/i, `${snippet}\n</head>`);
    }
  }
  if (kind === "next" || kind === "jsx") {
    if (/<\/body>/i.test(original)) {
      return original.replace(/<\/body>/i, `${snippet}\n      </body>`);
    }
    const htmlOpen = original.match(/<html[^>]*>/);
    if (htmlOpen) {
      return original.replace(htmlOpen[0], `${htmlOpen[0]}\n        ${snippet}`);
    }
  }
  return `${original.trimEnd()}\n\n${snippet}\n`;
}

function stripMarkers(source) {
  let next = source;
  for (const { begin, end } of LEGACY) {
    next = next
      .replace(new RegExp(`\\{?/\\*\\s*${begin}[\\s\\S]*?${end}\\s*\\*/\\}?\\n?`, "g"), "")
      .replace(new RegExp(`<!--\\s*${begin}\\s-->[\\s\\S]*?<!--\\s*${end}\\s-->\\n?`, "g"), "");
  }
  return next;
}

export async function injectCommand(root) {
  const report = await detectProject(root);
  const result = injectToolbar(root, report);
  return { report, result, staging: relative(root, report.staging.dir) };
}
