#!/usr/bin/env node
// Contrast check by role, in the light and dark themes.
//
// Usage:
//   node contrast.mjs <theme.css> --prefix ps            standard role pairs
//   node contrast.mjs <file.css> --pairs pairs.json      custom pairs
//   node contrast.mjs --pair "#56626C" "#F5F3EE"         a single pair
//   add --json for JSON output
//
// pairs.json: [{ "fg": "--text-main", "bg": "--page", "min": 4.5, "note": "body text", "level": "required" }]
// level is "required" (default) or "warning" (reported, does not fail).
//
// Light theme: :root, html, [data-theme="light"]. Dark theme: [data-theme="dark"],
// .dark, or any block inside @media (prefers-color-scheme: dark).
// The dark theme inherits from the light theme every variable it does not redefine.
// Exits with code 1 if at least one required pair is below its minimum.

import { readFileSync } from 'node:fs';
import { parseColor, contrast, toOklch, toHex } from './color.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const asJson = args.includes('--json');

// ---------------------------------------------------------------------------
// Single-pair mode
// ---------------------------------------------------------------------------
if (args[0] === '--pair') {
  const fg = parseColor(args[1]);
  const bg = parseColor(args[2]);
  if (!fg || !bg) {
    console.error('Colors not recognized.');
    process.exit(2);
  }
  const min = parseFloat(flag('--min') || '4.5');
  const ratio = contrast(fg, bg);
  const out = { fg: args[1], bg: args[2], ratio: +ratio.toFixed(2), min, ok: ratio >= min };
  console.log(asJson ? JSON.stringify(out) : `${args[1]} on ${args[2]}: ${ratio.toFixed(2)}:1 (minimum ${min}) ${out.ok ? 'OK' : 'FAILS'}`);
  process.exit(out.ok ? 0 : 1);
}

const file = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--prefix' && args[args.indexOf(a) - 1] !== '--pairs');
if (!file) {
  console.error('Pass the CSS file to check. See the script header for usage.');
  process.exit(2);
}
const prefix = flag('--prefix');
const pairsFile = flag('--pairs');

// ---------------------------------------------------------------------------
// Mini parser: collects custom properties with their context
// ---------------------------------------------------------------------------
const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const stack = [];
const blocks = []; // { context: [preludes], decls: Map }
let buf = '';
let current = null;
for (const ch of css) {
  if (ch === '{') {
    stack.push(buf.trim());
    buf = '';
    current = { context: [...stack], decls: new Map() };
    blocks.push(current);
  } else if (ch === '}') {
    flushDecl();
    stack.pop();
    buf = '';
    current = blocks.findLast((b) => b.context.length === stack.length && b.context.every((p, i) => p === stack[i])) || null;
  } else if (ch === ';') {
    flushDecl();
    buf = '';
  } else {
    buf += ch;
  }
}
function flushDecl() {
  const m = buf.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/);
  if (m && current) current.decls.set(m[1], m[2]);
}

