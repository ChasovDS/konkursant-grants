from fastapi import APIRouter, HTTPException, Depends, status, Query, Response
from bson import ObjectId
from typing import List, Optional, Union
from src.modules.auth.utils import create_jwt, decode_jwt
from src.utils import check_permissions
from src.modules.profile.schemas import DataUserUpdate, RoleEnum, ProfileData, ExternalServiceAccounts, SquadInfo, UserSummary, RoleUpdate, UserResponse
from src.database import profile_data_collection, authorization_accounts_collection

# Создаем экземпляр маршрутизатора
router = APIRouter()

SERVICE_NAME = "profile_service"











# Эндпоинт для получения информации о пользователе
@router.get("/users/me", response_model=Union[ProfileData, UserSummary])
async def get_user_profile(
        token: dict = Depends(decode_jwt),
        details: Optional[bool] = Query(False),  # Параметр по умолчанию False
        abbreviated: Optional[bool] = Query(False)  # Параметр по умолчанию False

        # Декодируем токен для получения информации о пользователе
):
    """
    Получение информации о пользователе.
    user_id извлекается из токена.
    """
    user_id = token.get("user_id")  # Извлекаем user_id из токена

    # Проверка формата user_id
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Неверный формат user ID")

    # Поиск пользователя в базе данных
    data_user = await profile_data_collection.find_one({"user_id": user_id})
    if not data_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Проверка прав доступа
    if details:
        await check_permissions(token, user_id=user_id)  # Проверяем доступ для полных данных
        return ProfileData(**data_user)  # Возвращаем полные данные

    if abbreviated:
        await check_permissions(token)  # Проверяем доступ для сокращенных данных
        return UserSummary(**data_user)  # Возвращаем сокращенные данные

    raise HTTPException(status_code=400, detail="Укажите либо параметр «details», либо «abbreviated»")


# Эндпоинт для получения всех пользователей
@router.get("/users/profile", response_model=Union[List[ProfileData], List[UserSummary]])
async def get_all_users(
        response: Response,
        token: dict = Depends(decode_jwt),
        details: Optional[bool] = Query(False),
        abbreviated: Optional[bool] = Query(False),
        page: Optional[int] = Query(1, ge=1),
        limit: Optional[int] = Query(50, ge=1, le=1000),
        full_name: Optional[str] = Query(None),
        yandex: Optional[str] = Query(None),
        role_name: Optional[str] = Query(None)
):
    # Проверка прав доступа
    if details:
        await check_permissions(token, operation_type="high-level_operation")
    elif abbreviated:
        await check_permissions(token)
    else:
        raise HTTPException(status_code=400, detail="Укажите либо «details», либо «abbreviated» параметр")

    skip = (page - 1) * limit

    query = {}
    if full_name:
        query["full_name"] = {"$regex": full_name, "$options": "i"}
    if yandex:
        query["external_service_accounts.yandex"] = {"$regex": yandex, "$options": "i"}
    if role_name:
        query["role_name"] = role_name

    total_users = await profile_data_collection.count_documents(query)
    data_users = await profile_data_collection.find(query).skip(skip).limit(limit).to_list(length=limit)

    response.headers['X-Total-Count'] = str(total_users)

    # Возвращаем пустой список, если пользователей нет
    if not data_users:
        return []

    if details:
        return [ProfileData(**user) for user in data_users]
    elif abbreviated:
        return [UserSummary(**user) for user in data_users]

    raise HTTPException(status_code=400, detail="Не удалось получить данные пользователей.")



# Эндпоинт для получения информации о пользователе
@router.get("/users/{user_id}/profile", response_model=Union[ProfileData, UserSummary])
async def get_user_profile(
        user_id: str,
        token: dict = Depends(decode_jwt),
        details: Optional[bool] = Query(False),  # Параметр по умолчанию False
        abbreviated: Optional[bool] = Query(False)  # Параметр по умолчанию False
):
    """
    Получение информации о пользователе по его ID.

    Параметры:
    - details: Если True, возвращает полные данные о пользователе.
    - abbreviated: Если True, возвращает сокращенные данные о пользователе.
    """

    # Проверка формата user_id
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # Поиск пользователя в базе данных
    data_user = await profile_data_collection.find_one({"user_id": user_id})
    if not data_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверка прав доступа
    if details:
        await check_permissions(token, SERVICE_NAME, user_id=user_id)
        return ProfileData(**data_user)

    if abbreviated:
        await check_permissions(token)
        return UserSummary(**data_user)

    raise HTTPException(status_code=400, detail="Укажите либо «details», либо «abbreviated» параметр")

