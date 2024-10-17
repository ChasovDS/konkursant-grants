from fastapi import APIRouter, HTTPException, Depends, Response
from typing import List, Optional
from src.modules.reviews.schemas import Review, ReviewCreate, ReviewUpdate, CriteriaEvaluation
from src.modules.auth.utils import create_jwt, decode_jwt
from src.utils import check_permissions
from datetime import datetime
from bson import ObjectId
from src.database import projects_data_collection, reviews_data_collection

router = APIRouter()

SERVICE_NAME = "reviews_service"

def calculate_total_score(criteria: CriteriaEvaluation) -> int:
    """
    Функция для вычисления общей суммы баллов по критериям.
    """
    return (
        criteria.team_experience_competencies +
        criteria.project_relevance_social_significance +
        criteria.solution_uniqueness_addressing_problem +
        criteria.project_scale +
        criteria.project_perspective_potential +
        criteria.project_information_transparency +
        criteria.project_feasibility_effectiveness +
        criteria.own_contribution_additional_resources +
        criteria.planned_project_expenses +
        criteria.project_budget_realism
    )

# Эндпоинт для создания новой проверки
@router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate, project_id: str, token: dict = Depends(decode_jwt)):
    """
    Создание новой проверки.
    """
    await check_permissions(token, operation_type="high-level_review_operation")

    reviewer_id = token.get("user_id")

    # Проверка, оставлял ли уже проверяющий отзыв для данного проекта
    existing_review = await reviews_data_collection.find_one({
        "project_id": project_id,
        "reviewer_id": reviewer_id
    })

    if existing_review:
        raise HTTPException(status_code=400, detail="Рецензент уже отправил рецензию на этот проект.")

    # Подготовка данных для вставки
    review_data = {
        "reviewer_id": reviewer_id,  # ID проверяющего
        "project_id": project_id,  # ID проекта
        "create_date": datetime.utcnow(),  # Дата создания
        "update_date": datetime.utcnow(),  # Дата обновления
        "criteria_evaluation": review.criteria_evaluation.dict(),  # Оценка критериев
        "expert_comment": review.expert_comment  # Комментарий эксперта
    }

    # Вставка новой проверки в коллекцию
    result = await reviews_data_collection.insert_one(review_data)

    # Вычисление общей суммы баллов по критериям
    total_score = calculate_total_score(review.criteria_evaluation)

    # Обновление проекта с новой проверкой
    await projects_data_collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$addToSet": {"reviews": {
            "review_id": str(result.inserted_id),  # Используем ID вставленной проверки
            "expert_id": reviewer_id,
            "score": total_score  # Общая оценка
        }}}
    )

    # Получение вставленного объекта
    new_review = await reviews_data_collection.find_one({"_id": result.inserted_id})
    new_review["review_id"] = str(result.inserted_id)

    return Review(**new_review)


# Эндпоинт для получения списка проверок
@router.get("/reviews", response_model=List[Review])
async def get_reviews(token: dict = Depends(decode_jwt)):
    """
    Получение списка всех проверок.
    """

    await check_permissions(token, operation_type == "high-level_operation")
    reviews_cursor = reviews_data_collection.find()
    reviews = await reviews_cursor.to_list(length=100)
    return [Review(**review, review_id=str(review["_id"])) for review in reviews]


