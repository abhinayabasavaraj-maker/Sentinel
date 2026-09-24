import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { ShieldAlert, Navigation, ArrowUpRight, CheckCircle2, UserCheck, AlertOctagon } from 'lucide-react';

export const Stage09LEAConsumption: React.FC = () => {
  const { activeComplaint, topPriorityCandidate, showToast, setActiveTab } = useCase();

  const handleDispatch = () => {
    showToast(
      'Field Patrol Dispatched',
      `Patrol Vehicle Delta-04 routed to ${topPriorityCandidate?.name || 'Connaught Place'} (ETA: 4 minutes). Interdiction in progress.`,
      'success'
    );
  };

  const handleEscalate = () => {
    showToast(
      'Case Escalated to State Cyber Crime Bureau',
      `Dossier ${activeComplaint.id} escalated to SP Cyber Crime with Top-1 priority intercept flag.`,
      'warning'
    );
  };

  const handleClose = () => {
    showToast(
      'Case Alert Marked for Archival',
      `Investigation marked as active field intercept. Provenance block sealed.`,
      'info'
    );
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 09: Law Enforcement Officer Tactical Decision Console
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
          INTELLIGENCE READY
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Tactical Summary */}
        <div className="col-span-2 p-3 rounded bg-navy-900/90 border border-navy-750 space-y-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Investigator Operational Action Recommendation
          </div>
          <div className="p-2.5 rounded bg-navy-950 border border-navy-800 text-slate-200 leading-relaxed font-sans text-xs">
            High-confidence prediction ({((topPriorityCandidate?.composite_score || 0.87) * 100).toFixed(0)}%) targets ATM terminal <strong className="text-cyan-300">{topPriorityCandidate?.name}</strong> within {topPriorityCandidate?.predicted_cashout_mins} minutes. Recommended action is immediate physical dispatch of nearest patrol squad coupled with automated freeze recommendation.
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('investigation')}
              className="flex-1 py-1.5 px-2 rounded bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-navy-700 font-mono text-xs text-center transition-colors"
            >
              Open Live Risk Map
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className="flex-1 py-1.5 px-2 rounded bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-navy-700 font-mono text-xs text-center transition-colors"
            >
              Inspect Criminal Graph
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className="flex-1 py-1.5 px-2 rounded bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-navy-700 font-mono text-xs text-center transition-colors"
            >
              Generate Case Report
            </button>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="p-3 rounded bg-navy-900/90 border border-navy-750 flex flex-col justify-between gap-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Execute Interdiction
          </div>

          <button
            onClick={handleDispatch}
            className="w-full py-2 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Dispatch Squad</span>
          </button>

          <button
            onClick={handleEscalate}
            className="w-full py-1.5 px-3 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Escalate To SP Cyber
          </button>

          <button
            onClick={handleClose}
            className="w-full py-1 px-3 rounded bg-navy-800 hover:bg-navy-750 text-slate-400 border border-navy-700 font-mono text-[10px] uppercase transition-colors"
          >
            Mark For Archive
          </button>
        </div>
      </div>
    </div>
  );
};
