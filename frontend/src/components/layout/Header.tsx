'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="page-container">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-mark">
              <div className="logo-dot"></div>
            </div>
            <span className="logo-text">ReviewMind</span>
          </Link>

          {/* Navigation */}
          <nav className="nav-links">
            <Link href="#how-it-works" className="nav-link">
              How it works
            </Link>
            <Link href="/memory" className="nav-link">
              Memory
            </Link>
          </nav>

          {/* CTA */}
          <Link href="/review" className="cta-button">
            Open ReviewMind →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .header {
          height: 64px;
          background: rgba(255, 253, 248, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #DEDACF;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .page-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 32px;
          padding-right: 32px;
          height: 100%;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          gap: 32px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-mark {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #171717;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #DFFF00;
        }

        .logo-text {
          font-size: 16px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          font-size: 14px;
          color: #6B6B63;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: #171717;
        }

        .cta-button {
          padding: 8px 16px;
          background: #171717;
          color: #FFFDF8;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s ease;
          white-space: nowrap;
        }

        .cta-button:hover {
          background: #2a2a2a;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .page-container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </header>
  );
}
