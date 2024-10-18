# src/modules/projects/utils.py

from fastapi import UploadFile, File, Query
import os, shutil
from typing import List, Optional, Any, Dict, Union
from bson import ObjectId
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Depends, status
from pydantic import ValidationError
from typing import List, Optional
from src.modules.projects.schemas import (
    ProjectFICPerson,
    ProjectFICPersonSummary,
    ContactInfo,
    ProjectDataTabs,
    GeneralInfo,
    ProjectInfo,
    TeamMember,
    Results,
    MediaResource,
    AdditionalFiles,
)


# Путь для сохранения загружаемых файлов
UPLOAD_DIR = os.path.join("src", "_resources", "upload_files", "projects_docx")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Импортируем данные проекта
from src.modules.projects.project_data import tab_calendar_plan, expenses, cofinancing
from src.database import projects_data_collection




async def create_empty_project(token: dict, project_template: str) -> ProjectFICPerson:
    # Создаем новый проект
    new_project = ProjectFICPerson(
        create_date=datetime.utcnow(),
        update_date=datetime.utcnow(),
        author_id=token.get("user_id"),
        author_name=token.get("user_name"),
        project_name=f"Новый проект {datetime.utcnow().isoformat()}",
        project_template=project_template,
        region=None,
        logo=None,
        contacts=ContactInfo(),
        project_data_tabs=ProjectDataTabs(
            tab_general_info=GeneralInfo(),
            tab_project_info=ProjectInfo(),
            tab_team=[TeamMember()],
            tab_results=Results(),
            tab_calendar_plan=tab_calendar_plan,
            tab_media=[MediaResource()],
            tab_expenses=expenses,
            tab_cofinancing=cofinancing,
            tab_additional_files=[AdditionalFiles()]
        ),
        reviews=[]
    )

    project_dict = new_project.dict()
    await assign_ids(project_dict)  # Назначаем уникальные ID

    return project_dict

async def create_project_from_file(token: dict, project_template: str, file_path) -> ProjectFICPerson:
    pass


# Вспомогательная функция для сохранения загружаемых файлов
async def save_upload_file(upload_file: UploadFile) -> str:
    # Определяем начальное расположение файла
    file_location = os.path.join(UPLOAD_DIR, upload_file.filename)

    # Проверяем, существует ли файл с таким именем, и добавляем уникальный суффикс, если это необходимо
    if os.path.exists(file_location):
        base, extension = os.path.splitext(upload_file.filename)
        counter = 1
        while os.path.exists(file_location):
            file_location = os.path.join(UPLOAD_DIR, f"{base}_{counter}{extension}")
            counter += 1

    # Сохраняем файл
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return file_location

async def assign_ids(obj: Union[Dict[str, Any], List[Any]]):
    """
    Рекурсивно назначает уникальные ObjectId для всех полей, заканчивающихся на '_id'.
    """
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key.endswith('_id') and (value is None or value == ""):
                obj[key] = "temporary_plug_id"  # Здесь можно заменить на генерацию уникального ID
            elif isinstance(value, (dict, list)):
                await assign_ids(value)
    elif isinstance(obj, list):
        for item in obj:
            await assign_ids(item)

async def convert_project_to_summary(project: dict) -> ProjectFICPersonSummary:
    # Проверка на наличие необходимых полей
    required_fields = ['_id', 'create_date', 'update_date', 'project_name', 'author_id', 'author_name', 'project_template', 'reviews']
    for field in required_fields:
        if field not in project:
            raise ValueError(f"Отсутствует обязательное поле: {field}")

    return ProjectFICPersonSummary(
        project_id=str(project['_id']),
        creation_date=project['create_date'],
        update_date=project['update_date'],
        project_name=project['project_name'],
        author_id=project['author_id'],
        author_name=project['author_name'],
        project_template=project['project_template'],
        reviews=project['reviews']
    )