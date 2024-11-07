from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CriteriaEvaluation(BaseModel):
    team_experience_competencies: int  # Оценка опыта и компетенций команды проекта.
    project_relevance_social_significance: int  # Оценка актуальности и социальной значимости проекта.
    solution_uniqueness_addressing_problem: int  # Оценка уникальности и адресности решения проблемы.
    project_scale: int  # Оценка масштаба реализации проекта и вовлеченных участников.
    project_perspective_potential: int  # Оценка перспектив развития и потенциала проекта.
    project_information_transparency: int  # Оценка информационной открытости проекта.
    project_feasibility_effectiveness: int  # Оценка реализуемости и результативности проекта.
    own_contribution_additional_resources: int  # Оценка собственного вклада и дополнительных ресурсов.
    planned_project_expenses: int  # Оценка планируемых расходов на проект.
    project_budget_realism: int  # Оценка реалистичности бюджета проекта с учетом региональных особенностей.



class ReviewCreate(BaseModel):
    reviewer_id: Optional[str] = None
    project_id: Optional[str] = None
    criteria_evaluation: CriteriaEvaluation
    expert_comment: Optional[str] = None

class ReviewUpdate(BaseModel):
    criteria_evaluation: Optional[CriteriaEvaluation] = None
    expert_comment: Optional[str] = None

# Модель для коллекции проверки
class Review(BaseModel):
    review_id: str
    reviewer_id: str  # ID проверяющего
    reviewer_full_name: Optional[str] = None
    project_id: str  # ID проекта
    create_date: Optional[datetime] = None  # Дата создания проверки
    update_date: Optional[datetime] = None  # Дата последнего обновления проверки
    criteria_evaluation: CriteriaEvaluation  # Оценка критериев
    expert_comment: Optional[str] = None  # Комментарий эксперта
