import { existsSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { detectProject } from "./detect.mjs";
import { ejectToolbar } from "./inject.mjs";

const STAGING_DIRS = ["public/__fontdock", "public/__fonty", "public/__typo", ".fontdock", ".fonty", ".typos"];
const STAGING_FILES = ["fontdock-toolbar.js", "fonty-toolbar.js", "typo-toolbar.js", "combos.json"];
const CURSOR_FILES = [
  ".cursor/rules/fontdock.mdc",
  ".cursor/rules/fonty.mdc",
  ".cursor/rules/typos.mdc",
];
const CURSOR_DIRS = [".cursor/skills/fontdock", ".cursor/skills/fonty", ".cursor/skills/typos"];

export async function uninstallProject(root, flags = {}) {
  const report = await detectProject(root);
  const removed = [];

  const { changed } = ejectToolbar(root, report);
  for (const file of changed) removed.push(file);

  if (!flags["keep-preview"]) {
    for (const dir of STAGING_DIRS) {
      const full = join(root, dir);
      if (removeStaging(full)) removed.push(relative(root, full).replaceAll("\\", "/"));
    }
  }

  if (!flags["keep-cursor"]) {
    for (const file of CURSOR_FILES) {
      const full = join(root, file);
      if (existsSync(full)) {
        unlinkSync(full);
        removed.push(file);
      }
    }
    for (const dir of CURSOR_DIRS) {
      const full = join(root, dir);
      if (existsSync(full)) {
        rmSync(full, { recursive: true, force: true });
        removed.push(dir);
      }
    }
    if (stripCursorrules(join(root, ".cursorrules"))) {
      removed.push(".cursorrules (fontdock block)");
    }
  }

  return { report, removed, keptCss: true };
}

function removeStaging(dir) {
  if (!existsSync(dir)) return false;
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return false;
  }
  const foreign = entries.filter((name) => !STAGING_FILES.includes(name));
  if (foreign.length === 0) {
    rmSync(dir, { recursive: true, force: true });
    return true;
  }
  let touched = false;
  for (const name of STAGING_FILES) {
    const file = join(dir, name);
    if (existsSync(file)) {
      unlinkSync(file);
      touched = true;
    }
  }
  return touched;
}

function stripCursorrules(path) {
  if (!existsSync(path)) return false;
  const original = readFileSync(path, "utf8");
  let next = original
    .replace(/\n*# fontdock:start[\s\S]*?# fontdock:end\n?/g, "\n")
    .replace(/\n*# fonty:start[\s\S]*?# fonty:end\n?/g, "\n")
    .replace(/\n*# fontdock: use \/fontdock[\s\S]*?(?=\n# |\n*$)/g, "\n")
    .replace(/\n*# TypoPair: use \/typos[\s\S]*?(?=\n# |\n*$)/g, "\n")
    .trim();

  if (next === original.trim()) {
    if (/fontdock|fonty|TypoPair|\/typos/.test(original) && original.split("\n").length <= 12) {
      unlinkSync(path);
      return true;
    }
    return false;
  }
  if (!next) {
    unlinkSync(path);
    return true;
  }
  writeFileSync(path, `${next}\n`, "utf8");
  return true;
}

export function formatUninstall({ removed }) {
  if (!removed.length) return "Nothing to uninstall. Applied CSS was left untouched.";
  return [
    "Uninstalled fontdock scaffolding",
    ...removed.map((file) => `  - ${file}`),
    "",
    "Preview scaffolding removed. Fonts you wrote in the project were left untouched.",
  ].join("\n");
}
