from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import tempfile
import os
import uuid
from g2p_en import G2p
import epitran

from app.core.config import settings
from app.services.phoneme.svg import get_phoneme_card
from app.services.phoneme.drill import (
    get_acoustic_feedback, build_drill_sequence,
    detect_struggling_phonemes, should_enter_drill_mode,
    get_encouragement_message
)
from app.services.audio.processor import analyse_audio
from app.services.evaluation.scorer import build_attempt_result
from app.services.voice.tts import speak, get_characters
from app.services.image.matcher import get_image_for_phrase

app = FastAPI(title="VaakSiddhi Autism", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Whisper model...")
whisper = WhisperModel(settings.WHISPER_MODEL, device=settings.WHISPER_DEVICE, compute_type=settings.WHISPER_COMPUTE_TYPE)
print("Whisper loaded.")

g2p = G2p()
epi_hindi = epitran.Epitran("hin-Deva")

def get_phonemes(word: str, language: str) -> list:
    if language == "hindi":
        return list(epi_hindi.trans_list(word))
    phones = g2p(word)
    return [p.rstrip("012") for p in phones if p.strip() and p not in [" ", ""]]

@app.get("/")
def root():
    return {"status": "VaakSiddhi Autism backend running", "version": "1.0.0"}

@app.get("/characters")
def characters():
    return {"characters": get_characters()}

@app.post("/phonemes")
async def phonemes(word: str = Form(...), language: str = Form(default="english")):
    phones = get_phonemes(word, language)
    return {"word": word, "phonemes": phones, "language": language}

@app.post("/speak")
async def speak_endpoint(text: str = Form(...), character: str = Form(default="BOLT"), mood: str = Form(default="default")):
    audio_bytes = speak(text, character, mood)
    return Response(content=audio_bytes, media_type="audio/wav")

@app.post("/image")
async def image_endpoint(phrase: str = Form(...)):
    result = get_image_for_phrase(phrase)
    if not result["found"]:
        return {"found": False, "phrase": phrase}
    return Response(
        content=result["image_bytes"],
        media_type="image/png",
        headers={
            "X-Matched-Word": result["matched_word"],
            "X-Match-Type": result["match_type"],
            "X-Confidence": str(result["confidence"])
        }
    )

@app.post("/compare")
async def compare(
    audio: UploadFile = File(...),
    target_word: str = Form(...),
    language: str = Form(default="english"),
    condition: str = Form(default="autism"),
    attempt_number: int = Form(default=1),
    session_id: str = Form(default=None),
    child_id: str = Form(default=None),
    character: str = Form(default="BOLT"),
):
    session_id = session_id or str(uuid.uuid4())
    child_id = child_id or "anonymous"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name

    try:
        segments, _ = whisper.transcribe(tmp_path)
        transcript = " ".join([s.text.strip() for s in segments]).strip().lower()
        target_phonemes = get_phonemes(target_word, language)
        detected_phonemes = get_phonemes(transcript, language) if transcript else []
        acoustic_raw = analyse_audio(tmp_path, transcript)
        result = build_attempt_result(
            session_id=session_id,
            child_id=child_id,
            target_word=target_word,
            target_phonemes=target_phonemes,
            transcript=transcript,
            detected_phonemes=detected_phonemes,
            acoustic_raw=acoustic_raw,
            attempt_number=attempt_number,
            condition=condition,
            character=character,
        )
        return result
    finally:
        os.unlink(tmp_path)


@app.post("/input-word")
async def input_word(
    text: str = Form(default=None),
    audio: UploadFile = File(default=None),
    language: str = Form(default="english"),
    character: str = Form(default="BOLT"),
    mood: str = Form(default="instruction"),
):
    """
    Therapist inputs a word — either as text or voice.
    Returns: phonemes + character audio + image.
    """
    # Step 1: get the word
    if text:
        word = text.strip().lower()
    elif audio:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name
        try:
            segments, _ = whisper.transcribe(tmp_path)
            word = " ".join([s.text.strip() for s in segments]).strip().lower()
        finally:
            os.unlink(tmp_path)
    else:
        return {"error": "Provide either text or audio"}

    # Step 2: get phonemes
    phonemes = get_phonemes(word, language)

    # Step 3: generate character audio
    prompt = f"Say this word: {word}"
    audio_bytes = speak(prompt, character, mood)

    # Step 4: get image
    image_result = get_image_for_phrase(word)

    return {
        "word": word,
        "phonemes": phonemes,
        "language": language,
        "character_audio_base64": __import__("base64").b64encode(audio_bytes).decode(),
        "image_found": image_result["found"],
        "image_base64": __import__("base64").b64encode(image_result["image_bytes"]).decode() if image_result.get("image_bytes") else None,
        "matched_word": image_result.get("matched_word"),
    }


@app.post("/evaluate")
async def evaluate(
    audio: UploadFile = File(...),
    target_word: str = Form(...),
    language: str = Form(default="english"),
    condition: str = Form(default="autism"),
    attempt_number: int = Form(default=1),
    session_id: str = Form(default=None),
    child_id: str = Form(default=None),
    character: str = Form(default="BOLT"),
    attempt_history: str = Form(default="[]"),
):
    """
    Full evaluation endpoint with drill mode detection,
    acoustic feedback, and encouragement.
    """
    import json
    session_id = session_id or str(uuid.uuid4())
    child_id = child_id or "anonymous"
    history = json.loads(attempt_history)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name

    try:
        segments, _ = whisper.transcribe(tmp_path)
        transcript = " ".join([s.text.strip() for s in segments]).strip().lower()
        target_phonemes = get_phonemes(target_word, language)
        detected_phonemes = get_phonemes(transcript, language) if transcript else []
        acoustic_raw = analyse_audio(tmp_path, transcript)

        result = build_attempt_result(
            session_id=session_id,
            child_id=child_id,
            target_word=target_word,
            target_phonemes=target_phonemes,
            transcript=transcript,
            detected_phonemes=detected_phonemes,
            acoustic_raw=acoustic_raw,
            attempt_number=attempt_number,
            condition=condition,
            character=character,
        )

        result_dict = result.dict()
        history.append(result_dict)

        # Acoustic feedback
        acoustic_tips = get_acoustic_feedback(acoustic_raw, condition)

        # Encouragement + next action
        encouragement = get_encouragement_message(
            result.composite_score, attempt_number, condition
        )

        # Drill mode detection
        enter_drill = should_enter_drill_mode(history)
        drill_sequence = []
        if enter_drill:
            struggling = detect_struggling_phonemes(history)
            drill_sequence = build_drill_sequence(struggling, condition)

        # Generate character response audio
        response_audio = speak(encouragement["message"], character, encouragement["mood"])

        return {
            **result_dict,
            "acoustic_tips": acoustic_tips,
            "encouragement": encouragement,
            "enter_drill_mode": enter_drill,
            "drill_sequence": drill_sequence,
            "character_response_audio": __import__("base64").b64encode(response_audio).decode(),
        }

    finally:
        os.unlink(tmp_path)


@app.get("/phoneme-card/{phoneme}")
def phoneme_card(phoneme: str):
    """Get the phoneme card with SVG mouth diagram and tip."""
    card = get_phoneme_card(phoneme.upper())
    if not card:
        return {"error": f"Phoneme {phoneme} not found"}
    return card


@app.post("/playback-compare")
async def playback_compare(
    child_audio: UploadFile = File(...),
    target_word: str = Form(...),
    character: str = Form(default="BOLT"),
    language: str = Form(default="english"),
):
    """
    Returns both the child recording and character audio
    so the child can compare them side by side.
    """
    child_bytes = await child_audio.read()
    character_text = f"{target_word}"
    character_audio = speak(character_text, character, "instruction")

    return {
        "child_audio": __import__("base64").b64encode(child_bytes).decode(),
        "character_audio": __import__("base64").b64encode(character_audio).decode(),
        "target_word": target_word,
    }
