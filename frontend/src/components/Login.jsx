import { useState } from "react";
import CharacterBackdrop from "./CharacterBackdrop";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

export default function Login({ onLogin, darkMode }) {
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

  const bgGradient = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const textColor = darkMode ? "#F0DCCF" : "#3A2E2C";

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: "380px", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <img src={logo} alt="VaakSiddhi" style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "12px", display: "block", marginLeft: "auto", marginRight: "auto" }} />
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.2rem", fontWeight: 900, color: textColor, margin: "0 0 8px 0" }}>
            VaakSiddhi
          </h1>
          <p style={{ color: "#E8825A", fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>
            What's your name?
          </p>
        </div>

        <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: darkMode ? "#B08F7A" : "#9A7A6A", marginBottom: "6px" }}>
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
              color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
            }}
          />

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: darkMode ? "#B08F7A" : "#9A7A6A", marginBottom: "6px" }}>
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
              color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
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

          <p style={{ fontSize: "0.7rem", color: darkMode ? "#B08F7A" : "#9A7A6A", textAlign: "center", marginTop: "14px", fontFamily: "Nunito, sans-serif" }}>
            New here? Just enter a name and pick any PIN — we'll remember you next time!
          </p>
        </div>
      </div>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px ${darkMode ? "#241D19" : "#ffffff"} inset !important;
          -webkit-text-fill-color: ${darkMode ? "#F0DCCF" : "#2C2C2A"} !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
