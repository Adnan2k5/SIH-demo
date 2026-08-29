import os
from dataclasses import dataclass
from dotenv import load_dotenv

# Load .env from the backend directory (one level up from app/core)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


@dataclass(frozen=True)
class Settings:
    service_name: str
    groq_api_key: str


settings = Settings(
    service_name=os.getenv("SIH_SERVICE_NAME", "SIH Hyper-Local Business Advisory API"),
    groq_api_key=os.getenv("GROQ_API_KEY", ""),
)
