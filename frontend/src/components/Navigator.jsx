import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { LANGUAGES } from "../utils/i18n";

const THEMES = {
  BOLT:  { accent: "#5B9BD5", card: "#DDEAF7", text: "#1A3A5C" },
  ZARA:  { accent: "#B57ED5", card: "#EDD8F7", text: "#3A1A5C" },
  NOVA:  { accent: "#6BBF7A", card: "#D5EDDA", text: "#1A3A1C" },
  BEEP:  { accent: "#E8B84B", card: "#FAE8B8", text: "#3A2A00" },
  ECHO:  { accent: "#E87B5A", card: "#F5D5C8", text: "#3A1200" },
  MIRA:  { accent: "#4ABFBF", card: "#C8EAEA", text: "#003A3A" },
};

const LANG_FLAGS = { english: "🇬🇧", hindi: "🇮🇳", kannada: "🇮🇳" };
const LANG_NATIVE = { english: "EN", hindi: "हि", kannada: "ಕ" };

export default function Navigator({ character, language, onSwitchCharacter, onSwitchLanguage, onHome, currentScreen }) {
  const [showCharPicker, setShowCharPicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const th = THEMES[character] || THEMES.BOLT;
  const char = CHARACTERS[character];

  // Don't show on language select screen
  if (currentScreen === "language_select") return null;

  return (
    <>
      {/* Backdrop */}
      {(showCharPicker || showLangPicker) && (
        <div onClick={() => { setShowCharPicker(false); setShowLangPicker(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 98 }} />
      )}

      {/* Character picker popup */}
      {showCharPicker && (
        <div style={{
          position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.97)", borderRadius: "20px", padding: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 99,
          width: "320px", backdropFilter: "blur(12px)",
        }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.8rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 0" }}>Switch Character</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Object.values(CHARACTERS).map(c => (
              <button key={c.id} onClick={() => { onSwitchCharacter(c.id); setShowCharPicker(false); document.body.style.background = THEMES[c.id] ? `var(--bg-${c.id.toLowerCase()})` : "#F4F2EF"; }} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                background: c.id === character ? THEMES[c.id].card : "transparent",
                border: `2px solid ${c.id === character ? THEMES[c.id].accent : "rgba(0,0,0,0.08)"}`,
                borderRadius: "12px", padding: "8px 10px", cursor: "pointer", transition: "all 0.2s",
              }}>
                <img src={c.image} alt={c.name} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: THEMES[c.id].text, fontFamily: "Nunito, sans-serif" }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Language picker popup */}
      {showLangPicker && (
        <div style={{
          position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.97)", borderRadius: "20px", padding: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 99,
          width: "280px", backdropFilter: "blur(12px)",
        }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.8rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 0" }}>Switch Language</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => { onSwitchLanguage(lang.code); setShowLangPicker(false); }} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: lang.code === language ? th.card : "transparent",
                border: `1.5px solid ${lang.code === language ? th.accent : "rgba(0,0,0,0.08)"}`,
                borderRadius: "12px", padding: "10px 14px", cursor: "pointer", transition: "all 0.2s",
              }}>
                <span style={{ fontSize: "1.4rem" }}>{lang.flag}</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: th.text, margin: 0 }}>{lang.native}</p>
                  <p style={{ fontSize: "0.7rem", color: "#888", margin: 0 }}>{lang.label}</p>
                </div>
                {lang.code === language && (
                  <div style={{ marginLeft: "auto", width: "20px", height: "20px", borderRadius: "50%", background: th.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 97,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "8px 16px 12px",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      }}>

        {/* Home */}
        <button onClick={onHome} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "transparent", border: "none", cursor: "pointer", padding: "4px 8px" }}>
          <span style={{ fontSize: "1.3rem" }}>🏠</span>
          <span style={{ fontSize: "0.58rem", color: "#888", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>Home</span>
        </button>

        {/* Character */}
        <button onClick={() => { setShowLangPicker(false); setShowCharPicker(!showCharPicker); }} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
          background: showCharPicker ? th.card : "transparent",
          border: showCharPicker ? `1.5px solid ${th.accent}` : "1.5px solid transparent",
          borderRadius: "12px", cursor: "pointer", padding: "4px 12px",
        }}>
          <img src={char?.image} alt={character} style={{ width: "28px", height: "28px", objectFit: "contain" }} />
          <span style={{ fontSize: "0.58rem", color: showCharPicker ? th.accent : "#888", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{character}</span>
        </button>

        {/* Language */}
        <button onClick={() => { setShowCharPicker(false); setShowLangPicker(!showLangPicker); }} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
          background: showLangPicker ? th.card : "transparent",
          border: showLangPicker ? `1.5px solid ${th.accent}` : "1.5px solid transparent",
          borderRadius: "12px", cursor: "pointer", padding: "4px 12px",
        }}>
          <span style={{ fontSize: "1.3rem" }}>{LANG_FLAGS[language]}</span>
          <span style={{ fontSize: "0.58rem", color: showLangPicker ? th.accent : "#888", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{LANG_NATIVE[language]}</span>
        </button>

      </div>

      {/* Bottom padding so content doesn't hide behind nav */}
      <div style={{ height: "64px" }} />
    </>
  );
}
