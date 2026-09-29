interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-150 hover:translate-y-[-1px] active:translate-y-[0px]';
  
  const variants = {
    primary: 'bg-[#171717] text-[#FFFDF8] hover:bg-[#2a2a2a] focus:ring-2 focus:ring-[#DFFF00] focus:ring-offset-2',
    secondary: 'bg-[#FFFDF8] text-[#171717] border border-[#DEDACF] hover:bg-[#F7F3EA] hover:border-[#DFFF00]',
    ghost: 'bg-transparent text-[#6B6B63] hover:bg-[#F7F3EA] hover:text-[#171717]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
