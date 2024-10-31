from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime
from typing import List, Optional
from enum import Enum

class Authors(BaseModel):
    user_id: str
    projects_id: List[str] = Field(default_factory=list)

# Схемы данных
class ExpertsID(BaseModel):
    experts_user_id: List[str] = Field(default_factory=list)

class ManagersID(BaseModel):
    managers_user_id: List[str] = Field(default_factory=list)

class SpectatorsID(BaseModel):
    spectator_user_id: List[str] = Field(default_factory=list)

class CreatorEvent(BaseModel):
    creator_event_user_id: Optional[str] = None
    creator_event_full_name: Optional[str] = None

class EventStatus(str, Enum):
    COMPLETED = "Проведено"
    IN_PROGRESS = "Проводится"
    SCHEDULED = "Запланировано"

class Resource(BaseModel):
    vk_group: Optional[str] = None
    website: Optional[str] = None
    other: Optional[str] = None

class EventBase(BaseModel):
    id_event: Optional[str] = None
    ordinal_number: int = Field(...)
    full_title: str = Field(...)
    logo: Optional[str] = Field(None)
    event_type: str = Field(...)
    tags: List[str] = Field(default_factory=list)
    format: str = Field(...)
    event_status: Optional[str] = Field("SCHEDULED")
    creator_event: CreatorEvent
    organization: str = Field("")
    event_start_date: datetime = Field(...)
    event_end_date: datetime = Field(...)
    resources: List[str] = Field(default_factory=list)
    location: str = Field("")
    description: str = Field("")
    additional_resources: Optional[str] = Field(None)
    contact_info: str = Field("")
    managers: Optional[List[str]] = Field(default_factory=list)
    experts: Optional[List[str]] = Field(default_factory=list)
    spectators: Optional[List[str]] = Field(default_factory=list)
    participants: Optional[List[str]] = Field(default_factory=list)


class EventCreate(BaseModel):
    full_title: str = Field(...)
    event_type: str = Field(...)
    format: str = Field(...)
    event_start_date: datetime = Field(...)
    event_end_date: datetime = Field(...)



class EventReducedl(BaseModel):
    id_event: Optional[str] = None
    full_title: str = Field(...)
    logo: Optional[str] = Field(None)
    event_type: str = Field(...)
    tags: List[str] = Field(default_factory=list)
    format: str = Field(...)
    event_status: Optional[EventStatus] = Field(EventStatus.SCHEDULED)
    event_start_date: datetime = Field(...)
    event_end_date: datetime = Field(...)
    location: str = Field(...)
    managers: List[ManagersID] = Field(default_factory=list)
    experts: List[ExpertsID] = Field(default_factory=list)
    spectator: List[SpectatorsID] = Field(default_factory=list)
    participants: List[Authors] = Field(default_factory=list)

class PaginatedResponse(BaseModel):
    events: List[EventReducedl]
    total: int