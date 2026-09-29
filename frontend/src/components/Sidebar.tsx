'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-dot"></div>
        </div>
        <span className="logo-text">ReviewMind</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">WORKSPACE</div>
          <Link href="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'nav-item-active' : ''}`}>
            Overview
          </Link>
          <Link href="/review" className={`nav-item ${isActive('/review') ? 'nav-item-active' : ''}`}>
            <span className="nav-item-active-dot"></span>
            Review
          </Link>
          <Link href="/memory" className={`nav-item ${isActive('/memory') ? 'nav-item-active' : ''}`}>
            Memory
          </Link>
          <Link href="/learning" className={`nav-item ${isActive('/learning') ? 'nav-item-active' : ''}`}>
            Learning
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">TEAM</div>
          <div className="team-item">
            <div className="team-dot"></div>
            <span className="team-name">reviewmind-demo</span>
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className="sidebar-footer">
        <Link href="/settings" className={`nav-item ${isActive('/settings') ? 'nav-item-active' : ''}`}>
          Settings
        </Link>
      </div>

      <style jsx>{`
        .sidebar {
          width: 240px;
          min-width: 240px;
          height: 100vh;
          background: #F7F3EA;
          border-right: 1px solid #DEDACF;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 50;
        }

        .sidebar-logo {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #DEDACF;
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

        .sidebar-nav {
          flex: 1;
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-section-label {
          font-size: 11px;
          font-weight: 600;
          color: #6B6B63;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0 12px;
          margin-bottom: 4px;
        }

        .nav-item {
          height: 40px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #171717;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .nav-item:hover {
          background: #F1EDE3;
        }

        .nav-item-active {
          background: #171717;
          color: #FFFDF8;
        }

        .nav-item-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #DFFF00;
          flex-shrink: 0;
        }

        .team-item {
          height: 40px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 8px;
          background: #F1EDE3;
        }

        .team-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22C55E;
          flex-shrink: 0;
        }

        .team-name {
          font-size: 14px;
          font-weight: 500;
          color: #171717;
        }

        .sidebar-footer {
          padding: 24px 12px;
          border-top: 1px solid #DEDACF;
        }

        @media (max-width: 1024px) {
          .sidebar {
            width: 220px;
            min-width: 220px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
