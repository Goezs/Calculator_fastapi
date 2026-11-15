# Backend — Strict Onion Architecture (FastAPI)

Academic-grade calculation engine demonstrating clean separation of concerns and the **Dependency Inversion Principle (DIP)**.

---

## 🧅 Architectural Layers & Inversion of Control

```
                      +---------------------------------------+
                      |       Infrastructure Layer            |
                      |  - FastAPI (REST, Routers, Docs)      |
                      |  - Exception Handlers (400 JSON)      |
                      |  - Uvicorn ASGI Server                |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |        Application Layer              |
                      |  - DTOs (Pydantic Schemas)            |
                      |  - Use Cases (ExecuteOperationUseCase)|
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |         Domain Layer (Core)           |
                      |  - Pure Python Standard Library       |
                      |  - Calculation Value Object           |
                      |  - OperationType Enum                 |
                      |  - Domain Exceptions                  |
                      |  - CalculatorDomainService            |
                      +---------------------------------------+
```

### 1. Domain Layer (`app/domain/`)
- **Zero Framework Coupling:** No imports from FastAPI, Pydantic, or any external library. Standard library only (`dataclasses`, `enum`).
- **Entities & Value Objects (`models.py`):** `Calculation` (immutable dataclass), `OperationType` (Enum with `ADDITION`, `SUBTRACTION`, `MULTIPLICATION`, `DIVISION`).
- **Domain Exceptions (`exceptions.py`):** `DivisionByZeroError`, `InvalidOperationError` inheriting from standard `Exception`.
- **Domain Services (`services.py`):** `CalculatorDomainService` containing pure arithmetic business logic and invariants.

### 2. Application Layer (`app/application/`)
- **Boundary Contracts (`dtos.py`):** Pydantic `BaseModel` classes defining API request/response structures (`CalculateRequestDTO`, `CalculateResponseDTO`, `ErrorResponseDTO`).
- **Use Cases (`use_cases.py`):** `ExecuteOperationUseCase` coordinates requests, executes domain services, and returns response DTOs. Supports Dependency Injection of custom domain services.

### 3. Infrastructure Layer (`app/infrastructure/`)
- **Web Adapters (`api/v1/calculator_router.py`):** FastAPI `APIRouter` mounted at `/api/v1/calculator`. Exposes `POST /calculate` and dedicated routes (`/add`, `/subtract`, `/multiply`, `/divide`).
- **Global Handlers (`api/exception_handlers.py`):** Automatically intercepts `DivisionByZeroError` and returns `HTTP 400 Bad Request` with standard JSON payload.
- **App Entrypoint (`main.py`):** Initializes FastAPI, CORS middleware (allows `http://localhost:5173`), and router registration.

---

## 🚀 Getting Started

### 1. Virtual Environment Setup
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Run the Development Server
```bash
uvicorn app.infrastructure.main:app --reload --port 8000
```
Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)  
Alternative Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 3. Run the Test Suite
```bash
pytest -v
```

---

## 📡 API Contract

### Success Response (`200 OK`)
```json
{
  "operand_a": 10.0,
  "operand_b": 2.0,
  "operation": "DIVISION",
  "result": 5.0
}
```

### Error Response (`400 Bad Request`)
```json
{
  "error": "BAD_REQUEST",
  "message": "Cannot divide by zero",
  "timestamp": "2026-11-13T13:30:00Z"
}
```
