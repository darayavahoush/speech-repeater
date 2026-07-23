import { useState } from "react";

const STEPS = [
  {
    emoji: "🗣️",
    title: "Welcome to VaakSiddhi!",
    text: "This is a fun place to practice saying words with a friend by your side. Let's see how it works!",
  },
  {
    emoji: "🤖",
    title: "Pick a friend",
    text: "You picked a character friend to practice with — you can always switch to a different one from the side menu.",
  },
  {
    emoji: "👂",
    title: "Listen first",
    text: "Your friend will say the word out loud. You can listen as many times as you like — even slowly!",
  },
  {
    emoji: "🎤",
    title: "Now you try!",
    text: "Tap the microphone and say the word yourself. Don't worry about getting it perfect — just give it a try!",
  },
  {
    emoji: "⭐",
    title: "See how you did",
    text: "Your friend will cheer you on and show you your score. Every try helps you get better!",
  },
  {
    emoji: "💪",
    title: "Extra practice",
    text: "If a sound needs a bit more work, we'll do some extra practice together to help you master it.",
  },
];

export default function Tutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        width: "100%", maxWidth: "380px",
        background: "#fff", borderRadius: "24px",
        padding: "32px 28px 24px 28px",
        boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%",
            width: "30px", height: "30px", cursor: "pointer", fontSize: "0.9rem",
            color: "#888",
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{ fontSize: "3.2rem", marginBottom: "12px" }}>{current.emoji}</div>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.3rem", fontWeight: 900, color: "#2C2C2A", margin: "0 0 10px 0" }}>
            {current.title}
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.9rem", color: "#666", lineHeight: 1.6, margin: 0 }}>
            {current.text}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "6px", margin: "22px 0" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? "20px" : "7px", height: "7px", borderRadius: "4px",
              background: i === step ? "#E8825A" : "rgba(0,0,0,0.12)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              style={{
                flex: 1, padding: "14px", background: "transparent",
                border: "1.5px solid rgba(0,0,0,0.1)", borderRadius: "14px",
                fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.9rem",
                color: "#888", cursor: "pointer",
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
            style={{
              flex: 2, padding: "14px", background: "#E8825A", color: "#fff",
              border: "none", borderRadius: "14px", fontFamily: "Nunito, sans-serif",
              fontWeight: 900, fontSize: "0.9rem", cursor: "pointer",
            }}
          >
            {isLast ? "Let's start! 🚀" : "Next"}
          </button>
        </div>

        {!isLast && (
          <button
            onClick={onClose}
            style={{
              display: "block", margin: "14px auto 0 auto", background: "none",
              border: "none", color: "#aaa", fontSize: "0.75rem",
              fontFamily: "Nunito, sans-serif", cursor: "pointer", textDecoration: "underline",
            }}
          >
            Skip tutorial
          </button>
        )}
      </div>
    </div>
  );
}
