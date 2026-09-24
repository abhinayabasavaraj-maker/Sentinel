import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { GitBranch, ShieldAlert, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

export const Stage06ThresholdRouter: React.FC = () => {
  const { topPriorityCandidate } = useCase();
  const score = topPriorityCandidate?.composite_score || 0.87;

  const isAutoAlert = score >= 0.85;
  const isReview = score >= 0.60 && score < 0.85;
  const isLogOnly = score < 0.60;

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 06: Confidence-Tiered Threshold Router
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
          Score: {(score * 100).toFixed(1)}% → AUTO-ROUTED
        </span>
      </div>

      {/* 3-Lane Routing Visualizer */}
      <div className="grid grid-cols-3 gap-3">
        {/* Lane 1: Auto-Alert (>85%) */}
        <div
          className={`p-3 rounded-lg border transition-all ${
            isAutoAlert
              ? 'bg-emerald-950/60 border-2 border-emerald-500/80 shadow-lg glow-cyan scale-105'
              : 'bg-navy-900/60 border-navy-800 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400">
              LANE 1: AUTO-ALERT
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200">
              &gt; 85% Score
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Proactive Intercept Trigger</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            Directly dispatches emergency SMS alert to nearest PCR vehicle and initiates bank freeze API recommendation without human latency.
          </div>
          {isAutoAlert && (
            <div className="mt-3 pt-2 border-t border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ENGAGED (Confidence {(score * 100).toFixed(0)}%)</span>
            </div>
          )}
        </div>

        {/* Lane 2: Analyst Review (60-85%) */}
        <div
          className={`p-3 rounded-lg border transition-all ${
            isReview
              ? 'bg-amber-950/60 border-2 border-amber-500/80 shadow-lg scale-105'
              : 'bg-navy-900/60 border-navy-800 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-amber-400">
              LANE 2: ANALYST REVIEW
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-900 text-amber-200">
              60% - 85% Score
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Priority Triage Queue</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            Routes to Cyber Cell investigator dashboard for 2-minute review with 1-click override dispatch.
          </div>
          {isReview && (
            <div className="mt-3 pt-2 border-t border-amber-500/40 text-[10px] font-bold text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ENGAGED</span>
            </div>
          )}
        </div>

        {/* Lane 3: Log-Only (<60%) */}
        <div
          className={`p-3 rounded-lg border transition-all ${
            isLogOnly
              ? 'bg-slate-900/80 border-2 border-slate-500 shadow-lg scale-105'
              : 'bg-navy-900/60 border-navy-800 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              LANE 3: LOG & MONITOR
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-navy-950 text-slate-400">
              &lt; 60% Score
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100">Historical Intelligence Log</div>
          <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            Logged into national database for offline graph enrichment; no immediate active interception.
          </div>
          {isLogOnly && (
            <div className="mt-3 pt-2 border-t border-slate-700 text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>ENGAGED</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
