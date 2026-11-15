from abc import ABC, abstractmethod

from app.dto.request.chat_request import ChatRequest
from app.dto.response.chat_response import ChatResponse


class ChatService(ABC):
    @abstractmethod
    async def chat(self, request: ChatRequest) -> ChatResponse: ...

    @property
    @abstractmethod
    def configured(self) -> bool: ...
