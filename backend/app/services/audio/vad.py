# Ported from agenti_ai's backend/app/tools/audio_tool.py (the assessment
# feature there already solved this problem; this repo had no equivalent).
#
# Isolates the child's actual speech from silence/background noise before
# any loudness/pitch/rate measurement runs, using Silero VAD. Without this,
# scoring ran over the whole denoised clip -- dead air before a kid starts
# talking, a parent's voice in the background, a mic pop -- all included.
import logging
from typing import List

import numpy as np
import torch
from silero_vad import get_speech_timestamps, load_silero_vad

logger = logging.getLogger(__name__)

try:
    vad_model = load_silero_vad()
    logger.info("✅ Silero VAD loaded")
except Exception as e:
    vad_model = None
    logger.error(f"❌ VAD error: {e}")


def vad_split(y: np.ndarray, sr: int) -> List[np.ndarray]:
    if vad_model is None:
        return [y]

    y_tensor = torch.tensor(y)
    timestamps = get_speech_timestamps(y_tensor, vad_model, sampling_rate=sr)

    segments = []
    for seg in timestamps:
        start = seg["start"]
        end = seg["end"]
        segments.append(y[start:end])

    return segments if segments else [y]


def select_child_segment(y: np.ndarray, sr: int) -> np.ndarray:
    segments = vad_split(y, sr)

    # Keep every VAD segment that's long enough to plausibly be speech (a
    # 1600-sample / 0.1s floor) and concatenate them in order, rather than
    # keeping only the single highest-"scoring" segment -- an energy-driven
    # score reliably picks a loud transient (a click/pop, a cough) over the
    # child's quieter, longer word, and can truncate a word VAD happened to
    # split around a natural micro-pause.
    valid_segments = [audio for audio in segments if len(audio) >= 1600]

    if not valid_segments:
        return y

    if len(valid_segments) == 1:
        return valid_segments[0]

    logger.info(f"🎯 Merging {len(valid_segments)} detected speech segments into one utterance")
    return np.concatenate(valid_segments)
