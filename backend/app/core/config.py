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
        "autism":        {"phoneme": 0.65, "loudness": 0.10, "pitch": 0.10, "rate": 0.08, "voice_quality": 0.07},
        "articulation":  {"phoneme": 0.75, "loudness": 0.06, "pitch": 0.05, "rate": 0.07, "voice_quality": 0.07},
        "stuttering":    {"phoneme": 0.40, "loudness": 0.08, "pitch": 0.10, "rate": 0.30, "voice_quality": 0.12},
        "seizure_meds":  {"phoneme": 0.60, "loudness": 0.10, "pitch": 0.10, "rate": 0.12, "voice_quality": 0.08}
    }
    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "phi3:mini"
    ESPEAK_VOICE: str = "en-in"
    ANTHROPIC_API_KEY: Optional[str] = None
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
