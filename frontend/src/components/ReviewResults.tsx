'use client';

import { useState } from 'react';
import { Issue } from '@/lib/api';

interface ReviewResultsProps {
  summary: string;
  issues: Issue[];
  reviewId: string;
  teamId: string;
  onFeedback: (issueId: string, decision: 'accepted' | 'rejected' | 'not_relevant', feedback?: string) => void;
  feedbackStatus: Record<string, { decision: string; retained: boolean; message: string }>;
  retainingIssueId?: string;
}

const severityConfig = {
  critical: { color: '#EF4444', icon: '🔴', label: 'CRITICAL' },
  high: { color: '#F59E0B', icon: '🟠', label: 'HIGH' },
  medium: { color: '#EAB308', icon: '🟡', label: 'MEDIUM' },
  low: { color: '#3B82F6', icon: '🔵', label: 'LOW' },
  info: { color: '#6B6B63', icon: '⚪', label: 'INFO' },
};

export default function ReviewResults({
  summary,
  issues,
  reviewId,
  teamId,
  onFeedback,
  feedbackStatus,
  retainingIssueId,
}: ReviewResultsProps) {
  // Empty state before submission
  if (!summary && issues.length === 0) {
    return (
      <div className="review-results-empty">
        <div className="empty-icon">✦</div>
        <h3 className="empty-title">Ready to review your code</h3>
        <p className="empty-description">
          ReviewMind will combine AI analysis with your team's memory.
        </p>
        <div className="empty-flow">
          <span>RECALL</span>
          <span className="flow-arrow">→</span>
          <span>REVIEW</span>
          <span className="flow-arrow">→</span>
          <span>LEARN</span>
        </div>
      </div>
    );
  }

  return (
    <div className="review-results-content">
      {summary && (
        <div className="summary-box">
          <p className="summary-text">{summary}</p>
        </div>
      )}

      {issues.length > 0 && (
        <div className="issues-list">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              reviewId={reviewId}
              teamId={teamId}
              onFeedback={onFeedback}
              feedbackStatus={feedbackStatus[issue.id]}
              isRetaining={retainingIssueId === issue.id}
            />
          ))}
        </div>
      )}

      {issues.length === 0 && summary && (
        <div className="no-issues">
          <div className="no-issues-icon">✓</div>
          <span className="no-issues-text">No issues found</span>
        </div>
      )}

      <style jsx>{`
        .review-results-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 32px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          color: #DEDACF;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 600;
          color: #171717;
          margin-bottom: 8px;
        }

        .empty-description {
          font-size: 14px;
          color: #6B6B63;
          line-height: 1.6;
          max-width: 280px;
          margin-bottom: 24px;
        }

        .empty-flow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #6B6B63;
          font-weight: 500;
        }

        .flow-arrow {
          color: #DFFF00;
        }

        .review-results-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .summary-box {
          background: #F7F3EA;
          border: 1px solid #DEDACF;
          border-radius: 8px;
          padding: 12px 16px;
        }

        .summary-text {
          font-size: 14px;
          color: #6B6B63;
          line-height: 1.6;
          margin: 0;
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .no-issues {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 32px;
          background: #F7F3EA;
          border-radius: 8px;
        }

        .no-issues-icon {
          font-size: 20px;
          color: #22C55E;
        }

        .no-issues-text {
          font-size: 14px;
          font-weight: 500;
          color: #22C55E;
        }
      `}</style>
    </div>
  );
}

interface IssueCardProps {
  issue: Issue;
  reviewId: string;
  teamId: string;
  onFeedback: (issueId: string, decision: 'accepted' | 'rejected' | 'not_relevant', feedback?: string) => void;
  feedbackStatus?: { decision: string; retained: boolean; message: string };
  isRetaining?: boolean;
}

