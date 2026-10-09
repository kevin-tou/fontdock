import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { detectProject, formatDetect } from "./detect.mjs";
import { COMBOS_PATH, LEGACY_RULES_PATH, RULE_MDC_PATH, SKILL_DIR, TOOLBAR_FILE, TOOLBAR_PATH } from "./paths.mjs";
import { injectToolbar } from "./inject.mjs";

export async function initProject(root, flags = {}) {
  const report = await detectProject(root);
  const created = [];

  if (!flags["no-cursor"]) {
    const rulesDir = join(root, ".cursor", "rules");
    mkdirSync(rulesDir, { recursive: true });
    const destRule = join(rulesDir, "fontdock.mdc");
    copyFileSync(RULE_MDC_PATH, destRule);
    created.push(relative(root, destRule));

    const skillDest = join(root, ".cursor", "skills", "fontdock");
    mkdirSync(skillDest, { recursive: true });
    for (const file of readdirSync(SKILL_DIR)) {
      copyFileSync(join(SKILL_DIR, file), join(skillDest, file));
      created.push(relative(root, join(skillDest, file)));
    }

    if (!existsSync(join(root, ".cursorrules"))) {
      copyFileSync(LEGACY_RULES_PATH, join(root, ".cursorrules"));
      created.push(".cursorrules");
    } else {
      appendLegacyPointer(join(root, ".cursorrules"));
    }
  }

  if (!flags["no-toolbar"]) {
    mkdirSync(report.staging.dir, { recursive: true });
    copyFileSync(TOOLBAR_PATH, join(report.staging.dir, TOOLBAR_FILE));
    copyFileSync(COMBOS_PATH, join(report.staging.dir, "combos.json"));
    created.push(relative(root, join(report.staging.dir, TOOLBAR_FILE)));
    created.push(relative(root, join(report.staging.dir, "combos.json")));
  }

  let injected = null;
  if (flags.inject) {
    injected = injectToolbar(root, report);
  }

  return { report, created, injected };
}

function appendLegacyPointer(path) {
  const current = readFileSync(path, "utf8");
  if (current.includes("fontdock:start") || current.includes("fontdock: use /fontdock")) return;
  writeFileSync(
    path,
    `${current.trimEnd()}\n\n# fontdock:start\n# When the user runs /fontdock, follow .cursor/skills/fontdock/SKILL.md\n# fontdock:end\n`,
    "utf8",
  );
}

export function formatInit({ report, created, injected }) {
  const lines = [
    formatDetect(report),
    "",
    "Installed",
    ...created.map((file) => `  + ${file}`),
  ];
  if (injected?.file) {
    lines.push("", `Toolbar injected in ${injected.file}`);
  } else if (report.staging.localOnly) {
    lines.push("", "No public/ folder detected. Toolbar files live in .fontdock/ — copy them to your static directory before previewing.");
  }
  lines.push("", "Ready. Type /fontdock in Cursor Composer / Chat to start.");
  return lines.join("\n");
}
