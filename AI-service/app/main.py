from fastapi import FastAPI

from app.config.cors import setup_cors
from app.config.settings import get_settings
from app.controller import chat_controller, health_controller
from app.exception.errors import register_exception_handlers

settings = get_settings()

app = FastAPI(title="Vietninie AI Service", version="1.0.0")
setup_cors(app, settings)
register_exception_handlers(app)
app.include_router(health_controller.router)
app.include_router(chat_controller.router)
