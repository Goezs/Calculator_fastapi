"""Application Data Transfer Objects (DTOs).

Defines serialization/validation schemas for input/output boundary interfaces.
"""
from pydantic import BaseModel, Field
from app.domain.models import OperationType


class CalculateRequestDTO(BaseModel):
    """Input payload DTO for arithmetic calculation."""
    operand_a: float = Field(..., description="First numerical operand")
    operand_b: float = Field(..., description="Second numerical operand")
    operation: OperationType = Field(..., description="Arithmetic operation to perform")

    model_config = {
        "json_schema_extra": {
            "example": {
                "operand_a": 10.0,
                "operand_b": 2.0,
                "operation": "DIVISION"
            }
        }
    }


class CalculateResponseDTO(BaseModel):
    """Output payload DTO containing the result of arithmetic calculation."""
    operand_a: float = Field(..., description="First operand evaluated")
    operand_b: float = Field(..., description="Second operand evaluated")
    operation: OperationType = Field(..., description="Arithmetic operation evaluated")
    result: float = Field(..., description="Computed numerical result")

    model_config = {
        "json_schema_extra": {
            "example": {
                "operand_a": 10.0,
                "operand_b": 2.0,
                "operation": "DIVISION",
                "result": 5.0
            }
        }
    }


class ErrorResponseDTO(BaseModel):
    """Standardized error response payload schema."""
    error: str = Field(..., description="Error category or classification")
    message: str = Field(..., description="Human-readable error explanation")
    timestamp: str = Field(..., description="ISO-8601 UTC timestamp when error occurred")

    model_config = {
        "json_schema_extra": {
            "example": {
                "error": "BAD_REQUEST",
                "message": "Cannot divide by zero",
                "timestamp": "2026-11-13T13:30:00Z"
            }
        }
    }
