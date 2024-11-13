# src/modules/auth/auth.py
import httpx
from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse
from bson import ObjectId
from datetime import datetime, timedelta, timezone

from src.database import authorization_accounts_collection, profile_data_collection, user_sessions_collection
from src.modules.auth.schemas import SessionCreate, YandexUserAccount, AuthorizationAccounts, RegistrationData, LoginData, EmailUserAccount
from src.modules.profile.schemas import ProfileData, RoleEnum, ExternalServiceAccounts, SquadInfo
from src.modules.auth.utils import hash_password, verify_password, create_jwt



async def get_user_info(token: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "https://login.yandex.ru/info",
                headers={"Authorization": f"Bearer {token}"}
            )
            response.raise_for_status()  # Поднимает исключение для статусов 4xx и 5xx
        except httpx.HTTPStatusError as exc:
            print(f"Ошибка статуса: {exc.response.status_code}, {exc.response.text}")
            raise HTTPException(status_code=exc.response.status_code,
                                detail="Ошибка при получении информации о пользователе")
        except httpx.RequestError as exc:
            print(f"Ошибка запроса: {exc}")
            raise HTTPException(status_code=500, detail="Ошибка соединения с Яндексом")

        user_data = response.json()

        # Проверяем наличие ключевых полей
        if "id" not in user_data or "default_email" not in user_data:
            raise HTTPException(status_code=400, detail="Некорректные данные пользователя")

        return user_data

async def create_or_load_user_yandex(user_info: dict) -> list:
    # Проверяем наличие email в данных пользователя
    if "default_email" not in user_info:
        raise HTTPException(status_code=400, detail="User email is required")

    # Ищем пользователя в новой коллекции AuthorizationAccounts по email
    user = await authorization_accounts_collection.find_one(
        {"yandex_user_account.email_ya": user_info["default_email"]}
    )

    if user is None:

        # Создаём запись в AuthorizationAccounts с YandexUserAccount
        yandex_user = YandexUserAccount(
            ya_id=user_info["id"],
            email_ya=user_info["default_email"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        authorization_account = AuthorizationAccounts(
            yandex_user_account=yandex_user
        )
        # Вставляем нового пользователя в коллекцию
        result = await authorization_accounts_collection.insert_one(authorization_account.dict())
        user_id = result.inserted_id

        # Создаём запись в ProfileData с ролью по умолчанию
        external_accounts = ExternalServiceAccounts(
            yandex=user_info["default_email"],
        )

        squad_info = SquadInfo(
            direction=None,
            squad=None
        )

        data_user = ProfileData(
            user_id=str(user_id),
            username=user_info.get("login"),
            full_name=user_info.get("real_name"),
            last_name=user_info.get("last_name"),
            first_name=user_info.get("first_name"),
            middle_name=None,  # Отчество, если есть
            phone=user_info.get("default_phone", {}).get("number"),
            city=None,  # Город пользователя, если есть
            gender=user_info.get("sex"),
            birthday=user_info.get("birthday"),
            profile_photo_upl=user_info.get("default_avatar_id"),
            external_service_accounts=external_accounts,
            role_name=RoleEnum.USER,
            squad_info=squad_info
        )
        await profile_data_collection.insert_one(data_user.dict())

        # Создаем сессию для пользователя
        await create_session(user_id)

        # Устанавливаем роль по умолчанию
        role = RoleEnum.USER
    else:
        # Извлекаем существующего пользователя
        user_id = user["_id"]
        existing_data_user = await profile_data_collection.find_one({"user_id": str(user_id)})
        role = existing_data_user.get("role_name", RoleEnum.USER)

    # Возвращаем список с user_id, email_ya и role
    return [str(user_id), user_info["default_email"], role]

async def create_session(user_id: ObjectId):
    session = SessionCreate(
        user_id=str(user_id),
        created_at=datetime.utcnow().isoformat(),
        expires_at=(datetime.utcnow() + timedelta(hours=24)).isoformat()
    )
    result = await user_sessions_collection.insert_one(session.dict())
    return str(result.inserted_id)

async def create_user_profile(data: RegistrationData):
    # Проверяем, существует ли пользователь с таким email
    existing_user = await authorization_accounts_collection.find_one(
        {"email_user_account.email_login": data.email}
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

    # Хешируем пароль
    hashed_password = hash_password(data.password)

    # Создаём запись в AuthorizationAccounts с YandexUserAccount
    yandex_user = YandexUserAccount(
        email_ya=data.email,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Создаем запись пользователя
    email_user_account = EmailUserAccount(
        email_login=data.email,
        hash_password=hashed_password,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    authorization_account = AuthorizationAccounts(
        email_user_account=email_user_account,
        yandex_user_account=yandex_user
    )

    # Вставляем нового пользователя в коллекцию authorization_accounts_collection
    result = await authorization_accounts_collection.insert_one(authorization_account.dict())
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Ошибка при создании пользователя")

    # Создаём запись в ProfileData с ролью по умолчанию
    external_accounts = ExternalServiceAccounts(
        yandex=data.email,
    )

    squad_info = SquadInfo(
        direction=None,
        squad=None
    )

    data_user = ProfileData(
        user_id=str(result.inserted_id),
        username=None,  # Здесь можно задать имя пользователя, если оно доступно
        full_name=data.full_name,
        last_name=None,
        first_name=None,
        middle_name=None,
        phone=None,
        city=None,
        gender=None,
        birthday=None,
        profile_photo_upl=None,
        external_service_accounts=external_accounts,
        role_name=RoleEnum.USER,
        squad_info=squad_info
    )

    profile_result = await profile_data_collection.insert_one(data_user.dict())
    if not profile_result.inserted_id:
        raise HTTPException(status_code=500, detail="Ошибка при создании профиля пользователя")

    return {"message": "Регистрация прошла успешно"}


async def authenticate_user(data: LoginData):
    # Ищем пользователя по email
    user = await authorization_accounts_collection.find_one(
        {"email_user_account.email_login": data.email}
    )
    if not user:
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    # Проверяем пароль
    if not verify_password(data.password, user["email_user_account"]["hash_password"]):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    # Извлекаем профиль пользователя
    profile = await profile_data_collection.find_one({"user_id": str(user["_id"])})
    if not profile:
        raise HTTPException(status_code=500, detail="Профиль пользователя не найден")

    role = profile.get("role_name", RoleEnum.USER)

    # Создаем JWT токен
    user_id = str(user["_id"])
    jwt_token = create_jwt(user_id, data.email, role)

    # Устанавливаем куки с JWT токеном
    response = JSONResponse(content={"message": "Аутентификация прошла успешно."})

    # Установка куки
    expires = datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(days=7)

    response.set_cookie(
        key="auth_token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite='Strict',
        expires=expires
    )

    return response