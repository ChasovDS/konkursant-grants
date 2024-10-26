# src/modules/profile/schemas.py
from pydantic import BaseModel, EmailStr, constr
from typing import Optional, List
from bson import ObjectId
from enum import Enum

class RoleEnum(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    EVENT_MANAGER = "event_manager"
    EXPERT = "expert"
    USER = "user"

class RoleUpdate(BaseModel):
    role: RoleEnum

class DirectionEnum(str, Enum):
    SOP = "СОП"
    SPO = "СПО"
    SSO = "ССО"
    SSHO = "ССХО"
    SMO = "СМО"
    SServO = "ССервО"
    SEO = "СЭО"
    SMediaO = "СМедиаО"
    STO = "СТО"



class Role(BaseModel):
    name: RoleEnum
    permissions: List[str]  # Используйте List вместо list

class JwtResponse(BaseModel):
    """
    Схема для ответа с информацией о пользователе после аутентификации.
    """
    token: str  # JWT-токен для аутентификации


class ExternalServiceAccounts(BaseModel):
    yandex: Optional[str] = None
    email: Optional[str] = None
    vk: Optional[str] = None


class SquadInfo(BaseModel):
    direction: Optional[str] = None  # Предположим, что это строка
    squad: Optional[str] = None


class ProfileData(BaseModel):
    user_id: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    last_name: Optional[str] = None  # Фамилия пользователя
    first_name: Optional[str] = None  # Имя пользователя
    middle_name: Optional[str] = None  # Отчество пользователя
    phone: Optional[str] = None  # Телефонный номер
    city: Optional[str] = None  # Город пользователя
    gender: Optional[str] = None  # Пол пользователя
    birthday: Optional[str] = None
    profile_photo_upl: Optional[str] = None
    external_service_accounts: ExternalServiceAccounts
    role_name: RoleEnum
    squad_info: SquadInfo

    class Config:
        from_attributes = True
        json_encoders = {
            ObjectId: str
        }


class UserSummary(BaseModel):
    user_id: str
    role_name: RoleEnum
    full_name: Optional[str]
    last_name: Optional[str]
    first_name: Optional[str]
    external_service_accounts: ExternalServiceAccounts

class DataUserUpdate(BaseModel):
    """
    Схема для обновления данных пользователя.
    """
    username: Optional[str] = None
    full_name: Optional[str] = None
    last_name: Optional[str] = None  # Фамилия пользователя
    first_name: Optional[str] = None  # Имя пользователя
    middle_name: Optional[str] = None  # Отчество пользователя
    birthday: Optional[str] = None  # Дата рождения пользователя
    phone: Optional[str] = None  # Телефонный номер
    city: Optional[str] = None  # Город пользователя
    gender: Optional[str] = None  # Пол пользователя
    squad_info: SquadInfo

