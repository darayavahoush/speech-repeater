import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";

export default function Paywall({ name, darkMode }) {
  const bgGradient = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const textColor = darkMode ? "#F0DCCF" : "#3A2E2C";
  const labelColor = darkMode ? "#B08F7A" : "#9A7A6A";

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
        <img src={logo} alt="Vaakify" style={{ width: "64px", height: "64px", objectFit: "contain", margin: "0 auto 16px" }} />
        <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.8rem", color: textColor, margin: "0 0 10px 0" }}>
          {name ? `${name}'s free trial has ended` : "Your free trial has ended"}
        </h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: labelColor, lineHeight: 1.6, margin: "0 0 32px 0" }}>
          We hope Vaakify has been helpful! Subscribe to keep practicing with your friend.
        </p>

        <div style={{ background: getSurface(darkMode, 0.9), borderRadius: "22px", padding: "32px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.2rem", color: "#E8825A", margin: "0 0 4px 0" }}>
            Coming soon
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: labelColor, margin: "0 0 24px 0" }}>
            Payment is not yet available — we're setting this up. Check back shortly, or reach out if you'd like early access.
          </p>
          <button
            disabled
            style={{
              width: "100%", padding: "16px", background: "rgba(0,0,0,0.1)",
              color: labelColor, border: "none", borderRadius: "14px",
              fontFamily: "Nunito, sans-serif", fontSize: "1rem", fontWeight: 900,
              cursor: "not-allowed",
            }}
          >
            Subscribe (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}
