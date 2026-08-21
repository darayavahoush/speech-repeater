import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

// Three steps: enter number -> enter the SMS code -> (new numbers only)
// give a name, since Twilio Verify confirms the number but knows nothing
// about who it belongs to.
export default function PhoneAuth({ onAuthed, onGoBack, darkMode }) {
  const [step, setStep] = useState("mobile"); // mobile | code | name
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const sendCode = async () => {
    setError("");
    if (!mobile.trim()) {
      setError("Please enter your mobile number, with country code (e.g. +91 98765 43210).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/send-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("code");
      } else {
        setError(data.error || "Could not send the verification code.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (nameOverride) => {
    setError("");
    if (!code.trim() || code.trim().length < 4) {
      setError("Enter the code we texted you.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile.trim(),
          code: code.trim(),
          name: nameOverride ?? (name.trim() || undefined),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onAuthed(data, data.is_new);
      } else if (data.needs_name) {
        setStep("name");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitName = () => {
    setError("");
    if (!name.trim()) {
      setError("Please tell us what to call you.");
      return;
    }
    verifyCode(name.trim());
  };

  const resend = async () => {
    setError("");
    setResending(true);
    setResent(false);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/send-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim() }),
      });
      const data = await res.json();
      if (data.success) setResent(true);
      else setError(data.error || "Could not resend code.");
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setResending(false);
    }
  };

  const bgGradient = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const textColor = darkMode ? "#F0DCCF" : "#3A2E2C";
  const labelColor = darkMode ? "#B08F7A" : "#9A7A6A";
  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "14px",
    border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
    fontFamily: "Nunito, sans-serif", marginBottom: "8px",
    outline: "none", boxSizing: "border-box", caretColor: "#E8825A",
    color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
  };
  const buttonStyle = (disabled) => ({
    width: "100%", padding: "16px", marginTop: "20px",
    background: "#E8825A", color: "#fff", border: "none",
    borderRadius: "14px", fontFamily: "Nunito, sans-serif",
    fontSize: "1rem", fontWeight: 900, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  });

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src={logo} alt="Vaakify" style={{ width: "64px", height: "64px", objectFit: "contain", marginBottom: "10px", display: "block", marginLeft: "auto", marginRight: "auto" }} />
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.9rem", fontWeight: 900, color: textColor, margin: "0 0 8px 0" }}>
            {step === "mobile" && "Sign in with phone"}
            {step === "code" && "Enter the code"}
            {step === "name" && "Almost there"}
          </h1>
          {step === "code" && (
            <p style={{ color: labelColor, fontSize: "0.85rem", margin: 0, fontFamily: "Nunito, sans-serif" }}>
              We texted a code to <strong style={{ color: textColor }}>{mobile}</strong>
            </p>
          )}
          {step === "name" && (
            <p style={{ color: labelColor, fontSize: "0.85rem", margin: 0, fontFamily: "Nunito, sans-serif" }}>
              This number is new to us — what should we call you?
            </p>
          )}
        </div>

        <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          {step === "mobile" && (
            <>
              <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>
                Mobile number
              </label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^\d+\s]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && sendCode()}
                placeholder="+91 98765 43210"
                type="tel"
                style={inputStyle}
              />
            </>
          )}

          {step === "code" && (
            <>
              <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>
                Verification code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                placeholder="000000"
                inputMode="numeric"
                style={{ ...inputStyle, fontSize: "1.5rem", fontFamily: "JetBrains Mono, monospace", textAlign: "center", letterSpacing: "0.4em" }}
              />
              {resent && !error && (
                <p style={{ color: "#6BBF7A", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>
                  A new code has been sent!
                </p>
              )}
            </>
          )}

          {step === "name" && (
            <>
              <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitName()}
                placeholder="e.g. Priya Sharma"
                style={inputStyle}
              />
            </>
          )}

          {error && (
            <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>
              {error}
            </p>
          )}

          {step === "mobile" && (
            <button onClick={sendCode} disabled={loading} style={buttonStyle(loading)}>
              {loading ? "..." : "Send code →"}
            </button>
          )}
          {step === "code" && (
            <>
              <button onClick={() => verifyCode()} disabled={loading} style={buttonStyle(loading)}>
                {loading ? "..." : "Verify →"}
              </button>
              <button
                onClick={resend}
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
            </>
          )}
          {step === "name" && (
            <button onClick={submitName} disabled={loading} style={buttonStyle(loading)}>
              {loading ? "..." : "Continue →"}
            </button>
          )}

          <button
            onClick={onGoBack}
            style={{
              display: "block", margin: "12px auto 0 auto", background: "none",
              border: "none", color: labelColor, fontSize: "0.8rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "Nunito, sans-serif",
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
