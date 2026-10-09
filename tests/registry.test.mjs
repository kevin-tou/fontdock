import { equal, match, ok } from "node:assert/strict";
import test from "node:test";
import { getFont, listFonts, pairFromFonts, resolvePair } from "../src/registry.mjs";

test("font catalog is de-duplicated from combos", () => {
  const fonts = listFonts();
  ok(fonts.length >= 12);
  equal(new Set(fonts.map((font) => font.slug)).size, fonts.length);
  ok(getFont("fraunces"));
  ok(getFont("Plus Jakarta Sans"));
});

test("resolvePair hydrates a custom mix", () => {
  const pair = resolvePair({ display: "syne", body: "satoshi", ui: "inter" });
  equal(pair.custom, true);
  match(pair.id, /^custom:syne\+satoshi\+inter$/);
  equal(pair.display.family, "Syne");
  equal(pair.body.family, "Satoshi");
  equal(pair.ui.family, "Inter");
});

test("known display+body+ui resolve back to a curated combo", () => {
  const fraunces = getFont("fraunces");
  const jakarta = getFont("plus-jakarta-sans");
  const publicSans = getFont("public-sans");
  const pair = pairFromFonts(fraunces, jakarta, publicSans);
  equal(pair.id, "warm-editorial-luxe");
  equal(pair.custom, undefined);
});
