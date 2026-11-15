"""Convenience root entrypoint for running backend with uvicorn or direct python.

Example:
    uvicorn main:app --reload --port 8000
"""
from app.infrastructure.main import app, create_application

__all__ = ["app", "create_application"]

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
