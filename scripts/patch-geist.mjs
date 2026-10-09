import { readFileSync, writeFileSync } from "node:fs";

const path = "packages/registry/combos.json";
const data = JSON.parse(readFileSync(path, "utf8"));

for (const combo of data.combos) {
  for (const key of ["display", "body", "ui"]) {
    const font = combo[key];
    if (font?.slug !== "geist-sans") continue;
    font.cdn = "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.3.0/400.css";
    font.cdnPattern = "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.3.0/{weight}.css";
    font.cssFamily = '"Geist Sans", ui-sans-serif, system-ui, sans-serif';
  }
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log("geist patched");
