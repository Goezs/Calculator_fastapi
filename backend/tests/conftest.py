"""Shared Pytest fixtures."""
import pytest
from fastapi.testclient import TestClient

from app.infrastructure.main import create_application


@pytest.fixture(scope="session")
def client() -> TestClient:
    """Provides a TestClient connected to the FastAPI application."""
    app = create_application()
    with TestClient(app) as test_client:
        yield test_client
