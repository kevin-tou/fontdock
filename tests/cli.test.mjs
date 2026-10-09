import { deepEqual, equal } from "node:assert/strict";
import test from "node:test";
import { parseArgs } from "../src/cli.mjs";

test("parseArgs collects command, flags and values", () => {
  const args = parseArgs(["snippet", "saas-modern-tech", "--stack", "next-app", "--json"]);
  deepEqual(args._, ["snippet", "saas-modern-tech"]);
  equal(args.flags.stack, "next-app");
  equal(args.flags.json, true);
});
