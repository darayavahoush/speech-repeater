import { useState } from "react";
import { LIGHT_THEMES, DARK_THEMES, getSurface } from "../utils/themes";
import logo from "../assets/images/logo.png";

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "₹199",
    period: "/month",
    tagline: "Flexible, cancel anytime",
    features: ["Full access to all languages", "All characters unlocked", "Progress tracking"],
    highlight: false,
  },
  {
    id: "annual",
    label: "Annual",
    price: "₹1,599",
    period: "/year",
    tagline: "Best value — save 33%",
    features: ["Everything in Monthly", "2 months free", "Priority support"],
    highlight: true,
  },
];

export default function Paywall({ name, darkMode, onBack }) {
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [loading, setLoading] = useState(false);

  const bgGradient = darkMode ? DARK_THEMES.DEFAULT.bgGradient : LIGHT_THEMES.DEFAULT.bgGradient;
  const textColor = darkMode ? "#F0DCCF" : "#3A2E2C";
  const labelColor = darkMode ? "#B08F7A" : "#9A7A6A";

  const handleSubscribe = async (planId) => {
    setLoading(true);
    // TODO: wire in real payment gateway here (Razorpay/Stripe/etc).
    // This is the single integration point — call the gateway's checkout
    // for `planId`, then on success hit your backend to mark the account
    // as subscribed (e.g. POST /billing/confirm with planId + payment ref).
    console.log("Subscribe clicked for plan:", planId);
    await new Promise((r) => setTimeout(r, 600)); // placeholder delay
    alert(`Payment integration coming soon! Selected plan: ${PLANS.find(p => p.id === planId).label}`);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", position: "relative" }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute", top: "24px", left: "24px",
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.85rem",
            color: labelColor,
          }}
        >
          ← Back
        </button>
      )}

      <div style={{ width: "100%", maxWidth: "960px" }}>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px auto" }}>
            <img src={logo} alt="Vaakify" style={{ width: "150%", height: "150%", objectFit: "contain" }} />
          </div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.9rem", fontWeight: 900, color: textColor, margin: "0 0 8px 0" }}>
            {name ? `${name}'s free trial has ended` : "Choose your plan"}
          </h1>
          <p style={{ color: labelColor, fontSize: "0.95rem", margin: 0, fontFamily: "Nunito, sans-serif" }}>
            Choose a plan to keep practicing
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  flex: "1 1 260px",
                  maxWidth: "300px",
                  background: getSurface(darkMode, 0.9),
                  borderRadius: "22px",
                  padding: "28px 24px",
                  boxShadow: plan.highlight
                    ? "0 8px 32px rgba(232,130,90,0.28)"
                    : "0 4px 24px rgba(0,0,0,0.08)",
                  border: isSelected ? "2.5px solid #E8825A" : "2.5px solid transparent",
                  cursor: "pointer",
                  position: "relative",
                  transition: "border 0.2s ease, transform 0.2s ease",
                  transform: isSelected ? "translateY(-4px)" : "none",
                }}
              >
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: "#E8825A", color: "#fff", fontSize: "0.7rem", fontWeight: 900,
                    padding: "4px 14px", borderRadius: "999px", fontFamily: "Nunito, sans-serif",
                    letterSpacing: "0.03em",
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: textColor, margin: "8px 0 4px 0" }}>
                  {plan.label}
                </h2>
                <p style={{ color: labelColor, fontSize: "0.8rem", margin: "0 0 16px 0", fontFamily: "Nunito, sans-serif" }}>
                  {plan.tagline}
                </p>

                <div style={{ marginBottom: "18px" }}>
                  <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: textColor }}>
                    {plan.price}
                  </span>
                  <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.9rem", color: labelColor }}>
                    {plan.period}
                  </span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px 0" }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{
                      fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", color: textColor,
                      marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px",
                    }}>
                      <span style={{ color: "#6BBF7A", fontWeight: 900 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => { e.stopPropagation(); handleSubscribe(plan.id); }}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "14px", background: isSelected ? "#E8825A" : getSurface(darkMode, 1),
                    color: isSelected ? "#fff" : textColor, border: isSelected ? "none" : "2px solid rgba(0,0,0,0.08)",
                    borderRadius: "14px", fontFamily: "Nunito, sans-serif", fontSize: "0.9rem", fontWeight: 900,
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "..." : isSelected ? "Continue →" : "Select"}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", color: labelColor, fontSize: "0.75rem", marginTop: "28px", fontFamily: "Nunito, sans-serif" }}>
          Cancel anytime. Secure payment powered by [gateway coming soon].
        </p>
      </div>
    </div>
  );
}
