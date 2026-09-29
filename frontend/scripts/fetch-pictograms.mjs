// Downloads ARASAAC pictograms for every word in src/utils/wordBank.js.
//
//   npm run pictograms
//
// - Looks each English word up on the ARASAAC API and takes the best match.
// - Saves PNGs to public/pictograms/<id>.png (self-hosted, so the app never
//   depends on ARASAAC being up).
// - Writes src/utils/pictogramMap.json  ({ "animals:cat": 2517, ... }).
// - Writes scripts/pictogram-review.html so you can eyeball every match.
// - To fix a wrong/missing match, add its ID to scripts/pictogram-overrides.json
//   ({ "colours:orange": 12345 }) and run again. Find IDs at arasaac.org
//   (the number in a pictogram's page URL).
//
// Pictograms: (c) Government of Aragon, author Sergio Palao, ARASAAC
// (https://arasaac.org), licence CC BY-NC-SA 4.0.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORD_BANK } from "../src/utils/wordBank.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const outDir = path.join(root, "public", "pictograms");
const mapFile = path.join(root, "src", "utils", "pictogramMap.json");
const overridesFile = path.join(here, "pictogram-overrides.json");
const reviewFile = path.join(here, "pictogram-review.html");
const API = "https://api.arasaac.org/v1/pictograms/en";
const STATIC = "https://static.arasaac.org/pictograms";
const SIZE = 300;

fs.mkdirSync(outDir, { recursive: true });
const overrides = fs.existsSync(overridesFile) ? JSON.parse(fs.readFileSync(overridesFile, "utf8")) : {};
const map = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, "utf8")) : {};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (res.status === 404) return [];
      if (res.ok) return await res.json();
      if (res.status !== 429 && res.status < 500) return [];
    } catch { /* retry */ }
    await sleep(600 * (i + 1));
  }
  return [];
}

async function download(id) {
  const file = path.join(outDir, `${id}.png`);
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return true;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(`${STATIC}/${id}/${id}_${SIZE}.png`);
      if (res.ok) {
        fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
        return true;
      }
      if (res.status === 404) return false;
    } catch { /* retry */ }
    await sleep(600 * (i + 1));
  }
  return false;
}

async function findId(term) {
  let hits = await getJson(`${API}/bestsearch/${encodeURIComponent(term)}`);
  if (!hits.length) hits = await getJson(`${API}/search/${encodeURIComponent(term)}`);
  return hits.length ? hits[0]._id : null;
}

const jobs = [];
for (const [cat, rows] of Object.entries(WORD_BANK)) {
  for (const [en, , , term] of rows) jobs.push({ key: `${cat}:${en}`, cat, en, term: term || en });
}

const missing = [];
let done = 0;
async function worker() {
  while (jobs.length) {
    const job = jobs.shift();
    let id = overrides[job.key] ?? null;
    if (!id) id = await findId(job.term);
    if (id && (await download(id))) map[job.key] = id;
    else { delete map[job.key]; missing.push(job.key); }
    if (++done % 25 === 0) console.log(`  ${done} words processed...`);
    await sleep(120);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(mapFile, JSON.stringify(sorted, null, 2) + "\n");

const cards = Object.entries(sorted)
  .map(([k, id]) => `<figure><img src="../public/pictograms/${id}.png" loading="lazy"><figcaption><b>${k}</b><br>id ${id}</figcaption></figure>`)
  .join("");
fs.writeFileSync(reviewFile, `<!doctype html><meta charset="utf-8"><title>Pictogram review</title>
<style>body{font-family:system-ui;margin:20px}main{display:grid;grid-template-columns:repeat(auto-fill,120px);gap:12px}
figure{margin:0;text-align:center;font-size:12px}img{width:100px;height:100px;object-fit:contain;background:#fff;border:1px solid #ddd;border-radius:8px}</style>
<h2>Check each match. Wrong ones: add "category:word": id to pictogram-overrides.json and re-run.</h2><main>${cards}</main>`);

console.log(`\nMatched ${Object.keys(sorted).length} words.`);
if (missing.length) console.log(`No pictogram found for ${missing.length}:\n  ${missing.join("\n  ")}\n(They will show a letter tile until you add an override.)`);
console.log(`Review page: ${path.relative(process.cwd(), reviewFile)}`);
