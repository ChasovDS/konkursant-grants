import json
import re
import os
import logging
from docx import Document
from typing import List, Dict, Any
import asyncio
import aiofiles
import uuid

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class DocxConverter:
    def __init__(self, docx_filepath: str, txt_filepath: str):
        self.docx_filepath = docx_filepath
        self.txt_filepath = txt_filepath

    async def convert_to_txt(self):
        try:
            document = Document(self.docx_filepath)
            async with aiofiles.open(self.txt_filepath, 'w', encoding='utf-8') as txt_file:
                for paragraph in document.paragraphs:
                    await txt_file.write(paragraph.text + '\n')
            logging.info(f"Файл '{self.txt_filepath}' успешно создан.")
        except Exception as e:
            logging.error(f"Ошибка при конвертации DOCX в TXT: {e}")
            raise

    async def check_structure(self):
        required_phrases = [
            "Вкладка \"Общее\"",
            "Вкладка \"О проекте\"",
            "Вкладка \"Команда\"",
            "Вкладка \"Результаты\"",
            "Вкладка \"Календарный план\"",
            "Вкладка \"Медиа\"",
            "Вкладка \"Расходы\"",
            "Вкладка \"Софинансирование\"",
            "Вкладка \"Доп. Файлы\""
        ]

        try:
            # Асинхронное чтение файла
            async with aiofiles.open(self.txt_filepath, 'r', encoding='utf-8') as txt_file:
                content = await txt_file.read()

            # Проверка наличия необходимых фраз
            for phrase in required_phrases:
                if phrase not in content:
                    raise ValueError(f"Ошибка: '{phrase}' не обнаружена в файле.")

            logging.info("Структура файла корректна.")
        except Exception as e:
            logging.error(f"Ошибка при проверке структуры файла: {e}")
            raise

