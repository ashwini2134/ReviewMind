# ReviewMind Backend

Memory-Driven Code Review Agent for HackWithHyderabad 3.0.

## Overview

ReviewMind is a code review agent that uses memory to provide context-aware reviews. It integrates with Hindsight (a memory service) to store and retrieve team-specific coding conventions and review decisions.

## Architecture

The backend is built with FastAPI and consists of:

- **main.py**: FastAPI application with health check and review endpoints
- **config.py**: Environment variable configuration
- **models.py**: Pydantic models for requests/responses
- **services/hindsight_service.py**: Hindsight memory integration
- **services/llm_service.py**: Groq LLM service for code review

## Hindsight Integration

### What Hindsight Does in ReviewMind

Hindsight serves as the persistent memory system for ReviewMind. It stores and retrieves team-specific coding conventions, review decisions, and learned patterns. This enables the code review agent to:

- Recall relevant team conventions when reviewing code
- Learn from past review decisions (accepted/rejected feedback)
- Build a knowledge base specific to each team's preferences
- Provide contextually relevant suggestions based on historical patterns

### Complete Review Flow with Learning Loop

```
Developer submits code
        ↓
Hindsight RECALL
        ↓
Retrieve relevant team coding conventions
        ↓
Groq LLM reviews code using:
    - submitted code
    - language/framework
    - recalled team memories
        ↓
Review result shown to developer
        ↓
Developer gives feedback:
    accepted / rejected / not relevant
        ↓
Hindsight RETAIN (Learning Loop)
        ↓
Store meaningful team learning
        ↓
Future reviews RECALL that knowledge
```

**This is how ReviewMind learns team-specific coding conventions.** Each feedback cycle strengthens the team's knowledge base, making future reviews more accurate and contextually relevant.

### How RECALL Works

The `recall` method retrieves relevant memories from Hindsight based on a query:

```python
from services.hindsight_service import HindsightService

service = HindsightService()
memories = await service.recall(
    query="database query best practices",
    team_id="team-123"
)
```

**Parameters:**
- `query` (str): Search query to find relevant memories
- `team_id` (str, optional): Team identifier (uses default from env if not provided)

**Returns:**
- List of memory objects, each containing:
  - `text`: The memory content
  - `type`: Fact type (e.g., "world", "observation")
  - `score`: Relevance score

**Example memories:**
- "Team prefers structured logging instead of print statements."
- "Database queries should use parameterized queries."
- "React components should avoid unnecessary useEffect."

### How RETAIN Works

The `retain` method stores new memories in Hindsight:

```python
from services.hindsight_service import HindsightService

service = HindsightService()
result = await service.retain(
    content="Team rejected this suggestion because it does not apply to our codebase",
    team_id="team-123",
    context="code review feedback",
    metadata={"source": "developer_feedback", "language": "python"}
)
```

**Parameters:**
- `content` (str): The memory content to store
- `team_id` (str, optional): Team identifier (uses default from env if not provided)
- `context` (str, optional): Context description for the memory
- `metadata` (dict, optional): Additional metadata

**Returns:**
- Dict with status:
  - `success` (bool): Whether the operation succeeded
  - `message` (str): Status message

### Memory Design Principles

ReviewMind stores meaningful decisions, not every random review output:

**Useful memories to store:**
- Team coding conventions and preferences
- Accepted/rejected review decisions with rationale
- Framework-specific best practices
- Language-specific patterns
- Architectural decisions

**Example memories:**
- "Team prefers structured logging instead of print statements."
- "Database queries should use parameterized queries."
- "React components should avoid unnecessary useEffect."
- "API errors must return consistent JSON error structures."
- "Team rejected this suggestion because it does not apply to our codebase."

### Required Environment Variables

Create a `.env` file in the backend directory with:

```env
HINDSIGHT_BASE_URL=http://localhost:8888
HINDSIGHT_API_KEY=your-hindsight-api-key
TEAM_ID=your-team-id
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
```

**Variables:**
- `HINDSIGHT_BASE_URL`: URL of your Hindsight server
- `HINDSIGHT_API_KEY`: API key for Hindsight authentication
- `TEAM_ID`: Unique identifier for your team (used as Hindsight bank_id)
- `GROQ_API_KEY`: API key for Groq LLM service
- `GROQ_MODEL`: Groq model to use for code review

See `.env.example` for a template.

### Hindsight SDK Integration

ReviewMind uses the official Hindsight Python SDK (`hindsight-client`) as documented at:
https://hindsight.vectorize.io/sdks/python

**SDK Methods Used:**

1. **Hindsight Client Initialization:**
   ```python
   from hindsight_client import Hindsight
   client = Hindsight(
       base_url="http://localhost:8888",
       api_key="your-api-key",
       timeout=30.0
   )
   ```

2. **Recall (Search):**
   ```python
   results = client.recall(
       bank_id="team-bank",
       query="search query",
       budget="mid",
       max_tokens=4096
   )
   ```

3. **Retain (Store):**
   ```python
   client.retain(
       bank_id="team-bank",
       content="memory content",
       context="optional context",
       metadata={},
       retain_async=False
   )
   ```

This matches the official Hindsight SDK documentation exactly.

## Groq LLM Integration

ReviewMind uses the official Groq Python SDK (`groq`) for code review as documented at:
https://console.groq.com/docs/libraries

### What Groq Does in ReviewMind

