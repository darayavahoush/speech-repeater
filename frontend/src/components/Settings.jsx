import { useState } from "react";
import { getTheme, getSurface } from "../utils/themes";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

export default function Settings({ childId, childName, childEmail, darkMode, onBack, onEmailChanged, onNeedsEmailVerification, onAccountDeleted }) {
  const theme = getTheme("BOLT", darkMode); // neutral palette; character isn't relevant here
  const textColor = darkMode ? "#F0DCCF" : "#3A2E2C";
  const labelColor = darkMode ? "#B08F7A" : "#9A7A6A";

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "12px",
    border: "2px solid rgba(0,0,0,0.08)", fontSize: "0.95rem",
    fontFamily: "Nunito, sans-serif", marginBottom: "12px",
    outline: "none", boxSizing: "border-box",
    color: darkMode ? "#F0DCCF" : "#2C2C2A", background: getSurface(darkMode, 1),
  };

  const cardStyle = {
    background: getSurface(darkMode, 0.9), borderRadius: "18px",
    padding: "20px", marginBottom: "20px",
    border: `1.5px solid ${theme.accent}33`,
  };

  const handleChangeEmail = async () => {
    setEmailError("");
    setEmailSuccess("");
    if (!newEmail.trim() || !emailPassword.trim()) {
      setEmailError("Enter your new email and current password.");
      return;
    }
    setEmailLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/change-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: childId, new_email: newEmail.trim(), password: emailPassword }),
      });
      const data = await res.json();
      if (data.success) {
        onEmailChanged(data.email);
        setNewEmail("");
        setEmailPassword("");
        if (data.needs_verification) {
          onNeedsEmailVerification(data.email, childName);
        } else {
          setEmailSuccess("Email updated.");
        }
      } else {
        setEmailError(data.error || "Could not update email.");
      }
    } catch {
      setEmailError("Could not connect. Please check your internet and try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm.');
      return;
    }
    if (!deletePassword.trim()) {
      setDeleteError("Enter your password to confirm.");
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/delete-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: childId, password: deletePassword }),
      });
      const data = await res.json();
      if (data.success) {
        onAccountDeleted();
      } else {
        setDeleteError(data.error || "Could not delete account.");
      }
    } catch {
      setDeleteError("Could not connect. Please check your internet and try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px 20px 100px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={onBack} className="btn-press" style={{ background: getSurface(darkMode, 0.9), border: `1.5px solid ${theme.accent}44`, borderRadius: "12px", width: "40px", height: "40px", fontSize: "1.1rem", cursor: "pointer", color: theme.text }}>
            ←
          </button>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: theme.text, margin: 0 }}>
            Settings
          </h1>
        </div>

        <div style={cardStyle}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: textColor, margin: "0 0 4px 0" }}>Change email</p>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: labelColor, margin: "0 0 14px 0" }}>
            Current: <strong style={{ color: textColor }}>{childEmail || "—"}</strong>
          </p>

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: labelColor, marginBottom: "6px" }}>New email</label>
          <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="you@example.com" type="email" style={inputStyle} />

          <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: labelColor, marginBottom: "6px" }}>Current password</label>
          <input value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} type="password" style={{ ...inputStyle, marginBottom: "8px" }} />

          {emailError && (
            <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>{emailError}</p>
          )}
          {emailSuccess && (
            <p style={{ color: "#6BBF7A", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>{emailSuccess}</p>
          )}

          <button
            onClick={handleChangeEmail}
            disabled={emailLoading}
            style={{
              width: "100%", padding: "13px", marginTop: "14px",
              background: "#E8825A", color: "#fff", border: "none",
              borderRadius: "12px", fontFamily: "Nunito, sans-serif",
              fontSize: "0.9rem", fontWeight: 900, cursor: emailLoading ? "not-allowed" : "pointer",
              opacity: emailLoading ? 0.7 : 1,
            }}
          >
            {emailLoading ? "..." : "Update email"}
          </button>
        </div>

        <div style={{ ...cardStyle, border: "1.5px solid #E0555533" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#E05555", margin: "0 0 4px 0" }}>Delete account</p>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: labelColor, margin: "0 0 14px 0" }}>
            This permanently deletes the account and all practice history. This can't be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                width: "100%", padding: "13px",
                background: "transparent", color: "#E05555", border: "2px solid #E0555555",
                borderRadius: "12px", fontFamily: "Nunito, sans-serif",
                fontSize: "0.9rem", fontWeight: 900, cursor: "pointer",
              }}
            >
              Delete my account
            </button>
          ) : (
            <>
              <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: labelColor, marginBottom: "6px" }}>
                Type DELETE to confirm
              </label>
              <input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="DELETE" style={inputStyle} />

              <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: labelColor, marginBottom: "6px" }}>Password</label>
              <input value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} type="password" style={{ ...inputStyle, marginBottom: "8px" }} />

              {deleteError && (
                <p style={{ color: "#E05555", fontSize: "0.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, margin: "6px 0 0 0" }}>{deleteError}</p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); setDeletePassword(""); setDeleteError(""); }}
                  style={{
                    flex: 1, padding: "13px",
                    background: "transparent", color: textColor, border: "2px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px", fontFamily: "Nunito, sans-serif",
                    fontSize: "0.9rem", fontWeight: 800, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  style={{
                    flex: 1, padding: "13px",
                    background: "#E05555", color: "#fff", border: "none",
                    borderRadius: "12px", fontFamily: "Nunito, sans-serif",
                    fontSize: "0.9rem", fontWeight: 900, cursor: deleteLoading ? "not-allowed" : "pointer",
                    opacity: deleteLoading ? 0.7 : 1,
                  }}
                >
                  {deleteLoading ? "..." : "Confirm delete"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
