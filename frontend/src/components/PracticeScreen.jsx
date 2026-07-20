import { useState, useEffect, useRef } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";
import { evaluateAttempt } from "../utils/api";
import { friendlyPhoneme, phonemeExample } from "../utils/phonemeMap";
import { displayPhoneme } from "../utils/phonemeMapIndic";
import { t } from "../utils/i18n";

const THEMES = {
  BOLT:  { bg: "#EEF4FB", card: "#DDEAF7", text: "#1A3A5C", sub: "#4A7AA5", accent: "#5B9BD5" },
  ZARA:  { bg: "#F5EEFB", card: "#EDD8F7", text: "#3A1A5C", sub: "#7A4AA5", accent: "#B57ED5" },
  NOVA:  { bg: "#EEF7EF", card: "#D5EDDA", text: "#1A3A1C", sub: "#3A7A4A", accent: "#6BBF7A" },
  BEEP:  { bg: "#FDF6E8", card: "#FAE8B8", text: "#3A2A00", sub: "#7A5A10", accent: "#E8B84B" },
  ECHO:  { bg: "#FBF0EC", card: "#F5D5C8", text: "#3A1200", sub: "#8A3A20", accent: "#E87B5A" },
  MIRA:  { bg: "#EAF7F7", card: "#C8EAEA", text: "#003A3A", sub: "#1A6A6A", accent: "#4ABFBF" },
};

