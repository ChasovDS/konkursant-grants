from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
from typing import Optional, List, Dict, Any
from fastapi import Query
from bson import ObjectId
from src.modules.auth.utils import create_jwt, decode_jwt
from src.utils import check_permissions
from pymongo import DESCENDING
from src.modules.events.schemas import EventBase, EventCreate, EventReduced
from src.modules.projects.schemas import ProjectFICPersonSummary
from src.modules.profile.schemas import UserSummary
from src.database import projects_data_collection, events_data_collection, profile_data_collection



router = APIRouter()



SERVICE_NAME = "events_service"


# Эндпоинт для создания или обновления мероприятия
@router.post("/events", response_model=EventBase, status_code=201)
async def create_or_update_event(event: EventCreate, token: dict = Depends(decode_jwt)):
    """
    Создание или обновление мероприятия.
    - **event**: Данные о мероприятии.
    """
    await check_permissions(token, operation_type="high-level_event_operation")

    user_id = token.get("user_id")

    # Подготовка данных для мероприятия
    event_data = {
        "event_creator": user_id,
        "event_managers": [],
        "event_experts": [],
        "event_spectators": [],
        "event_participants": [],
        **event.dict()  # Объединяем дополнительные данные из event
    }

    new_event = await events_data_collection.insert_one(event_data)
    created_event = await events_data_collection.find_one({"_id": new_event.inserted_id})
    if not created_event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    return EventBase(**created_event)



# Эндпоинт для обновления мероприятия
@router.patch("/events/{event_id}", response_model=EventBase)
async def update_event(event_id: str, event: EventBase, token: dict = Depends(decode_jwt)):
    """
    Обновление мероприятия по ID.
    - **event_id**: ID мероприятия.
    - **event**: Данные для обновления.
    """
    await check_permissions(token, SERVICE_NAME, event_id=event_id)

    updated_event = await events_data_collection.find_one_and_update(
        {"_id": ObjectId(event_id)},
        {"$set": event.dict()},
    )
    if not updated_event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")
    return EventBase(**updated_event)


# Эндпоинт для получения списка мероприятий с пагинацией
@router.get("/events", response_model=Dict[str, Any])
async def get_events(
        full_title: str = None,
        event_type: str = None,
        tags: str = None,
        format: str = None,
        event_status: str = None,
        location: str = None,
        event_publish: str = None,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1),
        token: dict = Depends(decode_jwt)
):
    await check_permissions(token)

    # Расчет пропускаемых элементов для текущей страницы
    skip = (page - 1) * limit
    query = {}

    # Фильтрация по полному названию мероприятия
    if full_title:
        query["event_full_title"] = {"$regex": full_title, "$options": "i"}

    # Фильтрация по типу мероприятия, если не ALL
    if event_type:
        query["event_type"] = event_type

    # Фильтрация по тегам
    if tags:
        tag_list = [tag.strip() for tag in tags.split(",")]
        query["event_tags"] = {"$in": tag_list}

    # Фильтрация по формату мероприятия, если не ALL
    if format:
        query["event_format"] = format

    # Фильтрация по статусу мероприятия, если не ALL
    if event_status:
        query["event_status"] = event_status

    # Фильтрация по статусу мероприятия, если не ALL
    if event_publish:
        query["event_publish"] = event_publish

    # Фильтрация по локации
    if location:
        query["event_venue"] = {"$regex": location, "$options": "i"}

    total_events = await events_data_collection.count_documents(query)
    events = await events_data_collection.find(query).skip(skip).limit(limit).sort("date", DESCENDING).to_list(
        length=limit)

    for event in events:
        event['id_event'] = str(event['_id'])

    return {"total": total_events, "events": [EventReduced(**event) for event in events]}



