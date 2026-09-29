"""
Unit tests for Review Pipeline.

Tests the complete review pipeline in main.py with mocked Hindsight and Groq calls.
"""

import pytest
from unittest.mock import Mock, MagicMock, patch, AsyncMock
from fastapi.testclient import TestClient
from main import app
from review_store import review_store


client = TestClient(app)


class MockRecallResult:
    """Mock RecallResult object from Hindsight SDK."""
    def __init__(self, text: str, fact_type: str = "world"):
        self.text = text
        self.type = fact_type


class MockRecallResponse:
    """Mock RecallResponse object from Hindsight SDK."""
    def __init__(self, results: list):
        self.results = results


class MockChoice:
    """Mock choice object from Groq SDK."""
    def __init__(self, content: str):
        self.message = Mock()
        self.message.content = content


class MockChatCompletion:
    """Mock chat completion object from Groq SDK."""
    def __init__(self, content: str):
        self.choices = [MockChoice(content)]


@pytest.fixture
def mock_hindsight_service():
    """Fixture that provides a mocked HindsightService."""
    with patch('main.HindsightService') as mock:
        service = MagicMock()
        mock.return_value = service
        yield service


@pytest.fixture
def mock_llm_service():
    """Fixture that provides a mocked LLMService."""
    with patch('main.LLMService') as mock:
        service = MagicMock()
        mock.return_value = service
        yield service