export default function PracticeScreen({ character, language = "english", wordData, sessionId, attemptNumber, attemptHistory = [], onResult, onSwitchCharacter }) {
  const [phase, setPhase] = useState("listen");
  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);
  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, reset } = useAudio();
  const char = CHARACTERS[character];
  const th = THEMES[character];
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => { document.body.style.background = th.bg; document.body.style.transition = "background 0.5s ease"; }, [th.bg]);

  const playWord = async (speed = 1.0) => {
    setPlayingChar(true);
    try {
      const form = new FormData();
      form.append("word", wordData.word);
      form.append("speed", String(speed));
      form.append("language", language);
      form.append("character", character);
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
            <span style={{ color: th.text, fontWeight: 800, fontSize: "0.95rem", fontFamily: "Nunito, sans-serif" }}>{char.name}</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button onClick={() => setShowSwitcher(!showSwitcher)} style={{ background: th.card, border: `1.5px solid ${th.accent}44`, borderRadius: "10px", padding: "5px 12px", color: th.sub, fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>Switch</button>
            <div style={{ background: th.card, border: `1px solid ${th.accent}44`, borderRadius: "20px", padding: "4px 14px", fontSize: "0.75rem", color: th.sub, fontWeight: 700 }}>Attempt {attemptNumber}</div>
          </div>
        </div>

        {showSwitcher && (
          <div style={{ background: "rgba(255,255,255,0.9)", border: `1.5px solid ${th.accent}33`, borderRadius: "16px", padding: "14px", boxShadow: `0 4px 20px ${th.accent}18` }}>
            <p style={{ color: th.sub, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px 0" }}>Switch character</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {Object.values(CHARACTERS).map(c => (
                <button key={c.id} onClick={() => { onSwitchCharacter(c.id); setShowSwitcher(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: c.id === character ? THEMES[c.id].card : "transparent", border: `1.5px solid ${c.id === character ? THEMES[c.id].accent : "rgba(0,0,0,0.08)"}`, borderRadius: "10px", padding: "8px 10px", cursor: "pointer" }}>
                  <img src={c.image} alt={c.name} style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, color: THEMES[c.id].text, fontFamily: "Nunito, sans-serif" }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: "rgba(255,255,255,0.7)", border: `1.5px solid ${th.accent}33`, borderRadius: "24px", padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", boxShadow: `0 4px 24px ${th.accent}18` }}>
          {(() => {
            const imgs = wordData?.images?.length > 0 ? wordData.images : imageUrl ? [{ label: wordData?.word, image_base64: wordData?.image_base64 }] : [];
            const idx = Math.min(imageIndex, Math.max(imgs.length - 1, 0));
            const current = imgs[idx];
            return (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", minHeight: "180px" }}>
                  {current?.pair ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <img src={"data:image/png;base64," + current.image_base64} alt={current.label_1} style={{ width: "120px", height: "120px", objectFit: "contain", borderRadius: "12px" }} />
                        <span style={{ color: th.sub, fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize", fontFamily: "Nunito, sans-serif" }}>{current.label_1}</span>
                      </div>
                      <span style={{ color: th.accent, fontSize: "1.4rem", fontWeight: 900 }}>+</span>
                      {current.image_base64_2 && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                          <img src={"data:image/png;base64," + current.image_base64_2} alt={current.label_2} style={{ width: "120px", height: "120px", objectFit: "contain", borderRadius: "12px" }} />
                          <span style={{ color: th.sub, fontSize: "0.7rem", fontWeight: 700, textTransform: "capitalize", fontFamily: "Nunito, sans-serif" }}>{current.label_2}</span>
                        </div>
                      )}
                    </>
                  ) : current ? (
                    <img src={"data:image/png;base64," + current.image_base64} alt={current.label} style={{ width: "180px", height: "180px", objectFit: "contain", borderRadius: "16px" }} />
                  ) : (
                    <div style={{ width: "140px", height: "140px", background: th.card, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🖼️</div>
                  )}
                </div>
                {current && !current.pair && <p style={{ color: th.sub, fontSize: "0.72rem", fontWeight: 700, margin: 0, textTransform: "capitalize", fontFamily: "Nunito, sans-serif" }}>{current.label}</p>}
                {imgs.length > 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={() => setImageIndex(i => Math.max(0, i - 1))} disabled={idx === 0} style={{ width: "30px", height: "30px", borderRadius: "50%", border: `1.5px solid ${th.accent}44`, background: idx === 0 ? "transparent" : th.card, color: th.accent, cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.3 : 1, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {imgs.map((_, i) => (
                        <div key={i} onClick={() => setImageIndex(i)} style={{ width: i === idx ? "16px" : "7px", height: "7px", borderRadius: "4px", background: i === idx ? th.accent : `${th.accent}33`, transition: "all 0.2s", cursor: "pointer" }} />
                      ))}
                    </div>
                    <button onClick={() => setImageIndex(i => Math.min(imgs.length - 1, i + 1))} disabled={idx === imgs.length - 1} style={{ width: "30px", height: "30px", borderRadius: "50%", border: `1.5px solid ${th.accent}44`, background: idx === imgs.length - 1 ? "transparent" : th.card, color: th.accent, cursor: idx === imgs.length - 1 ? "not-allowed" : "pointer", opacity: idx === imgs.length - 1 ? 0.3 : 1, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
                  </div>
                )}
              </div>
            );
          })()}

          <div style={{ textAlign: "center" }}>
            <p style={{ color: th.sub, fontSize: "0.65rem", letterSpacing: "0.12em", margin: "0 0 6px 0", fontWeight: 700, textTransform: "uppercase" }}>Target Word</p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.4rem", fontWeight: 900, color: th.text, margin: 0 }}>{wordData?.word}</p>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
            {(wordData?.phonemes || []).map((p, i) => (
              <div key={i} title={phonemeExample(p)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: th.card, border: `1px solid ${th.accent}55`, borderRadius: "10px", padding: "6px 10px", cursor: "default" }}>
                <span style={{ color: th.accent, fontFamily: "Nunito, sans-serif", fontSize: "0.95rem", fontWeight: 900, lineHeight: 1 }}>
                  {language === "english" ? friendlyPhoneme(p) : (displayPhoneme(p, language)?.label || p)}
                </span>
                <span style={{ color: th.sub, fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", opacity: 0.6 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => playWord(1.0)} disabled={playingChar} style={{ flex: 1, background: "rgba(255,255,255,0.7)", border: `1.5px solid ${th.accent}44`, borderRadius: "14px", padding: "14px", cursor: "pointer", color: th.accent, fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "Nunito, sans-serif" }}>
            🔊 Normal
          </button>
          <button onClick={() => playWord(0.65)} disabled={playingChar} style={{ flex: 1, background: "rgba(255,255,255,0.7)", border: `1.5px solid ${th.accent}44`, borderRadius: "14px", padding: "14px", cursor: "pointer", color: th.accent, fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "Nunito, sans-serif" }}>
            🐢 Slow
          </button>
        </div>
        {playingChar && <p style={{ color: th.sub, fontSize: "0.75rem", textAlign: "center", margin: "-8px 0 0 0" }}>Playing...</p>}

        {phase === "listen" && (
          <button onClick={handleRecord} style={{ background: th.accent, border: "none", borderRadius: "18px", padding: "22px", fontFamily: "Nunito, sans-serif", fontSize: "1.15rem", fontWeight: 900, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: `0 4px 20px ${th.accent}44` }}>
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
            <p style={{ color: th.sub, fontSize: "0.85rem", fontWeight: 600 }}>Recording... tap to stop</p>
          </div>
        )}

        {phase === "record" && !isRecording && audioBlob && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ background: "rgba(255,255,255,0.7)", border: `1.5px solid ${th.accent}33`, borderRadius: "16px", padding: "14px", display: "flex", gap: "10px" }}>
              <button onClick={playChildAudio} disabled={playingChild} style={{ flex: 1, background: "transparent", border: `1.5px solid ${th.accent}44`, borderRadius: "10px", padding: "10px", color: th.sub, fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
                {playingChild ? "Playing..." : t(language, "hearYourself")}
              </button>
              <button onClick={() => playWord(1.0)} disabled={playingChar} style={{ flex: 1, background: "transparent", border: `1.5px solid ${th.accent}66`, borderRadius: "10px", padding: "10px", color: th.accent, fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
                {playingChar ? "Playing..." : `🔊 Hear ${char.name}`}
              </button>
            </div>
            <button onClick={handleSubmit} style={{ background: th.accent, border: "none", borderRadius: "16px", padding: "20px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", cursor: "pointer", boxShadow: `0 4px 20px ${th.accent}44` }}>
              Check my answer! ✨
            </button>
            <button onClick={() => { reset(); setPhase("record"); startRecording(); }} style={{ background: "transparent", border: `1.5px solid ${th.accent}44`, borderRadius: "12px", padding: "12px", color: th.sub, fontSize: "0.85rem", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
              Try again
            </button>
          </div>
        )}

        {phase === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "32px" }}>
            <div style={{ width: "44px", height: "44px", border: `3px solid ${th.accent}33`, borderTop: `3px solid ${th.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: th.sub, fontSize: "0.85rem", fontWeight: 600 }}>Analysing your voice...</p>
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
