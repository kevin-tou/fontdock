import { comboLabel } from "./registry.mjs";

function activeFonts(combo) {
  return [combo.display, combo.body, combo.ui].filter(Boolean);
}

export function combinedCdn(combo) {
  const fonts = activeFonts(combo);
  if (!fonts.every((font) => font.cdn.includes("fonts.googleapis.com"))) return null;
  const families = fonts
    .map((font) => font.cdn.split("family=")[1]?.split("&")[0])
    .filter(Boolean);
  if (families.length < 2) return null;
  return `https://fonts.googleapis.com/css2?${families.map((family) => `family=${family}`).join("&")}&display=swap`;
}

export function preconnectTags(combo) {
  const hosts = new Set();
  for (const font of activeFonts(combo)) {
    if (font.source === "fontshare") {
      hosts.add("https://api.fontshare.com");
      hosts.add("https://cdn.fontshare.com");
    } else if (font.source === "fontsource") {
      hosts.add("https://cdn.jsdelivr.net");
    } else {
      hosts.add("https://fonts.googleapis.com");
      hosts.add("https://fonts.gstatic.com");
    }
  }
  return [...hosts]
    .map((host) => {
      const cross = host.includes("gstatic") || host.includes("cdn.fontshare") ? " crossorigin" : "";
      return `<link rel="preconnect" href="${host}"${cross}>`;
    })
    .join("\n");
}

export function stylesheetTags(combo) {
  const combined = combinedCdn(combo);
  if (combined) return `<link rel="stylesheet" href="${combined}">`;
  return [...new Set(activeFonts(combo).flatMap((font) => stylesheetUrls(font)))]
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join("\n");
}

function weightOf(font, fallback) {
  const weights = font.weights?.length ? font.weights : [fallback];
  if (font.weight && weights.includes(font.weight)) return font.weight;
  if (font.role === "display") return weights.includes(700) ? 700 : weights[weights.length - 1];
  if (font.role === "ui") return weights.includes(500) ? 500 : weights[0];
  return weights.includes(400) ? 400 : weights[0];
}

function uiRules(combo) {
  if (!combo.ui) return "";
  return `

nav, button, .font-ui, [data-fontdock="ui"] {
  font-family: var(--font-ui);
  font-weight: var(--font-ui-weight);
}`;
}

export function cssVariablesBlock(combo, { tailwind = 0 } = {}) {
  const imports = [...new Set(activeFonts(combo).flatMap((font) => stylesheetUrls(font)))]
    .map((cdn) => `@import url("${cdn}");`)
    .join("\n");
  const displayW = weightOf(combo.display, 700);
  const bodyW = weightOf(combo.body, 400);
  const uiTheme = combo.ui
    ? `\n  --font-ui: ${combo.ui.cssFamily};\n  --font-ui-weight: ${weightOf(combo.ui, 500)};`
    : "";

  if (tailwind === 4) {
    return `${imports}

@theme {
  --font-display: ${combo.display.cssFamily};
  --font-sans: ${combo.body.cssFamily};
  --font-body: ${combo.body.cssFamily};${uiTheme}
}

html {
  font-family: var(--font-sans);
  font-weight: ${bodyW};
}

h1, h2, h3, h4, h5, h6, .font-display {
  font-family: var(--font-display);
  font-weight: ${displayW};
}${uiRules(combo)}`;
  }

  return `${imports}

:root {
  --font-display: ${combo.display.cssFamily};
  --font-body: ${combo.body.cssFamily};
  --font-display-weight: ${displayW};
  --font-body-weight: ${bodyW};${combo.ui ? `\n  --font-ui: ${combo.ui.cssFamily};\n  --font-ui-weight: ${weightOf(combo.ui, 500)};` : ""}
}

html, body {
  font-family: var(--font-body);
  font-weight: var(--font-body-weight);
}

h1, h2, h3, h4, h5, h6, .font-display {
  font-family: var(--font-display);
  font-weight: var(--font-display-weight);
}${uiRules(combo)}`;
}

