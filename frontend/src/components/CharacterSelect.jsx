import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { playBase64Audio } from "../utils/api";

export default function CharacterSelect({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [previewing, setPreviewing] = useState(null);

  const handlePreview = async (charId) => {
    setPreviewing(charId);
    try {
      const form = new FormData();
      form.append("text", `Hi I am ${charId.charAt(0) + charId.slice(1).toLowerCase()}. Lets learn together`);
      form.append("character", charId);
      form.append("mood", "default");
      const res = await fetch("http://127.0.0.1:8000/speak", { method: "POST", body: form });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setPreviewing(null);
    } catch {
      setPreviewing(null);
    }
  };

  const handleSelect = (charId) => {
    setSelected(charId);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2rem", fontWeight: 900, color: "#F0EFE8", marginBottom: "8px" }}>
            Choose Your Friend
          </h1>
          <p style={{ color: "#4A5548", fontSize: "0.9rem" }}>
            Pick a character to practise with today
          </p>
        </div>

        {/* Character Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {Object.values(CHARACTERS).map((char) => {
            const isSelected = selected === char.id;
            const isPreviewing = previewing === char.id;
            return (
              <div key={char.id}
                onClick={() => handleSelect(char.id)}
                style={{
                  background: isSelected ? char.accentColor : "#0D1117",
                  border: `2px solid ${isSelected ? char.color : "#1E2B1A"}`,
                  borderRadius: "20px", padding: "20px",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                  position: "relative", overflow: "hidden",
                }}>

                {/* Glow effect when selected */}
                {isSelected && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "18px",
                    background: `radial-gradient(circle at center, ${char.color}15 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                )}

                {/* Character icon */}
                <div style={{ width: "80px", height: "80px", animation: isSelected ? "float 3s ease-in-out infinite" : "none" }}
                  dangerouslySetInnerHTML={{ __html: char.icon }} />

                {/* Name */}
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: isSelected ? char.color : "#F0EFE8", margin: 0 }}>
                    {char.name}
                  </p>
                  <p style={{ color: "#4A5548", fontSize: "0.72rem", margin: "4px 0 0 0", lineHeight: 1.4 }}>
                    {char.tagline}
                  </p>
                </div>

                {/* Type badge */}
                <div style={{
                  background: `${char.color}22`, border: `1px solid ${char.color}44`,
                  borderRadius: "20px", padding: "3px 10px",
                  fontSize: "0.65rem", color: char.color, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                  {char.type}
                </div>

                {/* Preview button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handlePreview(char.id); }}
                  style={{
                    background: isPreviewing ? char.color : "transparent",
                    color: isPreviewing ? "#07090F" : char.color,
                    border: `1px solid ${char.color}`,
                    borderRadius: "10px", padding: "6px 14px",
                    fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                  {isPreviewing ? "Playing..." : "Hear Voice"}
                </button>
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
            fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800,
            cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s",
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
