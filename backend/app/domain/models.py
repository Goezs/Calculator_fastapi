"""Domain Models & Value Objects.

Strict Onion Architecture Rule:
Uses PURE Python standard library constructs only (dataclasses, enum, typing).
Zero imports from FastAPI, Pydantic, or any external third-party library.
"""
from dataclasses import dataclass
from enum import Enum


class OperationType(str, Enum):
    """Supported arithmetic operations as strongly typed domain value objects."""
    ADDITION = "ADDITION"
    SUBTRACTION = "SUBTRACTION"
    MULTIPLICATION = "MULTIPLICATION"
    DIVISION = "DIVISION"


@dataclass(frozen=True)
class Calculation:
    """Immutable domain entity representing an executed calculation."""
    operand_a: float
    operand_b: float
    operation: OperationType
    result: float