export function stylesheetUrls(font, weight) {
  if (font.cdnPattern) {
    const weights = weight ? [weight] : font.weights || [400];
    return weights.map((w) => font.cdnPattern.replace("{weight}", String(w)));
  }
  return [font.cdn];
}

export function tailwindV3ConfigSnippet(combo) {
  const ui = combo.ui
    ? `\n  ui: [${JSON.stringify(combo.ui.family)}, "sans-serif"],`
    : "";
  return `fontFamily: {
  display: [${JSON.stringify(combo.display.family)}, "sans-serif"],
  sans: [${JSON.stringify(combo.body.family)}, "sans-serif"],${ui}
}`;
}

export function nextFontSnippet(combo) {
  const fonts = activeFonts(combo);
  if (fonts.some((font) => !font.nextFont)) {
    return `// Fontshare / non-Google families: keep <link> tags in app/layout.tsx
${preconnectTags(combo)}
${stylesheetTags(combo)}`;
  }
  const imports = fonts.map((font) => font.nextFont).join(", ");
  const decls = fonts
    .map((font) => {
      const varName = font.role === "display" ? "display" : font.role === "ui" ? "ui" : "body";
      const cssVar = font.role === "ui" ? "ui" : font.role === "display" ? "display" : "body";
      return `const ${varName} = ${font.nextFont}({
  subsets: ["latin"],
  variable: "--font-${cssVar}",
  display: "swap",
});`;
    })
    .join("\n\n");
  const classExpr = fonts
    .map((font) => {
      const varName = font.role === "display" ? "display" : font.role === "ui" ? "ui" : "body";
      return `\${${varName}.variable}`;
    })
    .join(" ");
  return `import { ${imports} } from "next/font/google";

${decls}

// html className={\`${classExpr}\`}
// CSS: var(--font-display) / var(--font-body)${combo.ui ? " / var(--font-ui)" : ""}`;
}

export function toolbarScriptTag({ urlBase = "/__fontdock", stack = "html", css = "css-variables" } = {}) {
  return `<script type="module" src="${urlBase}/fontdock-toolbar.js" data-fontdock-stack="${stack}" data-fontdock-css="${css}"></script>`;
}

export function buildSnippet(combo, { stack = "html", css = "css-variables" } = {}) {
  const title = `/* ${combo.name} — ${comboLabel(combo)} */`;
  if (stack === "next-app" || stack === "next-pages") {
    if (activeFonts(combo).every((font) => font.nextFont)) {
      return `${title}\n\n${nextFontSnippet(combo)}\n\n/* CSS */\n${cssVariablesBlock(combo, { tailwind: css === "tailwind-v4" ? 4 : 0 })}`;
    }
    return `${title}

// app/layout.tsx (or pages/_document) — Google-incompatible / Fontshare families
${preconnectTags(combo)}
${stylesheetTags(combo)}

${cssVariablesBlock(combo, { tailwind: css === "tailwind-v4" ? 4 : 0 })}`;
  }

  if (stack === "astro") {
    return `${title}

---
// src/layouts/Layout.astro
---
${preconnectTags(combo)}
${stylesheetTags(combo)}

<style is:global>
${cssVariablesBlock(combo, { tailwind: css === "tailwind-v4" ? 4 : 0 })}
</style>`;
  }

  if (css === "tailwind-v3") {
    return `${title}

${preconnectTags(combo)}
${stylesheetTags(combo)}

// tailwind.config.{js,ts} theme.extend
${tailwindV3ConfigSnippet(combo)}

/* globals.css */
h1, h2, h3, .font-display { font-family: theme("fontFamily.display"); }
body { font-family: theme("fontFamily.sans"); }${
      combo.ui ? `\nnav, button, .font-ui { font-family: theme("fontFamily.ui"); }` : ""
    }`;
  }

  return `${title}

${preconnectTags(combo)}
${stylesheetTags(combo)}

${cssVariablesBlock(combo, { tailwind: css === "tailwind-v4" ? 4 : 0 })}`;
}

export function markerWrap(css, combo) {
  return `/* fontdock:start ${combo.id} */
${css}
/* fontdock:end */`;
}
