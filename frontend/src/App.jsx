import { useState } from "react";
import Login from "./components/Login";
import CharacterSelect from "./components/CharacterSelect";
import LanguageSelect from "./components/LanguageSelect";
import Sidebar from "./components/Sidebar";
import Tutorial from "./components/Tutorial";
import SpotlightHint from "./components/SpotlightHint";
import TherapistInput from "./components/TherapistInput";
import PracticeScreen from "./components/PracticeScreen";
import ResultScreen from "./components/ResultScreen";
import DrillScreen from "./components/DrillScreen";

const BACKEND_URL = "https://anabaena-vaaksiddhi.hf.space";

const SCREENS = {
  LOGIN: "login",
  LANGUAGE_SELECT: "language_select",
  CHARACTER_SELECT: "character_select",
  THERAPIST_INPUT: "therapist_input",
  PRACTICE: "practice",
  RESULT: "result",
  DRILL: "drill",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [childId, setChildId] = useState(null);
  const [childName, setChildName] = useState(null);
  const [language, setLanguage] = useState("english");
  const [character, setCharacter] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [result, setResult] = useState(null);
  const [childAudioUrl, setChildAudioUrl] = useState(null);
  const [drillSequence, setDrillSequence] = useState([]);
  const [sessionId] = useState(() => {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  });
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

  const SPOTLIGHT_STEPS = [
    { targetId: "hint-character-card", text: "Tap a friend to pick them as your practice buddy!" },
    { targetId: "hint-hear-voice", text: "Tap here to hear the word out loud!" },
    { targetId: "hint-mic-button", text: "Now tap here and say the word yourself!" },
    { targetId: "hint-result-action", text: "Tap here to try again or move to your next word!" },
  ];

  const spotlightDoneKey = () => `vaaksiddhi_spotlight_done_${childId}`;

  const handleSpotlightComplete = () => {
    setShowSpotlight(false);
    if (childId) localStorage.setItem(spotlightDoneKey(), "true");
  };

  const saveProfile = async (updates) => {
    if (!childId) return;
    try {
      await fetch(`${BACKEND_URL}/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ child_id: childId, ...updates }),
      });
    } catch {
      // Non-fatal — profile save failing shouldn't block the child from practicing
    }
  };

  const handleLogin = (data) => {
    setChildId(data.child_id);
    setChildName(data.name);
    setIsNewUser(!!data.is_new);
    if (data.language) setLanguage(data.language);
    if (data.character) setCharacter(data.character);

    if (data.character && data.language) {
      // Returning user with a saved profile — skip straight to practice, sidebar-only from here on
      setScreen(SCREENS.THERAPIST_INPUT);
    } else {
      // New user, or one who never finished onboarding — go through selection
      setScreen(SCREENS.LANGUAGE_SELECT);
    }
  };

  const handleHome = () => {
    setCharacter(character); // keep current character
    setWordData(null);
    setResult(null);
    setAttemptNumber(1);
    setAttemptHistory([]);
    setScreen(SCREENS.THERAPIST_INPUT);
  };

  const handleSwitchLanguage = (lang) => {
    setLanguage(lang);
    saveProfile({ language: lang });
    setScreen(SCREENS.CHARACTER_SELECT);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    saveProfile({ language: lang });
    setScreen(SCREENS.CHARACTER_SELECT);
  };

  const handleCharacterSelect = (charId) => {
    setCharacter(charId);
    saveProfile({ character: charId });
    setScreen(SCREENS.THERAPIST_INPUT);
    if (isNewUser) {
      setShowTutorial(true);
    }
  };

  const handleSwitchCharacter = (charId) => {
    setCharacter(charId);
    saveProfile({ character: charId });
  };

  const handleWordReady = (data) => {
    setWordData({
      ...data,
      images: data.images || (data.image_base64 ? [{ label: data.word, image_base64: data.image_base64 }] : [])
    });
    setAttemptNumber(1);
    setScreen(SCREENS.PRACTICE);
  };

  const handleResult = (res) => {
    setResult(res);
    setChildAudioUrl(res.childAudioUrl);
    setAttemptHistory(res.attemptHistory || []);
    if (res.enter_drill_mode && res.drill_sequence?.length > 0) {
      setDrillSequence(res.drill_sequence);
    }
    setScreen(SCREENS.RESULT);
  };

  const handleRetry = () => {
    setAttemptNumber((n) => n + 1);
    setScreen(SCREENS.PRACTICE);
  };

  const handleNextWord = () => {
    setWordData(null);
    setResult(null);
    setChildAudioUrl(null);
    setAttemptNumber(1);
    setAttemptHistory([]);
    setScreen(SCREENS.THERAPIST_INPUT);
  };

  const handleDrill = () => {
    if (drillSequence.length > 0) {
      setScreen(SCREENS.DRILL);
    }
  };

  const handleDrillComplete = () => {
    setScreen(SCREENS.THERAPIST_INPUT);
  };

  if (screen === SCREENS.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      {screen === SCREENS.LANGUAGE_SELECT && (
        <LanguageSelect onSelect={handleLanguageSelect} />
      )}
      {screen === SCREENS.CHARACTER_SELECT && (
        <CharacterSelect onSelect={handleCharacterSelect} language={language} />
      )}
      {screen === SCREENS.THERAPIST_INPUT && (
        <TherapistInput character={character} language={language} onWordReady={handleWordReady} onSwitchCharacter={handleSwitchCharacter} />
      )}
      {screen === SCREENS.PRACTICE && (
        <PracticeScreen
          character={character}
          language={language}
          wordData={wordData}
          sessionId={sessionId}
          attemptNumber={attemptNumber}
          attemptHistory={attemptHistory}
          onResult={handleResult}
          onSwitchCharacter={handleSwitchCharacter}
        />
      )}
      {screen === SCREENS.RESULT && (
        <ResultScreen
          character={character}
          language={language}
          result={result}
          childAudioUrl={childAudioUrl}
          onRetry={handleRetry}
          onNextWord={handleNextWord}
          onDrill={handleDrill}
        />
      )}
      {screen === SCREENS.DRILL && (
        <DrillScreen
          character={character}
          language={language}
          drillSequence={drillSequence}
          onComplete={handleDrillComplete}
          onSwitchCharacter={handleSwitchCharacter}
        />
      )}
      <Sidebar
        character={character || "BOLT"}
        language={language}
        currentScreen={screen}
        onSwitchCharacter={handleSwitchCharacter}
        onSwitchLanguage={handleSwitchLanguage}
        onHome={handleHome}
        onShowTutorial={() => setShowTutorial(true)}
      />
      {showTutorial && (
        <Tutorial onClose={() => {
          setShowTutorial(false);
          if (isNewUser && childId && !localStorage.getItem(spotlightDoneKey())) {
            setShowSpotlight(true);
          }
        }} />
      )}
      {showSpotlight && <SpotlightHint steps={SPOTLIGHT_STEPS} onComplete={handleSpotlightComplete} />}
      <button
        onClick={() => setShowSpotlight(true)}
        style={{
          position: "fixed", bottom: "20px", right: "16px", zIndex: 100,
          width: "56px", height: "56px", borderRadius: "50%",
          background: "#E8825A", border: "none", boxShadow: "0 4px 16px #E8825A66",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
        }}
        title="Show me what to do"
      >
        💡
      </button>
    </div>
  );
}
