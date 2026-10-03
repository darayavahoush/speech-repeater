import { useState, useEffect } from "react";
import { initMoonCursor, setCursorCharacter } from "./utils/moonCursor";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PhoneAuth from "./components/PhoneAuth";
import Paywall from "./components/Paywall";
import VerifyEmail from "./components/VerifyEmail";
import CharacterSelect from "./components/CharacterSelect";
import LanguageSelect from "./components/LanguageSelect";
import Sidebar from "./components/Sidebar";
import Tutorial from "./components/Tutorial";
import SpotlightHint from "./components/SpotlightHint";
import { getStoredDarkMode, setStoredDarkMode } from "./utils/themes";
import TherapistInput from "./components/TherapistInput";
import PracticeScreen from "./components/PracticeScreen";
import ResultScreen from "./components/ResultScreen";
import DrillScreen from "./components/DrillScreen";
import ProgressScreen from "./components/ProgressScreen";
import Settings from "./components/Settings";
import LegalPage from "./components/LegalPage";
import { inputWord, translateWord } from "./utils/api";
import { API_BASE } from "./utils/config";
import WhoIsContinuing from "./components/WhoIsContinuing";
import CompleteProfile from "./components/CompleteProfile";
import { getAccounts, rememberAccount, forgetAccount, saveSession, getSession, clearSession, setLastActive, getLastActive, clearLastActive } from "./utils/accounts";

const BACKEND_URL = API_BASE;

const SCREENS = {
  HOMEPAGE: "homepage",
  LOGIN: "login",
  SIGNUP: "signup",
  PHONE_AUTH: "phone_auth",
  VERIFY_EMAIL: "verify_email",
  PAYWALL: "paywall",
  LANGUAGE_SELECT: "language_select",
  CHARACTER_SELECT: "character_select",
  THERAPIST_INPUT: "therapist_input",
  PRACTICE: "practice",
  RESULT: "result",
  DRILL: "drill",
  PROGRESS: "progress",
  SETTINGS: "settings",
  PRIVACY: "privacy",
  TERMS: "terms",
  WHO: "who",
  COMPLETE_PROFILE: "complete_profile",
};

