"""
Unit tests for Hindsight Service.

Tests the HindsightService class with mocked Hindsight client calls
to ensure proper integration without requiring a live Hindsight server.
"""

import pytest
from unittest.mock import Mock, MagicMock, patch, AsyncMock
from services.hindsight_service import HindsightService


class MockRecallResult:
    """Mock RecallResult object from Hindsight SDK."""
    def __init__(self, text: str, fact_type: str = "world", score: float = 0.9):
        self.text = text
        self.type = fact_type
        self.score = score


class MockRecallResponse:
    """Mock RecallResponse object from Hindsight SDK."""
    def __init__(self, results: list):
        self.results = results


@pytest.fixture
def mock_hindsight_client():
    """Fixture that provides a mocked Hindsight client."""
    with patch('services.hindsight_service.Hindsight') as mock_hindsight:
        mock_client = MagicMock()
        mock_hindsight.return_value = mock_client
        yield mock_client


@pytest.fixture
def hindsight_service(mock_hindsight_client):
    """Fixture that provides a HindsightService instance with mocked client."""
    with patch('services.hindsight_service.settings') as mock_settings:
        mock_settings.HINDSIGHT_BASE_URL = 'http://localhost:8888'
        mock_settings.HINDSIGHT_API_KEY = 'test-api-key'
        mock_settings.TEAM_ID = 'test-team'
        
        service = HindsightService()
        service.client = mock_hindsight_client
        return service


class TestConfiguration:
    """Tests for HindsightService configuration and initialization."""
    
    def test_initialization_with_valid_config(self):
        """Test that service initializes correctly with valid configuration."""
        with patch('services.hindsight_service.settings') as mock_settings:
            mock_settings.HINDSIGHT_BASE_URL = 'http://localhost:8888'
            mock_settings.HINDSIGHT_API_KEY = 'test-api-key'
            mock_settings.TEAM_ID = 'test-team'
            
            with patch('services.hindsight_service.Hindsight') as mock_hindsight:
                mock_client = MagicMock()
                mock_hindsight.return_value = mock_client
                
                service = HindsightService()
                
                assert service.base_url == 'http://localhost:8888'
                assert service.api_key == 'test-api-key'
                assert service.team_id == 'test-team'
                assert service.client == mock_client
                mock_hindsight.assert_called_once()
    
    def test_initialization_without_hindsight_client(self):
        """Test that RuntimeError is raised when hindsight-client is not installed."""
        with patch('services.hindsight_service.Hindsight', None):
            with pytest.raises(RuntimeError) as exc_info:
                HindsightService()
            
            assert "hindsight-client is not installed" in str(exc_info.value)


class TestRecall:
    """Tests for the recall method."""
    
    @pytest.mark.asyncio
    async def test_successful_recall(self, hindsight_service, mock_hindsight_client):
        """Test successful recall of memories from Hindsight."""
        # Setup mock response
        mock_results = [
            MockRecallResult("Team prefers structured logging", "observation", 0.95),
            MockRecallResult("Use parameterized queries", "world", 0.88)
        ]
        mock_response = MockRecallResponse(mock_results)
        mock_hindsight_client.arecall = AsyncMock(return_value=mock_response)
        
        # Call recall
        memories = await hindsight_service.recall("database queries")
        
        # Verify results
        assert len(memories) == 2
        assert memories[0]["text"] == "Team prefers structured logging"
        assert memories[0]["type"] == "observation"
        assert memories[1]["text"] == "Use parameterized queries"
        assert memories[1]["type"] == "world"
        
        # Verify SDK was called correctly
        mock_hindsight_client.arecall.assert_called_once_with(
            bank_id="test-team",
            query="database queries",
            budget="mid",
            max_tokens=4096
        )
    
    @pytest.mark.asyncio
    async def test_recall_with_custom_team_id(self, hindsight_service, mock_hindsight_client):
        """Test recall with a custom team_id parameter."""
        mock_results = [MockRecallResult("Custom team convention", "observation", 0.9)]
        mock_response = MockRecallResponse(mock_results)
        mock_hindsight_client.arecall = AsyncMock(return_value=mock_response)
        
        memories = await hindsight_service.recall("query", team_id="custom-team")
        
        mock_hindsight_client.arecall.assert_called_once_with(
            bank_id="custom-team",
            query="query",
            budget="mid",
            max_tokens=4096
        )
    
    @pytest.mark.asyncio
    async def test_recall_returns_empty_on_no_results(self, hindsight_service, mock_hindsight_client):
        """Test that recall returns empty list when no memories are found."""
        mock_response = MockRecallResponse([])
        mock_hindsight_client.arecall = AsyncMock(return_value=mock_response)
        
        memories = await hindsight_service.recall("nonexistent query")
        
        assert memories == []
    
    @pytest.mark.asyncio
    async def test_recall_handles_client_not_initialized(self):
        """Test that recall returns empty list when client is not initialized."""
        with patch.dict('os.environ', {
            'HINDSIGHT_BASE_URL': 'http://localhost:8888',
            'TEAM_ID': 'test-team'
        }):
            with patch('services.hindsight_service.Hindsight') as mock_hindsight:
                mock_hindsight.side_effect = Exception("Connection error")
                
                service = HindsightService()
                memories = await service.recall("query")
                
                assert memories == []
    
    @pytest.mark.asyncio
    async def test_recall_handles_api_error(self, hindsight_service, mock_hindsight_client):
        """Test that recall returns empty list on API error."""
        mock_hindsight_client.arecall = AsyncMock(side_effect=Exception("API error"))
        
        memories = await hindsight_service.recall("query")
        
        assert memories == []
    
    @pytest.mark.asyncio
    async def test_recall_handles_missing_team_id(self, hindsight_service):
        """Test that recall returns empty list when team_id is missing."""
        hindsight_service.team_id = ""
        
        memories = await hindsight_service.recall("query")
        
        assert memories == []


