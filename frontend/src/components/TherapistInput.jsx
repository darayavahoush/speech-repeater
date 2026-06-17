import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";
import { inputWord } from "../utils/api";

const THEMES = {
  BOLT:  { bg: "#EEF4FB", card: "#DDEAF7", text: "#1A3A5C", sub: "#4A7AA5", accent: "#5B9BD5" },
  ZARA:  { bg: "#F5EEFB", card: "#EDD8F7", text: "#3A1A5C", sub: "#7A4AA5", accent: "#B57ED5" },
  NOVA:  { bg: "#EEF7EF", card: "#D5EDDA", text: "#1A3A1C", sub: "#3A7A4A", accent: "#6BBF7A" },
  BEEP:  { bg: "#FDF6E8", card: "#FAE8B8", text: "#3A2A00", sub: "#7A5A10", accent: "#E8B84B" },
  ECHO:  { bg: "#FBF0EC", card: "#F5D5C8", text: "#3A1200", sub: "#8A3A20", accent: "#E87B5A" },
  MIRA:  { bg: "#EAF7F7", card: "#C8EAEA", text: "#003A3A", sub: "#1A6A6A", accent: "#4ABFBF" },
};

export default function TherapistInput({ character, onWordReady, onSwitchCharacter }) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const { isRecording, audioBlob, startRecording, stopRecording, reset } = useAudio();
  const char = CHARACTERS[character];
  const t = THEMES[character];

  document.body.style.background = t.bg;
  document.body.style.transition = "background 0.5s ease";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await inputWord({ text: mode === "text" ? text : null, audio: mode === "voice" ? audioBlob : null, character, language: "english", mood: "instruction" });
      onWordReady(result);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={char.image} alt={char.name} style={{ width: "48px", height: "48px", objectFit: "contain" }} />
            <div>
              <p style={{ color: t.sub, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>Teaching with</p>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.2rem", fontWeight: 900, color: t.text, margin: 0 }}>{char.name}</h2>
            </div>
          </div>
          <button onClick={() => setShowSwitcher(!showSwitcher)} style={{ background: t.card, border: `1.5px solid ${t.accent}44`, borderRadius: "12px", padding: "8px 14px", color: t.sub, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
            Switch character
          </button>
        </div>

        {showSwitcher && (
          <div style={{ background: "rgba(255,255,255,0.9)", border: `1.5px solid ${t.accent}33`, borderRadius: "18px", padding: "16px", marginBottom: "20px", boxShadow: `0 4px 20px ${t.accent}18` }}>
            <p style={{ color: t.sub, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 0" }}>Choose a different friend</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {Object.values(CHARACTERS).map(c => (
                <button key={c.id} onClick={() => { onSwitchCharacter(c.id); setShowSwitcher(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: c.id === character ? THEMES[c.id].card : "transparent", border: `1.5px solid ${c.id === character ? THEMES[c.id].accent : "rgba(0,0,0,0.08)"}`, borderRadius: "12px", padding: "8px 12px", cursor: "pointer", transition: "all 0.2s" }}>
                  <img src={c.image} alt={c.name} style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: THEMES[c.id].text, fontFamily: "Nunito, sans-serif" }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: t.text, margin: "0 0 6px 0" }}>What word should {char.name} teach?</h1>
          <p style={{ color: t.sub, fontSize: "0.85rem", margin: 0 }}>Type or say the word you want to practise</p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", background: t.card, borderRadius: "14px", padding: "4px" }}>
          {[["text", "✏️ Type word"], ["voice", "🎙️ Say word"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); reset(); }} style={{ flex: 1, background: mode === m ? "rgba(255,255,255,0.9)" : "transparent", color: mode === m ? t.text : t.sub, border: "none", borderRadius: "10px", padding: "10px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "Nunito, sans-serif", boxShadow: mode === m ? `0 2px 8px ${t.accent}22` : "none" }}>
              {label}
            </button>
          ))}
        </div>

        {mode === "text" && (
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. ball, apple, yellow..." style={{ width: "100%", background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}44`, borderRadius: "14px", padding: "16px", color: t.text, fontSize: "1.1rem", outline: "none", fontFamily: "Nunito, sans-serif", fontWeight: 700, marginBottom: "16px", boxSizing: "border-box" }}
            onKeyDown={(e) => e.key === "Enter" && text.trim() && handleSubmit()} />
        )}

        {mode === "voice" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", marginBottom: "20px", padding: "28px", background: "rgba(255,255,255,0.7)", border: `1.5px solid ${t.accent}33`, borderRadius: "18px" }}>
            {!audioBlob ? (
              <>
                <div onClick={isRecording ? stopRecording : startRecording} style={{ width: "90px", height: "90px", borderRadius: "50%", background: isRecording ? "#FF6B6B" : t.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: isRecording ? "0 0 30px #FF6B6B44" : `0 4px 20px ${t.accent}44` }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                    <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="white" strokeWidth="2"/>
                    <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2"/>
                    <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <p style={{ color: t.sub, fontSize: "0.85rem", fontWeight: 600 }}>{isRecording ? "Recording... tap to stop" : "Tap to record the word"}</p>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#E8F7EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>✅</div>
                <p style={{ color: t.text, fontSize: "0.9rem", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>Word recorded!</p>
                <button onClick={reset} style={{ background: "transparent", color: t.sub, border: `1.5px solid ${t.accent}44`, borderRadius: "8px", padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>Record again</button>
              </div>
            )}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading || (mode === "text" ? !text.trim() : !audioBlob)} style={{ width: "100%", padding: "18px", background: loading || (mode === "text" ? !text.trim() : !audioBlob) ? "rgba(0,0,0,0.08)" : t.accent, color: loading || (mode === "text" ? !text.trim() : !audioBlob) ? t.sub : "#fff", border: "none", borderRadius: "16px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900, cursor: "pointer", transition: "all 0.2s", boxShadow: loading || (mode === "text" ? !text.trim() : !audioBlob) ? "none" : `0 4px 20px ${t.accent}44` }}>
          {loading ? "Preparing word..." : `Let ${char.name} teach this! ✨`}
        </button>
      </div>
    </div>
  );
}
