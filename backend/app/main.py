import nltk
nltk.download('averaged_perceptron_tagger_eng', quiet=True)
nltk.download('cmudict', quiet=True)
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
from app.services.voice.tts import speak_word, speak, speak_intro
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
epi_kannada = epitran.Epitran("kan-Knda")


# Common word dictionary for image lookup
WORD_DICT = {
    # Hindi
    "बिल्ली": "cat", "कुत्ता": "dog", "पक्षी": "bird", "मछली": "fish",
    "गाय": "cow", "हाथी": "elephant", "शेर": "lion", "बाघ": "tiger",
    "बंदर": "monkey", "खरगोश": "rabbit", "बतख": "duck", "मेंढक": "frog",
    "सेब": "apple", "केला": "banana", "आम": "mango", "चावल": "rice",
    "रोटी": "bread", "दूध": "milk", "अंडा": "egg", "पानी": "water",
    "संतरा": "orange", "अंगूर": "grape", "लाल": "red", "नीला": "blue",
    "हरा": "green", "पीला": "yellow", "नारंगी": "orange", "सफेद": "white",
    "काला": "black", "माँ": "mother", "पापा": "father", "बच्चा": "baby",
    "बहन": "sister", "भाई": "brother", "दादी": "grandmother", "दादा": "grandfather",
    "गेंद": "ball", "किताब": "book", "बैग": "bag", "कुर्सी": "chair",
    "मेज़": "table", "कप": "cup", "जूता": "shoe", "पेड़": "tree", "फूल": "flower",
    "दौड़ना": "run", "कूदना": "jump", "खाना": "eat", "पीना": "drink",
    "सोना": "sleep", "खेलना": "play", "चलना": "walk", "गाना": "sing",
    # Kannada
    "ಬೆಕ್ಕು": "cat", "ನಾಯಿ": "dog", "ಹಕ್ಕಿ": "bird", "ಮೀನು": "fish",
    "ಹಸು": "cow", "ಆನೆ": "elephant", "ಸಿಂಹ": "lion", "ಹುಲಿ": "tiger",
    "ಕೋತಿ": "monkey", "ಮೊಲ": "rabbit", "ಬಾತುಕೋಳಿ": "duck", "ಕಪ್ಪೆ": "frog",
    "ಸೇಬು": "apple", "ಬಾಳೆಹಣ್ಣು": "banana", "ಮಾವಿನಹಣ್ಣು": "mango", "ಅನ್ನ": "rice",
    "ರೊಟ್ಟಿ": "bread", "ಹಾಲು": "milk", "ಮೊಟ್ಟೆ": "egg", "ನೀರು": "water",
    "ಕಿತ್ತಳೆ": "orange", "ದ್ರಾಕ್ಷಿ": "grape", "ಕೆಂಪು": "red", "ನೀಲಿ": "blue",
    "ಹಸಿರು": "green", "ಹಳದಿ": "yellow", "ಬಿಳಿ": "white", "ಕಪ್ಪು": "black",
    "ಅಮ್ಮ": "mother", "ಅಪ್ಪ": "father", "ಮಗು": "baby", "ತಂಗಿ": "sister",
    "ಅಣ್ಣ": "brother", "ಅಜ್ಜಿ": "grandmother", "ತಾತ": "grandfather",
    "ಚೆಂಡು": "ball", "ಪುಸ್ತಕ": "book", "ಚೀಲ": "bag", "ಕುರ್ಚಿ": "chair",
    "ಮೇಜು": "table", "ಕಪ್": "cup", "ಚಪ್ಪಲಿ": "shoe", "ಮರ": "tree", "ಹೂವು": "flower",
    "ಓಡು": "run", "ಜಿಗಿ": "jump", "ತಿನ್ನು": "eat", "ಕುಡಿ": "drink",
    "ಮಲಗು": "sleep", "ಆಡು": "play", "ನಡೆ": "walk", "ಹಾಡು": "sing",
}


# Translation cache to avoid repeated API calls
_translation_cache = {}

def translate_to_language(text: str, language: str) -> str:
    """Translate text to target language using Google Translate (deep-translator)."""
    if language == "english" or not text:
        return text
    cache_key = f"{language}:{text}"
    if cache_key in _translation_cache:
        return _translation_cache[cache_key]
    try:
        from deep_translator import GoogleTranslator
        lang_code = "hi" if language == "hindi" else "kn"
        translated = GoogleTranslator(source="en", target=lang_code).translate(text)
        if translated and translated != text:
            _translation_cache[cache_key] = translated
            print(f"Translated: '{text}' -> '{translated}'")
            return translated
    except Exception as e:
        print(f"Translation error: {e}")
    return text

def word_to_english(word: str, language: str) -> str:
    """Translate a word to English for image lookup."""
    if language == "english":
        return word
    # Check dictionary first
    if word in WORD_DICT:
        translated = WORD_DICT[word]
        print(f"Dict translated '{word}' -> '{translated}'")
        return translated
    # Try MyMemory free translation API as fallback
    try:
        lang_code = "hi" if language == "hindi" else "kn"
        url = f"https://api.mymemory.translated.net/get?q={word}&langpair={lang_code}|en"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            translated = data.get("responseData", {}).get("translatedText", "").lower().strip()
            if translated and translated != word:
                print(f"API translated '{word}' -> '{translated}'")
                return translated
    except Exception as e:
        print(f"Translation API error: {e}")
    return word

