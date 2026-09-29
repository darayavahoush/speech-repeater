import { useMemo, useState } from "react";
import { t } from "../utils/i18n";
import { getSurface } from "../utils/themes";
import { CATEGORIES, wordsFor } from "../utils/wordBank";
import pictogramMap from "../utils/pictogramMap.json";

const SEARCH_PLACEHOLDER = {
  english: "Search words",
  hindi: "शब्द खोजें",
  kannada: "ಪದಗಳನ್ನು ಹುಡುಕಿ",
};
const NO_MATCH = {
  english: "No matches. Try typing the word above.",
  hindi: "कोई शब्द नहीं मिला। ऊपर टाइप करें।",
  kannada: "ಯಾವುದೂ ಸಿಗಲಿಲ್ಲ. ಮೇಲೆ ಟೈಪ್ ಮಾಡಿ.",
};

function Tile({ word, selected, onPick, th }) {
  const id = pictogramMap[word.key];
  return (
    <button
      type="button"
      aria-pressed={selected}
      title={word.label}
      onClick={() => onPick(word.label)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        padding: "8px 4px 6px", background: "#fff",
        border: `2.5px solid ${selected ? th.accent : "transparent"}`,
        boxShadow: selected ? `0 0 0 2px ${th.accent}44` : "0 1px 4px rgba(0,0,0,0.10)",
        borderRadius: "14px", cursor: "pointer", fontFamily: "Nunito, sans-serif",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
    >
      {id ? (
        <img
          src={`/pictograms/${id}.png`} alt="" loading="lazy" decoding="async" draggable={false}
          style={{ width: "100%", maxWidth: "76px", aspectRatio: "1 / 1", objectFit: "contain" }}
        />
      ) : (
        <div style={{ width: "76px", height: "76px", borderRadius: "12px", background: `${th.accent}22`, color: th.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 900 }}>
          {word.label.trim().charAt(0)}
        </div>
      )}
      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#2E2320", textAlign: "center", lineHeight: 1.15, wordBreak: "break-word" }}>
        {word.label}
      </span>
    </button>
  );
}

export default function WordPicker({ language = "english", value, onPick, th, darkMode }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [query, setQuery] = useState("");

  const words = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return wordsFor(category, language);
    return CATEGORIES.flatMap((c) => wordsFor(c, language)).filter(
      (w) => w.label.toLowerCase().includes(q) || w.en.toLowerCase().includes(q)
    );
  }, [category, language, query]);

  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ color: th.sub, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px 0" }}>
        {t(language, "suggestions")}
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={SEARCH_PLACEHOLDER[language] || SEARCH_PLACEHOLDER.english}
        style={{ width: "100%", boxSizing: "border-box", background: getSurface(darkMode, 0.8), border: `1.5px solid ${th.accent}33`, borderRadius: "12px", padding: "9px 12px", color: th.text, fontSize: "0.85rem", outline: "none", fontFamily: "Nunito, sans-serif", marginBottom: "10px" }}
      />

      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px", marginBottom: "8px" }}>
        {CATEGORIES.map((cat) => {
          const active = !query && category === cat;
          return (
            <button key={cat} type="button" onClick={() => { setQuery(""); setCategory(cat); }}
              style={{ flex: "0 0 auto", background: active ? th.accent : th.card, color: active ? "#fff" : th.sub, border: "none", borderRadius: "20px", padding: "5px 14px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
              {t(language, cat)}
            </button>
          );
        })}
      </div>

      <div style={{ maxHeight: "340px", overflowY: "auto", padding: "4px", borderRadius: "16px", background: getSurface(darkMode, 0.45), border: `1.5px solid ${th.accent}22`, WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
        {words.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: "8px" }}>
            {words.map((w) => (
              <Tile key={w.key} word={w} selected={value === w.label} onPick={onPick} th={th} />
            ))}
          </div>
        ) : (
          <p style={{ color: th.sub, fontSize: "0.8rem", textAlign: "center", margin: "18px 8px" }}>
            {NO_MATCH[language] || NO_MATCH.english}
          </p>
        )}
      </div>

      <p style={{ color: th.sub, fontSize: "0.6rem", margin: "6px 2px 0", opacity: 0.8 }}>
        Pictograms: ARASAAC (<a href="https://arasaac.org" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>arasaac.org</a>), Government of Aragón, author Sergio Palao. CC BY-NC-SA.
      </p>
    </div>
  );
}
