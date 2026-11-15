from pydantic import BaseModel


class ChatResponse(BaseModel):
    reply: str
    model: str


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "vietninie-ai-service"
    gemini_configured: bool
