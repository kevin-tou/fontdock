import { resolve } from "node:path";
import { applyPair } from "./apply.mjs";
import { detectProject, formatDetect } from "./detect.mjs";
import { ejectToolbar, injectCommand } from "./inject.mjs";
import { formatInit, initProject } from "./init.mjs";
import { comboLabel, listCombos, listFonts, resolvePair } from "./registry.mjs";
import { buildSnippet } from "./snippets.mjs";
import { formatUninstall, uninstallProject } from "./uninstall.mjs";
import { validateCdns, validateRegistry } from "./validate.mjs";

const HELP = `
fontdock — curated type pairings, live preview, Cursor /fontdock

Usage:
  npx fontdock init [options]
  npx fontdock detect [--json]
  npx fontdock list [--fonts]
  npx fontdock inject
  npx fontdock apply <combo-id>          print an AI apply prompt
  npx fontdock apply --display <slug> --body <slug> [--ui <slug>]
  npx fontdock uninstall
  npx fontdock eject
  npx fontdock snippet <combo-id>
  npx fontdock snippet --display <slug> --body <slug>
  npx fontdock validate [--cdn]

Options:
  --dir <path>     Project root (default: cwd)
  --inject         init: also inject the toolbar script into the layout
  --no-cursor      init: skip Cursor rule/skill
  --no-toolbar     init: skip copying toolbar assets
  --keep-cursor    uninstall: leave the /fontdock skill in .cursor/
  --keep-preview   uninstall: leave toolbar files in public/__fontdock
  --display <id>   apply/snippet: display family slug
  --body <id>      apply/snippet: body family slug
  --ui <id>        apply/snippet: optional UI family slug
  --fonts          list: print the font catalog
  --json           machine-readable detect output
  --cdn            validate: ping stylesheet and specimen URLs
  --stack <id>     snippet stack (next-app, astro, vite, html, ...)
  --css <id>       snippet css (tailwind-v4, tailwind-v3, css-variables)
`.trim();

export async function run(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const command = args._[0] ?? "help";
  const root = resolve(args.flags.dir ?? process.cwd());

  try {
    switch (command) {
      case "help":
      case "--help":
      case "-h":
        console.log(HELP);
        return 0;
      case "init": {
        console.log(formatInit(await initProject(root, args.flags)));
        return 0;
      }
      case "detect": {
        const report = await detectProject(root);
        if (args.flags.json) console.log(JSON.stringify(report, null, 2));
        else console.log(formatDetect(report));
        return 0;
      }
      case "list": {
        if (args.flags.fonts || args._[1] === "fonts") {
          for (const font of listFonts()) {
            console.log(`${font.slug.padEnd(22)} ${font.family.padEnd(24)} ${font.roles.join("/")}`);
          }
          return 0;
        }
        for (const combo of listCombos()) {
          console.log(`${combo.id.padEnd(24)} ${combo.name.padEnd(28)} ${comboLabel(combo)}`);
        }
        return 0;
      }
      case "inject": {
        const { result } = await injectCommand(root);
        if (!result.ok) {
          console.error(result.reason);
          console.log(result.snippet);
          return 1;
        }
        console.log(result.skipped ? `Already injected in ${result.file}` : `Injected toolbar in ${result.file}`);
        console.log("Start the dev server, then type /fontdock.");
        return 0;
      }
      case "eject": {
        const report = await detectProject(root);
        const { changed } = ejectToolbar(root, report);
        console.log(changed.length ? `Removed toolbar from:\n${changed.map((file) => `  - ${file}`).join("\n")}` : "No toolbar snippets found.");
        return 0;
      }
      case "uninstall": {
        console.log(formatUninstall(await uninstallProject(root, args.flags)));
        return 0;
      }
      case "apply": {
        const result = await applyPair(root, pairSpec(args));
        console.log(result.prompt);
        console.log("Paste this in Cursor Chat / Composer. After fonts are written: npx fontdock uninstall");
        return 0;
      }
      case "snippet": {
        const pair = resolvePair(pairSpec(args));
        let stack = args.flags.stack;
        let css = args.flags.css;
        if (!stack || !css) {
          const report = await detectProject(root);
          stack = stack || report.stack.id;
          css = css || report.css.id;
        }
        console.log(buildSnippet(pair, { stack, css }));
        return 0;
      }
      case "validate": {
        const schema = validateRegistry();
        printIssues("schema", schema);
        if (!schema.ok) return 1;
        if (args.flags.cdn) {
          const cdn = await validateCdns();
          printIssues("cdn", cdn);
          if (!cdn.ok) return 1;
        }
        console.log(`OK — ${listCombos().length} combos, ${listFonts().length} fonts`);
        return 0;
      }
      default:
        console.error(`Unknown command: ${command}\n`);
        console.log(HELP);
        return 1;
    }
  } catch (error) {
    console.error(error.message);
    return 1;
  }
}

function pairSpec(args) {
  const comboId = args._[1];
  const display = args.flags.display;
  const body = args.flags.body;
  const ui = args.flags.ui;
  if (comboId || (display && body)) return { comboId, display, body, ui };
  throw new Error(
    "Usage: fontdock apply <combo-id>  OR  fontdock apply --display <slug> --body <slug> [--ui <slug>]",
  );
}

function printIssues(label, result) {
  for (const error of result.errors) console.error(`[${label}] ${error}`);
  for (const warning of result.warnings ?? []) console.warn(`[${label}] ${warning}`);
}

export function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--") {
      args._.push(...argv.slice(i + 1));
      break;
    }
    if (current.startsWith("--")) {
      const key = current.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("-")) {
        args.flags[key] = next;
        i += 1;
      } else {
        args.flags[key] = true;
      }
    } else {
      args._.push(current);
    }
  }
  return args;
}
