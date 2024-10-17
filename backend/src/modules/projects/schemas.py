from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum
# Базовая модель для общих полей


# Определение Enum для шаблонов проектов
class ProjectTemplate(str, Enum):
    FIZ_LITSO = "ФИЗ_ЛИЦО"
class BaseRecord(BaseModel):
    title: Optional[str] = None  # Заголовок
    description: Optional[str] = None  # Описание

# Модель для информации о контактах
class ContactInfo(BaseModel):
    phone: Optional[str] = None  # Телефон
    email: Optional[EmailStr] = None  # E-mail

# Модель для общей информации
class GeneralInfo(BaseModel):
    project_scale: Optional[str] = None  # Масштаб реализации проекта
    project_duration: Optional[str] = None  # Дата начала и окончания проекта
    author_experience: Optional[str] = None  # Опыт автора проекта
    author_functionality: Optional[str] = None  # Описание функционала автора
    author_registration_address: Optional[str] = None  # Адрес регистрации автора
    resume: Optional[str] = None  # Резюме
    video_link: Optional[str] = None  # Ссылка на видео-визитку

# Модель для информации о проекте
class ProjectInfo(BaseModel):
    brief_info: Optional[str] = None  # Краткая информация о проекте
    problem_description: Optional[str] = None  # Описание проблемы
    target_groups: Optional[str] = None  # Целевые группы
    main_goal: Optional[str] = None  # Основная цель проекта
    successful_experience: Optional[str] = None  # Опыт успешной реализации
    development_perspective: Optional[str] = None  # Перспектива развития
    tasks: Optional[List[str]] = None  # Задачи проекта
    geography: Optional[List[str]] = None  # География проекта

# Модель для информации о команде
class TeamMember(BaseModel):
    teammate_id: Optional[str] = None  # Сделано опциональным
    mentor_name: Optional[str] = None  # ФИО наставника
    mentor_email: Optional[EmailStr] = None  # E-mail наставника
    role: Optional[str] = None  # Роль в проекте
    competencies: Optional[str] = None  # Компетенции и опыт
    resume: Optional[str] = None  # Резюме

# Модель для результатов проекта
class Results(BaseModel):
    planned_date: Optional[datetime] = None  # Дата плановых значений
    planned_events_count: Optional[int] = None  # Плановое количество мероприятий
    participants_count: Optional[int] = None  # Количество участников
    publications_count: Optional[int] = None  # Количество публикаций
    views_count: Optional[int] = None  # Количество просмотров
    social_effect: Optional[str] = None  # Социальный эффект

# Модель для мероприятия
class Event(BaseModel):
    event_id: Optional[str] = None  # Сделано опциональным
    title: Optional[str] = None  # Название мероприятия
    due_date: Optional[datetime] = None  # Крайняя дата
    description: Optional[str] = None  # Описание
    unique_participants: Optional[int] = None  # Количество уникальных участников
    recurring_participants: Optional[int] = None  # Количество повторяющихся участников
    publications_count: Optional[int] = None  # Количество публикаций
    views_count: Optional[int] = None  # Количество просмотров
    additional_info: Optional[str] = None  # Дополнительная информация

# Модель для задачи
class Task(BaseModel):
    task_id: Optional[str] = None  # Сделано опциональным
    task_name: Optional[str] = None  # Поставленная задача
    events: Optional[List[Event]] = None  # Список мероприятий

# Модель для календарного плана
class CalendarPlan(BaseModel):
    tasks: Optional[List[Task]] = None  # Список задач

# Модель для медиа ресурсов
class MediaResource(BaseModel):
    media_resource_id: Optional[str] = None  # Сделано опциональным
    resource_type: Optional[str] = None  # Вид ресурса
    publication_month: Optional[str] = None  # Месяц публикации
    planned_views: Optional[int] = None  # Планируемое количество просмотров
    resource_links: Optional[List[str]] = None  # Ссылки на ресурсы
    reason_for_format: Optional[str] = None  # Почему выбран такой формат медиа

# Модель для записи расходов
class ExpenseRecord(BaseRecord):
    expense_record_id: Optional[str] = None  # Сделано опциональным
    type: Optional[str] = None  # Тип (товар/услуга)
    identifier: Optional[str] = None  # Идентификатор(имя) статьи расходов
    quantity: Optional[int] = None  # Количество
    price: Optional[str] = None  # Цена
    total: Optional[str] = None  # Сумма

# Модель для категории расходов
class ExpenseCategory(BaseModel):
    expense_category_id: Optional[str] = None  # Сделано опциональным
    name: Optional[str] = None  # Название категории
    records: Optional[List[ExpenseRecord]] = None  # Записи расходов в категории

# Обновленная модель для блока расходов
class Expense(BaseModel):
    total_expense: Optional[str] = None  # Общая сумма расходов
    categories: Optional[List[ExpenseCategory]] = None  # Список категорий расходов

