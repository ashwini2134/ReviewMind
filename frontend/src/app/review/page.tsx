'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import CodeEditor from '@/components/CodeEditor';
import ReviewResults from '@/components/ReviewResults';
import TeamMemory from '@/components/TeamMemory';
import LearningHistory from '@/components/LearningHistory';
import { submitReview, submitFeedback } from '@/lib/api';
import { Issue } from '@/lib/api';

export default function ReviewPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [framework, setFramework] = useState('FastAPI');
  const [teamId, setTeamId] = useState('reviewmind-demo');
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [memories, setMemories] = useState<Array<{ text: string; type: string; score?: number | null }>>([]);
  const [memoryCount, setMemoryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, { decision: string; retained: boolean; message: string }>>({});
  const [retainingIssueId, setRetainingIssueId] = useState<string | null>(null);
  const [learningEvents, setLearningEvents] = useState<Array<{ type: 'accepted' | 'rejected' | 'not_relevant'; message: string; timestamp: Date }>>([]);

  const handleReview = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const result = await submitReview({
        code,
        language,
        framework,
        team_id: teamId,
      });
      setReviewId(result.review_id);
      setSummary(result.review.summary);
      setIssues(result.review.issues);
      setMemories(result.recalled_memories);
      setMemoryCount(result.memory_count);
      setFeedbackStatus({});
    } catch (error) {
      console.error('Review failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (issueId: string, decision: 'accepted' | 'rejected' | 'not_relevant', feedback?: string) => {
    if (!reviewId) return;

    // Set initial feedback status
    setFeedbackStatus((prev) => ({
      ...prev,
      [issueId]: {
        decision,
        retained: false,
        message: '',
      },
    }));

    // If accepting, show retaining state
    if (decision === 'accepted') {
      setRetainingIssueId(issueId);
    }

    try {
      const result = await submitFeedback({
        review_id: reviewId,
        issue_id: issueId,
        decision,
        feedback,
      });

      setFeedbackStatus((prev) => ({
        ...prev,
        [issueId]: {
          decision,
          retained: result.retained,
          message: result.message || 'Feedback recorded',
        },
      }));

      if (result.retained && result.message) {
        setLearningEvents((prev) => [
          ...prev,
          { type: 'accepted', message: result.message || 'Convention learned', timestamp: new Date() },
        ]);
      }
    } catch (error) {
      console.error('Feedback failed:', error);
      setFeedbackStatus((prev) => ({
        ...prev,
        [issueId]: {
          decision,
          retained: false,
          message: 'Could not retain learning',
        },
      }));
    } finally {
      setRetainingIssueId(null);
    }
  };

  return (
    <div className="review-app-shell">
      <Sidebar />
      
      <main className="review-main">
        {/* Workspace Header */}
        <div className="workspace-header">
          <div className="header-left">
            <h1 className="workspace-title">Review workspace</h1>
            <p className="workspace-subtitle">{language} · {framework} · {teamId}</p>
          </div>
          <div className="header-right">
            <div className="hindsight-status">
              <div className="status-dot"></div>
              <span className="status-text">Hindsight connected</span>
            </div>
          </div>
        </div>

        {/* 3-column workspace grid */}
        <div className="workspace-grid">
          {/* Code Panel */}
          <div className="panel code-panel">
            <div className="panel-header">
              <span className="panel-title">CODE</span>
              <span className="panel-meta">{language} · {framework}</span>
            </div>
            <div className="panel-content">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                framework={framework}
                setFramework={setFramework}
                teamId={teamId}
                setTeamId={setTeamId}
                onReview={handleReview}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* AI Review Panel */}
          <div className="panel review-panel">
            <div className="panel-header">
              <span className="panel-title">AI REVIEW</span>
              {issues.length > 0 && <span className="panel-meta">{issues.length} issues found</span>}
            </div>
            <div className="panel-content">
              <ReviewResults
                summary={summary}
                issues={issues}
                reviewId={reviewId || ''}
                teamId={teamId}
                onFeedback={handleFeedback}
                feedbackStatus={feedbackStatus}
                retainingIssueId={retainingIssueId || undefined}
              />
            </div>
          </div>

          {/* Hindsight Panel */}
          <div className="panel hindsight-panel">
            <div className="panel-header">
              <span className="panel-title">🧠 HINDSIGHT</span>
              <span className="panel-meta">{memoryCount} recalled</span>
            </div>
            <div className="panel-content">
              <TeamMemory memories={memories} memoryCount={memoryCount} />
              {learningEvents.length > 0 && (
                <LearningHistory events={learningEvents} />
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .review-app-shell {
          min-height: 100vh;
          background: #F7F3EA;
        }

        .review-main {
          margin-left: 240px;
          width: calc(100vw - 240px);
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .workspace-header {
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .header-left {
          flex: 1;
        }

        .workspace-title {
          font-size: 28px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }

        .workspace-subtitle {
          font-size: 14px;
          color: #6B6B63;
        }

        .header-right {
          flex-shrink: 0;
        }

        .hindsight-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
        }

        .status-text {
          font-size: 14px;
          color: #6B6B63;
        }

        .workspace-grid {
          flex: 1;
          min-height: 0;
          padding: 0 32px 24px;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.1fr) minmax(300px, 0.75fr);
          gap: 16px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .panel {
          min-width: 0;
          min-height: 0;
          border: 1px solid #DEDACF;
          border-radius: 14px;
          background: #FFFDF8;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid #DEDACF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          background: #F7F3EA;
        }

        .panel-title {
          font-size: 14px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.01em;
        }

        .panel-meta {
          font-size: 12px;
          color: #6B6B63;
        }

        .panel-content {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        @media (max-width: 1280px) {
          .workspace-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            grid-template-rows: auto 1fr;
          }

          .hindsight-panel {
            grid-column: 1 / -1;
            grid-row: 2;
          }
        }

        @media (max-width: 1024px) {
          .review-main {
            margin-left: 0;
            width: 100vw;
          }

          .workspace-header {
            padding: 20px 24px;
          }

          .workspace-grid {
            padding: 0 24px 24px;
          }

          .workspace-title {
            font-size: 24px;
          }
        }

        @media (max-width: 768px) {
          .workspace-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }

          .hindsight-panel {
            grid-column: 1;
            grid-row: auto;
          }

          .workspace-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
