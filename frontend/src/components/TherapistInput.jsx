import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";
import { inputWord } from "../utils/api";

export default function TherapistInput({ character, onWordReady }) {
  const [mode, setMode] = useState("text"); // text | voice
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const { isRecording, audioBlob, startRecording, stopRecording, reset } = useAudio();
  const char = CHARACTERS[character];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await inputWord({
        text: mode === "text" ? text : null,
        audio: mode === "voice" ? audioBlob : null,
        character,
        language,
        mood: "instruction",
      });
      onWordReady(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: "48px", height: "48px" }} dangerouslySetInnerHTML={{ __html: char.icon }} />
          <div>
            <p style={{ color: char.color, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", margin: 0 }}>THERAPIST MODE</p>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#F0EFE8", margin: 0 }}>
              What word should {char.name} teach?
            </h2>
          </div>
        </div>

        {/* Language toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["english", "hindi"].map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)}
              style={{
                background: language === lang ? char.color : "transparent",
                color: language === lang ? "#07090F" : "#4A5548",
                border: `1px solid ${language === lang ? char.color : "#1E2B1A"}`,
                borderRadius: "8px", padding: "8px 20px",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                textTransform: "capitalize",
              }}>
              {lang}
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[["text", "Type word"], ["voice", "Say word"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
              style={{
                flex: 1, background: mode === m ? "#0D1117" : "transparent",
                color: mode === m ? "#F0EFE8" : "#4A5548",
                border: `1px solid ${mode === m ? "#1E2B1A" : "#0D1117"}`,
                borderRadius: "12px", padding: "12px",
                fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Text input */}
        {mode === "text" && (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a word or phrase..."
            style={{
              width: "100%", background: "#0D1117",
              border: "1px solid #1E2B1A", borderRadius: "14px",
              padding: "16px", color: "#F0EFE8",
              fontSize: "1.1rem", outline: "none",
              fontFamily: "Nunito, sans-serif", fontWeight: 700,
              marginBottom: "16px",
            }}
            onKeyDown={(e) => e.key === "Enter" && text.trim() && handleSubmit()}
          />
        )}

        {/* Voice input */}
        {mode === "voice" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "32px" }}>
            {!audioBlob ? (
              <>
                <div
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: isRecording ? "#FF4444" : char.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s",
                    animation: isRecording ? "pulse 1s infinite" : "none",
                    boxShadow: isRecording ? "0 0 30px #FF444466" : `0 0 20px ${char.color}44`,
                  }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="#07090F">
                    <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="#07090F" strokeWidth="2"/>
                    <line x1="12" y1="19" x2="12" y2="23" stroke="#07090F" strokeWidth="2"/>
                    <line x1="8" y1="23" x2="16" y2="23" stroke="#07090F" strokeWidth="2"/>
                  </svg>
                </div>
                <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>
                  {isRecording ? "Recording... tap to stop" : "Tap to record the word"}
                </p>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{ color: char.color, fontSize: "2rem" }}>✓</div>
                <p style={{ color: "#F0EFE8", fontSize: "0.9rem" }}>Word recorded</p>
                <button onClick={reset}
                  style={{ background: "transparent", color: "#4A5548", border: "1px solid #1E2B1A", borderRadius: "8px", padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer" }}>
                  Record again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || (mode === "text" ? !text.trim() : !audioBlob)}
          style={{
            width: "100%", padding: "18px",
            background: loading || (mode === "text" ? !text.trim() : !audioBlob) ? "#1E2B1A" : char.color,
            color: loading || (mode === "text" ? !text.trim() : !audioBlob) ? "#2A4A20" : "#07090F",
            border: "none", borderRadius: "16px",
            fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800,
            cursor: "pointer", transition: "all 0.2s",
          }}>
          {loading ? "Preparing..." : `Let ${char.name} teach this word`}
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
      `}</style>
    </div>
  );
}