class DataExtractor:
    def __init__(self, txt_filepath: str):
        self.txt_filepath = txt_filepath
        self.data = self.initialize_data_structure()

    @staticmethod
    def initialize_data_structure() -> Dict[str, Any]:
        return {
            "author_name": "",
            "project_name": "",
            "region": "",
            "contacts": {
                "phone": "",
                "email": ""
            },
            "project_data_tabs": {
                "tab_general_info": "",
                "tab_project_info": "",
                "tab_team": "",
                "tab_results": "",
                "tab_calendar_plan": "",
                "tab_media": "",
                "tab_expenses":"",
                "tab_cofinancing": "",
                "tab_additional_files": ""
            }
        }

    async def extract_data(self) -> Dict[str, Any]:
        try:
            # Асинхронное чтение файла
            async with aiofiles.open(self.txt_filepath, 'r', encoding='utf-8') as file:
                lines = await file.readlines()

            for line in lines:
                if "ФИО:" in line:
                    self.data["author_name"] = line.split("ФИО:")[1].strip()
                elif "Название проекта:" in line:
                    self.data["project_name"] = line.split("Название проекта:")[1].strip()
                elif "Регион проекта:" in line:
                    self.data["region"] = line.split("Регион проекта:")[1].strip()
                elif "Контакты:" in line:
                    contacts = line.split("Контакты:")[1].strip().split(", ")
                    if contacts:
                        self.data["contacts"]["phone"] = contacts[0]
                    if len(contacts) > 1:
                        self.data["contacts"]["email"] = contacts[1]

            # Вызов методов для извлечения данных
            self.data["project_data_tabs"]["tab_general_info"] = self.result_general_info(lines)
            self.data["project_data_tabs"]["tab_project_info"] = self.result_project_info(lines)
            self.data["project_data_tabs"]["tab_team"] = self.result_team_members(lines)
            self.data["project_data_tabs"]["tab_results"] = self.result_extraction(lines)
            self.data["project_data_tabs"]["tab_calendar_plan"] = self.result_calendar_plan(lines)
            self.data["project_data_tabs"]["tab_media"] = self.result_media(lines)
            self.data["project_data_tabs"]["tab_cofinancing"] = self.result_cofinancing(lines)
            self.data["project_data_tabs"]["tab_additional_files"] = self.result_additional_files(lines)
            self.data["project_data_tabs"]["tab_expenses"] = self.result_expenses(lines)

            logging.info("Данные успешно извлечены из TXT файла.")
            return self.data
        except Exception as e:
            logging.error(f"Ошибка при извлечении данных из файла '{self.txt_filepath}': {e}")
            raise


    def result_general_info(self, lines: List[str]) -> Dict[str, str]:
        general_info = dict(
            project_scale="",
            project_duration="",
            author_experience="",
            author_functionality="",
            author_registration_address="",
            resume={"resume_id": str(uuid.uuid4()), "resume_url": ""},
            video_link=""
        )

        lines = extract_between_headers(lines, ['Блок "Общая информация"'], 'Блок "Информация о проекте"')

        general_info["project_scale"] = ' '.join(extract_between_headers(
            lines, ["Масштаб реализации проекта:"], "Дата начала и окончания проекта:"
        ))
        general_info["project_duration"] = ' '.join(extract_between_headers(
            lines, ["Дата начала и окончания проекта:"], 'Блок "Дополнительная информация об авторе проекта"'
        ))
        general_info["author_experience"] = ' '.join(extract_between_headers(
            lines, ['Опыт автора проекта:'], "Описание функционала автора проекта:"
        ))
        general_info["author_functionality"] = ' '.join(extract_between_headers(
            lines, ["Описание функционала автора проекта:"], "Адрес регистрации автора проекта:"
        ))
        general_info["author_registration_address"] = ' '.join(extract_between_headers(
            lines, ["Адрес регистрации автора проекта:"], "Добавить резюме:"
        ))
        general_info["video_link"] = ' '.join(extract_between_headers(
            lines, ["Видео-визитка (ссылка на ролик на любом видеохостинге):"], 'Вкладка "О проекте"'
        ))

        return general_info


    def result_project_info(self, lines: List[str]) -> Dict[str, str]:
        project_info = dict(
            brief_info="",
            problem_description="",
            target_groups="",
            main_goal="",
            successful_experience="",
            development_perspective="",
            tasks=[],  # Инициализируем как список
            geography=[]  # Инициализируем как список
        )

        lines = extract_between_headers(lines, ['Блок "Информация о проекте"'], 'Блок "География проекта"')

        # Извлечение информации по заголовкам
        project_info["brief_info"] = ' '.join(extract_between_headers(
            lines, ["Краткая информация о проекте:"], "Описание проблемы, решению/снижению которой посвящен проект:"))

        project_info["problem_description"] = ' '.join(extract_between_headers(
            lines, ["Описание проблемы, решению/снижению которой посвящен проект:"], "Основные целевые группы, на которые направлен проект:"))

        project_info["target_groups"] = ' '.join(extract_between_headers
            (lines, ["Основные целевые группы, на которые направлен проект:"], "Основная цель проекта:"))

        project_info["main_goal"] = ' '.join(extract_between_headers
            (lines, ["Основная цель проекта:"], "Опыт успешной реализации проекта:"))

        project_info["successful_experience"] = ' '.join(extract_between_headers(
            lines, ["Опыт успешной реализации проекта:"], "Перспектива развития и потенциал проекта:"))

        project_info["development_perspective"] = ' '.join(extract_between_headers(
            lines, ["Перспектива развития и потенциал проекта:"], 'Блок "Задачи"'))
    
        # Извлечение задач
        for line in lines:
            if "Поставленная задача:" in line:
                task = line.split("Поставленная задача:")[1].strip()
                if task not in project_info["tasks"]:  # Проверка на наличие задачи
                    project_info["tasks"].append(task)  # Добавление задачи в список

        # Извлечение географической информации
        for i, line in enumerate(lines):
            if "Выберите регион или федеральный округ:" in line:
                region = line.split("Выберите регион или федеральный округ:")[1].strip()
                address_line = lines[i + 1].strip() if i + 1 < len(lines) else ""
                address = address_line.split("Адрес:")[1].strip() if "Адрес:" in address_line else ""
                project_info["geography"].append({  # Добавление географической информации в список
                    "region": region,
                    "address": address
                })

        return project_info

    def result_extraction(self, lines):
        result_extraction = {
            "planned_date": "",
            "planned_events_count": "",
            "final_date": "",
            "participants_count": "",
            "publications_count": "",
            "views_count": "",
            "social_effect": ""
        }

        combined_lines = extract_between_headers(lines, ['Вкладка "Результаты"'], 'Вкладка "Календарный план"')

        # Удаление всех данных, оставляя только числа
        numbers_only = extract_numbers(combined_lines)

        # Список ключей для присвоения значений
        keys = [
            "planned_date",
            "planned_events_count",
            "final_date",
            "participants_count",
            "publications_count",
            "views_count"
        ]

        # Присвоение значений в словарь результата
        for i, key in enumerate(keys):
            if i < len(numbers_only):
                result_extraction[key] = numbers_only[i]

        # Извлечение социального эффекта
        social_effect = extract_between_headers(combined_lines, ['Социальный эффект:'], 'Вкладка "Календарный план"')
        if social_effect:
            result_extraction["social_effect"] = social_effect

        return result_extraction

    def result_team_members(self, lines):
        team_list = []

        # Извлечение блока данных о команде
        combined_lines = extract_between_headers(lines, ['Вкладка "Команда"'], 'Вкладка "Результаты"')

        # Разделяем строки для обработки
        lines = [line.strip() for line in combined_lines if line.strip()]  # Убираем пустые строки

        # Временные переменные для хранения данных о каждом участнике
        current_member = {}

        for line in lines:
            if "ФИО наставника:" in line:
                if current_member:  # Если текущий участник не пустой, добавляем его в список
                    team_list.append(current_member)
                current_member = {
                    "teammate_id": str(uuid.uuid4()),  # Генерация уникального ID
                    "mentor_name": line.split("ФИО наставника:")[1].strip(),
                    "mentor_email": None,
                    "role": None,
                    "competencies": None,
                    "resume": ""
                }
            elif "E-mail наставника:" in line:
                current_member["mentor_email"] = line.split("E-mail наставника:")[1].strip()
            elif "Роль в проекте:" in line:
                current_member["role"] = line.split("Роль в проекте:")[1].strip()
            elif "Компетенции, опыт, подтверждающие возможность участника выполнять роль в команде:" in line:
                current_member["competencies"] = \
                line.split("Компетенции, опыт, подтверждающие возможность участника выполнять роль в команде:")[
                    1].strip()

        # Добавляем последнего участника, если он есть
        if current_member:
            team_list.append(current_member)

        return team_list


    def result_calendar_plan(self, lines):
        result_extraction = {
            "tasks": []
        }
        lines = extract_between_headers(lines, ['Вкладка "Календарный план"'], 'Вкладка "Медиа"')

        current_task = None
        current_event = None
        reading_additional_info = False

        for line in lines:
            line = line.strip()

            # Проверка на начало новой задачи
            if line.startswith("Поставленная задача:"):
                # Завершаем текущую задачу и добавляем ее в список, если она не пустая
                if current_task:
                    if current_event:
                        current_task["events"].append(current_event)
                    result_extraction["tasks"].append(current_task)

                # Создаем новую задачу
                current_task = {
                    "task_id": str(uuid.uuid4()),
                    "task_name": line.split("Поставленная задача:")[1].strip(),
                    "events": []
                }
                current_event = None  # Сбрасываем текущее мероприятие

            # Проверка на начало нового мероприятия
            elif line.startswith("Название мероприятия:") and current_task is not None:
                if current_event:
                    current_task["events"].append(current_event)  # Сохраняем предыдущее мероприятие

                # Создаем новое мероприятие
                current_event = {
                    "event_id": str(uuid.uuid4()),
                    "title": line.split("Название мероприятия:")[1].strip(),
                    "due_date": None,
                    "description": "",
                    "unique_participants": None,
                    "recurring_participants": None,
                    "publications_count": None,
                    "views_count": None,
                    "additional_info": ""
                }
                reading_additional_info = False

            # Проверка на крайний срок выполнения
            elif line.startswith("Крайняя дата выполнения:") and current_event is not None:
                current_event["due_date"] = line.split("Крайняя дата выполнения:")[1].strip()

            # Проверка на уникальных участников
            elif line.startswith("Количество уникальных участников:") and current_event is not None:
                value = line.split("Количество уникальных участников:")[1].strip()
                current_event["unique_participants"] = int(value) if value else 0

            # Проверка на повторяющихся участников
            elif line.startswith("Количество повторяющихся участников:") and current_event is not None:
                value = line.split("Количество повторяющихся участников:")[1].strip()
                current_event["recurring_participants"] = int(value) if value else 0

            # Проверка на количество публикаций
            elif line.startswith("Количество публикаций:") and current_event is not None:
                value = line.split("Количество публикаций:")[1].strip()
                current_event["publications_count"] = int(value) if value else 0

            # Проверка на количество просмотров
            elif line.startswith("Количество просмотров:") and current_event is not None:
                value = line.split("Количество просмотров:")[1].strip()
                current_event["views_count"] = int(value) if value else 0

            # Проверка на начало описания мероприятия
            elif line.startswith("Описание мероприятия:") and current_event is not None:
                current_event["description"] += line.split("Описание мероприятия:")[1].strip() + "\n"

            # Проверка на начало дополнительной информации
            elif line.startswith("Дополнительная информация:") and current_event is not None:
                reading_additional_info = True
                current_event["additional_info"] += line.split("Дополнительная информация:")[1].strip() + "\n"

            # Чтение многострочной дополнительной информации
            elif reading_additional_info and current_event is not None:
                current_event["additional_info"] += line + "\n"

        # Добавляем последний обработанный элемент, если он существует
        if current_event:
            current_task["events"].append(current_event)
        if current_task:
            result_extraction["tasks"].append(current_task)

        return result_extraction

    def result_media(self, lines):
        # Список для хранения всех медиа ресурсов
        media_resources = []

        # Извлекаем строки между заголовками
        combined_lines = extract_between_headers(lines, ['Вкладка "Медиа"'], 'Вкладка "Расходы"')

        current_resource = None
        collecting_links = False
        collecting_reason = False

        for line in combined_lines:
            line = line.strip()
            if not line:
                continue

            if line.startswith("Вид ресурса:"):
                # Сохраняем предыдущий ресурс, если он существует
                if current_resource is not None:
                    media_resources.append(current_resource)

                # Создаем новый ресурс
                current_resource = {
                    "media_resource_id": str(uuid.uuid4()),  # Генерируем уникальный ID
                    "resource_type": line.split("Вид ресурса:")[1].strip(),
                    "publication_month": "",
                    "planned_views": "",
                    "resource_links": [],
                    "reason_for_format": ""
                }
                collecting_links = False
                collecting_reason = False

            elif current_resource is not None:
                if line.startswith("Месяц публикации:"):
                    current_resource["publication_month"] = line.split("Месяц публикации:")[1].strip()
                elif line.startswith("Планируемое количество просмотров:"):
                    current_resource["planned_views"] = line.split("Планируемое количество просмотров:")[1].strip()
                elif line.startswith("Ссылки на ресурсы:"):
                    collecting_links = True
                    current_resource["resource_links"].append(line.split("Ссылки на ресурсы:")[1].strip())
                elif line.startswith("Почему выбран такой формат медиа:"):
                    collecting_links = False
                    collecting_reason = True
                    current_resource["reason_for_format"] = line.split("Почему выбран такой формат медиа:")[1].strip()
                elif collecting_links:
                    # Добавляем новые ссылки на ресурсы
                    current_resource["resource_links"].append(line.strip())
                elif collecting_reason:
                    current_resource["reason_for_format"] += " " + line.strip()

        # Добавляем последний обработанный ресурс, если он существует
        if current_resource is not None:
            media_resources.append(current_resource)

        # Возвращаем список медиа ресурсов
        return  media_resources


    def result_cofinancing(self, lines: List[str]) -> Dict[str, Any]:
        result_extraction = {
            "own_funds": {
                "expenses_description": "",
                "expenses_list": []
            },
            "partner_funds": []
        }

        # Извлечение текста между заголовками
        combined_lines = extract_between_headers(lines, ['Вкладка "Софинансирование"'], 'Вкладка "Доп. Файлы"')

        # Проверка, что combined_lines является списком и объединение в строку
        if isinstance(combined_lines, list):
            combined_lines = ''.join(combined_lines)  # Объединяем список строк в одну строку
        elif not isinstance(combined_lines, str):
            logging.error("Ошибка: combined_lines не является строкой или списком строк.")
            return result_extraction  # Возвращаем пустую структуру

        # Извлечение перечня расходов
        own_funding_match = re.search(
            r'Блок "Собственные средства".*?Перечень расходов:\s*(.*?)\s*(?=Добавить:)',
            combined_lines, re.DOTALL
        )



        if own_funding_match:
            expenses_description = own_funding_match.group(1).strip()

            result_extraction["own_funds"]["expenses_description"] = expenses_description
            # Извлечение сумм и файлов
            amounts_and_files = re.findall(
                r'Сумма, руб.:\s*(\d+)\s*Файл:\s*(.*?)\s*(?=Сумма, руб\.|$)',
                combined_lines, re.DOTALL
            )

            # Добавляем каждую сумму и файл в результат
            for amount, file_link in amounts_and_files:
                result_extraction["own_funds"]["expenses_list"].append({
                    "expense_own_id": str(uuid.uuid4()),  # Генерация уникального ID
                    "amount": amount.strip(),
                    "file_link": None  # Проверяем, есть ли файл
                })

        # Извлечение информации о партнерах
        partner_matches = re.findall(
            r'Название партнера:\s*(.+?)\nТип поддержки:\s*(.+?)\nПеречень расходов:\s*(.+?)\nСумма, руб\.: (\d+)',
            combined_lines, re.DOTALL
        )

        for match in partner_matches:
            partner_info = {
                "expense_partner_id": str(uuid.uuid4()),  # Генерация уникального ID
                "partner_name": match[0].strip(),
                "support_type": match[1].strip(),
                "expense_description": match[2].strip().replace('\n', ' '),
                "amount": match[3].strip(),
                "file_link": None  # Здесь также можно добавить логику для обработки файлов
            }
            result_extraction["partner_funds"].append(partner_info)

        return result_extraction

    def result_additional_files(self, lines: List[str]) -> List[Dict[str, Any]]:
        result_extraction = []  # Изменяем на список для хранения информации о файлах

        # Обработка блока "Доп. Файлы"
        additional_files_lines = extract_between_headers(lines, ['Вкладка "Доп. Файлы"'])

        # Проверяем, что результат является списком строк
        if isinstance(additional_files_lines, list):
            additional_files_combined = ''.join(additional_files_lines)
        elif isinstance(additional_files_lines, str):
            additional_files_combined = additional_files_lines  # Если это строка, просто присваиваем
        else:
            logging.error("Ошибка: additional_files_combined не является строкой или списком строк.")
            return result_extraction  # Возвращаем пустую структуру

        # Извлечение дополнительных файлов
        file_matches = re.findall(
            r'Описание файла:\s*(.+?)\nВыберете файл:\s*(\S+)',
            additional_files_combined, re.DOTALL
        )

        # Обработка найденных файлов
        for match in file_matches:
            file_info = {
                "files_id": str(uuid.uuid4()),  # Используем ID файла
                "file_description": match[0].strip(),
                "file_url": None  # Можно добавить логику для получения URL, если необходимо
            }
            result_extraction.append(file_info)  # Добавляем информацию о файле в список

        return result_extraction  # Возвращаем список с информацией о файлах


    def result_expenses(self, lines: List[str]) -> Dict[str, Any]:
        result_extraction = {
            "total_expense": None,
            "categories": []
        }

        # Словарь для соответствия категорий и их ID
        category_ids = {
            "Сайт / приложение": "1",
            "Расходы на связь": "2",
            "Канцелярия и расходные материалы": "3",
            "Полиграфическая продукция": "4",
            "Подарки, сувенирная продукция": "5",
            "Проживание и питание": "6",
            "Транспортные расходы": "7",
            "Аренда помещений": "8",
            "Аренда оборудования": "9",
            "Информационные услуги": "10",
            "Закупка оборудования": "11",
            "Дополнительные услуги и товары для проекта": "12",
            "Расходы на ПО": "13",
        }

        # Инициализация категорий
        for category_name, category_id in category_ids.items():
            result_extraction["categories"].append({
                "expense_category_id": category_id,
                "name": category_name,
                "records": []  # Изначально пустой список записей
            })

        combined_lines = extract_between_headers(lines, ['Вкладка "Расходы"'], 'Вкладка "Софинансирование"')

        # Извлечение общей суммы расходов
        total_expense = extract_between_headers(lines, ['Общая сумма расходов:'], 'Категория')

        # Записываем только первые 2 строки
        result_extraction["total_expense"] = total_expense[:1]

        # Обработка строк с категориями и записями
        current_category = None
        value_type = None

        for i, line in enumerate(combined_lines):
            line = line.strip()

            # Обработка категории расходов
            category_match = re.match(r'Категория "(.*)"', line)
            if category_match:
                category_name = category_match.group(1)
                # Поиск текущей категории в результатах
                current_category = next((cat for cat in result_extraction["categories"] if cat["name"] == category_name), None)
                continue

            # Обработка типа расходов
            type_match = re.match(r'Тип "(.*)"', line)
            if type_match and current_category:
                value_type = type_match.group(1)
                continue

            # Обработка записей расходов
            record_match = re.match(r'Запись № \d+', line)
            if record_match and current_category is not None:
                record = {
                    "expense_record_id": str(uuid.uuid4()),  # Уникальный ID для каждой записи
                    "type": value_type,
                    "title": None,
                    "description": None,
                    "quantity": None,
                    "price": None,
                    "total": None
                }

                for j in range(1, 6):
                    if i + j < len(combined_lines):
                        next_line = combined_lines[i + j].strip()
                        if next_line.startswith("Название:"):
                            record["title"] = next_line.replace("Название:", "").strip()
                        elif next_line.startswith("Описание:"):
                            record["description"] = next_line.replace("Описание:", "").strip()
                        elif next_line.startswith("Количество:"):
                            record["quantity"] = next_line.replace("Количество:", "").strip()
                        elif next_line.startswith("Цена:"):
                            record["price"] = next_line.replace("Цена:", "").strip()
                        elif next_line.startswith("Сумма:"):
                            record["total"] = next_line.replace("Сумма:", "").strip()

                current_category["records"].append(record)

        # Добавляем пустую запись только для категорий, где нет расходов
        for category in result_extraction["categories"]:
            if not category["records"]:  # Если записи пустые
                empty_record = {
                    "title": None,
                    "description": None,
                    "expense_record_id": str(uuid.uuid4()),  # Уникальный ID для каждой пустой записи
                    "type": None,
                    "identifier": None,
                    "quantity": None,
                    "price": None,
                    "total": None
                }
                category["records"].append(empty_record)

        return result_extraction

