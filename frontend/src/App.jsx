import { useState } from "react";
import CharacterSelect from "./components/CharacterSelect";
import LanguageSelect from "./components/LanguageSelect";
import Sidebar from "./components/Sidebar";
import AIAssistant from "./components/AIAssistant";
import TherapistInput from "./components/TherapistInput";
import PracticeScreen from "./components/PracticeScreen";
import ResultScreen from "./components/ResultScreen";
import DrillScreen from "./components/DrillScreen";

const SCREENS = {
  LANGUAGE_SELECT: "language_select",
  CHARACTER_SELECT: "character_select",
  THERAPIST_INPUT: "therapist_input",
  PRACTICE: "practice",
  RESULT: "result",
  DRILL: "drill",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANGUAGE_SELECT);
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

  const handleHome = () => {
    setScreen(SCREENS.LANGUAGE_SELECT);
    setCharacter(null);
    setWordData(null);
    setResult(null);
    setAttemptNumber(1);
    setAttemptHistory([]);
  };

  const handleSwitchLanguage = (lang) => {
    setLanguage(lang);
    setScreen(SCREENS.CHARACTER_SELECT);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setScreen(SCREENS.CHARACTER_SELECT);
  };

  const handleCharacterSelect = (charId) => {
    setCharacter(charId);
    setScreen(SCREENS.THERAPIST_INPUT);
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

  return (
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      {screen === SCREENS.LANGUAGE_SELECT && (
        <LanguageSelect onSelect={handleLanguageSelect} />
      )}
      {screen === SCREENS.CHARACTER_SELECT && (
        <CharacterSelect onSelect={handleCharacterSelect} language={language} />
      )}
      {screen === SCREENS.THERAPIST_INPUT && (
        <TherapistInput character={character} language={language} onWordReady={handleWordReady} onSwitchCharacter={setCharacter} />
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
          onSwitchCharacter={setCharacter}
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
          onSwitchCharacter={setCharacter}
        />
      )}
      <Sidebar
        character={character || "BOLT"}
        language={language}
        currentScreen={screen}
        onSwitchCharacter={setCharacter}
        onSwitchLanguage={handleSwitchLanguage}
        onHome={handleHome}
      />
      <AIAssistant
        character={character || "BOLT"}
        language={language}
        currentScreen={screen}
        wordData={wordData}
      />
    </div>
  );
}
