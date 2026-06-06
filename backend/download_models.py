from huggingface_hub import hf_hub_download

HF_REPO = "anabaena/vaaksiddhi-models"

for filename in ["kokoro-v1.0.onnx", "voices-v1.0.bin"]:
    import os
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        hf_hub_download(
            repo_id=HF_REPO,
            filename=filename,
            local_dir=".",
            local_dir_use_symlinks=False,
        )
        print(f"{filename} ready")
    else:
        print(f"{filename} already exists, skipping")
