import { useEffect, useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { playBase64Audio } from "../utils/api";

const THEMES = {
  BOLT:  { bg: "#EEF4FB", card: "#DDEAF7", text: "#1A3A5C", sub: "#4A7AA5", accent: "#5B9BD5" },
  ZARA:  { bg: "#F5EEFB", card: "#EDD8F7", text: "#3A1A5C", sub: "#7A4AA5", accent: "#B57ED5" },
  NOVA:  { bg: "#EEF7EF", card: "#D5EDDA", text: "#1A3A1C", sub: "#3A7A4A", accent: "#6BBF7A" },
  BEEP:  { bg: "#FDF6E8", card: "#FAE8B8", text: "#3A2A00", sub: "#7A5A10", accent: "#E8B84B" },
  ECHO:  { bg: "#FBF0EC", card: "#F5D5C8", text: "#3A1200", sub: "#8A3A20", accent: "#E87B5A" },
  MIRA:  { bg: "#EAF7F7", card: "#C8EAEA", text: "#003A3A", sub: "#1A6A6A", accent: "#4ABFBF" },
};

export default function ResultScreen({ character, result, onRetry, onNextWord, onDrill, childAudioUrl }) {
  const char = CHARACTERS[character];
  const t = THEMES[character];
  const score = result?.composite_score ?? 0;
  const matches = result?.phoneme_scores?.matches ?? [];
  const encouragement = result?.encouragement ?? {};
  const acousticTips = result?.acoustic_tips ?? [];
  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);

  document.body.style.background = t.bg;
  document.body.style.transition = "background 0.5s ease";

  const scoreColor = score >= 80 ? "#4CAF7D" : score >= 60 ? "#E8A020" : "#E05555";
  const scoreBg = score >= 80 ? "#E8F7EE" : score >= 60 ? "#FDF3E0" : "#FDEAEA";
  const scoreLabel = score >= 80 ? "🌟 Excellent!" : score >= 60 ? "👍 Good effort!" : "💪 Keep trying!";

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "14px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={char.image} alt={char.name} style={{ width: "44px", height: "44px", objectFit: "contain" }} />
          <span style={{ color: t.text, fontWeight: 800, fontSize: "0.95rem", fontFamily: "Nunito, sans-serif" }}>{char.name} says...</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}33`, borderRadius: "18px", padding: "20px", boxShadow: `0 4px 20px ${t.accent}15` }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: t.text, margin: 0, lineHeight: 1.5 }}>
            {encouragement.message}
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}33`, borderRadius: "20px", padding: "22px", boxShadow: `0 4px 20px ${t.accent}15` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 4px 0", fontWeight: 700, textTransform: "uppercase" }}>Overall Score</p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "3rem", fontWeight: 900, color: scoreColor, margin: 0, lineHeight: 1 }}>{Math.round(score)}%</p>
            </div>
            <div style={{ background: scoreBg, borderRadius: "14px", padding: "10px 16px", textAlign: "center" }}>
              <p style={{ color: scoreColor, fontSize: "0.9rem", fontWeight: 800, margin: 0, fontFamily: "Nunito, sans-serif" }}>{scoreLabel}</p>
            </div>
          </div>

          <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 10px 0", fontWeight: 700, textTransform: "uppercase" }}>Phoneme Breakdown</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {matches.map((m, i) => (
              <div key={i} style={{ background: m.correct ? "#E8F7EE" : "#FDEAEA", border: `1.5px solid ${m.correct ? "#4CAF7D44" : "#E0555544"}`, borderRadius: "10px", padding: "6px 12px", textAlign: "center" }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", color: m.correct ? "#4CAF7D" : "#E05555", margin: 0, fontWeight: 700 }}>{m.detected || "—"}</p>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: t.sub, margin: "2px 0 0 0" }}>/{m.expected}/</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${t.accent}22`, paddingTop: "14px" }}>
            <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 4px 0", fontWeight: 700, textTransform: "uppercase" }}>Heard</p>
            <p style={{ fontFamily: "Nunito, sans-serif", color: t.text, fontSize: "1rem", margin: 0, fontWeight: 700 }}>"{result?.transcript}"</p>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}33`, borderRadius: "16px", padding: "16px" }}>
          <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 12px 0", fontWeight: 700, textTransform: "uppercase" }}>Compare Voices</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={playChildAudio} disabled={playingChild || !childAudioUrl} style={{ flex: 1, background: "transparent", border: `1.5px solid ${t.accent}44`, borderRadius: "10px", padding: "12px", color: t.sub, fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
              {playingChild ? "Playing..." : "🎧 Your voice"}
            </button>
            <button onClick={playCharAudio} disabled={playingChar} style={{ flex: 1, background: "transparent", border: `1.5px solid ${t.accent}66`, borderRadius: "10px", padding: "12px", color: t.accent, fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
              {playingChar ? "Playing..." : `🔊 ${char.name}`}
            </button>
          </div>
        </div>

        {acousticTips.length > 0 && score < 80 && (
          <div style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}33`, borderRadius: "16px", padding: "16px" }}>
            <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 10px 0", fontWeight: 700, textTransform: "uppercase" }}>Voice Tips</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {acousticTips.map((tip, i) => (
                <p key={i} style={{ color: t.text, fontSize: "0.85rem", margin: 0, lineHeight: 1.6, paddingLeft: "12px", borderLeft: `3px solid ${t.accent}` }}>{tip.tip}</p>
              ))}
            </div>
          </div>
        )}

        {score < 80 && matches.filter(m => !m.correct).length > 0 && (
          <PhonemeHelp matches={matches} char={char} t={t} />
        )}

        {result?.feedback && (
          <div style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}33`, borderRadius: "16px", padding: "16px" }}>
            <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 8px 0", fontWeight: 700, textTransform: "uppercase" }}>Feedback</p>
            <p style={{ color: t.text, fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>{result.feedback}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
          {encouragement.action === "next_word" && (
            <button onClick={onNextWord} style={{ background: t.accent, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", cursor: "pointer", boxShadow: `0 4px 20px ${t.accent}44` }}>
              Next word! →
            </button>
          )}
          {(encouragement.action === "retry" || encouragement.action === "drill" || encouragement.action === "support") && (
            <>
              <button onClick={onRetry} style={{ background: t.accent, border: "none", borderRadius: "16px", padding: "18px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", cursor: "pointer", boxShadow: `0 4px 20px ${t.accent}44` }}>
                Try again
              </button>
              {result?.drill_sequence?.length > 0 && (
                <button onClick={onDrill} style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}66`, borderRadius: "14px", padding: "14px", color: t.accent, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                  Practise sounds separately
                </button>
              )}
            </>
          )}
          <button onClick={onNextWord} style={{ background: "transparent", border: `1.5px solid ${t.accent}44`, borderRadius: "12px", padding: "12px", color: t.sub, fontSize: "0.85rem", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
            Skip to next word
          </button>
        </div>
      </div>
    </div>
  );
}