class JSONWriter:
    @staticmethod
    async def write_to_json(data: Dict[str, Any], json_filepath: str):
        try:
            async with aiofiles.open(json_filepath, 'w', encoding='utf-8') as json_file:
                await json_file.write(json.dumps(data, ensure_ascii=False, indent=4))
            logging.info(f"Данные успешно записаны в JSON файл '{json_filepath}'.")
        except IOError as e:
            logging.error(f"Ошибка ввода-вывода при записи JSON файла '{json_filepath}': {e}")
            raise
        except TypeError as e:
            logging.error(f"Невозможно сериализовать объект в JSON: {e}")
            raise ValueError("Невозможно сериализовать объект в JSON.") from e


def extract_numbers(data):
    results = []

    for text in data:
        # Найти все числа и даты в каждой строке
        found_items = re.findall(r'\d{1,2}\.\d{1,2}\.\d{4}|\d+', text)
        # Добавить найденные предметы в общий список
        results.extend(found_items)

    return results

def extract_between_headers(lines: List[str], start_headers: List[str], end_header: str = None) -> List[str]:
    is_collecting = False
    collected_lines = []

    # Преобразуем заголовки в регулярные выражения для гибкости
    start_patterns = [re.escape(header) + r'\s*' for header in start_headers]
    end_pattern = re.escape(end_header) + r'\s*' if end_header else None

    for line in lines:
        # Проверяем, начинается ли строка с одного из заголовков
        if any(re.match(pattern, line) for pattern in start_patterns):
            is_collecting = True
            logging.info(f"Начато собирание строк после заголовка: {line.strip()}")
            continue

        # Проверяем, заканчивается ли сбор данных на заголовке
        if end_pattern and re.match(end_pattern, line):
            logging.info(f"Сбор строк остановлен на заголовке: {line.strip()}")
            break

        # Если мы находимся в режиме сбора, добавляем строки без изменения
        if is_collecting:
            collected_lines.append(line)  # Добавляем текущую строку в исходном виде

    return collected_lines



async def convert_docx_to_json(docx_filepath: str):
    parent_folder = os.path.dirname(os.path.dirname(docx_filepath))
    file_name = os.path.splitext(os.path.basename(docx_filepath))[0]

    # Пути к папкам
    txt_folder = os.path.join(parent_folder, "projects_txt")
    json_folder = os.path.join(parent_folder, "projects_json")

    os.makedirs(txt_folder, exist_ok=True)
    os.makedirs(json_folder, exist_ok=True)

    txt_filepath = os.path.join(txt_folder, f"{file_name}.txt")
    json_filepath = os.path.join(json_folder, f"{file_name}.json")

    # Создаем экземпляр конвертера
    converter = DocxConverter(docx_filepath, txt_filepath)
    await converter.convert_to_txt()

    # Проверяем структуру файла
    await converter.check_structure()

    # Создаем экземпляр извлекателя данных
    extractor = DataExtractor(txt_filepath)
    data = await extractor.extract_data()

    await JSONWriter.write_to_json(data, json_filepath)

    return json_filepath
async def main():
    docx_filepath = "12.docx"
    await convert_docx_to_json(docx_filepath)

if __name__ == "__main__":
    asyncio.run(main())
