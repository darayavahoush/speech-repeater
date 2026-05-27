import { useState } from "react";
import CharacterSelect from "./components/CharacterSelect";
import TherapistInput from "./components/TherapistInput";
import PracticeScreen from "./components/PracticeScreen";
import ResultScreen from "./components/ResultScreen";
import DrillScreen from "./components/DrillScreen";

const SCREENS = {
  CHARACTER_SELECT: "character_select",
  THERAPIST_INPUT: "therapist_input",
  PRACTICE: "practice",
  RESULT: "result",
  DRILL: "drill",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.CHARACTER_SELECT);
  const [character, setCharacter] = useState(null);
  const [wordData, setWordData] = useState(null);
  const [result, setResult] = useState(null);
  const [childAudioUrl, setChildAudioUrl] = useState(null);
  const [drillSequence, setDrillSequence] = useState([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [attemptHistory, setAttemptHistory] = useState([]);

  const handleCharacterSelect = (charId) => {
    setCharacter(charId);
    setScreen(SCREENS.THERAPIST_INPUT);
  };

  const handleWordReady = (data) => {
    setWordData(data);
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
    <div style={{ minHeight: "100vh", background: "#07090F" }}>
      {screen === SCREENS.CHARACTER_SELECT && (
        <CharacterSelect onSelect={handleCharacterSelect} />
      )}
      {screen === SCREENS.THERAPIST_INPUT && (
        <TherapistInput character={character} onWordReady={handleWordReady} />
      )}
      {screen === SCREENS.PRACTICE && (
        <PracticeScreen
          character={character}
          wordData={wordData}
          sessionId={sessionId}
          attemptNumber={attemptNumber}
          attemptHistory={attemptHistory}
          onResult={handleResult}
        />
      )}
      {screen === SCREENS.RESULT && (
        <ResultScreen
          character={character}
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
          drillSequence={drillSequence}
          onComplete={handleDrillComplete}
        />
      )}
    </div>
  );
}
