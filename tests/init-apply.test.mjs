import { equal, match, ok } from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { applyCombo, applyPair } from "../src/apply.mjs";
import { initProject } from "../src/init.mjs";
import { uninstallProject } from "../src/uninstall.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "fontdock-init-"));
  mkdirSync(join(root, "src"), { recursive: true });
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "site" }));
  writeFileSync(join(root, "index.html"), "<html><body><h1>Hi</h1></body></html>");
  writeFileSync(join(root, "src", "index.css"), "body { color: black; }\n");
  return root;
}

test("init copies Cursor skill, rule, and toolbar assets", async () => {
  const root = fixture();
  const { created } = await initProject(root, {});
  ok(created.some((file) => file.replaceAll("\\", "/").endsWith(".cursor/skills/fontdock/SKILL.md")));
  ok(existsSync(join(root, ".cursor", "rules", "fontdock.mdc")));
  ok(existsSync(join(root, ".fontdock", "fontdock-toolbar.js")));
  ok(existsSync(join(root, ".fontdock", "combos.json")));
});

test("apply prints an AI prompt instead of writing CSS", async () => {
  const root = fixture();
  const result = await applyCombo(root, "saas-modern-tech");
  ok(result.ok);
  match(result.prompt, /Apply these typefaces/);
  match(result.prompt, /Cabinet Grotesk/);
  match(result.prompt, /Satoshi/);
  match(result.prompt, /npx fontdock uninstall/);
  match(readFileSync(join(root, "src", "index.css"), "utf8"), /body \{ color: black; \}/);
  ok(!readFileSync(join(root, "src", "index.css"), "utf8").includes("fontdock:start"));
});

test("applyPair prompt includes a custom display/body mix", async () => {
  const result = await applyPair("", { display: "syne", body: "satoshi" });
  ok(result.ok);
  equal(result.combo.custom, true);
  match(result.prompt, /Syne/);
  match(result.prompt, /Satoshi/);
});

test("uninstall removes scaffolding and leaves project CSS untouched", async () => {
  const root = fixture();
  await initProject(root, { inject: true });
  const { removed } = await uninstallProject(root, {});
  ok(removed.length > 0);
  ok(!existsSync(join(root, ".fontdock", "fontdock-toolbar.js")));
  ok(!existsSync(join(root, ".cursor", "skills", "fontdock", "SKILL.md")));
  ok(!existsSync(join(root, ".cursor", "rules", "fontdock.mdc")));
  const html = readFileSync(join(root, "index.html"), "utf8");
  ok(!html.includes("fontdock-toolbar"));
  match(readFileSync(join(root, "src", "index.css"), "utf8"), /body \{ color: black; \}/);
});
