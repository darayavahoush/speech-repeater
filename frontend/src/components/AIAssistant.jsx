import { useState, useRef, useEffect } from "react";
import { CHARACTERS } from "../assets/characters";

const THEMES = {
  BOLT:  { accent: "#5B9BD5", card: "#DDEAF7", text: "#1A3A5C", sub: "#4A7AA5" },
  ZARA:  { accent: "#B57ED5", card: "#EDD8F7", text: "#3A1A5C", sub: "#7A4AA5" },
  NOVA:  { accent: "#6BBF7A", card: "#D5EDDA", text: "#1A3A1C", sub: "#3A7A4A" },
  BEEP:  { accent: "#E8B84B", card: "#FAE8B8", text: "#3A2A00", sub: "#7A5A10" },
  ECHO:  { accent: "#E87B5A", card: "#F5D5C8", text: "#3A1200", sub: "#8A3A20" },
  MIRA:  { accent: "#4ABFBF", card: "#C8EAEA", text: "#003A3A", sub: "#1A6A6A" },
};

const SYSTEM_PROMPTS = {
  english: (name) => `You are ${name}, a friendly robot in VaakSiddhi, a speech therapy app for children. Help children practice pronunciation. Keep responses very short (1-2 sentences), simple, warm, child-friendly. Always encourage. Give tips on how to pronounce sounds when asked.`,
  hindi: (name) => `आप ${name} हैं, VaakSiddhi ऐप में एक दोस्ताना रोबोट। बच्चों को उच्चारण में मदद करें। जवाब बहुत छोटा (1-2 वाक्य) और बच्चों के अनुकूल रखें। हमेशा प्रोत्साहित करें।`,
  kannada: (name) => `ನೀವು ${name}, VaakSiddhi ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಸ್ನೇಹಪರ ರೋಬೋಟ್. ಮಕ್ಕಳಿಗೆ ಉಚ್ಚಾರಣೆಯಲ್ಲಿ ಸಹಾಯ ಮಾಡಿ. ಉತ್ತರ ತುಂಬಾ ಚಿಕ್ಕದಾಗಿ (1-2 ವಾಕ್ಯ) ಇರಲಿ.`,
};

const GREETINGS = {
  english: (name) => `Hi! I'm ${name}! 👋 Ask me anything about words or sounds!`,
  hindi: (name) => `नमस्ते! मैं ${name} हूँ! 👋 शब्दों के बारे में कुछ भी पूछो!`,
  kannada: (name) => `ನಮಸ್ಕಾರ! ನಾನು ${name}! 👋 ಪದಗಳ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ!`,
};

const PLACEHOLDERS = {
  english: "Ask me anything...",
  hindi: "कुछ पूछें...",
  kannada: "ಏನಾದರೂ ಕೇಳಿ...",
};

export default function AIAssistant({ character, language, currentScreen, wordData }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const th = THEMES[character] || THEMES.BOLT;
  const char = CHARACTERS[character];

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: (GREETINGS[language] || GREETINGS.english)(char?.name) }]);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (currentScreen === "language_select") return null;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const context = wordData ? `The child is practicing the word: "${wordData.word}". ` : "";
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 150,
          system: context + (SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.english)(char?.name),
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "...";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Try again 😊" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: "80px", right: "16px", zIndex: 99,
          width: "300px", height: "420px",
          background: "rgba(255,255,255,0.97)", borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)", backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          border: `1.5px solid ${th.accent}33`,
        }}>
          <div style={{ background: th.accent, padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={char?.image} alt={character} style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.9rem", color: "#fff", flex: 1 }}>{char?.name}</span>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "26px", height: "26px", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <img src={char?.image} alt="" style={{ width: "24px", height: "24px", objectFit: "contain", marginRight: "6px", alignSelf: "flex-end" }} />
                )}
                <div style={{
                  background: msg.role === "user" ? th.accent : th.card,
                  color: msg.role === "user" ? "#fff" : th.text,
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "8px 12px", maxWidth: "200px",
                  fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.5,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <img src={char?.image} alt="" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                <div style={{ background: th.card, borderRadius: "16px 16px 16px 4px", padding: "8px 14px" }}>
                  <span style={{ color: th.sub, fontSize: "1rem" }}>···</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "10px 12px", borderTop: `1px solid ${th.accent}22`, display: "flex", gap: "8px" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={PLACEHOLDERS[language] || PLACEHOLDERS.english}
              style={{ flex: 1, border: `1.5px solid ${th.accent}44`, borderRadius: "10px", padding: "8px 12px", fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", outline: "none", color: th.text, background: "rgba(255,255,255,0.8)" }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              background: th.accent, border: "none", borderRadius: "10px",
              width: "36px", height: "36px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: loading || !input.trim() ? 0.5 : 1,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", bottom: "20px", right: "16px", zIndex: 100,
        width: "56px", height: "56px", borderRadius: "50%",
        background: open ? th.accent : "rgba(255,255,255,0.95)",
        border: `2px solid ${th.accent}`,
        boxShadow: `0 4px 16px ${th.accent}44`,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s",
      }}>
        <img src={char?.image} alt={character} style={{ width: "40px", height: "40px", objectFit: "contain", filter: open ? "brightness(0) invert(1)" : "none", transition: "filter 0.3s" }} />
      </button>
    </>
  );
}
