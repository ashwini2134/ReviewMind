interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'loading';
  label?: string;
  size?: 'sm' | 'md';
}

export default function StatusIndicator({ status, label, size = 'md' }: StatusIndicatorProps) {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };
  
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    loading: 'bg-yellow-500 animate-pulse',
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${sizes[size]} ${colors[status]} rounded-full`} />
      {label && <span className="text-sm text-[#64748B]">{label}</span>}
    </div>
  );
}
