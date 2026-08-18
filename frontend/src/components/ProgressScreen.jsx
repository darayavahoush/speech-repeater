import { useState, useEffect } from "react";
import { getTheme, getSurface } from "../utils/themes";
import Spinner from "./Spinner";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";
const RANGE_OPTIONS = [7, 30, 90];

export default function ProgressScreen({ childId, character, darkMode, onBack }) {
  const [days, setDays] = useState(30);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = getTheme(character, darkMode);

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/progress/${childId}?days=${days}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setProgress(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [childId, days]);

  const maxTotal = progress?.daily?.length ? Math.max(...progress.daily.map((d) => d.total), 1) : 1;

  return (
    <div style={{ minHeight: "100vh", padding: "24px 20px 100px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={onBack} className="btn-press" style={{ background: getSurface(darkMode, 0.9), border: `1.5px solid ${theme.accent}44`, borderRadius: "12px", width: "40px", height: "40px", fontSize: "1.1rem", cursor: "pointer", color: theme.text }}>
            ←
          </button>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: theme.text, margin: 0 }}>
            Your Progress
          </h1>
        </div>

        {/* Range picker */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", background: theme.card, borderRadius: "14px", padding: "4px" }}>
          {RANGE_OPTIONS.map((d) => (
            <button key={d} onClick={() => setDays(d)} className="btn-press" style={{
              flex: 1, background: days === d ? getSurface(darkMode, 0.9) : "transparent",
              color: days === d ? theme.text : theme.sub, border: "none", borderRadius: "10px",
              padding: "10px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif",
            }}>
              {d} days
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <Spinner size={32} color={theme.accent} />
          </div>
        ) : !progress || progress.total_words === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: theme.sub, fontFamily: "Nunito, sans-serif" }}>
            <p style={{ fontSize: "2.5rem", margin: "0 0 12px 0" }}>🌱</p>
            <p style={{ fontWeight: 700 }}>No practice logged yet in this range.</p>
            <p style={{ fontSize: "0.85rem" }}>Practice a few words and check back!</p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
              {[
                { label: "Day streak", value: `🔥 ${progress.streak}` },
                { label: "Words practiced", value: progress.total_words },
                { label: "Accuracy", value: `${progress.accuracy}%` },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, background: getSurface(darkMode, 0.9), border: `1.5px solid ${theme.accent}33`, borderRadius: "16px", padding: "16px 10px", textAlign: "center" }}>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: theme.accent, margin: "0 0 4px 0" }}>{s.value}</p>
                  <p style={{ fontSize: "0.65rem", color: theme.sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Bar chart — words practiced per day, colored by accuracy */}
            <div style={{ background: getSurface(darkMode, 0.9), border: `1.5px solid ${theme.accent}33`, borderRadius: "18px", padding: "20px 16px" }}>
              <p style={{ fontSize: "0.7rem", color: theme.sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0" }}>
                Words practiced per day
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: days > 30 ? "2px" : "5px", height: "140px" }}>
                {progress.daily.map((d) => (
                  <div key={d.date} title={`${d.date}: ${d.total} words, ${d.accuracy}% accuracy`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{
                      width: "100%", maxWidth: "22px",
                      height: `${Math.max((d.total / maxTotal) * 100, 4)}%`,
                      background: d.accuracy >= 70 ? theme.accent : `${theme.accent}66`,
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.4s ease",
                    }} />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.65rem", color: theme.sub, margin: "10px 0 0 0", textAlign: "center" }}>
                Darker bars = 70%+ accuracy that day
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
