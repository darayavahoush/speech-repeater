import subprocess
import tempfile
import os
import soundfile as sf
import numpy as np
from kokoro import KPipeline

print("Loading Kokoro TTS model...")
_pipeline = KPipeline(lang_code="en-us", repo_id="hexgrad/Kokoro-82M")
print("Kokoro loaded.")

CHARACTERS = {
    "BOLT": {
        "name": "BOLT",
        "tagline": "Brave space robot from the future",
        "type": "robotic",
        "voice": "af_heart",
        "sox_effects": {
            "default":   "synth sine amod 50 pitch -300 tempo 0.88",
            "celebrate": "synth sine amod 50 pitch -200 tempo 1.05",
            "encourage": "synth sine amod 40 pitch -300 tempo 0.82 reverb 15",
            "question":  "synth sine amod 50 pitch -250 tempo 0.9",
            "instruction":"synth sine amod 45 pitch -320 tempo 0.82"
        }
    },
    "ECHO": {
        "name": "ECHO",
        "tagline": "Ancient computer from a distant galaxy",
        "type": "robotic",
        "voice": "af_heart",
        "sox_effects": {
            "default":   "synth sine amod 30 pitch -600 tempo 0.78 reverb 40",
            "celebrate": "synth sine amod 30 pitch -500 tempo 0.88 reverb 30",
            "encourage": "synth sine amod 25 pitch -600 tempo 0.75 reverb 50",
            "question":  "synth sine amod 30 pitch -550 tempo 0.8 reverb 35",
            "instruction":"synth sine amod 28 pitch -620 tempo 0.75 reverb 45"
        }
    },
    "NOVA": {
        "name": "NOVA",
        "tagline": "Calm and wise space AI",
        "type": "semi-robotic",
        "voice": "af_heart",
        "sox_effects": {
            "default":   "synth sine amod 30 pitch -100 tempo 0.9 reverb 20",
            "celebrate": "synth sine amod 30 pitch 0 tempo 1.0 reverb 15",
            "encourage": "synth sine amod 25 pitch -100 tempo 0.88 reverb 25",
            "question":  "synth sine amod 30 pitch -50 tempo 0.92 reverb 20",
            "instruction":"synth sine amod 28 pitch -120 tempo 0.87 reverb 22"
        }
    },
    "ZARA": {
        "name": "ZARA",
        "tagline": "Cheerful alien from planet Zorb",
        "type": "cartoonish",
        "voice": "af_heart",
        "sox_effects": {
            "default":   "pitch 500 tempo 1.2 reverb 10",
            "celebrate": "pitch 600 tempo 1.35 reverb 5",
            "encourage": "pitch 450 tempo 1.1 reverb 15",
            "question":  "pitch 550 tempo 1.15 reverb 10",
            "instruction":"pitch 480 tempo 1.1 reverb 10"
        }
    },
    "BEEP": {
        "name": "BEEP",
        "tagline": "Tiny helper robot who loves learning",
        "type": "cartoonish",
        "voice": "af_heart",
        "sox_effects": {
            "default":   "pitch 800 tempo 1.3",
            "celebrate": "pitch 900 tempo 1.45",
            "encourage": "pitch 750 tempo 1.2",
            "question":  "pitch 820 tempo 1.28",
            "instruction":"pitch 780 tempo 1.22"
        }
    },
    "MIRA": {
        "name": "MIRA",
        "tagline": "Friendly underwater robot",
        "type": "cartoonish",
        "voice": "af_heart",
        "sox_effects": {
            "default":   "pitch -200 tempo 0.85 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 4 60 reverb 50",
            "celebrate": "pitch -100 tempo 0.95 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 5 70 reverb 40",
            "encourage": "pitch -220 tempo 0.82 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 3 55 reverb 55",
            "question":  "pitch -180 tempo 0.87 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 4 60 reverb 50",
            "instruction":"pitch -210 tempo 0.83 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 3 58 reverb 52"
        }
    }
}


def get_characters() -> list:
    return [
        {"id": k, "name": v["name"], "tagline": v["tagline"], "type": v["type"]}
        for k, v in CHARACTERS.items()
    ]


def generate_base_audio(text: str, voice: str) -> tuple:
    generator = _pipeline(text, voice=voice)
    chunks = [chunk[2].numpy() for chunk in generator]
    audio = np.concatenate(chunks) if len(chunks) > 1 else chunks[0]
    return audio, 24000


def apply_sox_effects(wav_path: str, effects: str) -> bytes:
    tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    try:
        cmd = f"sox {wav_path} {tmp_out.name} {effects}"
        subprocess.run(cmd, shell=True, check=True, capture_output=True)
        with open(tmp_out.name, "rb") as f:
            return f.read()
    except subprocess.CalledProcessError:
        with open(wav_path, "rb") as f:
            return f.read()
    finally:
        if os.path.exists(tmp_out.name):
            os.unlink(tmp_out.name)


def speak(text: str, character: str = "BOLT", mood: str = "default") -> bytes:
    char = CHARACTERS.get(character, CHARACTERS["BOLT"])
    effects = char["sox_effects"].get(mood, char["sox_effects"]["default"])
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    try:
        audio, sr = generate_base_audio(text, char["voice"])
        sf.write(tmp.name, audio, sr)
        return apply_sox_effects(tmp.name, effects)
    finally:
        if os.path.exists(tmp.name):
            os.unlink(tmp.name)
