"""Domain Services.

Contains pure arithmetic business logic and encapsulates business invariants.
Strictly decoupled from application transport or persistence layers.
"""
from app.domain.exceptions import DivisionByZeroError, InvalidOperationError
from app.domain.models import Calculation, OperationType


class CalculatorDomainService:
    """Pure domain service executing arithmetic operations according to business rules."""

    @staticmethod
    def add(a: float, b: float) -> float:
        """Calculate sum of two operands."""
        return a + b

    @staticmethod
    def subtract(a: float, b: float) -> float:
        """Calculate difference between operand a and operand b."""
        return a - b

    @staticmethod
    def multiply(a: float, b: float) -> float:
        """Calculate product of two operands."""
        return a * b

    @staticmethod
    def divide(a: float, b: float) -> float:
        """Calculate quotient of operand a divided by operand b.
        
        Raises:
            DivisionByZeroError: If operand b is 0.0 or 0.
        """
        if b == 0.0 or b == 0:
            raise DivisionByZeroError("Cannot divide by zero")
        return a / b

    def calculate(self, operand_a: float, operand_b: float, operation: OperationType) -> Calculation:
        """Executes the arithmetic operation and returns a Calculation value object.

        Raises:
            DivisionByZeroError: When dividing by zero.
            InvalidOperationError: When the operation is not recognized.
        """
        if operation == OperationType.ADDITION:
            result = self.add(operand_a, operand_b)
        elif operation == OperationType.SUBTRACTION:
            result = self.subtract(operand_a, operand_b)
        elif operation == OperationType.MULTIPLICATION:
            result = self.multiply(operand_a, operand_b)
        elif operation == OperationType.DIVISION:
            result = self.divide(operand_a, operand_b)
        else:
            raise InvalidOperationError(f"Unsupported operation: {operation}")

        return Calculation(
            operand_a=operand_a,
            operand_b=operand_b,
            operation=operation,
            result=result,
        )
