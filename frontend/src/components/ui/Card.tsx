interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hindsight' | 'muted';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-[#FFFDF8] border border-[#DEDACF] rounded-xl',
    hindsight: 'bg-[#FFFDF8] border border-[#DFFF00] rounded-xl shadow-[0_0_20px_rgba(223,255,0,0.15)]',
    muted: 'bg-[#F7F3EA] border border-[#DEDACF] rounded-xl',
  };
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