def get_phonemes(word: str, language: str) -> list:
    if language == "hindi":
        return list(epi_hindi.trans_list(word))
    if language == "kannada":
        return list(epi_kannada.trans_list(word))
    phones = g2p(word)
    return [p.rstrip("012") for p in phones if p.strip() and p not in [" ", ""]]

@app.on_event("startup")
async def startup_event():
    from app.services.voice.tts import warm_cache, precache_words, speak_intro, CHARACTERS
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, warm_cache)
    COMMON_WORDS = [
        "ball", "cat", "dog", "sun", "tree", "fish", "bird", "house",
        "book", "cup", "bed", "car", "bus", "egg", "milk", "rice",
        "happy", "sad", "run", "jump", "eat", "sleep", "play", "sit",
        "red", "blue", "green", "big", "small", "one", "two", "three"
    ]
    loop.run_in_executor(None, precache_words, COMMON_WORDS)

    def cache_intros():
        for char in CHARACTERS:
            try:
                speak_intro(char)
                print(f"Intro cached: {char}")
            except Exception as e:
                print(f"Intro cache failed: {char} — {e}")

    loop.run_in_executor(None, cache_intros)


INTRO_LINES = {
    "BOLT": "Hi! I am Bolt, your brave space robot friend. Let us learn together!",
    "ZARA": "Hello! I am Zara, from planet Zorb. I love learning new words with you!",
    "NOVA": "Greetings. I am Nova, your calm and wise guide. Ready to begin?",
    "BEEP": "Beep beep! I am Beep, your tiny helper robot. Let us have fun learning!",
    "ECHO": "Hello there. I am Echo, an ancient computer from a distant galaxy. Shall we start?",
    "MIRA": "Hi friend! I am Mira, your friendly underwater robot. Let us explore words today!",
}

CHAR_VOICES = {
    "BOLT": ("af_heart", 0.9),
    "ZARA": ("af_heart", 1.1),
    "NOVA": ("af_heart", 0.85),
    "BEEP": ("af_heart", 1.2),
    "ECHO": ("af_heart", 0.8),
    "MIRA": ("af_heart", 1.05),
}

@app.get("/speak/intro/{character}")
async def speak_intro_endpoint(character: str):
    audio_bytes = speak_intro(character)
    return Response(content=audio_bytes, media_type="audio/wav")


@app.post("/translate")
async def translate_word(
    text: str = Form(...),
    target_language: str = Form(default="hindi"),
):
    """Translate English word to target language using Helsinki-NLP."""
    try:
        from transformers import pipeline
        if target_language == "hindi":
            model = "Helsinki-NLP/opus-mt-en-hi"
        elif target_language == "kannada":
            model = "Helsinki-NLP/opus-mt-en-dra"
        else:
            return {"translated": text}
        
        translator = pipeline("translation", model=model)
        result = translator(text, max_length=100)
        translated = result[0]["translation_text"]
        return {"translated": translated, "original": text, "language": target_language}
    except Exception as e:
        print(f"Translation error: {e}")
        return {"translated": text, "error": str(e)}

@app.get("/characters")
async def get_characters_endpoint():
    return {"characters": list(INTRO_LINES.keys())}

@app.post("/speak/word")
async def speak_word_endpoint(
    word: str = Form(...),
    speed: float = Form(default=1.0),
    language: str = Form(default="english")
):
    """Pronounce a word using XTTS Indian accent voice."""
    from app.services.voice.tts import speak_word, speak, speak_intro
    audio_bytes = speak_word(word, speed, language=language)
    return Response(content=audio_bytes, media_type="audio/wav")



@app.get("/debug/voice/{character}")
def debug_voice(character: str):
    from app.services.voice.tts import _render, CHARACTERS
    import traceback
    try:
        cfg = CHARACTERS.get(character.upper(), CHARACTERS["BOLT"])
        audio = _render("Hello I am a test", cfg["voice"], 1.0, cfg["ffmpeg"])
        return {"success": True, "bytes": len(audio), "character": character}
    except Exception as e:
        return {"success": False, "error": str(e), "trace": traceback.format_exc()}

@app.get("/debug/ffmpeg")
def debug_ffmpeg():
    import subprocess
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        return {"ffmpeg": result.stdout[:300], "available": True}
    except Exception as e:
        return {"ffmpeg": str(e), "available": False}

@app.get("/")
def root():
    return {"status": "VaakSiddhi Autism backend running", "version": "1.0.0"}

@app.post("/phonemes")
async def phonemes(word: str = Form(...), language: str = Form(default="english")):
    phones = get_phonemes(word, language)
    return {"word": word, "phonemes": phones, "language": language}

@app.post("/speak")
async def speak_endpoint(text: str = Form(...), character: str = Form(default="BOLT"), mood: str = Form(default="default"), speed: float = Form(default=1.0), language: str = Form(default="english")):
    audio_bytes = speak(text, character, mood, speed, language=language)
    return Response(content=audio_bytes, media_type="audio/wav")

