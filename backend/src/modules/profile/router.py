from fastapi import APIRouter, HTTPException, Depends, status, Query
from bson import ObjectId
from typing import List, Optional, Union
from src.modules.auth.utils import create_jwt, decode_jwt
from src.utils import check_permissions
from src.modules.profile.schemas import DataUserUpdate, RoleEnum, ProfileData, ExternalServiceAccounts, SquadInfo, UserSummary
from src.database import profile_data_collection, authorization_accounts_collection

# Создаем экземпляр маршрутизатора
router = APIRouter()

SERVICE_NAME = "profile_service"


# Эндпоинт для получения всех пользователей
@router.get("/users/profile", response_model=Union[List[ProfileData], List[UserSummary]])
async def get_all_users(
        token: dict = Depends(decode_jwt),
        details: Optional[bool] = Query(False),  # Параметр по умолчанию False
        abbreviated: Optional[bool] = Query(False),  # Параметр по умолчанию False
        page: Optional[int] = Query(1, ge=1),  # Номер страницы, по умолчанию 1
        limit: Optional[int] = Query(50, ge=1, le=1000)  # Лимит на количество пользователей, по умолчанию 100
):
    """
    Получение списка всех пользователей с поддержкой пагинации.
    """

    # Проверка прав доступа
    if details:
        await check_permissions(token, operation_type="high-level_operation")
    elif abbreviated:
        await check_permissions(token)
    else:
        raise HTTPException(status_code=400, detail="Укажите либо «details», либо «abbreviated» параметр")

    # Вычисление смещения для пагинации
    skip = (page - 1) * limit

    # Поиск пользователей в базе данных с учетом пагинации
    data_users = await profile_data_collection.find({}).skip(skip).limit(limit).to_list(length=limit)

    # Возвращаем данные в зависимости от запрашиваемого формата
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
@router.put("/users/{user_id}/profile", response_model=dict)
async def update_user_profile(user_id: str, user_data: DataUserUpdate, token: dict = Depends(decode_jwt)):
    """
    Обновление информации о пользователе.
    """
    await check_permissions(token, SERVICE_NAME, user_id=user_id)

    update_data = user_data.dict(exclude_unset=True)
    result = await profile_data_collection.update_one({"user_id": user_id}, {"$set": update_data})

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

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


@router.patch("/user/role/{user_id}", response_model=dict)
async def assign_user_role(
    user_id: str,
    role: RoleEnum,
    token: dict = Depends(decode_jwt)
):
    """
    Изменение роли пользователя.

    """

    # Проверяем права доступа
    await check_permissions(token, operation_type="high-level_operation")

    # Проверяем, указана ли роль для обновления
    if not role:
        raise HTTPException(status_code=400, detail="Не указана роль для обновления")

    # Обновляем роль пользователя в базе данных
    result = await profile_data_collection.update_one(
        {"user_id": user_id},
        {"$set": {"role_name": role}}
    )

    # Проверяем, была ли изменена запись
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Пользователь не найден или роль не изменилась")

    return {"message": "Роль пользователя успешно обновлена", "user_id": user_id, "new_role": role}





