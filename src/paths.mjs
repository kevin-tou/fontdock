import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const COMBOS_PATH = join(PKG_ROOT, "packages", "registry", "combos.json");
export const TOOLBAR_PATH = join(PKG_ROOT, "packages", "toolbar", "fontdock-toolbar.js");
export const RULE_MDC_PATH = join(PKG_ROOT, "rules", "fontdock.mdc");
export const LEGACY_RULES_PATH = join(PKG_ROOT, "rules", "cursorrules");
export const SKILL_DIR = join(PKG_ROOT, "skills", "fontdock");
export const TOOLBAR_FILE = "fontdock-toolbar.js";
