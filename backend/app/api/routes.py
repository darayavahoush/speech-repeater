from fastapi import APIRouter, UploadFile, File, Form, Response
import tempfile
import os
import uuid

from app.core.config import settings
from app.services.audio.processor import analyse_audio
from app.services.evaluation.scorer import build_attempt_result
from app.services.voice.tts import speak, get_characters
from app.services.image.matcher import get_image_for_phrase

router = APIRouter()

@router.get("/debug/ffmpeg")
def debug_ffmpeg():
    import subprocess
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        return {"ffmpeg": result.stdout[:200], "available": True}
    except Exception as e:
        return {"ffmpeg": str(e), "available": False}



@router.get("/characters")
def characters():
    return {"characters": get_characters()}


@router.post("/phonemes")
async def phonemes(word: str = Form(...), language: str = Form(default="english")):
    from app.main import get_phonemes
    phones = get_phonemes(word, language)
    return {"word": word, "phonemes": phones, "language": language}


@router.post("/speak")
async def speak_endpoint(text: str = Form(...), character: str = Form(default="BOLT")):
    audio_bytes = speak(text, character)
    return Response(content=audio_bytes, media_type="audio/wav")


@router.post("/image")
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


@router.post("/compare")
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
    from app.main import get_phonemes
    session_id = session_id or str(uuid.uuid4())
    child_id = child_id or "anonymous"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name

    try:
        from app.main import whisper
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
