# Vietninie AI Service (FastAPI + Gemini)

Chatbot trả lời từ kiến thức sẵn có của Gemini, giao tiếp với FE qua REST. Không có DB, không có model/repository.

## Cấu trúc
```
app/
  controller/   # endpoint (chat, health)
  dto/request|response/
  enums/        # Role, Language
  service/      # ChatService (interface) + impl/GeminiChatService
  config/       # settings (.env), CORS
  exception/    # lỗi -> {"detail": "..."}
  prompt/       # system prompt
  util/         # dependency injection
tests/
```

## Chạy
```powershell
cd AI-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env      # rồi điền GEMINI_API_KEY
python run.py               # http://localhost:8000  (docs: /docs)
```
Test: `python -m pytest -q`

## API
| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/health` | `{"status":"ok","service":"vietninie-ai-service","gemini_configured":true}` |
| POST | `/api/chat` | body `{ "message": "...", "history": [{"role":"user|assistant","content":"..."}], "language": "vi|zh" }` → `{ "reply": "...", "model": "..." }` |

Lỗi trả về `{"detail": "..."}` (503 thiếu key, 502 key sai/Gemini lỗi, 429 hết hạn mức).
Server không lưu hội thoại: FE gửi kèm `history` (tối đa 30 lượt, server dùng 20 lượt cuối).

API key chỉ đặt trong `.env` (đã nằm trong `.gitignore`), không bao giờ đưa vào FE.
