---
title: Vaaksiddhi
emoji: 🎙️
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# VaakSiddhi

A speech practice web app that helps children — especially those working with speech-language pathologists — practice pronunciation through a guided, game-like flow with animated character companions. Supports **English, Hindi, and Kannada**.

## How it works

1. **Pick a language** — English, Hindi, or Kannada.
2. **Pick a character friend** — BOLT, ZARA, NOVA, BEEP, ECHO, or MIRA, each with a distinct voice and personality.
3. **A therapist or caregiver enters a target word.**
4. **The child listens, then records themselves** saying the word (with a normal/slow playback option).
5. **The app evaluates the attempt** — transcription accuracy, phoneme-level accuracy (including tricky sound pairs like dental vs. retroflex or aspirated vs. unaspirated consonants in Hindi/Kannada), and acoustic quality (loudness, pitch, speaking rate, voice quality).
6. **The character gives encouraging, tiered feedback** based on the score and attempt number.
7. **Drill mode** kicks in automatically if a child struggles repeatedly with the same sounds, building a focused practice sequence around them.

## Architecture

```
frontend/   React + Vite + Tailwind, deployed on Vercel
backend/    FastAPI, deployed on Hugging Face Spaces (Docker)
```

### Backend

- **Speech-to-text**: [`faster-whisper`](https://github.com/SYSTRAN/faster-whisper) for transcription.
- **Confusable-phoneme evaluation**: dedicated CTC models — [`ai4bharat/indicwav2vec-hindi`](https://huggingface.co/ai4bharat/indicwav2vec-hindi) and [`amoghsgopadi/wav2vec2-large-xlsr-kn`](https://huggingface.co/amoghsgopadi/wav2vec2-large-xlsr-kn) — score audio directly against known confusable sound pairs (e.g. त/ट, क/ख, vowel length pairs) rather than relying solely on open transcription, which is unreliable for these distinctions. Every confusable sound present in a target word is checked, not just the first one found. Only one model is kept resident in memory at a time; switching languages evicts and reloads the other.
- **Text-to-speech**: [Kokoro ONNX](https://github.com/thewh1teagle/kokoro-onnx) for English (a distinct voice per character), gTTS + per-character pitch-shifting via ffmpeg for Hindi/Kannada (gTTS only offers one voice per language, so pitch shift + audio effects give each character a distinct identity).
- **In-app assistant chatbot**: answers questions about the app and speech therapy using a hand-curated Q&A bank + [`sentence-transformers`](https://www.sbert.net/) similarity matching — **no LLM calls involved**, fully local, free, and instant. Falls back to a friendly "I'm not sure" message for genuinely unmatched questions.
- **Acoustic analysis**: `praat-parselmouth` and `librosa` for pitch, loudness, jitter/shimmer/HNR, and speaking rate.
- **Phoneme transcription** (for scoring, separate from the confusable-sound model): `epitran` for Hindi/Kannada IPA, `g2p-en` for English.

### Frontend

- React + Vite + Tailwind, deployed on Vercel.
- Each character has a themed color palette, unique voice, and an animated decorative background (`CharacterBackdrop.jsx`) — circuit hexes for BOLT, sparkles for ZARA, falling leaves for NOVA, bouncing blips for BEEP, glitch scan-lines for ECHO, bubbles and fish for MIRA.

## Running locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in required values, see Configuration below
uvicorn app.main:app --reload --port 8000
```

The first run will download several models (Whisper, IndicWav2Vec2, wav2vec2-kn) — this can take a while depending on connection speed. Some models on Hugging Face are gated and require running `hf auth login` with a valid token before they'll download.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Configuration

Backend environment variables (`.env`):

| Variable | Description | Default |
|---|---|---|
| `WHISPER_MODEL` | faster-whisper model size | `medium` |
| `WHISPER_DEVICE` | `cpu` or `cuda` | `cpu` |
| `WHISPER_COMPUTE_TYPE` | quantization | `int8` |
| `MAX_ATTEMPTS` | attempts before drill mode consideration | `3` |
| `SCORE_PASS` / `SCORE_RETRY` / `SCORE_SIMPLIFY` / `SCORE_SUPPORT` | scoring thresholds | `80` / `60` / `40` / `20` |

A Hugging Face access token (`hf auth login`) is required locally to download the gated IndicWav2Vec2 Hindi model on first run.

## Deployment

- **Backend**: Hugging Face Spaces (Docker SDK, see `Dockerfile`/`start.sh`). Push to the `space` git remote to deploy.
- **Frontend**: Vercel. Run `vercel --prod` from the `frontend/` directory (or repo root, depending on how the Vercel project's root directory is configured) to deploy.

## Project structure

```
backend/
  app/
    main.py                    FastAPI routes
    core/config.py              Settings (pydantic-settings, reads .env)
    phoneme_eval.py             Confusable-phoneme scoring (IndicWav2Vec2 / wav2vec2-kn)
    services/
      voice/tts.py               Text-to-speech (Kokoro + gTTS)
      evaluation/scorer.py       Attempt scoring/result building
      audio/processor.py         Acoustic feature extraction
      phoneme/drill.py           Drill mode logic, encouragement messages
      chat_cache.py               QA-bank similarity matching for the assistant
    scripts/
      seed_chat_cache.py         Populates the assistant's Q&A bank
    data/
      knowledge_base.md          Reference material (currently unused by /chat)
      chat_answer_cache.json     Seeded + learned Q&A pairs with embeddings

frontend/
  src/components/
    LanguageSelect.jsx
    CharacterSelect.jsx
    TherapistInput.jsx
    PracticeScreen.jsx
    ResultScreen.jsx
    DrillScreen.jsx
    Sidebar.jsx
    AIAssistant.jsx             In-app chat widget, calls backend /chat
    CharacterBackdrop.jsx       Per-character animated background motifs
```

## Notes for future work

- Confusable-phoneme checking currently covers dental/retroflex, aspiration, sibilant, and vowel-length pairs for Hindi and Kannada. Not yet covered: nasalization distinctions beyond the basic bindu case, and some rarer consonant clusters.
- The assistant's knowledge is a fixed, hand-written Q&A bank — it does not use an LLM, so it can only answer questions it's been seeded with (or that are close enough via similarity matching, threshold `0.5`). Expanding coverage means adding more entries to `seed_chat_cache.py` and re-running it.
- `main.py` has some duplicated evaluation logic across two near-identical route blocks — worth consolidating to avoid the class of bug where a fix lands in one copy but not the other.
