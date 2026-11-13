"""Global Exception Handlers for FastAPI.

Translates domain and application layer exceptions into HTTP 400 Bad Request
conforming strictly to the API contract.
"""
from datetime import datetime, timezone
from fastapi import Request
from fastapi.responses import JSONResponse

from app.domain.exceptions import (
    CalculatorDomainException,
    DivisionByZeroError,
    InvalidOperationError,
)


def _build_bad_request_payload(message: str) -> dict:
    """Format standardized JSON error payload matching API specification."""
    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return {
        "error": "BAD_REQUEST",
        "message": message,
        "timestamp": now_utc,
    }


async def division_by_zero_exception_handler(
    request: Request, exc: DivisionByZeroError
) -> JSONResponse:
    """Handles DivisionByZeroError domain exception, mapping to HTTP 400."""
    return JSONResponse(
        status_code=400,
        content=_build_bad_request_payload(exc.message or "Cannot divide by zero"),
    )


async def invalid_operation_exception_handler(
    request: Request, exc: InvalidOperationError
) -> JSONResponse:
    """Handles InvalidOperationError domain exception, mapping to HTTP 400."""
    return JSONResponse(
        status_code=400,
        content=_build_bad_request_payload(exc.message or "Invalid operation requested"),
    )


async def generic_domain_exception_handler(
    request: Request, exc: CalculatorDomainException
) -> JSONResponse:
    """Fallback handler for any other domain-level violation."""
    return JSONResponse(
        status_code=400,
        content=_build_bad_request_payload(str(exc)),
    )