class TestReviewPipeline:
    """Tests for the complete review pipeline."""
    
    def setup_method(self):
        """Clear the review store before each test."""
        review_store.clear()
    
    def teardown_method(self):
        """Clear the review store after each test."""
        review_store.clear()
    
    def test_review_with_no_memories(self, mock_hindsight_service, mock_llm_service):
        """Test review pipeline with no recalled memories."""
        # Mock Hindsight recall to return empty list (async)
        mock_hindsight_service.recall = AsyncMock(return_value=[])
        
        # Mock LLM review (async)
        mock_llm_service.review_code = AsyncMock(return_value={
            "summary": "No issues found",
            "issues": [],
            "team_conventions_used": [],
            "memory_context": []
        })
        
        response = client.post("/api/review", json={
            "code": "print('hello')",
            "language": "Python",
            "framework": None,
            "team_id": "test-team"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "review_id" in data
        assert data["review"]["summary"] == "No issues found"
        assert data["memory_count"] == 0
        assert data["recalled_memories"] == []
        assert data["team_id"] == "test-team"
        
        # Verify services were called
        mock_hindsight_service.recall.assert_called_once()
        mock_llm_service.review_code.assert_called_once()
    
    def test_review_with_recalled_memories(self, mock_hindsight_service, mock_llm_service):
        """Test review pipeline with recalled team memories."""
        # Mock Hindsight recall to return memories (async)
        mock_hindsight_service.recall = AsyncMock(return_value=[
            {"text": "Team prefers structured logging", "type": "observation"},
            {"text": "Use parameterized queries", "type": "world"}
        ])
        
        # Mock LLM review (async)
        mock_llm_service.review_code = AsyncMock(return_value={
            "summary": "Code follows team conventions",
            "issues": [],
            "team_conventions_used": ["Team prefers structured logging"],
            "memory_context": ["Team prefers structured logging", "Use parameterized queries"]
        })
        
        response = client.post("/api/review", json={
            "code": "logger.info('hello')",
            "language": "Python",
            "framework": "FastAPI",
            "team_id": "test-team"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["memory_count"] == 2
        assert len(data["recalled_memories"]) == 2
        assert data["team_id"] == "test-team"
        
        # Verify recall query includes framework
        recall_call = mock_hindsight_service.recall.call_args
        assert "FastAPI" in recall_call[1]["query"]
        assert "Python" in recall_call[1]["query"]
    
    def test_review_with_hindsight_failure(self, mock_hindsight_service, mock_llm_service):
        """Test review pipeline when Hindsight recall fails."""
        # Mock Hindsight recall to raise exception (async)
        mock_hindsight_service.recall = AsyncMock(side_effect=Exception("Hindsight error"))
        
        # Mock LLM review (async)
        mock_llm_service.review_code = AsyncMock(return_value={
            "summary": "Review completed without memory",
            "issues": [],
            "team_conventions_used": [],
            "memory_context": []
        })
        
        response = client.post("/api/review", json={
            "code": "print('hello')",
            "language": "Python",
            "team_id": "test-team"
        })
        
        # Should continue with empty memories
        assert response.status_code == 200
        data = response.json()
        assert data["memory_count"] == 0
        assert data["recalled_memories"] == []
        
        # LLM should still be called
        mock_llm_service.review_code.assert_called_once()
        # Verify LLM was called with empty memory context
        llm_call = mock_llm_service.review_code.call_args
        assert llm_call[1]["memory_context"] == []
    
    def test_review_with_llm_failure(self, mock_hindsight_service, mock_llm_service):
        """Test review pipeline when LLM review fails."""
        # Mock Hindsight recall (async)
        mock_hindsight_service.recall = AsyncMock(return_value=[])
        
        # Mock LLM review to raise error (async)
        mock_llm_service.review_code = AsyncMock(side_effect=RuntimeError("LLM error"))
        
        response = client.post("/api/review", json={
            "code": "print('hello')",
            "language": "Python",
            "team_id": "test-team"
        })
        
        # Should return 500 error
        assert response.status_code == 500
        data = response.json()
        assert "detail" in data
        assert "Code review failed" in data["detail"]
    
    def test_review_with_service_initialization_failure(self):
        """Test review pipeline when service initialization fails."""
        with patch('main.HindsightService') as mock_hindsight:
            mock_hindsight.side_effect = RuntimeError("Service init failed")
            
            response = client.post("/api/review", json={
                "code": "print('hello')",
                "language": "Python",
                "team_id": "test-team"
            })
            
            assert response.status_code == 500
            data = response.json()
            assert "Service initialization failed" in data["detail"]
    
    def test_review_uses_default_team_id(self, mock_hindsight_service, mock_llm_service):
        """Test review pipeline uses default team_id when not provided."""
        mock_hindsight_service.recall = AsyncMock(return_value=[])
        mock_llm_service.review_code = AsyncMock(return_value={
            "summary": "Review",
            "issues": [],
            "team_conventions_used": [],
            "memory_context": []
        })
        
        with patch('main.settings') as mock_settings:
            mock_settings.TEAM_ID = "default-team"
            
            response = client.post("/api/review", json={
                "code": "print('hello')",
                "language": "Python"
                # No team_id provided
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["team_id"] == "default-team"
    
    def test_review_with_framework(self, mock_hindsight_service, mock_llm_service):
        """Test review pipeline includes framework in recall query."""
        mock_hindsight_service.recall = AsyncMock(return_value=[])
        mock_llm_service.review_code = AsyncMock(return_value={
            "summary": "Review",
            "issues": [],
            "team_conventions_used": [],
            "memory_context": []
        })
        
        response = client.post("/api/review", json={
            "code": "print('hello')",
            "language": "Python",
            "framework": "Django",
            "team_id": "test-team"
        })
        
        assert response.status_code == 200
        
        # Verify framework is in recall query
        recall_call = mock_hindsight_service.recall.call_args
        assert "Django" in recall_call[1]["query"]
    
    def test_review_generates_unique_id(self, mock_hindsight_service, mock_llm_service):
        """Test that each review generates a unique review_id."""
        mock_hindsight_service.recall = AsyncMock(return_value=[])
        mock_llm_service.review_code = AsyncMock(return_value={
            "summary": "Review",
            "issues": [],
            "team_conventions_used": [],
            "memory_context": []
        })
        
        response1 = client.post("/api/review", json={
            "code": "print('hello')",
            "language": "Python",
            "team_id": "test-team"
        })
        
        response2 = client.post("/api/review", json={
            "code": "print('hello')",
            "language": "Python",
            "team_id": "test-team"
        })
        
        id1 = response1.json()["review_id"]
        id2 = response2.json()["review_id"]
        
        assert id1 != id2
    
    def test_health_endpoint(self):
        """Test the health check endpoint."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "ReviewMind API"
