"""Calculator REST Router (FastAPI).

Exposes HTTP endpoints translating web requests into Application Use Case executions.
"""
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field

from app.application.dtos import (
    CalculateRequestDTO,
    CalculateResponseDTO,
    ErrorResponseDTO,
)
from app.application.use_cases import ExecuteOperationUseCase
from app.domain.models import OperationType

router = APIRouter(prefix="/calculator", tags=["Calculator"])


def get_calculator_use_case() -> ExecuteOperationUseCase:
    """Dependency provider for ExecuteOperationUseCase."""
    return ExecuteOperationUseCase()


class SimpleOperandsDTO(BaseModel):
    """Simplified payload for operation-specific endpoints."""
    operand_a: float = Field(..., description="First operand")
    operand_b: float = Field(..., description="Second operand")


@router.post(
    "/calculate",
    response_model=CalculateResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Execute arithmetic calculation",
    description="Takes two numerical operands and an arithmetic operation, returning the computed result.",
    responses={
        200: {"model": CalculateResponseDTO, "description": "Successful calculation"},
        400: {"model": ErrorResponseDTO, "description": "Domain error (e.g., division by zero)"},
    },
)
async def calculate(
    payload: CalculateRequestDTO,
    use_case: ExecuteOperationUseCase = Depends(get_calculator_use_case),
) -> CalculateResponseDTO:
    """Calculates result based on dynamic operation payload."""
    return use_case.execute(payload)


@router.post(
    "/add",
    response_model=CalculateResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Dedicated addition endpoint",
)
async def add_operands(
    payload: SimpleOperandsDTO,
    use_case: ExecuteOperationUseCase = Depends(get_calculator_use_case),
) -> CalculateResponseDTO:
    """Perform addition of two numbers."""
    req = CalculateRequestDTO(
        operand_a=payload.operand_a,
        operand_b=payload.operand_b,
        operation=OperationType.ADDITION,
    )
    return use_case.execute(req)


@router.post(
    "/subtract",
    response_model=CalculateResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Dedicated subtraction endpoint",
)
async def subtract_operands(
    payload: SimpleOperandsDTO,
    use_case: ExecuteOperationUseCase = Depends(get_calculator_use_case),
) -> CalculateResponseDTO:
    """Perform subtraction of two numbers."""
    req = CalculateRequestDTO(
        operand_a=payload.operand_a,
        operand_b=payload.operand_b,
        operation=OperationType.SUBTRACTION,
    )
    return use_case.execute(req)


@router.post(
    "/multiply",
    response_model=CalculateResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Dedicated multiplication endpoint",
)
async def multiply_operands(
    payload: SimpleOperandsDTO,
    use_case: ExecuteOperationUseCase = Depends(get_calculator_use_case),
) -> CalculateResponseDTO:
    """Perform multiplication of two numbers."""
    req = CalculateRequestDTO(
        operand_a=payload.operand_a,
        operand_b=payload.operand_b,
        operation=OperationType.MULTIPLICATION,
    )
    return use_case.execute(req)


@router.post(
    "/divide",
    response_model=CalculateResponseDTO,
    status_code=status.HTTP_200_OK,
    summary="Dedicated division endpoint",
    responses={
        400: {"model": ErrorResponseDTO, "description": "Division by zero error"},
    },
)
async def divide_operands(
    payload: SimpleOperandsDTO,
    use_case: ExecuteOperationUseCase = Depends(get_calculator_use_case),
) -> CalculateResponseDTO:
    """Perform division of two numbers."""
    req = CalculateRequestDTO(
        operand_a=payload.operand_a,
        operand_b=payload.operand_b,
        operation=OperationType.DIVISION,
    )
    return use_case.execute(req)
