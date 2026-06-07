import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";

const BASE = "http://localhost:8000";

const PHONEME_GROUPS = {
  "Stops": ["B", "P", "D", "T", "G", "K"],
  "Nasals": ["M", "N"],
  "Fricatives": ["F", "V", "S", "Z", "SH", "H", "TH"],
  "Affricates": ["CH", "JH"],
  "Liquids": ["L", "R"],
  "Glides": ["W", "Y"],
  "Vowels": ["AE", "AO", "EH", "IH", "IY", "UW"],
  "Indian": ["RT", "RD"],
};

export function PhonemeSelect({ character, onSelect, onBack }) {
  const char = CHARACTERS[character];
  const [selected, setSelected] = useState(null);
  const [cards, setCards] = useState({});

  const fetchCard = async (ph) => {
    if (cards[ph]) return;
    try {
      const res = await fetch(`${BASE}/phoneme-card/${ph}`);
      const data = await res.json();
      setCards(prev => ({ ...prev, [ph]: data }));
    } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "10px", padding: "8px 14px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>← Back</button>
          <div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#F0EFE8", margin: 0 }}>Practise a Sound</h2>
            <p style={{ color: "#4A5548", fontSize: "0.8rem", margin: 0 }}>Pick a phoneme to work on</p>
          </div>
        </div>

        {Object.entries(PHONEME_GROUPS).map(([group, phonemes]) => (
          <div key={group}>
            <p style={{ color: "#4A5548", fontSize: "0.65rem", letterSpacing: "0.1em", margin: "0 0 8px 0" }}>{group.toUpperCase()}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {phonemes.map(ph => (
                <button key={ph}
                  onClick={() => { setSelected(ph); fetchCard(ph); }}
                  style={{
                    background: selected === ph ? char.color : "#0D1117",
                    border: `1px solid ${selected === ph ? char.color : "#1E2B1A"}`,
                    borderRadius: "10px", padding: "8px 14px",
                    fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem",
                    color: selected === ph ? "#07090F" : "#F0EFE8",
                    cursor: "pointer", fontWeight: 600, transition: "all 0.15s",
                  }}>
                  /{ph}/
                </button>
              ))}
            </div>
          </div>
        ))}

        {selected && cards[selected] && (
          <div style={{ background: "#0D1117", border: `1px solid ${char.color}44`, borderRadius: "16px", padding: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.8rem", color: char.color, fontWeight: 700 }}>/{selected}/</span>
              <div>
                <p style={{ color: "#F0EFE8", fontWeight: 700, margin: 0, fontSize: "0.9rem" }}>{cards[selected].name}</p>
                <p style={{ color: "#4A5548", margin: 0, fontSize: "0.75rem" }}>Example: <strong style={{ color: "#F0EFE8" }}>{cards[selected].example_word}</strong></p>
              </div>
            </div>
            <p style={{ color: "#C8E8B8", fontSize: "0.85rem", margin: "0 0 12px 0", lineHeight: 1.6, borderLeft: `2px solid ${char.color}`, paddingLeft: "10px" }}>
              {cards[selected].tip}
            </p>
            {cards[selected].mouth_svg && (
              <div style={{ width: "200px", height: "120px", margin: "0 auto 12px" }}
                dangerouslySetInnerHTML={{ __html: cards[selected].mouth_svg }} />
            )}
          </div>
        )}

        <button
          onClick={() => selected && onSelect(selected, cards[selected])}
          disabled={!selected}
          style={{
            background: selected ? char.color : "#1E2B1A",
            border: "none", borderRadius: "16px", padding: "18px",
            fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800,
            color: selected ? "#07090F" : "#2A4A20",
            cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s",
          }}>
          {selected ? `Practise /${selected}/ sound →` : "Select a sound to start"}
        </button>
      </div>
    </div>
  );
}

export function PhonemeScreen({ character, phoneme, phonemeCard, onBack, onComplete }) {
  const char = CHARACTERS[character];
  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, reset } = useAudio();
  const [phase, setPhase] = useState("learn");
  const [result, setResult] = useState(null);
  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);

  const playExample = async () => {
    setPlayingChar(true);
    try {
      const form = new FormData();
      form.append("word", phonemeCard?.example_word || phoneme);
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
      form.append("target_word", phonemeCard?.example_word || phoneme);
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

  const scoreColor = result ? (result.composite_score >= 80 ? "#A8FF6F" : result.composite_score >= 60 ? "#FFD166" : "#FF6B6B") : char.color;

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "10px", padding: "8px 14px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>← Sounds</button>
          <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "20px", padding: "4px 14px" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", color: char.color, fontWeight: 700 }}>/{phoneme}/</span>
          </div>
        </div>

        <div style={{ background: "#0D1117", border: `1px solid ${char.color}33`, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#4A5548", fontSize: "0.65rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>SOUND</p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#F0EFE8", margin: 0 }}>{phonemeCard?.name}</p>
            </div>
            <button onClick={playExample} disabled={playingChar}
              style={{ background: `${char.color}22`, border: `1px solid ${char.color}44`, borderRadius: "10px", padding: "8px 14px", color: char.color, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              {playingChar ? "Playing..." : `🔊 "${phonemeCard?.example_word}"`}
            </button>
          </div>
          {phonemeCard?.mouth_svg && (
            <div style={{ width: "220px", height: "130px", margin: "0 auto" }}
              dangerouslySetInnerHTML={{ __html: phonemeCard.mouth_svg }} />
          )}
          <p style={{ color: "#C8E8B8", fontSize: "0.875rem", margin: 0, lineHeight: 1.6, paddingLeft: "10px", borderLeft: `2px solid ${char.color}` }}>
            {phonemeCard?.tip}
          </p>
        </div>

        {phase === "learn" && (
          <button onClick={async () => { setPhase("record"); await startRecording(); }}
            style={{ background: char.color, border: "none", borderRadius: "16px", padding: "20px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.4rem" }}>🎙️</span> Try saying "{phonemeCard?.example_word}"
          </button>
        )}

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
            <button onClick={() => { setPlayingChild(true); const a = new Audio(audioUrl); a.play(); a.onended = () => setPlayingChild(false); }}
              style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#F0EFE8", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}>
              {playingChild ? "Playing..." : "🎧 Hear yourself"}
            </button>
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

        {phase === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "32px" }}>
            <div style={{ width: "40px", height: "40px", border: `3px solid ${char.color}33`, borderTop: `3px solid ${char.color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>Checking your sound...</p>
          </div>
        )}

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
            <button onClick={() => { reset(); setPhase("learn"); setResult(null); }}
              style={{ background: char.color, border: "none", borderRadius: "16px", padding: "16px", fontFamily: "Nunito, sans-serif", fontSize: "1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
              Try again
            </button>
            <button onClick={onComplete}
              style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>
              Back to menu
            </button>
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
EOFcat > ~/vaaksiddhi-autism/frontend/src/components/PhonemeScreen.jsx << 'EOF'
import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { useAudio } from "../hooks/useAudio";

const BASE = "http://localhost:8000";

const PHONEME_GROUPS = {
  "Stops": ["B", "P", "D", "T", "G", "K"],
  "Nasals": ["M", "N"],
  "Fricatives": ["F", "V", "S", "Z", "SH", "H", "TH"],
  "Affricates": ["CH", "JH"],
  "Liquids": ["L", "R"],
  "Glides": ["W", "Y"],
  "Vowels": ["AE", "AO", "EH", "IH", "IY", "UW"],
  "Indian": ["RT", "RD"],
};

export function PhonemeSelect({ character, onSelect, onBack }) {
  const char = CHARACTERS[character];
  const [selected, setSelected] = useState(null);
  const [cards, setCards] = useState({});

  const fetchCard = async (ph) => {
    if (cards[ph]) return;
    try {
      const res = await fetch(`${BASE}/phoneme-card/${ph}`);
      const data = await res.json();
      setCards(prev => ({ ...prev, [ph]: data }));
    } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "10px", padding: "8px 14px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>← Back</button>
          <div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#F0EFE8", margin: 0 }}>Practise a Sound</h2>
            <p style={{ color: "#4A5548", fontSize: "0.8rem", margin: 0 }}>Pick a phoneme to work on</p>
          </div>
        </div>

        {Object.entries(PHONEME_GROUPS).map(([group, phonemes]) => (
          <div key={group}>
            <p style={{ color: "#4A5548", fontSize: "0.65rem", letterSpacing: "0.1em", margin: "0 0 8px 0" }}>{group.toUpperCase()}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {phonemes.map(ph => (
                <button key={ph}
                  onClick={() => { setSelected(ph); fetchCard(ph); }}
                  style={{
                    background: selected === ph ? char.color : "#0D1117",
                    border: `1px solid ${selected === ph ? char.color : "#1E2B1A"}`,
                    borderRadius: "10px", padding: "8px 14px",
                    fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem",
                    color: selected === ph ? "#07090F" : "#F0EFE8",
                    cursor: "pointer", fontWeight: 600, transition: "all 0.15s",
                  }}>
                  /{ph}/
                </button>
              ))}
            </div>
          </div>
        ))}

        {selected && cards[selected] && (
          <div style={{ background: "#0D1117", border: `1px solid ${char.color}44`, borderRadius: "16px", padding: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.8rem", color: char.color, fontWeight: 700 }}>/{selected}/</span>
              <div>
                <p style={{ color: "#F0EFE8", fontWeight: 700, margin: 0, fontSize: "0.9rem" }}>{cards[selected].name}</p>
                <p style={{ color: "#4A5548", margin: 0, fontSize: "0.75rem" }}>Example: <strong style={{ color: "#F0EFE8" }}>{cards[selected].example_word}</strong></p>
              </div>
            </div>
            <p style={{ color: "#C8E8B8", fontSize: "0.85rem", margin: "0 0 12px 0", lineHeight: 1.6, borderLeft: `2px solid ${char.color}`, paddingLeft: "10px" }}>
              {cards[selected].tip}
            </p>
            {cards[selected].mouth_svg && (
              <div style={{ width: "200px", height: "120px", margin: "0 auto 12px" }}
                dangerouslySetInnerHTML={{ __html: cards[selected].mouth_svg }} />
            )}
          </div>
        )}

        <button
          onClick={() => selected && onSelect(selected, cards[selected])}
          disabled={!selected}
          style={{
            background: selected ? char.color : "#1E2B1A",
            border: "none", borderRadius: "16px", padding: "18px",
            fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800,
            color: selected ? "#07090F" : "#2A4A20",
            cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s",
          }}>
          {selected ? `Practise /${selected}/ sound →` : "Select a sound to start"}
        </button>
      </div>
    </div>
  );
}

export function PhonemeScreen({ character, phoneme, phonemeCard, onBack, onComplete }) {
  const char = CHARACTERS[character];
  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, reset } = useAudio();
  const [phase, setPhase] = useState("learn");
  const [result, setResult] = useState(null);
  const [playingChar, setPlayingChar] = useState(false);
  const [playingChild, setPlayingChild] = useState(false);

  const playExample = async () => {
    setPlayingChar(true);
    try {
      const form = new FormData();
      form.append("word", phonemeCard?.example_word || phoneme);
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
      form.append("target_word", phonemeCard?.example_word || phoneme);
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

  const scoreColor = result ? (result.composite_score >= 80 ? "#A8FF6F" : result.composite_score >= 60 ? "#FFD166" : "#FF6B6B") : char.color;

  return (
    <div style={{ minHeight: "100vh", background: "#07090F", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px" }}>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "10px", padding: "8px 14px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>← Sounds</button>
          <div style={{ background: "#0D1117", border: "1px solid #1E2B1A", borderRadius: "20px", padding: "4px 14px" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", color: char.color, fontWeight: 700 }}>/{phoneme}/</span>
          </div>
        </div>

        <div style={{ background: "#0D1117", border: `1px solid ${char.color}33`, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#4A5548", fontSize: "0.65rem", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>SOUND</p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#F0EFE8", margin: 0 }}>{phonemeCard?.name}</p>
            </div>
            <button onClick={playExample} disabled={playingChar}
              style={{ background: `${char.color}22`, border: `1px solid ${char.color}44`, borderRadius: "10px", padding: "8px 14px", color: char.color, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              {playingChar ? "Playing..." : `🔊 "${phonemeCard?.example_word}"`}
            </button>
          </div>
          {phonemeCard?.mouth_svg && (
            <div style={{ width: "220px", height: "130px", margin: "0 auto" }}
              dangerouslySetInnerHTML={{ __html: phonemeCard.mouth_svg }} />
          )}
          <p style={{ color: "#C8E8B8", fontSize: "0.875rem", margin: 0, lineHeight: 1.6, paddingLeft: "10px", borderLeft: `2px solid ${char.color}` }}>
            {phonemeCard?.tip}
          </p>
        </div>

        {phase === "learn" && (
          <button onClick={async () => { setPhase("record"); await startRecording(); }}
            style={{ background: char.color, border: "none", borderRadius: "16px", padding: "20px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#07090F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.4rem" }}>🎙️</span> Try saying "{phonemeCard?.example_word}"
          </button>
        )}

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
            <button onClick={() => { setPlayingChild(true); const a = new Audio(audioUrl); a.play(); a.onended = () => setPlayingChild(false); }}
              style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#F0EFE8", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}>
              {playingChild ? "Playing..." : "🎧 Hear yourself"}
            </button>
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

        {phase === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "32px" }}>
            <div style={{ width: "40px", height: "40px", border: `3px solid ${char.color}33`, borderTop: `3px solid ${char.color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#4A5548", fontSize: "0.85rem" }}>Checking your sound...</p>
          </div>
        )}

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
            <button onClick={() => { reset(); setPhase("learn"); setResult(null); }}
              style={{ background: char.color, border: "none", borderRadius: "16px", padding: "16px", fontFamily: "Nunito, sans-serif", fontSize: "1rem", fontWeight: 800, color: "#07090F", cursor: "pointer" }}>
              Try again
            </button>
            <button onClick={onComplete}
              style={{ background: "transparent", border: "1px solid #1E2B1A", borderRadius: "12px", padding: "12px", color: "#4A5548", fontSize: "0.85rem", cursor: "pointer" }}>
              Back to menu
            </button>
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
