"""
Pydantic models for ReviewMind API.

Defines request and response models for the code review endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class ReviewRequest(BaseModel):
    """
    Request model for code review.
    
    Attributes:
        code: The source code to review
        language: Programming language of the code
        framework: Optional framework name (e.g., React, Django)
        team_id: Optional team identifier for context
    """
    code: str = Field(..., description="The source code to review")
    language: str = Field(..., description="Programming language of the code")
    framework: Optional[str] = Field(None, description="Optional framework name")
    team_id: Optional[str] = Field(None, description="Optional team identifier")


class ReviewFeedback(BaseModel):
    """
    Feedback model for review decisions.
    
    Attributes:
        review_id: Unique identifier for the review
        issue_id: Optional identifier for the specific issue
        decision: Decision on the code (accepted/rejected/not_relevant)
        feedback: Optional feedback text explaining the decision
        team_id: Optional team identifier
    """
    review_id: str = Field(..., description="Unique identifier for the review")
    issue_id: Optional[str] = Field(None, description="Optional issue identifier")
    decision: str = Field(..., description="Decision: accepted, rejected, or not_relevant")
    feedback: Optional[str] = Field(None, description="Optional feedback text")
    team_id: Optional[str] = Field(None, description="Optional team identifier")


class ReviewResponse(BaseModel):
    """
    Response model for code review results.
    
    Attributes:
        summary: Overall summary of the review
        issues: List of identified issues
        team_conventions_used: List of team conventions applied
        memory_context: Context retrieved from memory
    """
    summary: str = Field(..., description="Overall summary of the review")
    issues: List[dict] = Field(default_factory=list, description="List of identified issues")
    team_conventions_used: List[str] = Field(
        default_factory=list, 
        description="List of team conventions applied"
    )
    memory_context: List[dict] = Field(
        default_factory=list, 
        description="Context retrieved from memory"
    )
