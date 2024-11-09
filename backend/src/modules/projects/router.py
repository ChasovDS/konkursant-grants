# src/modules/projects/router.py

from fastapi import APIRouter, HTTPException, Depends, Response, UploadFile, File, Query, status
from pydantic import ValidationError
from src.modules.auth.utils import create_jwt, decode_jwt
from src.utils import check_permissions
from src.modules.projects.utils import convert_project_to_summary, save_upload_file, create_empty_project, create_project_from_file
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

# Импортируем необходимые схемы
from src.modules.projects.schemas import (
    UpdateAdditionalFilesRequest,
    ProjectFICPerson,
    ProjectDataTabs,
    AdditionalFiles,
    ProjectFICPersonSummary,
    ProjectFICPersonUpdateData,
    ContactInfo,
    GeneralInfo,
    ProjectInfo,
    Results,
    MediaResource,
    Review,
    TeamMember,
    ProjectTemplate

)

# Импортируем данные проекта
from src.modules.projects.project_data import tab_calendar_plan, expenses, cofinancing
from src.database import projects_data_collection

router = APIRouter()

SERVICE_NAME = "projects_service"



# Эндпоинт для создания пустого проекта
@router.post("/projects/create-empty", response_model=ProjectFICPersonSummary, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_template: ProjectTemplate,
    token: dict = Depends(decode_jwt)
):
    await check_permissions(token)

    new_project = await create_empty_project(token, project_template)

    required_fields = ['project_name', 'author_id', 'author_name', 'project_template']
    for field in required_fields:
        if field not in new_project:
            logger.error(f"Отсутствует обязательное поле: {field}")
            raise HTTPException(status_code=400, detail=f"Отсутствует обязательное поле: {field}")

    try:
        result = await projects_data_collection.insert_one(new_project)
    except Exception as e:
        logger.exception("Ошибка при сохранении проекта")
        raise HTTPException(status_code=500, detail="Ошибка при сохранении проекта")

    created_project = await projects_data_collection.find_one({"_id": result.inserted_id})
    if not created_project:
        logger.error("Созданный проект не найден в базе данных")
        raise HTTPException(status_code=404, detail="Созданный проект не найден")

    try:
        return await convert_project_to_summary(created_project)
    except ValidationError as ve:
        logger.exception("Ошибка валидации данных")
        raise HTTPException(status_code=422, detail=f"Ошибка валидации данных: {ve}")

# Эндпоинт для создания проекта из файла
@router.post("/projects/create-from-file", response_model=ProjectFICPersonSummary, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_template: ProjectTemplate,
    input_file: UploadFile = File(...),
    token: dict = Depends(decode_jwt)
):
    await check_permissions(token)

    file_path = await save_upload_file(input_file)
    new_project = await create_project_from_file(token, project_template, file_path)

    try:
        result = await projects_data_collection.insert_one(new_project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при сохранении проекта: {e}")

    created_project = await projects_data_collection.find_one({"_id": result.inserted_id})
    if not created_project:
        raise HTTPException(status_code=404, detail="Созданный проект не найден")

    try:
        return await convert_project_to_summary(created_project)
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=f"Ошибка валидации данных: {ve}")



# Эндпоинт для получения собственных проектов
@router.get("/projects/me", response_model=List[ProjectFICPersonSummary])
async def get_my_projects(
    skip: int = Query(0, ge=0),  # Параметр для пропуска записей
    limit: int = Query(10, ge=1),  # Параметр для ограничения количества записей
    name: Optional[str] = None,  # Фильтр по имени проекта
    author: Optional[str] = None,  # Фильтр по автору
    template: Optional[str] = None,  # Фильтр по шаблону
    token: dict = Depends(decode_jwt)
):
    """
    Получение списка собственных проектов с пагинацией и фильтрацией.
    user_id извлекается из токена.
    """
    user_id = token.get("user_id")  # Извлекаем user_id из токена

    # Проверка формата user_id
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Неверный формат user ID")

    # Формируем базовый запрос для получения проектов текущего пользователя
    query = {"author_id": user_id}

    # Добавляем фильтры, если они указаны
    if name:
        query["project_name"] = {"$regex": name, "$options": "i"}  # Регистронезависимый поиск
    if author:
        query["author_name"] = {"$regex": author, "$options": "i"}  # Регистронезависимый поиск
    if template:
        query["project_template"] = {"$regex": template, "$options": "i"}  # Регистронезависимый поиск

    # Получаем проекты из базы данных с пагинацией
    projects_cursor = projects_data_collection.find(query).skip(skip).limit(limit)
    projects = [await convert_project_to_summary(project) async for project in projects_cursor]

    return projects

