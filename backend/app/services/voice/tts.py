from kokoro_onnx import Kokoro
import numpy as np
import io
import wave
import subprocess
import tempfile
import os

kokoro = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")

CHARACTERS = {
    "BOLT": {
        "voice": "hm_omega", "speed": 1.0,
        "ffmpeg": "asetrate=16000,aresample=24000,atempo=1.5,aecho=0.9:0.7:35:0.5,volume=4.0",
        "ffmpeg_question": "asetrate=16000,aresample=24000,atempo=1.5,aecho=0.9:0.7:35:0.5,vibrato=f=2:d=0.15,volume=4.0",
    },
    "ZARA": {
        "voice": "hf_alpha", "speed": 1.0,
        "ffmpeg": "asetrate=32000,aresample=24000,atempo=0.75,vibrato=f=5:d=0.25,aphaser=in_gain=0.8:out_gain=0.9:delay=3:decay=0.4:speed=1.5:type=t,volume=3.0",
        "ffmpeg_question": "asetrate=32000,aresample=24000,atempo=0.75,vibrato=f=7:d=0.35,aphaser=in_gain=0.8:out_gain=0.9:delay=3:decay=0.4:speed=2.0:type=t,volume=3.5",
    },
    "NOVA": {
        "voice": "hf_beta", "speed": 1.0,
        "ffmpeg": "asetrate=21000,aresample=24000,atempo=1.14,chorus=0.5:0.9:50:0.4:0.25:2,volume=3.0",
        "ffmpeg_question": "asetrate=21000,aresample=24000,atempo=1.14,chorus=0.6:0.9:50:0.5:0.3:2,vibrato=f=1.5:d=0.1,volume=3.0",
    },
    "BEEP": {
        "voice": "hm_psi", "speed": 1.0,
        "ffmpeg": "asetrate=38000,aresample=24000,atempo=0.63,vibrato=f=8:d=0.3,volume=4.0",
        "ffmpeg_question": "asetrate=38000,aresample=24000,atempo=0.63,vibrato=f=12:d=0.4,aecho=0.7:0.4:15:0.2,volume=4.5",
    },
    "ECHO": {
        "voice": "hm_omega", "speed": 1.0,
        "ffmpeg": "asetrate=18000,aresample=24000,atempo=1.33,aecho=0.8:0.6:60:0.4,tremolo=f=2:d=0.3,volume=4.0",
        "ffmpeg_question": "asetrate=18000,aresample=24000,atempo=1.33,aecho=0.8:0.6:60:0.4,tremolo=f=3:d=0.4,vibrato=f=1:d=0.2,volume=4.0",
    },
    "MIRA": {
        "voice": "hf_alpha", "speed": 1.0,
        "ffmpeg": "asetrate=20000,aresample=24000,atempo=1.2,aphaser=in_gain=0.8:out_gain=0.9:delay=5:decay=0.5:speed=0.8:type=t,chorus=0.6:0.9:60:0.4:0.3:2,volume=6.0",
        "ffmpeg_question": "asetrate=20000,aresample=24000,atempo=1.2,aphaser=in_gain=0.8:out_gain=0.9:delay=5:decay=0.5:speed=1.2:type=t,chorus=0.7:0.9:60:0.5:0.35:2,tremolo=f=4:d=0.3,volume=6.0",
    },
}

INTRO_LINES = {
    "BOLT": "Hi! I am Bolt, your brave space robot friend. Let us learn together!",
    "ZARA": "Hello! I am Zara, from planet Zorb. I love learning new words with you!",
    "NOVA": "Greetings. I am Nova, your calm and wise guide. Ready to begin?",
    "BEEP": "Beep beep! I am Beep, your tiny helper robot. Let us have fun learning!",
    "ECHO": "Hello there. I am Echo, an ancient computer from a distant galaxy. Shall we start?",
    "MIRA": "Hi friend! I am Mira, your friendly underwater robot. Let us explore words today!",
}

# Hindi/Kannada don't have distinct gTTS voices per character — only one voice
# exists per language. To still give each character a distinct identity, pitch
# is shifted per-character via asetrate BEFORE the ffmpeg effects chain runs,
# so BOLT/ZARA/etc sound different even on the shared gTTS base voice.
GTTS_PITCH_SHIFT = {
    "BOLT": 0.85,   # deeper
    "ZARA": 1.25,   # higher/alien
    "NOVA": 1.0,    # neutral
    "BEEP": 1.5,    # very high/squeaky
    "ECHO": 0.75,   # lowest/eerie
    "MIRA": 1.1,    # slightly high
}


def _romanize(text: str, language: str) -> str:
    """Convert Hindi/Kannada script to romanized form for Kokoro TTS."""
    if language == "english":
        return text
    try:
        from indic_transliteration import sanscript
        from indic_transliteration.sanscript import transliterate
        if language == "hindi":
            result = transliterate(text, sanscript.DEVANAGARI, sanscript.ITRANS)
        elif language == "kannada":
            result = transliterate(text, sanscript.KANNADA, sanscript.ITRANS)
        else:
            return text
        result = result.lower().replace("aa", "a").replace("ii", "ee").replace("uu", "oo")
        print(f"Romanized '{text}' -> '{result}'")
        return result
    except Exception as e:
        print(f"Romanize error: {e}")
        return text

