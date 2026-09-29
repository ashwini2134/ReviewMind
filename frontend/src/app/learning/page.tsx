'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import PageContainer from '@/components/layout/PageContainer';
import Card from '@/components/ui/Card';

interface LearningEvent {
  type: 'accepted' | 'rejected' | 'not_relevant';
  message: string;
  timestamp: Date;
}

export default function LearningPage() {
  const [learningHistory, setLearningHistory] = useState<LearningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading learning history
    const mockHistory: LearningEvent[] = [
      {
        type: 'accepted',
        message: 'Use structured logging instead of print()',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        type: 'accepted',
        message: 'Add type hints to Python functions',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        type: 'rejected',
        message: 'Avoid global variables in module scope',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        type: 'accepted',
        message: 'Use async/await for I/O operations',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    ];
    setLearningHistory(mockHistory);
    setIsLoading(false);
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'accepted':
        return '✓';
      case 'rejected':
        return '✕';
      case 'not_relevant':
        return '○';
      default:
        return '●';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'accepted':
        return '#22C55E';
      case 'rejected':
        return '#EF4444';
      case 'not_relevant':
        return '#6B6B63';
      default:
        return '#DFFF00';
    }
  };

  if (isLoading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="loading-state">
          <p className="loading-text">Loading learning history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      
      <main className="learning-main">
        <PageContainer>
          {/* Header */}
          <div className="learning-header">
            <h1 className="page-title">Learning History</h1>
            <p className="page-subtitle">Track how ReviewMind learns from your team's feedback.</p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <Card className="stat-card">
              <div className="stat-label">Total Events</div>
              <div className="stat-value">{learningHistory.length}</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-label">Accepted</div>
              <div className="stat-value stat-value-green">
                {learningHistory.filter(e => e.type === 'accepted').length}
              </div>
            </Card>
            <Card className="stat-card">
              <div className="stat-label">Rejected</div>
              <div className="stat-value stat-value-red">
                {learningHistory.filter(e => e.type === 'rejected').length}
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <div className="timeline-container">
            <div className="timeline-header">Timeline</div>
            <div className="timeline">
              {learningHistory.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: getEventColor(event.type) }}>
                    <span className="timeline-icon">{getEventIcon(event.type)}</span>
                  </div>
                  <div className="timeline-content">
                    <Card className="event-card">
                      <div className="event-header">
                        <span className="event-type-badge" style={{ color: getEventColor(event.type) }}>
                          {event.type.toUpperCase()}
                        </span>
                        <span className="event-time">{formatDate(event.timestamp)}</span>
                      </div>
                      <p className="event-message">{event.message}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </main>

      <style jsx>{`
        .app-shell {
          min-height: 100vh;
          background: #F7F3EA;
        }

        .learning-main {
          margin-left: 240px;
          padding: 32px 0;
        }

        .learning-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6B6B63;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }

        .stat-card {
          padding: 24px;
        }

        .stat-label {
          font-size: 13px;
          color: #6B6B63;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.03em;
        }

        .stat-value-green {
          color: #22C55E;
        }

        .stat-value-red {
          color: #EF4444;
        }

        .timeline-container {
          max-width: 800px;
        }

        .timeline-header {
          font-size: 18px;
          font-weight: 600;
          color: #171717;
          margin-bottom: 32px;
        }

        .timeline {
          position: relative;
          padding-left: 32px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #DEDACF;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 32px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -32px;
          top: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .timeline-icon {
          font-size: 10px;
          color: #FFFDF8;
          font-weight: 600;
        }

        .timeline-content {
          flex: 1;
        }

        .event-card {
          padding: 20px;
        }

        .event-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .event-type-badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .event-time {
          font-size: 12px;
          color: #6B6B63;
        }

        .event-message {
          font-size: 14px;
          color: #171717;
          line-height: 1.6;
          margin: 0;
        }

        .loading-state {
          margin-left: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
        }

        .loading-text {
          font-size: 14px;
          color: #6B6B63;
        }

        @media (max-width: 1280px) {
          .learning-main {
            padding: 24px 0;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .learning-main {
            margin-left: 0;
            padding: 16px;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .timeline-container {
            max-width: 100%;
          }

          .page-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
