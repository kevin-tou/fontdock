import { deepEqual, ok } from "node:assert/strict";
import test from "node:test";
import { loadRegistry } from "../src/registry.mjs";
import { validateRegistry } from "../src/validate.mjs";

test("shipped registry is valid", () => {
  const result = validateRegistry();
  deepEqual(result.errors, []);
  ok(result.ok);
});

test("rejects two display faces and duplicate ids", () => {
  const base = loadRegistry();
  const clone = structuredClone(base);
  clone.combos[0].id = clone.combos[1].id;
  clone.combos[2].body.category = "display";
  clone.combos[2].body.family = clone.combos[2].display.family;
  const result = validateRegistry(clone);
  ok(result.errors.some((error) => error.includes("duplicate id")));
  ok(result.errors.some((error) => error.includes("same family") || error.includes("two display")));
});
