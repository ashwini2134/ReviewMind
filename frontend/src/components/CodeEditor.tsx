'use client';

import { useState } from 'react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  framework: string;
  setFramework: (framework: string) => void;
  teamId: string;
  setTeamId: (teamId: string) => void;
  onReview: () => void;
  isLoading: boolean;
}

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  framework,
  setFramework,
  teamId,
  setTeamId,
  onReview,
  isLoading,
}: CodeEditorProps) {
  return (
    <div className="code-editor-wrapper">
      {/* Compact controls */}
      <div className="controls-row">
        <div className="control-group">
          <label className="control-label">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="control-select"
          >
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Java">Java</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="C++">C++</option>
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">Framework</label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="control-select"
          >
            <option value="">None</option>
            <option value="FastAPI">FastAPI</option>
            <option value="Django">Django</option>
            <option value="Flask">Flask</option>
            <option value="React">React</option>
            <option value="Vue">Vue</option>
            <option value="Next.js">Next.js</option>
            <option value="Express">Express</option>
            <option value="Spring">Spring</option>
          </select>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Team</label>
        <input
          type="text"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="reviewmind-demo"
          className="control-input"
        />
      </div>

      {/* Dark code editor */}
      <div className="code-editor-container">
        <div className="editor-header">
          <span className="editor-lang">{language}</span>
          <div className="editor-dots">
            <div className="dot dot-red"></div>
            <div className="dot dot-yellow"></div>
            <div className="dot dot-green"></div>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="code-textarea"
        />
      </div>

      {/* Review button */}
      <div className="action-bar">
        <button
          onClick={onReview}
          disabled={isLoading || !code.trim()}
          className="review-button"
        >
          {isLoading ? 'Reviewing...' : 'Review code →'}
        </button>
      </div>

      <style jsx>{`
        .code-editor-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          height: 100%;
        }

        .controls-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .control-label {
          font-size: 12px;
          font-weight: 500;
          color: #6B6B63;
        }

        .control-select,
        .control-input {
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid #DEDACF;
          border-radius: 6px;
          background: #FFFDF8;
          color: #171717;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .control-select:focus,
        .control-input:focus {
          border-color: #DFFF00;
        }

        .code-editor-container {
          flex: 1;
          min-height: 0;
          background: #181818;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #252526;
          border-bottom: 1px solid #2D2D2D;
        }

        .editor-lang {
          font-size: 11px;
          color: #858585;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .editor-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-red {
          background: #FF5F56;
        }

        .dot-yellow {
          background: #FFBD2E;
        }

        .dot-green {
          background: #27CA40;
        }

        .code-textarea {
          flex: 1;
          min-height: 0;
          width: 100%;
          padding: 12px;
          background: #181818;
          color: #D4D4D4;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
          resize: none;
          outline: none;
          border: none;
        }

        .code-textarea::placeholder {
          color: #6B6B63;
        }

        .action-bar {
          flex-shrink: 0;
          padding-top: 8px;
        }

        .review-button {
          width: 100%;
          padding: 12px 20px;
          background: #171717;
          color: #FFFDF8;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .review-button:hover:not(:disabled) {
          background: #2a2a2a;
        }

        .review-button:hover:not(:disabled) {
          border-color: #DFFF00;
        }

        .review-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .controls-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
