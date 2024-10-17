# src/modules/auth/auth.py
import httpx
from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime, timedelta

from src.database import authorization_accounts_collection, profile_data_collection, user_sessions_collection

from src.modules.auth.utils import create_jwt

from src.modules.auth.schemas import SessionCreate, YandexUserAccount, AuthorizationAccounts
from src.modules.profile.schemas import ProfileData, RoleEnum, ExternalServiceAccounts, SquadInfo




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
