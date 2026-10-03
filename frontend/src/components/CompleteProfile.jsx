import { useState, useEffect } from "react";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";
import { API_BASE } from "../utils/config";

const BACKEND_URL = API_BASE;

async function post(path, body) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * Shown right after sign-in when the account is missing something: a verified
 * phone number (Google / older email accounts) or an email (phone-only accounts).
 * Each missing item is a two-step "enter it, then enter the code we sent" flow.
 *
 * props: name, token, needsMobile, needsEmail, onUpdated(authResponse), onLogout, darkMode
 * onUpdated receives the fresh sign-in response after each item is verified; the
 * parent decides what to show next (this screen again, or the app).
 */
export default function CompleteProfile({ name, token, needsMobile, needsEmail, onUpdated, onLogout, darkMode }) {
  const kind = needsMobile ? "mobile" : "email";
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // The parent renders this with key={kind}, so moving from the phone step to the
  // email step (or back) remounts it with clean state.

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const bg = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const textColor = darkMode ? "#F0DCCF" : "#3A2E2C";
  const labelColor = darkMode ? "#B08F7A" : "#9A7A6A";
  const font = "Nunito, sans-serif";
  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "14px", border: "2px solid rgba(0,0,0,0.08)",
    fontSize: "1rem", fontFamily: font, marginBottom: "12px", outline: "none", boxSizing: "border-box",
    caretColor: "#E8825A", color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
  };
  const primary = {
    width: "100%", padding: "16px", marginTop: "8px", background: "#E8825A", color: "#fff", border: "none",
    borderRadius: "14px", fontFamily: font, fontSize: "1rem", fontWeight: 900,
    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
  };
  const link = { background: "none", border: "none", fontFamily: font, fontSize: "0.82rem", fontWeight: 800, cursor: "pointer", padding: 0 };

  const send = async () => {
    setError("");
    if (!value.trim()) {
      setError(kind === "mobile" ? "Please enter your mobile number." : "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const data = await post(`/auth/profile/${kind}/send`, { token, [kind]: value.trim() });
      if (data.success && data.done) { onUpdated(data); return; } // phone verification switched off server-side
      if (data.success) {
        setSentTo(data.mobile || value.trim());
        setSent(true);
        setCooldown(30);
      } else if (data.expired) {
        onLogout();
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setError("");
    if (code.trim().length < 4) { setError("Please enter the code we sent you."); return; }
    setLoading(true);
    try {
      const data = await post(`/auth/profile/${kind}/verify`, { token, [kind]: sentTo || value.trim(), code: code.trim() });
      if (data.success) onUpdated(data);
      else if (data.expired) onLogout();
      else setError(data.error || "Incorrect or expired code.");
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const title = kind === "mobile" ? "Add your phone number" : "Add your email";
  const blurb = kind === "mobile"
    ? "Every account needs a verified phone number. We'll text you a code."
    : "Every account needs an email address. We'll email you a code.";

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img src={logo} alt="Vaakify" style={{ width: "56px", height: "56px", objectFit: "contain", marginBottom: "10px" }} />
          <h1 style={{ fontFamily: font, fontSize: "1.7rem", fontWeight: 900, color: textColor, margin: "0 0 8px 0" }}>{title}</h1>
          <p style={{ fontFamily: font, fontSize: "0.88rem", color: labelColor, margin: 0 }}>
            {name ? `Hi ${name}! ` : ""}{blurb}
          </p>
          {needsMobile && needsEmail && (
            <p style={{ fontFamily: font, fontSize: "0.75rem", color: labelColor, margin: "8px 0 0 0" }}>Step 1 of 2</p>
          )}
        </div>

        <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          {!sent ? (
            <>
              <label style={{ display: "block", fontFamily: font, fontWeight: 700, fontSize: "0.8rem", color: labelColor, marginBottom: "6px" }}>
                {kind === "mobile" ? "Mobile number" : "Email"}
              </label>
              <input
                value={value}
                onChange={(e) => setValue(kind === "mobile" ? e.target.value.replace(/[^\d+\s]/g, "") : e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                type={kind === "mobile" ? "tel" : "email"}
                autoFocus
                placeholder={kind === "mobile" ? "+91 98765 43210" : "you@example.com"}
                style={inputStyle}
              />
              {error && <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: font, fontWeight: 700, margin: "0 0 4px 0" }}>{error}</p>}
              <button onClick={send} disabled={loading} style={primary}>{loading ? "..." : "Send code"}</button>
            </>
          ) : (
            <>
              <p style={{ fontFamily: font, fontSize: "0.85rem", color: labelColor, margin: "0 0 12px 0" }}>
                We sent a code to <strong>{sentTo}</strong>
              </p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                onKeyDown={(e) => e.key === "Enter" && verify()}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="123456"
                style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.3em", fontSize: "1.3rem", fontWeight: 800 }}
              />
              {error && <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: font, fontWeight: 700, margin: "0 0 4px 0" }}>{error}</p>}
              <button onClick={verify} disabled={loading} style={primary}>{loading ? "..." : "Verify"}</button>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px" }}>
                <button onClick={() => { setSent(false); setCode(""); setError(""); }} style={{ ...link, color: labelColor }}>
                  ← Change {kind === "mobile" ? "number" : "email"}
                </button>
                <button
                  onClick={send}
                  disabled={loading || cooldown > 0}
                  style={{ ...link, color: "#E8825A", opacity: cooldown > 0 ? 0.5 : 1, cursor: cooldown > 0 ? "default" : "pointer" }}
                >
                  {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
                </button>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "18px" }}>
          <button onClick={onLogout} style={{ ...link, color: labelColor, textDecoration: "underline" }}>Not you? Log out</button>
        </p>
      </div>
    </div>
  );
}
