import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    service_name: str


settings = Settings(
    service_name=os.getenv("SIH_SERVICE_NAME", "SIH Hyper-Local Business Advisory API")
)
