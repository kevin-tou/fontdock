import { match, ok } from "node:assert/strict";
import test from "node:test";
import { getCombo } from "../src/registry.mjs";
import { buildSnippet, combinedCdn, cssVariablesBlock, toolbarScriptTag } from "../src/snippets.mjs";

test("Google pairings can share one CSS2 URL", () => {
  const combo = getCombo("warm-editorial-luxe");
  const href = combinedCdn(combo);
  match(href, /fonts\.googleapis\.com\/css2\?family=Fraunces/);
  match(href, /family=Plus\+Jakarta\+Sans/);
});

test("Tailwind v4 snippet uses @theme and optional UI", () => {
  const combo = getCombo("saas-modern-tech");
  const css = cssVariablesBlock(combo, { tailwind: 4 });
  match(css, /@theme/);
  match(css, /Cabinet Grotesk/);
  match(css, /Satoshi/);
  match(css, /--font-ui/);
});

test("next snippet refuses fake next/font for Fontshare", () => {
  const snippet = buildSnippet(getCombo("saas-modern-tech"), { stack: "next-app", css: "tailwind-v4" });
  ok(!snippet.includes("next/font/google"));
  match(snippet, /fontshare/);
});

test("toolbar script carries stack metadata", () => {
  match(toolbarScriptTag({ stack: "astro", css: "tailwind-v4" }), /data-fontdock-stack="astro"/);
});
