import React from 'react';
import { ConfidenceTier } from '../../types';

interface ConfidenceBadgeProps {
  tier: ConfidenceTier;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ tier, score, size = 'sm' }) => {
  const styles = {
    HIGH: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50',
    MEDIUM: 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-950/50',
    LOW: 'bg-slate-900/80 text-slate-400 border-slate-700/40 shadow-slate-950/50',
  };

  const labels = {
    HIGH: 'HIGH CONFIDENCE (>85%)',
    MEDIUM: 'MEDIUM CONFIDENCE (60-85%)',
    LOW: 'LOW CONFIDENCE (<60%)',
  };

  const shortLabels = {
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
    lg: 'text-sm px-3 py-1.5 font-semibold tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase font-medium rounded border shadow-sm ${styles[tier]} ${sizeClasses[size]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          tier === 'HIGH' ? 'bg-emerald-400 animate-pulse' : tier === 'MEDIUM' ? 'bg-amber-400' : 'bg-slate-500'
        }`}
      />
      {size === 'sm' ? shortLabels[tier] : labels[tier]}
      {score !== undefined && (
        <span className="font-bold ml-1 opacity-90">({(score * 100).toFixed(0)}%)</span>
      )}
    </span>
  );
};
