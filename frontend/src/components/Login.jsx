import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";

const BACKEND_URL = "http://localhost:7860";

export default function Login({ onLogin, onGoToSignup, darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data, false);
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
          <img src={logo} alt="Vaakify" style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "12px", display: "block", marginLeft: "auto", marginRight: "auto" }} />
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.2rem", fontWeight: 900, color: textColor, margin: "0 0 8px 0" }}>
            Vaakify
          </h1>
          <p style={{ color: "#E8825A", fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>
            Welcome back
          </p>
        </div>

        <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: darkMode ? "#B08F7A" : "#9A7A6A", marginBottom: "6px" }}>
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="you@example.com"
            type="email"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "14px",
              border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
              fontFamily: "Nunito, sans-serif", marginBottom: "18px",
              outline: "none", boxSizing: "border-box",
              color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
            }}
          />

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: darkMode ? "#B08F7A" : "#9A7A6A", marginBottom: "6px" }}>
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="••••••••"
            type="password"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "14px",
              border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
              fontFamily: "Nunito, sans-serif", marginBottom: "8px",
              outline: "none", boxSizing: "border-box",
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
            {loading ? "..." : "Sign in →"}
          </button>

          <p style={{ fontSize: "0.8rem", color: darkMode ? "#B08F7A" : "#9A7A6A", textAlign: "center", marginTop: "16px", fontFamily: "Nunito, sans-serif" }}>
            New to Vaakify?{" "}
            <button onClick={onGoToSignup} style={{ background: "none", border: "none", color: "#E8825A", fontWeight: 800, cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", padding: 0 }}>
              Start your free trial
            </button>
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
