from pydantic import BaseModel, HttpUrl, Field, constr
from datetime import datetime, date, time
from typing import List, Optional
from enum import Enum


class EventUserData(BaseModel):
    user_id: constr(min_length=1) = Field(..., description="ID Пользователя")
    user_full_name: constr(min_length=1) = Field(..., description="ФИО Пользователя")

class EventParticipantsData(BaseModel):
    user_id: constr(min_length=1) = Field(..., description="ID Пользователя")
    user_full_name: constr(min_length=1) = Field(..., description="ФИО Пользователя")
    projects_id: constr(min_length=1) = Field(..., description="ID Проекта")
    project_name: constr(min_length=1) = Field(..., description="Название Проекта")



class EventBase(BaseModel):
    event_creator: str = Field(..., description="Создатель мероприятия")

    event_publish: constr(min_length=1) = Field(..., description="Готовность к публикации")
    event_logo: Optional[str] = Field(None, description="URL логотипа мероприятия")
    event_full_title: constr(min_length=1) = Field(..., description="Полное название мероприятия")
    event_type: constr(min_length=1) = Field(..., description="Тип мероприятия")
    event_format: constr(min_length=1) = Field(..., description="Формат мероприятия")
    event_status: constr(min_length=1) = Field(..., description="Статус мероприятия")
    event_venue: constr(min_length=1) = Field(..., description="Место проведения мероприятия")
    event_organizer: constr(min_length=1) = Field(..., description="Организатор мероприятия")
    event_description: str = Field(..., description="Описание мероприятия")
    event_resources: str = Field(..., description="Ресурсы для мероприятия")
    event_allowed_participants: str = Field(..., description="Разрешенные участники мероприятия")
    event_start_date: str = Field(..., description="Дата начала мероприятия")
    event_start_time: str = Field(..., description="Время начала мероприятия")
    event_end_date: str = Field(..., description="Дата окончания мероприятия")
    event_end_time: str = Field(..., description="Время окончания мероприятия")
    event_tags: List[str] = Field(default_factory=list, description="Теги, связанные с мероприятием")
    event_managers: List[EventUserData] = Field(default_factory=list, description="Менеджеры мероприятия")
    event_experts: List[EventUserData] = Field(default_factory=list, description="Эксперты мероприятия")

    event_spectators: List[EventUserData] = Field(default_factory=list, description="Зрители мероприятия")
    event_participants: List[EventParticipantsData] = Field(default_factory=list, description="Участники мероприятия")



class EventCreate(BaseModel):
    event_publish: constr(min_length=1) = Field(..., description="Готовность к публикации")
    event_logo: Optional[str] = Field(None, description="URL логотипа мероприятия")
    event_full_title: constr(min_length=1) = Field(..., description="Полное название мероприятия")
    event_type: constr(min_length=1) = Field(..., description="Тип мероприятия")
    event_format: constr(min_length=1) = Field(..., description="Формат мероприятия")
    event_status: constr(min_length=1) = Field(..., description="Статус мероприятия")
    event_venue: constr(min_length=1) = Field(..., description="Место проведения мероприятия")
    event_organizer: constr(min_length=1) = Field(..., description="Организатор мероприятия")
    event_description: str = Field(..., description="Описание мероприятия")
    event_resources: str = Field(..., description="Ресурсы для мероприятия")
    event_allowed_participants: str = Field(..., description="Разрешенные участники мероприятия")
    event_start_date: str = Field(..., description="Дата начала мероприятия")
    event_start_time: str = Field(..., description="Время начала мероприятия")
    event_end_date: str = Field(..., description="Дата окончания мероприятия")
    event_end_time: str = Field(..., description="Время окончания мероприятия")
    event_tags: List[str] = Field(default_factory=list, description="Теги, связанные с событием")
    event_managers: List[EventUserData] = Field(default_factory=list, description="Менеджеры мероприятия")
    event_experts: List[EventUserData] = Field(default_factory=list, description="Эксперты мероприятия")


class EventReduced(BaseModel):
    id_event: Optional[str] = None
    event_publish: constr(min_length=1) = Field(..., description="Готовность к публикации")
    event_logo: Optional[str] = Field(None, description="URL логотипа мероприятия")
    event_full_title: constr(min_length=1) = Field(..., description="Полное название мероприятия")
    event_type: constr(min_length=1) = Field(..., description="Тип мероприятия")
    event_format: constr(min_length=1) = Field(..., description="Формат мероприятия")
    event_status: constr(min_length=1) = Field(..., description="Статус мероприятия")
    event_venue: constr(min_length=1) = Field(..., description="Место проведения мероприятия")
    event_allowed_participants: str = Field(..., description="Разрешенные участники мероприятия")
    event_start_date: str = Field(..., description="Дата начала мероприятия")
    event_end_date: str = Field(..., description="Дата окончания мероприятия")
    event_tags: List[str] = Field(default_factory=list, description="Теги, связанные с мероприятием")

class PaginatedResponse(BaseModel):
    events: List[EventReduced]
    total: int