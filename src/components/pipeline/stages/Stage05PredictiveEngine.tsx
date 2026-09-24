import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { ConfidenceBadge } from '../../common/ConfidenceBadge';
import { Cpu, TrendingUp, Sparkles } from 'lucide-react';

export const Stage05PredictiveEngine: React.FC = () => {
  const { candidates } = useCase();

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 05: XGBoost Predictive Inference & SHAP Explainability Engine
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
          Calibrated AUC: 0.942
        </span>
      </div>

      {/* Candidate Score Horizontal Bar Race */}
      <div className="p-3 rounded bg-navy-900/90 border border-navy-750 space-y-2">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>ATM Candidate Ranking Distribution (Top 5)</span>
          <span className="text-cyan-400 font-bold">Rank Order Settled</span>
        </div>

        {candidates.slice(0, 5).map((atm, idx) => {
          const rank = idx + 1;
          return (
            <div key={atm.id} className="p-2 rounded bg-navy-950/80 border border-navy-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">#{rank}</span>
                  <span className="font-bold text-slate-200">{atm.id} · {atm.name}</span>
                  <ConfidenceBadge tier={atm.confidence_tier} />
                </div>
                <span className="font-bold text-sm text-cyan-300">
                  {(atm.composite_score * 100).toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    rank === 1 ? 'bg-cyan-400' : rank === 2 ? 'bg-emerald-400' : 'bg-slate-400'
                  }`}
                  style={{ width: `${atm.composite_score * 100}%` }}
                />
              </div>

              {/* Plain-Language SHAP Explainability Reason Strings */}
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-slate-300">SHAP Attributions:</strong> {atm.shap_reasons.join(' · ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
