import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES } from "../utils/themes";
import logo from "../assets/images/logo.png";
import { getAccounts, forgetAccount } from "../utils/accounts";

const CSS = `
@keyframes who-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes who-wiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-1.6deg); } 75% { transform: rotate(1.6deg); } }
.who-tile { animation: who-fade-up 0.45s ease both; outline: none; }
.who-tile .who-avatar { transition: transform 0.18s ease, box-shadow 0.18s ease; }
.who-tile:hover .who-avatar, .who-tile:focus-visible .who-avatar { transform: scale(1.08); box-shadow: 0 10px 28px rgba(0,0,0,0.22), 0 0 0 4px var(--who-ring); }
.who-tile:active .who-avatar { transform: scale(0.98); }
.who-tile .who-name { transition: color 0.18s ease, transform 0.18s ease; }
.who-tile:hover .who-name, .who-tile:focus-visible .who-name { transform: translateY(1px); }
.who-managing .who-avatar { animation: who-wiggle 0.5s ease-in-out infinite; }
.who-managing:hover .who-avatar { transform: none; }
@media (prefers-reduced-motion: reduce) {
  .who-tile, .who-managing .who-avatar { animation: none; }
  .who-tile .who-avatar { transition: none; }
}
`;

function PencilIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function WhoIsContinuing({ onPick, onAddAccount, darkMode }) {
  const [accounts, setAccounts] = useState(getAccounts);
  const [managing, setManaging] = useState(false);
  const bg = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const text = darkMode ? "#F0DCCF" : "#3A2E2C";
  const sub = darkMode ? "#B08F7A" : "#9A7A6A";
  const ring = darkMode ? "rgba(240,220,207,0.85)" : "rgba(58,46,44,0.85)";
  const font = "Nunito, sans-serif";

  const AVATAR = 132;

  const tile = {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    width: `${AVATAR + 16}px`,
    position: "relative",
    padding: 0,
    fontFamily: font,
    "--who-ring": ring,
  };

  const avatar = (color) => ({
    width: `${AVATAR}px`,
    height: `${AVATAR}px`,
    borderRadius: "28px",
    background: color,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3.6rem",
    fontWeight: 900,
    fontFamily: font,
    boxShadow: "0 6px 20px rgba(0,0,0,0.14)",
    position: "relative",
    overflow: "hidden",
  });

  const remove = (a) => {
    forgetAccount(a.account_id);
    const next = getAccounts();
    setAccounts(next);
    if (next.length === 0) setManaging(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <style>{CSS}</style>

      <img src={logo} alt="Vaakify" style={{ width: "64px", height: "64px", objectFit: "contain", marginBottom: "12px" }} />
      <h1 style={{ fontFamily: font, fontSize: "clamp(1.9rem, 5vw, 2.6rem)", fontWeight: 900, color: text, margin: "0 0 36px 0", textAlign: "center" }}>
        {managing ? "Manage profiles" : "Who's continuing?"}
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", justifyContent: "center", maxWidth: "720px" }}>
        {accounts.map((a, i) => (
          <button
            key={a.account_id}
            className={`who-tile${managing ? " who-managing" : ""}`}
            style={{ ...tile, animationDelay: `${i * 70}ms` }}
            aria-label={managing ? `Remove ${a.name}` : `Continue as ${a.name}`}
            onClick={() => (managing ? remove(a) : onPick(a))}
          >
            <div className="who-avatar" style={avatar(a.color || "#E8825A")}>
              {(a.name || "?").trim().charAt(0).toUpperCase()}
              {managing && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <TrashIcon />
                </div>
              )}
            </div>
            <span
              className="who-name"
              style={{ fontWeight: 800, fontSize: "1.05rem", color: text, maxWidth: `${AVATAR + 16}px`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {a.name}
            </span>
          </button>
        ))}

        {!managing && (
          <button
            className="who-tile"
            style={{ ...tile, animationDelay: `${accounts.length * 70}ms` }}
            aria-label="Add account"
            onClick={onAddAccount}
          >
            <div className="who-avatar" style={{ ...avatar("transparent"), border: `3px dashed ${sub}`, color: sub, boxShadow: "none", fontSize: "3.2rem", fontWeight: 700 }}>
              +
            </div>
            <span className="who-name" style={{ fontWeight: 800, fontSize: "1.05rem", color: sub }}>Add account</span>
          </button>
        )}
      </div>

      {accounts.length > 0 && (
        <button
          onClick={() => setManaging((m) => !m)}
          style={{ marginTop: "48px", background: managing ? text : "none", border: `2px solid ${managing ? text : sub}`, color: managing ? (darkMode ? "#2A1F1C" : "#fff") : sub, borderRadius: "12px", padding: "11px 26px", fontFamily: font, fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.18s ease" }}
        >
          {!managing && <PencilIcon />}
          {managing ? "Done" : "Manage profiles"}
        </button>
      )}

      <p style={{ marginTop: "20px", fontFamily: font, fontSize: "0.8rem", color: sub, textAlign: "center", maxWidth: "340px" }}>
        {managing
          ? "Tap a profile to remove it from this device. Your account and progress are not deleted."
          : "You'll enter your password after picking a profile, so your progress stays private."}
      </p>
    </div>
  );
}
