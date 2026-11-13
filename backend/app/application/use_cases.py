"""Application Use Cases.

Implements application-specific business workflows orchestrating domain services.
"""
from app.application.dtos import CalculateRequestDTO, CalculateResponseDTO
from app.domain.services import CalculatorDomainService


class ExecuteOperationUseCase:
    """Use case responsible for executing arithmetic operations between numbers."""

    def __init__(self, domain_service: CalculatorDomainService | None = None) -> None:
        """Inject domain service (Dependency Inversion)."""
        self._domain_service = domain_service or CalculatorDomainService()

    def execute(self, request: CalculateRequestDTO) -> CalculateResponseDTO:
        """Orchestrates request DTO mapping, domain execution, and response DTO mapping."""
        domain_result = self._domain_service.calculate(
            operand_a=request.operand_a,
            operand_b=request.operand_b,
            operation=request.operation,
        )

        return CalculateResponseDTO(
            operand_a=domain_result.operand_a,
            operand_b=domain_result.operand_b,
            operation=domain_result.operation,
            result=domain_result.result,
        )
