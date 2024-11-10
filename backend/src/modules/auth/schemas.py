# src/modules/auth/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class YandexUserAccount(BaseModel):
    """Схема для учетной записи пользователя Яндекс."""
    ya_id: Optional[str] = None
    email_ya: Optional[EmailStr] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class VkUserAccount(BaseModel):
    """Схема для учетной записи пользователя ВКонтакте."""
    user_id_vk: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class EmailUserAccount(BaseModel):
    """Схема для учетной записи пользователя с использованием email."""
    email_login: Optional[EmailStr] = None
    hash_password: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class AuthorizationAccounts(BaseModel):
    """Общая схема для учетных записей пользователей разных типов авторизации."""
    yandex_user_account: Optional[YandexUserAccount] = None
    vk_user_account: Optional[VkUserAccount] = None
    email_user_account: Optional[EmailUserAccount] = None


class SessionCreate(BaseModel):
    """
    Схема для создания сессии пользователя.
    """
    user_id: str  # Идентификатор пользователя
    created_at: str  # Время создания сессии
    expires_at: str  # Время окончания сессии


class TokenData(BaseModel):
    token: str

class UserResponse(BaseModel):
    message: str
