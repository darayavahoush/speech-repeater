export default function AboutSection() {
  return (
    <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(24px, 6vw, 40px) clamp(18px, 5vw, 32px) clamp(48px, 10vw, 80px)" }}>
      <div style={{
        maxWidth: "760px", margin: "0 auto", textAlign: "center",
        background: "rgba(255,255,255,0.6)", borderRadius: "24px",
        padding: "clamp(28px, 6vw, 48px) clamp(20px, 5vw, 40px)",
        border: "1.5px solid rgba(0,0,0,0.06)",
      }}>
        <p style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.75rem",
          letterSpacing: "0.12em", color: "#E8825A", marginBottom: "14px", textTransform: "uppercase",
        }}>
          Why we built this
        </p>
        <h2 style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 5vw, 2rem)",
          color: "#2A211D", margin: "0 0 18px 0", lineHeight: 1.25,
        }}>
          Speech practice shouldn't feel like a chore, or run out of patience.
        </h2>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "#5A4A42",
          lineHeight: 1.7, margin: 0,
        }}>
          Kids working on speech, especially neurodivergent kids, often need practice that's
          repetitive, precise, and endlessly patient — three things that are hard to sustain in
          a busy household or a once-a-week therapy session. Vaakify was built to fill the gaps
          between sessions: a companion that listens for the exact sound, not just the word, and
          never gets tired of trying again.
        </p>
      </div>
    </section>
  );
}
