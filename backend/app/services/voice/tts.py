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
        "voice": "hm_omega",
        "sox_effects": {
            "default":   "synth sine amod 50 pitch -300 tempo 0.73 vol 2.5",
            "celebrate": "synth sine amod 50 pitch -200 tempo 0.9 vol 2.5",
            "encourage": "synth sine amod 40 pitch -300 tempo 0.67 reverb 15 vol 2.5",
            "question":  "synth sine amod 50 pitch -250 tempo 0.75 vol 2.5",
            "instruction":"synth sine amod 45 pitch -320 tempo 0.67 vol 2.5"
        }
    },
    "ECHO": {
        "name": "ECHO",
        "tagline": "Ancient computer from a distant galaxy",
        "type": "robotic",
        "voice": "hm_omega",
        "sox_effects": {
            "default":   "synth sine amod 30 pitch -600 tempo 0.63 reverb 40 vol 5.0",
            "celebrate": "synth sine amod 30 pitch -500 tempo 0.73 reverb 30 vol 5.0",
            "encourage": "synth sine amod 25 pitch -600 tempo 0.6 reverb 50 vol 5.0",
            "question":  "synth sine amod 30 pitch -550 tempo 0.65 reverb 35 vol 5.0",
            "instruction":"synth sine amod 28 pitch -620 tempo 0.6 reverb 45 vol 5.0"
        }
    },
    "NOVA": {
        "name": "NOVA",
        "tagline": "Calm and wise space AI",
        "type": "semi-robotic",
        "voice": "hm_omega",
        "sox_effects": {
            "default":   "synth sine amod 30 pitch -100 tempo 0.75 reverb 20 vol 5.0",
            "celebrate": "synth sine amod 30 pitch 0 tempo 0.85 reverb 15 vol 5.0",
            "encourage": "synth sine amod 25 pitch -100 tempo 0.73 reverb 25 vol 5.0",
            "question":  "synth sine amod 30 pitch -50 tempo 0.77 reverb 20 vol 5.0",
            "instruction":"synth sine amod 28 pitch -120 tempo 0.72 reverb 22 vol 5.0"
        }
    },
    "ZARA": {
        "name": "ZARA",
        "tagline": "Cheerful alien from planet Zorb",
        "type": "cartoonish",
        "voice": "hf_alpha",
        "sox_effects": {
            "default":   "pitch 500 tempo 1.05 reverb 10",
            "celebrate": "pitch 600 tempo 1.2 reverb 5",
            "encourage": "pitch 450 tempo 0.95 reverb 15",
            "question":  "pitch 550 tempo 1.0 reverb 10",
            "instruction":"pitch 480 tempo 0.95 reverb 10"
        }
    },
    "BEEP": {
        "name": "BEEP",
        "tagline": "Tiny helper robot who loves learning",
        "type": "cartoonish",
        "voice": "hf_alpha",
        "sox_effects": {
            "default":   "pitch 800 tempo 1.15",
            "celebrate": "pitch 900 tempo 1.3",
            "encourage": "pitch 750 tempo 1.05",
            "question":  "pitch 820 tempo 1.13",
            "instruction":"pitch 780 tempo 1.07"
        }
    },
    "MIRA": {
        "name": "MIRA",
        "tagline": "Friendly underwater robot",
        "type": "cartoonish",
        "voice": "hf_alpha",
        "sox_effects": {
            "default":   "pitch -200 tempo 0.7 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 4 60 reverb 50 vol 8.0",
            "celebrate": "pitch -100 tempo 0.8 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 5 70 reverb 40 vol 8.0",
            "encourage": "pitch -220 tempo 0.67 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 3 55 reverb 55 vol 8.0",
            "question":  "pitch -180 tempo 0.72 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 4 60 reverb 50 vol 8.0",
            "instruction":"pitch -210 tempo 0.68 phaser 0.9 0.85 4 0.23 1.3 -s tremolo 3 58 reverb 52 vol 8.0"
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


def speak(text: str, character: str = "BOLT", mood: str = "default", speed: float = 1.0) -> bytes:
    char = CHARACTERS.get(character, CHARACTERS["BOLT"])
    effects = char["sox_effects"].get(mood, char["sox_effects"]["default"])
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    try:
        audio, sr = generate_base_audio(text, char["voice"])
        sf.write(tmp.name, audio, sr)
        # Apply speed scaling on top of character effects
        if speed != 1.0:
            tempo = max(0.5, min(2.0, speed))
            effects = effects + f" tempo {tempo}"
        return apply_sox_effects(tmp.name, effects)
    finally:
        if os.path.exists(tmp.name):
            os.unlink(tmp.name)