# Эндпоинт для получения мероприятия по ID
@router.get("/events/{event_id}", response_model=EventBase)
async def get_event(event_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение мероприятия по его ID.
    - **event_id**: ID мероприятия.
    """
    await check_permissions(token)

    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    # Добавление id_event
    event['id_event'] = str(event['_id'])

    return EventBase(**event)


# Эндпоинт для удаления мероприятия
@router.delete("/events/{event_id}", status_code=204)
async def delete_event(event_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление мероприятия по ID.
    - **event_id**: ID мероприятия.
    """
    await check_permissions(token, SERVICE_NAME, event_id=event_id)

    result = await events_data_collection.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")




# Эндпоинт для просмотра зрителей мероприятия
@router.get("/events/{event_id}/spectators", response_model=List[UserSummary])
async def get_spectators(event_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение списка участников для мероприятия.
    - **event_id**: ID мероприятия.
    """
    # Проверка прав доступа
    await check_permissions(token)

    # Поиск мероприятия в базе данных
    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    # Получение уникальных user_id участников
    spectator_user_ids = set()
    for spectator in event.get("spectators", []):
        spectator_user_ids.update(spectator.get("spectator_user_id", []))

    # Проверяем, что spectator_user_ids - это множество строк
    spectator_user_ids = [user_id for user_id in spectator_user_ids if isinstance(user_id, str)]

    # Получаем пользователей асинхронно
    data_users = await profile_data_collection.find({"user_id": {"$in": spectator_user_ids}}).to_list(length=None)

    # Создаем список UserSummary
    return [UserSummary(**user) for user in data_users]

# Эндпоинт для регистрации зрителя мероприятия
@router.patch("/events/{event_id}/spectator/{user_id}", status_code=204)
async def register_spectator(event_id: str, user_id: str, token: dict = Depends(decode_jwt)):
    """
    Регистрация участника на мероприятие.
    - **event_id**: ID мероприятия.
    - **user_id**: ID участника.
    """


    await check_permissions(token, SERVICE_NAME, user_id=user_id)

    # Поиск мероприятия
    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    # Проверка, есть ли уже зритель с таким user_id
    spectator_found = False
    for spectator in event.get("spectators", []):
        if user_id in spectator.get("spectator_user_id", []):
            spectator_found = True
            break

    if not spectator_found:
        # Если зритель не найден, добавляем user_id в существующий объект или создаем новый
        result = await events_data_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$addToSet": {"spectators.$[spectator].spectator_user_id": user_id}},
            array_filters=[{"spectator.spectator_user_id": {"$ne": user_id}}]
        )

        if result.modified_count == 0:
            # Если ни один объект не был обновлён, добавляем нового зрителя
            await events_data_collection.update_one(
                {"_id": ObjectId(event_id)},
                {"$addToSet": {"spectators": {"spectator_user_id": [user_id]}}}
            )

# Эндпоинт для удаления зрителя мероприятия
@router.delete("/events/{event_id}/spectator/{user_id}", status_code=204)
async def delete_spectator(event_id: str, user_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление участника из мероприятия.
    - **event_id**: ID мероприятия.
    - **user_id**: ID участника.
    """
    await check_permissions(token, SERVICE_NAME, user_id=user_id)

    # Удаление user_id из списка зрителей
    result = await events_data_collection.update_one(
        {"_id": ObjectId(event_id)},
        {"$pull": {"spectators.$[].spectator_user_id": user_id}}  # Удаляем user_id из всех зрителей
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Зритель не найден или мероприятие не найдено")


# Эндпоинт для получения всех проектов конкретного мероприятия
@router.get("/events/{event_id}/projects", response_model=List[ProjectFICPersonSummary])
async def get_projects_by_event(event_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение списка всех проектов для конкретного мероприятия по его ID.
    - **event_id**: ID мероприятия.
    """
    await check_permissions(token)

    # Поиск мероприятия по ID
    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    # Получение списка проектов, связанных с мероприятием
    participants = event.get("event_participants", [])

    # Извлечение проектов из участников
    project_ids_flat = [participant["projects_id"] for participant in participants if "projects_id" in participant]

    # Фильтрация некорректных идентификаторов
    valid_project_ids = [pid for pid in project_ids_flat if ObjectId.is_valid(pid)]

    if not valid_project_ids:
        raise HTTPException(status_code=404, detail="Нет корректных проектов для данного мероприятия.")

    # Поиск проектов по их ID
    projects_cursor = projects_data_collection.find({"_id": {"$in": [ObjectId(pid) for pid in valid_project_ids]}})
    projects = await projects_cursor.to_list(length=100)

    if not projects:
        raise HTTPException(status_code=404, detail="Проекты не найдены для данного мероприятия.")

    # Добавление project_id к проектам
    for project in projects:
        project["project_id"] = str(project["_id"])

    return [ProjectFICPersonSummary(**project) for project in projects]

# Эндпоинт для получения мероприятий, где пользователь назначен экспертом
@router.get("/events/expert/list", response_model=List[EventReduced])
async def get_events_as_expert(token: dict = Depends(decode_jwt)):
    """
    Получение списка мероприятий, где пользователь назначен экспертом.
    """
    # Получаем user_id из токена
    user_id = token.get("user_id")

    # Проверка, что user_id существует
    if not user_id:
        raise HTTPException(status_code=400, detail="Не удалось извлечь user_id из токена.")

    # Поиск мероприятий, где пользователь указан как эксперт
    query = {"event_experts": {"$elemMatch": {"user_id": user_id}}}
    events = await events_data_collection.find(query).to_list(length=None)

    # Проверка наличия мероприятий
    if not events:
        raise HTTPException(status_code=404, detail="Нет мероприятий, где вы назначены экспертом.")

    # Добавление id_event к мероприятиям
    for event in events:
        event['id_event'] = str(event['_id'])

    return [EventReduced(**event) for event in events]


# Эндпоинт для получения всех участников конкретного мероприятия
@router.get("/events/{event_id}/participants", response_model=List[UserSummary])
async def get_participants(event_id: str, token: dict = Depends(decode_jwt)):
    await check_permissions(token)

    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    participant_user_ids = {participant["user_id"] for participant in event.get("event_participants", [])}

    participant_user_ids = [user_id for user_id in participant_user_ids if isinstance(user_id, str)]

    if not participant_user_ids:
        raise HTTPException(status_code=404, detail="Нет участников для данного мероприятия.")

    data_users = await profile_data_collection.find({"user_id": {"$in": participant_user_ids}}).to_list(length=None)

    return [UserSummary(**user) for user in data_users]



# Эндпоинт добавления проекта в мероприятие и обновления участника.
@router.patch("/events/{event_id}/project/{project_id}", status_code=204)
async def registration_project_to_event(event_id: str, project_id: str, token: dict = Depends(decode_jwt)):
    await check_permissions(token)

    project = await projects_data_collection.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    author_id = project.get("author_id")
    author_name = project.get("author_name")
    project_name = project.get("project_name")

    if not author_id:
        raise HTTPException(status_code=400, detail="Автор проекта не определен")

    result = await events_data_collection.update_one(
        {"_id": ObjectId(event_id), "event_participants.user_id": author_id},
        {"$addToSet": {"event_participants.$.projects_id": project_id}}
    )

    if result.modified_count == 0:
        new_participant = {
            "user_id": author_id,
            "user_full_name": author_name,
            "projects_id": project_id,
            "project_name": project_name,
        }

        update_result = await events_data_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$addToSet": {"event_participants": new_participant}}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Не удалось добавить проект и участника")


# Эндпоинт удаления участника с указанным projects_id из мероприятия
@router.delete("/events/{event_id}/project/{project_id}", status_code=204)
async def delete_project_from_event(event_id: str, project_id: str, token: dict = Depends(decode_jwt)):
    await check_permissions(token)

    # Удаляем участника с указанным projects_id из мероприятия
    result = await events_data_collection.update_one(
        {"_id": ObjectId(event_id)},
        {"$pull": {"event_participants": {"projects_id": project_id}}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Участник с указанным projects_id не найден")
