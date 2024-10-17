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
# Импортируем данные проекта
from src.modules.projects.project_data import tab_calendar_plan, expenses, cofinancing
from src.modules.projects.utils import assign_ids
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