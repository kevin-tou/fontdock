import { equal, match, ok } from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { detectProject } from "../src/detect.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "fontdock-"));
  mkdirSync(join(root, "app"), { recursive: true });
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "acme-saas-dashboard",
      dependencies: { next: "15.0.0", react: "19.0.0" },
      devDependencies: { tailwindcss: "4.0.0", "@tailwindcss/vite": "4.0.0" },
    }),
  );
  writeFileSync(
    join(root, "app", "layout.tsx"),
    `export default function RootLayout({ children }) { return <html><body>{children}</body></html>; }`,
  );
  writeFileSync(
    join(root, "app", "globals.css"),
    `@import "tailwindcss";\n@theme {\n  --color-bg: #0a0a0a;\n}\n`,
  );
  writeFileSync(
    join(root, "README.md"),
    `# Acme\nMinimal B2B SaaS dashboard for startup analytics.\n`,
  );
  return root;
}

test("detects Next App Router, Tailwind v4, and a SaaS mood", async () => {
  const report = await detectProject(fixture());
  equal(report.stack.id, "next-app");
  equal(report.css.id, "tailwind-v4");
  equal(report.da.mood, "saas");
  ok(report.recommendations.length === 2);
  match(report.staging.dir.replaceAll("\\", "/"), /public\/__fontdock$/);
});
