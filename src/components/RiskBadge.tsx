import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Siren, Info } from 'lucide-react';

interface RiskBadgeProps {
  level: string; // LOW, MODERATE, HIGH, EXTREME
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level = 'LOW',
  score,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  const configs: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
    LOW: {
      label: 'Low Risk',
      bg: 'bg-emerald-950/70',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      icon: ShieldCheck,
    },
    MODERATE: {
      label: 'Moderate Risk',
      bg: 'bg-amber-950/70',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      icon: AlertTriangle,
    },
    HIGH: {
      label: 'High Risk',
      bg: 'bg-orange-950/70',
      text: 'text-orange-400',
      border: 'border-orange-500/40',
      icon: AlertOctagon,
    },
    EXTREME: {
      label: 'Extreme Risk',
      bg: 'bg-red-950/70',
      text: 'text-red-400',
      border: 'border-red-500/40',
      icon: Siren,
    },
  };

  const config = configs[normalizedLevel] || {
    label: normalizedLevel,
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
    icon: Info,
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2',
    lg: 'text-base px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border shadow-sm ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <IconComponent className={iconSizes[size]} />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-80 font-mono text-xs">({score}/100)</span>
      )}
    </span>
  );
};

export default RiskBadge;