@app.post("/image")
async def image_endpoint(phrase: str = Form(...)):
    result = get_image_for_phrase(phrase)
    if not result["found"]:
        return {"found": False, "phrase": phrase}
    return {
        "found": True,
        "matched_word": result.get("matched_word"),
        "match_type": result.get("match_type"),
        "confidence": result.get("confidence", 100),
        "image_base64": __import__("base64").b64encode(result["image_bytes"]).decode(),
        "images": [
            {**img, "label": word, "image_base64": __import__("base64").b64encode(img["image_bytes"]).decode(), "image_bytes": None, "image_base64_2": __import__("base64").b64encode(img["image_bytes_2"]).decode() if img.get("image_bytes_2") else None, "image_bytes_2": None}
            for img in result.get("images", [])
        ]
    }

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

    import subprocess
    raw = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    raw.write(await audio.read())
    raw.close()
    tmp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    tmp_wav.close()
    subprocess.run(["ffmpeg", "-y", "-i", raw.name, "-ar", "16000", "-ac", "1", "-af", "volume=3.0,highpass=f=100,lowpass=f=3000", tmp_wav.name], capture_output=True)
    os.unlink(raw.name)
    tmp_path = tmp_wav.name

    try:
        whisper_lang = "hi" if language == "hindi" else "kn" if language == "kannada" else "en"
        segments, _ = whisper.transcribe(tmp_path, language=whisper_lang, condition_on_previous_text=False, beam_size=5, best_of=5, temperature=0.0)
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
            segments, _ = whisper.transcribe(tmp_path, language="en", condition_on_previous_text=False, beam_size=5, best_of=5, temperature=0.0, initial_prompt="A single English word spoken clearly. Indian English accent.")
            word = " ".join([s.text.strip() for s in segments]).strip().lower()
        finally:
            os.unlink(tmp_path)
    else:
        return {"error": "Provide either text or audio"}

    # Step 2: get phonemes
    phonemes = get_phonemes(word, language)

    # Step 3: generate character audio
    prompt = f"The word is. {word}. {word}."
    audio_bytes = speak(prompt, character, mood, language=language)

    # Step 4: get image
    english_word = word_to_english(word, language)
    image_result = get_image_for_phrase(english_word)

    images = []
    for img in image_result.get("images", []):
        if img.get("image_bytes"):
            images.append({**img, "image_base64": __import__("base64").b64encode(img["image_bytes"]).decode(), "image_bytes": None, "image_base64_2": __import__("base64").b64encode(img["image_bytes_2"]).decode() if img.get("image_bytes_2") else None, "image_bytes_2": None})
    return {
        "word": word,
        "phonemes": phonemes,
        "language": language,
        "character_audio_base64": __import__("base64").b64encode(audio_bytes).decode(),
        "image_found": image_result["found"],
        "image_base64": __import__("base64").b64encode(image_result["image_bytes"]).decode() if image_result.get("image_bytes") else None,
        "matched_word": image_result.get("matched_word"),
        "images": images,
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

    import subprocess
    raw = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    raw.write(await audio.read())
    raw.close()
    tmp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    tmp_wav.close()
    subprocess.run(["ffmpeg", "-y", "-i", raw.name, "-ar", "16000", "-ac", "1", "-af", "volume=3.0,highpass=f=100,lowpass=f=3000", tmp_wav.name], capture_output=True)
    os.unlink(raw.name)
    tmp_path = tmp_wav.name

    try:
        whisper_lang = "hi" if language == "hindi" else "kn" if language == "kannada" else "en"
        segments, _ = whisper.transcribe(tmp_path, language=whisper_lang, condition_on_previous_text=False, beam_size=5, best_of=5, temperature=0.0)
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
            result.composite_score, attempt_number, condition, language=language
        )

        # Drill mode detection
        enter_drill = should_enter_drill_mode(history)
        drill_sequence = []
        if enter_drill:
            struggling = detect_struggling_phonemes(history)
            drill_sequence = build_drill_sequence(struggling, condition)

        # Generate character response audio
        response_audio = speak(encouragement["message"], character, encouragement["mood"], language=language)

        # Translate feedback and tips
        if result_dict.get("feedback"):
            result_dict["feedback"] = translate_to_language(result_dict["feedback"], language)
        acoustic_tips = [
            {**tip, "tip": translate_to_language(tip.get("tip", ""), language)}
            for tip in acoustic_tips
        ]

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
def phoneme_card(phoneme: str, language: str = "english"):
    """Get the phoneme card with SVG mouth diagram and tip."""
    card = get_phoneme_card(phoneme.upper())
    if not card:
        return {"error": f"Phoneme {phoneme} not found"}
    if language != "english":
        card = dict(card)
        if card.get("tip"):
            card["tip"] = translate_to_language(card["tip"], language)
        if card.get("name"):
            card["name"] = translate_to_language(card["name"], language)
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
# force rebuild
# cache bust Sun Jul 19 16:46:41 IST 2026
