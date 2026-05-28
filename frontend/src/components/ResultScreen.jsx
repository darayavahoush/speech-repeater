import { useEffect, useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { playBase64Audio } from "../utils/api";

export default function ResultScreen({ character, result, onRetry, onNextWord, onDrill, childAudioUrl }) {
  const char = CHARACTERS[character];
  const score = result?.composite_score ?? 0;
  const phonemeAccuracy = result?.phoneme_scores?.accuracy ?? 0;
  const matches = result?.phoneme_scores?.matches ?? [];
  const acoustic = result?.acoustic ?? {};
  const encouragement = result?.encouragement ?? {};
  const acousticTips = result?.acoustic_tips ?? [];
  const [showAcoustic, setShowAcoustic] = useState(false);
  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);

  const scoreColor = score >= 80 ? "#A8FF6F" : score >= 60 ? "#FFD166" : "#FF6B6B";

  useEffect(() => {
    if (result?.character_response_audio) {
      setTimeout(() => {
        setPlayingChar(true);
        const audio = playBase64Audio(result.character_response_audio);
        audio.onended = () => setPlayingChar(false);
      }, 400);
    }
  }, []);

  const playChildAudio = () => {
    if (!childAudioUrl) return;
    setPlayingChild(true);
    const audio = new Audio(childAudioUrl);
    audio.play();
    audio.onended = () => setPlayingChild(false);
  };

  const playCharAudio = () => {
    if (!result?.character_response_audio) return;
    setPlayingChar(true);
    const audio = playBase64Audio(result.character_response_audio);
    audio.onended = () => setPlayingChar(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={{ width: "36px", height: "36px" }} dangerouslySetInnerHTML={{ __html: char.icon }} />
          <span style={{ color: char.color, fontWeight: 700, fontSize: "0.9rem" }}>{char.name} says...</span>
        </div>

        {/* Encouragement message */}
        <div style={{ background: char.accentColor, border: `1px solid ${char.color}44`, borderRadius: "16px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#F0EFE8", margin: 0, flex: 1 }}>
            {encouragement.message}
          </p>
          <button onClick={playCharAudio} disabled={playingChar}
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.4rem", marginLeft: "12px" }}>
            {playingChar ? "🔊" : "▶️"}
          </button>
        </div>

        {/* Score card */}
        <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "20px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>OVERALL SCORE</p>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "3rem", fontWeight: 700, color: scoreColor, margin: 0, lineHeight: 1 }}>
                {Math.round(score)}%
              </p>
            </div>
            <div style={{ background: `${scoreColor}22`, border: `1px solid ${scoreColor}44`, borderRadius: "12px", padding: "10px 16px", textAlign: "center" }}>
              <p style={{ color: scoreColor, fontSize: "0.9rem", fontWeight: 700, margin: 0, fontFamily: "Nunito, sans-serif" }}>
                {score >= 80 ? "🌟 Excellent" : score >= 60 ? "👍 Keep going" : "💪 Needs work"}
              </p>
            </div>
          </div>

          {/* Phoneme comparison */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: 0 }}>PHONEME BREAKDOWN</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {matches.map((m, i) => (
                <div key={i} style={{
                  background: m.correct ? "#1A2E14" : "#2E1414",
                  border: `1px solid ${m.correct ? "#A8FF6F33" : "#FF6B6B33"}`,
                  borderRadius: "10px", padding: "6px 12px", textAlign: "center",
                }}>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", color: m.correct ? "#A8FF6F" : "#FF6B6B", margin: 0, fontWeight: 600 }}>
                    {m.detected || "—"}
                  </p>
                  <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#4A5548", margin: "2px 0 0 0" }}>
                    /{m.expected}/
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Heard */}
          <div style={{ borderTop: "1px solid #1E2B1A", paddingTop: "14px" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>HEARD</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", color: "#F0EFE8", fontSize: "1rem", margin: 0 }}>
              "{result?.transcript}"
            </p>
          </div>
        </div>

        {/* Playback comparison */}
        <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 12px 0" }}>COMPARE VOICES</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={playChildAudio} disabled={playingChild || !childAudioUrl}
              style={{ flex: 1, background: "transparent", border: "1px solid #1E2B1A", borderRadius: "10px", padding: "12px", color: "#F0EFE8", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>
              {playingChild ? "Playing..." : "🎧 Your voice"}
            </button>
            <button onClick={playCharAudio} disabled={playingChar}
              style={{ flex: 1, background: "transparent", border: `1px solid ${char.color}44`, borderRadius: "10px", padding: "12px", color: char.color, fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>
              {playingChar ? "Playing..." : `🔊 ${char.name}`}
            </button>
          </div>
        </div>

        {/* Acoustic tips — always show on failure */}
        {acousticTips.length > 0 && score < 80 && (
          <div style={{ background: "#0D1117", border: `1px solid ${char.color}33`, borderRadius: "14px", padding: "16px" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 10px 0" }}>VOICE TIPS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {acousticTips.map((tip, i) => (
                <p key={i} style={{ color: "#C8E8B8", fontSize: "0.85rem", margin: 0, lineHeight: 1.5, paddingLeft: "8px", borderLeft: `2px solid ${char.color}` }}>
                  {tip.tip}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Phoneme diagrams on failure */}
        {score < 80 && matches.filter(m => !m.correct).length > 0 && (
          <PhonemeHelp matches={matches} char={char} />
        )}

        {/* Feedback */}
        {result?.feedback && (
          <div style={{ background: "#080C0A", border: "1px solid #1E2B1A", borderRadius: "14px", padding: "16px" }}>
            <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: "0 0 8px 0" }}>FEEDBACK</p>
            <p style={{ color: "#C8E8B8", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>{result.feedback}</p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          {encouragement.action === "next_word" && (
            <button onClick={onNextWord}
              style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
              Next word! →
            </button>
          )}
          {(encouragement.action === "retry" || encouragement.action === "drill") && (
            <>
              <button onClick={onRetry}
                style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
                Try again
              </button>
              {result?.enter_drill_mode && result?.drill_sequence?.length > 0 && (
                <button onClick={onDrill}
                  style={{ background: "transparent", border: `1px solid ${char.color}`, borderRadius: "14px", padding: "14px", color: char.color, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
                  Practise sounds separately
                </button>
              )}
            </>
          )}
          {encouragement.action === "support" && (
            <>
              <button onClick={onRetry}
                style={{ background: char.color, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
                Try again
              </button>
              {result?.drill_sequence?.length > 0 && (
                <button onClick={onDrill}
                  style={{ background: "transparent", border: `1px solid ${char.color}`, borderRadius: "14px", padding: "14px", color: char.color, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
                  Practise sounds separately
                </button>
              )}
            </>
          )}
          <button onClick={onNextWord}
            style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>
            Skip to next word
          </button>
        </div>
      </div>
    </div>
  );
}

function PhonemeHelp({ matches, char }) {
  const [cards, setCards] = useState({});
  const wrongPhonemes = matches.filter(m => !m.correct).map(m => m.expected);

  useEffect(() => {
    wrongPhonemes.forEach(async (ph) => {
      if (!cards[ph]) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/phoneme-card/${ph}`);
          const data = await res.json();
          setCards(prev => ({ ...prev, [ph]: data }));
        } catch {}
      }
    });
  }, []);

  if (wrongPhonemes.length === 0) return null;

  return (
    <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <p style={{ color: "#4A5548", fontSize: "0.7rem", letterSpacing: "0.1em", margin: 0 }}>HOW TO FIX THESE SOUNDS</p>
      {wrongPhonemes.map((ph, i) => {
        const card = cards[ph];
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "14px", borderBottom: i < wrongPhonemes.length - 1 ? "1px solid #1E2B1A" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4rem", color: char.color, fontWeight: 700 }}>/{ph}/</span>
              {card && <span style={{ color: "#F0EFE8", fontSize: "0.85rem", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{card.name}</span>}
            </div>
            {card?.mouth_svg && (
              <div style={{ width: "200px", height: "120px", alignSelf: "center" }}
                dangerouslySetInnerHTML={{ __html: card.mouth_svg }} />
            )}
            {card?.tip && (
              <p style={{ color: "#C8E8B8", fontSize: "0.85rem", margin: 0, lineHeight: 1.6, paddingLeft: "8px", borderLeft: `2px solid ${char.color}` }}>
                {card.tip}
              </p>
            )}
            {card?.example_word && (
              <p style={{ color: "#4A5548", fontSize: "0.75rem", margin: 0 }}>
                Example: <span style={{ color: "#F0EFE8", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{card.example_word}</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

