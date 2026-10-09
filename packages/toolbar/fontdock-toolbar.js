const FALLBACK_COMBOS = [
  {
    id: "saas-modern-tech",
    name: "SaaS & Modern Tech",
    display: {
      family: "Cabinet Grotesk",
      slug: "cabinet-grotesk",
      cssFamily: '"Cabinet Grotesk", sans-serif',
      cdn: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap",
      role: "display",
      category: "sans",
      weights: [400, 500, 700, 800],
    },
    body: {
      family: "Satoshi",
      slug: "satoshi",
      cssFamily: '"Satoshi", sans-serif',
      cdn: "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap",
      role: "body",
      category: "sans",
      weights: [400, 500, 700],
    },
    ui: {
      family: "Inter",
      slug: "inter",
      cssFamily: "Inter, sans-serif",
      cdn: "https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap",
      role: "ui",
      category: "sans",
      weights: [400, 500, 600, 700],
    },
  },
];

const LS = {
  display: "fontdock:display",
  body: "fontdock:body",
  ui: "fontdock:ui",
  displayW: "fontdock:display-weight",
  bodyW: "fontdock:body-weight",
  uiW: "fontdock:ui-weight",
  collapsed: "fontdock:collapsed",
  format: "fontdock:format",
};

const NONE = "__none__";
const MIX = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 4.5h4.5L12 11.5H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5 9.5 15 11.5 13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11.5h4.5L12 4.5H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5 2.5 15 4.5 13.5 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CHEV = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const styles = `
  :host {
    all: initial;
    position: fixed;
    inset: auto auto max(14px, env(safe-area-inset-bottom)) 50%;
    transform: translateX(-50%);
    z-index: 2147483646;
    width: min(1120px, calc(100vw - 24px));
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #111;
    line-height: 1.35;
    -webkit-font-smoothing: antialiased;
  }
  * { box-sizing: border-box; }
  .wrap { position: relative; display: flex; justify-content: center; width: 100%; }
  .bar {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 32px;
    backdrop-filter: blur(20px) saturate(1.2);
    box-shadow: 0 16px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04);
    animation: rise .42s cubic-bezier(.16,1,.3,1);
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(12px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes panelIn {
    from { opacity: 0; transform: translateY(8px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shake {
    0%,100% { transform: rotate(0); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }
  .brand {
    display: flex; align-items: center; gap: 10px;
    padding: 0 8px 0 6px; user-select: none; flex-shrink: 0;
  }
  .mark {
    width: 28px; height: 28px; border-radius: 999px;
    background: #111; color: #fff; font-weight: 700; font-size: 10px;
    display: grid; place-items: center;
  }
  .brand b { font-size: 15px; font-weight: 650; letter-spacing: -.03em; }
  .slots { display: flex; flex-wrap: nowrap; gap: 8px; min-width: 0; flex: 1; }
  .chip {
    appearance: none; border: 0; cursor: pointer;
    display: flex; align-items: center; gap: 10px;
    background: #f4f4f5; border-radius: 999px;
    padding: 8px 12px 8px 14px; flex: 1 1 0; min-width: 0;
    transition: background .18s ease, transform .18s ease;
    font: inherit; color: inherit; text-align: left;
  }
  .chip:hover, .chip[aria-expanded="true"] { background: #ececee; }
  .chip:active { transform: scale(.985); }
  .chip .meta { min-width: 0; flex: 1; }
  .chip .label {
    display: block; font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; color: #525252;
  }
  .chip .value {
    display: block; font-size: 15px; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: -.02em;
  }
  .chip .weight {
    flex-shrink: 0; font-size: 12px; font-weight: 650;
    color: #111; background: #fff; border-radius: 999px;
    padding: 4px 8px; border: 1px solid rgba(0,0,0,.08);
  }
  .chip .chev { color: #737373; display: grid; place-items: center; }
  .actions { display: flex; align-items: center; gap: 6px; margin-left: auto; }
  button.icon, button.primary, button.ghost {
    font: inherit; border: 0; cursor: pointer; border-radius: 999px;
    transition: background .18s ease, transform .18s ease, color .18s ease;
  }
  button.icon {
    width: 40px; height: 40px; background: transparent; color: #404040;
    display: grid; place-items: center;
  }
  button.icon:hover { background: #f4f4f5; color: #111; }
  button.icon.spinning svg { animation: shake .35s ease; }
  button.primary {
    background: #111; color: #fff; font-weight: 650; padding: 10px 18px; font-size: 14px;
  }
  button.primary:hover { background: #000; }
  button.ghost {
    background: #f4f4f5; color: #111; font-size: 13px; font-weight: 650;
    padding: 10px 14px;
  }
  button.ghost:hover { background: #ececee; }
  button:focus-visible, .chip:focus-visible, .fab:focus-visible, .font-btn:focus-visible, .wbtn:focus-visible {
    outline: 2px solid #111; outline-offset: 2px;
  }
  .panel {
    display: none; position: absolute; left: 0; right: 0; bottom: calc(100% + 14px);
    width: min(560px, 100%);
    margin: 0 auto;
    background: #fff; border: 1px solid rgba(0,0,0,.08);
    border-radius: 24px; padding: 16px;
    box-shadow: 0 24px 64px rgba(0,0,0,.16);
    animation: panelIn .28s cubic-bezier(.16,1,.3,1);
  }
  .panel.open { display: grid; gap: 12px; }
  .panel-head {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }
  .panel-head h3 {
    margin: 0; font-size: 13px; letter-spacing: .08em;
    text-transform: uppercase; color: #404040; font-weight: 700;
  }
  .search {
    width: 100%; border: 0; background: #f4f4f5; border-radius: 16px;
    padding: 12px 14px; font: inherit; font-size: 15px; color: #111;
  }
  .search::placeholder { color: #737373; }
  .weights { display: flex; flex-wrap: wrap; gap: 6px; }
  .wbtn {
    border: 0; background: #f4f4f5; border-radius: 999px;
    padding: 8px 12px; font: inherit; font-size: 13px; font-weight: 650;
    cursor: pointer; color: #111;
  }
  .wbtn[aria-pressed="true"] { background: #111; color: #fff; }
  .wbtn:hover { background: #ececee; }
  .wbtn[aria-pressed="true"]:hover { background: #000; }
  .fonts {
    max-height: 280px; overflow: auto; display: grid; gap: 4px;
    padding-right: 2px;
  }
  .font-btn {
    border: 0; background: transparent; border-radius: 16px;
    padding: 12px 14px; text-align: left; cursor: pointer;
    display: flex; align-items: center; font: inherit; color: inherit;
    min-height: 52px;
  }
  .font-btn:hover, .font-btn[aria-selected="true"] { background: #f4f4f5; }
  .font-btn .name {
    font-size: 22px; font-weight: 500; color: #111;
    letter-spacing: -.03em; line-height: 1.2;
  }
  .presets {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    max-height: 280px; overflow: auto;
  }
  .preset-btn {
    border: 0; background: #f4f4f5; border-radius: 16px;
    padding: 12px; text-align: left; cursor: pointer; font: inherit;
  }
  .preset-btn:hover, .preset-btn[aria-selected="true"] { background: #ececee; }
  .preset-btn strong { display: block; font-size: 13px; margin-bottom: 4px; letter-spacing: -.02em; }
  .preset-btn span { display: block; font-size: 12px; color: #525252; }
  .toast {
    position: absolute; left: 50%; bottom: calc(100% + 14px);
    transform: translateX(-50%) translateY(6px);
    background: #111; color: #fff; font-size: 13px; font-weight: 600;
    padding: 10px 14px; border-radius: 999px; opacity: 0;
    pointer-events: none; transition: opacity .22s ease, transform .22s ease;
    white-space: nowrap;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .menu {
    display: none; position: absolute; right: 8px; bottom: calc(100% + 10px);
    min-width: 196px; background: #fff; border: 1px solid rgba(0,0,0,.06);
    border-radius: 16px; padding: 6px; box-shadow: 0 16px 40px rgba(0,0,0,.1);
  }
  .menu.open { display: grid; gap: 2px; }
  .menu button {
    border: 0; background: transparent; border-radius: 12px;
    text-align: left; padding: 8px 10px; font: inherit; cursor: pointer;
  }
  .menu button[aria-checked="true"] { background: #f4f4f5; font-weight: 600; }
  .fab {
    width: 54px; height: 54px; border-radius: 50%;
    border: 1px solid rgba(0,0,0,.06); background: rgba(255,255,255,.95);
    color: #111; font-weight: 700; font-size: 14px; cursor: pointer;
    box-shadow: 0 12px 32px rgba(0,0,0,.1);
  }
  @media (max-width: 860px) {
    .brand b { display: none; }
    .bar, .slots { flex-wrap: wrap; }
    .chip { flex: 1 1 calc(50% - 8px); }
    .actions { width: 100%; justify-content: flex-end; margin-left: 0; }
    .bar { border-radius: 26px; }
    .presets { grid-template-columns: 1fr; }
  }
  @media (max-height: 820px) {
    .fonts, .presets { max-height: 160px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .bar, .panel, .toast, button.icon.spinning svg { animation: none; transition: none; }
  }
`;

