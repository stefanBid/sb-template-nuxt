// Shared utilities: CSS color parsing, OKLCH conversion, WCAG contrast.
// No dependencies.

const NAMED = {
  white: [255, 255, 255, 1],
  black: [0, 0, 0, 1],
  transparent: [0, 0, 0, 0],
};

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function num(token, scale = 1) {
  token = token.trim();
  if (token.endsWith('%')) return (parseFloat(token) / 100) * scale;
  return parseFloat(token);
}

function splitArgs(inner) {
  // "r g b / a" or "r, g, b, a"
  let alpha = null;
  let body = inner;
  if (inner.includes('/')) {
    const [a, b] = inner.split('/');
    body = a;
    alpha = b.trim();
  }
  const parts = body.split(/[\s,]+/).filter(Boolean);
  if (alpha === null && parts.length === 4) alpha = parts.pop();
  return { parts, alpha };
}

function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [r, g, bb].map((c) => clamp01(fromLin(c)));
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}

/** Returns {r,g,b,a} in 0..1, or null if the value is not a literal color. */
export function parseColor(value) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (NAMED[v]) {
    const [r, g, b, a] = NAMED[v];
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }
  let m = v.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let hex = m[1];
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((c) => c + c).join('');
    if (hex.length !== 6 && hex.length !== 8) return null;
    const n = (i) => parseInt(hex.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: hex.length === 8 ? n(6) : 1 };
  }
  m = v.match(/^(rgba?|hsla?|oklch)\((.*)\)$/);
  if (!m) return null;
  const fn = m[1];
  if (m[2].includes('var(') || m[2].includes('calc(')) return null;
  const { parts, alpha } = splitArgs(m[2]);
  if (parts.length < 3) return null;
  const a = alpha === null ? 1 : num(alpha, 1);
  if (fn.startsWith('rgb')) {
    const ch = (t) => (t.endsWith('%') ? num(t, 1) : parseFloat(t) / 255);
    return { r: ch(parts[0]), g: ch(parts[1]), b: ch(parts[2]), a };
  }
  if (fn.startsWith('hsl')) {
    const [r, g, b] = hslToRgb(parseFloat(parts[0]), num(parts[1], 1), num(parts[2], 1));
    return { r, g, b, a };
  }
  // oklch: L as % or 0..1, C as number or % (100% = 0.4), H in degrees
  const L = parts[0].endsWith('%') ? num(parts[0], 1) : parseFloat(parts[0]);
  const C = parts[1].endsWith('%') ? num(parts[1], 0.4) : parseFloat(parts[1]);
  const H = parseFloat(parts[2]) || 0;
  const [r, g, b] = oklchToRgb(L, C, H);
  return { r, g, b, a };
}

/** Composites a color with alpha over an opaque background. */
export function over(fg, bg) {
  if (fg.a >= 1) return fg;
  const mix = (f, b) => f * fg.a + b * (1 - fg.a);
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: 1 };
}

export function luminance({ r, g, b }) {
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

export function contrast(fg, bg) {
  const f = over(fg, bg);
  const l1 = luminance(f);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function toOklch({ r, g, b }) {
  const [R, G, B] = [toLin(r), toLin(g), toLin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + Bb * Bb);
  let H = (Math.atan2(Bb, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

export function toHex({ r, g, b }) {
  const h = (x) => Math.round(clamp01(x) * 255).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

/** Finds literal colors inside any CSS value (e.g. box-shadow). */
export function findColors(value) {
  const re = /#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\([^()]*\)|\b(?:white|black)\b/g;
  return value.match(re) || [];
}
