# src/modules/auth/router.py
from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
import hashlib
from src.modules.auth.auth import get_user_info, create_or_load_user_yandex
from src.modules.auth.utils import create_jwt, hash_password, verify_password
from src.modules.profile.schemas import JwtResponse

# Создаем экземпляр маршрутизатора
router = APIRouter()



@router.post("/set_token")
async def dev_set_token(token: str, response: Response):
    """
    Установка JWT токена в куки.

    Параметры:
    - token: JWT токен для установки в куки.

    Возвращает:
    - Сообщение об успешной установке токена.
    """
    # Устанавливаем куки с JWT токеном
    response.set_cookie(key="auth_token", value=token, httponly=True, secure=True)
    return {"message": "JWT токен успешно установлен в куки"}

@router.post("/auth/yandex", response_model=JwtResponse)
async def authenticate_with_yandex(token_data: dict):
    """
    Аутентификация пользователя через Яндекс.

    Параметры:
    - token_data: словарь, содержащий токен для аутентификации.

    Возвращает:
    - UserResponse: JWT-токен.
    """
    token = token_data.get("token")
    user_info = await get_user_info(token)

    # Проверяем, что получены корректные данные пользователя
    if "id" not in user_info or "default_email" not in user_info:
        raise HTTPException(status_code=400, detail="Некорректные данные пользователя")

    # Создаем или загружаем пользователя в базу данных
    user_data_list = await create_or_load_user_yandex(user_info)

    # Извлекаем данные из списка
    user_id, email_ya, role = user_data_list

    # Хешируем роль пользователя
    hashed_role = hashlib.sha256(role.encode()).hexdigest()

    # Создаем JWT-токен для аутентификации
    jwt_token = create_jwt(user_id, email_ya, role)
    # Возвращаем JWT-токен и роль пользователя
    return JwtResponse(token=jwt_token, role=hashed_role)



