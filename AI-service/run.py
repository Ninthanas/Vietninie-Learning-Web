import uvicorn

from app.config.settings import get_settings

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=get_settings().port, reload=True)