# Эндпоинт для обновления данных пользователя
@router.patch("/users/{user_id}/profile", response_model=dict)
async def update_user_profile(user_id: str, user_data: DataUserUpdate, token: dict = Depends(decode_jwt)):
    """
    Обновление информации о пользователе.
    """
    await check_permissions(token, SERVICE_NAME, user_id=user_id)

    update_data = user_data.dict(exclude_unset=True)

    # Формируем точечное обновление
    set_operations = {}
    for key, value in update_data.items():
        if isinstance(value, dict):
            # Для вложенных словарей, создаем отдельные операции $set для каждого вложенного поля
            for sub_key, sub_value in value.items():
                set_operations[f"{key}.{sub_key}"] = sub_value
        else:
            set_operations[key] = value

    # Применение точечного обновления
    result = await profile_data_collection.update_one({"user_id": user_id}, {"$set": set_operations})

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    if result.modified_count == 0:
        return {"message": "User data is already up-to-date"}

    return {"message": "User data successfully updated"}


# Эндпоинт для удаления пользователя
@router.delete("/users/{user_id}/profile", response_model=dict)
async def delete_user_profile(user_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление пользователя.
    """
    await check_permissions(token, SERVICE_NAME, user_id=user_id)

    # Удаление из коллекций
    result = await profile_data_collection.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User successfully deleted"}


# Эндпоинт для назначения роли
@router.patch("/user/role/{user_id}", response_model=dict)
async def assign_user_role(
    user_id: str,
    role_update: RoleUpdate,  # Используем Pydantic модель
    token: dict = Depends(decode_jwt)
):
    """
    Изменение роли пользователя.
    """

    # Проверяем права доступа
    await check_permissions(token, operation_type="high-level_operation")

    role = role_update.role

    # Обновляем роль пользователя в базе данных
    result = await profile_data_collection.update_one(
        {"user_id": user_id},
        {"$set": {"role_name": role}}
    )

    # Проверяем, была ли изменена запись
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Пользователь не найден или роль не изменилась")

    return {"message": "Роль пользователя успешно обновлена", "user_id": user_id, "new_role": role}


# Эндпоинт для получения списка пользователей по роли и ФИО
@router.get("/users/role/{role_name}", response_model=List[UserResponse])
async def get_users_by_role(
    role_name: RoleEnum,
    full_name: Optional[str] = Query(None),
):
    """
    Получение списка пользователей с определенной ролью и возможностью поиска по ФИО.
    """
    # Создаем базовый запрос для поиска пользователей по роли
    query = {"role_name": role_name}

    # Добавляем фильтры по ФИО, если они указаны
    if full_name:
        query["full_name"] = {"$regex": full_name, "$options": "i"}

    # Поиск пользователей в базе данных
    users = await profile_data_collection.find(query).to_list(length=100)  # Ограничим до 100 пользователей

    if not users:
        raise HTTPException(status_code=404, detail="Пользователи с данной ролью не найдены")

    # Формируем список ответов
    user_list = [UserResponse(user_id=user["user_id"], user_full_name=user.get("full_name", "Не указано")) for user in users]

    return user_list


@router.get("/users/{role_type}", response_model=List[UserResponse])
async def get_users_by_role_type(
    role_type: str,
    full_name: Optional[str] = Query(None),
):
    """
    Получение списка пользователей в зависимости от типа роли и фильтрации по ФИО.
    """
    # Определяем роли в зависимости от типа
    if role_type == "event_manager":
        roles = [RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.EVENT_MANAGER]
    elif role_type == "expert":
        roles = [RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.EVENT_MANAGER, RoleEnum.EXPERT]
    else:
        raise HTTPException(status_code=400, detail="Неверный тип роли")

    # Создаем базовый запрос для поиска пользователей по ролям
    query = {"role_name": {"$in": roles}}

    # Добавляем фильтры по ФИО, если они указаны
    if full_name:
        query["full_name"] = {"$regex": full_name, "$options": "i"}

    # Поиск пользователей в базе данных
    users = await profile_data_collection.find(query).to_list(length=100)  # Ограничим до 100 пользователей

    if not users:
        raise HTTPException(status_code=404, detail="Пользователи с данной ролью не найдены")

    # Формируем список ответов
    user_list = [UserResponse(user_id=str(user["_id"]), user_full_name=user.get("full_name", "Не указано")) for user in users]

    return user_list