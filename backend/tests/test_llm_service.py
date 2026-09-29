"""
Unit tests for LLM Service.

Tests the LLMService class with mocked Groq client calls
to ensure proper integration without requiring a live Groq API.
"""

import pytest
from unittest.mock import Mock, MagicMock, patch
from services.llm_service import LLMService


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
def mock_groq_client():
    """Fixture that provides a mocked Groq client."""
    with patch('services.llm_service.Groq') as mock_groq:
        mock_client = MagicMock()
        mock_groq.return_value = mock_client
        yield mock_client


@pytest.fixture
def llm_service(mock_groq_client):
    """Fixture that provides an LLMService instance with mocked client."""
    with patch('services.llm_service.settings') as mock_settings:
        mock_settings.GROQ_API_KEY = 'test-api-key'
        mock_settings.GROQ_MODEL = 'llama-3.3-70b-versatile'
        
        service = LLMService()
        service.client = mock_groq_client
        return service


class TestConfiguration:
    """Tests for LLMService configuration and initialization."""
    
    def test_initialization_with_valid_config(self):
        """Test that service initializes correctly with valid configuration."""
        with patch('services.llm_service.settings') as mock_settings:
            mock_settings.GROQ_API_KEY = 'test-api-key'
            mock_settings.GROQ_MODEL = 'llama-3.3-70b-versatile'
            
            with patch('services.llm_service.Groq') as mock_groq:
                mock_client = MagicMock()
                mock_groq.return_value = mock_client
                
                service = LLMService()
                
                assert service.api_key == 'test-api-key'
                assert service.model == 'llama-3.3-70b-versatile'
                assert service.client == mock_client
                mock_groq.assert_called_once()
    
    def test_initialization_without_groq(self):
        """Test that RuntimeError is raised when groq is not installed."""
        with patch('services.llm_service.Groq', None):
            with pytest.raises(RuntimeError) as exc_info:
                LLMService()
            
            assert "groq package is not installed" in str(exc_info.value)


class TestReviewCode:
    """Tests for the review_code method."""
    
    @pytest.mark.asyncio
    async def test_review_code_with_memories(self, llm_service, mock_groq_client):
        """Test successful code review with team memories."""
        # Mock Groq response
        mock_response = MockChatCompletion('{"summary": "Good code", "issues": [], "team_conventions_used": [], "memory_context": []}')
        mock_groq_client.chat.completions.create.return_value = mock_response
        
        memory_context = [
            {"text": "Team prefers structured logging", "type": "observation"}
        ]
        
        review = await llm_service.review_code(
            code="print('hello')",
            language="Python",
            framework=None,
            memory_context=memory_context
        )
        
        assert review["summary"] == "Good code"
        assert review["issues"] == []
        assert review["memory_context"] == ["Team prefers structured logging"]
        
        # Verify Groq was called correctly
        mock_groq_client.chat.completions.create.assert_called_once()
        call_args = mock_groq_client.chat.completions.create.call_args
        assert call_args[1]["model"] == "llama-3.3-70b-versatile"
        assert call_args[1]["temperature"] == 0.3
        assert call_args[1]["response_format"] == {"type": "json_object"}
    
    @pytest.mark.asyncio
    async def test_review_code_without_memories(self, llm_service, mock_groq_client):
        """Test code review with no team memories."""
        mock_response = MockChatCompletion('{"summary": "No issues found", "issues": [], "team_conventions_used": [], "memory_context": []}')
        mock_groq_client.chat.completions.create.return_value = mock_response
        
        review = await llm_service.review_code(
            code="print('hello')",
            language="Python"
        )
        
        assert review["summary"] == "No issues found"
        assert review["memory_context"] == []
    
    @pytest.mark.asyncio
    async def test_review_code_with_issues(self, llm_service, mock_groq_client):
        """Test code review that identifies issues."""
        mock_response = MockChatCompletion('''
        {
            "summary": "Code has security issues",
            "issues": [
                {
                    "id": "issue-1",
                    "severity": "critical",
                    "title": "SQL Injection",
                    "description": "User input not sanitized",
                    "suggestion": "Use parameterized queries",
                    "memory_used": "Database queries should use parameterized queries"
                }
            ],
            "team_conventions_used": ["Database queries should use parameterized queries"],
            "memory_context": ["Database queries should use parameterized queries"]
        }
        ''')
        mock_groq_client.chat.completions.create.return_value = mock_response
        
        memory_context = [
            {"text": "Database queries should use parameterized queries", "type": "world"}
        ]
        
        review = await llm_service.review_code(
            code="query = 'SELECT * FROM users WHERE id=' + user_input",
            language="Python",
            memory_context=memory_context
        )
        
        assert len(review["issues"]) == 1
        assert review["issues"][0]["severity"] == "critical"
        assert review["issues"][0]["memory_used"] == "Database queries should use parameterized queries"
    
    @pytest.mark.asyncio
    async def test_review_code_validates_memory_used(self, llm_service, mock_groq_client):
        """Test that memory_used is validated against actual memories."""
        # LLM claims to use a memory that wasn't provided
        mock_response = MockChatCompletion('''
        {
            "summary": "Code review",
            "issues": [
                {
                    "id": "issue-1",
                    "severity": "high",
                    "title": "Issue",
                    "description": "Description",
                    "suggestion": "Fix it",
                    "memory_used": "Fake memory not in context"
                }
            ],
            "team_conventions_used": [],
            "memory_context": []
        }
        ''')
        mock_groq_client.chat.completions.create.return_value = mock_response
        
        memory_context = [
            {"text": "Real memory", "type": "observation"}
        ]
        
        review = await llm_service.review_code(
            code="code",
            language="Python",
            memory_context=memory_context
        )
        
        # memory_used should be set to null since it wasn't in actual memories
        assert review["issues"][0]["memory_used"] is None
    
    @pytest.mark.asyncio
    async def test_review_code_handles_client_not_initialized(self):
        """Test that review_code raises error when client is not initialized."""
        with patch('services.llm_service.settings') as mock_settings:
            mock_settings.GROQ_API_KEY = 'test-api-key'
            mock_settings.GROQ_MODEL = 'llama-3.3-70b-versatile'
            
            with patch('services.llm_service.Groq') as mock_groq:
                mock_groq.side_effect = Exception("Connection error")
                
                service = LLMService()
                
                with pytest.raises(RuntimeError) as exc_info:
                    await service.review_code("code", "Python")
                
                assert "Groq client not initialized" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_review_code_handles_missing_model(self, llm_service):
        """Test that review_code raises error when model is not configured."""
        llm_service.model = ""
        
        with pytest.raises(RuntimeError) as exc_info:
            await llm_service.review_code("code", "Python")
        
        assert "GROQ_MODEL not configured" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_review_code_handles_invalid_json(self, llm_service, mock_groq_client):
        """Test that review_code handles invalid JSON response."""
        mock_response = MockChatCompletion('invalid json')
        mock_groq_client.chat.completions.create.return_value = mock_response
        
        with pytest.raises(RuntimeError) as exc_info:
            await llm_service.review_code("code", "Python")
        
        assert "Invalid JSON response from LLM" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_review_code_handles_api_error(self, llm_service, mock_groq_client):
        """Test that review_code handles API errors."""
        mock_groq_client.chat.completions.create.side_effect = Exception("API error")
        
        with pytest.raises(RuntimeError) as exc_info:
            await llm_service.review_code("code", "Python")
        
        assert "Code review failed" in str(exc_info.value)
