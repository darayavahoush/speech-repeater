import { useState, useRef } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";
import { evaluateAttempt } from "../utils/api";

const THEMES = {
  BOLT:  { bg: "#EEF4FB", card: "#DDEAF7", text: "#1A3A5C", sub: "#4A7AA5", accent: "#5B9BD5" },
  ZARA:  { bg: "#F5EEFB", card: "#EDD8F7", text: "#3A1A5C", sub: "#7A4AA5", accent: "#B57ED5" },
  NOVA:  { bg: "#EEF7EF", card: "#D5EDDA", text: "#1A3A1C", sub: "#3A7A4A", accent: "#6BBF7A" },
  BEEP:  { bg: "#FDF6E8", card: "#FAE8B8", text: "#3A2A00", sub: "#7A5A10", accent: "#E8B84B" },
  ECHO:  { bg: "#FBF0EC", card: "#F5D5C8", text: "#3A1200", sub: "#8A3A20", accent: "#E87B5A" },
  MIRA:  { bg: "#EAF7F7", card: "#C8EAEA", text: "#003A3A", sub: "#1A6A6A", accent: "#4ABFBF" },
};

export default function PracticeScreen({ character, wordData, sessionId, attemptNumber, attemptHistory = [], onResult }) {
  const [phase, setPhase] = useState("listen");
  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);
  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, reset } = useAudio();
  const char = CHARACTERS[character];
  const t = THEMES[character];

  document.body.style.background = t.bg;
  document.body.style.transition = "background 0.5s ease";

  const playWord = async (speed = 1.0) => {
    setPlayingChar(true);
    try {
      const form = new FormData();
      form.append("word", wordData.word);
      form.append("speed", String(speed));
      const res = await fetch("https://anabaena-vaaksiddhi.hf.space/speak/word", { method: "POST", body: form });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setPlayingChar(false);
    } catch { setPlayingChar(false); }
  };

  const playChildAudio = () => {
    if (!audioUrl) return;
    setPlayingChild(true);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => setPlayingChild(false);
  };

  const handleRecord = async () => {
    setPhase("record");
    await startRecording();
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    setPhase("loading");
    try {
      const result = await evaluateAttempt({
        audio: audioBlob,
        targetWord: wordData.word,
        character,
        language: wordData.language || "english",
        condition: "autism",
        attemptNumber,
        sessionId,
        attemptHistory,
      });
      const newHistory = [...attemptHistory, result];
      onResult({ ...result, attemptNumber, attemptHistory: newHistory, childAudioUrl: audioUrl });
    } catch (err) {
      console.error(err);
      setPhase("record");
    }
  };

  const imageUrl = wordData?.image_base64 ? `data:image/png;base64,${wordData.image_base64}` : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={char.image} alt={char.name} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
            <span style={{ color: t.text, fontWeight: 800, fontSize: "0.95rem", fontFamily: "Nunito, sans-serif" }}>{char.name}</span>
          </div>
          <div style={{ background: t.card, border: `1px solid ${t.accent}44`, borderRadius: "20px", padding: "4px 14px", fontSize: "0.75rem", color: t.sub, fontWeight: 700 }}>
            Attempt {attemptNumber}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.7)", border: `1.5px solid ${t.accent}33`, borderRadius: "24px", padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", boxShadow: `0 4px 24px ${t.accent}18` }}>
          {wordData?.images?.length > 1 ? (
            <div style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}>
              {wordData.images.map((img, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <img src={"data:image/png;base64," + img.image_base64} alt={img.label} style={{ width: "110px", height: "110px", objectFit: "contain", borderRadius: "12px" }} />
                  <span style={{ color: t.sub, fontSize: "0.7rem", textTransform: "capitalize" }}>{img.label}</span>
                </div>
              ))}
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={wordData.word} style={{ width: "180px", height: "180px", objectFit: "contain", borderRadius: "16px" }} />
          ) : (
            <div style={{ width: "140px", height: "140px", background: t.card, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🖼️</div>
          )}

          <div style={{ textAlign: "center" }}>
            <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 6px 0", fontWeight: 700, textTransform: "uppercase" }}>Target Word</p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.4rem", fontWeight: 900, color: t.text, margin: 0 }}>{wordData?.word}</p>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
            {(wordData?.phonemes || []).map((p, i) => (
              <span key={i} style={{ background: t.card, border: `1px solid ${t.accent}55`, color: t.accent, fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem", padding: "4px 10px", borderRadius: "8px", fontWeight: 700 }}>{p}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => playWord(1.0)} disabled={playingChar} style={{ flex: 1, background: "rgba(255,255,255,0.7)", border: `1.5px solid ${t.accent}44`, borderRadius: "14px", padding: "14px", cursor: "pointer", color: t.accent, fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "Nunito, sans-serif" }}>
            🔊 Normal
          </button>
          <button onClick={() => playWord(0.65)} disabled={playingChar} style={{ flex: 1, background: "rgba(255,255,255,0.7)", border: `1.5px solid ${t.accent}44`, borderRadius: "14px", padding: "14px", cursor: "pointer", color: t.accent, fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "Nunito, sans-serif" }}>
            🐢 Slow
          </button>
        </div>
        {playingChar && <p style={{ color: t.sub, fontSize: "0.75rem", textAlign: "center", margin: "-8px 0 0 0" }}>Playing...</p>}

        {phase === "listen" && (
          <button onClick={handleRecord} style={{ background: t.accent, border: "none", borderRadius: "18px", padding: "22px", fontFamily: "Nunito, sans-serif", fontSize: "1.15rem", fontWeight: 900, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: `0 4px 20px ${t.accent}44` }}>
            <span style={{ fontSize: "1.4rem" }}>🎙️</span>
            Now you try!
          </button>
        )}

        {phase === "record" && isRecording && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative", width: "88px", height: "88px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF6B6B", opacity: 0.25, animation: "ping 1.2s ease-in-out infinite" }} />
              <button onClick={stopRecording} style={{ position: "relative", width: "88px", height: "88px", borderRadius: "50%", background: "#FF6B6B", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px #FF6B6B44" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="white" strokeWidth="2"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <p style={{ color: t.sub, fontSize: "0.85rem", fontWeight: 600 }}>Recording... tap to stop</p>
          </div>
        )}

        {phase === "record" && !isRecording && audioBlob && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ background: "rgba(255,255,255,0.7)", border: `1.5px solid ${t.accent}33`, borderRadius: "16px", padding: "14px", display: "flex", gap: "10px" }}>
              <button onClick={playChildAudio} disabled={playingChild} style={{ flex: 1, background: "transparent", border: `1.5px solid ${t.accent}44`, borderRadius: "10px", padding: "10px", color: t.sub, fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
                {playingChild ? "Playing..." : "🎧 Hear yourself"}
              </button>
              <button onClick={() => playWord(1.0)} disabled={playingChar} style={{ flex: 1, background: "transparent", border: `1.5px solid ${t.accent}66`, borderRadius: "10px", padding: "10px", color: t.accent, fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
                {playingChar ? "Playing..." : `🔊 Hear ${char.name}`}
              </button>
            </div>
            <button onClick={handleSubmit} style={{ background: t.accent, border: "none", borderRadius: "16px", padding: "20px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", cursor: "pointer", boxShadow: `0 4px 20px ${t.accent}44` }}>
              Check my answer! ✨
            </button>
            <button onClick={() => { reset(); setPhase("record"); startRecording(); }} style={{ background: "transparent", border: `1.5px solid ${t.accent}44`, borderRadius: "12px", padding: "12px", color: t.sub, fontSize: "0.85rem", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
              Try again
            </button>
          </div>
        )}

        {phase === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "32px" }}>
            <div style={{ width: "44px", height: "44px", border: `3px solid ${t.accent}33`, borderTop: `3px solid ${t.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: t.sub, fontSize: "0.85rem", fontWeight: 600 }}>Analysing your voice...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
      `}</style>
    </div>
  );
}
