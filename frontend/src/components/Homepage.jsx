import { useState } from "react";
import { CHARACTERS } from "../assets/characters";
import { LANGUAGES } from "../utils/i18n";
import logo from "../assets/images/logo.png";

const RAINBOW_GRADIENT = "linear-gradient(160deg, #FDEDEA 0%, #FDF3DD 30%, #FBFAE0 55%, #E9F6EA 75%, #E2F5F2 100%)";
const RAINBOW_GRADIENT_BAND = "linear-gradient(100deg, #E8825A 0%, #E8B84B 30%, #6BBF7A 60%, #4ABFBF 100%)";
const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

// Injected once for the Plans & pricing nav button hover state (inline styles can't do :hover)
if (typeof document !== "undefined" && !document.getElementById("plans-pricing-btn-style")) {
  const styleTag = document.createElement("style");
  styleTag.id = "plans-pricing-btn-style";
  styleTag.textContent = `
    .plans-pricing-btn:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 6px 20px rgba(232,130,90,0.5);
    }
    .plans-pricing-sparkle {
      animation: plans-sparkle-pulse 1.8s ease-in-out infinite;
    }
    @keyframes plans-sparkle-pulse {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
      50% { transform: scale(1.3) rotate(15deg); opacity: 0.7; }
    }
  `;
  document.head.appendChild(styleTag);
}

const DEMO_WORDS = { english: "ball", hindi: "गेंद", kannada: "ಚೆಂಡು" };

const FEATURES = [
  {
    tag: "PHONEME-LEVEL FEEDBACK",
    tagColor: "#5B9BD5",
    title: "Hears the exact sound, not just the word",
    body: "Vaakify checks individual sounds, including tricky pairs like त/ट or क/ख that general speech-recognition tools routinely mix up — feedback that actually means something for practice.",
  },
  {
    tag: "THREE LANGUAGES, ONE FRIEND",
    tagColor: "#B57ED5",
    title: "English, Hindi, or Kannada — same companion",
    body: "Kids keep the same character voice and personality no matter which language they're practicing in, so switching never feels like starting over.",
  },
  {
    tag: "BUILT FOR REAL PRACTICE",
    tagColor: "#6BBF7A",
    title: "Feedback that adapts, not just a score",
    body: "Pitch, loudness, and pacing feed into every attempt, and Vaakify automatically builds extra practice around whichever sounds need it most.",
  },
];

const STEPS = [
  { title: "Pick a friend", body: "Choose a character companion with a personality and voice all their own." },
  { title: "Listen together", body: "Hear the word — slow it down as many times as needed." },
  { title: "Try it yourself", body: "Record the word and get feedback right away." },
  { title: "See real progress", body: "Tricky sounds get extra practice, automatically." },
];

