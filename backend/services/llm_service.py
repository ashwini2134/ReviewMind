"""
LLM Service Module.

This module provides the integration with Groq LLM service
for code review functionality using the official Groq Python SDK.
"""

import logging
import json
import uuid
from typing import Dict, Any, List, Optional
from config import settings

try:
    from groq import Groq
except ImportError:
    Groq = None

# Configure logging
logger = logging.getLogger(__name__)


class LLMService:
    """
    Service class for LLM-based code review using Groq.
    
    This class provides methods to perform code review using
    Groq's language models, with support for memory context integration.
    """
    
    def __init__(self):
        """
        Initialize the LLM service with configuration from environment variables.
        
        Raises:
            RuntimeError: If groq is not installed or configuration is missing
        """
        if Groq is None:
            raise RuntimeError(
                "groq package is not installed. "
                "Install it with: pip install groq"
            )
        
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        
        # Validate configuration
        if not self.api_key:
            logger.warning("GROQ_API_KEY not set in environment variables")
        
        if not self.model:
            logger.warning("GROQ_MODEL not set in environment variables")
        
        # Initialize Groq client
        # Using the official Groq Python SDK from https://console.groq.com/docs/libraries
        try:
            self.client = Groq(api_key=self.api_key)
            logger.info("Groq client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
            self.client = None
    
    async def review_code(
        self,
        code: str,
        language: str,
        framework: Optional[str] = None,
        memory_context: Optional[List[Dict[str, Any]]] = None,
        team_conventions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Perform code review using the Groq LLM service.
        
        Uses the official Groq SDK to perform code review with team memory context.
        
        Args:
            code: The source code to review
            language: Programming language of the code
            framework: Optional framework name
            memory_context: Optional context from Hindsight memory service
            team_conventions: Optional team-specific conventions to apply
        
        Returns:
            Review response with the following structure:
            {
                "summary": "string",
                "issues": [
                    {
                        "id": "string",
                        "severity": "critical|high|medium|low|info",
                        "title": "string",
                        "description": "string",
                        "suggestion": "string",
                        "memory_used": "string|null"
                    }
                ],
                "team_conventions_used": [],
                "memory_context": []
            }
        
        Raises:
            RuntimeError: If Groq client is not initialized or API call fails
        """
        if not self.client:
            raise RuntimeError("Groq client not initialized")
        
        if not self.model:
            raise RuntimeError("GROQ_MODEL not configured")
        
        # Build the prompt with clear separation of CODE and TEAM MEMORY
        system_prompt = """You are a code review assistant. Your task is to review the submitted code and provide practical, actionable feedback.

You will receive:
1. CODE: The developer's submitted code
2. TEAM MEMORY: Team-specific coding conventions and rules recalled from memory

IMPORTANT:
- Only reference a TEAM MEMORY item if it was actually provided to you
- Do NOT claim a memory was used if it was not in the TEAM MEMORY section
- Focus on practical issues: security, performance, maintainability, bugs
- Be specific and actionable in your suggestions
- Assign appropriate severity levels

Return your response as valid JSON with this exact structure:
{
  "summary": "Brief overall assessment of the code",
  "issues": [
    {
      "id": "unique-id",
      "severity": "critical|high|medium|low|info",
      "title": "Short descriptive title",
      "description": "Detailed explanation of the issue",
      "suggestion": "Specific actionable suggestion",
      "memory_used": "exact text from TEAM MEMORY if applicable, or null"
    }
  ],
  "team_conventions_used": ["list of team conventions that were applied"],
  "memory_context": ["list of all memories provided for context"]
}"""

        # Format memory context for the prompt
        memory_text = ""
        if memory_context:
            memory_text = "\nTEAM MEMORY:\n"
            for i, memory in enumerate(memory_context, 1):
                memory_text += f"{i}. {memory.get('text', '')}\n"
        else:
            memory_text = "\nTEAM MEMORY:\nNo team memories available for this review.\n"
        
        # Build the user prompt
        framework_info = f"Framework: {framework}\n" if framework else ""
        user_prompt = f"""LANGUAGE: {language}
{framework_info}

CODE:
{code}

{memory_text}

Please review this code and return your analysis as JSON."""

        try:
            # Call Groq API using the official SDK
            # Reference: https://console.groq.com/docs/text-chat
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ],
                model=self.model,
                temperature=0.3,  # Lower temperature for more consistent code review
                response_format={"type": "json_object"}  # Ensure JSON response
            )
            
            # Parse the response
            response_text = chat_completion.choices[0].message.content
            review_data = json.loads(response_text)
            
            # Ensure the response has the required structure
            if "issues" not in review_data:
                review_data["issues"] = []
            if "team_conventions_used" not in review_data:
                review_data["team_conventions_used"] = []
            if "memory_context" not in review_data:
                review_data["memory_context"] = []
            
            # Validate that memory_used only references actual memories
            if memory_context:
                memory_texts = {m.get("text", "") for m in memory_context}
                for issue in review_data.get("issues", []):
                    if issue.get("memory_used") and issue["memory_used"] not in memory_texts:
                        issue["memory_used"] = None
            
            # Add memory context to the response
            review_data["memory_context"] = [m.get("text", "") for m in memory_context] if memory_context else []
            
            logger.info(f"Code review completed successfully for {language}")
            return review_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Groq response as JSON: {e}")
            raise RuntimeError(f"Invalid JSON response from LLM: {e}")
        except Exception as e:
            logger.error(f"Failed to perform code review with Groq: {e}")
            raise RuntimeError(f"Code review failed: {e}")