# Эндпоинт для получения всех проектов в системе
@router.get("/projects-all", response_model=List[ProjectFICPersonSummary])
async def get_all_projects(
    response: Response,
    page: int = 1,
    limit: int = 10,
    author: str = "",
    title: str = "",
    token: dict = Depends(decode_jwt)
):
    """
    Получение списка всех проектов в системе с возможностью фильтрации.
    - **page**: Номер страницы.
    - **limit**: Количество элементов на странице.
    - **author**: Условие поиска по ФИО автора.
    - **title**: Условие поиска по названию проекта.
    """
    await check_permissions(token, operation_type="high-level_operation")

    # Создаем базовый фильтр для поиска
    filter_conditions = {}

    # Добавляем фильтрацию по названию проекта, если указано
    if title:
        filter_conditions["project_name"] = {"$regex": title, "$options": "i"}

    # Добавляем фильтрацию по ФИО автора, если указано
    if author:
        filter_conditions["author_name"] = {"$regex": author, "$options": "i"}

    # Получение общего количества проектов перед пагинацией
    total_count = await projects_data_collection.count_documents(filter_conditions)

    # Получение проектов с учетом пагинации
    projects_cursor = projects_data_collection.find(filter_conditions).skip((page - 1) * limit).limit(limit)
    projects = await projects_cursor.to_list(length=limit)

    # Добавление project_id к проектам
    for project in projects:
        project["project_id"] = str(project["_id"])

    # Установка заголовка с общим количеством проектов
    response.headers['X-Total-Count'] = str(total_count)

    return [ProjectFICPersonSummary(**project) for project in projects]


# Эндпоинт для получения списка проектов
@router.get("/projects", response_model=List[ProjectFICPersonSummary])
async def get_projects(
    user_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),  # Параметр для пропуска записей
    limit: int = Query(10, ge=1),  # Параметр для ограничения количества записей
    token: dict = Depends(decode_jwt)
):
    """
    Получение списка проектов с пагинацией. Можно фильтровать по параметру user_id.
    """
    # Проверяем права доступа
    if user_id:
        await check_permissions(token, SERVICE_NAME, user_id=user_id)
    else:
        await check_permissions(token, operation_type="high-level_operation")

    # Формируем запрос
    query = {}
    if user_id:  # Проверяем, что user_id не None
        try:
            obj_id = ObjectId(user_id)
            query["author_id"] = obj_id
        except ValueError:
            raise HTTPException(status_code=400, detail="Неверный формат user_id")

    # Получаем проекты из базы данных с пагинацией
    projects_cursor = projects_data_collection.find(query).skip(skip).limit(limit)
    projects = [await convert_project_to_summary(project) async for project in projects_cursor]

    return projects





# Эндпоинт для получения конкретного проекта
@router.get("/projects/{project_id}", response_model=ProjectFICPerson)
async def get_project(project_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение информации о проекте по его ID.
    """
    await check_permissions(token, SERVICE_NAME, project_id=project_id)

    try:
        obj_id = ObjectId(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат project_id")

    project = await projects_data_collection.find_one({"_id": obj_id})
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    project["project_id"] = str(project["_id"])
    return ProjectFICPerson(**project)


@router.patch("/projects/{project_id}/additional-files", status_code=204)
async def update_additional_files(
        project_id: str,
        request: UpdateAdditionalFilesRequest,
        token: dict = Depends(decode_jwt)
):
    await check_permissions(token, SERVICE_NAME, project_id=project_id)

    try:
        obj_id = ObjectId(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат project_id")

    existing_project = await projects_data_collection.find_one({"_id": obj_id})
    if not existing_project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    # Преобразование объектов Pydantic в словари
    additional_files_dict = [file.dict() for file in request.additional_files]

    update_dict = {
        "project_data_tabs.tab_additional_files_KG": additional_files_dict,
        "update_date": datetime.utcnow()
    }

    await projects_data_collection.update_one(
        {"_id": obj_id},
        {"$set": update_dict}
    )

    return {"detail": "Дополнительные файлы успешно обновлены"}

# Эндпоинт для обновления проекта
@router.patch("/projects/{project_id}", status_code=204)
async def update_project(
        project_id: str,
        update_data: ProjectFICPersonUpdateData,
        token: dict = Depends(decode_jwt)
):
    """
    Обновление информации о проекте по его ID.
    """

    await check_permissions(token, SERVICE_NAME, project_id=project_id)

    try:
        obj_id = ObjectId(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат project_id")

    existing_project = await projects_data_collection.find_one({"_id": obj_id})
    if not existing_project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    update_dict = update_data.dict(exclude_unset=True)
    update_dict["update_date"] = datetime.utcnow()

    await projects_data_collection.update_one(
        {"_id": obj_id},
        {"$set": update_dict}
    )

    return {"detail": "Проект успешно обновлён"}


# Эндпоинт для удаления проекта
@router.delete("/projects/{project_id}", status_code=204)
async def delete_project(project_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление проекта по его ID.
    """
    await check_permissions(token, SERVICE_NAME, project_id=project_id)
    try:
        obj_id = ObjectId(project_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат project_id")

    result = await projects_data_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Проект не найден")

    return {"detail": "Проект успешно удалён"}




