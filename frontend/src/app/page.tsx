'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import ProductPreview from '@/components/ProductPreview';

export default function LandingPage() {
  return (
    <div className="app-shell">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <PageContainer>
          <div className="hero-grid">
            {/* Left Column */}
            <div className="hero-left">
              <p className="eyebrow">AI CODE REVIEW · HINDSIGHT MEMORY</p>
              <h1 className="hero-title">
                Your team's code reviews
                <br />
                should <span className="highlight">remember.</span>
              </h1>
              <p className="hero-subtitle">
                ReviewMind learns your team's coding conventions and applies them to every review that follows.
              </p>
              <div className="cta-row">
                <Link href="/review" className="cta-primary">
                  Start reviewing →
                </Link>
                <Link href="#how-it-works" className="cta-secondary">
                  See how it learns
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="hero-right">
              <ProductPreview />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Learning Section */}
      <section id="how-it-works" className="learning-section">
        <PageContainer>
          <div className="section-header">
            <h2 className="section-title">It gets smarter with every review</h2>
            <p className="section-subtitle">
              The more your team reviews, the more ReviewMind understands how your team actually works.
            </p>
          </div>

          <div className="cards-grid">
            <div className="feature-card">
              <div className="card-number">01</div>
              <h3 className="card-title">RECALL</h3>
              <p className="card-description">Remember what your team knows.</p>
            </div>

            <div className="feature-card">
              <div className="card-number">02</div>
              <h3 className="card-title">REVIEW</h3>
              <p className="card-description">Review code using team knowledge.</p>
            </div>

            <div className="feature-card">
              <div className="card-number">03</div>
              <h3 className="card-title">LEARN</h3>
              <p className="card-description">Turn feedback into persistent memory.</p>
            </div>
          </div>

          <div className="flow-indicator">
            <span>RECALL</span>
            <span className="arrow">→</span>
            <span>REVIEW</span>
            <span className="arrow">→</span>
            <span>LEARN</span>
          </div>

          <p className="flow-summary">Your team's standards become persistent knowledge.</p>
        </PageContainer>
      </section>

      {/* Footer */}
      <footer className="footer">
        <PageContainer>
          <p className="footer-text">ReviewMind — Code reviews that learn your team's standards.</p>
        </PageContainer>
      </footer>

      <style jsx>{`
        .app-shell {
          min-height: 100vh;
          background: #F7F3EA;
        }

        .hero-section {
          min-height: 680px;
          display: flex;
          align-items: center;
          padding-top: 64px;
          padding-bottom: 64px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .hero-left {
          max-width: 560px;
        }

        .eyebrow {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6B6B63;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .highlight {
          color: #DFFF00;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #6B6B63;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .cta-row {
          display: flex;
          gap: 16px;
        }

        .cta-primary {
          padding: 12px 24px;
          background: #171717;
          color: #FFFDF8;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .cta-primary:hover {
          background: #2a2a2a;
        }

        .cta-secondary {
          padding: 12px 24px;
          background: #FFFDF8;
          color: #171717;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #DEDACF;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .cta-secondary:hover {
          background: #F7F3EA;
          border-color: #DFFF00;
        }

        .hero-right {
          max-width: 560px;
        }

        .learning-section {
          background: #FFFDF8;
          border-top: 1px solid #DEDACF;
          padding: 96px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 16px;
          color: #6B6B63;
          line-height: 1.6;
          max-width: 640px;
          margin: 0 auto;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 960px;
          margin: 0 auto 48px;
        }

        .feature-card {
          background: #F7F3EA;
          border: 1px solid #DEDACF;
          border-radius: 16px;
          padding: 32px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .card-number {
          font-size: 48px;
          font-weight: 600;
          color: #DEDACF;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .card-description {
          font-size: 14px;
          color: #6B6B63;
          line-height: 1.5;
        }

        .flow-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #6B6B63;
        }

        .arrow {
          color: #DFFF00;
        }

        .flow-summary {
          text-align: center;
          font-size: 18px;
          font-weight: 500;
          color: #171717;
        }

        .footer {
          border-top: 1px solid #DEDACF;
          padding: 32px 0;
          background: #FFFDF8;
        }

        .footer-text {
          text-align: center;
          font-size: 14px;
          color: #6B6B63;
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .hero-left,
          .hero-right {
            max-width: 100%;
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .section-title {
            font-size: 24px;
          }

          .cta-row {
            flex-direction: column;
          }

          .cta-primary,
          .cta-secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