# Эндпоинт для получения проверок по project_id
@router.get("/reviews/project/{project_id}", response_model=List[Review])
async def get_reviews_by_project(project_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение списка проверок по ID проекта.
    """
    await check_permissions(token, SERVICE_NAME, project_id=project_id)

    reviews_cursor = reviews_data_collection.find({"project_id": project_id})
    reviews = await reviews_cursor.to_list(length=100)
    return [Review(**review, review_id=str(review["_id"])) for review in reviews]


# Эндпоинт для получения информации о конкретной проверке по ID
@router.get("/reviews/{review_id}", response_model=Review)
async def get_review(review_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение информации о проверке по её ID.
    """

    await check_permissions(token, SERVICE_NAME, review_id=review_id)

    review = await reviews_data_collection.find_one({"_id": ObjectId(review_id)})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return Review(**review)


# Эндпоинт для обновления проверки по ID
@router.put("/reviews/{review_id}", response_model=Review)
async def update_review(review_id: str, review: ReviewUpdate, token: dict = Depends(decode_jwt)):
    """
    Обновление проверки по её ID.
    """
    # Проверка прав доступа
    # await check_permissions(token, required_permissions=["update_reviews"])

    # Шаг 1: Найти проверку по review_id
    await check_permissions(token, SERVICE_NAME, review_id=review_id)

    existing_review = await reviews_data_collection.find_one({"_id": ObjectId(review_id)})
    if not existing_review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Шаг 2: Извлечь project_id из найденной проверки
    project_id = existing_review.get("project_id")
    if not project_id:
        raise HTTPException(status_code=404, detail="Project ID not found in review")

    # Обновляем данные проверки
    update_data = {k: v for k, v in review.dict().items() if v is not None}
    update_data["update_date"] = datetime.utcnow()

    result = await reviews_data_collection.update_one(
        {"_id": ObjectId(review_id)},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Review not found or no changes made")

    # Шаг 3: Вычисление общей суммы баллов по критериям
    total_score = calculate_total_score(review.criteria_evaluation)

    # Обновление конкретной проверки в массиве reviews проекта
    await projects_data_collection.update_one(
        {"_id": ObjectId(project_id), "reviews.review_id": str(review_id)},
        {"$set": {
            "reviews.$.expert_id": existing_review["reviewer_id"],  # Сохраняем ID проверяющего
            "reviews.$.score": total_score  # Обновляем score
        }}
    )

    updated_review = await reviews_data_collection.find_one({"_id": ObjectId(review_id)})
    updated_review["review_id"] = str(updated_review["_id"])  # Добавляем review_id

    return Review(**updated_review)


# Эндпоинт для удаления проверки по ID
@router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, token: dict = Depends(decode_jwt)):
    """
    Удаление проверки по её ID из всех связанных таблиц.
    """
    await check_permissions(token, SERVICE_NAME, review_id=review_id)
    # Шаг 1: Найти проверку по review_id
    existing_review = await reviews_data_collection.find_one({"_id": ObjectId(review_id)})
    if not existing_review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Шаг 2: Извлечь project_id из найденной проверки
    project_id = existing_review.get("project_id")
    if not project_id:
        raise HTTPException(status_code=404, detail="Project ID not found in review")

    # Шаг 3: Удаление проверки из коллекции assessments
    result = await reviews_data_collection.delete_one({"_id": ObjectId(review_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")

    # Шаг 4: Удаление ссылки на проверку из всех проектов
    await projects_data_collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$pull": {"reviews": {"review_id": str(review_id)}}}
    )

    return {"message": "Review deleted successfully"}


# Эндпоинт для получения списка проверок конкретного эксперта
@router.get("/reviews/expert/{expert_id}", response_model=List[Review])
async def get_reviews_by_expert(expert_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение списка всех проверок конкретного эксперта по его ID.
    """
    # Проверка прав доступа
    await check_permissions(token, operation_type="high-level_review_operation")

    # Поиск проверок по reviewer_id (эксперт)
    reviews_cursor = reviews_data_collection.find({"reviewer_id": expert_id})
    reviews = await reviews_cursor.to_list(length=100)

    if not reviews:
        raise HTTPException(status_code=404, detail="Проверки созданные данным экспертов не найдены.")

    # Возвращаем список проверок
    return [Review(**review, review_id=str(review["_id"])) for review in reviews]


# Эндпоинт для получения списка оцененных проектов конкретного эксперта
@router.get("/projects/expert/{expert_id}", response_model=List[dict])
async def get_projects_by_expert(expert_id: str, token: dict = Depends(decode_jwt)):
    """
    Получение списка проектов конкретного эксперта по его ID.
    """
    # Проверка прав доступа (можно настроить по необходимости)
    await check_permissions(token, operation_type="high-level_review_operation")

    # Поиск проектов по expert_id
    projects_cursor = projects_data_collection.find({"expert_id": expert_id})
    projects = await projects_cursor.to_list(length=100)

    if not projects:
        raise HTTPException(status_code=404, detail="Проекты оцененные данным экспертом не найдены.")

    # Возвращаем список проектов
    return [{"project_id": str(project["_id"]), **project} for project in projects]