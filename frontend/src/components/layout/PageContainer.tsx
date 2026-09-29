'use client';

import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`page-container ${className}`}>
      <style jsx>{`
        .page-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 32px;
          padding-right: 32px;
        }
        
        @media (max-width: 1024px) {
          .page-container {
            padding-left: 24px;
            padding-right: 24px;
          }
        }
        
        @media (max-width: 640px) {
          .page-container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
      {children}
    </div>
  );
}
