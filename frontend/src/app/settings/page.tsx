'use client';

import Sidebar from '@/components/Sidebar';
import PageContainer from '@/components/layout/PageContainer';
import Card from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="app-shell">
      <Sidebar />
      
      <main className="settings-main">
        <PageContainer>
          {/* Header */}
          <div className="settings-header">
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Configure your ReviewMind instance</p>
          </div>

          {/* Team Settings */}
          <Card className="settings-card">
            <div className="settings-card-header">
              <h2 className="settings-card-title">Team</h2>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <div className="setting-label">Team name</div>
                <div className="setting-value">ReviewMind Demo Team</div>
              </div>
            </div>
          </Card>

          {/* Memory Settings */}
          <Card className="settings-card">
            <div className="settings-card-header">
              <h2 className="settings-card-title">Memory</h2>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <div className="setting-item-left">
                  <div className="setting-label">Hindsight</div>
                  <div className="setting-description">Memory service for team knowledge</div>
                </div>
                <div className="setting-item-right">
                  <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span className="status-text">Connected</span>
                  </div>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-label">Memory Bank</div>
                <div className="setting-value">reviewmind-demo</div>
              </div>
            </div>
          </Card>

          {/* AI Settings */}
          <Card className="settings-card">
            <div className="settings-card-header">
              <h2 className="settings-card-title">AI</h2>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <div className="setting-item-left">
                  <div className="setting-label">Groq</div>
                  <div className="setting-description">AI model for code review</div>
                </div>
                <div className="setting-item-right">
                  <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span className="status-text">Connected</span>
                  </div>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-label">Model</div>
                <div className="setting-value">GPT-OSS-120B</div>
              </div>
            </div>
          </Card>

          {/* API Settings */}
          <Card className="settings-card">
            <div className="settings-card-header">
              <h2 className="settings-card-title">API</h2>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <div className="setting-label">Backend Endpoint</div>
                <div className="setting-value">http://localhost:8000</div>
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

        .settings-main {
          margin-left: 240px;
          padding: 32px 0;
        }

        .settings-header {
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

        .settings-card {
          padding: 24px;
          margin-bottom: 24px;
        }

        .settings-card-header {
          margin-bottom: 20px;
        }

        .settings-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.02em;
        }

        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .setting-item-left {
          flex: 1;
        }

        .setting-label {
          font-size: 14px;
          font-weight: 500;
          color: #171717;
          margin-bottom: 4px;
        }

        .setting-description {
          font-size: 13px;
          color: #6B6B63;
        }

        .setting-value {
          font-size: 14px;
          color: #171717;
        }

        .setting-item-right {
          flex-shrink: 0;
        }

        .status-indicator {
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

        @media (max-width: 1280px) {
          .settings-main {
            padding: 24px 0;
          }
        }

        @media (max-width: 1024px) {
          .settings-main {
            margin-left: 0;
            padding: 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .setting-item-right {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
