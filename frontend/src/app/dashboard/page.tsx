'use client';

import Sidebar from '@/components/Sidebar';
import PageContainer from '@/components/layout/PageContainer';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      
      <main className="dashboard-main">
        <PageContainer>
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="page-title">Good evening.</h1>
            <p className="page-subtitle">Your team's code review knowledge is getting smarter.</p>
          </div>

          {/* Team Intelligence Card */}
          <Card className="intelligence-card">
            <div className="card-header">
              <h2 className="card-title">Team Intelligence</h2>
            </div>
            <div className="flow-visualization">
              <div className="flow-step active">
                <span className="step-label">RECALL</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step active">
                <span className="step-label">REVIEW</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step active">
                <span className="step-label">LEARN</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="step-label">IMPROVE</span>
              </div>
            </div>
            <p className="flow-description">
              Your team's standards become persistent knowledge through the Hindsight memory loop.
            </p>
          </Card>

          {/* Stats Grid */}
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-label">Team Memories</div>
              <div className="stat-value">18</div>
              <div className="stat-change">+3 this week</div>
            </Card>

            <Card className="stat-card">
              <div className="stat-label">Reviews Completed</div>
              <div className="stat-value">42</div>
              <div className="stat-change">+8 this week</div>
            </Card>

            <Card className="stat-card">
              <div className="stat-label">Conventions Learned</div>
              <div className="stat-value">12</div>
              <div className="stat-change">+2 this week</div>
            </Card>
          </div>

          {/* Recent Learning */}
          <Card className="learning-card">
            <div className="card-header">
              <h2 className="card-title">Recent Learning</h2>
            </div>
            <div className="learning-list">
              <div className="learning-item">
                <div className="learning-icon">●</div>
                <div className="learning-content">
                  <div className="learning-title">Use structured logging instead of print()</div>
                  <div className="learning-time">2 hours ago</div>
                </div>
              </div>
              <div className="learning-item">
                <div className="learning-icon">●</div>
                <div className="learning-content">
                  <div className="learning-title">Add type hints to Python functions</div>
                  <div className="learning-time">5 hours ago</div>
                </div>
              </div>
              <div className="learning-item">
                <div className="learning-icon">●</div>
                <div className="learning-content">
                  <div className="learning-title">Use async/await for I/O operations</div>
                  <div className="learning-time">Yesterday</div>
                </div>
              </div>
            </div>
          </Card>
        </PageContainer>
      </main>

      <style jsx>{`
        .app-shell {
          min-height: 100vh;
          background: #F7F3EA;
        }

        .dashboard-main {
          margin-left: 240px;
          padding: 32px 0;
        }

        .dashboard-header {
          margin-bottom: 48px;
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

        .intelligence-card {
          padding: 32px;
          margin-bottom: 32px;
        }

        .card-header {
          margin-bottom: 24px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.02em;
        }

        .flow-visualization {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .flow-step {
          padding: 8px 16px;
          background: #F7F3EA;
          border: 1px solid #DEDACF;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #6B6B63;
        }

        .flow-step.active {
          background: #DFFF00;
          border-color: #A8C700;
          color: #171717;
        }

        .flow-arrow {
          color: #DFFF00;
          font-size: 16px;
        }

        .flow-description {
          font-size: 14px;
          color: #6B6B63;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
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
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 12px;
          color: #22C55E;
        }

        .learning-card {
          padding: 24px;
        }

        .learning-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #F7F3EA;
          border-radius: 8px;
        }

        .loading-state {
          margin-left: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
        }

        .learning-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
        }

        .learning-icon {
          color: #22C55E;
          font-size: 8px;
          margin-top: 4px;
        }

        .learning-content {
          flex: 1;
        }

        .learning-title {
          font-size: 14px;
          font-weight: 500;
          color: #171717;
          margin-bottom: 4px;
        }

        .learning-time {
          font-size: 12px;
          color: #6B6B63;
        }

        @media (max-width: 1280px) {
          .dashboard-main {
            padding: 24px 0;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .dashboard-main {
            margin-left: 0;
            padding: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
