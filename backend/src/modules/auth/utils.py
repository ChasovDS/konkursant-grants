# src/modules/auth/utils.py
import jwt
from jwt import PyJWTError
import logging
from passlib.context import CryptContext
from fastapi import HTTPException, Request, status
from datetime import datetime, timedelta
from typing import Dict, List, Union
from src.config import settings
from src.security import encrypt_payload, decrypt_payload



# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Настройка для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_jwt(user_id: str, email: str, role: str) -> str:
    expiration = datetime.utcnow() + timedelta(days=1)
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": expiration.isoformat()
    }

    encrypted_payload = encrypt_payload(payload)
    token = jwt.encode({'data': encrypted_payload.decode()}, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return token

async def decode_jwt(request: Request) -> Dict:

    token = request.cookies.get("auth_token")

    if not token:
        logger.warning("Токен не найден")
        raise HTTPException(status_code=401, detail="Токен не найден")

    try:
        decoded = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        encrypted_payload = decoded.get('data')
        if not encrypted_payload:
            raise HTTPException(status_code=401, detail="Неверный токен")

        return decrypt_payload(encrypted_payload)

    except jwt.ExpiredSignatureError:
        logger.warning("Токен истек")
        raise HTTPException(status_code=401, detail="Токен истек")
    except jwt.InvalidTokenError:
        logger.warning("Неверный токен")
        raise HTTPException(status_code=401, detail="Неверный токен")
    except Exception as e:
        logger.error(f"Ошибка декодирования: {str(e)}")
        raise HTTPException(status_code=500, detail="Ошибка декодирования")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Проверяем пароль
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)