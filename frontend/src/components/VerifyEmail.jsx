import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";

const BACKEND_URL = "http://localhost:7860";

export default function VerifyEmail({ email, name, onVerified, darkMode }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async () => {
    setError("");
    if (!code.trim() || code.trim().length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onVerified(data, true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    setResent(false);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setResent(true);
      } else {
        setError(data.error || "Could not resend code.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setResending(false);
    }
  };

  const bgGradient = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const textColor = darkMode ? "#F0DCCF" : "#3A2E2C";
  const labelColor = darkMode ? "#B08F7A" : "#9A7A6A";

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={logo} alt="Vaakify" style={{ width: "64px", height: "64px", objectFit: "contain", marginBottom: "10px", display: "block", marginLeft: "auto", marginRight: "auto" }} />
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.9rem", fontWeight: 900, color: textColor, margin: "0 0 8px 0" }}>
            Check your email
          </h1>
          <p style={{ color: labelColor, fontSize: "0.85rem", margin: 0, fontFamily: "Nunito, sans-serif" }}>
            {name ? `Hi ${name}! ` : ""}We sent a 6-digit code to<br /><strong style={{ color: textColor }}>{email}</strong>
          </p>
        </div>

        <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>
            Verification code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            placeholder="000000"
            inputMode="numeric"
            style={{
              width: "100%", padding: "16px", borderRadius: "14px",
              border: "2px solid rgba(0,0,0,0.08)", fontSize: "1.5rem",
              fontFamily: "JetBrains Mono, monospace", marginBottom: "8px",
              outline: "none", boxSizing: "border-box", textAlign: "center", letterSpacing: "0.4em",
              color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
            }}
          />

          {error && (
            <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>
              {error}
            </p>
          )}
          {resent && !error && (
            <p style={{ color: "#6BBF7A", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>
              A new code has been sent!
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            style={{
              width: "100%", padding: "16px", marginTop: "20px",
              background: "#E8825A", color: "#fff", border: "none",
              borderRadius: "14px", fontFamily: "Nunito, sans-serif",
              fontSize: "1rem", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "..." : "Verify →"}
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              display: "block", margin: "16px auto 0 auto", background: "none",
              border: "none", color: "#E8825A", fontSize: "0.8rem", fontWeight: 700,
              cursor: resending ? "not-allowed" : "pointer", fontFamily: "Nunito, sans-serif",
              textDecoration: "underline", opacity: resending ? 0.6 : 1,
            }}
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
