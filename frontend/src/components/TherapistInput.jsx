import { useState, useEffect } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";
import { inputWord } from "../utils/api";
import { t } from "../utils/i18n";
import { WORD_SUGGESTIONS } from "../utils/wordSuggestions";

const THEMES = {
  BOLT:  { bg: "#EEF4FB", card: "#DDEAF7", text: "#1A3A5C", sub: "#4A7AA5", accent: "#5B9BD5" },
  ZARA:  { bg: "#F5EEFB", card: "#EDD8F7", text: "#3A1A5C", sub: "#7A4AA5", accent: "#B57ED5" },
  NOVA:  { bg: "#EEF7EF", card: "#D5EDDA", text: "#1A3A1C", sub: "#3A7A4A", accent: "#6BBF7A" },
  BEEP:  { bg: "#FDF6E8", card: "#FAE8B8", text: "#3A2A00", sub: "#7A5A10", accent: "#E8B84B" },
  ECHO:  { bg: "#FBF0EC", card: "#F5D5C8", text: "#3A1200", sub: "#8A3A20", accent: "#E87B5A" },
  MIRA:  { bg: "#EAF7F7", card: "#C8EAEA", text: "#003A3A", sub: "#1A6A6A", accent: "#4ABFBF" },
};

const SUGGESTION_CATEGORIES = ["animals", "food", "colours", "family", "actions", "objects"];

