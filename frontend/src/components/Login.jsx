import { useState } from "react";
import CharacterBackdrop from "./CharacterBackdrop";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || !pin.trim()) {
      setError("Please enter your name and PIN.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), pin: pin.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const bgGradient = "linear-gradient(160deg, #FDEDEA 0%, #FDF3DD 30%, #FBFAE0 55%, #E9F6EA 75%, #E2F5F2 100%)";

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: "380px", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🗣️</div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.2rem", fontWeight: 900, color: "#3A2E2C", margin: "0 0 8px 0" }}>
            VaakSiddhi
          </h1>
          <p style={{ color: "#E8825A", fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>
            What's your name?
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#9A7A6A", marginBottom: "6px" }}>
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your name"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "14px",
              border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
              fontFamily: "Nunito, sans-serif", marginBottom: "18px",
              outline: "none", boxSizing: "border-box",
            }}
          />

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#9A7A6A", marginBottom: "6px" }}>
            PIN (3-8 numbers)
          </label>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="••••"
            type="password"
            inputMode="numeric"
            maxLength={8}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "14px",
              border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
              fontFamily: "Nunito, sans-serif", marginBottom: "8px",
              outline: "none", boxSizing: "border-box", letterSpacing: "0.3em",
            }}
          />

          {error && (
            <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "16px", marginTop: "20px",
              background: "#E8825A", color: "#fff", border: "none",
              borderRadius: "14px", fontFamily: "Nunito, sans-serif",
              fontSize: "1rem", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "..." : "Let's go! 🚀"}
          </button>

          <p style={{ fontSize: "0.7rem", color: "#9A7A6A", textAlign: "center", marginTop: "14px", fontFamily: "Nunito, sans-serif" }}>
            New here? Just enter a name and pick any PIN — we'll remember you next time!
          </p>
        </div>
      </div>
    </div>
  );
}
