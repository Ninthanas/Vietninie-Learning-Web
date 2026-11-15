from functools import lru_cache

from app.config.settings import get_settings
from app.service.chat_service import ChatService
from app.service.impl.gemini_chat_service import GeminiChatService


@lru_cache
def get_chat_service() -> ChatService:
    return GeminiChatService(get_settings())
