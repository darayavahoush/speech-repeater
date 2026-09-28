import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES } from "../utils/themes";
import logo from "../assets/images/logo.png";
import { getAccounts, forgetAccount } from "../utils/accounts";

export default function WhoIsContinuing({ onPick, onAddAccount, darkMode }) {
  const [accounts, setAccounts] = useState(getAccounts);
  const [managing, setManaging] = useState(false);
  const bg = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const text = darkMode ? "#F0DCCF" : "#3A2E2C";
  const sub = darkMode ? "#B08F7A" : "#9A7A6A";
  const font = "Nunito, sans-serif";

  const tile = { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "120px", position: "relative", padding: 0, fontFamily: font };
  const circle = (color) => ({ width: "96px", height: "96px", borderRadius: "24px", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.4rem", fontWeight: 900, fontFamily: font, boxShadow: "0 4px 18px rgba(0,0,0,0.12)" });

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <img src={logo} alt="Vaakify" style={{ width: "64px", height: "64px", objectFit: "contain", marginBottom: "10px" }} />
      <h1 style={{ fontFamily: font, fontSize: "2rem", fontWeight: 900, color: text, margin: "0 0 28px 0", textAlign: "center" }}>
        Who's continuing?
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center", maxWidth: "460px" }}>
        {accounts.map((a) => (
          <button
            key={a.account_id}
            style={tile}
            onClick={() => {
              if (managing) return;
              onPick(a);
            }}
          >
            <div style={{ ...circle(a.color || "#E8825A"), opacity: managing ? 0.7 : 1 }}>
              {(a.name || "?").trim().charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: text, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.name}
            </span>
            {managing && (
              <span
                role="button"
                aria-label={`Remove ${a.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  forgetAccount(a.account_id);
                  setAccounts(getAccounts());
                }}
                style={{ position: "absolute", top: "-8px", right: "8px", width: "28px", height: "28px", borderRadius: "50%", background: "#E05555", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                ✕
              </span>
            )}
          </button>
        ))}

        <button style={tile} onClick={onAddAccount}>
          <div style={{ ...circle("transparent"), border: `2px dashed ${sub}`, color: sub, boxShadow: "none" }}>+</div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: sub }}>Add account</span>
        </button>
      </div>

      {accounts.length > 0 && (
        <button
          onClick={() => setManaging((m) => !m)}
          style={{ marginTop: "36px", background: "none", border: `2px solid ${sub}`, color: sub, borderRadius: "12px", padding: "10px 22px", fontFamily: font, fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}
        >
          {managing ? "Done" : "Manage accounts"}
        </button>
      )}
      <p style={{ marginTop: "18px", fontFamily: font, fontSize: "0.75rem", color: sub, textAlign: "center", maxWidth: "320px" }}>
        You'll enter your password after picking a profile, so your progress stays private.
      </p>
    </div>
  );
}
