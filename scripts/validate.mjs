#!/usr/bin/env node
import { run } from "../src/cli.mjs";

const extra = process.argv.slice(2);
process.exit(await run(["validate", ...extra]));
