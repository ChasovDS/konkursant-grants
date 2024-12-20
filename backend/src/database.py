# src/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

# Создаем асинхронный клиент для подключения к MongoDB
# Здесь указываем адрес и порт сервера MongoDB
client = AsyncIOMotorClient(settings.mongodb_url)

#----------------------------------------------------------------------------------------------------

# Подключаемся к базе данных для хранения учетных записей пользователей

user_accounts_db = client["user_accounts_db"]

# Создаем коллекции для различных типов учетных записей

authorization_accounts_collection = user_accounts_db["authorization_accounts"]

# Создаем коллекцию для хранения ролей пользователей
user_roles_collection = user_accounts_db["user_roles"]

# Создаем коллекцию для хранения сессий пользователей
user_sessions_collection = user_accounts_db["session"]

#----------------------------------------------------------------------------------------------------

# Подключаемся к базе данных для хранения контента приложения
content_storage_db = client["content_storage_db"]

# Создаем коллекцию для хранения данных пользователей
profile_data_collection = content_storage_db["profile_data"]

# Создаем коллекцию для хранения данных мероприятий
events_data_collection = content_storage_db["events_data"]

# Создаем коллекцию для хранения данных проектов
projects_data_collection = content_storage_db["projects_data"]

# Создаем коллекцию для хранения данных проектов
reviews_data_collection = content_storage_db["review_data"]