class OwnFunds(BaseModel):
    expense_own_id: Optional[str] = None  # Сделано опциональным
    expense_description: Optional[str] = None  # Перечень расходов
    amount: Optional[float] = None  # Сумма, руб.
    file_link: Optional[str] = None  # Ссылка на файл

class PartnerFunds(BaseModel):
    expense_partner_id: Optional[str] = None  # Сделано опциональным
    partner_name: Optional[str] = None  # Название партнера
    support_type: Optional[str] = None  # Тип поддержки
    expense_description: Optional[str] = None  # Перечень расходов
    amount: Optional[float] = None   # Сумма, руб.
    file_link: Optional[str] = None  # Ссылка на файл

# Модель для софинансирования
class Cofinancing(BaseModel):
    own_funds: Optional[List[OwnFunds]] = None  # Перечень расходов собственных средств
    partner_funds: Optional[List[PartnerFunds]] = None  # Перечень расходов от партнеров

# Модель для блока дополнительных файлов
class AdditionalFiles(BaseModel):
    files_id: Optional[str] = None  # ID файла
    file_description: Optional[str] = None  # Описание файла
    file_url: Optional[str] = None  # Ссылка на файл

class ProjectDataTabs(BaseModel):
    tab_general_info: Optional[GeneralInfo] = None  # Общая информация
    tab_project_info: Optional[ProjectInfo] = None  # Информация о проекте
    tab_team: Optional[List[TeamMember]] = None  # Команда
    tab_results: Optional[Results] = None  # Результаты
    tab_calendar_plan: Optional[CalendarPlan] = None  # Календарный план
    tab_media: Optional[List[MediaResource]] = None  # Медиа ресурсы
    tab_expenses: Optional[Expense] = None  # Расходы
    tab_cofinancing: Optional[Cofinancing] = None  # Софинансирование
    tab_additional_files: Optional[List[AdditionalFiles]] = None  # Дополнительные файлы

# Модель для проверки
class Review(BaseModel):
    review_id: Optional[str] = None  # ID проверки
    expert_id: Optional[str] = None  # ID эксперта
    score: Optional[int] = None  # Баллы проверки

# Главная модель шаблона проекта для ФИЗ ЛИЦ
class ProjectFICPerson(BaseModel):
    create_date: Optional[datetime] = None  # Дата создания проекта
    update_date: Optional[datetime] = None  # Дата обновления проекта
    author_id: Optional[str] = None  # ID автора
    author_name: Optional[str] = None  # ФИО автора
    project_name: Optional[str] = None  # Название проекта
    project_template: Optional[str] = None  # Шаблон проекта
    region: Optional[str] = None  # Регион проекта
    logo: Optional[str] = None  # Логотип проекта
    contacts: Optional[ContactInfo] = None  # Контакты
    project_data_tabs: Optional[ProjectDataTabs] = None  # Данные проекта
    reviews: Optional[List[Review]] = None   # Список проверок

# Модель для краткой информации о проекте
class ProjectFICPersonSummary(BaseModel):
    project_id: Optional[str] = None  # ID проекта
    creation_date: Optional[datetime] = None  # Дата создания
    update_date: Optional[datetime] = None  # Дата обновления
    project_name: Optional[str] = None  # Название проекта
    author_id: Optional[str] = None  # ID автора
    author_name: Optional[str] = None  # Имя автора проекта
    project_template: Optional[str] = None  # Шаблон проекта
    reviews: Optional[List[Review]] = None    # Список проверок

class ProjectFICPersonUpdateData(BaseModel):
    update_date: Optional[datetime] = None  # Дата обновления проекта
    author_name: Optional[str] = None  # ФИО автора
    project_name: Optional[str] = None  # Название проекта
    region: Optional[str] = None  # Регион проекта
    logo: Optional[str] = None  # Логотип проекта
    contacts: Optional[ContactInfo] = None  # Контакты
    project_data_tabs: Optional[ProjectDataTabs] = None  # Данные проект

# Модель для секций проекта с возможностью обновления
class SectionsToUpdate(BaseModel):
    basic_information: Optional[bool] = False  # Основная информация
    tab_general: Optional[bool] = False  # Вкладка "Общее"
    tab_about_project: Optional[bool] = False  # Вкладка "О проекте"
    tab_team: Optional[bool] = False  # Вкладка "Команда"
    tab_results: Optional[bool] = False  # Вкладка "Результаты"
    tab_calendar_plan: Optional[bool] = False  # Вкладка "Календарный план"
    tab_media: Optional[bool] = False  # Вкладка "Медиа"
    tab_expenses: Optional[bool] = False  # Вкладка "Расходы"
    tab_cofinancing: Optional[bool] = False  # Вкладка "Софинансирование"
    tab_additional_files: Optional[bool] = False  # Вкладка "Доп. Файлы"
