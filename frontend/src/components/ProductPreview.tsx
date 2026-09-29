'use client';

export default function ProductPreview() {
  return (
    <div className="product-preview">
      {/* Header bar */}
      <div className="preview-header">
        <div className="header-left">
          <div className="status-dot"></div>
          <span className="header-title">ReviewMind AI</span>
        </div>
        <span className="live-badge">● LIVE</span>
      </div>

      {/* Code area */}
      <div className="code-area">
        <div className="file-name">archive_user.py</div>
        <pre className="code-content">
          <code>{`def archive_user(user):
    print("Archiving user:", user)
    return user`}</code>
        </pre>
      </div>

      {/* AI issue */}
      <div className="ai-issue">
        <div className="issue-header">
          <span className="warning-icon">⚠</span>
          <span className="issue-title">Use of print for logging</span>
        </div>
        <p className="issue-description">
          Team convention recalled: "Use structured logging instead of print statements."
        </p>
      </div>

      {/* Hindsight memory */}
      <div className="hindsight-footer">
        <span className="memory-icon">🧠</span>
        <span className="memory-text">Hindsight</span>
        <span className="divider">·</span>
        <span className="memory-count">18 memories</span>
      </div>

      <style jsx>{`
        .product-preview {
          background: #FFFDF8;
          border: 1px solid #DEDACF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #DEDACF;
          background: #F7F3EA;
        }

        .header-left {
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

        .header-title {
          font-size: 13px;
          font-weight: 500;
          color: #171717;
        }

        .live-badge {
          font-size: 11px;
          color: #6B6B63;
          font-weight: 500;
        }

        .code-area {
          padding: 16px;
          background: #F7F3EA;
          border-bottom: 1px solid #DEDACF;
        }

        .file-name {
          font-size: 12px;
          color: #6B6B63;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          margin-bottom: 12px;
        }

        .code-content {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          color: #171717;
          line-height: 1.6;
          margin: 0;
        }

        .ai-issue {
          padding: 16px;
          background: #DFFF00;
          border-bottom: 1px solid #A8C700;
        }

        .issue-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .warning-icon {
          font-size: 14px;
        }

        .issue-title {
          font-size: 13px;
          font-weight: 500;
          color: #171717;
        }

        .issue-description {
          font-size: 13px;
          color: #171717;
          line-height: 1.5;
          margin: 0;
        }

        .hindsight-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #F7F3EA;
        }

        .memory-icon {
          font-size: 14px;
        }

        .memory-text {
          font-size: 13px;
          font-weight: 500;
          color: #171717;
        }

        .divider {
          color: #DEDACF;
        }

        .memory-count {
          font-size: 13px;
          color: #6B6B63;
        }
      `}</style>
    </div>
  );
}
