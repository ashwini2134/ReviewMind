/**
 * API client for ReviewMind backend.
 * Handles communication with the FastAPI backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ReviewRequest {
  code: string;
  language: string;
  framework?: string;
  team_id?: string;
}

export interface Issue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  suggestion: string;
  memory_used: string | null;
}

export interface ReviewResponse {
  summary: string;
  issues: Issue[];
  team_conventions_used: string[];
  memory_context: string[];
}

export interface ReviewResult {
  review_id: string;
  review: ReviewResponse;
  recalled_memories: Array<{
    text: string;
    type: string;
    score?: number;
  }>;
  memory_count: number;
  team_id: string;
}

export interface FeedbackRequest {
  review_id: string;
  issue_id?: string;
  decision: 'accepted' | 'rejected' | 'not_relevant';
  feedback?: string;
  team_id?: string;
}

export interface FeedbackResponse {
  success: boolean;
  retained: boolean;
  message: string;
  memory?: string;
  decision: string;
}

/**
 * Submit code for review
 */
export async function submitReview(request: ReviewRequest): Promise<ReviewResult> {
  const response = await fetch(`${API_URL}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to submit review');
  }

  return response.json();
}

/**
 * Submit feedback on a review
 */
export async function submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  const response = await fetch(`${API_URL}/api/review/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to submit feedback');
  }

  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
