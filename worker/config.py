import os
from pydantic_settings import BaseSettings if False else object

class Settings:
    SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://mock-satprep-supabase.co")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "demo_service_role_key")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL_FAST: str = os.getenv("GEMINI_MODEL_FAST", "gemini-1.5-flash")
    GEMINI_MODEL_REASONING: str = os.getenv("GEMINI_MODEL_REASONING", "gemini-1.5-pro")
    WORKER_API_SECRET: str = os.getenv("WORKER_API_SECRET", "satprep_worker_secret_key_change_in_production")
    SANDBOX_TIMEOUT_SEC: float = 2.0
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