function PhonemeHelp({ matches, char, t }) {
  const [cards, setCards] = useState({});
  const wrongPhonemes = matches.filter(m => !m.correct).map(m => m.expected);

  useEffect(() => {
    wrongPhonemes.forEach(async (ph) => {
      if (!cards[ph]) {
        try {
          const res = await fetch(`https://anabaena-vaaksiddhi.hf.space/phoneme-card/${ph}`);
          const data = await res.json();
          setCards(prev => ({ ...prev, [ph]: data }));
        } catch {}
      }
    });
  }, []);

  if (wrongPhonemes.length === 0) return null;

  return (
    <div style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${t.accent}33`, borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <p style={{ color: t.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: 0, fontWeight: 700, textTransform: "uppercase" }}>How to fix these sounds</p>
      {wrongPhonemes.map((ph, i) => {
        const card = cards[ph];
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "14px", borderBottom: i < wrongPhonemes.length - 1 ? `1px solid ${t.accent}22` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4rem", color: t.accent, fontWeight: 700 }}>/{ph}/</span>
              {card && <span style={{ color: t.text, fontSize: "0.85rem", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{card.name}</span>}
            </div>
            {card?.mouth_svg && <div style={{ width: "200px", height: "120px", alignSelf: "center" }} dangerouslySetInnerHTML={{ __html: card.mouth_svg }} />}
            {card?.tip && <p style={{ color: t.text, fontSize: "0.85rem", margin: 0, lineHeight: 1.6, paddingLeft: "12px", borderLeft: `3px solid ${t.accent}` }}>{card.tip}</p>}
            {card?.example_word && <p style={{ color: t.sub, fontSize: "0.75rem", margin: 0 }}>Example: <span style={{ color: t.text, fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{card.example_word}</span></p>}
          </div>
        );
      })}
    </div>
  );
}
