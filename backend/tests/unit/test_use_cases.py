"""Unit tests for the Application Use Cases."""
import pytest

from app.application.dtos import CalculateRequestDTO, CalculateResponseDTO
from app.application.use_cases import ExecuteOperationUseCase
from app.domain.exceptions import DivisionByZeroError
from app.domain.models import OperationType
from app.domain.services import CalculatorDomainService


class TestExecuteOperationUseCase:
    def test_execute_addition_orchestration(self):
        use_case = ExecuteOperationUseCase()
        request = CalculateRequestDTO(
            operand_a=15.5,
            operand_b=4.5,
            operation=OperationType.ADDITION,
        )

        response = use_case.execute(request)

        assert isinstance(response, CalculateResponseDTO)
        assert response.operand_a == 15.5
        assert response.operand_b == 4.5
        assert response.operation == OperationType.ADDITION
        assert response.result == 20.0

    def test_execute_division_by_zero_propagates_domain_exception(self):
        use_case = ExecuteOperationUseCase()
        request = CalculateRequestDTO(
            operand_a=42.0,
            operand_b=0.0,
            operation=OperationType.DIVISION,
        )

        with pytest.raises(DivisionByZeroError) as exc_info:
            use_case.execute(request)

        assert "Cannot divide by zero" in str(exc_info.value)

    def test_dependency_injection_custom_service(self):
        class MockDomainService(CalculatorDomainService):
            def calculate(self, operand_a, operand_b, operation):
                from app.domain.models import Calculation
                return Calculation(
                    operand_a=operand_a,
                    operand_b=operand_b,
                    operation=operation,
                    result=999.0,
                )

        mock_service = MockDomainService()
        use_case = ExecuteOperationUseCase(domain_service=mock_service)
        request = CalculateRequestDTO(
            operand_a=1.0,
            operand_b=2.0,
            operation=OperationType.ADDITION,
        )
        response = use_case.execute(request)
        assert response.result == 999.0
