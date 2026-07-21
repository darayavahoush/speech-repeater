import torch
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

MODEL_ID = "ai4bharat/indicwav2vec-hindi"

processor = Wav2Vec2Processor.from_pretrained(MODEL_ID)
model = Wav2Vec2ForCTC.from_pretrained(MODEL_ID)
model.eval()

def load_audio(path, target_sr=16000):
    waveform, sr = torchaudio.load(path)
    if sr != target_sr:
        waveform = torchaudio.functional.resample(waveform, sr, target_sr)
    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0, keepdim=True)
    return waveform.squeeze(0)

def get_phoneme_probs(audio_path):
    audio = load_audio(audio_path)
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
    with torch.no_grad():
        logits = model(inputs.input_values).logits
    probs = torch.softmax(logits, dim=-1)[0]
    return probs, processor.tokenizer

def score_target_char(audio_path, target_char, confusable_chars):
    probs, tokenizer = get_phoneme_probs(audio_path)
    vocab = tokenizer.get_vocab()

    target_id = vocab.get(target_char)
    confusable_ids = {c: vocab.get(c) for c in confusable_chars}

    target_score = probs[:, target_id].max().item() if target_id is not None else 0.0
    confusable_scores = {
        c: probs[:, cid].max().item()
        for c, cid in confusable_ids.items() if cid is not None
    }

    best = max([("target", target_score)] + list(confusable_scores.items()), key=lambda x: x[1])
    return {
        "target_score": target_score,
        "confusable_scores": confusable_scores,
        "predicted": best[0],
        "correct": best[0] == "target",
    }

# Dental vs retroflex confusable groups (the ones that actually get mixed up)
CONFUSABLE_GROUPS = [
    {"त", "ट"},
    {"थ", "ठ"},
    {"द", "ड"},
    {"ध", "ढ"},
    {"न", "ण"},
]

def find_confusable_group(word: str):
    """Returns the first confusable char + its group found in the target word, or None."""
    for char in word:
        for group in CONFUSABLE_GROUPS:
            if char in group:
                return char, group
    return None

def check_dental_retroflex(audio_path: str, target_word: str):
    """
    If target_word contains a dental/retroflex confusable character,
    scores the audio against that char vs its confusables.
    Returns None if no confusable character is present.
    """
    match = find_confusable_group(target_word)
    if not match:
        return None
    target_char, group = match
    confusables = [c for c in group if c != target_char]
    return score_target_char(audio_path, target_char, confusables)
