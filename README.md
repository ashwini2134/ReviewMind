# ReviewMind 🧠

> **Your team's code reviews should remember.**

ReviewMind is a memory-driven AI code review agent that learns from developer feedback and applies your team's coding conventions to future reviews.

Unlike traditional AI code reviewers that treat every review as a fresh conversation, ReviewMind uses **Hindsight** to remember what your team has learned over time.

---

## 🚀 The Problem

Most AI code reviewers can identify common programming issues, but they don't truly remember how **your team** prefers to write code.

For example, a team may have a convention:

> "Avoid `print()` statements in production code."

A traditional AI reviewer may flag it once, but a future review does not necessarily carry that team-specific learning forward.

### ReviewMind changes this.

It creates a continuous learning loop:

```text
Developer submits code
        ↓
Hindsight RECALL
        ↓
Retrieve relevant team knowledge
        ↓
AI Code Review
        ↓
Developer Feedback
        ↓
Hindsight RETAIN
        ↓
Team knowledge improves
        ↓
Future reviews become more context-aware
```

---

## 🧠 How ReviewMind Works

ReviewMind combines three main components:

### 1. Hindsight Memory

Before reviewing code, ReviewMind recalls relevant team knowledge from Hindsight.

```text
"What coding conventions are relevant to this code?"
                ↓
        Hindsight RECALL
                ↓
Relevant team memories
```

### 2. AI Code Review

The recalled memories are provided to the AI reviewer along with the submitted code.

The reviewer can therefore consider both:

- The code itself
- What the team has learned previously

### 3. Continuous Learning

After a review, the developer can provide feedback:

- ✅ Accepted
- ❌ Rejected
- ⚪ Not Relevant

Meaningful feedback is retained in Hindsight.

The next review can then recall that knowledge.

---

## 🔄 The Learning Loop

```text
┌───────────────┐
│  Submit Code  │
└───────┬───────┘
        ↓
┌───────────────────┐
│ Hindsight RECALL  │
└────────┬──────────┘
         ↓
┌───────────────────┐
│   AI Code Review  │
└────────┬──────────┘
         ↓
┌────────────────────┐
│ Developer Feedback │
└─────────┬──────────┘
          ↓
┌───────────────────┐
│ Hindsight RETAIN  │
└────────┬──────────┘
         ↓
┌────────────────────┐
│ Better Future      │
│ Code Reviews       │
└────────────────────┘
```

---

## ✨ Example

### First Review

A developer submits:

```python
def archive_user(user):
    print("Archiving user:", user)
    return user
```

ReviewMind recalls the team's existing knowledge and identifies the `print()` usage based on the team's coding convention.

The developer accepts the feedback.

ReviewMind then stores this learning in Hindsight.

---

### Future Review

Later, a developer submits completely different code:

```python
def delete_user(user):
    print("Deleting user:", user)
    return user
```

This time, ReviewMind can recall the previously learned team convention.

```text
Hindsight Memory

"Team convention: Avoid print statements
in production code. Use structured logging."
```

The AI reviewer can use this memory while reviewing the new code.

### The important difference

The second review isn't just another isolated AI response.

**It is informed by what the team previously learned.**

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     Developer       │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │   ReviewMind UI     │
                    │     Next.js         │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ↓                         ↓
        ┌──────────────────┐       ┌─────────────────┐
        │ Hindsight Cloud  │       │      Groq       │
        │                  │       │                 │
        │ RECALL           │       │ AI Code Review  │
        │ RETAIN           │       │                 │
        └────────┬─────────┘       └────────┬────────┘
                 │                          │
                 └──────────┬───────────────┘
                            ↓
                    ┌─────────────────┐
                    │ Review + Memory │
                    └─────────────────┘
                            │
                            ↓
                    Developer Feedback
                            │
                            ↓
                    Hindsight RETAIN
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Python |
| API | FastAPI |
| AI Model | Groq |
| Memory | Hindsight |
| Testing | Pytest |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```text
ReviewMind/
│
├── backend/
│   ├── services/
│   │   ├── hindsight_service.py
│   │   └── llm_service.py
│   │
│   ├── tests/
│   │   ├── test_feedback_endpoint.py
│   │   ├── test_hindsight_service.py
│   │   ├── test_llm_service.py
│   │   ├── test_review_pipeline.py
│   │   └── test_review_store.py
│   │
│   ├── config.py
│   ├── main.py
│   ├── models.py
│   ├── review_store.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── learning/
│   │   │   ├── memory/
│   │   │   ├── review/
│   │   │   ├── settings/
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   └── lib/
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

# ⚙️ Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/ashwini2134/ReviewMind.git
cd ReviewMind
```

---

## 2. Backend Setup

Go to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create a `.env` file inside `backend/`.

```env
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b

TEAM_ID=reviewmind-demo
```

> ⚠️ Never commit your real API keys to GitHub.

---

## 4. Start the Backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

The API will run at:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/health
```

---

## 5. Frontend Setup

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

# 🔑 Hindsight Integration

Hindsight is the core of ReviewMind.

ReviewMind uses two important memory operations:

### RECALL

Before a review:

```python
memories = await hindsight.arecall(
    bank_id=team_id,
    query=query,
    budget="mid",
    max_tokens=4096
)
```

The retrieved memories provide team-specific context to the AI reviewer.

### RETAIN

After developer feedback:

```python
hindsight.retain(
    bank_id=team_id,
    content=content,
    context=context,
    metadata={},
    retain_async=False
)
```

This allows meaningful feedback to become part of the team's future context.

---

# 🎯 Why Memory Matters

ReviewMind is designed around the idea that **memory should be part of the workflow, not just a feature on the side.**

Without memory:

```text
Review → Forget → Review → Forget
```

With ReviewMind:

```text
Review
  ↓
Learn
  ↓
Remember
  ↓
Recall
  ↓
Improve
```

The goal is to make the AI reviewer progressively more aligned with the team's coding practices.

---

# 🧪 Testing

The backend includes automated tests covering:

- Review pipeline
- Hindsight service
- LLM service
- Feedback endpoint
- Review store

Run:

```bash
pytest
```

---

# 🔮 Future Improvements

Potential future development includes:

- GitHub pull request integration
- Repository-level memory
- Multiple team memory banks
- Authentication
- Persistent review history
- Automatic PR reviews
- More detailed memory analytics
- IDE integration
- Support for additional LLM providers

---

# 📌 Project Status

ReviewMind is currently an MVP demonstrating a memory-driven AI code review workflow using Hindsight.

The core workflow is:

```text
RECALL → REVIEW → FEEDBACK → RETAIN → IMPROVE
```

---

## 👤 Author

**Ashwini Ravarala**

GitHub:  
https://github.com/ashwini2134

---

## ⭐ If you find this project interesting

Feel free to explore the repository, try the workflow, and build on the idea of AI agents that learn from experience.

---

### Built with

**Next.js · FastAPI · Groq · Hindsight · TypeScript · Python**
