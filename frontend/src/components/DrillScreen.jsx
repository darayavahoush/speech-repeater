import { useState, useEffect } from "react";
import { CHARACTERS } from "../assets/characters";
import { getPhonemeCard } from "../utils/api";
import { useAudio } from "../hooks/useAudio";

const BASE = "https://anabaena-vaaksiddhi.hf.space";

export default function DrillScreen({ character, drillSequence, onComplete }) {
  const char = CHARACTERS[character];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("study");
  const [cardData, setCardData] = useState(null);
  const [result, setResult] = useState(null);
  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);
  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, reset } = useAudio();

  const current = drillSequence[currentIndex];
  const scoreColor = result ? (result.composite_score >= 80 ? "#A8FF6F" : result.composite_score >= 60 ? "#FFD166" : "#FF6B6B") : char.color;

  useEffect(() => {
    if (current?.phoneme) loadCard(current.phoneme);
  }, [currentIndex]);

  const loadCard = async (phoneme) => {
    try {
      const res = await fetch(`${BASE}/phoneme-card/${phoneme}`);
      const data = await res.json();
      setCardData(data);
    } catch {}
  };

  const playExample = async () => {
    setPlayingChar(true);
    try {
      const form = new FormData();
      form.append("word", current.example_word || current.phoneme);
      form.append("speed", "0.8");
      const res = await fetch(`${BASE}/speak/word`, { method: "POST", body: form });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setPlayingChar(false);
    } catch { setPlayingChar(false); }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    setPhase("loading");
    try {
      const form = new FormData();
      form.append("audio", audioBlob, "recording.webm");
      form.append("target_word", current.example_word || current.phoneme);
      form.append("character", character);
      form.append("language", "english");
      form.append("condition", "autism");
      form.append("attempt_number", "1");
      form.append("session_id", crypto.randomUUID());
      const res = await fetch(`${BASE}/compare`, { method: "POST", body: form });
      const data = await res.json();
      setResult(data);
      setPhase("result");
    } catch { setPhase("record"); }
  };

  const handleNext = () => {
    reset();
    setResult(null);
    setPhase("study");
    if (currentIndex < drillSequence.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  if (!current) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px" }} dangerouslySetInnerHTML={{ __html: char.icon }} />
            <span style={{ color: char.color, fontWeight: 700, fontSize: "0.9rem" }}>Sound Drill</span>
          </div>
          <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "20px", padding: "4px 14px", fontSize: "0.75rem", color: "#4A5548" }}>
            {currentIndex + 1} / {drillSequence.length}
          </div>
        </div>

        {/* Phoneme card */}
        <div style={{ background: "#0D1117", border: `1px solid ${char.color}33`, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <div style={{ background: char.accentColor, borderRadius: "16px", padding: "12px 32px", textAlign: "center", width: "100%" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>PHONEME</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "2.5rem", fontWeight: 700, color: char.color, margin: 0, lineHeight: 1 }}>
              /{current.ipa || current.phoneme}/
            </p>
            <p style={{ color: "#F0EFE8", fontSize: "0.9rem", margin: "6px 0 0 0", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
              {cardData?.name || current.phoneme + " sound"}
            </p>
          </div>

          {/* Mouth diagram */}
          {cardData?.mouth_svg && (
            <div style={{ width: "240px", height: "160px", borderRadius: "12px", overflow: "hidden" }}
              dangerouslySetInnerHTML={{ __html: cardData.mouth_svg }} />
          )}

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>EXAMPLE WORD</p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#F0EFE8", margin: 0 }}>
              {current.example_word}
            </p>
          </div>

          <div style={{ background: "#080C0A", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "14px 16px", width: "100%" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 6px 0" }}>HOW TO MAKE THIS SOUND</p>
            <p style={{ color: "#C8E8B8", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
              {cardData?.tip || current.tip}
            </p>
          </div>

          <button onClick={playExample} disabled={playingChar}
            style={{ background: playingChar ? char.accentColor : "transparent", border: `1px solid ${char.color}44`, borderRadius: "12px", padding: "10px 20px", color: char.color, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            {playingChar ? "Playing..." : `🔊 Hear "${current.example_word}"`}
          </button>
        </div>

        {/* Study phase */}
        {phase === "study" && (
          <button onClick={async () => { setPhase("record"); await startRecording(); }}
            style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
            I am ready to try! 🎙️
          </button>
        )}

        {/* Record phase */}
        {phase === "record" && isRecording && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF4444", opacity: 0.2, animation: "ping 1.2s ease-in-out infinite" }} />
              <button onClick={stopRecording}
                style={{ position: "relative", width: "80px", height: "80px", borderRadius: "50%", background: "#FF4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#F0EFE8">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="#F0EFE8" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>Recording... tap to stop</p>
          </div>
        )}

        {phase === "record" && !isRecording && audioBlob && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setPlayingChild(true); const a = new Audio(audioUrl); a.play(); a.onended = () => setPlayingChild(false); }}
                style={{ flex: 1, background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#F0EFE8", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>
                {playingChild ? "Playing..." : "🎧 Hear yourself"}
              </button>
              <button onClick={playExample} disabled={playingChar}
                style={{ flex: 1, background: "transparent", border: `1px solid ${char.color}44`, borderRadius: "12px", padding: "12px", color: char.color, fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>
                {playingChar ? "Playing..." : `🔊 Hear ${char.name}`}
              </button>
            </div>
            <button onClick={handleSubmit}
              style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
              Check my sound!
            </button>
            <button onClick={() => { reset(); startRecording(); }}
              style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {phase === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "32px" }}>
            <div style={{ width: "40px", height: "40px", border: `3px solid ${char.color}33`, borderTop: `3px solid ${char.color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>Checking your sound...</p>
          </div>
        )}

        {/* Result */}
        {phase === "result" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#0D1117", border: `1px solid ${scoreColor}44`, borderRadius: "16px", padding: "20px", textAlign: "center" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "3rem", fontWeight: 700, color: scoreColor, margin: "0 0 4px 0" }}>
                {Math.round(result.composite_score)}%
              </p>
              <p style={{ color: "#F0EFE8", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1rem", margin: "0 0 8px 0" }}>
                {result.composite_score >= 80 ? "🌟 Nailed it!" : result.composite_score >= 60 ? "👍 Getting there!" : "💪 Keep practising!"}
              </p>
              {result.feedback && (
                <p style={{ color: "#C8E8B8", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>{result.feedback}</p>
              )}
            </div>

            {/* Phoneme breakdown */}
            {result.phoneme_scores?.matches?.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {result.phoneme_scores.matches.map((m, i) => (
                  <div key={i} style={{ background: m.correct ? "#1A2E14" : "#2E1414", border: `1px solid ${m.correct ? "#A8FF6F33" : "#FF6B6B33"}`, borderRadius: "10px", padding: "6px 12px", textAlign: "center" }}>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", color: m.correct ? "#A8FF6F" : "#FF6B6B", margin: 0, fontWeight: 600 }}>{m.detected || "—"}</p>
                    <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#4A5548", margin: "2px 0 0 0" }}>/{m.expected}/</p>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => { reset(); setPhase("study"); setResult(null); }}
              style={{ background: "transparent", border: `1px solid ${char.color}`, borderRadius: "14px", padding: "14px", color: char.color, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
              Try this sound again
            </button>
            <button onClick={handleNext}
              style={{ background: char.color, border: "none", borderRadius: "16px", padding: "16px", fontFamily: "Nunito, sans-serif", fontSize: "1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
              {currentIndex < drillSequence.length - 1 ? "Next sound →" : "All done! 🎉"}
            </button>
          </div>
        )}

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {drillSequence.map((_, i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === currentIndex ? char.color : i < currentIndex ? `${char.color}66` : "#1E2B1A", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
      `}</style>
    </div>
  );
}
