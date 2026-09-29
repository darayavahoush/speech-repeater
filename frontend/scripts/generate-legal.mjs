// Builds static public/privacy.html and public/terms.html from
// src/utils/legalContent.js so the pages are readable without JavaScript
// (needed for Google OAuth verification). Runs automatically before `npm run build`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEGAL, CONTACT_EMAIL, EFFECTIVE_DATE, LAST_UPDATED, APP_URL } from "../src/utils/legalContent.js";

const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(kind) {
  const doc = LEGAL[kind];
  const body = doc.sections
    .map((s) => `<section><h2>${esc(s.title)}</h2>${s.paras.map((t) => `<p>${esc(t)}</p>`).join("")}${
      s.list ? `<ul>${s.list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}${
      s.after ? `<p>${esc(s.after)}</p>` : ""}</section>`)
    .join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${doc.title} · Vaakify</title>
<meta name="description" content="${esc(doc.title)} for Vaakify, a speech-practice app for children.">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>
body{margin:0;font-family:Inter,system-ui,sans-serif;background:linear-gradient(160deg,#FDEDEA,#FDF3DD 30%,#FBFAE0 55%,#E9F6EA 75%,#E2F5F2);color:#5A4A42;line-height:1.7}
main{max-width:760px;margin:0 auto;padding:40px 22px 80px}
h1{font-family:Nunito,system-ui,sans-serif;font-weight:900;font-size:2.2rem;color:#2A211D;margin:0 0 8px}
h2{font-family:Nunito,system-ui,sans-serif;font-weight:800;font-size:1.1rem;color:#2A211D;margin:28px 0 8px}
.meta{font-size:.85rem;color:#9A7A6A}a{color:#B5573A}li{margin-bottom:6px}
</style></head><body><main>
<p><a href="/">← Vaakify</a></p>
<h1>${doc.title}</h1>
<p class="meta">Effective date: ${EFFECTIVE_DATE} · Last updated: ${LAST_UPDATED}</p>
<p>${esc(doc.intro)}</p>
${body}
<section><h2>Contact</h2><p>Questions? Email us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p></section>
<p class="meta"><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a> · <a href="${APP_URL}">${APP_URL.replace("https://", "")}</a></p>
</main></body></html>
`;
}

fs.writeFileSync(path.join(pub, "privacy.html"), page("privacy"));
fs.writeFileSync(path.join(pub, "terms.html"), page("terms"));
console.log("Generated public/privacy.html and public/terms.html");
