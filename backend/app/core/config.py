from dataclasses import dataclass
from functools import lru_cache
import os


@dataclass(frozen=True)
class Settings:
    access_token_expire_minutes: int = 15
    ai_deterministic: bool = False
    ai_max_retries: int = 1
    ai_provider: str = "mock"
    ai_timeout_seconds: float = 2.0
    app_name: str = "Flavor Odyssey Backend"
    app_version: str = "0.1.0"
    cors_origins: tuple[str, ...] = ("http://localhost:3000",)
    database_url: str = "postgresql+asyncpg://flavor:flavor@localhost:5432/flavor_odyssey"
    environment: str = "local"
    jwt_secret: str | None = None
    llm_api_key: str | None = None
    log_level: str = "INFO"
    password_hash_iterations: int = 210_000
    redis_url: str = "redis://localhost:6379/0"
    refresh_token_expire_days: int = 14
    service_name: str = "flavor-odyssey-backend"


@lru_cache
def get_settings() -> Settings:
    return Settings(
        access_token_expire_minutes=int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", Settings.access_token_expire_minutes)
        ),
        ai_deterministic=os.getenv("AI_DETERMINISTIC", "false").lower()
        in {"1", "true", "yes"},
        ai_max_retries=int(os.getenv("AI_MAX_RETRIES", Settings.ai_max_retries)),
        ai_provider=os.getenv("AI_PROVIDER", Settings.ai_provider),
        ai_timeout_seconds=float(
            os.getenv("AI_TIMEOUT_SECONDS", Settings.ai_timeout_seconds)
        ),
        cors_origins=tuple(
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS", ",".join(Settings.cors_origins)
            ).split(",")
            if origin.strip()
        ),
        database_url=os.getenv("DATABASE_URL", Settings.database_url),
        environment=os.getenv("APP_ENV", Settings.environment),
        jwt_secret=os.getenv("JWT_SECRET") or None,
        llm_api_key=os.getenv("LLM_API_KEY") or None,
        log_level=os.getenv("LOG_LEVEL", Settings.log_level),
        password_hash_iterations=int(
            os.getenv("PASSWORD_HASH_ITERATIONS", Settings.password_hash_iterations)
        ),
        redis_url=os.getenv("REDIS_URL", Settings.redis_url),
        refresh_token_expire_days=int(
            os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", Settings.refresh_token_expire_days)
        ),
    )


settings = get_settings()
