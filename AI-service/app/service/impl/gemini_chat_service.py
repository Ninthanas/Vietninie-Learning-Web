import logging

from google import genai
from google.genai import errors as genai_errors
from google.genai import types

from app.config.settings import Settings
from app.dto.request.chat_request import ChatRequest
from app.dto.response.chat_response import ChatResponse
from app.enums import Role
from app.exception.errors import ChatUnavailableError
from app.prompt.system_prompt import build_system_prompt
from app.service.chat_service import ChatService
from app.util.text import strip_markdown

log = logging.getLogger("vietninie.chat")


class GeminiChatService(ChatService):
    def __init__(self, settings: Settings):
        self._settings = settings
        self._client = genai.Client(
            api_key=settings.gemini_api_key,
            http_options=types.HttpOptions(api_version="v1beta"),
        ) if settings.gemini_api_key else None

    @property
    def configured(self) -> bool:
        return self._client is not None

    async def chat(self, request: ChatRequest) -> ChatResponse:
        if self._client is None:
            raise ChatUnavailableError("Chưa cấu hình GEMINI_API_KEY cho AI service.")

        history = request.history[-self._settings.max_history_turns :]
        contents = [
            types.Content(
                role="user" if m.role == Role.USER else "model",
                parts=[types.Part.from_text(text=m.content)],
            )
            for m in history
        ]
        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=request.message)]))

        system_prompt = build_system_prompt(request.language)
        try:
            try:
                response = await self._generate(contents, system_prompt)
            except genai_errors.APIError as exc:
                # Some models (e.g. Gemma) reject system instructions: inline them into the first user turn.
                if exc.code == 400 and "instruction" in (exc.message or "").lower():
                    inlined = [c for c in contents]
                    first = inlined[0]
                    inlined[0] = types.Content(
                        role="user",
                        parts=[types.Part.from_text(text=f"{system_prompt}\n\n---\n{first.parts[0].text}")],
                    )
                    response = await self._generate(inlined, None)
                else:
                    raise
        except genai_errors.APIError as exc:
            log.warning("Gemini error %s: %s", exc.code, exc.message)
            if exc.code in (400, 401, 403):
                raise ChatUnavailableError(f"Gemini từ chối yêu cầu ({exc.code}): {exc.message}", 502) from exc
            if exc.code == 404:
                raise ChatUnavailableError(f"Không tìm thấy model '{self._settings.gemini_model}'. Kiểm tra GEMINI_MODEL.", 502) from exc
            if exc.code == 429:
                raise ChatUnavailableError("Gemini đang quá tải/hết hạn mức, vui lòng thử lại sau.", 429) from exc
            raise ChatUnavailableError("Không gọi được Gemini, vui lòng thử lại.", 502) from exc

        text = strip_markdown(response.text or "")
        if not text:
            raise ChatUnavailableError("Gemini không trả về nội dung (có thể bị bộ lọc an toàn chặn).", 502)
        return ChatResponse(reply=text, model=self._settings.gemini_model)

    async def _generate(self, contents, system_prompt):
        return await self._client.aio.models.generate_content(
            model=self._settings.gemini_model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.6,
                max_output_tokens=1024,
            ),
        )
