import { useState, useEffect } from "react";
import { getSurface } from "../utils/themes";

const BACKEND_URL = "http://localhost:7860";

export default function ProgressWidget({ childId, theme, darkMode, onOpenFull }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!childId) return;
    fetch(`${BACKEND_URL}/progress/${childId}?days=7`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setProgress(data); })
      .catch(() => {});
  }, [childId]);

  if (!progress || progress.total_words === 0) return null;

  return (
    <div
      onClick={onOpenFull}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: getSurface(darkMode, 0.85), border: `1.5px solid ${theme.accent}33`,
        borderRadius: "16px", padding: "12px 16px", marginBottom: "16px",
        cursor: "pointer", transition: "transform 0.15s ease",
      }}
      className="btn-press"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: theme.accent, margin: 0 }}>
            🔥 {progress.streak}
          </p>
          <p style={{ fontSize: "0.6rem", color: theme.sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            day streak
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: theme.text, margin: 0 }}>
            {progress.accuracy}%
          </p>
          <p style={{ fontSize: "0.6rem", color: theme.sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            accuracy (7d)
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: theme.text, margin: 0 }}>
            {progress.total_words}
          </p>
          <p style={{ fontSize: "0.6rem", color: theme.sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            words (7d)
          </p>
        </div>
      </div>
      <span style={{ color: theme.sub, fontSize: "1rem" }}>›</span>
    </div>
  );
}
