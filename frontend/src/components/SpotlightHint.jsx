import { useState, useEffect, useRef } from "react";

/**
 * Interactive onboarding spotlight — highlights a real UI element by its
 * DOM id, with a pulsing ring + tooltip. Dismisses when the user taps the
 * highlighted element itself, or via the tooltip's skip button.
 *
 * steps: [{ targetId: string, text: string }]
 * onComplete: called when all steps are done or user skips
 */
export default function SpotlightHint({ steps, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const clickListenerRef = useRef(null);

  const current = steps[stepIndex];

  useEffect(() => {
    if (!current) {
      onComplete();
      return;
    }

    const updateRect = () => {
      const el = document.getElementById(current.targetId);
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    const advance = () => {
      if (stepIndex < steps.length - 1) {
        setStepIndex((i) => i + 1);
      } else {
        onComplete();
      }
    };

    // Steps are scoped to the screen the user is already on, so the target
    // should appear almost immediately. Poll briefly; if it never shows
    // (e.g. a conditional button didn't render this time), skip the step
    // rather than getting stuck.
    let attachedEl = null;
    let elapsed = 0;
    const poll = setInterval(() => {
      updateRect();
      const el = document.getElementById(current.targetId);
      if (el && el !== attachedEl) {
        if (attachedEl) attachedEl.removeEventListener("click", advance);
        el.addEventListener("click", advance, { once: true });
        attachedEl = el;
        clickListenerRef.current = { el, advance };
      }
      elapsed += 400;
      if (!el && elapsed >= 4000) {
        advance();
      }
    }, 400);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
      clearInterval(poll);
      if (clickListenerRef.current) {
        clickListenerRef.current.el.removeEventListener("click", clickListenerRef.current.advance);
      }
    };
  }, [stepIndex, current, onComplete, steps.length]);

  if (!current || !rect) return null;

  const padding = 8;
  const highlightStyle = {
    position: "fixed",
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    borderRadius: "16px",
    border: "3px solid #E8825A",
    boxShadow: "0 0 0 4000px rgba(0,0,0,0.45), 0 0 20px #E8825ACC",
    zIndex: 300,
    pointerEvents: "none",
    animation: "spotlight-pulse 1.4s ease-in-out infinite",
  };

  // Position tooltip below the highlight if there's room, else above
  const tooltipTop = rect.bottom + padding + 12 + 90 < window.innerHeight
    ? rect.bottom + padding + 12
    : rect.top - padding - 100;

  const tooltipStyle = {
    position: "fixed",
    top: Math.max(12, tooltipTop),
    left: Math.min(Math.max(12, rect.left), window.innerWidth - 260),
    width: "240px",
    background: "#fff",
    borderRadius: "16px",
    padding: "14px 16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    zIndex: 301,
  };

  return (
    <>
      <div style={highlightStyle} />
      <div style={tooltipStyle}>
        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#2C2C2A", margin: "0 0 10px 0", lineHeight: 1.5 }}>
          {current.text}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "#aaa" }}>
            {stepIndex + 1} / {steps.length}
          </span>
          <button
            onClick={onComplete}
            style={{
              background: "none", border: "none", color: "#E8825A",
              fontSize: "0.75rem", fontFamily: "Nunito, sans-serif", fontWeight: 700,
              cursor: "pointer", textDecoration: "underline",
            }}
          >
            Skip
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spotlight-pulse {
          0%, 100% { box-shadow: 0 0 0 4000px rgba(0,0,0,0.45), 0 0 20px #E8825ACC; }
          50% { box-shadow: 0 0 0 4000px rgba(0,0,0,0.45), 0 0 32px #E8825AFF; }
        }
      `}</style>
    </>
  );
}
