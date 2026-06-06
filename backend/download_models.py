import os
from huggingface_hub import hf_hub_download

HF_REPO = "anabaena/vaaksiddhi-models"
TOKEN = os.environ.get("HF_TOKEN")

if not TOKEN:
    raise RuntimeError("HF_TOKEN environment variable not set!")

for filename in ["kokoro-v1.0.onnx", "voices-v1.0.bin"]:
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        path = hf_hub_download(
            repo_id=HF_REPO,
            filename=filename,
            local_dir=".",
            token=TOKEN,
            local_dir_use_symlinks=False,
        )
        print(f"{filename} ready at {path}")
    else:
        print(f"{filename} already exists, skipping")
