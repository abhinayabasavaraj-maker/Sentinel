import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { 
  Sliders, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Check, 
  X, 
  RefreshCw,
  GitCompare,
  Database
} from 'lucide-react';

export const ModelExplainabilityTab: React.FC = () => {
  const { 
    weights, 
    setWeights, 
    resetWeights, 
    topPriorityCandidate, 
    candidates,
    retrainingQueueCount,
    officerFeedbackLogs,
    recordOfficerFeedback
  } = useCase();

  const [ablatedFeatures, setAblatedFeatures] = useState<Record<string, boolean>>({
    spatial: false,
    temporal: false,
    financial: false,
    fraud_dna: false,
    graph: false,
  });

  const toggleAblation = (feature: string) => {
    setAblatedFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const activeAtm = topPriorityCandidate || candidates[0];

  // Feature contribution breakdown (SHAP values)
  const shapFeatures = [
    { name: 'Spatial Proximity to Victim & Transit Hub', value: '+0.28', raw: activeAtm?.scores.spatial || 0.94, desc: 'Proximity inside 500m radius of initial scam origin' },
    { name: 'Mule Node / BTS Cell Tower Co-location', value: '+0.24', raw: activeAtm?.scores.graph || 0.91, desc: 'Simultaneous IMEI/BTS ping detected in terminal sector' },
    { name: 'Historical Modus Operandi Matching', value: '+0.19', raw: activeAtm?.scores.fraud_dna || 0.79, desc: '91% similarity with previous syndicate dropzone tactics' },
    { name: 'Temporal Transit Window Optimization', value: '+0.16', raw: activeAtm?.scores.temporal || 0.88, desc: 'Evening peak liquidity and low patrol density slot' },
  ];

  return (
    <div className="flex-1 h-full flex flex-col bg-navy-950 p-4 space-y-3 overflow-y-auto select-none font-mono text-xs">
      {/* Top Header */}
      <div className="p-3 rounded-lg bg-navy-900 border border-navy-750 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              Model Calibration, SHAP Explainability & Feature Ablation Studio
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              XGBoost Gradient Boosted Classifier (Tree depth = 6 · Learning Rate = 0.05 · Calibration = Isotonic)
            </div>
          </div>
        </div>

        {/* Retraining Queue Badge */}
        <div className="flex items-center gap-2 bg-navy-950 px-3 py-1 rounded border border-navy-750">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] text-slate-400 uppercase">ML Retraining Queue:</span>
          <span className="font-bold text-emerald-300 text-xs">{retrainingQueueCount} Samples Logged</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 flex-1">
        {/* Left 2 Columns: SHAP Feature Importance & Ablation Simulator */}
        <div className="col-span-2 space-y-3">
          {/* SHAP Waterfall Breakdown */}
          <div className="p-3 rounded-lg bg-navy-900/90 border border-navy-750 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-navy-800">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>SHAP Feature Contribution Waterfall ({activeAtm?.id})</span>
              </div>
              <ConfidenceBadge tier={activeAtm?.confidence_tier || 'HIGH'} score={activeAtm?.composite_score} />
            </div>

            <div className="space-y-2 pt-1">
              {shapFeatures.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-navy-950/80 border border-navy-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-bold text-[11px]">{item.name}</span>
                    <span className="text-emerald-400 font-black text-xs">{item.value} SHAP</span>
                  </div>
                  <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${item.raw * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Ablation Studio */}
          <div className="p-3 rounded-lg bg-navy-900/90 border border-navy-750 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-navy-800">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 uppercase">
                <GitCompare className="w-3.5 h-3.5 text-amber-400" />
                <span>Feature Ablation Simulation (Impact of Zeroing Signals)</span>
              </div>
              <span className="text-[10px] text-slate-400">Click to ablate feature</span>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {[
                { id: 'spatial', label: 'Spatial', base: weights.spatial, scoreDelta: '-0.26' },
                { id: 'temporal', label: 'Temporal', base: weights.temporal, scoreDelta: '-0.17' },
                { id: 'financial', label: 'Financial', base: weights.financial, scoreDelta: '-0.14' },
                { id: 'fraud_dna', label: 'Fraud DNA', base: weights.fraud_dna, scoreDelta: '-0.15' },
                { id: 'graph', label: 'Graph', base: weights.graph, scoreDelta: '-0.20' },
              ].map(feat => {
                const isAblated = ablatedFeatures[feat.id];
                return (
                  <button
                    key={feat.id}
                    onClick={() => toggleAblation(feat.id)}
                    className={`p-2 rounded border text-left transition-all ${
                      isAblated
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 line-through'
                        : 'bg-navy-950 border-navy-800 text-slate-200 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold">{feat.label}</div>
                    <div className="text-xs font-bold text-cyan-300 mt-1">
                      {isAblated ? 'ABLATED (0.00)' : `w = ${feat.base.toFixed(2)}`}
                    </div>
                    <div className="text-[9px] text-rose-400 mt-0.5">
                      Delta: {feat.scoreDelta}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Confidence Tier Calibration & Officer Feedback Queue */}
        <div className="p-3 rounded-lg bg-navy-900/90 border border-navy-750 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">
              Confidence Tier Calibration Thresholds
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded bg-emerald-950/50 border border-emerald-500/40">
                <div className="flex justify-between text-emerald-300 font-bold">
                  <span>High Confidence</span>
                  <span>&gt; 0.85 (85%)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Action: Automated PCR Intercept & CBS Freeze Injunction
                </div>
              </div>

              <div className="p-2 rounded bg-amber-950/50 border border-amber-500/40">
                <div className="flex justify-between text-amber-300 font-bold">
                  <span>Medium Confidence</span>
                  <span>0.60 – 0.85 (60-85%)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Action: Analyst Triage & Secondary Validation
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-700">
                <div className="flex justify-between text-slate-400 font-bold">
                  <span>Low Confidence</span>
                  <span>&lt; 0.60 (&lt;60%)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Action: Historical Log Only
                </div>
              </div>
            </div>

            {/* Officer Feedback Ground-Truth Logging */}
            <div className="mt-4 pt-3 border-t border-navy-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Officer Ground-Truth Feedback Loop</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <div className="text-[10px] text-slate-400 mb-2">
                Log whether active prediction #{activeAtm?.id} corresponds to verified cash-out interception in the field.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => recordOfficerFeedback(activeAtm?.id || 'ATM_014', 'CONFIRM')}
                  className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Target</span>
                </button>
                <button
                  onClick={() => recordOfficerFeedback(activeAtm?.id || 'ATM_014', 'REJECT')}
                  className="flex-1 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject Target</span>
                </button>
              </div>
            </div>
          </div>

          {/* Officer Feedback Log Snippet */}
          <div className="pt-2 border-t border-navy-800 text-[10px] text-slate-400">
            <div>Recent Officer Verifications:</div>
            <div className="max-h-24 overflow-y-auto space-y-1 mt-1 font-mono">
              {officerFeedbackLogs.length === 0 ? (
                <div className="text-slate-600 italic">No feedback entries recorded in current session.</div>
              ) : (
                officerFeedbackLogs.map((log, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span>{log.candidateId} [{log.timestamp}]</span>
                    <span className={log.action === 'CONFIRM' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {log.action}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
