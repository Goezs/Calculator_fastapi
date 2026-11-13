"""Unit tests for the pure Domain Service (zero framework dependencies)."""
import pytest

from app.domain.exceptions import DivisionByZeroError, InvalidOperationError
from app.domain.models import Calculation, OperationType
from app.domain.services import CalculatorDomainService


class TestCalculatorDomainService:
    @pytest.fixture
    def service(self) -> CalculatorDomainService:
        return CalculatorDomainService()

    def test_add_positive_numbers(self, service: CalculatorDomainService):
        result = service.add(5.0, 3.0)
        assert result == 8.0

    def test_add_negative_and_floating_numbers(self, service: CalculatorDomainService):
        result = service.add(-2.5, 7.5)
        assert result == 5.0

    def test_subtract_numbers(self, service: CalculatorDomainService):
        result = service.subtract(10.0, 4.0)
        assert result == 6.0

    def test_multiply_numbers(self, service: CalculatorDomainService):
        result = service.multiply(6.0, 7.0)
        assert result == 42.0

    def test_divide_valid_numbers(self, service: CalculatorDomainService):
        result = service.divide(10.0, 2.0)
        assert result == 5.0

    def test_divide_by_zero_raises_domain_exception(self, service: CalculatorDomainService):
        with pytest.raises(DivisionByZeroError) as exc_info:
            service.divide(10.0, 0.0)
        assert "Cannot divide by zero" in str(exc_info.value)

    def test_calculate_addition_returns_domain_entity(self, service: CalculatorDomainService):
        calculation = service.calculate(12.0, 8.0, OperationType.ADDITION)
        assert isinstance(calculation, Calculation)
        assert calculation.operand_a == 12.0
        assert calculation.operand_b == 8.0
        assert calculation.operation == OperationType.ADDITION
        assert calculation.result == 20.0

    def test_calculate_division_by_zero_raises_error(self, service: CalculatorDomainService):
        with pytest.raises(DivisionByZeroError):
            service.calculate(100.0, 0.0, OperationType.DIVISION)

    def test_calculate_invalid_operation_raises_error(self, service: CalculatorDomainService):
        with pytest.raises(InvalidOperationError):
            service.calculate(10.0, 5.0, "POWER")  # type: ignore
