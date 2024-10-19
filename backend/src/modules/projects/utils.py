# src/modules/projects/utils.py

from fastapi import UploadFile, File, Query
import os, shutil
import uuid
from typing import List, Optional, Any, Dict, Union
from bson import ObjectId
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Depends, status
from pydantic import ValidationError
from typing import List, Optional
from src.modules.projects.schemas import (
    ProjectData,
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
import logging
import json
from src.modules.projects.projects import convert_docx_to_json


# Путь для сохранения загружаемых файлов
UPLOAD_DIR = os.path.join("src", "_resources", "upload_files", "projects_docx")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Импортируем данные проекта
from src.modules.projects.project_data import tab_calendar_plan, expenses, cofinancing, project_info
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
            tab_project_info=project_info,
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



# Обработка данных перед созданием проекта
def process_project_data(project_data: ProjectData) -> Dict[str, Any]:
    project_data_dict = project_data.dict()
    project_data_tabs = project_data_dict.get("project_data_tabs", {})

    for tab_key, tab in project_data_tabs.items():
        if isinstance(tab, dict):
            if "tab_project_info" in tab and isinstance(tab["tab_project_info"], dict):
                if "geography" in tab["tab_project_info"]:
                    geography_data = tab["tab_project_info"]["geography"]
                    if isinstance(geography_data, list):
                        tab["tab_project_info"]["geography"] = [
                            Geography(**item).dict() for item in geography_data
                        ]
                    else:
                        logging.warning(f"Ожидался список, но получена: {type(geography_data)}")

            if "tab_expenses" in tab:
                if "total_expense" in tab["tab_expenses"]:
                    total_expense_value = tab["tab_expenses"]["total_expense"]
                    if isinstance(total_expense_value, list) and total_expense_value:
                        tab["tab_expenses"]["total_expense"] = str(total_expense_value[0]).strip()
                    else:
                        tab["tab_expenses"]["total_expense"] = str(total_expense_value).strip()

                # Обработка собственных средств
                if "tab_cofinancing" in tab:
                    if "own_funds" in tab["tab_cofinancing"]:
                        own_funds_value = tab["tab_cofinancing"]["own_funds"]
                        if isinstance(own_funds_value, dict):
                            # Преобразуем словарь в список объектов OwnFunds
                            tab["tab_cofinancing"]["own_funds"] = [OwnFunds(**own_funds_value)]
                        elif isinstance(own_funds_value, list):
                            # Преобразуем каждый элемент списка в объект OwnFunds
                            tab["tab_cofinancing"]["own_funds"] = [OwnFunds(**value) for value in own_funds_value]
                        else:
                            tab["tab_cofinancing"]["own_funds"] = []

                    if "partner_funds" in tab["tab_cofinancing"]:
                        partner_funds_value = tab["tab_cofinancing"]["partner_funds"]
                        if isinstance(partner_funds_value, list):
                            # Преобразуем каждый элемент списка в объект PartnerFunds
                            tab["tab_cofinancing"]["partner_funds"] = [PartnerFunds(**value) for value in
                                                                       partner_funds_value]
                        else:
                            tab["tab_cofinancing"]["partner_funds"] = []

            else:
                logging.warning(f"Ожидался словарь, но получена: {type(tab)}")

        else:
            logging.warning(f"Ожидался словарь, но получена: {type(tab)}")

    return project_data_dict






# Асинхронная функция для создания проекта из файла
async def create_project_from_file(token: dict, project_template: str, file_path: str) -> ProjectFICPerson:

    new_project_file_path_json = await convert_docx_to_json(file_path)

    # Считываем данные из JSON файла
    project_data = await read_json(new_project_file_path_json)

    # Создаем экземпляр ProjectData
    project_data_instance = ProjectData(**project_data)

    # Обрабатываем данные перед созданием проекта
    processed_data = process_project_data(project_data_instance)



    # Создаем новый проект
    new_project = ProjectFICPerson(
        create_date=datetime.utcnow(),
        update_date=datetime.utcnow(),
        author_id=token.get("user_id"),
        author_name=processed_data.get("author_name"),
        project_name=processed_data.get("project_name"),
        project_template=project_template,
        region=processed_data.get("region"),
        logo=None,
        contacts=processed_data.get("contacts"),
        project_data_tabs=processed_data.get("project_data_tabs", {}),
        reviews=[]
    )

    project_dict = new_project.dict()

    return project_dict


# Функция для чтения данных из JSON файла
async def read_json(file_path: str) -> Dict[str, Any]:
    try:
        with open(file_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        logging.info(f"Данные успешно считаны из JSON файла '{file_path}'.")
        return data
    except Exception as e:
        logging.error(f"Ошибка при чтении JSON файла '{file_path}': {e}")
        raise


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
                obj[key] = str(uuid.uuid4())  # Здесь можно заменить на генерацию уникального ID
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