function IssueCard({ issue, reviewId, teamId, onFeedback, feedbackStatus, isRetaining }: IssueCardProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedback = (decision: 'accepted' | 'rejected' | 'not_relevant') => {
    onFeedback(issue.id, decision, decision === 'rejected' || decision === 'not_relevant' ? feedbackText : undefined);
    setShowFeedback(false);
    setFeedbackText('');
  };

  const config = severityConfig[issue.severity] || severityConfig.info;

  return (
    <div className="issue-card">
      <div className="issue-header">
        <span className="issue-icon">{config.icon}</span>
        <span className="issue-severity" style={{ color: config.color }}>{config.label}</span>
      </div>
      <h4 className="issue-title">{issue.title}</h4>
      <p className="issue-description">{issue.description}</p>
      
      {issue.suggestion && (
        <div className="issue-suggestion">
          <div className="suggestion-label">Suggested fix</div>
          <code className="suggestion-code">{issue.suggestion}</code>
        </div>
      )}
      
      {issue.memory_used && (
        <div className="issue-memory">
          <span>🧠</span>
          <span className="memory-label">Team convention recalled:</span>
          <span className="memory-text">{issue.memory_used}</span>
        </div>
      )}

      {/* Accept → Learn UX states */}
      {feedbackStatus && feedbackStatus.decision === 'accepted' && !feedbackStatus.retained && !isRetaining && (
        <div className="issue-success-inline">
          <span>✓</span>
          <span>Feedback accepted</span>
        </div>
      )}

      {isRetaining && (
        <div className="issue-retaining">
          <span>🧠</span>
          <span>Retaining team knowledge...</span>
        </div>
      )}

      {feedbackStatus && feedbackStatus.retained && (
        <div className="issue-success">
          <div className="success-header">
            <span>✓</span>
            <span className="success-title">TEAM LEARNED</span>
          </div>
          <p className="success-message">{feedbackStatus.message}</p>
        </div>
      )}

      {feedbackStatus && feedbackStatus.decision === 'accepted' && !feedbackStatus.retained && !isRetaining && feedbackStatus.message && feedbackStatus.message.includes('Could not') && (
        <div className="issue-error">
          <span>⚠</span>
          <span>{feedbackStatus.message}</span>
        </div>
      )}

      {!feedbackStatus ? (
        <div className="issue-actions">
          <button
            onClick={() => handleFeedback('accepted')}
            className="action-button action-accept"
          >
            Accept
          </button>
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="action-button action-reject"
          >
            Reject
          </button>
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="action-button action-ignore"
          >
            Not relevant
          </button>
        </div>
      ) : (
        <div className="issue-feedback-recorded">
          Feedback recorded
        </div>
      )}

      {showFeedback && !feedbackStatus && (
        <div className="issue-feedback-form">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Explain why (optional)..."
            rows={2}
            className="feedback-textarea"
          />
          <div className="feedback-actions">
            <button
              onClick={() => handleFeedback('rejected')}
              className="feedback-button feedback-submit-reject"
            >
              Submit Rejection
            </button>
            <button
              onClick={() => handleFeedback('not_relevant')}
              className="feedback-button feedback-submit-ignore"
            >
              Submit Ignore
            </button>
            <button
              onClick={() => { setShowFeedback(false); setFeedbackText(''); }}
              className="feedback-button feedback-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .issue-card {
          background: #F7F3EA;
          border: 1px solid #DEDACF;
          border-radius: 10px;
          padding: 16px;
          transition: border-color 0.15s ease;
        }

        .issue-card:hover {
          border-color: #DFFF00;
        }

        .issue-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .issue-icon {
          font-size: 14px;
        }

        .issue-severity {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .issue-title {
          font-size: 14px;
          font-weight: 600;
          color: #171717;
          margin: 0 0 8px 0;
        }

        .issue-description {
          font-size: 13px;
          color: #6B6B63;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .issue-suggestion {
          background: #FFFDF8;
          border: 1px solid #DEDACF;
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .suggestion-label {
          font-size: 11px;
          font-weight: 500;
          color: #6B6B63;
          margin-bottom: 4px;
        }

        .suggestion-code {
          font-size: 12px;
          color: #171717;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .issue-memory {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #171717;
          background: #DFFF00;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #A8C700;
          margin-bottom: 12px;
        }

        .memory-label {
          font-weight: 500;
        }

        .memory-text {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .issue-success-inline {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #22C55E;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .issue-retaining {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6B6B63;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .issue-error {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #F59E0B;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .issue-success {
          background: #F7F3EA;
          border: 1px solid #22C55E;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .success-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .success-title {
          font-size: 11px;
          font-weight: 600;
          color: #22C55E;
          letter-spacing: 0.05em;
        }

        .success-message {
          font-size: 12px;
          color: #6B6B63;
          margin: 0;
        }

        .issue-actions {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #DEDACF;
        }

        .action-button {
          flex: 1;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .action-accept {
          background: #22C55E;
          color: #FFFDF8;
        }

        .action-accept:hover {
          background: #16A34A;
        }

        .action-reject {
          background: #EF4444;
          color: #FFFDF8;
        }

        .action-reject:hover {
          background: #DC2626;
        }

        .action-ignore {
          background: #6B6B63;
          color: #FFFDF8;
        }

        .action-ignore:hover {
          background: #171717;
        }

        .issue-feedback-recorded {
          font-size: 12px;
          color: #6B6B63;
          padding-top: 12px;
          border-top: 1px solid #DEDACF;
        }

        .issue-feedback-form {
          padding-top: 12px;
          border-top: 1px solid #DEDACF;
        }

        .feedback-textarea {
          width: 100%;
          padding: 8px 12px;
          font-size: 12px;
          border: 1px solid #DEDACF;
          border-radius: 6px;
          background: #FFFDF8;
          color: #171717;
          outline: none;
          transition: border-color 0.15s ease;
          resize: none;
        }

        .feedback-textarea:focus {
          border-color: #DFFF00;
        }

        .feedback-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .feedback-button {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .feedback-submit-reject {
          background: #EF4444;
          color: #FFFDF8;
        }

        .feedback-submit-reject:hover {
          background: #DC2626;
        }

        .feedback-submit-ignore {
          background: #6B6B63;
          color: #FFFDF8;
        }

        .feedback-submit-ignore:hover {
          background: #171717;
        }

        .feedback-cancel {
          background: #FFFDF8;
          color: #171717;
          border: 1px solid #DEDACF;
        }

        .feedback-cancel:hover {
          background: #F7F3EA;
        }
      `}</style>
    </div>
  );
}
