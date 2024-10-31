from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
from typing import Optional, List
from fastapi import Query
from bson import ObjectId
from src.modules.auth.utils import create_jwt, decode_jwt
from src.utils import check_permissions
from pymongo import DESCENDING
from src.modules.events.schemas import EventBase, EventCreate, EventReducedl, EventStatus
from src.modules.projects.schemas import ProjectFICPersonSummary
from src.modules.profile.schemas import UserSummary
from src.database import projects_data_collection, events_data_collection, profile_data_collection



router = APIRouter()


SERVICE_NAME = "events_service"


# Эндпоинт для создания мероприятия
@router.post("/events", response_model=EventBase, status_code=201)
async def create_event(event: EventCreate, token: dict = Depends(decode_jwt)):
    """
    Создание нового мероприятия.
    - **event**: Данные о мероприятии.
    """
    await check_permissions(token, operation_type="high-level_event_operation")

    user_id = token.get("user_id")

    # Подготовка данных для сохранения в БД
    event_data = {
        "ordinal_number": 0,  # Пример значения, его нужно будет генерировать или получать
        "full_title": event.full_title,
        "logo": "https://storage.yandexcloud.net/newspressfeed/wp-content/uploads/2023/12/offline-events.png",
        "event_type": event.event_type,
        "tags": [],
        "format": event.format,
        "event_status": EventStatus.SCHEDULED,
        "creator_event": {
            "creator_event_user_id": str(user_id)
        },
        "organization": "",
        "event_start_date": event.event_start_date,
        "event_end_date": event.event_end_date,
        "resources": [],
        "location": "",
        "description": "",
        "additional_resources": None,
        "contact_info": "",
        "managers": [],
        "experts": [],
        "spectators": [],
        "participants": []
    }

    new_event = await events_data_collection.insert_one(event_data)
    created_event = await events_data_collection.find_one({"_id": new_event.inserted_id})

    if not created_event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    created_event["id_event"] = str(new_event.inserted_id)
    return EventBase(**created_event)


# Эндпоинт для получения списка мероприятий с пагинацией
@router.get("/events", response_model=List[EventReducedl])
async def get_events(
        full_title: str = None,
        event_type: str = None,
        tags: str = None,
        format: str = None,
        event_status: str = None,
        location: str = None,
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1),
        token: dict = Depends(decode_jwt)
):
    await check_permissions(token)

    # Формируем запрос с учетом фильтров
    query = {}

    if full_title:
        query["full_title"] = {"$regex": full_title, "$options": "i"}

    if event_type:
        query["event_type"] = event_type

    if tags:
        # Предполагаем, что теги разделены запятыми
        tag_list = [tag.strip() for tag in tags.split(",")]
        query["tags"] = {"$in": tag_list}

    if format:
        query["format"] = format

    if event_status:
        query["event_status"] = event_status

    if location:
        query["location"] = {"$regex": location, "$options": "i"}

    # Получаем общее количество мероприятий
    total_events = await events_data_collection.count_documents(query)

    # Получаем мероприятия с учетом пагинации и сортировки
    events = await events_data_collection.find(query).skip(skip).limit(limit).sort("date", DESCENDING).to_list(length=limit)

    for event in events:
        event['id_event'] = str(event['_id'])

    return [EventReducedl(**event) for event in events]


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

# Эндпоинт для назначения руководителя
@router.patch("/events/{event_id}/manager/{user_id}", status_code=204)
async def assign_manager(event_id: str, user_id: str, token: dict = Depends(decode_jwt)):
    """
    Назначение руководителя для мероприятия.
    - **event_id**: ID мероприятия.
    - **user_id**: ID пользователя, которого назначают.
    """
    await check_permissions(token, operation_type="high-level_operation")

    # Поиск мероприятия
    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    # Проверка, есть ли уже менеджер с таким user_id
    manager_found = False
    for manager in event.get("managers", []):
        if user_id in manager.get("managers_user_id", []):  # Используйте get для избежания KeyError
            manager_found = True
            break

    if not manager_found:
        # Если менеджер не найден, добавляем user_id в существующий объект или создаем новый
        result = await events_data_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$addToSet": {"managers.$[manager].managers_user_id": user_id}},  # Исправлено на managers_user_id
            array_filters=[{"manager.managers_user_id": {"$ne": user_id}}]
        )

        if result.modified_count == 0:
            # Если ни один объект не был обновлён, добавляем нового менеджера
            await events_data_collection.update_one(
                {"_id": ObjectId(event_id)},
                {"$addToSet": {"managers": {"managers_user_id": [user_id]}}}  # Исправлено на managers_user_id
            )

