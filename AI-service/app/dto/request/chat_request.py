from pydantic import BaseModel, Field

from app.enums import Language, Role


class ChatMessage(BaseModel):
    role: Role
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    # Previous turns (oldest first). The client keeps the conversation; the server is stateless.
    history: list[ChatMessage] = Field(default_factory=list, max_length=30)
    language: Language = Language.VI
