import { useState, useEffect, useRef } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";
import { evaluateAttempt, playBase64Audio, base64ToBlob } from "../utils/api";

export default function PracticeScreen({ character, wordData, sessionId, attemptNumber, attemptHistory = [], onResult }) {
  const [phase, setPhase] = useState("listen"); // listen | record | loading

  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);
  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, reset } = useAudio();
  const char = CHARACTERS[character];
  const childAudioRef = useRef(null);

  // Auto-play the word when screen loads
  useEffect(() => {
    // no auto-play
  }, []);

  const playCharacterAudio = async (speed = 1.0) => {
    setPlayingChar(true);
    try {
      const form = new FormData();
      form.append("text", wordData.word);
      form.append("character", character);
      form.append("mood", "instruction");
      form.append("speed", speed);
      const res = await fetch("http://127.0.0.1:8000/speak", { method: "POST", body: form });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setPlayingChar(false);
    } catch {
      setPlayingChar(false);
    }
  };

  const playChildAudio = () => {
    if (!audioUrl) return;
    setPlayingChild(true);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => setPlayingChild(false);
  };

  const handleRecord = async () => {
    if (phase === "listen") {
      setPhase("record");
      await startRecording();
    }
  };

  const handleStopRecord = () => {
    stopRecording();
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    setPhase("loading");

    try {
      console.log('Sending attempt', attemptNumber, 'history length:', attemptHistory.length, attemptHistory);
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

  const imageUrl = wordData?.image_base64
    ? `data:image/png;base64,${wordData.image_base64}`
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px" }} dangerouslySetInnerHTML={{ __html: char.icon }} />
            <span style={{ color: char.color, fontWeight: 700, fontSize: "0.9rem" }}>{char.name}</span>
          </div>
          <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "20px", padding: "4px 14px", fontSize: "0.75rem", color: "#4A5548" }}>
            Attempt {attemptNumber}
          </div>
        </div>

        {/* Image */}
        <div style={{
          background: "#0D1117", border: "1px solid #1E2B1A",
          borderRadius: "20px", padding: "24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
          minHeight: "200px", justifyContent: "center",
        }}>
          {wordData?.images?.length > 1 ? (
            <div style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}>
              {wordData.images.map((img, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <img src={"data:image/png;base64," + img.image_base64} alt={img.label}
                    style={{ width: "110px", height: "110px", objectFit: "contain" }} />
                  <span style={{ color: "#4A5548", fontSize: "0.7rem", textTransform: "capitalize" }}>{img.label}</span>
                </div>
              ))}
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={wordData.word}
              style={{ width: "160px", height: "160px", objectFit: "contain" }} />
          ) : (
            <div style={{ width: "120px", height: "120px", background: "#1E2B1A", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "3rem" }}>🖼️</span>
            </div>
          )}

          {/* Word display */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>TARGET WORD</p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.2rem", fontWeight: 900, color: "#F0EFE8", margin: 0 }}>
              {wordData?.word}
            </p>
          </div>

          {/* Phonemes */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
            {(wordData?.phonemes || []).map((p, i) => (
              <span key={i} style={{
                background: "#1E2B1A", border: `1px solid ${char.color}33`,
                color: char.color, fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.8rem", padding: "4px 10px", borderRadius: "8px",
              }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Word pronunciation — XTTS Indian accent */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: 0 }}>
            HEAR THE WORD
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={async () => {
              setPlayingChar(true);
              try {
                const form = new FormData();
                form.append("word", wordData.word);
                form.append("speed", "1.0");
                const res = await fetch("http://127.0.0.1:8000/speak/word", { method: "POST", body: form });
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
                audio.onended = () => setPlayingChar(false);
              } catch { setPlayingChar(false); }
            }} disabled={playingChar}
              style={{ flex: 1, background: "#0D1117", border: `1px solid ${char.color}44`, borderRadius: "12px", padding: "12px", cursor: "pointer", color: char.color, fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              🔊 Normal
            </button>
            <button onClick={async () => {
              setPlayingChar(true);
              try {
                const form = new FormData();
                form.append("word", wordData.word);
                form.append("speed", "0.65");
                const res = await fetch("http://127.0.0.1:8000/speak/word", { method: "POST", body: form });
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
                audio.onended = () => setPlayingChar(false);
              } catch { setPlayingChar(false); }
            }} disabled={playingChar}
              style={{ flex: 1, background: "#0D1117", border: `1px solid ${char.color}44`, borderRadius: "12px", padding: "12px", cursor: "pointer", color: char.color, fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              🐢 Slow
            </button>
          </div>
          {playingChar && (
            <p style={{ color: "#4A5548", fontSize: "0.75rem", textAlign: "center", margin: 0 }}>
              Playing...
            </p>
          )}
        </div>

        {/* Record section */}
        {phase === "listen" && (
          <button onClick={handleRecord}
            style={{
              background: char.color, border: "none", borderRadius: "16px",
              padding: "20px", fontFamily: "Nunito, sans-serif",
              fontSize: "1.1rem", fontWeight: 800, color: "#07090F",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "10px",
            }}>
            <span style={{ fontSize: "1.4rem" }}>🎙️</span>
            Now you try!
          </button>
        )}

        {phase === "record" && isRecording && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF4444", opacity: 0.2, animation: "ping 1.2s ease-in-out infinite" }} />
              <button onClick={handleStopRecord}
                style={{ position: "relative", width: "80px", height: "80px", borderRadius: "50%", background: "#FF4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#F0EFE8">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="#F0EFE8" strokeWidth="2"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="#F0EFE8" strokeWidth="2"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="#F0EFE8" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>Recording... tap to stop</p>
          </div>
        )}

        {phase === "record" && !isRecording && audioBlob && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Playback options */}
            <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "14px", padding: "16px", display: "flex", gap: "10px" }}>
              <button onClick={playChildAudio} disabled={playingChild}
                style={{ flex: 1, background: "transparent", border: "1px solid #1E2B1A", borderRadius: "10px", padding: "10px", color: "#F0EFE8", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>
                {playingChild ? "Playing..." : "🎧 Hear yourself"}
              </button>
              <button onClick={() => playCharacterAudio(1.0)} disabled={playingChar}
                style={{ flex: 1, background: "transparent", border: `1px solid ${char.color}44`, borderRadius: "10px", padding: "10px", color: char.color, fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>
                {playingChar ? "Playing..." : `🔊 Hear ${char.name}`}
              </button>
            </div>

            <button onClick={handleSubmit}
              style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
              Check my answer!
            </button>

            <button onClick={() => { reset(); setPhase("record"); startRecording(); }}
              style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>
              Try again
            </button>
          </div>
        )}

        {phase === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "32px" }}>
            <div style={{ width: "40px", height: "40px", border: `3px solid ${char.color}33`, borderTop: `3px solid ${char.color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>Analysing your voice...</p>
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