export default function Homepage({ onSignIn, onGetStarted, onSeePlans }) {
  const [hoveredChar, setHoveredChar] = useState(null);
  const [demoCharacter, setDemoCharacter] = useState("BOLT");
  const [demoLanguage, setDemoLanguage] = useState("english");
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoError, setDemoError] = useState(false);

  const playDemoWord = async () => {
    setDemoPlaying(true);
    setDemoError(false);
    try {
      const form = new FormData();
      form.append("word", DEMO_WORDS[demoLanguage]);
      form.append("speed", "1.0");
      form.append("language", demoLanguage);
      form.append("character", demoCharacter);
      const res = await fetch(`${BACKEND_URL}/speak/word`, { method: "POST", body: form });
      if (!res.ok) throw new Error("bad response");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setDemoPlaying(false);
    } catch {
      setDemoPlaying(false);
      setDemoError(true);
    }
  };

  const demoChar = CHARACTERS[demoCharacter];

  return (
    <div style={{ minHeight: "100vh", background: RAINBOW_GRADIENT, fontFamily: "Inter, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 16px", maxWidth: "1100px", margin: "0 auto", gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src={logo} alt="Vaakify" style={{ width: "160%", height: "160%", objectFit: "contain" }} />
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#3A2E2C" }}>Vaakify</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "nowrap", minWidth: 0 }}>
          {onSeePlans && (
            <button
              onClick={onSeePlans}
              className="plans-pricing-btn"
              style={{
                display: "flex", alignItems: "center", gap: "5px", flexShrink: 0,
                whiteSpace: "nowrap",
                background: "linear-gradient(100deg, #E8825A 0%, #E8B84B 40%, #4ABFBF 100%)",
                border: "none",
                borderRadius: "999px", padding: "8px 12px",
                color: "#fff", fontWeight: 800,
                fontSize: "0.72rem", cursor: "pointer", fontFamily: "Inter, sans-serif",
                boxShadow: "0 3px 14px rgba(232,130,90,0.35)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <span className="plans-pricing-sparkle" style={{ fontSize: "0.85rem", display: "inline-block", flexShrink: 0 }}>✨</span> Plans & pricing
            </button>
          )}
          <button onClick={onSignIn} style={{
            background: "none", border: "none", color: "#3A2E2C", fontWeight: 700,
            fontSize: "0.78rem", cursor: "pointer", fontFamily: "Inter, sans-serif",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            Sign in
          </button>
          <button onClick={onGetStarted} style={{
            background: "#E8825A", color: "#fff", border: "none", borderRadius: "12px",
            padding: "8px 14px", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
            fontFamily: "Inter, sans-serif", boxShadow: "0 2px 10px #E8825A44",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            Start free trial
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto", padding: "60px 32px 40px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Large translucent logo watermark */}
        <img src={logo} alt="" aria-hidden="true" style={{
          position: "absolute", top: "20px", right: "-100px", width: "480px", height: "480px",
          objectFit: "contain", opacity: 0.08, pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: "620px" }}>
          <p style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem",
            letterSpacing: "0.12em", color: "#E8825A", marginBottom: "16px", textTransform: "uppercase",
          }}>
            Speech practice, with a friend
          </p>
          <h1 style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "3.4rem",
            lineHeight: 1.08, color: "#2A211D", margin: "0 0 20px 0",
          }}>
            Say it again — with someone in your corner.
          </h1>
          <p style={{
            fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500,
            fontSize: "1.25rem", lineHeight: 1.5, color: "#5A4A42", margin: "0 0 32px 0",
          }}>
            An animated practice buddy, real speech-therapy science underneath, and a little companion who never runs out of patience.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button onClick={onGetStarted} style={{
              background: "#E8825A", color: "#fff", border: "none", borderRadius: "14px",
              padding: "16px 28px", fontWeight: 800, fontSize: "1rem", cursor: "pointer",
              fontFamily: "Inter, sans-serif", boxShadow: "0 4px 20px #E8825A55",
            }}>
              Start free trial →
            </button>
            <a href="#try-it" style={{
              background: "rgba(255,255,255,0.7)", color: "#3A2E2C", border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: "14px", padding: "16px 28px", fontWeight: 700, fontSize: "1rem",
              cursor: "pointer", fontFamily: "Inter, sans-serif", textDecoration: "none",
              display: "inline-block",
            }}>
              Try it live
            </a>
          </div>
        </div>

        {/* Character strip */}
        <div style={{ display: "flex", gap: "14px", marginTop: "56px", flexWrap: "wrap", position: "relative" }}>
          {Object.values(CHARACTERS).map((char) => (
            <div
              key={char.id}
              onMouseEnter={() => setHoveredChar(char.id)}
              onMouseLeave={() => setHoveredChar(null)}
              style={{
                background: "rgba(255,255,255,0.85)", borderRadius: "20px", padding: "14px",
                width: "120px", textAlign: "center", cursor: "pointer",
                border: `2px solid ${hoveredChar === char.id ? char.color : "transparent"}`,
                transform: hoveredChar === char.id ? "translateY(-6px)" : "none",
                transition: "all 0.25s ease", boxShadow: hoveredChar === char.id ? `0 8px 24px ${char.color}44` : "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <img src={char.image} alt={char.name} style={{ width: "56px", height: "56px", objectFit: "contain", margin: "0 auto 8px" }} />
              <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.8rem", color: "#3A2E2C", margin: 0 }}>{char.name}</p>
              {hoveredChar === char.id && (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "#777", margin: "4px 0 0 0", lineHeight: 1.3 }}>
                  {char.tagline}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 32px" }}>
        <h2 style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#2A211D",
          textAlign: "center", margin: "0 0 48px 0",
        }}>
          Practice that actually listens
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {FEATURES.map((f) => (
            <div key={f.tag} style={{
              background: "rgba(255,255,255,0.75)", borderRadius: "20px", padding: "28px",
              border: "1.5px solid rgba(0,0,0,0.06)",
            }}>
              <span style={{
                display: "inline-block", background: `${f.tagColor}22`, color: f.tagColor,
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.65rem",
                letterSpacing: "0.08em", padding: "5px 12px", borderRadius: "20px", marginBottom: "16px",
              }}>
                {f.tag}
              </span>
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#2A211D", margin: "0 0 10px 0" }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "#666", lineHeight: 1.6, margin: 0 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Live demo */}
      <section id="try-it" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px 80px" }}>
        <h2 style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#2A211D",
          textAlign: "center", margin: "0 0 12px 0",
        }}>
          Hear it for yourself
        </h2>
        <p style={{
          fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "1.05rem", color: "#5A4A42",
          textAlign: "center", margin: "0 0 36px 0",
        }}>
          Pick a friend and a language, no sign-up needed.
        </p>

        <div style={{
          maxWidth: "560px", margin: "0 auto", background: "rgba(255,255,255,0.85)",
          borderRadius: "24px", padding: "32px 28px", border: "1.5px solid rgba(0,0,0,0.06)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.7rem", color: "#9A7A6A", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
            Choose a friend
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "22px" }}>
            {Object.values(CHARACTERS).map((c) => (
              <button
                key={c.id}
                onClick={() => setDemoCharacter(c.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                  background: c.id === demoCharacter ? `${c.color}22` : "transparent",
                  border: `1.5px solid ${c.id === demoCharacter ? c.color : "rgba(0,0,0,0.08)"}`,
                  borderRadius: "14px", padding: "10px 12px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <img src={c.image} alt={c.name} style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#3A2E2C", fontFamily: "Nunito, sans-serif" }}>{c.name}</span>
              </button>
            ))}
          </div>

          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.7rem", color: "#9A7A6A", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
            Choose a language
          </p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "26px" }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setDemoLanguage(lang.code)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  background: lang.code === demoLanguage ? "#E8825A" : "rgba(0,0,0,0.04)",
                  color: lang.code === demoLanguage ? "#fff" : "#3A2E2C",
                  border: "none", borderRadius: "12px", padding: "10px 8px", cursor: "pointer",
                  fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.82rem", transition: "all 0.2s",
                }}
              >
                <span>{lang.flag}</span> {lang.native}
              </button>
            ))}
          </div>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#FDF3DD", borderRadius: "16px", padding: "18px 20px", marginBottom: "18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={demoChar.image} alt={demoChar.name} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
              <div>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#9A7A6A", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 2px 0" }}>Word</p>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2A211D", margin: 0 }}>{DEMO_WORDS[demoLanguage]}</p>
              </div>
            </div>
          </div>

          <button
            onClick={playDemoWord}
            disabled={demoPlaying}
            style={{
              width: "100%", padding: "16px", background: "#E8825A", color: "#fff", border: "none",
              borderRadius: "14px", fontFamily: "Nunito, sans-serif", fontSize: "1rem", fontWeight: 900,
              cursor: demoPlaying ? "not-allowed" : "pointer", opacity: demoPlaying ? 0.7 : 1,
              boxShadow: "0 4px 20px #E8825A44",
            }}
          >
            {demoPlaying ? "Playing..." : `🔊 Hear ${demoChar.name} say it`}
          </button>
          {demoError && (
            <p style={{ color: "#E05555", fontSize: "0.78rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, textAlign: "center", margin: "10px 0 0 0" }}>
              Couldn't reach the demo right now — try again in a moment.
            </p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>
        <h2 style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#2A211D",
          textAlign: "center", margin: "0 0 48px 0",
        }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={{ textAlign: "center", padding: "0 12px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%", background: "#E8825A",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.1rem",
                margin: "0 auto 14px",
              }}>
                {i + 1}
              </div>
              <h4 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2A211D", margin: "0 0 6px 0" }}>
                {step.title}
              </h4>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "#777", lineHeight: 1.5, margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the characters */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>
        <h2 style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#2A211D",
          textAlign: "center", margin: "0 0 12px 0",
        }}>
          Meet the practice buddies
        </h2>
        <p style={{
          fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "1.05rem", color: "#5A4A42",
          textAlign: "center", margin: "0 0 44px 0",
        }}>
          Every child picks their own — and keeps them across every language.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px" }}>
          {Object.values(CHARACTERS).map((char) => (
            <div key={char.id} style={{
              background: "rgba(255,255,255,0.8)", borderRadius: "20px", padding: "20px",
              textAlign: "center", border: `1.5px solid ${char.color}33`,
              width: "180px", flex: "0 0 auto",
            }}>
              <img src={char.image} alt={char.name} style={{ width: "72px", height: "72px", objectFit: "contain", margin: "0 auto 10px" }} />
              <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1rem", color: "#2A211D", margin: "0 0 4px 0" }}>
                {char.name}
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#888", lineHeight: 1.4, margin: 0 }}>
                {char.tagline}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section style={{ background: RAINBOW_GRADIENT_BAND, padding: "70px 32px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#fff",
          margin: "0 0 12px 0", textShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}>
          Ready to help your child find their voice?
        </h2>
        <p style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", color: "#fff", fontSize: "1.05rem", margin: "0 0 28px 0", opacity: 0.95 }}>
          Start a free 7-day trial — no card required to try it out.
        </p>
        <button onClick={onGetStarted} style={{
          background: "#fff", color: "#E8825A", border: "none", borderRadius: "14px",
          padding: "16px 32px", fontWeight: 900, fontSize: "1rem", cursor: "pointer",
          fontFamily: "Inter, sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          Start free trial →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        maxWidth: "1100px", margin: "0 auto", padding: "32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src={logo} alt="Vaakify" style={{ width: "150%", height: "150%", objectFit: "contain" }} />
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#3A2E2C" }}>Vaakify</span>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#999", margin: 0 }}>
          © {new Date().getFullYear()} Vaakify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
