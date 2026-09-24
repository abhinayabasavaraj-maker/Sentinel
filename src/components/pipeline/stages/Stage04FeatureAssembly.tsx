import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

export const Stage04FeatureAssembly: React.FC = () => {
  const { weights, topPriorityCandidate } = useCase();
  const scores = topPriorityCandidate?.scores || {
    spatial: 0.94,
    temporal: 0.88,
    financial: 0.82,
    fraud_dna: 0.79,
    graph: 0.91,
  };

  const featureGroups = [
    { name: 'Spatial Proximity (Spt)', weight: weights.spatial, raw: scores.spatial, color: 'text-cyan-400', bar: 'bg-cyan-400' },
    { name: 'Temporal Transit (Tmp)', weight: weights.temporal, raw: scores.temporal, color: 'text-amber-400', bar: 'bg-amber-400' },
    { name: 'Financial Route (Fin)', weight: weights.financial, raw: scores.financial, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { name: 'Fraud DNA Mo (DNA)', weight: weights.fraud_dna, raw: scores.fraud_dna, color: 'text-purple-400', bar: 'bg-purple-400' },
    { name: 'Graph Centrality (Grp)', weight: weights.graph, raw: scores.graph, color: 'text-rose-400', bar: 'bg-rose-400' },
  ];

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 04: Multi-Modal Feature Vector Assembly & Normalization
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
          Σ Weights = 1.0000
        </span>
      </div>

      {/* Assembly Formula */}
      <div className="p-3 rounded bg-navy-900 border border-navy-750 font-mono text-xs">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
          Dynamic Mathematical Feature Vector Computation:
        </div>
        <div className="p-2 rounded bg-navy-950 border border-navy-800 text-cyan-300 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span>Risk(ATM) =</span>
          <span>({weights.spatial.toFixed(2)} × {scores.spatial.toFixed(2)}) +</span>
          <span>({weights.temporal.toFixed(2)} × {scores.temporal.toFixed(2)}) +</span>
          <span>({weights.financial.toFixed(2)} × {scores.financial.toFixed(2)}) +</span>
          <span>({weights.fraud_dna.toFixed(2)} × {scores.fraud_dna.toFixed(2)}) +</span>
          <span>({weights.graph.toFixed(2)} × {scores.graph.toFixed(2)})</span>
        </div>
      </div>

      {/* 5 Feature Groups Detailed Grid */}
      <div className="grid grid-cols-5 gap-2">
        {featureGroups.map((group, idx) => (
          <div key={idx} className="p-2.5 rounded bg-navy-900/90 border border-navy-750 font-mono text-[11px]">
            <div className="text-[10px] text-slate-400 truncate">{group.name}</div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-slate-400 text-[10px]">Value:</span>
              <span className={`font-bold ${group.color}`}>{group.raw.toFixed(2)}</span>
            </div>
            <div className="flex items-baseline justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Weight:</span>
              <span className="text-slate-300">{group.weight.toFixed(2)}</span>
            </div>
            <div className="w-full bg-navy-950 h-1.5 rounded-full overflow-hidden mt-2">
              <div className={`h-full ${group.bar}`} style={{ width: `${group.raw * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
