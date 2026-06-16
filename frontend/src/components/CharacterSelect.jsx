import { useState } from "react";
import { CHARACTERS } from "../assets/characters";

export default function CharacterSelect({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [previewing, setPreviewing] = useState(null);

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
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2rem", fontWeight: 900, color: "#F0EFE8", marginBottom: "6px" }}>
            Choose Your Friend
          </h1>
          <p style={{ color: "#4A5548", fontSize: "0.9rem" }}>
            Pick a character to practise with today
          </p>
        </div>

        {/* Character List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
          {Object.values(CHARACTERS).map((char) => {
            const isSelected = selected === char.id;
            const isPreviewing = previewing === char.id;
            return (
              <div key={char.id}
                onClick={() => setSelected(char.id)}
                style={{
                  background: isSelected ? `${char.color}18` : "#0D1117",
                  border: `2px solid ${isSelected ? char.color : "#1E2B1A"}`,
                  borderRadius: "20px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}>

                {/* Glow */}
                {isSelected && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "18px",
                    background: `radial-gradient(circle at 20% 50%, ${char.color}12 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                )}

                {/* Character image */}
                <img
                  src={char.image}
                  alt={char.name}
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "contain",
                    flexShrink: 0,
                    animation: isSelected ? "float 3s ease-in-out infinite" : "none",
                    filter: isSelected ? "none" : "grayscale(20%) brightness(0.9)",
                    transition: "filter 0.3s",
                  }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "Nunito, sans-serif", fontSize: "1.2rem", fontWeight: 900,
                    color: isSelected ? char.color : "#F0EFE8", margin: "0 0 4px 0"
                  }}>
                    {char.name}
                  </p>
                  <p style={{ color: "#4A5548", fontSize: "0.78rem", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    {char.tagline}
                  </p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{
                      background: `${char.color}22`, border: `1px solid ${char.color}44`,
                      borderRadius: "20px", padding: "3px 10px",
                      fontSize: "0.62rem", color: char.color, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em"
                    }}>
                      {char.type}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePreview(char.id); }}
                      style={{
                        background: isPreviewing ? char.color : "transparent",
                        color: isPreviewing ? "#07090F" : char.color,
                        border: `1px solid ${char.color}`,
                        borderRadius: "10px", padding: "4px 12px",
                        fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                        transition: "all 0.2s", fontFamily: "Nunito, sans-serif",
                      }}>
                      {isPreviewing ? "Playing..." : "Hear Voice"}
                    </button>
                  </div>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: char.color, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#07090F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          style={{
            width: "100%", padding: "18px",
            background: selected ? CHARACTERS[selected]?.color : "#1E2B1A",
            color: selected ? "#07090F" : "#2A4A20",
            border: "none", borderRadius: "16px",
            fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900,
            cursor: selected ? "pointer" : "not-allowed", transition: "all 0.25s",
          }}>
          {selected ? `Let's go with ${CHARACTERS[selected]?.name}!` : "Pick a character to continue"}
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
