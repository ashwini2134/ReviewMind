interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#F7F3EA] text-[#171717] border-[#DEDACF]',
    success: 'bg-[#F7F3EA] text-[#22C55E] border-[#22C55E]',
    warning: 'bg-[#F7F3EA] text-[#F59E0B] border-[#F59E0B]',
    error: 'bg-[#F7F3EA] text-[#EF4444] border-[#EF4444]',
    accent: 'bg-[#DFFF00] text-[#171717] border-[#A8C700]',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
