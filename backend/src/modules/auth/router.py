# src/modules/auth/router.py
from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
from fastapi.responses import JSONResponse
from src.modules.auth.auth import get_user_info, create_or_load_user_yandex, authenticate_user, create_user_profile
from src.modules.auth.utils import create_jwt, hash_password, verify_password
from src.modules.profile.schemas import JwtResponse
from src.modules.auth.schemas import TokenData, UserResponse, RegistrationData, LoginData




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


@router.post("/auth/yandex", response_model=UserResponse)
async def authenticate_with_yandex(token_data: TokenData):
    """
    Аутентификация пользователя через Яндекс.

    Параметры:
    - token_data: объект, содержащий токен для аутентификации.

    Возвращает:
    - UserResponse: сообщение об успешной аутентификации.
    """
    token = token_data.token
    user_info: Dict[str, Any] = await get_user_info(token)

    # Проверяем, что получены корректные данные пользователя
    if not user_info or "id" not in user_info or "default_email" not in user_info:
        raise HTTPException(status_code=400, detail="Некорректные данные пользователя")

    # Создаем или загружаем пользователя в базу данных
    user_data_list = await create_or_load_user_yandex(user_info)

    # Проверяем, что данные пользователя корректные
    if not user_data_list or len(user_data_list) < 3:
        raise HTTPException(status_code=500, detail="Ошибка при загрузке данных пользователя")

    # Извлекаем данные из списка
    user_id, email_ya, role = user_data_list

    # Создаем JWT-токен для аутентификации
    jwt_token = create_jwt(user_id, email_ya, role)

    # Устанавливаем куки с JWT токеном
    response = JSONResponse(content={"message": "Аутентификация прошла успешно."})
    response.set_cookie(
        key="auth_token",
        value=jwt_token,
        httponly=False,
        secure=True,
        samesite='Strict',
        expires=7 * 24 * 60 * 60  # 7 дней
    )
    return response

@router.post("/register")
async def register_user(data: RegistrationData):
    return await create_user_profile(data)


@router.post("/login")
async def login_user(data: LoginData):
    return await authenticate_user(data)