export default function App() {
  const [screen, setScreen] = useState(() => {
    const path = window.location.pathname.replace(/\/+$/, "");
    if (path === "/privacy") return SCREENS.PRIVACY;
    if (path === "/terms") return SCREENS.TERMS;
    return getAccounts().length ? SCREENS.WHO : SCREENS.LOGIN;
  });
  const [prefillEmail, setPrefillEmail] = useState("");
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
  // Set while a signed-in account still needs a verified phone and/or an email.
  const [profileGap, setProfileGap] = useState(null);
  const [trialStatus, setTrialStatus] = useState(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [pendingName, setPendingName] = useState(null);
  const [childEmail, setChildEmail] = useState(null);
  const [verifyReturnTo, setVerifyReturnTo] = useState("signup");
  const [phoneAuthReturnTo, setPhoneAuthReturnTo] = useState(SCREENS.LOGIN);
  const [darkMode, setDarkMode] = useState(() => getStoredDarkMode());

  useEffect(() => {
    const want = screen === SCREENS.PRIVACY ? "/privacy" : screen === SCREENS.TERMS ? "/terms" : "/";
    const legalPaths = ["/privacy", "/terms"];
    const here = window.location.pathname.replace(/\/+$/, "") || "/";
    if (want !== "/" && here !== want) window.history.pushState({}, "", want);
    else if (want === "/" && legalPaths.includes(here)) window.history.replaceState({}, "", "/");
  }, [screen]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      setStoredDarkMode(next);
      return next;
    });
  };
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

  // Hints are scoped per-screen (not one long cross-screen chain) so they
  // work correctly whether triggered automatically on first visit to a
  // screen, or manually via the floating button from wherever the user is.
  const SCREEN_HINTS = {
    [SCREENS.CHARACTER_SELECT]: [
      { targetId: "hint-character-card", text: "Tap a friend to pick them as your practice buddy!" },
    ],
    [SCREENS.THERAPIST_INPUT]: [
      { targetId: "hint-word-input", text: "Type a word here to practice!" },
      { targetId: "hint-word-submit", text: "Tap here when you're ready!" },
    ],
    [SCREENS.PRACTICE]: [
      { targetId: "hint-hear-voice", text: "Tap here to hear the word out loud!" },
      { targetId: "hint-mic-button", text: "Now tap here and say the word yourself!" },
    ],
    [SCREENS.RESULT]: [
      { targetId: "hint-result-action", text: "Tap here to try again or move to your next word!" },
    ],
  };

  const spotlightSeenKey = (scr) => `vaaksiddhi_spotlight_seen_${childId}_${scr}`;

  const hintsOffKey = () => `vaaksiddhi_hints_off_${childId}`;
  const tutorialSeenKey = () => `vaaksiddhi_tutorial_seen_${childId}`;

  const handleSpotlightComplete = () => {
    setShowSpotlight(false);
    if (childId) localStorage.setItem(spotlightSeenKey(screen), "true");
  };

  // Skip = "stop showing me the walkthrough" for this account, on every screen.
  const handleSpotlightSkip = () => {
    setShowSpotlight(false);
    if (childId) localStorage.setItem(hintsOffKey(), "true");
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    if (childId) localStorage.setItem(tutorialSeenKey(), "true");
  };

  const handleTutorialSkip = () => {
    handleTutorialClose();
    if (childId) localStorage.setItem(hintsOffKey(), "true");
  };

  // Auto-show hints the first time a new user reaches a screen that has them.
  // Waits for the modal Tutorial to close first so the two don't stack on top
  // of each other (both can trigger off the same screen-change event).
  useEffect(() => {
    if (!isNewUser || !childId || showTutorial) return;
    if (localStorage.getItem(hintsOffKey())) return;
    const hints = SCREEN_HINTS[screen];
    if (!hints) return;
    if (localStorage.getItem(spotlightSeenKey(screen))) return;
    setShowSpotlight(true);
  }, [screen, isNewUser, childId, showTutorial]);

  const saveProfile = async (updates) => {
    if (!childId) return;
    try {
      await fetch(`${BACKEND_URL}/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: childId, ...updates }),
      });
    } catch {
      // Non-fatal — profile save failing shouldn't block the child from practicing
    }
  };

  useEffect(() => initMoonCursor(), []);
  useEffect(() => { setCursorCharacter(character); }, [character]);

  const [resuming, setResuming] = useState(() => {
    try { const id = getLastActive(); return !!(id && getSession(id)); } catch { return false; }
  });

  useEffect(() => {
    const id = getLastActive();
    const token = id ? getSession(id) : null;
    if (!token) { setResuming(false); return undefined; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/resume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.success) handleLogin(data);
        else if (data.expired) clearSession(id);
      } catch { /* offline or server error: fall back to the profile picker */ }
      finally { if (!cancelled) setResuming(false); }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (data, isNew = false) => {
    rememberAccount({ account_id: data.account_id, name: data.name, email: data.email });
    saveSession(data.account_id, data.session_token);
    setLastActive(data.account_id);
    setChildId(data.account_id);
    setChildName(data.name);
    setIsNewUser(isNew);
    setTrialStatus(data.trial_status);
    setTrialDaysRemaining(data.trial_days_remaining);
    if (data.email) setChildEmail(data.email);
    if (data.language) setLanguage(data.language);
    if (data.character) setCharacter(data.character);

    // Every account needs an email AND a verified phone. Google / phone-only / older
    // accounts that are missing one are asked for it before going any further.
    if ((data.needs_mobile || data.needs_email) && data.session_token) {
      setProfileGap({ name: data.name, token: data.session_token, needsMobile: !!data.needs_mobile, needsEmail: !!data.needs_email });
      setScreen(SCREENS.COMPLETE_PROFILE);
      return;
    }
    setProfileGap(null);

    if (data.trial_status === "expired") {
      setScreen(SCREENS.PAYWALL);
      return;
    }

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

  const handleSwitchLanguage = async (lang) => {
    setLanguage(lang);
    saveProfile({ language: lang });

    const wordIsActive =
      wordData?.english_word &&
      [SCREENS.PRACTICE, SCREENS.RESULT, SCREENS.DRILL].includes(screen);

    if (wordIsActive) {
      try {
        let targetText = wordData.english_word;
        if (lang !== "english") {
          const t = await translateWord(wordData.english_word, lang);
          targetText = t.translated || wordData.english_word;
        }
        const data = await inputWord({ text: targetText, character, language: lang });
        if (data?.word) {
          handleWordReady(data);
          return;
        }
      } catch {
        // fall through to character select on any failure
      }
    }

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
    if (isNewUser && childId && !localStorage.getItem(tutorialSeenKey())) {
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

  const handleSwitchAccount = () => {
    clearLastActive();
    setChildId(null); setChildName(null); setChildEmail(null);
    setCharacter(null); setLanguage("english");
    setWordData(null); setResult(null);
    setTrialStatus(null); setTrialDaysRemaining(null);
    setPrefillEmail("");
    setScreen(SCREENS.WHO);
  };

  // Log out: end this device's session (and revoke the token server-side), then go back to the
  // profile picker. The profile tile stays, but picking it again asks for the password.
  const handleLogout = () => {
    const id = childId || getLastActive();
    const token = id ? getSession(id) : null;
    if (token) {
      fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        keepalive: true,
      }).catch(() => { /* offline: the local session is cleared below regardless */ });
    }
    if (id) clearSession(id);
    setProfileGap(null);
    setIsNewUser(false);
    setShowTutorial(false);
    setShowSpotlight(false);
    handleSwitchAccount();
  };

  const handleAccountDeleted = () => {
    if (childId) forgetAccount(childId);
    setChildId(null);
    setChildName(null);
    setChildEmail(null);
    setCharacter(null);
    setLanguage("english");
    setWordData(null);
    setResult(null);
    setTrialStatus(null);
    setTrialDaysRemaining(null);
    setScreen(getAccounts().length ? SCREENS.WHO : SCREENS.LOGIN);
  };

  if (resuming) return <div style={{ minHeight: "100vh" }} />;

  if (screen === SCREENS.PRIVACY) {
    return <LegalPage type="privacy" onBack={() => setScreen(SCREENS.HOMEPAGE)} />;
  }

  if (screen === SCREENS.TERMS) {
    return <LegalPage type="terms" onBack={() => setScreen(SCREENS.HOMEPAGE)} />;
  }

  if (screen === SCREENS.WHO) {
    return (
      <WhoIsContinuing
        darkMode={darkMode}
        onPick={async (a) => {
          const token = getSession(a.account_id);
          if (token) {
            try {
              const res = await fetch(`${BACKEND_URL}/auth/resume`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              });
              const data = await res.json();
              if (data.success) { handleLogin(data); return; }
              if (data.expired) clearSession(a.account_id);
            } catch { /* offline or server error: fall back to login screen */ }
          }
          setPrefillEmail(a.email || "");
          setScreen(SCREENS.LOGIN);
        }}
        onAddAccount={() => { setPrefillEmail(""); setScreen(SCREENS.LOGIN); }}
      />
    );
  }

  if (screen === SCREENS.COMPLETE_PROFILE && profileGap) {
    return (
      <CompleteProfile
        key={profileGap.needsMobile ? "mobile" : "email"}
        name={profileGap.name}
        token={profileGap.token}
        needsMobile={profileGap.needsMobile}
        needsEmail={profileGap.needsEmail}
        onUpdated={(data) => handleLogin(data, isNewUser)}
        onLogout={handleLogout}
        darkMode={darkMode}
      />
    );
  }

  if (screen === SCREENS.HOMEPAGE) {
    return (
      <Homepage
        onSignIn={() => setScreen(SCREENS.LOGIN)}
        onGetStarted={() => setScreen(SCREENS.SIGNUP)}
        onSeePlans={() => setScreen(SCREENS.PAYWALL)}
        onSeePrivacy={() => setScreen(SCREENS.PRIVACY)}
        onSeeTerms={() => setScreen(SCREENS.TERMS)}
      />
    );
  }

  if (screen === SCREENS.SIGNUP) {
    return (
      <Signup
        onSignup={(data) => {
          if (data.needs_verification) {
            setPendingEmail(data.email);
            setPendingName(data.name);
            setScreen(SCREENS.VERIFY_EMAIL);
          } else {
            handleLogin(data, true);
          }
        }}
        onGoToLogin={() => setScreen(SCREENS.LOGIN)}
        onGoToPhoneAuth={() => {
          setPhoneAuthReturnTo(SCREENS.SIGNUP);
          setScreen(SCREENS.PHONE_AUTH);
        }}
        onSeePlans={() => setScreen(SCREENS.PAYWALL)}
        darkMode={darkMode}
      />
    );
  }

  if (screen === SCREENS.PHONE_AUTH) {
    return (
      <PhoneAuth
        onAuthed={(data, isNew) => handleLogin(data, isNew)}
        onGoBack={() => setScreen(phoneAuthReturnTo)}
        darkMode={darkMode}
      />
    );
  }

  if (screen === SCREENS.VERIFY_EMAIL) {
    return (
      <VerifyEmail
        email={pendingEmail}
        name={pendingName}
        onVerified={(data) => {
          if (verifyReturnTo === "settings") {
            setVerifyReturnTo("signup");
            setScreen(SCREENS.SETTINGS);
          } else {
            handleLogin(data, true);
          }
        }}
        darkMode={darkMode}
      />
    );
  }

  if (screen === SCREENS.LOGIN) {
    return (
      <Login
        onLogin={handleLogin}
        prefillEmail={prefillEmail}
        onBack={getAccounts().length ? () => setScreen(SCREENS.WHO) : null}
        onNeedsVerification={(email, name) => {
          setPendingEmail(email);
          setPendingName(name);
          setScreen(SCREENS.VERIFY_EMAIL);
        }}
        onGoToSignup={() => setScreen(SCREENS.SIGNUP)}
        onGoToPhoneAuth={() => {
          setPhoneAuthReturnTo(SCREENS.LOGIN);
          setScreen(SCREENS.PHONE_AUTH);
        }}
        darkMode={darkMode}
      />
    );
  }

  if (screen === SCREENS.PAYWALL) {
    const forced = trialStatus === "expired";
    return (
      <Paywall
        name={childName}
        darkMode={darkMode}
        onBack={forced ? null : () => setScreen(childId ? SCREENS.THERAPIST_INPUT : SCREENS.HOMEPAGE)}
      />
    );
  }

  return (
    <div key={screen} className="screen-transition" style={{ minHeight: "100vh", background: "transparent" }}>
      {screen === SCREENS.LANGUAGE_SELECT && (
        <LanguageSelect onSelect={handleLanguageSelect} darkMode={darkMode} />
      )}
      {screen === SCREENS.CHARACTER_SELECT && (
        <CharacterSelect onSelect={handleCharacterSelect} language={language} darkMode={darkMode} />
      )}
      {screen === SCREENS.THERAPIST_INPUT && (
        <TherapistInput character={character} language={language} onWordReady={handleWordReady} onSwitchCharacter={handleSwitchCharacter} darkMode={darkMode} childId={childId} onOpenProgress={() => setScreen(SCREENS.PROGRESS)} />
      )}
      {screen === SCREENS.PRACTICE && (
        <PracticeScreen
          character={character}
          language={language}
          wordData={wordData}
          sessionId={sessionId}
          childId={childId}
          attemptNumber={attemptNumber}
          attemptHistory={attemptHistory}
          onResult={handleResult}
          onSwitchCharacter={handleSwitchCharacter}
          darkMode={darkMode}
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
          darkMode={darkMode}
        />
      )}
      {screen === SCREENS.PROGRESS && (
        <ProgressScreen childId={childId} character={character} darkMode={darkMode} onBack={() => setScreen(SCREENS.THERAPIST_INPUT)} />
      )}
      {screen === SCREENS.SETTINGS && (
        <Settings
          childId={childId}
          childName={childName}
          childEmail={childEmail}
          trialStatus={trialStatus}
          trialDaysRemaining={trialDaysRemaining}
          onSeePlans={() => setScreen(SCREENS.PAYWALL)}
          darkMode={darkMode}
          onBack={() => setScreen(SCREENS.THERAPIST_INPUT)}
          onEmailChanged={(newEmail) => setChildEmail(newEmail)}
          onNeedsEmailVerification={(email, name) => {
            setPendingEmail(email);
            setPendingName(name);
            setVerifyReturnTo("settings");
            setScreen(SCREENS.VERIFY_EMAIL);
          }}
          onAccountDeleted={handleAccountDeleted}
          onSwitchAccount={handleSwitchAccount}
          onLogout={handleLogout}
        />
      )}
      {screen === SCREENS.DRILL && (
        <DrillScreen
          character={character}
          language={language}
          drillSequence={drillSequence}
          onComplete={handleDrillComplete}
          onSwitchCharacter={handleSwitchCharacter}
          darkMode={darkMode}
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
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        childId={childId}
        onOpenProgress={() => setScreen(SCREENS.PROGRESS)}
        onOpenSettings={() => setScreen(SCREENS.SETTINGS)}
        onOpenPaywall={() => setScreen(SCREENS.PAYWALL)}
        onLogout={handleLogout}
      />
      {showTutorial && <Tutorial onClose={handleTutorialClose} onSkip={handleTutorialSkip} darkMode={darkMode} />}
      {showSpotlight && SCREEN_HINTS[screen] && (
        <SpotlightHint steps={SCREEN_HINTS[screen]} onComplete={handleSpotlightComplete} onSkip={handleSpotlightSkip} darkMode={darkMode} />
      )}
      {SCREEN_HINTS[screen] && (
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
      )}
    </div>
  );
}
