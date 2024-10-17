# src/modules/projects/utils.py

from fastapi import UploadFile, File, Query
import os, shutil
from typing import List, Optional, Any, Dict, Union
from bson import ObjectId
from src.modules.projects.schemas import ProjectFICPersonSummary

# Путь для сохранения загружаемых файлов
UPLOAD_DIR = os.path.join("src", "_resources", "upload_files", "projects_docx")
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

# Функция для проверки и получения файла

async def get_input_file(create_from_file: bool, file: Optional[UploadFile] = File(None)):
    if create_from_file and file is None:
        raise HTTPException(status_code=400, detail="Необходим файл для загрузки.")
    return file

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

def convert_project_to_summary(project: dict) -> ProjectFICPersonSummary:
    return ProjectFICPersonSummary(
        project_id=str(project.get('_id')),
        creation_date=project.get('create_date'),
        update_date=project.get('update_date'),
        project_name=project.get('project_name'),
        author_id=project.get('author_id'),
        author_name=project.get('author_name'),
        project_template=project.get('project_template'),
        reviews=project.get('reviews')
    )