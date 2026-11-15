from fastapi import APIRouter, Depends

from app.dto.response.chat_response import HealthResponse
from app.service.chat_service import ChatService
from app.util.dependencies import get_chat_service

router = APIRouter(tags=["health"])


@router.get("/api/health", response_model=HealthResponse)
def health(service: ChatService = Depends(get_chat_service)) -> HealthResponse:
    return HealthResponse(gemini_configured=service.configured)
