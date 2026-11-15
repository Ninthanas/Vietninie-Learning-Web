from fastapi import APIRouter, Depends

from app.dto.request.chat_request import ChatRequest
from app.dto.response.chat_response import ChatResponse
from app.service.chat_service import ChatService
from app.util.dependencies import get_chat_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, service: ChatService = Depends(get_chat_service)) -> ChatResponse:
    return await service.chat(request)
