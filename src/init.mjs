import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { COMBOS_PATH, LEGACY_RULES_PATH, RULE_MDC_PATH, SKILL_DIR, TOOLBAR_FILE, TOOLBAR_PATH } from "./paths.mjs";
import { injectCommand } from "./inject.mjs";

export async function initProject(root, flags = {}) {
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
    const dir = join(root, ".fontdock");
    mkdirSync(dir, { recursive: true });
    copyFileSync(TOOLBAR_PATH, join(dir, TOOLBAR_FILE));
    copyFileSync(COMBOS_PATH, join(dir, "combos.json"));
    created.push(relative(root, join(dir, TOOLBAR_FILE)));
    created.push(relative(root, join(dir, "combos.json")));
  }

  let injected = null;
  if (flags.inject) {
    const { result } = await injectCommand(root);
    injected = result;
  }

  return { created, injected };
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

export function formatInit({ created, injected }) {
  const lines = [
    "Installed",
    ...created.map((file) => `  + ${file}`),
  ];
  if (injected?.ok && injected.file) {
    lines.push("", `Toolbar injected in ${injected.file}`);
  }
  lines.push(
    "",
    "Type /fontdock in Cursor, or paste:",
    "",
    "  Analyse ce repo (stack-aware) : stack, CSS, direction artistique.",
    "  Propose deux paires du registry fontdock + la barre live (choix 1 / 2 / 3), puis attends.",
    "  Suit .cursor/skills/fontdock/SKILL.md",
  );
  return lines.join("\n");
}
