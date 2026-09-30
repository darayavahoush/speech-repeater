import gc, os, nltk
from faster_whisper import download_model
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

for pkg in ("averaged_perceptron_tagger", "averaged_perceptron_tagger_eng", "cmudict", "punkt", "punkt_tab"):
    nltk.download(pkg, download_dir=os.environ["NLTK_DATA"], quiet=True)

download_model("medium")  # keep in sync with WHISPER_MODEL in app/core/config.py

# keep in sync with MODEL_IDS in app/phoneme_eval.py
for mid in ("ai4bharat/indicwav2vec-hindi", "amoghsgopadi/wav2vec2-large-xlsr-kn"):
    Wav2Vec2Processor.from_pretrained(mid)
    Wav2Vec2ForCTC.from_pretrained(mid)
    gc.collect()

from sentence_transformers import SentenceTransformer
for name in ("paraphrase-multilingual-MiniLM-L12-v2", "all-MiniLM-L6-v2"):
    SentenceTransformer(name)
