import { useState, useEffect } from "react";
import { CHARACTERS } from "../assets/characters";
import { getPhonemeCard, playBase64Audio } from "../utils/api";
import { useAudio } from "../hooks/useAudio";

export default function DrillScreen({ character, drillSequence, onComplete }) {
  const char = CHARACTERS[character];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("study"); // study | record | result
  const [cardData, setCardData] = useState(null);
  const [score, setScore] = useState(null);
  const [playingChar, setPlayingChar] = useState(false);
  const { isRecording, audioBlob, startRecording, stopRecording, reset } = useAudio();

  const current = drillSequence[currentIndex];

  useEffect(() => {
    if (current?.phoneme) {
      loadCard(current.phoneme);
    }
  }, [currentIndex]);

  const loadCard = async (phoneme) => {
    const card = await getPhonemeCard(phoneme);
    setCardData(card);
  };

  const playCharacterSound = async () => {
    if (!current?.phoneme) return;
    setPlayingChar(true);
    const form = new FormData();
    form.append("text", current.example_word || current.phoneme);
    form.append("character", character);
    form.append("mood", "instruction");
    const res = await fetch("http://127.0.0.1:8000/speak", { method: "POST", body: form });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => setPlayingChar(false);
  };

  const handleNext = () => {
    reset();
    setScore(null);
    setPhase("study");
    if (currentIndex < drillSequence.length - 1) {
      setCurrentIndex(currentIndex + 1);
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
            <span style={{ color: char.color, fontWeight: 700, fontSize: "0.9rem" }}>Sound Practice</span>
          </div>
          <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "20px", padding: "4px 14px", fontSize: "0.75rem", color: "#4A5548" }}>
            {currentIndex + 1} / {drillSequence.length}
          </div>
        </div>

        {/* Phoneme card */}
        <div style={{ background: "#0D1117", border: `1px solid ${char.color}33`, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>

          {/* Phoneme symbol */}
          <div style={{ background: char.accentColor, borderRadius: "16px", padding: "16px 32px", textAlign: "center" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>PHONEME</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "3rem", fontWeight: 700, color: char.color, margin: 0, lineHeight: 1 }}>
              /{current.ipa || current.phoneme}/
            </p>
            <p style={{ color: "#F0EFE8", fontSize: "0.9rem", margin: "8px 0 0 0", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
              {cardData?.name || current.phoneme + " sound"}
            </p>
          </div>

          {/* Mouth SVG diagram */}
          {cardData?.mouth_svg && (
            <div style={{ width: "200px", height: "120px" }}
              dangerouslySetInnerHTML={{ __html: cardData.mouth_svg }} />
          )}

          {/* Example word */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>EXAMPLE WORD</p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#F0EFE8", margin: 0 }}>
              {current.example_word}
            </p>
          </div>

          {/* Tip */}
          <div style={{ background: "#080C0A", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "14px 16px", width: "100%" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 6px 0" }}>HOW TO MAKE THIS SOUND</p>
            <p style={{ color: "#C8E8B8", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
              {cardData?.tip || current.tip}
            </p>
          </div>

          {/* Hear character */}
          <button onClick={playCharacterSound} disabled={playingChar}
            style={{ background: playingChar ? char.accentColor : "transparent", border: `1px solid ${char.color}44`, borderRadius: "12px", padding: "12px 24px", color: char.color, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            {playingChar ? "Playing..." : `🔊 Hear ${char.name} say it`}
          </button>
        </div>

        {/* Practice section */}
        {phase === "study" && (
          <button onClick={() => setPhase("record")}
            style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
            I am ready to try!
          </button>
        )}

        {phase === "record" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            {!audioBlob ? (
              <>
                <div style={{ position: "relative", width: "80px", height: "80px" }}>
                  {isRecording && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#FF4444", opacity: 0.2, animation: "ping 1.2s ease-in-out infinite" }} />}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    style={{ position: "relative", width: "80px", height: "80px", borderRadius: "50%", background: isRecording ? "#FF4444" : char.color, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#07090F">
                      <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="#07090F" strokeWidth="2"/>
                      <line x1="12" y1="19" x2="12" y2="23" stroke="#07090F" strokeWidth="2"/>
                      <line x1="8" y1="23" x2="16" y2="23" stroke="#07090F" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
                <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>
                  {isRecording ? "Recording... tap to stop" : `Say: "${current.example_word}"`}
                </p>
              </>
            ) : (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={handleNext}
                  style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
                  {currentIndex < drillSequence.length - 1 ? "Next sound →" : "All done! 🎉"}
                </button>
                <button onClick={() => { reset(); }}
                  style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {drillSequence.map((_, i) => (
            <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === currentIndex ? char.color : i < currentIndex ? `${char.color}66` : "#1E2B1A" }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
      `}</style>
    </div>
  );
}
