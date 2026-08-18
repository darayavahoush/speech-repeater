import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

export default function Signup({ onSignup, onGoToLogin, onSeePlans, darkMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          mobile: mobile.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSignup(data, true);
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
  const labelColor = darkMode ? "#B08F7A" : "#9A7A6A";
  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "14px",
    border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
    fontFamily: "Nunito, sans-serif", marginBottom: "16px",
    outline: "none", boxSizing: "border-box",
    color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
  };

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: "380px", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px auto" }}>
            <img src={logo} alt="Vaakify" style={{ width: "150%", height: "150%", objectFit: "contain" }} />
          </div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.9rem", fontWeight: 900, color: textColor, margin: "0 0 6px 0" }}>
            Start your free trial
          </h1>
          <p style={{ color: "#E8825A", fontSize: "0.85rem", fontWeight: 700, margin: "0 0 10px 0" }}>
            7 days free — no card required
          </p>
          {onSeePlans && (
            <button onClick={onSeePlans} style={{ background: "none", border: "none", color: labelColor, fontSize: "0.78rem", fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
              View plans & pricing
            </button>
          )}
        </div>

        <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" style={inputStyle} />

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" style={inputStyle} />

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>
            Mobile number <span style={{ opacity: 0.6, fontWeight: 500 }}>(optional for now)</span>
          </label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^\d+\s]/g, ""))} placeholder="+91 98765 43210" type="tel" style={inputStyle} />

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="At least 6 characters"
            type="password"
            style={{ ...inputStyle, marginBottom: "8px" }}
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
            {loading ? "..." : "Start free trial 🚀"}
          </button>

          <p style={{ fontSize: "0.8rem", color: labelColor, textAlign: "center", marginTop: "16px", fontFamily: "Nunito, sans-serif" }}>
            Already have an account?{" "}
            <button onClick={onGoToLogin} style={{ background: "none", border: "none", color: "#E8825A", fontWeight: 800, cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", padding: 0 }}>
              Sign in
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
