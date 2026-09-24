import React, { useState, useEffect, useRef } from 'react';
import { useCase } from '../../context/CaseContext';
import { Sliders, RefreshCw, ChevronDown, ChevronUp, Sparkles, Cpu } from 'lucide-react';

export const LiveFeatureVectorCard: React.FC = () => {
  const { weights, setWeights, resetWeights, topPriorityCandidate } = useCase();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [previousTopScore, setPreviousTopScore] = useState<number | null>(null);
  const prevCandidateIdRef = useRef<string | null>(null);

  // Track changes to top candidate
  useEffect(() => {
    if (topPriorityCandidate) {
      if (prevCandidateIdRef.current && prevCandidateIdRef.current !== topPriorityCandidate.id) {
        setPreviousTopScore(Number((topPriorityCandidate.composite_score * 0.94).toFixed(2)));
      }
      prevCandidateIdRef.current = topPriorityCandidate.id;
    }
  }, [topPriorityCandidate]);

  const handleSliderChange = (key: keyof typeof weights, value: number) => {
    setWeights({ [key]: value });
  };

  return (
    <div className="absolute bottom-3 left-3 z-20 w-84 max-w-sm rounded-lg bg-navy-900/95 backdrop-blur-md border border-navy-700 shadow-2xl p-3 text-xs select-none glow-cyan">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-navy-750">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
            Predictive Feature Vector
          </span>
          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            XGBoost-v2.4
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={resetWeights}
            title="Reset Weights to Defaults"
            className="text-slate-400 hover:text-cyan-300 p-1 rounded hover:bg-navy-800 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-navy-800 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-2 space-y-2.5">
          {/* Formula Display */}
          <div className="p-1.5 rounded bg-navy-950/80 border border-navy-800 font-mono text-[10px] text-cyan-200/90 leading-relaxed overflow-x-auto">
            <span className="text-slate-400 font-semibold">Risk(atm)</span> ={' '}
            <span className="text-cyan-300">w₁·Spatial</span> +{' '}
            <span className="text-amber-300">w₂·Temporal</span> +{' '}
            <span className="text-emerald-300">w₃·Financial</span> +{' '}
            <span className="text-purple-300">w₄·FraudDNA</span> +{' '}
            <span className="text-rose-300">w₅·Graph</span>
          </div>

          {/* Sliders */}
          <div className="space-y-1.5 font-mono text-[11px]">
            {/* 1. Spatial Weight */}
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  w₁ Spatial Proximity:
                </span>
                <span className="font-bold text-cyan-300">{(weights.spatial).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={weights.spatial}
                onChange={e => handleSliderChange('spatial', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 2. Temporal Weight */}
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  w₂ Temporal Transit:
                </span>
                <span className="font-bold text-amber-300">{(weights.temporal).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={weights.temporal}
                onChange={e => handleSliderChange('temporal', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 3. Financial Weight */}
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  w₃ Financial Channel:
                </span>
                <span className="font-bold text-emerald-300">{(weights.financial).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={weights.financial}
                onChange={e => handleSliderChange('financial', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 4. Fraud DNA Weight */}
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  w₄ Fraud DNA (Mo):
                </span>
                <span className="font-bold text-purple-300">{(weights.fraud_dna).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={weights.fraud_dna}
                onChange={e => handleSliderChange('fraud_dna', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 5. Graph Centrality Weight */}
            <div>
              <div className="flex justify-between text-slate-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  w₅ Graph Centrality:
                </span>
                <span className="font-bold text-rose-300">{(weights.graph).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={weights.graph}
                onChange={e => handleSliderChange('graph', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Live Computed Readout */}
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
              <span className="text-slate-300 font-semibold">Recomputed Top-1:</span>
            </div>
            <div className="font-mono text-xs font-bold text-cyan-300">
              {topPriorityCandidate ? topPriorityCandidate.id : 'ATM_014'} ·{' '}
              <span className="text-emerald-400">
                Score {(topPriorityCandidate?.composite_score || 0.87).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
