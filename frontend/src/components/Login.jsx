import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";
import GoogleAuthButton from "./GoogleAuthButton";
import { API_BASE } from "../utils/config";

const BACKEND_URL = API_BASE;

export default function Login({ onLogin, onNeedsVerification, onGoToSignup, onGoToPhoneAuth, onBack, prefillEmail = "", darkMode }) {
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | forgot-email | forgot-reset
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");

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
      if (data.needs_verification && onNeedsVerification) {
        onNeedsVerification(data.email || email.trim(), data.name);
      } else if (data.success) {
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

  const goForgot = () => { setError(""); setInfo(""); setCode(""); setNewPassword(""); setMode("forgot-email"); };
  const backToLogin = () => { setError(""); setInfo(""); setMode("login"); };

  const sendResetCode = async () => {
    setError(""); setInfo("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setInfo("If an account exists for that email, we've sent a 6-digit code.");
        setMode("forgot-reset");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async () => {
    setError("");
    if (code.trim().length !== 6) { setError("Please enter the 6-digit code from your email."); return; }
    if (newPassword.length < 6) { setError("Password should be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim(), new_password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPassword(""); setCode(""); setNewPassword("");
        setInfo("Password updated. Sign in with your new password.");
        setMode("login");
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

  if (mode !== "login") {
    const labelStyle = { display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: darkMode ? "#B08F7A" : "#9A7A6A", marginBottom: "6px" };
    const inputStyle = {
      width: "100%", padding: "14px 16px", borderRadius: "14px",
      border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
      fontFamily: "Nunito, sans-serif", marginBottom: "18px",
      outline: "none", boxSizing: "border-box", caretColor: "#E8825A",
      color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
    };
    const linkBtn = { background: "none", border: "none", color: "#E8825A", fontWeight: 800, cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", padding: 0 };
    const helpText = { fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", color: darkMode ? "#B08F7A" : "#9A7A6A", margin: "0 0 18px 0", lineHeight: 1.5 };
    const isEmailStep = mode === "forgot-email";
    return (
      <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <button onClick={isEmailStep ? backToLogin : () => { setError(""); setMode("forgot-email"); }} style={{ ...linkBtn, marginBottom: "16px" }}>
            ← {isEmailStep ? "Back to sign in" : "Use a different email"}
          </button>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <img src={logo} alt="Vaakify" style={{ width: "64px", height: "64px", objectFit: "contain", display: "block", margin: "0 auto 10px auto" }} />
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.7rem", fontWeight: 900, color: textColor, margin: 0 }}>
              {isEmailStep ? "Forgot your password?" : "Check your email"}
            </h1>
          </div>
          <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            {isEmailStep ? (
              <>
                <p style={helpText}>
                  Enter the email you signed up with and we'll send you a 6-digit code to set a new password.
                  If you signed up with Google or your phone, you can also just go back and use that button.
                </p>
                <label style={labelStyle}>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendResetCode()}
                  placeholder="you@example.com" type="email" autoFocus style={inputStyle} />
              </>
            ) : (
              <>
                <p style={helpText}>
                  We sent a code to <b>{email.trim()}</b>. It expires in 10 minutes. Can't see it? Check your spam folder.
                </p>
                <label style={labelStyle}>6-digit code</label>
                <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456" inputMode="numeric" autoComplete="one-time-code" autoFocus
                  style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center", fontWeight: 800 }} />
                <label style={labelStyle}>New password</label>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitReset()}
                  placeholder="At least 6 characters" type="password" autoComplete="new-password" style={inputStyle} />
              </>
            )}

            {info && <p style={{ color: "#3B9B6A", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "0 0 8px 0" }}>{info}</p>}
            {error && <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "0 0 8px 0" }}>{error}</p>}

            <button onClick={isEmailStep ? sendResetCode : submitReset} disabled={loading}
              style={{ width: "100%", padding: "16px", marginTop: "8px", background: "#E8825A", color: "#fff", border: "none", borderRadius: "14px", fontFamily: "Nunito, sans-serif", fontSize: "1rem", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : isEmailStep ? "Send code →" : "Set new password →"}
            </button>
            {!isEmailStep && (
              <p style={{ textAlign: "center", marginTop: "16px", marginBottom: 0, fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: darkMode ? "#B08F7A" : "#9A7A6A" }}>
                Didn't get it? <button onClick={sendResetCode} disabled={loading} style={{ ...linkBtn, fontSize: "0.8rem" }}>Resend code</button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: "380px", position: "relative", zIndex: 1 }}>

        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#E8825A", fontWeight: 800, cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: "0.9rem", padding: 0, marginBottom: "16px" }}>
            ← Switch account
          </button>
        )}
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
              outline: "none", boxSizing: "border-box", caretColor: "#E8825A",
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
            autoFocus={!!prefillEmail}
            type="password"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "14px",
              border: "2px solid rgba(0,0,0,0.08)", fontSize: "1rem",
              fontFamily: "Nunito, sans-serif", marginBottom: "8px",
              outline: "none", boxSizing: "border-box", caretColor: "#E8825A",
              color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
            }}
          />

          <div style={{ textAlign: "right", marginBottom: "4px" }}>
            <button onClick={goForgot} style={{ background: "none", border: "none", color: "#E8825A", fontWeight: 800, cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", padding: 0 }}>
              Forgot password?
            </button>
          </div>

          {info && (
            <p style={{ color: "#3B9B6A", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>
              {info}
            </p>
          )}

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

          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: darkMode ? "#B08F7A" : "#9A7A6A", fontFamily: "Nunito, sans-serif" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }} />
          </div>

          <GoogleAuthButton
            darkMode={darkMode}
            onSuccess={(data) => onLogin(data, data.is_new)}
            onError={setError}
          />

          <button
            onClick={onGoToPhoneAuth}
            style={{
              width: "100%", padding: "13px 16px", marginTop: "10px",
              background: "none", border: darkMode ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(0,0,0,0.1)",
              borderRadius: "14px", fontFamily: "Nunito, sans-serif", fontSize: "0.95rem",
              fontWeight: 800, color: darkMode ? "#F0DCCF" : "#2C2C2A", cursor: "pointer",
            }}
          >
            📱 Continue with phone
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
