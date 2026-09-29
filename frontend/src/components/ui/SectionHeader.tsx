interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, eyebrow, className = '' }: SectionHeaderProps) {
  return (
    <div className={`section-header ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="title">{title}</h2>
      {subtitle && <p className="subtitle">{subtitle}</p>}
      
      <style jsx>{`
        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }
        
        .eyebrow {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6B6B63;
          margin-bottom: 16px;
        }
        
        .title {
          font-size: 32px;
          font-weight: 600;
          color: #171717;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        
        .subtitle {
          font-size: 16px;
          color: #6B6B63;
          line-height: 1.6;
          max-width: 640px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .title {
            font-size: 24px;
          }
          
          .subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
