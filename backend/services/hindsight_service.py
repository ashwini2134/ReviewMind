"""
Hindsight Service Module.

This module provides the integration with Hindsight,
a memory service for storing and retrieving context using the official
Hindsight Python SDK (hindsight-client).

The service uses team_id as the bank_id in Hindsight to maintain
team-specific memory banks for code review context.
"""

import logging
from typing import Optional, List, Dict, Any
from config import settings

try:
    from hindsight_client import Hindsight
except ImportError:
    Hindsight = None

# Configure logging
logger = logging.getLogger(__name__)


class HindsightService:
    """
    Service class for Hindsight memory operations.
    
    This class provides methods to recall (retrieve) and retain (store)
    context from the Hindsight memory service using the official SDK.
    
    Uses team_id as the bank_id to maintain team-specific memory banks.
    """
    
    def __init__(self):
        """
        Initialize the Hindsight service with configuration from environment variables.
        
        Raises:
            RuntimeError: If hindsight-client is not installed or configuration is missing
        """
        if Hindsight is None:
            raise RuntimeError(
                "hindsight-client is not installed. "
                "Install it with: pip install hindsight-client"
            )
        
        self.api_key = settings.HINDSIGHT_API_KEY
        self.base_url = settings.HINDSIGHT_BASE_URL
        self.team_id = settings.TEAM_ID
        
        # Validate configuration
        if not self.base_url:
            logger.warning("HINDSIGHT_BASE_URL not set in environment variables")
        
        if not self.team_id:
            logger.warning("TEAM_ID not set in environment variables")
        
        # Initialize Hindsight client
        # Using the official Python SDK from https://hindsight.vectorize.io/sdks/python
        try:
            self.client = Hindsight(
                base_url=self.base_url,
                api_key=self.api_key if self.api_key else None,
                timeout=30.0
            )
            logger.info("Hindsight client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Hindsight client: {e}")
            self.client = None
    
    async def recall(
        self,
        query: str,
        team_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Recall/retrieve relevant context from Hindsight memory.
        
        Uses the official Hindsight SDK's recall method to search for
        relevant memories in the team's memory bank.
        
        Args:
            query: The search query to find relevant context
            team_id: The team ID (used as bank_id). If None, uses self.team_id
        
        Returns:
            List of relevant context items from memory. Each item contains:
            - text: The memory text
            - type: The fact type (e.g., "world", "observation")
            - Additional metadata from Hindsight
        
        Returns an empty list if:
        - Hindsight client is not initialized
        - Configuration is missing
        - API call fails (error is logged)
        """
        bank_id = team_id or self.team_id
        
        if not self.client:
            logger.error("Hindsight client not initialized, cannot recall")
            return []
        
        if not bank_id:
            logger.error("No bank_id provided for recall operation")
            return []
        
        try:
            # Using official Hindsight SDK recall method (async version)
            # Reference: https://hindsight.vectorize.io/sdks/python
            results = await self.client.arecall(
                bank_id=bank_id,
                query=query,
                budget="mid",  # Balanced search quality
                max_tokens=4096
            )
            
            # Convert RecallResponse results to list of dicts
            memories = []
            if results and results.results:
                for result in results.results:
                    memories.append({
                        "text": result.text,
                        "type": result.type,
                        "score": getattr(result, "score", None)
                    })
            
            logger.info(f"Recalled {len(memories)} memories from bank '{bank_id}'")
            return memories
            
        except Exception as e:
            logger.error(f"Failed to recall from Hindsight: {e}")
            # Return empty list on failure to avoid crashing the API
            return []
    
    def retain(
        self,
        content: str,
        team_id: Optional[str] = None,
        context: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Retain/store context in Hindsight memory.
        
        Uses the official Hindsight SDK's retain method to store
        memories in the team's memory bank.
        
        Args:
            content: The content text to store in memory
            team_id: The team ID (used as bank_id). If None, uses self.team_id
            context: Optional context description for the memory
            metadata: Optional additional metadata for the memory
        
        Returns:
            Dict with status of the retain operation:
            - success: bool indicating if the operation succeeded
            - message: status message
        
        Returns failure status if:
        - Hindsight client is not initialized
        - Configuration is missing
        - API call fails (error is logged)
        """
        bank_id = team_id or self.team_id
        
        if not self.client:
            logger.error("Hindsight client not initialized, cannot retain")
            return {"success": False, "message": "Hindsight client not initialized"}
        
        if not bank_id:
            logger.error("No bank_id provided for retain operation")
            return {"success": False, "message": "No bank_id provided"}
        
        if not content:
            logger.error("No content provided for retain operation")
            return {"success": False, "message": "No content provided"}
        
        try:
            # Using official Hindsight SDK retain method
            # Reference: https://hindsight.vectorize.io/sdks/python
            self.client.retain(
                bank_id=bank_id,
                content=content,
                context=context,
                metadata=metadata or {},
                retain_async=False  # Synchronous processing for immediate feedback
            )
            
            logger.info(f"Successfully retained content in bank '{bank_id}'")
            return {"success": True, "message": "Content retained successfully"}
            
        except Exception as e:
            logger.error(f"Failed to retain in Hindsight: {e}")
            # Return failure status without crashing the API
            return {"success": False, "message": f"Failed to retain: {str(e)}"}