class FontdockToolbar extends HTMLElement {
  constructor() {
    super();
    this.combos = FALLBACK_COMBOS;
    this.fonts = fontsFrom(FALLBACK_COMBOS);
    this.display = FALLBACK_COMBOS[0].display;
    this.body = FALLBACK_COMBOS[0].body;
    this.ui = FALLBACK_COMBOS[0].ui || null;
    this.weights = { display: 700, body: 400, ui: 500 };
    this.openPanel = null;
    this.query = "";
    this.format = localStorage.getItem(LS.format) || this.scriptEl()?.dataset.fontdockCss || "css-variables";
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.collapsed = localStorage.getItem(LS.collapsed) === "1";
    this.render();
    this.bind();
    this.restore();
    this.paint();
    this.live();
    this.loadRegistry().then(() => {
      this.restore();
      this.paint();
      this.live();
    });
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.onKey);
    document.removeEventListener("pointerdown", this.onDocPointer, true);
  }

  scriptEl() {
    return document.querySelector("script[src*='fontdock-toolbar']");
  }

  async loadRegistry() {
    try {
      const res = await fetch(new URL("combos.json", import.meta.url), { cache: "no-cache" });
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data.combos) || !data.combos.length) return;
      this.combos = data.combos;
      this.fonts = fontsFrom(data.combos);
    } catch {
      /* keep fallback */
    }
  }

  restore() {
    const first = this.combos[0];
    this.display = findFont(this.fonts, localStorage.getItem(LS.display)) || first.display;
    this.body = findFont(this.fonts, localStorage.getItem(LS.body)) || first.body;
    const savedUi = localStorage.getItem(LS.ui);
    this.ui = savedUi === NONE ? null : findFont(this.fonts, savedUi) || first.ui || null;
    this.weights.display = clampWeight(this.display, Number(localStorage.getItem(LS.displayW)) || defaultWeight(this.display, "display"));
    this.weights.body = clampWeight(this.body, Number(localStorage.getItem(LS.bodyW)) || defaultWeight(this.body, "body"));
    this.weights.ui = this.ui
      ? clampWeight(this.ui, Number(localStorage.getItem(LS.uiW)) || defaultWeight(this.ui, "ui"))
      : 500;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="wrap">
        <div class="toast" id="toast">Copied</div>
        <div class="panel" id="panel" role="dialog" aria-modal="false"></div>
        ${this.collapsed ? this.fabHtml() : this.barHtml()}
      </div>
    `;
  }

  barHtml() {
    return `
      <div class="bar" role="toolbar" aria-label="fontdock">
        <div class="brand"><span class="mark">Aa</span><b>fontdock</b></div>
        <div class="slots">
          ${this.chipHtml("display", "Display", this.display)}
          ${this.chipHtml("body", "Body", this.body)}
          ${this.chipHtml("ui", "UI", this.ui, true)}
        </div>
        <button type="button" class="ghost" id="presets" aria-expanded="false">Presets</button>
        <div class="actions">
          <button type="button" class="icon" id="rand" title="Shuffle">${MIX}</button>
          <button type="button" class="icon" id="formats" title="Snippet format">▾</button>
          <button type="button" class="primary" id="done">Done</button>
          <button type="button" class="icon" id="collapse" title="Collapse">–</button>
        </div>
        <div class="menu" id="menu">
          <button type="button" data-format="css-variables">CSS variables</button>
          <button type="button" data-format="tailwind-v4">Tailwind v4 @theme</button>
          <button type="button" data-format="tailwind-v3">Tailwind v3 config</button>
          <button type="button" data-format="html">HTML &lt;link&gt;</button>
        </div>
      </div>
    `;
  }

  chipHtml(slot, label, font, optional = false) {
    const value = font ? font.family : "None";
    const weight = font ? this.weights[slot] : "—";
    return `
      <button type="button" class="chip" data-open="${slot}" aria-expanded="false" aria-label="${label} font">
        <span class="meta">
          <span class="label">${label}</span>
          <span class="value" style="font-family:${font ? escapeAttr(font.cssFamily) : "inherit"};font-weight:${font ? weight : 400}">${escapeHtml(value)}</span>
        </span>
        <span class="weight">${weight}</span>
        <span class="chev">${CHEV}</span>
      </button>
    `;
  }

  fabHtml() {
    return `<button type="button" class="fab" id="expand" title="Open fontdock">Aa</button>`;
  }

  bind() {
    this.shadowRoot.addEventListener("click", (event) => {
      const open = event.target.closest("[data-open]")?.dataset.open;
      if (open) {
        this.togglePanel(open);
        return;
      }
      const btn = event.target.closest("button");
      if (!btn) return;
      if (btn.id === "presets") this.togglePanel("presets");
      if (btn.id === "rand") {
        btn.classList.remove("spinning");
        void btn.offsetWidth;
        btn.classList.add("spinning");
        this.random();
      }
      if (btn.id === "done") this.finish();
      if (btn.id === "collapse") this.setCollapsed(true);
      if (btn.id === "expand") this.setCollapsed(false);
      if (btn.id === "formats") this.shadowRoot.getElementById("menu")?.classList.toggle("open");
      if (btn.id === "close-panel") this.closePanel();
      if (btn.dataset.format) {
        this.format = btn.dataset.format;
        localStorage.setItem(LS.format, this.format);
        this.syncMenu();
        this.copySnippet();
        this.shadowRoot.getElementById("menu")?.classList.remove("open");
      }
      if (btn.dataset.weight) {
        this.setWeight(this.openPanel, Number(btn.dataset.weight));
      }
      if (btn.dataset.font !== undefined) {
        this.setSlot(this.openPanel, btn.dataset.font || NONE);
      }
      if (btn.dataset.preset) {
        const combo = this.combos.find((item) => item.id === btn.dataset.preset);
        if (combo) {
          this.applyCombo(combo);
          this.closePanel();
        }
      }
    });

    this.shadowRoot.addEventListener("input", (event) => {
      if (event.target.id !== "search") return;
      this.query = event.target.value;
      this.refreshFonts();
    });

    this.onKey = (event) => {
      if (event.key === "Escape") this.closePanel();
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        this.setCollapsed(!this.collapsed);
      }
    };
    this.onDocPointer = (event) => {
      if (!this.openPanel) return;
      if (event.composedPath().includes(this)) return;
      this.closePanel();
    };
    window.addEventListener("keydown", this.onKey);
    document.addEventListener("pointerdown", this.onDocPointer, true);
  }

  setCollapsed(value) {
    this.collapsed = value;
    this.openPanel = null;
    localStorage.setItem(LS.collapsed, value ? "1" : "0");
    this.render();
    this.paint();
  }

  togglePanel(kind) {
    if (this.openPanel === kind) {
      this.closePanel();
      return;
    }
    this.openPanel = kind;
    this.query = "";
    this.renderPanelBody();
    this.shadowRoot.getElementById("panel")?.classList.add("open");
    this.syncChipExpanded();
    if (kind !== "presets") {
      queueMicrotask(() => this.shadowRoot.getElementById("search")?.focus());
    }
  }

  closePanel() {
    this.openPanel = null;
    this.shadowRoot.getElementById("panel")?.classList.remove("open");
    this.syncChipExpanded();
  }

  syncChipExpanded() {
    this.shadowRoot.querySelectorAll("[data-open]").forEach((chip) => {
      chip.setAttribute("aria-expanded", chip.dataset.open === this.openPanel ? "true" : "false");
    });
    const presets = this.shadowRoot.getElementById("presets");
    if (presets) presets.setAttribute("aria-expanded", this.openPanel === "presets" ? "true" : "false");
  }

  renderPanelBody() {
    const panel = this.shadowRoot.getElementById("panel");
    if (!panel || !this.openPanel) return;
    if (this.openPanel === "presets") {
      const match = this.matchedCombo();
      panel.innerHTML = `
        <div class="panel-head"><h3>Presets</h3><button type="button" class="icon" id="close-panel" aria-label="Close">✕</button></div>
        <div class="presets">
          ${this.combos
            .map(
              (combo) => `
            <button type="button" class="preset-btn" data-preset="${combo.id}" aria-selected="${match?.id === combo.id}">
              <strong>${escapeHtml(combo.name)}</strong>
              <span style="font-family:${escapeAttr(combo.display.cssFamily)}">${escapeHtml(combo.display.family)}</span>
              <span style="font-family:${escapeAttr(combo.body.cssFamily)}">${escapeHtml(combo.body.family)}</span>
            </button>`,
            )
            .join("")}
        </div>
      `;
      return;
    }

    const slot = this.openPanel;
    panel.innerHTML = `
      <div class="panel-head">
        <h3>${slot === "ui" ? "UI · optional" : slot}</h3>
        <button type="button" class="icon" id="close-panel" aria-label="Close">✕</button>
      </div>
      <input class="search" id="search" type="text" placeholder="Search fonts…" value="${escapeAttr(this.query)}" autocomplete="off" spellcheck="false" />
      <div class="weights"></div>
      <div class="fonts"></div>
    `;
    this.refreshWeights();
    this.refreshFonts();
  }

  refreshWeights() {
    const slot = this.openPanel;
    const wrap = this.shadowRoot.querySelector(".weights");
    if (!wrap || !slot || slot === "presets") return;
    const current = this[slot];
    const weights = current?.weights?.length ? current.weights : [400, 500, 600, 700];
    wrap.innerHTML = `
      ${
        slot === "ui"
          ? `<button type="button" class="wbtn" data-font="${NONE}" aria-pressed="${!current}">None</button>`
          : ""
      }
      ${weights
        .map(
          (weight) =>
            `<button type="button" class="wbtn" data-weight="${weight}" aria-pressed="${current && this.weights[slot] === weight}">${weight}</button>`,
        )
        .join("")}
    `;
  }

  refreshFonts() {
    const slot = this.openPanel;
    const wrap = this.shadowRoot.querySelector(".fonts");
    if (!wrap || !slot || slot === "presets") return;
    const current = this[slot];
    wrap.innerHTML = filterFonts(this.fonts, slot, this.query)
      .map((font) => {
        ensureFontLoaded(font);
        const selected = current?.slug === font.slug;
        return `
          <button type="button" class="font-btn" data-font="${font.slug}" aria-selected="${selected}">
            <span class="name" style="font-family:${escapeAttr(font.cssFamily)};font-weight:${selected ? this.weights[slot] : defaultWeight(font, slot)}">${escapeHtml(font.family)}</span>
          </button>`;
      })
      .join("");
  }

  setSlot(slot, slug) {
    if (slot === "ui" && (!slug || slug === NONE)) {
      this.ui = null;
      localStorage.setItem(LS.ui, NONE);
      this.live();
      this.paint();
      this.refreshWeights();
      this.refreshFonts();
      return;
    }
    const font = findFont(this.fonts, slug);
    if (!font) return;
    this[slot] = font;
    this.weights[slot] = clampWeight(font, this.weights[slot] || defaultWeight(font, slot));
    localStorage.setItem(LS[slot], font.slug);
    localStorage.setItem(LS[`${slot}W`], String(this.weights[slot]));
    this.live();
    this.paint();
    this.refreshWeights();
    this.refreshFonts();
  }

  setWeight(slot, weight) {
    const font = this[slot];
    if (!font) return;
    this.weights[slot] = clampWeight(font, weight);
    localStorage.setItem(LS[`${slot}W`], String(this.weights[slot]));
    this.live();
    this.paint();
    this.refreshWeights();
    this.refreshFonts();
  }

  applyCombo(combo) {
    this.display = findFont(this.fonts, combo.display.slug) || combo.display;
    this.body = findFont(this.fonts, combo.body.slug) || combo.body;
    this.ui = combo.ui ? findFont(this.fonts, combo.ui.slug) || combo.ui : null;
    this.weights.display = defaultWeight(this.display, "display");
    this.weights.body = defaultWeight(this.body, "body");
    this.weights.ui = this.ui ? defaultWeight(this.ui, "ui") : 500;
    localStorage.setItem(LS.display, this.display.slug);
    localStorage.setItem(LS.body, this.body.slug);
    localStorage.setItem(LS.ui, this.ui?.slug ?? NONE);
    localStorage.setItem(LS.displayW, String(this.weights.display));
    localStorage.setItem(LS.bodyW, String(this.weights.body));
    localStorage.setItem(LS.uiW, String(this.weights.ui));
    this.live();
    this.paint();
  }

  random() {
    const displayPool = this.fonts.filter((font) => preferredRole(font, "display"));
    const bodyPool = this.fonts.filter((font) => preferredRole(font, "body"));
    const uiPool = this.fonts.filter((font) => preferredRole(font, "ui") || preferredRole(font, "body"));
    this.display = pick(displayPool.length ? displayPool : this.fonts, this.display);
    this.body = pick(
      (bodyPool.length ? bodyPool : this.fonts).filter((font) => font.slug !== this.display.slug),
      this.body,
    );
    this.ui =
      Math.random() > 0.2
        ? pick(
            (uiPool.length ? uiPool : this.fonts).filter(
              (font) => font.slug !== this.display.slug && font.slug !== this.body.slug,
            ),
            this.ui,
          )
        : null;
    this.weights.display = defaultWeight(this.display, "display");
    this.weights.body = defaultWeight(this.body, "body");
    this.weights.ui = this.ui ? defaultWeight(this.ui, "ui") : 500;
    localStorage.setItem(LS.display, this.display.slug);
    localStorage.setItem(LS.body, this.body.slug);
    localStorage.setItem(LS.ui, this.ui?.slug ?? NONE);
    localStorage.setItem(LS.displayW, String(this.weights.display));
    localStorage.setItem(LS.bodyW, String(this.weights.body));
    localStorage.setItem(LS.uiW, String(this.weights.ui));
    this.live();
    this.paint();
  }

  live() {
    loadFont(this.display, this.weights.display);
    loadFont(this.body, this.weights.body);
    if (this.ui) loadFont(this.ui, this.weights.ui);
    else clearFontLinks("ui");

    const root = document.documentElement;
    root.style.setProperty("--font-display", this.display.cssFamily);
    root.style.setProperty("--font-body", this.body.cssFamily);
    root.style.setProperty("--font-sans", this.body.cssFamily);
    root.style.setProperty("--font-display-weight", String(this.weights.display));
    root.style.setProperty("--font-body-weight", String(this.weights.body));
    if (this.ui) {
      root.style.setProperty("--font-ui", this.ui.cssFamily);
      root.style.setProperty("--font-ui-weight", String(this.weights.ui));
    } else {
      root.style.removeProperty("--font-ui");
      root.style.removeProperty("--font-ui-weight");
    }
    root.dataset.fontdockCombo =
      this.matchedCombo()?.id ??
      `custom:${this.display.slug}+${this.body.slug}${this.ui ? `+${this.ui.slug}` : ""}`;
    writePreviewSheet(Boolean(this.ui));
  }

  matchedCombo() {
    return this.combos.find((combo) => {
      if (combo.display.slug !== this.display.slug || combo.body.slug !== this.body.slug) return false;
      return (combo.ui?.slug ?? null) === (this.ui?.slug ?? null);
    });
  }

  paint() {
    if (this.collapsed) {
      this.syncMenu();
      return;
    }
    for (const slot of ["display", "body", "ui"]) {
      const chip = this.shadowRoot.querySelector(`[data-open="${slot}"]`);
      if (!chip) continue;
      const font = this[slot];
      const value = chip.querySelector(".value");
      const weight = chip.querySelector(".weight");
      if (value) {
        value.textContent = font ? font.family : "None";
        value.style.fontFamily = font ? font.cssFamily : "inherit";
        value.style.fontWeight = font ? String(this.weights[slot]) : "400";
      }
      if (weight) weight.textContent = font ? String(this.weights[slot]) : "—";
    }
    this.syncChipExpanded();
    this.syncMenu();
  }

  syncMenu() {
    this.shadowRoot.querySelectorAll("[data-format]").forEach((btn) => {
      btn.setAttribute("aria-checked", btn.dataset.format === this.format ? "true" : "false");
    });
  }

  currentPair() {
    const match = this.matchedCombo();
    return {
      id: match?.id ?? `custom:${this.display.slug}+${this.body.slug}${this.ui ? `+${this.ui.slug}` : ""}`,
      name: match?.name ?? "Custom",
      display: { ...this.display, weight: this.weights.display },
      body: { ...this.body, weight: this.weights.body },
      ui: this.ui ? { ...this.ui, weight: this.weights.ui } : null,
    };
  }

  async copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet(this.currentPair(), this.format, this.scriptEl()?.dataset.fontdockStack || "html"));
    } catch {
      /* still toast */
    }
    this.toast("CSS snippet copied");
  }

  async finish() {
    try {
      await navigator.clipboard.writeText(applyPrompt(this.currentPair()));
    } catch {
      /* still toast */
    }
    this.toast("Prompt copied · paste in Cursor");
  }

  toast(message) {
    const el = this.shadowRoot.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(this._toast);
    this._toast = setTimeout(() => el.classList.remove("show"), 2200);
  }
}

function fontsFrom(combos) {
  const bySlug = new Map();
  for (const combo of combos) {
    for (const font of [combo.display, combo.body, combo.ui]) {
      if (!font?.slug) continue;
      const existing = bySlug.get(font.slug);
      if (existing) {
        if (font.role && !existing.roles.includes(font.role)) existing.roles.push(font.role);
        continue;
      }
      bySlug.set(font.slug, { ...font, roles: [font.role].filter(Boolean) });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.family.localeCompare(b.family));
}

function findFont(fonts, id) {
  if (!id || id === NONE) return null;
  const needle = String(id).toLowerCase();
  return fonts.find((font) => font.slug === needle || font.family.toLowerCase() === needle) ?? null;
}

function preferredRole(font, role) {
  return font.role === role || font.roles?.includes(role) || (role === "display" && (font.category === "display" || font.category === "serif"));
}

function filterFonts(fonts, role, query) {
  const q = query.trim().toLowerCase();
  const preferred = fonts.filter((font) => preferredRole(font, role));
  const rest = fonts.filter((font) => !preferredRole(font, role));
  const list = [...preferred, ...rest];
  if (!q) return list;
  return list.filter((font) => font.family.toLowerCase().includes(q) || font.slug.includes(q));
}

function defaultWeight(font, role) {
  const weights = font.weights?.length ? font.weights : [400, 500, 600, 700];
  if (role === "display") return weights.includes(700) ? 700 : weights[weights.length - 1];
  if (role === "ui") return weights.includes(500) ? 500 : weights[0];
  return weights.includes(400) ? 400 : weights[0];
}

function clampWeight(font, weight) {
  const weights = font.weights?.length ? font.weights : [400, 500, 600, 700];
  if (weights.includes(weight)) return weight;
  return weights.reduce((best, current) =>
    Math.abs(current - weight) < Math.abs(best - weight) ? current : best,
  );
}

function stylesheetUrls(font, weight) {
  if (font.cdnPattern) {
    const weights = weight ? [weight] : font.weights || [400];
    return weights.map((w) => font.cdnPattern.replace("{weight}", String(w)));
  }
  return [font.cdn];
}

function loadFont(font, weight) {
  ensureFontLoaded(font, weight);
}

function ensureFontLoaded(font, weight) {
  const urls = stylesheetUrls(font, weight);
  urls.forEach((href, index) => {
    const id = `fontdock-${font.slug}-${weight || "base"}-${index}`;
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.href = href;
  });
}

function clearFontLinks(role) {
  [...document.querySelectorAll(`link[id^="fontdock-"]`)].forEach((link) => {
    if (role === "ui" && /fontdock-.*-ui/.test(link.id)) link.remove();
  });
}

function pick(list, current) {
  if (!list.length) return current;
  if (list.length === 1) return list[0];
  let next = current;
  let guard = 0;
  while ((next === current || next?.slug === current?.slug) && guard < 24) {
    next = list[Math.floor(Math.random() * list.length)];
    guard += 1;
  }
  return next;
}

function writePreviewSheet(hasUi) {
  let style = document.getElementById("fontdock-preview");
  if (!style) {
    style = document.createElement("style");
    style.id = "fontdock-preview";
    document.head.appendChild(style);
  }
  style.textContent = `
    html, body {
      font-family: var(--font-body) !important;
      font-weight: var(--font-body-weight, 400) !important;
    }
    h1, h2, h3, h4, h5, h6, .font-display, [data-fontdock="display"] {
      font-family: var(--font-display) !important;
      font-weight: var(--font-display-weight, 700) !important;
    }
    ${
      hasUi
        ? `nav, button, .font-ui, [data-fontdock="ui"], label {
      font-family: var(--font-ui) !important;
      font-weight: var(--font-ui-weight, 500) !important;
    }`
        : ""
    }
  `;
}

function snippet(pair, format, stack) {
  const { display, body, ui } = pair;
  const urls = [...new Set([
    ...stylesheetUrls(display, display.weight),
    ...stylesheetUrls(body, body.weight),
    ...(ui ? stylesheetUrls(ui, ui.weight) : []),
  ])];
  const imports = urls.map((url) => `@import url("${url}");`).join("\n");
  const uiBlock = ui
    ? `\n  --font-ui: ${ui.cssFamily};\n  --font-ui-weight: ${ui.weight};`
    : "";
  const uiRule = ui
    ? `\nnav, button, .font-ui { font-family: var(--font-ui); font-weight: var(--font-ui-weight); }`
    : "";

  if (format === "tailwind-v4") {
    return `${imports}

@theme {
  --font-display: ${display.cssFamily};
  --font-sans: ${body.cssFamily};${ui ? `\n  --font-ui: ${ui.cssFamily};` : ""}
}

html { font-family: var(--font-sans); font-weight: ${body.weight}; }
h1, h2, h3, .font-display { font-family: var(--font-display); font-weight: ${display.weight}; }${
      ui ? `\nnav, button, .font-ui { font-family: var(--font-ui); font-weight: ${ui.weight}; }` : ""
    }`;
  }
  if (format === "tailwind-v3") {
    return `fontFamily: {
  display: [${JSON.stringify(display.family)}, "sans-serif"],
  sans: [${JSON.stringify(body.family)}, "sans-serif"],${
      ui ? `\n  ui: [${JSON.stringify(ui.family)}, "sans-serif"],` : ""
    }
}`;
  }
  if (format === "html") {
    return `${urls.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n")}
<style>
  :root {
    --font-display: ${display.cssFamily};
    --font-body: ${body.cssFamily};
    --font-display-weight: ${display.weight};
    --font-body-weight: ${body.weight};${ui ? `\n    --font-ui: ${ui.cssFamily};\n    --font-ui-weight: ${ui.weight};` : ""}
  }
  body { font-family: var(--font-body); font-weight: var(--font-body-weight); }
  h1, h2, h3 { font-family: var(--font-display); font-weight: var(--font-display-weight); }${
      ui ? `\n  nav, button { font-family: var(--font-ui); font-weight: var(--font-ui-weight); }` : ""
    }
</style>`;
  }
  return `/* ${pair.name} · ${stack} */
${imports}

:root {
  --font-display: ${display.cssFamily};
  --font-body: ${body.cssFamily};
  --font-display-weight: ${display.weight};
  --font-body-weight: ${body.weight};${uiBlock}
}

html, body { font-family: var(--font-body); font-weight: var(--font-body-weight); }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); font-weight: var(--font-display-weight); }${uiRule}`;
}

function applyPrompt(pair) {
  const lines = [
    "Apply these typefaces to the current project.",
    "Inspect the stack (Next.js, Astro, Vite, HTML, Tailwind v3/v4) and write idiomatic integration:",
    "- Google Fonts on Next.js → next/font/google when nextFont is set",
    "- Fontshare / Fontsource → <link> or CSS @import (never a fake next/font import)",
    "- Map headings (h1–h6, .font-display) to Display, body copy to Body, nav/buttons/.font-ui to UI if present",
    "- Then remove the live preview: `npx fontdock uninstall`",
    "- Do not invent other families.",
    "",
  ];
  if (pair.name && pair.name !== "Custom") {
    lines.push(`Preset: ${pair.name} (${pair.id})`, "");
  }
  lines.push(promptRole("Display", "headings h1–h6 and .font-display", pair.display));
  lines.push(promptRole("Body", "html, paragraphs, long copy", pair.body));
  lines.push(
    pair.ui
      ? promptRole("UI", "nav, buttons, labels, .font-ui", pair.ui)
      : "UI: none — reuse Body for chrome.",
  );
  return lines.join("\n").trim() + "\n";
}

function promptRole(label, usage, font) {
  const urls = stylesheetUrls(font, font.weight);
  return [
    `${label} (${usage}): ${font.family} ${font.weight}`,
    `  font-family: ${font.cssFamily};`,
    `  font-weight: ${font.weight};`,
    ...urls.map((url) => `  CDN: ${url}`),
    font.page ? `  specimen: ${font.page}` : "",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function mount() {
  if (!document.querySelector("fontdock-toolbar")) {
    document.body.append(document.createElement("fontdock-toolbar"));
  }
}

if (!customElements.get("fontdock-toolbar")) {
  customElements.define("fontdock-toolbar", FontdockToolbar);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}

export { FontdockToolbar };
