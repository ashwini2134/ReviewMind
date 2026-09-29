"""
Unit tests for Feedback Endpoint.

Tests the POST /api/review/feedback endpoint with mocked Hindsight calls.
"""

import pytest
from unittest.mock import Mock, MagicMock, patch
from fastapi.testclient import TestClient
from main import app
from review_store import review_store


client = TestClient(app)


class TestFeedbackEndpoint:
    """Tests for the feedback endpoint."""
    
    def setup_method(self):
        """Clear the review store before each test."""
        review_store.clear()
    
    @pytest.fixture
    def mock_hindsight_service(self):
        """Fixture that provides a mocked HindsightService."""
        with patch('main.HindsightService') as mock:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock.return_value = service
            yield service
    
    def test_accepted_issue_retained(self):
        """Test that accepted issue is retained as team convention."""
        # Save a review first
        review_id = "test-review-1"
        review_store.save_review(
            review_id=review_id,
            code="print('hello')",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={
                "summary": "Review",
                "issues": [
                    {
                        "id": "issue-1",
                        "title": "Avoid print statements",
                        "suggestion": "Use structured logging instead"
                    }
                ]
            },
            recalled_memories=[]
        )
        
        # Mock Hindsight retain
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "issue_id": "issue-1",
                "decision": "accepted",
                "feedback": None,
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["retained"] is True
            assert "Team convention" in data["memory"]
            assert data["decision"] == "accepted"
            
            # Verify retain was called
            service.retain.assert_called_once()
            call_args = service.retain.call_args
            assert "Team convention" in call_args[1]["content"]
    
    def test_rejected_with_feedback_retained(self):
        """Test that rejected issue with feedback is retained."""
        review_id = "test-review-2"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "decision": "rejected",
                "feedback": "This is a CLI script, not production code",
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["retained"] is True
            assert "rejected" in data["memory"]
    
    def test_rejected_without_feedback_not_retained(self):
        """Test that rejected issue without feedback is not retained."""
        review_id = "test-review-3"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "decision": "rejected",
                "feedback": None,
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["retained"] is False
            assert "No meaningful" in data["message"]
            
            # Verify retain was NOT called
            service.retain.assert_not_called()
    
    def test_not_relevant_with_feedback_retained(self):
        """Test that not_relevant with feedback is retained."""
        review_id = "test-review-4"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "decision": "not_relevant",
                "feedback": "This is a test file, not actual code",
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["retained"] is True
            assert "Team context" in data["memory"]
    
    def test_not_relevant_without_feedback_not_retained(self):
        """Test that not_relevant without feedback is not retained."""
        review_id = "test-review-5"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "decision": "not_relevant",
                "feedback": None,
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["retained"] is False
            
            # Verify retain was NOT called
            service.retain.assert_not_called()
    
    def test_invalid_review_id(self):
        """Test feedback with invalid review_id."""
        response = client.post("/api/review/feedback", json={
            "review_id": "nonexistent-review",
            "decision": "accepted",
            "team_id": "test-team"
        })
        
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()
    
    def test_invalid_decision(self):
        """Test feedback with invalid decision."""
        review_id = "test-review-6"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        response = client.post("/api/review/feedback", json={
            "review_id": review_id,
            "decision": "invalid",
            "team_id": "test-team"
        })
        
        assert response.status_code == 400
        data = response.json()
        assert "Invalid decision" in data["detail"]
    
    def test_invalid_issue_id(self):
        """Test feedback with invalid issue_id."""
        review_id = "test-review-7"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        response = client.post("/api/review/feedback", json={
            "review_id": review_id,
            "issue_id": "nonexistent-issue",
            "decision": "accepted",
            "team_id": "test-team"
        })
        
        assert response.status_code == 404
        data = response.json()
        assert "Issue not found" in data["detail"]
    
    def test_hindsight_retain_failure(self):
        """Test feedback when Hindsight retain fails."""
        review_id = "test-review-8"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={
                "summary": "Review",
                "issues": [
                    {
                        "id": "issue-1",
                        "title": "Issue",
                        "suggestion": "Fix it"
                    }
                ]
            },
            recalled_memories=[]
        )
        
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": False,
                "message": "Hindsight error"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "issue_id": "issue-1",
                "decision": "accepted",
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["retained"] is False
            assert "Failed to retain" in data["message"]
    
    def test_short_feedback_not_retained(self):
        """Test that very short feedback is not retained."""
        review_id = "test-review-9"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "decision": "rejected",
                "feedback": "no",  # Too short
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["retained"] is False
            
            # Verify retain was NOT called
            service.retain.assert_not_called()
    
    def test_metadata_includes_required_fields(self):
        """Test that retained memory includes required metadata."""
        review_id = "test-review-10"
        review_store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework="FastAPI",
            team_id="test-team",
            review_result={
                "summary": "Review",
                "issues": [
                    {
                        "id": "issue-1",
                        "title": "Issue",
                        "suggestion": "Fix it"
                    }
                ]
            },
            recalled_memories=[]
        )
        
        with patch('main.HindsightService') as mock_hindsight:
            service = MagicMock()
            service.retain = Mock(return_value={
                "success": True,
                "message": "Retained successfully"
            })
            mock_hindsight.return_value = service
            
            response = client.post("/api/review/feedback", json={
                "review_id": review_id,
                "issue_id": "issue-1",
                "decision": "accepted",
                "team_id": "test-team"
            })
            
            assert response.status_code == 200
            
            # Verify metadata
            call_args = service.retain.call_args
            metadata = call_args[1]["metadata"]
            assert metadata["source"] == "code_review_feedback"
            assert metadata["review_id"] == review_id
            assert metadata["issue_id"] == "issue-1"
            assert metadata["decision"] == "accepted"
            assert metadata["language"] == "Python"
            assert metadata["framework"] == "FastAPI"
            assert metadata["team_id"] == "test-team"