function themeOf(context) {
  const joined = context.join(' | ');
  if (/prefers-color-scheme:\s*dark/.test(joined)) return 'dark';
  const sel = context[context.length - 1] || '';
  if (/\[data-theme=["']?dark["']?\]|\.dark\b/.test(sel)) return 'dark';
  if (/@theme/.test(joined)) return null; // Tailwind tokens are not theme values
  if (/:root|^html\b|\[data-theme=["']?light["']?\]/.test(sel)) return 'light';
  return null;
}

const themes = { light: new Map(), dark: new Map() };
for (const b of blocks) {
  const t = themeOf(b.context);
  if (!t) continue;
  for (const [k, v] of b.decls) themes[t].set(k, v);
}
const hasDark = themes.dark.size > 0;
const darkMerged = new Map([...themes.light, ...themes.dark]);

function resolve(map, value, depth = 0) {
  if (!value || depth > 20) return value;
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g, (_, name, fallback) => {
    if (map.has(name)) return resolve(map, map.get(name), depth + 1);
    return fallback ? resolve(map, fallback, depth + 1) : `var(${name})`;
  });
}

// ---------------------------------------------------------------------------
// Pairs
// ---------------------------------------------------------------------------
const TEXT = 4.5, UI = 3;
const softs = ['primary-soft', 'success-soft', 'error-soft', 'warning-soft', 'info-soft'];
const standardPairs = [
  ...['bg', 'surface', 'surface-2', ...softs].map((bg) => ['ink', bg, TEXT, 'body text']),
  ...['bg', 'surface', 'surface-2', 'primary-soft'].map((bg) => ['ink-muted', bg, TEXT, 'secondary text']),
  ...['bg', 'surface', 'surface-2', 'primary-soft'].map((bg) => ['primary', bg, TEXT, 'links and actions as text']),
  ['on-primary', 'primary', TEXT, 'text on primary fill'],
  ['on-primary', 'primary-hover', TEXT, 'text on primary hover'],
  ['on-accent', 'accent', TEXT, 'text on accent fill'],
  ['on-accent', 'accent-hover', TEXT, 'text on accent hover'],
  ['accent-ink', 'bg', TEXT, 'accent as text'],
  ['accent-ink', 'surface', TEXT, 'accent as text'],
  ...['success', 'error', 'warning', 'info'].flatMap((s) => [
    [s, 'surface', TEXT, `${s} state as text`],
    [s, `${s}-soft`, TEXT, `${s} state on its tint`],
  ]),
  ['border-strong', 'surface', UI, 'control border'],
  ['border-strong', 'bg', UI, 'control border when a field sits directly on bg', 'warning'],
  ['focus-ring', 'bg', UI, 'focus ring'],
  ['focus-ring', 'surface', UI, 'focus ring'],
];

function varName(role) {
  return prefix ? `--${prefix}-${role}` : `--${role}`;
}

let pairs;
if (pairsFile) {
  pairs = JSON.parse(readFileSync(pairsFile, 'utf8')).map((p) => [p.fg, p.bg, p.min ?? TEXT, p.note ?? '', p.level ?? 'required']);
} else {
  pairs = standardPairs.map(([fg, bg, min, note, level]) => [varName(fg), varName(bg), min, note, level ?? 'required']);
}

function evaluate(map, themeName) {
  const rows = [];
  const missing = new Set();
  for (const [fgName, bgName, min, note, level] of pairs) {
    const fgRaw = map.get(fgName);
    const bgRaw = map.get(bgName);
    if (fgRaw === undefined) missing.add(fgName);
    if (bgRaw === undefined) missing.add(bgName);
    if (fgRaw === undefined || bgRaw === undefined) continue;
    const fgVal = resolve(map, fgRaw);
    const bgVal = resolve(map, bgRaw);
    const fg = parseColor(fgVal);
    const bg = parseColor(bgVal);
    if (!fg || !bg) {
      rows.push({ theme: themeName, fg: fgName, bg: bgName, min, note, error: `unreadable value (${fgVal} / ${bgVal})` });
      continue;
    }
    const ratio = contrast(fg, bg);
    rows.push({ theme: themeName, fg: fgName, bg: bgName, fgVal, bgVal, ratio: +ratio.toFixed(2), min, ok: ratio >= min, level, note });
  }
  return { rows, missing: [...missing] };
}

function surfaces(map, themeName) {
  const roles = ['bg', 'surface', 'surface-2', 'border', 'border-strong', 'ink', 'ink-muted', 'primary', 'primary-soft', 'accent'];
  const out = [];
  for (const role of roles) {
    const name = varName(role);
    if (!map.has(name)) continue;
    const c = parseColor(resolve(map, map.get(name)));
    if (!c) continue;
    const { L, C, H } = toOklch(c);
    out.push({ theme: themeName, role, hex: toHex(c), L: +L.toFixed(3), C: +C.toFixed(3), H: Math.round(H) });
  }
  return out;
}

function checks(surf, themeName) {
  const get = (r) => surf.find((s) => s.role === r);
  const notes = [];
  const bg = get('bg'), s1 = get('surface'), s2 = get('surface-2'), ink = get('ink');
  if (bg && s1 && s2) {
    if (themeName === 'light' && !(s1.L >= bg.L && bg.L > s2.L))
      notes.push('Light surface order differs from the method: expected surface ≥ bg > surface-2 in lightness.');
    if (themeName === 'dark' && !(bg.L < s1.L && s1.L < s2.L))
      notes.push('Dark surface order differs from the method: expected bg < surface < surface-2 (surfaces rise toward the viewer).');
  }
  if (bg && themeName === 'light' && bg.hex === '#FFFFFF')
    notes.push('The page background is pure white: the method uses a warm white for bg and keeps #FFF for surface.');
  if (ink && (ink.hex === '#000000' || ink.hex === '#FFFFFF'))
    notes.push(`ink is pure ${ink.hex}: the method uses a tinted ink.`);
  return notes;
}

const results = [];
const surf = [];
const notes = {};
for (const [name, map] of [['light', themes.light], ...(hasDark ? [['dark', darkMerged]] : [])]) {
  const r = evaluate(map, name);
  results.push(r);
  const s = surfaces(map, name);
  surf.push(...s);
  if (!pairsFile) notes[name] = checks(s, name);
}

const allRows = results.flatMap((r) => r.rows);
const failed = allRows.filter((r) => (r.ok === false && r.level !== 'warning') || r.error);
const warned = allRows.filter((r) => r.ok === false && r.level === 'warning');

if (asJson) {
  console.log(JSON.stringify({ file, prefix, darkTheme: hasDark, pairs: allRows, missing: results.map((r) => r.missing), lightness: surf, notes }, null, 2));
} else {
  console.log(`# Contrast — ${file}${prefix ? ` (prefix ${prefix})` : ''}\n`);
  if (!hasDark) console.log('**No dark theme found.**\n');
  for (const r of results) {
    const t = r.rows[0]?.theme ?? '';
    if (!r.rows.length) continue;
    console.log(`## ${t === 'light' ? 'Light' : 'Dark'} theme\n`);
    console.log('| Text / element | Background | Ratio | Minimum | Result | Use |');
    console.log('| --- | --- | --- | --- | --- | --- |');
    for (const row of r.rows) {
      if (row.error) console.log(`| ${row.fg} | ${row.bg} | — | ${row.min} | ERROR | ${row.error} |`);
      else console.log(`| ${row.fg} | ${row.bg} | ${row.ratio}:1 | ${row.min} | ${row.ok ? 'ok' : row.level === 'warning' ? 'warning' : '**FAIL**'} | ${row.note} |`);
    }
    if (r.missing.length) console.log(`\nMissing variables: ${r.missing.join(', ')}`);
    console.log('');
  }
  if (surf.length) {
    console.log('## Role lightness (OKLCH)\n');
    console.log('| Theme | Role | Hex | L | C | H |');
    console.log('| --- | --- | --- | --- | --- | --- |');
    for (const s of surf) console.log(`| ${s.theme} | ${s.role} | ${s.hex} | ${s.L} | ${s.C} | ${s.H} |`);
    console.log('');
  }
  const allNotes = Object.entries(notes).flatMap(([t, n]) => n.map((line) => `- (${t}) ${line}`));
  if (allNotes.length) {
    console.log('## Observations (indicative: color is the flexible part of the method)\n');
    console.log(allNotes.join('\n'));
  }
  console.log(`\nPairs checked: ${allRows.length}, below minimum or unreadable: ${failed.length}, warnings: ${warned.length}.`);
}
process.exit(failed.length ? 1 : 0);