class TestRetain:
    """Tests for the retain method."""
    
    def test_successful_retain(self, hindsight_service, mock_hindsight_client):
        """Test successful retain of content in Hindsight."""
        result = hindsight_service.retain(
            content="Team rejected this suggestion",
            team_id="test-team",
            context="code review feedback"
        )
        
        assert result["success"] is True
        assert result["message"] == "Content retained successfully"
        
        # Verify SDK was called correctly
        mock_hindsight_client.retain.assert_called_once_with(
            bank_id="test-team",
            content="Team rejected this suggestion",
            context="code review feedback",
            metadata={},
            retain_async=False
        )
    
    def test_retain_with_metadata(self, hindsight_service, mock_hindsight_client):
        """Test retain with custom metadata."""
        metadata = {"source": "code_review", "language": "python"}
        
        result = hindsight_service.retain(
            content="Use type hints",
            team_id="test-team",
            metadata=metadata
        )
        
        assert result["success"] is True
        mock_hindsight_client.retain.assert_called_once_with(
            bank_id="test-team",
            content="Use type hints",
            context=None,
            metadata=metadata,
            retain_async=False
        )
    
    def test_retain_handles_client_not_initialized(self):
        """Test that retain returns failure when client is not initialized."""
        with patch.dict('os.environ', {
            'HINDSIGHT_BASE_URL': 'http://localhost:8888',
            'TEAM_ID': 'test-team'
        }):
            with patch('services.hindsight_service.Hindsight') as mock_hindsight:
                mock_hindsight.side_effect = Exception("Connection error")
                
                service = HindsightService()
                result = service.retain("content")
                
                assert result["success"] is False
                assert "not initialized" in result["message"]
    
    def test_retain_handles_missing_team_id(self, hindsight_service):
        """Test that retain returns failure when team_id is missing."""
        hindsight_service.team_id = ""
        
        result = hindsight_service.retain("content")
        
        assert result["success"] is False
        assert "No bank_id" in result["message"]
    
    def test_retain_handles_missing_content(self, hindsight_service):
        """Test that retain returns failure when content is missing."""
        result = hindsight_service.retain(content="")
        
        assert result["success"] is False
        # The service checks bank_id first, so we need to ensure team_id is set
        # but content is empty
        hindsight_service.team_id = "test-team"
        result = hindsight_service.retain(content="")
        assert result["success"] is False
        assert "No content" in result["message"]
    
    def test_retain_handles_api_error(self, hindsight_service, mock_hindsight_client):
        """Test that retain returns failure on API error."""
        # Ensure team_id is set so we can test the API error
        hindsight_service.team_id = "test-team"
        mock_hindsight_client.retain.side_effect = Exception("API error")
        
        result = hindsight_service.retain("content")
        
        assert result["success"] is False
        assert "Failed to retain" in result["message"]
