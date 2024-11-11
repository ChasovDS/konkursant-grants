# src/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    yandex_client_id: str
    yandex_client_secret: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration: int = 604800  # Время жизни токена в секундах (7 дней)
    encryption_key: str
    mongodb_url: str

    class Config:
        env_file = ".env"

settings = Settings()
