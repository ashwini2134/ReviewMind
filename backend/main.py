"""
ReviewMind API - Main Application

This is the main entry point for the ReviewMind backend service.
It provides a FastAPI application for code review functionality.
"""

import logging
import uuid
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from models import ReviewRequest, ReviewFeedback
from services.hindsight_service import HindsightService
from services.llm_service import LLMService
from review_store import review_store

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="ReviewMind API",
    description="Memory-Driven Code Review Agent for HackWithHyderabad 3.0",
    version="1.0.0"
)

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        dict: Status information including service name
    """
    return {
        "status": "ok",
        "service": "ReviewMind API"
    }


@app.post("/api/review")
async def review_code(request: ReviewRequest):
    """
    Perform code review with Hindsight memory context and Groq LLM.
    
    Pipeline:
    1. Validate request
    2. Build recall query from language, framework, and code
    3. Call HindsightService.recall() to get team memories
    4. Pass recalled memories + code to LLMService
    5. Return review with review_id, review, memories, and metadata
    
    Args:
        request: ReviewRequest with code, language, framework, and team_id
    
    Returns:
        dict: Review response with review_id, review, recalled_memories, memory_count, team_id
    """
    # Generate unique review ID
    review_id = str(uuid.uuid4())
    
    # Initialize services
    try:
        hindsight_service = HindsightService()
        llm_service = LLMService()
    except RuntimeError as e:
        logger.error(f"Failed to initialize services: {e}")
        raise HTTPException(status_code=500, detail=f"Service initialization failed: {str(e)}")
    
    # Build recall query from language, framework, and code context
    query_parts = [f"{request.language} code review"]
    if request.framework:
        query_parts.append(f"{request.framework} framework")
    query_parts.append("best practices conventions")
    recall_query = " ".join(query_parts)
    
    # Step 1: Recall team memories from Hindsight
    team_id = request.team_id or settings.TEAM_ID
    try:
        logger.info(f"Recalling memories for team_id: {team_id}")
        recalled_memories = await hindsight_service.recall(
            query=recall_query,
            team_id=team_id
        )
        logger.info(f"Recalled {len(recalled_memories)} memories")
    except Exception as e:
        logger.error(f"Hindsight recall failed: {e}")
        # Continue with empty memory list on failure
        recalled_memories = []
    
    # Step 2: Perform code review with Groq LLM
    try:
        logger.info(f"Performing code review with Groq for {request.language}")
        review = await llm_service.review_code(
            code=request.code,
            language=request.language,
            framework=request.framework,
            memory_context=recalled_memories
        )
        logger.info(f"Code review completed successfully")
    except RuntimeError as e:
        logger.error(f"LLM review failed: {e}")
        raise HTTPException(status_code=500, detail=f"Code review failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error during code review: {e}")
        raise HTTPException(status_code=500, detail=f"Code review failed: {str(e)}")
    
    # Save review in store for feedback and learning
    review_store.save_review(
        review_id=review_id,
        code=request.code,
        language=request.language,
        framework=request.framework,
        team_id=team_id,
        review_result=review,
        recalled_memories=recalled_memories
    )
    
    # Return response
    return {
        "review_id": review_id,
        "review": review,
        "recalled_memories": recalled_memories,
        "memory_count": len(recalled_memories),
        "team_id": team_id
    }


@app.post("/api/review/feedback")
async def submit_feedback(feedback: ReviewFeedback):
    """
    Submit feedback on a review to enable team learning.
    
    This endpoint implements the learning loop:
    - accepted: Retain the issue as a team convention
    - rejected: Retain why the suggestion was rejected (if feedback provided)
    - not_relevant: Retain contextual feedback (if feedback provided)
    
    Args:
        feedback: ReviewFeedback with review_id, issue_id, decision, feedback, team_id
    
    Returns:
        dict: Response indicating whether learning was retained
    """
    # Validate decision
    valid_decisions = ["accepted", "rejected", "not_relevant"]
    if feedback.decision not in valid_decisions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid decision. Must be one of: {', '.join(valid_decisions)}"
        )
    
    # Retrieve review from store
    review_data = review_store.get_review(feedback.review_id)
    if not review_data:
        raise HTTPException(
            status_code=404,
            detail=f"Review not found: {feedback.review_id}"
        )
    
    # Get the specific issue if issue_id provided
    issue = None
    if feedback.issue_id:
        issue = review_store.get_issue(feedback.review_id, feedback.issue_id)
        if not issue:
            raise HTTPException(
                status_code=404,
                detail=f"Issue not found: {feedback.issue_id}"
            )
    
    # Initialize Hindsight service for retention
    try:
        hindsight_service = HindsightService()
    except RuntimeError as e:
        logger.error(f"Failed to initialize Hindsight service: {e}")
        raise HTTPException(status_code=500, detail=f"Service initialization failed: {str(e)}")
    
    # Determine what to retain based on decision
    memory_content = None
    memory_context = None
    should_retain = False
    
    team_id = feedback.team_id or review_data["team_id"]
    language = review_data["language"]
    framework = review_data["framework"]
    
    if feedback.decision == "accepted":
        # Accepted: Create a team convention from the issue
        if issue:
            issue_title = issue.get("title", "")
            issue_suggestion = issue.get("suggestion", "")
            memory_content = f"Team convention: {issue_title}. {issue_suggestion}"
            memory_context = "Code review feedback - accepted"
            should_retain = True
        else:
            # No specific issue, but accepted overall
            if feedback.feedback:
                memory_content = f"Team convention: {feedback.feedback}"
                memory_context = "Code review feedback - accepted"
                should_retain = True
    
    elif feedback.decision == "rejected":
        # Rejected: Only retain if meaningful feedback provided
        if feedback.feedback and len(feedback.feedback.strip()) > 10:
            memory_content = f"Team rejected this suggestion because: {feedback.feedback}"
            memory_context = "Code review feedback - rejected"
            should_retain = True
    
    elif feedback.decision == "not_relevant":
        # Not relevant: Only retain if meaningful feedback provided
        if feedback.feedback and len(feedback.feedback.strip()) > 10:
            memory_content = f"Team context: {feedback.feedback}"
            memory_context = "Code review feedback - not relevant"
            should_retain = True
    
    # Retain in Hindsight if there's meaningful content
    if should_retain and memory_content:
        metadata = {
            "source": "code_review_feedback",
            "review_id": feedback.review_id,
            "issue_id": feedback.issue_id,
            "decision": feedback.decision,
            "language": language,
            "framework": framework or "none",
            "team_id": team_id
        }
        
        try:
            # Run synchronous retain in a thread to avoid blocking the event loop
            result = await asyncio.to_thread(
                hindsight_service.retain,
                content=memory_content,
                team_id=team_id,
                context=memory_context,
                metadata=metadata
            )
            
            if result.get("success"):
                logger.info(f"Successfully retained team learning for review {feedback.review_id}")
                return {
                    "success": True,
                    "retained": True,
                    "message": "Team learning retained in Hindsight",
                    "memory": memory_content,
                    "decision": feedback.decision
                }
            else:
                logger.warning(f"Hindsight retain failed: {result.get('message')}")
                return {
                    "success": True,
                    "retained": False,
                    "message": f"Failed to retain: {result.get('message')}"
                }
        except Exception as e:
            logger.error(f"Error retaining in Hindsight: {e}")
            return {
                "success": True,
                "retained": False,
                "message": f"Error retaining: {str(e)}"
            }
    else:
        # No meaningful content to retain
        return {
            "success": True,
            "retained": False,
            "message": "No meaningful team learning to retain"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
