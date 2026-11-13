"""Domain Exceptions.

Pure standard library exceptions representing invariant violations in business logic.
"""


class CalculatorDomainException(Exception):
    """Base exception for all domain-specific calculator errors."""
    pass


class DivisionByZeroError(CalculatorDomainException):
    """Raised when an operation attempts to divide by zero."""
    def __init__(self, message: str = "Cannot divide by zero") -> None:
        super().__init__(message)
        self.message = message


class InvalidOperationError(CalculatorDomainException):
    """Raised when an operation requested is unknown or unsupported by domain rules."""
    def __init__(self, message: str = "Invalid operation requested") -> None:
        super().__init__(message)
        self.message = message
