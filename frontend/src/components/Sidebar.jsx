import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { LANGUAGES } from "../utils/i18n";

const THEMES = {
  BOLT:  { bg: "#EEF4FB", accent: "#5B9BD5", card: "#DDEAF7", text: "#1A3A5C", sub: "#4A7AA5" },
  ZARA:  { bg: "#F5EEFB", accent: "#B57ED5", card: "#EDD8F7", text: "#3A1A5C", sub: "#7A4AA5" },
  NOVA:  { bg: "#EEF7EF", accent: "#6BBF7A", card: "#D5EDDA", text: "#1A3A1C", sub: "#3A7A4A" },
  BEEP:  { bg: "#FDF6E8", accent: "#E8B84B", card: "#FAE8B8", text: "#3A2A00", sub: "#7A5A10" },
  ECHO:  { bg: "#FBF0EC", accent: "#E87B5A", card: "#F5D5C8", text: "#3A1200", sub: "#8A3A20" },
  MIRA:  { bg: "#EAF7F7", accent: "#4ABFBF", card: "#C8EAEA", text: "#003A3A", sub: "#1A6A6A" },
};

const LANG_NATIVE = { english: "English", hindi: "हिन्दी", kannada: "ಕನ್ನಡ" };

export default function Sidebar({ character, language, currentScreen, onSwitchCharacter, onSwitchLanguage, onHome }) {
  const [open, setOpen] = useState(false);
  const th = THEMES[character] || THEMES.BOLT;

  if (currentScreen === "language_select") return null;

  return (
    <>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 98, backdropFilter: "blur(2px)" }} />
      )}

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 99,
        width: open ? "260px" : "0px",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}>
        <div style={{
          width: "260px", height: "100%",
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column",
          padding: "24px 16px", overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1rem", color: th.text, margin: 0 }}>Settings</p>
            <button onClick={() => setOpen(false)} style={{ background: th.card, border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "1rem", color: th.sub }}>✕</button>
          </div>

          <button onClick={() => { onHome(); setOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: th.card, border: `1.5px solid ${th.accent}33`,
            borderRadius: "14px", padding: "12px 16px", cursor: "pointer",
            marginBottom: "20px", width: "100%",
          }}>
            <span style={{ fontSize: "1.3rem" }}>🏠</span>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: th.text }}>Home</span>
          </button>

          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.7rem", color: th.sub, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px 0" }}>Character</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "24px" }}>
            {Object.values(CHARACTERS).map(c => (
              <button key={c.id} onClick={() => { onSwitchCharacter(c.id); setOpen(false); }} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                background: c.id === character ? THEMES[c.id].card : "transparent",
                border: `1.5px solid ${c.id === character ? THEMES[c.id].accent : "rgba(0,0,0,0.08)"}`,
                borderRadius: "12px", padding: "8px 4px", cursor: "pointer", transition: "all 0.2s",
              }}>
                <img src={c.image} alt={c.name} style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: THEMES[c.id].text, fontFamily: "Nunito, sans-serif" }}>{c.name}</span>
              </button>
            ))}
          </div>

          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.7rem", color: th.sub, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px 0" }}>Language</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => { onSwitchLanguage(lang.code); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: lang.code === language ? th.card : "transparent",
                border: `1.5px solid ${lang.code === language ? th.accent : "rgba(0,0,0,0.08)"}`,
                borderRadius: "12px", padding: "10px 12px", cursor: "pointer", transition: "all 0.2s",
              }}>
                <span style={{ fontSize: "1.2rem" }}>{lang.flag}</span>
                <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: th.text }}>{LANG_NATIVE[lang.code]}</span>
                {lang.code === language && (
                  <div style={{ marginLeft: "auto", width: "18px", height: "18px", borderRadius: "50%", background: th.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", right: open ? "260px" : "0px", top: "50%",
        transform: "translateY(-50%)",
        background: th.accent, border: "none",
        borderRadius: "12px 0 0 12px",
        width: "28px", height: "56px",
        cursor: "pointer", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "-2px 0 12px rgba(0,0,0,0.1)",
        transition: "right 0.3s cubic-bezier(0.4,0,0.2,1)",
        color: "#fff", fontSize: "1.1rem",
      }}>
        {open ? "›" : "‹"}
      </button>
    </>
  );
}
