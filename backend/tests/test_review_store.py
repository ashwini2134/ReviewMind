"""
Unit tests for Review Store.

Tests the in-memory review store used for MVP.
"""

import pytest
from review_store import ReviewStore


class TestReviewStore:
    """Tests for the ReviewStore class."""
    
    def test_save_and_get_review(self):
        """Test saving and retrieving a review."""
        store = ReviewStore()
        
        review_id = "test-review-1"
        store.save_review(
            review_id=review_id,
            code="print('hello')",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Good code", "issues": []},
            recalled_memories=[]
        )
        
        retrieved = store.get_review(review_id)
        assert retrieved is not None
        assert retrieved["review_id"] == review_id
        assert retrieved["code"] == "print('hello')"
        assert retrieved["language"] == "Python"
        assert retrieved["team_id"] == "test-team"
    
    def test_get_nonexistent_review(self):
        """Test retrieving a review that doesn't exist."""
        store = ReviewStore()
        
        retrieved = store.get_review("nonexistent")
        assert retrieved is None
    
    def test_get_issue(self):
        """Test retrieving a specific issue from a review."""
        store = ReviewStore()
        
        review_id = "test-review-2"
        issue_id = "issue-1"
        store.save_review(
            review_id=review_id,
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={
                "summary": "Review",
                "issues": [
                    {"id": "issue-1", "title": "Issue 1"},
                    {"id": "issue-2", "title": "Issue 2"}
                ]
            },
            recalled_memories=[]
        )
        
        issue = store.get_issue(review_id, issue_id)
        assert issue is not None
        assert issue["id"] == "issue-1"
        assert issue["title"] == "Issue 1"
    
    def test_get_nonexistent_issue(self):
        """Test retrieving an issue that doesn't exist."""
        store = ReviewStore()
        
        store.save_review(
            review_id="test-review-3",
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        issue = store.get_issue("test-review-3", "nonexistent-issue")
        assert issue is None
    
    def test_get_issue_from_nonexistent_review(self):
        """Test retrieving an issue from a review that doesn't exist."""
        store = ReviewStore()
        
        issue = store.get_issue("nonexistent-review", "issue-1")
        assert issue is None
    
    def test_clear_store(self):
        """Test clearing the review store."""
        store = ReviewStore()
        
        store.save_review(
            review_id="test-review-4",
            code="code",
            language="Python",
            framework=None,
            team_id="test-team",
            review_result={"summary": "Review", "issues": []},
            recalled_memories=[]
        )
        
        assert store.get_review("test-review-4") is not None
        
        store.clear()
        
        assert store.get_review("test-review-4") is None
    
    def test_multiple_reviews(self):
        """Test storing and retrieving multiple reviews."""
        store = ReviewStore()
        
        store.save_review(
            review_id="review-1",
            code="code1",
            language="Python",
            framework=None,
            team_id="team-1",
            review_result={"summary": "Review 1", "issues": []},
            recalled_memories=[]
        )
        
        store.save_review(
            review_id="review-2",
            code="code2",
            language="JavaScript",
            framework="React",
            team_id="team-2",
            review_result={"summary": "Review 2", "issues": []},
            recalled_memories=[]
        )
        
        review1 = store.get_review("review-1")
        review2 = store.get_review("review-2")
        
        assert review1["code"] == "code1"
        assert review1["language"] == "Python"
        assert review2["code"] == "code2"
        assert review2["language"] == "JavaScript"
        assert review2["framework"] == "React"
