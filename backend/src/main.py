# src/main.py
from fastapi import FastAPI
from src.modules.auth.router import router as auth_router
from src.modules.profile.router import router as profiles_router
from src.modules.events.router import router as events_router
from src.modules.projects.router import router as projects_router
from src.modules.reviews.router import router as reviews_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Конкурсант API"
)

app.include_router(auth_router, prefix="/api/v1", tags=["Авторизация (auth)"])

app.include_router(profiles_router, prefix="/api/v1", tags=["Пользовательские данные (profile)"])

app.include_router(events_router, prefix="/api/v1", tags=["Мероприятия (events)"])

app.include_router(projects_router, prefix="/api/v1", tags=["Проекты (projects)"])

app.include_router(reviews_router, prefix="/api/v1", tags=["Проверка (reviews)"])




# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost',
        "http://26.23.23.244:3000/",
        "http://172.25.160.1:3000/",
        "http://192.168.0.109:3000/",
        "http://172.23.112.1:3000/",
        'http://130.193.46.135',
        'http://130.193.46.135:3000',
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Стартовая страница"])
async def root():
    return {"message": "Добро пожаловать в API Конкурсант"}