export default function TherapistInput({ character, language = "english", onWordReady, onSwitchCharacter }) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [activeCategory, setActiveCategory] = useState("animals");
  const [showTranslate, setShowTranslate] = useState(false);
  const [englishWord, setEnglishWord] = useState("");
  const [translating, setTranslating] = useState(false);
  const { isRecording, audioBlob, startRecording, stopRecording, reset } = useAudio();
  const char = CHARACTERS[character];
  const th = THEMES[character];

  useEffect(() => { document.body.style.background = th.bg; document.body.style.transition = "background 0.5s ease"; }, [th.bg]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await inputWord({
        text: mode === "text" ? text : null,
        audio: mode === "voice" ? audioBlob : null,
        character, language, mood: "instruction",
      });
      onWordReady(result);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleTranslate = async () => {
    if (!englishWord.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch(`https://anabaena-vaaksiddhi.hf.space/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: englishWord, target_language: language }),
      });
      const data = await res.json();
      if (data.translated) {
        setText(data.translated);
        setShowTranslate(false);
        setEnglishWord("");
      }
    } catch (err) { console.error(err); } finally { setTranslating(false); }
  };

  const suggestions = WORD_SUGGESTIONS[language]?.[activeCategory] || [];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={char.image} alt={char.name} style={{ width: "44px", height: "44px", objectFit: "contain" }} />
            <div>
              <p style={{ color: th.sub, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>{t(language, "teachingWith")}</p>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.2rem", fontWeight: 900, color: th.text, margin: 0 }}>{char.name}</h2>
            </div>
          </div>
          <button onClick={() => setShowSwitcher(!showSwitcher)} style={{ background: th.card, border: `1.5px solid ${th.accent}44`, borderRadius: "12px", padding: "8px 14px", color: th.sub, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
            {t(language, "switchCharacter")}
          </button>
        </div>

        {/* Character switcher */}
        {showSwitcher && (
          <div style={{ background: "rgba(255,255,255,0.9)", border: `1.5px solid ${th.accent}33`, borderRadius: "18px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: th.sub, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 0" }}>{t(language, "switchFriend")}</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {Object.values(CHARACTERS).map(c => (
                <button key={c.id} onClick={() => { onSwitchCharacter(c.id); setShowSwitcher(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: c.id === character ? THEMES[c.id].card : "transparent", border: `1.5px solid ${c.id === character ? THEMES[c.id].accent : "rgba(0,0,0,0.08)"}`, borderRadius: "12px", padding: "8px 12px", cursor: "pointer" }}>
                  <img src={c.image} alt={c.name} style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: THEMES[c.id].text, fontFamily: "Nunito, sans-serif" }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: th.text, margin: "0 0 4px 0" }}>
            {t(language, "whatWord", char.name)}
          </h1>
          <p style={{ color: th.sub, fontSize: "0.85rem", margin: 0 }}>{t(language, "typeOrSay")}</p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", background: th.card, borderRadius: "14px", padding: "4px" }}>
          {[["text", t(language, "typeWord")], ["voice", t(language, "sayWord")]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); reset(); }} style={{ flex: 1, background: mode === m ? "rgba(255,255,255,0.9)" : "transparent", color: mode === m ? th.text : th.sub, border: "none", borderRadius: "10px", padding: "10px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "Nunito, sans-serif" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Text input */}
        {mode === "text" && (
          <>
            <input value={text} onChange={(e) => setText(e.target.value)}
              placeholder={t(language, "wordPlaceholder")}
              style={{ width: "100%", background: "rgba(255,255,255,0.8)", border: `1.5px solid ${th.accent}44`, borderRadius: "14px", padding: "16px", color: th.text, fontSize: "1.1rem", outline: "none", fontFamily: "Nunito, sans-serif", fontWeight: 700, marginBottom: "10px", boxSizing: "border-box" }}
              onKeyDown={(e) => e.key === "Enter" && text.trim() && handleSubmit()} />

            {/* Translate from English button — show for Hindi/Kannada */}
            {language !== "english" && (
              <button onClick={() => setShowTranslate(!showTranslate)} style={{ background: "transparent", border: `1.5px solid ${th.accent}44`, borderRadius: "10px", padding: "8px 14px", color: th.accent, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif", marginBottom: "12px" }}>
                🔤 {t(language, "translateFromEnglish")}
              </button>
            )}

            {showTranslate && (
              <div style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${th.accent}33`, borderRadius: "14px", padding: "14px", marginBottom: "12px", display: "flex", gap: "8px" }}>
                <input value={englishWord} onChange={(e) => setEnglishWord(e.target.value)}
                  placeholder={t(language, "enterEnglish")}
                  style={{ flex: 1, background: "transparent", border: `1px solid ${th.accent}33`, borderRadius: "8px", padding: "10px", color: th.text, fontSize: "0.9rem", outline: "none", fontFamily: "Nunito, sans-serif" }}
                  onKeyDown={(e) => e.key === "Enter" && handleTranslate()} />
                <button onClick={handleTranslate} disabled={translating} style={{ background: th.accent, border: "none", borderRadius: "8px", padding: "10px 16px", color: "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                  {translating ? "..." : t(language, "translate")}
                </button>
              </div>
            )}

            {/* Word suggestions */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: th.sub, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px 0" }}>{t(language, "suggestions")}</p>
              {/* Category tabs */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {SUGGESTION_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? th.accent : th.card, color: activeCategory === cat ? "#fff" : th.sub, border: "none", borderRadius: "20px", padding: "4px 12px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                    {t(language, cat)}
                  </button>
                ))}
              </div>
              {/* Word chips */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {suggestions.map((word, i) => (
                  <button key={i} onClick={() => setText(word)} style={{ background: text === word ? th.accent : "rgba(255,255,255,0.8)", color: text === word ? "#fff" : th.text, border: `1.5px solid ${text === word ? th.accent : th.accent + "33"}`, borderRadius: "20px", padding: "6px 14px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif", transition: "all 0.2s" }}>
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Voice input */}
        {mode === "voice" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", marginBottom: "16px", padding: "28px", background: "rgba(255,255,255,0.7)", border: `1.5px solid ${th.accent}33`, borderRadius: "18px" }}>
            {!audioBlob ? (
              <>
                <div onClick={isRecording ? stopRecording : startRecording} style={{ width: "90px", height: "90px", borderRadius: "50%", background: isRecording ? "#FF6B6B" : th.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: isRecording ? "0 0 30px #FF6B6B44" : `0 4px 20px ${th.accent}44` }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                    <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="white" strokeWidth="2"/>
                    <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2"/>
                    <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <p style={{ color: th.sub, fontSize: "0.85rem", fontWeight: 600 }}>{isRecording ? t(language, "recordStop") : t(language, "recordTap")}</p>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#E8F7EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>✅</div>
                <p style={{ color: th.text, fontSize: "0.9rem", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>{t(language, "wordRecorded")}</p>
                <button onClick={reset} style={{ background: "transparent", color: th.sub, border: `1.5px solid ${th.accent}44`, borderRadius: "8px", padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>{t(language, "recordAgain")}</button>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading || (mode === "text" ? !text.trim() : !audioBlob)} style={{ width: "100%", padding: "18px", background: loading || (mode === "text" ? !text.trim() : !audioBlob) ? "rgba(0,0,0,0.08)" : th.accent, color: loading || (mode === "text" ? !text.trim() : !audioBlob) ? th.sub : "#fff", border: "none", borderRadius: "16px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 900, cursor: "pointer", transition: "all 0.2s", boxShadow: loading || (mode === "text" ? !text.trim() : !audioBlob) ? "none" : `0 4px 20px ${th.accent}44` }}>
          {loading ? t(language, "preparing") : t(language, "letTeach", char.name)}
        </button>
      </div>
    </div>
  );
}