def _is_question(text: str) -> bool:
    t = text.strip()
    question_words = ("shall", "can", "could", "would", "should", "is", "are", "do", "does", "did", "ready", "want")
    return t.endswith("?") or t.lower().startswith(question_words)

def _apply_ffmpeg(raw_bytes: bytes, filters: str) -> bytes:
    in_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    in_tmp.write(raw_bytes)
    in_tmp.close()
    out_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    out_tmp.close()
    try:
        cmd = ["ffmpeg", "-y", "-i", in_tmp.name, "-af", filters, "-ar", "24000", out_tmp.name]
        subprocess.run(cmd, check=True, capture_output=True)
        with open(out_tmp.name, "rb") as f:
            return f.read()
    except subprocess.CalledProcessError as e:
        print(f"ffmpeg error: {e.stderr.decode()}")
        return raw_bytes
    finally:
        os.unlink(in_tmp.name)
        if os.path.exists(out_tmp.name):
            os.unlink(out_tmp.name)

def _render_gtts_raw(text: str, language: str) -> bytes:
    """Render raw gTTS audio (no character effects, no pitch shift) as WAV bytes."""
    from gtts import gTTS
    lang_code = "hi" if language == "hindi" else "kn"
    tts = gTTS(text, lang=lang_code, slow=False)
    mp3_buf = io.BytesIO()
    tts.write_to_fp(mp3_buf)
    mp3_buf.seek(0)
    in_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    in_tmp.write(mp3_buf.read())
    in_tmp.close()
    out_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    out_tmp.close()
    try:
        cmd = ["ffmpeg", "-y", "-i", in_tmp.name, "-ar", "24000", out_tmp.name]
        subprocess.run(cmd, check=True, capture_output=True)
        with open(out_tmp.name, "rb") as f:
            return f.read()
    finally:
        os.unlink(in_tmp.name)
        if os.path.exists(out_tmp.name):
            os.unlink(out_tmp.name)

def _render_gtts(text: str, language: str, character: str, ffmpeg_filters: str = "") -> bytes:
    raw_bytes = _render_gtts_raw(text, language)
    pitch = GTTS_PITCH_SHIFT.get(character, 1.0)
    pitch_filter = f"asetrate=24000*{pitch},aresample=24000"
    combined_filters = f"{pitch_filter},{ffmpeg_filters}" if ffmpeg_filters else pitch_filter
    return _apply_ffmpeg(raw_bytes, combined_filters)

def _render_kokoro_raw(text: str, voice: str, speed: float) -> bytes:
    """Render raw Kokoro audio (no character ffmpeg effects) as WAV bytes."""
    samples, sample_rate = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes((samples * 32767).astype(np.int16).tobytes())
    return buf.getvalue()

def _render(text: str, character: str, voice: str, speed: float, ffmpeg_filters: str = "", ffmpeg_question: str = "", language: str = "english") -> bytes:
    filters = ffmpeg_question if (ffmpeg_question and _is_question(text)) else ffmpeg_filters

    if language in ("hindi", "kannada"):
        return _render_gtts(text, language, character, filters)

    raw_bytes = _render_kokoro_raw(text, voice, speed)
    if filters:
        return _apply_ffmpeg(raw_bytes, filters)
    return raw_bytes

def speak_word(word: str, speed: float = 1.0, voice: str = "hf_alpha", character: str = "BOLT", language: str = "english") -> bytes:
    cfg = CHARACTERS.get(character.upper(), CHARACTERS["BOLT"])
    return _render(word, character.upper(), voice, speed, cfg["ffmpeg"], cfg.get("ffmpeg_question", ""), language=language)

def speak_intro(character: str) -> bytes:
    char = character.upper()
    cfg = CHARACTERS.get(char, CHARACTERS["BOLT"])
    line = INTRO_LINES.get(char, "Hello! Let us learn together!")
    return _render(line, char, cfg["voice"], cfg["speed"], cfg["ffmpeg"], cfg.get("ffmpeg_question", ""))

def speak(text: str, character: str = "BOLT", mood: str = "default", speed: float = None, language: str = "english") -> bytes:
    char = character.upper()
    cfg = CHARACTERS.get(char, CHARACTERS["BOLT"])
    s = speed if speed is not None else cfg["speed"]
    return _render(text, char, cfg["voice"], s, cfg["ffmpeg"], cfg.get("ffmpeg_question", ""), language=language)

def get_characters():
    return [{"id": k, "name": k, "tagline": INTRO_LINES[k][:40]} for k in CHARACTERS]

def warm_cache():
    pass

def precache_words(words):
    pass
