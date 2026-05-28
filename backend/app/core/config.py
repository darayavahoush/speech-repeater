from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    WHISPER_MODEL: str = "medium"
    WHISPER_DEVICE: str = "cpu"
    WHISPER_COMPUTE_TYPE: str = "int8"
    TARGET_RMS_MIN: float = 0.02
    TARGET_RMS_MAX: float = 0.15
    TARGET_RATE_MIN: float = 2.0
    TARGET_RATE_MAX: float = 3.5
    SCORE_PASS: int = 80
    SCORE_RETRY: int = 60
    SCORE_SIMPLIFY: int = 40
    SCORE_SUPPORT: int = 20
    MAX_ATTEMPTS: int = 3
    WEIGHTS: dict = {
        "autism": {"phoneme": 0.35, "loudness": 0.15, "pitch": 0.20, "rate": 0.15, "voice_quality": 0.15},
        "articulation": {"phoneme": 0.50, "loudness": 0.10, "pitch": 0.05, "rate": 0.10, "voice_quality": 0.25},
        "stuttering": {"phoneme": 0.20, "loudness": 0.10, "pitch": 0.15, "rate": 0.35, "voice_quality": 0.20},
        "seizure_meds": {"phoneme": 0.35, "loudness": 0.15, "pitch": 0.10, "rate": 0.20, "voice_quality": 0.20}
    }
    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "phi3:mini"
    ESPEAK_VOICE: str = "en-in"

    class Config:
        env_file = ".env"

settings = Settings()
