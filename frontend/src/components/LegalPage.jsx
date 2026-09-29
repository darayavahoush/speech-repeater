import { LEGAL, CONTACT_EMAIL, EFFECTIVE_DATE, LAST_UPDATED } from "../utils/legalContent";

const RAINBOW_GRADIENT = "linear-gradient(160deg, #FDEDEA 0%, #FDF3DD 30%, #FBFAE0 55%, #E9F6EA 75%, #E2F5F2 100%)";
const h2 = { fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#2A211D", margin: "0 0 8px 0" };
const p = { fontFamily: "Inter, sans-serif", fontSize: "0.92rem", color: "#5A4A42", lineHeight: 1.7, margin: "0 0 10px 0" };

export default function LegalPage({ type, onBack }) {
  const doc = LEGAL[type === "privacy" ? "privacy" : "terms"];
  const isPrivacy = type === "privacy";

  return (
    <div style={{ minHeight: "100vh", background: RAINBOW_GRADIENT, fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "clamp(24px, 6vw, 48px) clamp(18px, 5vw, 32px) 80px" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#3A2E2C", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "Inter, sans-serif", marginBottom: "28px", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>
            ← Back
          </button>
        )}

        <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 6vw, 2.4rem)", color: "#2A211D", margin: "0 0 8px 0" }}>
          {doc.title}
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#9A7A6A", margin: "0 0 20px 0" }}>
          Effective date: {EFFECTIVE_DATE} · Last updated: {LAST_UPDATED}
        </p>
        <p style={{ ...p, marginBottom: "32px" }}>{doc.intro}</p>

        {doc.sections.map((s) => (
          <div key={s.title} style={{ marginBottom: "28px" }}>
            <h2 style={h2}>{s.title}</h2>
            {s.paras.map((t, i) => <p key={i} style={p}>{t}</p>)}
            {s.list && (
              <ul style={{ ...p, paddingLeft: "20px" }}>
                {s.list.map((li, i) => <li key={i} style={{ marginBottom: "6px" }}>{li}</li>)}
              </ul>
            )}
            {s.after && <p style={p}>{s.after}</p>}
          </div>
        ))}

        <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1.5px solid rgba(0,0,0,0.08)" }}>
          <h2 style={h2}>Contact</h2>
          <p style={p}>
            Questions about this {isPrivacy ? "policy" : "agreement"}? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#B5573A" }}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
