"""Integration tests for the Calculator REST API and Global Exception Handlers."""
from fastapi import status
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok", "service": "calculator-api"}


def test_calculate_addition_success(client: TestClient):
    payload = {
        "operand_a": 15.5,
        "operand_b": 4.5,
        "operation": "ADDITION",
    }
    response = client.post("/api/v1/calculator/calculate", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["operand_a"] == 15.5
    assert data["operand_b"] == 4.5
    assert data["operation"] == "ADDITION"
    assert data["result"] == 20.0


def test_calculate_subtraction_success(client: TestClient):
    payload = {
        "operand_a": 25.0,
        "operand_b": 7.0,
        "operation": "SUBTRACTION",
    }
    response = client.post("/api/v1/calculator/calculate", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["result"] == 18.0


def test_calculate_multiplication_success(client: TestClient):
    payload = {
        "operand_a": 6.0,
        "operand_b": 7.0,
        "operation": "MULTIPLICATION",
    }
    response = client.post("/api/v1/calculator/calculate", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["result"] == 42.0


def test_calculate_division_success_exact_contract(client: TestClient):
    payload = {
        "operand_a": 10.0,
        "operand_b": 2.0,
        "operation": "DIVISION",
    }
    response = client.post("/api/v1/calculator/calculate", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "operand_a": 10.0,
        "operand_b": 2.0,
        "operation": "DIVISION",
        "result": 5.0,
    }


def test_calculate_division_by_zero_returns_400_with_contract(client: TestClient):
    payload = {
        "operand_a": 10.0,
        "operand_b": 0.0,
        "operation": "DIVISION",
    }
    response = client.post("/api/v1/calculator/calculate", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data["error"] == "BAD_REQUEST"
    assert data["message"] == "Cannot divide by zero"
    assert "timestamp" in data
    # Verify timestamp format ends with Z or matches ISO
    assert data["timestamp"].endswith("Z")


def test_dedicated_add_endpoint(client: TestClient):
    response = client.post(
        "/api/v1/calculator/add",
        json={"operand_a": 12.0, "operand_b": 8.0},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["result"] == 20.0
    assert response.json()["operation"] == "ADDITION"


def test_dedicated_divide_endpoint_by_zero(client: TestClient):
    response = client.post(
        "/api/v1/calculator/divide",
        json={"operand_a": 9.0, "operand_b": 0.0},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data["error"] == "BAD_REQUEST"
    assert data["message"] == "Cannot divide by zero"
