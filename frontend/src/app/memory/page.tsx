'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import PageContainer from '@/components/layout/PageContainer';
import Card from '@/components/ui/Card';
import { submitReview } from '@/lib/api';

interface Memory {
  text: string;
  type: string;
  score?: number | null;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const result = await submitReview({
        code: '# Sample code to recall memories',
        language: 'Python',
        framework: 'FastAPI',
        team_id: 'reviewmind-demo',
      });
      setMemories(result.recalled_memories);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMemories = memories.filter(memory =>
    memory.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="loading-state">
          <p className="loading-text">Loading memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      
      <main className="memory-main">
        <PageContainer>
          {/* Header */}
          <div className="memory-header">
            <h1 className="page-title">Team Memory</h1>
            <p className="page-subtitle">ReviewMind remembers what matters to your team.</p>
          </div>

          {/* Search */}
          <Card className="search-card">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search team memory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </Card>

          {/* Memory Bank Info */}
          <Card className="memory-bank-card">
            <div className="memory-bank-content">
              <div className="memory-bank-left">
                <div className="memory-bank-label">Memory Bank</div>
                <div className="memory-bank-name">reviewmind-demo</div>
              </div>
              <div className="memory-bank-right">
                <div className="memory-count">{memories.length}</div>
                <div className="memory-count-label">memories</div>
              </div>
            </div>
          </Card>

          {/* Memories list */}
          {filteredMemories.length > 0 ? (
            <div className="memories-grid">
              <div className="memories-count">{memories.length} MEMORIES</div>
              <div className="memory-cards">
                {filteredMemories.map((memory, index) => (
                  <Card key={index} className="memory-card">
                    <div className="memory-card-header">
                      <span className="memory-emoji">🧠</span>
                      <span className="memory-type-badge">{memory.type}</span>
                      {typeof memory.score === "number" && (
                        <span className="memory-score">{(memory.score as number).toFixed(2)}</span>
                      )}
                    </div>
                    <p className="memory-text">{memory.text}</p>
                    <div className="memory-source">Learned from code review feedback</div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="empty-card">
              <div className="empty-content">
                <div className="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="empty-title">No memories found</h3>
                <p className="empty-description">
                  {searchQuery ? 'Try a different search term' : 'Start reviewing code to build your team\'s memory'}
                </p>
                <button onClick={loadMemories} className="refresh-button">
                  Refresh Memories
                </button>
              </div>
            </Card>
          )}
        </PageContainer>
      </main>

      <style jsx>{`
        .app-shell {
          min-height: 100vh;
          background: #F7F3EA;
        }

        .memory-main {
          margin-left: 240px;
          padding: 32px 0;
        }

        .memory-header {
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

        .search-card {
          padding: 20px;
          margin-bottom: 24px;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 14px;
          border: 1px solid #DEDACF;
          border-radius: 8px;
          background: #FFFDF8;
          color: #171717;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .search-input:focus {
          border-color: #DFFF00;
        }

        .memory-bank-card {
          padding: 24px;
          margin-bottom: 32px;
        }

        .memory-bank-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .memory-bank-left {
          flex: 1;
        }

        .memory-bank-label {
          font-size: 13px;
          color: #6B6B63;
          margin-bottom: 4px;
        }

        .memory-bank-name {
          font-size: 18px;
          font-weight: 600;
          color: #171717;
        }

        .memory-bank-right {
          text-align: right;
        }

        .memory-count {
          font-size: 32px;
          font-weight: 600;
          color: #DFFF00;
          letter-spacing: -0.03em;
        }

        .memory-count-label {
          font-size: 14px;
          color: #6B6B63;
        }

        .memories-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .memories-count {
          font-size: 13px;
          color: #6B6B63;
          font-weight: 500;
        }

        .memory-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .memory-card {
          padding: 20px;
          transition: border-color 0.15s ease;
        }

        .memory-card:hover {
          border-color: #DFFF00;
        }

        .memory-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .memory-emoji {
          font-size: 20px;
        }

        .memory-type-badge {
          font-size: 11px;
          font-weight: 600;
          color: #171717;
          background: #DFFF00;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .memory-score {
          margin-left: auto;
          font-size: 12px;
          color: #6B6B63;
        }

        .memory-text {
          font-size: 14px;
          color: #171717;
          line-height: 1.6;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .memory-source {
          font-size: 12px;
          color: #6B6B63;
        }

        .empty-card {
          padding: 48px;
        }

        .empty-content {
          text-align: center;
        }

        .empty-icon {
          color: #DEDACF;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #171717;
          margin-bottom: 8px;
        }

        .empty-description {
          font-size: 14px;
          color: #6B6B63;
          margin-bottom: 24px;
        }

        .refresh-button {
          padding: 10px 20px;
          background: #171717;
          color: #FFFDF8;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .refresh-button:hover {
          background: #2a2a2a;
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
          .memory-main {
            padding: 24px 0;
          }

          .memory-cards {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1024px) {
          .memory-main {
            margin-left: 0;
            padding: 16px;
          }

          .page-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