# Эндпоинт для удаления руководителя
@router.delete("/events/{event_id}/manager/{user_id}", status_code=204)
async def delete_manager(event_id: str, user_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление руководителя из мероприятия.
    - **event_id**: ID мероприятия.
    - **user_id**: ID руководителя.
    """
    await check_permissions(token, operation_type="high-level_operation")

    result = await events_data_collection.update_one(
        {"_id": ObjectId(event_id)},
        {"$pull": {"managers.$[].managers_user_id": user_id}}  # Удаляем user_id из всех managers
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Менеджер не найден или мероприятие не найдено")

# Эндпоинт для назначения эксперта
@router.patch("/events/{event_id}/expert/{user_id}", status_code=204)
async def assign_expert(event_id: str, user_id: str, token: dict = Depends(decode_jwt)):
    """
    Назначение эксперта для мероприятия.
    - **event_id**: ID мероприятия.
    - **user_id**: ID пользователя, которого назначают.
    """
    await check_permissions(token, SERVICE_NAME, event_id=event_id)

    # Поиск мероприятия
    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    # Проверка, есть ли уже эксперт с таким user_id
    expert_found = False
    for expert in event.get("experts", []):
        if user_id in expert.get("experts_user_id", []):  # Используйте get для избежания KeyError
            expert_found = True
            break

    if not expert_found:
        # Если эксперт не найден, добавляем user_id в существующий объект или создаем новый
        result = await events_data_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$addToSet": {"experts.$[expert].experts_user_id": user_id}},
            array_filters=[{"expert.experts_user_id": {"$ne": user_id}}]
        )

        if result.modified_count == 0:
            # Если ни один объект не был обновлён, добавляем нового эксперта
            await events_data_collection.update_one(
                {"_id": ObjectId(event_id)},
                {"$addToSet": {"experts": {"experts_user_id": [user_id]}}}
            )

# Эндпоинт для удаления эксперта
@router.delete("/events/{event_id}/expert/{user_id}", status_code=204)
async def delete_expert(event_id: str, user_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление эксперта из мероприятия.
    - **event_id**: ID мероприятия.
    - **user_id**: ID эксперта.
    """
    await check_permissions(token, SERVICE_NAME, event_id=event_id)

    result = await events_data_collection.update_one(
        {"_id": ObjectId(event_id)},
        {"$pull": {"experts.$[].experts_user_id": user_id}}  # Удаляем user_id из всех experts
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Эксперт не найден или мероприятие не найдено")

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

# Эндпоинт для получения удаления зрителя мероприятия
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


# Эндпоинт для получения всех участников конкретного мероприятия
@router.get("/events/{event_id}/participants", response_model=List[UserSummary])
async def get_participants(event_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение списка участников для конкретного мероприятия по его ID.
    - **event_id**: ID мероприятия.
    """
    # Проверка прав доступа
    await check_permissions(token)

    # Поиск мероприятия в базе данных
    event = await events_data_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")

    # Получение уникальных user_id участников
    participant_user_ids = {participant["user_id"] for participant in event.get("participants", [])}

    # Фильтрация некорректных идентификаторов
    participant_user_ids = [user_id for user_id in participant_user_ids if isinstance(user_id, str)]

    if not participant_user_ids:
        raise HTTPException(status_code=404, detail="Нет участников для данного мероприятия.")

    # Получаем пользователей асинхронно
    data_users = await profile_data_collection.find({"user_id": {"$in": participant_user_ids}}).to_list(length=None)

    # Создаем список UserSummary
    return [UserSummary(**user) for user in data_users]

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
    projects_ids = event.get("participants", [])
    project_ids_list = [project.get("projects_id", []) for project in projects_ids]  # Получаем только существующие проекты
    project_ids_flat = [item for sublist in project_ids_list for item in sublist]  # Разворачиваем список

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

# Эндпоинт добавление проекта в мероприятие и обновление участника.
@router.patch("/events/{event_id}/project/{project_id}", status_code=204)
async def registration_project_to_event(event_id: str, project_id: str, token: dict = Depends(decode_jwt)):
    """
    Добавление проекта в мероприятие и обновление участника.
    - **event_id**: ID мероприятия.
    - **project_id**: ID проекта.
    """
    await check_permissions(token, SERVICE_NAME, project_id=project_id)

    # Получение author_id из проекта
    project = await projects_data_collection.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    author_id = project.get("author_id")
    if not author_id:
        raise HTTPException(status_code=400, detail="Автор проекта не определен")

    # Попытка обновить участника
    result = await events_data_collection.update_one(
        {"_id": ObjectId(event_id), "participants.user_id": author_id},
        {"$addToSet": {"participants.$.projects_id": project_id}}
    )

    # Если участник не найден, добавляем его с проектом
    if result.modified_count == 0:
        # Создаем нового участника
        new_participant = {
            "user_id": author_id,
            "projects_id": [project_id]  # Добавляем проект в новый массив
        }

        # Обновляем мероприятие, добавляя нового участника
        update_result = await events_data_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$addToSet": {"participants": new_participant}}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Не удалось добавить проект и участника")

# Эндпоинт удаления проекта из мероприятия.
@router.delete("/events/{event_id}/project/{project_id}", status_code=204)
async def delete_project_from_event(event_id: str, project_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление проекта из мероприятия и обновление участника.
    - **event_id**: ID мероприятия.
    - **project_id**: ID проекта.
    """
    await check_permissions(token, SERVICE_NAME, project_id=project_id)

    # Получение author_id из проекта
    project = await projects_data_collection.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    author_id = project.get("author_id")
    if not author_id:
        raise HTTPException(status_code=400, detail="Автор проекта не определен")

    # Проверка, существует ли участник с таким user_id
    participant = await events_data_collection.find_one(
        {"_id": ObjectId(event_id), "participants.user_id": author_id}
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Участник не найден")

    # Удаление проекта из массива projects_id
    result = await events_data_collection.update_one(
        {"_id": ObjectId(event_id), "participants.user_id": author_id},
        {"$pull": {"participants.$.projects_id": project_id}}  # Удаляем проект
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Не удалось удалить проект")

    # Проверяем, остались ли проекты у участника
    updated_participant = await events_data_collection.find_one(
        {"_id": ObjectId(event_id), "participants.user_id": author_id}
    )

    # Проверяем, существует ли поле projects_id и пустое ли оно
    if updated_participant:
        participant_data = next((p for p in updated_participant['participants'] if p['user_id'] == author_id), None)
        if participant_data and not participant_data.get('projects_id'):
            # Если массив projects_id пустой, удаляем участника
            await events_data_collection.update_one(
                {"_id": ObjectId(event_id)},
                {"$pull": {"participants": {"user_id": author_id}}}  # Удаляем участника
            )


