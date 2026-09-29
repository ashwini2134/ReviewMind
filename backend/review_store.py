"""
In-memory review store for MVP.

Stores review data by review_id to enable feedback and learning.
This is a lightweight in-memory store suitable for the MVP.
"""

from typing import Dict, Any, Optional
from datetime import datetime


class ReviewStore:
    """
    In-memory store for review data.
    
    Stores reviews by review_id to enable feedback and learning.
    Data is lost on server restart - suitable for MVP only.
    """
    
    def __init__(self):
        """Initialize the review store."""
        self._reviews: Dict[str, Dict[str, Any]] = {}
    
    def save_review(
        self,
        review_id: str,
        code: str,
        language: str,
        framework: Optional[str],
        team_id: str,
        review_result: Dict[str, Any],
        recalled_memories: list
    ) -> None:
        """
        Save a review in the store.
        
        Args:
            review_id: Unique identifier for the review
            code: The submitted code
            language: Programming language
            framework: Optional framework name
            team_id: Team identifier
            review_result: The review result from LLM
            recalled_memories: Memories recalled for this review
        """
        self._reviews[review_id] = {
            "review_id": review_id,
            "code": code,
            "language": language,
            "framework": framework,
            "team_id": team_id,
            "review_result": review_result,
            "recalled_memories": recalled_memories,
            "created_at": datetime.utcnow().isoformat()
        }
    
    def get_review(self, review_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a review by review_id.
        
        Args:
            review_id: Unique identifier for the review
        
        Returns:
            Review data if found, None otherwise
        """
        return self._reviews.get(review_id)
    
    def get_issue(self, review_id: str, issue_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a specific issue from a review.
        
        Args:
            review_id: Unique identifier for the review
            issue_id: Unique identifier for the issue
        
        Returns:
            Issue data if found, None otherwise
        """
        review = self.get_review(review_id)
        if not review:
            return None
        
        for issue in review.get("review_result", {}).get("issues", []):
            if issue.get("id") == issue_id:
                return issue
        
        return None
    
    def clear(self) -> None:
        """Clear all reviews from the store (useful for testing)."""
        self._reviews.clear()


# Global review store instance
review_store = ReviewStore()
