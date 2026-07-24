import { useState, useEffect } from "react";
import { CHARACTERS } from "../assets/characters";
import { t } from "../utils/i18n";
import CharacterBackdrop from "./CharacterBackdrop";
import { getTheme, getSurface } from "../utils/themes";

export default function CharacterSelect({ onSelect, language = "english", darkMode }) {
  const [selected, setSelected] = useState(null);
  const [previewing, setPreviewing] = useState(null);

  const theme = getTheme(selected, darkMode);
  useEffect(() => { document.body.style.background = theme.bgGradient; document.body.style.transition = "background 0.5s ease"; }, [theme.bgGradient]);

  const handlePreview = async (charId) => {
    setPreviewing(charId);
    try {
      const res = await fetch(`https://anabaena-vaaksiddhi.hf.space/speak/intro/${charId}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setPreviewing(null);
    } catch {
      setPreviewing(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", position: "relative" }}>
      <CharacterBackdrop character={selected} />
      <div style={{ width: "100%", maxWidth: "520px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2rem", fontWeight: 900, color: theme.text, marginBottom: "6px", transition: "color 0.5s ease" }}>
            {t(language, "chooseCharacter")}
          </h1>
          <p style={{ color: theme.sub, fontSize: "0.9rem", transition: "color 0.5s ease" }}>
            {selected ? `${CHARACTERS[selected][language === "hindi" ? "tagline_hindi" : language === "kannada" ? "tagline_kannada" : "tagline"] || CHARACTERS[selected].tagline} ✨` : t(language, "chooseCharacterSub")}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
          {Object.values(CHARACTERS).map((char, i) => {
            const isSelected = selected === char.id;
            const isPreviewing = previewing === char.id;
            const ct = getTheme(char.id, darkMode);
            return (
              <div key={char.id}
                id={i === 0 ? "hint-character-card" : undefined}
                onClick={() => setSelected(char.id)}
                style={{
                  background: isSelected ? ct.card : getSurface(darkMode, 0.92),
                  border: `2px solid ${isSelected ? ct.accent : "rgba(0,0,0,0.1)"}`,
                  borderRadius: "22px", padding: "14px 20px 14px 14px",
                  cursor: "pointer", transition: "all 0.35s ease",
                  display: "flex", flexDirection: "row", alignItems: "center", gap: "16px",
                  position: "relative", overflow: "hidden",
                  boxShadow: isSelected ? `0 4px 24px ${ct.accent}33` : "0 3px 14px rgba(0,0,0,0.1)",
                }}>

                {isSelected && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "20px",
                    background: `radial-gradient(circle at 15% 50%, ${ct.accent}20 0%, transparent 65%)`,
                    pointerEvents: "none",
                  }} />
                )}

                <img src={char.image} alt={char.name} style={{
                  width: "130px", height: "130px", objectFit: "contain", flexShrink: 0,
                  animation: isSelected ? "float 3s ease-in-out infinite" : "none",
                  filter: isSelected ? "none" : "grayscale(30%) brightness(0.85)",
                  transition: "filter 0.35s ease, transform 0.35s ease",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.25rem", fontWeight: 900, color: isSelected ? ct.text : "#2C2C2A", margin: "0 0 4px 0", transition: "color 0.35s" }}>
                    {char.name}
                  </p>
                  <p style={{ color: isSelected ? ct.sub : "#888", fontSize: "0.78rem", margin: "0 0 10px 0", lineHeight: 1.4, transition: "color 0.35s" }}>
                    {char[language === "hindi" ? "tagline_hindi" : language === "kannada" ? "tagline_kannada" : "tagline"] || char.tagline}
                  </p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{
                      background: `${ct.accent}22`, border: `1px solid ${ct.accent}55`,
                      borderRadius: "20px", padding: "3px 10px",
                      fontSize: "0.62rem", color: ct.sub, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>{char.type}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePreview(char.id); }}
                      style={{
                        background: isPreviewing ? ct.accent : "transparent",
                        color: isPreviewing ? "#fff" : ct.accent,
                        border: `1.5px solid ${ct.accent}`,
                        borderRadius: "10px", padding: "4px 12px",
                        fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                        transition: "all 0.2s", fontFamily: "Nunito, sans-serif",
                      }}>
                      {isPreviewing ? t(language, "hearVoice") : t(language, "hearVoice")}
                    </button>
                  </div>
                </div>

                {isSelected && (
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "50%",
                    background: ct.accent, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                    boxShadow: `0 2px 8px ${ct.accent}55`,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          style={{
            width: "100%", padding: "18px",
            background: selected ? getTheme(selected, darkMode).accent : "rgba(0,0,0,0.1)",
            color: selected ? "#fff" : "#aaa",
            border: "none", borderRadius: "16px",
            fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900,
            cursor: selected ? "pointer" : "not-allowed", transition: "all 0.4s ease",
            boxShadow: selected ? `0 4px 20px ${getTheme(selected, darkMode)?.accent}55` : "none",
          }}>
          {selected ? t(language, "letsGo", CHARACTERS[selected]?.name) : t(language, "pickCharacter")}
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1.05); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
