'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StatusIndicator from './ui/StatusIndicator';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Review', href: '/review' },
  { name: 'Memory', href: '/memory' },
  { name: 'Learning', href: '/learning' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#E2E8F0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center group-hover:bg-[#1D4ED8] transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
            <span className="text-base font-semibold text-[#0F172A] tracking-tight">ReviewMind</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                  pathname === item.href
                    ? 'bg-gray-100 text-[#0F172A]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Team indicator */}
          <div className="flex items-center gap-4">
            <StatusIndicator status="online" label="reviewmind-demo" size="sm" />
            <Link
              href="/settings"
              className="text-[#94A3B8] hover:text-[#64748B] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
