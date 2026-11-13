"""Main Application Entrypoint.

Configures FastAPI instance, middleware (CORS), exception handlers,
and registers API routers.
"""
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.domain.exceptions import (
    CalculatorDomainException,
    DivisionByZeroError,
    InvalidOperationError,
)
from app.infrastructure.api.exception_handlers import (
    division_by_zero_exception_handler,
    generic_domain_exception_handler,
    invalid_operation_exception_handler,
)
from app.infrastructure.api.v1.calculator_router import router as calculator_v1_router


def create_application() -> FastAPI:
    """Factory creating and configuring the FastAPI application instance."""
    app = FastAPI(
        title="FastAPI Onion Architecture Calculator API",
        version="1.0.0",
        description=(
            "Academic-grade full-stack calculator backend built strictly adhering to "
            "Onion Architecture / Clean Architecture principles."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # 1. CORS Middleware configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "*",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Global Exception Handlers
    app.add_exception_handler(DivisionByZeroError, division_by_zero_exception_handler)
    app.add_exception_handler(InvalidOperationError, invalid_operation_exception_handler)
    app.add_exception_handler(CalculatorDomainException, generic_domain_exception_handler)

    # 3. Router Registration
    app.include_router(calculator_v1_router, prefix="/api/v1")

    # 4. Health Check Endpoint
    @app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
    @app.get("/api/v1/health", tags=["Health"], status_code=status.HTTP_200_OK)
    async def health_check() -> dict:
        return {"status": "ok", "service": "calculator-api"}

    return app


app = create_application()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.infrastructure.main:app", host="0.0.0.0", port=8000, reload=True)
