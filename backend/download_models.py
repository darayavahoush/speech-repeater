import os
from huggingface_hub import hf_hub_download

HF_REPO = "anabaena/vaaksiddhi-models"
TOKEN = os.environ.get("HF_TOKEN")

for filename in ["kokoro-v1.0.onnx", "voices-v1.0.bin"]:
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        hf_hub_download(
            repo_id=HF_REPO,
            filename=filename,
            local_dir=".",
            token=TOKEN,
        )
        print(f"{filename} ready")
    else:
        print(f"{filename} already exists, skipping")
