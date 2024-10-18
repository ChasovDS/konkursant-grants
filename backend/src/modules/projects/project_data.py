# src/modules/projects/project_data.py

from src.modules.projects.schemas import (
    CalendarPlan,
    Task,
    Event,
    Expense,
    ExpenseRecord,
    ExpenseCategory,
    OwnFunds,
    PartnerFunds,
    Cofinancing,
)

# Вспомогательная функция для создания события
def create_event(event_id, title=None, due_date=None, description=None,
                 unique_participants=None, recurring_participants=None,
                 publications_count=None, views_count=None, additional_info=None):
    return Event(
        event_id=event_id,
        title=title,
        due_date=due_date,
        description=description,
        unique_participants=unique_participants,
        recurring_participants=recurring_participants,
        publications_count=publications_count,
        views_count=views_count,
        additional_info=additional_info
    )

# Вспомогательная функция для создания задачи
def create_task(task_id, task_name, events):
    return Task(
        task_id=task_id,
        task_name=task_name,
        events=events
    )

# Вспомогательная функция для создания записи расхода
def create_expense_record(expense_record_id, title=None, description=None,
                          identifier=None, quantity=None, price=None, total=None):
    return ExpenseRecord(
        expense_record_id=expense_record_id,
        title=title,
        description=description,
        identifier=identifier,
        quantity=quantity,
        price=price,
        total=total
    )

# Вспомогательная функция для создания категории расходов
def create_expense_category(expense_category_id, name, records):
    return ExpenseCategory(
        expense_category_id=expense_category_id,
        name=name,
        records=records
    )

# Вспомогательная функция для создания собственных фондов
def create_own_fund(expense_own_id, expense_description=None, amount=None, file_link=None):
    return OwnFunds(
        expense_own_id=expense_own_id,
        expense_description=expense_description,
        amount=amount,
        file_link=file_link
    )

# Вспомогательная функция для создания партнерских фондов
def create_partner_fund(expense_partner_id, partner_name=None, support_type=None,
                        expense_description=None, amount=None, file_link=None):
    return PartnerFunds(
        expense_partner_id=expense_partner_id,
        partner_name=partner_name,
        support_type=support_type,
        expense_description=expense_description,
        amount=amount,
        file_link=file_link
    )

# Создание событий
event1 = create_event("temporary_plug_id")

# Создание задач с мероприятиями
task1 = create_task("temporary_plug_id", "Задача 1", [event1])  # Добавляем задачу с событием

# Создание календарного плана с задачами
tab_calendar_plan = CalendarPlan(
    tasks=[task1]  # Добавляем задачи в календарный план
)

# Создание записей расходов
expense_record1 = create_expense_record("temporary_plug_id")

# Создание категорий расходов
expense_categories = [
    create_expense_category("1", "Расходы на связь", [expense_record1]),
    create_expense_category("2", "Канцелярия и расходные материалы", [expense_record1]),
    create_expense_category("3", "Полиграфическая продукция", [expense_record1]),
    create_expense_category("4", "Подарки, сувенирная продукция", [expense_record1]),
    create_expense_category("5", "Проживание и питание", [expense_record1]),
    create_expense_category("6", "Транспортные расходы", [expense_record1]),
    create_expense_category("7", "Аренда помещений", [expense_record1]),
    create_expense_category("8", "Аренда оборудования", [expense_record1]),
    create_expense_category("9", "Информационные услуги", [expense_record1]),
    create_expense_category("10", "Закупка оборудования", [expense_record1]),
    create_expense_category("11", "Дополнительные услуги и товары для проекта", [expense_record1]),
    create_expense_category("12", "Расходы на ПО", [expense_record1]),
]

# Создание блока расходов
expenses = Expense(
    total_expense=None,
    categories=expense_categories
)

# Создание собственных фондов
own_fund1 = create_own_fund("temporary_plug_id")

# Создание партнерских фондов
partner_fund1 = create_partner_fund("temporary_plug_id")

# Создание блока софинансирования
cofinancing = Cofinancing(
    own_funds=[own_fund1],
    partner_funds=[partner_fund1]
)