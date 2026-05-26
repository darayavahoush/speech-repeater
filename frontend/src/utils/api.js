const BASE_URL = "http://127.0.0.1:8000";

export async function inputWord({ text, audio, character = "BOLT", language = "english", mood = "instruction" }) {
  const form = new FormData();
  if (text) form.append("text", text);
  if (audio) form.append("audio", audio, "recording.wav");
  form.append("character", character);
  form.append("language", language);
  form.append("mood", mood);

  const res = await fetch(`${BASE_URL}/input-word`, { method: "POST", body: form });
  return res.json();
}

export async function evaluateAttempt({ audio, targetWord, character, language, condition, attemptNumber, sessionId, childId, attemptHistory }) {
  const form = new FormData();
  form.append("audio", audio, "recording.wav");
  form.append("target_word", targetWord);
  form.append("character", character || "BOLT");
  form.append("language", language || "english");
  form.append("condition", condition || "autism");
  form.append("attempt_number", attemptNumber || 1);
  if (sessionId) form.append("session_id", sessionId);
  if (childId) form.append("child_id", childId);
  form.append("attempt_history", JSON.stringify(attemptHistory || []));

  const res = await fetch(`${BASE_URL}/evaluate`, { method: "POST", body: form });
  return res.json();
}

export async function getPhonemeCard(phoneme) {
  const res = await fetch(`${BASE_URL}/phoneme-card/${phoneme}`);
  return res.json();
}

export async function getCharacters() {
  const res = await fetch(`${BASE_URL}/characters`);
  return res.json();
}

export async function playbackCompare({ childAudio, targetWord, character, language }) {
  const form = new FormData();
  form.append("child_audio", childAudio, "recording.wav");
  form.append("target_word", targetWord);
  form.append("character", character || "BOLT");
  form.append("language", language || "english");

  const res = await fetch(`${BASE_URL}/playback-compare`, { method: "POST", body: form });
  return res.json();
}

export function base64ToBlob(base64, mime = "audio/wav") {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export function playBase64Audio(base64) {
  const blob = base64ToBlob(base64);
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
  return audio;
}