Groq provides fast language model inference for code review. It:
- Analyzes submitted code for issues
- Applies team-specific conventions from Hindsight memory
- Returns structured JSON with issues, severity, and suggestions
- Only references memories that were actually provided

### Groq SDK Integration

**SDK Methods Used:**

1. **Groq Client Initialization:**
   ```python
   from groq import Groq
   client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
   ```

2. **Chat Completions for Code Review:**
   ```python
   chat_completion = client.chat.completions.create(
       messages=[
           {"role": "system", "content": "You are a code review assistant..."},
           {"role": "user", "content": "CODE: ...\nTEAM MEMORY: ..."}
       ],
       model="llama-3.3-70b-versatile",
       temperature=0.3,
       response_format={"type": "json_object"}
   )
   ```

This matches the official Groq SDK documentation exactly.

### Review Response Structure

The LLM returns a structured JSON response:

```json
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
}
```

**Important:** The model validates that `memory_used` only references memories that were actually provided in the TEAM MEMORY section.

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

## Running the Application

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

Health check endpoint: `http://localhost:8000/health`

## Running Tests

Run all unit tests:

```bash
pytest tests/ -v
```

Or run specific test files:

```bash
pytest tests/test_hindsight_service.py -v
pytest tests/test_llm_service.py -v
pytest tests/test_review_pipeline.py -v
```

The tests use mocked Hindsight and Groq client calls, so they don't require live services.

**Test coverage:**
- Hindsight service: Configuration, recall, retain, error handling
- LLM service: Configuration, code review, memory validation, error handling
- Review pipeline: Complete flow, Hindsight failure, LLM failure, structured response

## API Endpoints

### Health Check

```
GET /health
```

Returns:
```json
{
  "status": "ok",
  "service": "ReviewMind API"
}
```

### Code Review

```
POST /api/review
```

**Request:**
```json
{
  "code": "print('hello world')",
  "language": "Python",
  "framework": "FastAPI",
  "team_id": "reviewmind-demo"
}
```

**Response:**
```json
{
  "review_id": "550e8400-e29b-41d4-a716-446655440000",
  "review": {
    "summary": "Brief overall assessment of the code",
    "issues": [
      {
        "id": "issue-1",
        "severity": "high",
        "title": "Short descriptive title",
        "description": "Detailed explanation of the issue",
        "suggestion": "Specific actionable suggestion",
        "memory_used": "Team prefers structured logging instead of print statements"
      }
    ],
    "team_conventions_used": ["Team prefers structured logging instead of print statements"],
    "memory_context": ["Team prefers structured logging instead of print statements", "Use parameterized queries"]
  },
  "recalled_memories": [
    {
      "text": "Team prefers structured logging instead of print statements",
      "type": "observation",
      "score": 0.95
    }
  ],
  "memory_count": 1,
  "team_id": "reviewmind-demo"
}
```

**Pipeline:**
1. Validate request
2. Build recall query from language, framework, and code
3. Call HindsightService.recall() to get team memories
4. Pass recalled memories + code to LLMService
5. Return review with review_id, review, memories, and metadata

### Feedback (Learning Loop)

```
POST /api/review/feedback
```

**Request:**
```json
{
  "review_id": "550e8400-e29b-41d4-a716-446655440000",
  "issue_id": "issue-1",
  "decision": "accepted",
  "feedback": "Optional developer explanation",
  "team_id": "reviewmind-demo"
}
```

**Response (retained):**
```json
{
  "success": true,
  "retained": true,
  "message": "Team learning retained in Hindsight",
  "memory": "Team convention: Avoid print statements. Use structured logging instead",
  "decision": "accepted"
}
```

**Response (not retained):**
```json
{
  "success": true,
  "retained": false,
  "message": "No meaningful team learning to retain"
}
```

**Learning Logic:**
- **accepted**: Retains the issue as a team convention
- **rejected**: Retains why the suggestion was rejected (only if meaningful feedback provided)
- **not_relevant**: Retains contextual feedback (only if meaningful feedback provided)

**Metadata included in retained memories:**
- source: "code_review_feedback"
- review_id
- issue_id
- decision
- language
- framework
- team_id

## Development

### Project Structure

```
backend/
├── main.py                 # FastAPI application
├── config.py               # Configuration management
├── models.py               # Pydantic models
├── review_store.py         # In-memory review store (MVP)
├── requirements.txt       # Python dependencies
├── .env.example           # Environment variable template
├── services/
│   ├── __init__.py
│   ├── hindsight_service.py  # Hindsight memory integration
│   └── llm_service.py        # Groq LLM service for code review
└── tests/
    ├── __init__.py
    ├── test_hindsight_service.py  # Hindsight service tests
    ├── test_llm_service.py        # LLM service tests
    ├── test_review_pipeline.py    # Review pipeline tests
    ├── test_review_store.py       # Review store tests
    └── test_feedback_endpoint.py  # Feedback endpoint tests
```

## Error Handling

The Hindsight service implements graceful error handling:

- **Connection failures**: Returns empty memory list on recall, failure status on retain
- **Missing configuration**: Logs warnings, returns appropriate empty/failure responses
- **API errors**: Catches exceptions, logs errors without exposing API keys
- **Never crashes**: The API continues to function even if memory operations fail

This ensures ReviewMind remains operational even if Hindsight is temporarily unavailable.

## License

HackWithHyderabad 3.0 Project
