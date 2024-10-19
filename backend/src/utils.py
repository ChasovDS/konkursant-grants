# src/utils.py
import logging
from fastapi import HTTPException, status
from typing import Dict, List, Optional
from bson import ObjectId
from src.modules.profile.schemas import RoleEnum
from src.database import (
    user_roles_collection,
    projects_data_collection,
    events_data_collection,
    reviews_data_collection
)

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Функция для проверки прав доступа
async def get_role_permissions(role_name: str) -> List[str]:
    role = await user_roles_collection.find_one({"name": role_name})
    if role:
        # Извлекаем все разрешения из всех сервисов
        return [perm for perms in role["permissions"].values() for perm in perms]
    return []

async def check_permissions(token: Dict, SERVICE_NAME: Optional[str] = None, operation_type: Optional[str] = None,
                            user_id: Optional[str] = None, project_id: Optional[str] = None,
                            event_id: Optional[str] = None, review_id: Optional[str] = None):

    # Проверка на авторизацию
    if not token.get("user_id"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не авторизован."
        )

    user_role = RoleEnum(token.get("role"))

    # Проверка на тип операции
    operation_roles = {
        "high-level_operation": {RoleEnum.ADMIN, RoleEnum.MODERATOR},
        "high-level_event_operation": {RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.EVENT_MANAGER},
        "high-level_review_operation": {RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.EVENT_MANAGER, RoleEnum.EXPERT}
    }

    if operation_type in operation_roles and user_role in operation_roles[operation_type]:
        return {"status": "success", "message": "Пользователь имеет права."}

    if operation_type in operation_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь не имеет прав."
        )

    services = {
        "profile_service": profile_service,
        "projects_service": projects_service,
        "events_service": events_service,
        "reviews_service": reviews_service
    }

    if SERVICE_NAME:
        # Попытка получить функцию сервиса из словаря
        service_function = services.get(SERVICE_NAME)

        if service_function:
            # Вызов функции сервиса с учетом необязательных параметров
            return await service_function(
                token=token,
                user_id=user_id,
                project_id=project_id,
                event_id=event_id,
                review_id=review_id
            )
        else:
            # Логирование ошибки, если сервис не найден
            logger.error("Неизвестный сервис: %s", SERVICE_NAME)
            return None

async def check_entity_permissions(entity_id: Optional[str], collection, token_user_id: str, user_permissions: List[str],
                                   my_permission: str, any_permission: str, not_found_message: str):
    if entity_id:
        entity = await collection.find_one({"_id": ObjectId(entity_id)})
        if not entity:
            raise HTTPException(status_code=404, detail=not_found_message)

        entity_owner_id = entity.get("author_id") or entity.get("creator_event", {}).get("creator_event_user_id") or entity.get("reviewer_id")

        if entity_owner_id == token_user_id:
            if my_permission in user_permissions:
                return {"status": "success", "message": "Доступ разрешен для своего объекта."}
        elif any_permission in user_permissions:
            return {"status": "success", "message": "Доступ разрешен для других объектов."}

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Недостаточно прав для выполнения действия."
    )

async def profile_service(token: Dict, user_id: Optional[str] = None, **kwargs):
    return await generic_service(token, user_id, "crud_my_profile_data", "crud_any_profile_data")

async def projects_service(token: Dict, user_id: Optional[str] = None, project_id: Optional[str] = None, **kwargs):
    return await generic_service(token, user_id, "crud_my_projects", "crud_any_projects", project_id, projects_data_collection, "Проект не найден")

async def events_service(token: Dict, user_id: Optional[str] = None, event_id: Optional[str] = None, **kwargs):
    return await generic_service(token, user_id, "crud_my_events", "crud_any_events", event_id, events_data_collection, "Мероприятие не найдено")

async def reviews_service(token: Dict, user_id: Optional[str] = None, review_id: Optional[str] = None, **kwargs):
    return await generic_service(token, user_id, "crud_my_reviews", "crud_any_reviews", review_id, reviews_data_collection, "Проверка не найдена")

async def generic_service(token: Dict, user_id: Optional[str], my_permission: str, any_permission: str,
                          entity_id: Optional[str] = None, collection=None, not_found_message: str = ""):
    user_role = RoleEnum(token.get("role"))
    token_user_id = token.get("user_id")
    user_permissions = await get_role_permissions(user_role.value)

    if user_id and token_user_id == user_id:
        if my_permission in user_permissions:
            return {"status": "success", "message": "Доступ разрешен для своего объекта."}
    elif any_permission in user_permissions:
        return {"status": "success", "message": "Доступ разрешен для других объектов."}

    if entity_id and collection:
        return await check_entity_permissions(entity_id, collection, token_user_id, user_permissions, my_permission, any_permission, not_found_message)

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Недостаточно прав для выполнения действия."
    )
