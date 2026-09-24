import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { formatSecondsToHMS } from '../../utils/formatters';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface GoldenHourWidgetProps {
  compact?: boolean;
}

export const GoldenHourWidget: React.FC<GoldenHourWidgetProps> = ({ compact = false }) => {
  const { activeComplaint, topPriorityCandidate } = useCase();
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time since complaint filed
  const elapsedSeconds = Math.max(0, Math.floor((now - activeComplaint.filed_timestamp_unix) / 1000));
  
  // Predicted cashout window duration (e.g., 45 mins from filing)
  const predictedWindowSeconds = ((topPriorityCandidate?.predicted_cashout_mins || 30) + 15) * 60;
  
  // Time remaining to act
  const remainingSeconds = Math.max(0, predictedWindowSeconds - elapsedSeconds);
  const remainingRatio = remainingSeconds / predictedWindowSeconds;

  // Color shift: green (>50%) -> amber (20-50%) -> red (<20%)
  const getStatusColor = () => {
    if (remainingRatio > 0.5) return {
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/40',
      bar: 'bg-emerald-500',
      label: 'STABLE WINDOW',
    };
    if (remainingRatio > 0.2) return {
      text: 'text-amber-400',
      border: 'border-amber-500/50',
      bg: 'bg-amber-950/40',
      bar: 'bg-amber-500',
      label: 'URGENT INTERCEPTION REQUIRED',
    };
    return {
      text: 'text-rose-400',
      border: 'border-rose-500/60',
      bg: 'bg-rose-950/50',
      bar: 'bg-rose-500 animate-pulse',
      label: 'CRITICAL: CASH-OUT IMMINENT',
    };
  };

  const status = getStatusColor();

  if (compact) {
    return (
      <div className={`flex items-center gap-3 px-3 py-1.5 rounded border ${status.border} ${status.bg}`}>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Clock className={`w-3.5 h-3.5 ${status.text}`} />
          <span className="text-slate-400">Remaining:</span>
          <span className={`font-bold ${status.text}`}>{formatSecondsToHMS(remainingSeconds)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-2.5 rounded-md border ${status.border} ${status.bg} transition-colors duration-500`}>
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className={`w-3.5 h-3.5 ${status.text}`} />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
            Golden Hour Interdiction Clock
          </span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold border ${status.border} ${status.text}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Timer 1 */}
        <div className="bg-navy-900/80 p-1.5 rounded border border-navy-750">
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
            Time Since Intake
          </div>
          <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
            {formatSecondsToHMS(elapsedSeconds)}
          </div>
        </div>

        {/* Timer 2 */}
        <div className="bg-navy-900/80 p-1.5 rounded border border-navy-750">
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
            Predicted Cashout
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
            {formatSecondsToHMS(predictedWindowSeconds)}
          </div>
        </div>

        {/* Timer 3 (Remaining) */}
        <div className="bg-navy-900/90 p-1.5 rounded border border-navy-700">
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
            Remaining To Act
          </div>
          <div className={`text-xs font-mono font-bold ${status.text} mt-0.5`}>
            {formatSecondsToHMS(remainingSeconds)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2 w-full bg-slate-900 h-1 rounded-full overflow-hidden">
        <div
          className={`h-full ${status.bar} transition-all duration-1000`}
          style={{ width: `${Math.max(4, Math.min(100, remainingRatio * 100))}%` }}
        />
      </div>
    </div>
  );
};
