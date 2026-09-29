# ReviewMind Frontend

A Next.js frontend for ReviewMind - a code reviewer that learns your team's conventions.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running at `http://localhost:8000`

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

```bash
npm run build
npm start
```

## Features

- **Code Submission**: Submit code for review with language, framework, and team ID
- **Review Results**: View detailed review results with severity-coded issues
- **Team Memory**: See recalled team memories from Hindsight
- **Feedback Loop**: Accept, reject, or mark issues as not relevant to teach the system
- **Learning History**: Track session learning events

## Component Structure

```
src/
├── app/
│   └── page.tsx              # Main dashboard
├── components/
│   ├── CodeEditor.tsx        # Code input and controls
│   ├── ReviewResults.tsx     # Review display with feedback
│   ├── TeamMemory.tsx        # Recalled memories panel
│   └── LearningHistory.tsx   # Session learning tracking
└── lib/
    └── api.ts                # API client for backend
```

## API Integration

The frontend connects to the backend API:

- `POST /api/review` - Submit code for review
- `POST /api/review/feedback` - Submit feedback on review issues
- `GET /health` - Health check

## Design

Clean, professional developer tool interface with:
- Light background with blue accents
- Clear severity badges for issues
- Visible team memory panel showing Hindsight integration
- Responsive two-column layout
