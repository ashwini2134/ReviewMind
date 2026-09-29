'use client';

interface TeamMemoryProps {
  memories: Array<{
    text: string;
    type: string;
    score?: number | null;
  }>;
  memoryCount: number;
}

export default function TeamMemory({ memories, memoryCount }: TeamMemoryProps) {
  // Empty state
  if (memoryCount === 0) {
    return (
      <div className="team-memory-empty">
        <div className="empty-header">
          <span className="empty-icon">🧠</span>
          <h3 className="empty-title">No relevant team memories yet</h3>
        </div>
        <p className="empty-description">
          ReviewMind will learn from accepted team feedback.
        </p>
        <p className="empty-hint">
          Memory becomes useful as your team reviews more code.
        </p>
      </div>
    );
  }

  return (
    <div className="team-memory-content">
      {/* Compact memory count metric */}
      <div className="memory-metric">
        <div className="metric-value">{memoryCount}</div>
        <div className="metric-label">RECALLED</div>
      </div>

      {/* Section header */}
      <div className="memory-section-header">
        RELEVANT TEAM KNOWLEDGE
      </div>

      {/* Memory cards */}
      <div className="memory-cards">
        {memories.slice(0, 5).map((memory, index) => (
          <div key={index} className="memory-card">
            <div className="memory-card-header">
              <span className="memory-category">{memory.type}</span>
              {typeof memory.score === "number" && (
                <span className="memory-score">{(memory.score as number).toFixed(2)}</span>
              )}
            </div>
            <p className="memory-text">{memory.text}</p>
          </div>
        ))}
        
        {memories.length > 5 && (
          <div className="memory-more">
            +{memories.length - 5} more memories
          </div>
        )}
      </div>

      <style jsx>{`
        .team-memory-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          text-align: center;
          height: 100%;
        }

        .empty-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .empty-icon {
          font-size: 32px;
        }

        .empty-title {
          font-size: 14px;
          font-weight: 600;
          color: #171717;
          margin: 0;
        }

        .empty-description {
          font-size: 13px;
          color: #6B6B63;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .empty-hint {
          font-size: 12px;
          color: #9B9B93;
          margin: 0;
        }

        .team-memory-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .memory-metric {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 600;
          color: #DFFF00;
          letter-spacing: -0.03em;
        }

        .metric-label {
          font-size: 11px;
          font-weight: 600;
          color: #6B6B63;
          letter-spacing: 0.1em;
        }

        .memory-section-header {
          font-size: 11px;
          font-weight: 600;
          color: #6B6B63;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding-bottom: 8px;
          border-bottom: 1px solid #DEDACF;
        }

        .memory-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .memory-card {
          background: #F7F3EA;
          border: 1px solid #DEDACF;
          border-radius: 8px;
          padding: 12px;
          transition: border-color 0.15s ease;
        }

        .memory-card:hover {
          border-color: #DFFF00;
        }

        .memory-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .memory-category {
          font-size: 10px;
          font-weight: 600;
          color: #171717;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .memory-score {
          font-size: 11px;
          color: #6B6B63;
        }

        .memory-text {
          font-size: 13px;
          color: #171717;
          line-height: 1.5;
          margin: 0;
        }

        .memory-more {
          font-size: 12px;
          color: #6B6B63;
          text-align: center;
          padding: 8px;
        }
      `}</style>
    </div>
  );
}
