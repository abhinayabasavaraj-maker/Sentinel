import React from 'react';
import { useCase } from '../../context/CaseContext';
import { CheckCircle2, AlertCircle, Info, X, ShieldCheck } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCase();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-14 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const borderColors = {
          info: 'border-cyan-500/50 bg-navy-900/95 text-cyan-200',
          success: 'border-emerald-500/50 bg-navy-900/95 text-emerald-200',
          warning: 'border-amber-500/50 bg-navy-900/95 text-amber-200',
          alert: 'border-rose-500/60 bg-navy-900/95 text-rose-200',
        };

        const icons = {
          info: <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />,
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
          alert: <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-lg border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in ${borderColors[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-xs">
              <div className="font-semibold font-mono tracking-wide text-slate-100">{toast.title}</div>
              <div className="text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
