import { useState, useEffect } from "react";
import { LANGUAGES } from "../utils/i18n";

export default function LanguageSelect({ onSelect }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => { document.body.style.background = "linear-gradient(160deg, #FDEDEA 0%, #FDF3DD 30%, #FBFAE0 55%, #E9F6EA 75%, #E2F5F2 100%)"; document.body.style.transition = "background 0.5s ease"; }, []);

  const LANG_THEMES = {
    english: { bg: "#EEF4FB", accent: "#5B9BD5", text: "#1A3A5C", card: "#DDEAF7" },
    hindi:   { bg: "#FDF6E8", accent: "#E8B84B", text: "#3A2A00", card: "#FAE8B8" },
    kannada: { bg: "#EEF7EF", accent: "#6BBF7A", text: "#1A3A1C", card: "#D5EDDA" },
  };

  const theme = selected ? LANG_THEMES[selected] : { bg: "linear-gradient(160deg, #FDEDEA 0%, #FDF3DD 30%, #FBFAE0 55%, #E9F6EA 75%, #E2F5F2 100%)", accent: "#E8825A", text: "#3A2E2C", card: "#FCF7F0" };

  useEffect(() => {
    document.body.style.background = selected ? LANG_THEMES[selected].bg : "linear-gradient(160deg, #FDEDEA 0%, #FDF3DD 30%, #FBFAE0 55%, #E9F6EA 75%, #E2F5F2 100%)";
    document.body.style.transition = "background 0.5s ease";
    return () => { document.body.style.background = "linear-gradient(160deg, #FDEDEA 0%, #FDF3DD 30%, #FBFAE0 55%, #E9F6EA 75%, #E2F5F2 100%)"; };
  }, [selected]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", transition: "background 0.5s" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🗣️</div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.2rem", fontWeight: 900, color: theme.text, margin: "0 0 8px 0", transition: "color 0.5s" }}>
            VaakSiddhi
          </h1>
          <p style={{ color: theme.accent, fontSize: "0.9rem", fontWeight: 700, margin: 0, transition: "color 0.5s" }}>
            Speech for Every Child
          </p>
        </div>

        {/* Language cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          {LANGUAGES.map(lang => {
            const isSelected = selected === lang.code;
            const t = LANG_THEMES[lang.code];
            return (
              <div key={lang.code} onClick={() => setSelected(lang.code)} style={{
                background: isSelected ? t.card : "rgba(255,255,255,0.7)",
                border: `2px solid ${isSelected ? t.accent : "rgba(0,0,0,0.08)"}`,
                borderRadius: "18px", padding: "18px 22px",
                cursor: "pointer", transition: "all 0.35s ease",
                display: "flex", alignItems: "center", gap: "16px",
                boxShadow: isSelected ? `0 4px 20px ${t.accent}33` : "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <span style={{ fontSize: "2rem" }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900, color: isSelected ? t.text : "#2C2C2A", margin: 0, transition: "color 0.3s" }}>
                    {lang.native}
                  </p>
                  <p style={{ color: isSelected ? t.accent : "#888", fontSize: "0.8rem", margin: "2px 0 0 0", fontWeight: 600, transition: "color 0.3s" }}>
                    {lang.label}
                  </p>
                </div>
                {isSelected && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${t.accent}55` }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue button */}
        <button onClick={() => selected && onSelect(selected)} disabled={!selected} style={{
          width: "100%", padding: "18px",
          background: selected ? LANG_THEMES[selected].accent : "rgba(0,0,0,0.08)",
          color: selected ? "#fff" : "#aaa",
          border: "none", borderRadius: "16px",
          fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900,
          cursor: selected ? "pointer" : "not-allowed", transition: "all 0.4s",
          boxShadow: selected ? `0 4px 20px ${LANG_THEMES[selected]?.accent}55` : "none",
        }}>
          {selected
            ? (selected === "hindi" ? "आगे बढ़ें →" : selected === "kannada" ? "ಮುಂದುವರಿಯಿರಿ →" : "Continue →")
            : "Select a language to continue"}
        </button>
      </div>
    </div>
  );
}
