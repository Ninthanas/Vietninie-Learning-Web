from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class AppError(Exception):
    def __init__(self, detail: str, status_code: int = 500):
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code


class ChatUnavailableError(AppError):
    """Gemini key missing or upstream failure."""

    def __init__(self, detail: str, status_code: int = 503):
        super().__init__(detail, status_code)


def register_exception_handlers(app: FastAPI) -> None:
    # Same error shape as the Spring backend: {"detail": "..."}
    @app.exception_handler(AppError)
    async def _app_error(_: Request, exc: AppError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError):
        first = exc.errors()[0] if exc.errors() else {}
        field = ".".join(str(p) for p in first.get("loc", [])[1:])
        return JSONResponse(status_code=422, content={"detail": f"Dữ liệu không hợp lệ: {field} {first.get('msg', '')}".strip()})
