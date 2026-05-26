#!/usr/bin/env python3
"""
Quick backend test — record voice and see full evaluation.
Run: python3 scripts/test_eval.py
"""
import sounddevice as sd
import soundfile as sf
import requests
import json
import tempfile
import base64
import os

BASE_URL = "http://127.0.0.1:8000"

def record_audio(seconds=4, sr=16000):
    print(f"Recording for {seconds} seconds...")
    audio = sd.rec(int(seconds * sr), samplerate=sr, channels=1, dtype="float32")
    sd.wait()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    sf.write(tmp.name, audio, sr)
    return tmp.name

def test_input_word(word, character="BOLT"):
    print(f"\n--- Testing /input-word with word: {word} ---")
    res = requests.post(f"{BASE_URL}/input-word", data={
        "text": word, "character": character, "mood": "instruction"
    })
    d = res.json()
    print(f"Word: {d.get('word')}")
    print(f"Phonemes: {d.get('phonemes')}")
    print(f"Image found: {d.get('image_found')}")
    print(f"Audio generated: {len(d.get('character_audio_base64','')) > 0}")

    # Play the character audio
    if d.get("character_audio_base64"):
        audio_bytes = base64.b64decode(d["character_audio_base64"])
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        tmp.write(audio_bytes)
        tmp.close()
        os.system(f"afplay {tmp.name}")
        os.unlink(tmp.name)

def test_evaluate(word, character="BOLT"):
    print(f"\n--- Testing /evaluate ---")
    print(f"Target word: {word}")
    input("Press Enter then say the word...")
    audio_path = record_audio(seconds=4)

    with open(audio_path, "rb") as f:
        res = requests.post(f"{BASE_URL}/evaluate", data={
            "target_word": word,
            "character": character,
            "condition": "autism",
            "attempt_number": 1,
        }, files={"audio": ("recording.wav", f, "audio/wav")})

    d = res.json()
    print(f"\nTranscript: {d.get('transcript')}")
    print(f"Expected phonemes: {d.get('target_phonemes')}")
    print(f"Detected phonemes: {d.get('detected_phonemes')}")
    print(f"Composite score: {d.get('composite_score')}%")
    print(f"Phoneme accuracy: {d.get('phoneme_scores', {}).get('accuracy')}%")

    acoustic = d.get("acoustic", {})
    print(f"\nAcoustic metrics:")
    print(f"  Loudness: {acoustic.get('loudness_db')} dB")
    print(f"  Pitch: {acoustic.get('pitch_mean_hz')} Hz")
    print(f"  Speaking rate: {acoustic.get('speaking_rate')} syl/sec")
    print(f"  HNR: {acoustic.get('hnr_db')} dB")
    print(f"  Jitter: {acoustic.get('jitter_percent')}%")

    print(f"\nEncouragement: {d.get('encouragement', {}).get('message')}")
    print(f"Action: {d.get('encouragement', {}).get('action')}")
    print(f"Drill mode: {d.get('enter_drill_mode')}")

    if d.get("acoustic_tips"):
        print(f"\nAcoustic tips:")
        for tip in d["acoustic_tips"]:
            print(f"  - {tip['tip']}")

    if d.get("drill_sequence"):
        print(f"\nDrill sequence ({len(d['drill_sequence'])} phonemes):")
        for ph in d["drill_sequence"]:
            print(f"  - {ph['phoneme']}: {ph['tip']}")

    # Play character response
    if d.get("character_response_audio"):
        audio_bytes = base64.b64decode(d["character_response_audio"])
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        tmp.write(audio_bytes)
        tmp.close()
        print("\nPlaying character response...")
        os.system(f"afplay {tmp.name}")
        os.unlink(tmp.name)

    os.unlink(audio_path)

if __name__ == "__main__":
    print("VaakSiddhi Autism — Backend Test")
    print("=" * 40)
    word = input("Enter a target word to test: ").strip() or "ball"
    char = input("Choose character (BOLT/ZARA/NOVA/BEEP/ECHO/MIRA) [BOLT]: ").strip() or "BOLT"

    test_input_word(word, char)
    test_evaluate(word, char)
