# Integration snippets

Replace families with the chosen combo from `combos.json`. Prefer `npx fontdock snippet <id>`.

## CSS variables (universal)

```css
@import url("DISPLAY_CDN");
@import url("BODY_CDN");

:root {
  --font-display: DISPLAY_CSS_FAMILY;
  --font-body: BODY_CSS_FAMILY;
}

html, body { font-family: var(--font-body); }
h1, h2, h3, h4, h5, h6, .font-display { font-family: var(--font-display); }
```

## Tailwind v4

```css
@import "tailwindcss";
@import url("DISPLAY_CDN");
@import url("BODY_CDN");

@theme {
  --font-display: DISPLAY_CSS_FAMILY;
  --font-sans: BODY_CSS_FAMILY;
}
```

## Tailwind v3

```js
fontFamily: {
  display: ["DISPLAY_FAMILY", "sans-serif"],
  sans: ["BODY_FAMILY", "sans-serif"],
}
```

## Next.js App Router — Google Fonts

Use `nextFont` identifiers from the registry. If `nextFont` is `null` (Fontshare), use `<link>` tags — never a fake `next/font` import.

## Toolbar (dev only)

```html
<script type="module" src="/__fontdock/fontdock-toolbar.js" data-fontdock-stack="next-app" data-fontdock-css="tailwind-v4"></script>
```

Markers `fontdock:toolbar` / `/fontdock:toolbar` must stay so `npx fontdock uninstall` can remove them.

When finished: `npx fontdock uninstall` (does not delete applied CSS).
