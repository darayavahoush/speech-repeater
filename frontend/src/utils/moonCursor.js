// Vaakify crescent-moon cursor.
//  - crescent follows the mouse exactly (no lag), tip of the upper horn is the click point
//  - sparkles trail off as you move
//  - colours follow the chosen character (setCursorCharacter)
//  - grows on clickable things, shrinks + bursts on click, fades over text fields / disabled controls
//  - only runs with a real mouse; touch devices keep their normal behaviour
//  - respects "reduce motion": crescent only, no sparkles
// Call initMoonCursor() once (returns a cleanup fn) and setCursorCharacter(name) whenever it changes.

const DEFAULT_COLORS = { a: "#F5C04A", b: "#E8825A" };

// Optional hand-picked colours per character (upper-case name -> [main, second]).
// Any character not listed here still gets its own colour, generated from its name.
const OVERRIDES = {
  BOLT: ["#FFD23F", "#FF8A00"],
};

function hashHue(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 360;
}

export function colorsFor(name) {
  if (!name) return DEFAULT_COLORS;
  const key = String(name).trim().toUpperCase();
  if (OVERRIDES[key]) return { a: OVERRIDES[key][0], b: OVERRIDES[key][1] };
  const h = hashHue(key);
  return { a: `hsl(${h} 92% 62%)`, b: `hsl(${(h + 40) % 360} 88% 58%)` };
}

export function setCursorCharacter(name) {
  if (typeof document === "undefined") return;
  const { a, b } = colorsFor(name);
  const root = document.documentElement;
  root.style.setProperty("--mc-a", a);
  root.style.setProperty("--mc-b", b);
}

// Hotspot = tip of the upper horn inside the 32x32 svg.
const HX = 8.3;
const HY = 8.7;

const TEXT_SEL =
  'textarea, [contenteditable=""], [contenteditable="true"], input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=reset]):not([type=range]):not([type=file]):not([type=color])';
const CLICK_SEL =
  'a[href], button, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="option"], label[for], summary, select, [data-clickable], .cursor-pointer, input[type=checkbox], input[type=radio], input[type=button], input[type=submit], input[type=reset], input[type=range], input[type=file], [tabindex]:not([tabindex="-1"])';
const DISABLED_SEL = ':disabled, [aria-disabled="true"]';

const CSS = `
html.mc-on, html.mc-on * { cursor: none !important; }
html.mc-on :is(${TEXT_SEL}) { cursor: text !important; }
#mc-root { position: fixed; inset: 0; pointer-events: none; z-index: 2147483647; overflow: hidden; }
#mc-root .mc-cur { position: absolute; left: 0; top: 0; will-change: transform; }
#mc-root .mc-cur { width: 32px; height: 32px; }
#mc-root .mc-inner {
  width: 32px; height: 32px; transform-origin: ${HX}px ${HY}px;
  transition: transform .16s cubic-bezier(.3,1.5,.5,1), opacity .15s ease;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,.45));
}
#mc-root .mc-inner svg { display: block; }
#mc-root[data-mode="hidden"] .mc-cur { opacity: 0; }
#mc-root[data-mode="text"] .mc-cur { opacity: 0; }
#mc-root[data-mode="click"] .mc-inner { transform: scale(1.22) rotate(-14deg); }
#mc-root[data-mode="disabled"] .mc-inner { opacity: .45; }
#mc-root.mc-down .mc-inner { transform: scale(.82) rotate(-8deg); }
#mc-root .mc-sp {
  position: absolute; width: 11px; height: 11px;
  clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
  animation: mc-spark .75s ease-out forwards;
}
@keyframes mc-spark {
  0%   { opacity: .95; transform: translate(-50%,-50%) scale(.4) rotate(0deg); }
  100% { opacity: 0;   transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.1) rotate(100deg); }
}
`;

const SVG = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="mc-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style="stop-color:var(--mc-a, ${DEFAULT_COLORS.a})"/>
      <stop offset="1" style="stop-color:var(--mc-b, ${DEFAULT_COLORS.b})"/>
    </linearGradient>
  </defs>
  <g transform="rotate(-35 17 17)">
    <path d="M14.64 5.24 A12 12 0 1 0 28.76 19.36 A10 10 0 0 1 14.64 5.24 Z"
          fill="url(#mc-g)" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M21.6 11.2 l0.9 2.2 2.2 0.9 -2.2 0.9 -0.9 2.2 -0.9 -2.2 -2.2 -0.9 2.2 -0.9z" fill="#fff"/>
  </g>
</svg>`;

export function initMoonCursor() {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  if (document.getElementById("mc-root")) return () => {};

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const style = document.createElement("style");
  style.id = "mc-style";
  style.textContent = CSS;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "mc-root";
  root.dataset.mode = "hidden";
  root.innerHTML = `<div class="mc-cur"><div class="mc-inner">${SVG}</div></div>`;
  document.body.appendChild(root);
  document.documentElement.classList.add("mc-on");

  const cur = root.querySelector(".mc-cur");

  let x = -100, y = -100;          // real mouse position
  let lastX = null, lastY = null;
  let dist = 0;
  let live = 0;
  let mode = "hidden";
  let inside = true;

  const setMode = (m) => {
    if (m !== mode) { mode = m; root.dataset.mode = m; }
  };

  const spark = (px, py, spread, big) => {
    if (reduce || live > 30) return;
    const el = document.createElement("i");
    el.className = "mc-sp";
    const ang = Math.random() * Math.PI * 2;
    const r = (0.4 + Math.random() * 0.6) * spread;
    el.style.left = px + (Math.random() - 0.5) * 8 + "px";
    el.style.top = py + (Math.random() - 0.5) * 8 + "px";
    el.style.setProperty("--dx", Math.cos(ang) * r + "px");
    el.style.setProperty("--dy", Math.sin(ang) * r + 12 + "px");
    const pick = Math.random();
    el.style.background = pick < 0.4 ? "var(--mc-a)" : pick < 0.8 ? "var(--mc-b)" : "#fff";
    if (big) { el.style.width = el.style.height = "14px"; }
    live += 1;
    el.addEventListener("animationend", () => { el.remove(); live -= 1; }, { once: true });
    root.appendChild(el);
  };

  const onMove = (e) => {
    x = e.clientX; y = e.clientY;
    cur.style.transform = `translate3d(${x - HX}px, ${y - HY}px, 0)`;

    const t = e.target instanceof Element ? e.target : null;
    if (!inside) inside = true;
    if (t && t.closest(TEXT_SEL)) setMode("text");
    else if (t && t.closest(DISABLED_SEL)) setMode("disabled");
    else if (t && t.closest(CLICK_SEL)) setMode("click");
    else setMode("default");

    if (lastX !== null) {
      dist += Math.hypot(x - lastX, y - lastY);
      if (dist > 24 && mode !== "text") { dist = 0; spark(x + 6, y + 8, 22, false); }
    }
    lastX = x; lastY = y;
  };

  const onDown = () => {
    root.classList.add("mc-down");
    if (mode === "text") return;
    for (let i = 0; i < 7; i += 1) spark(x + 6, y + 8, 46, true);
  };
  const onUp = () => root.classList.remove("mc-down");
  const onLeave = () => { inside = false; setMode("hidden"); };

  document.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mousedown", onDown, true);
  document.addEventListener("mouseup", onUp, true);
  document.documentElement.addEventListener("mouseleave", onLeave);

  return () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mousedown", onDown, true);
    document.removeEventListener("mouseup", onUp, true);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    document.documentElement.classList.remove("mc-on");
    root.remove();
    style.remove();
  };
}
