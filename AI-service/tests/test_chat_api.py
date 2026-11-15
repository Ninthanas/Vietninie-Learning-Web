import pytest
from fastapi.testclient import TestClient

from app.dto.request.chat_request import ChatRequest
from app.dto.response.chat_response import ChatResponse
from app.main import app
from app.service.chat_service import ChatService
from app.util.dependencies import get_chat_service


class FakeService(ChatService):
    configured = True

    async def chat(self, request: ChatRequest) -> ChatResponse:
        return ChatResponse(reply=f"echo:{request.message}:{len(request.history)}:{request.language.value}", model="fake")


@pytest.fixture
def client():
    app.dependency_overrides[get_chat_service] = lambda: FakeService()
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok", "service": "vietninie-ai-service", "gemini_configured": True}


def test_chat_ok(client):
    r = client.post("/api/chat", json={"message": "你好", "history": [{"role": "user", "content": "a"}], "language": "zh"})
    assert r.status_code == 200 and r.json()["reply"] == "echo:你好:1:zh"


def test_chat_validation_returns_detail(client):
    r = client.post("/api/chat", json={"message": ""})
    assert r.status_code == 422 and "detail" in r.json()


def test_missing_key_gives_503():
    app.dependency_overrides.clear()
    from app.config.settings import Settings
    from app.service.impl.gemini_chat_service import GeminiChatService

    app.dependency_overrides[get_chat_service] = lambda: GeminiChatService(Settings(gemini_api_key=""))
    r = TestClient(app).post("/api/chat", json={"message": "hi"})
    app.dependency_overrides.clear()
    assert r.status_code == 503 and "GEMINI_API_KEY" in r.json()["detail"]


def test_cors_preflight(client):
    r = client.options("/api/chat", headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"})
    assert r.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_strip_markdown():
    from app.util.text import strip_markdown

    assert strip_markdown("Mình là **Lạt Lạt** (辣辣)\n* một\n## Tiêu đề") == "Mình là Lạt Lạt (辣辣)\n- một\nTiêu đề"
