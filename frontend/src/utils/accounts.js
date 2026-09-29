// Remembered accounts for the "Who's continuing?" screen.
// Stores display info (id, name, email). Session tokens are kept separately below; passwords are never stored.
const KEY = "vaakify_accounts";
const COLORS = ["#E8825A", "#5B9BD5", "#6BBF7A", "#B57ED5", "#E8B84B", "#4ABFBF"];

export function getAccounts() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

export function rememberAccount({ account_id, name, email }) {
  if (!account_id) return;
  try {
    const rest = getAccounts().filter((a) => a.account_id !== account_id);
    const color = COLORS[(rest.length) % COLORS.length];
    const prev = getAccounts().find((a) => a.account_id === account_id);
    localStorage.setItem(KEY, JSON.stringify([
      { account_id, name: name || prev?.name || "Learner", email: email || prev?.email || "", color: prev?.color || color },
      ...rest,
    ].slice(0, 6)));
  } catch { /* storage unavailable - non-fatal */ }
}

export function forgetAccount(account_id) {
  clearSession(account_id);
  try {
    localStorage.setItem(KEY, JSON.stringify(getAccounts().filter((a) => a.account_id !== account_id)));
  } catch { /* non-fatal */ }
}

// Per-profile session tokens so returning users are signed in automatically.
const SESSION_KEY = "vaakify_sessions";

function readSessions() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "{}") || {}; } catch { return {}; }
}
export function saveSession(account_id, token) {
  if (!account_id || !token) return;
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ ...readSessions(), [account_id]: token })); } catch { /* non-fatal */ }
}
export function getSession(account_id) { return readSessions()[account_id] || null; }
export function clearSession(account_id) {
  try {
    const s = readSessions(); delete s[account_id];
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch { /* non-fatal */ }
}
