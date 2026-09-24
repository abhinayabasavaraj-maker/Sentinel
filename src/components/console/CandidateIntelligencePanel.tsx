import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { AtmCandidate } from '../../types';
import { GoldenHourWidget } from '../common/GoldenHourWidget';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { formatDistance } from '../../utils/formatters';
import { 
  Compass, 
  MapPin, 
  Share2, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight, 
  Send, 
  Check, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const CandidateIntelligencePanel: React.FC = () => {
  const { candidates, topPriorityCandidate, showToast, recordOfficerFeedback } = useCase();
  const [sortBy, setSortBy] = useState<'score' | 'distance' | 'time'>('score');
  const [selectedCandidate, setSelectedCandidate] = useState<AtmCandidate | null>(null);

  // Sorting
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === 'distance') return a.distance_m - b.distance_m;
    if (sortBy === 'time') return a.predicted_cashout_mins - b.predicted_cashout_mins;
    return b.composite_score - a.composite_score;
  });

  const heroCandidate = topPriorityCandidate || sortedCandidates[0];
  const listCandidates = sortedCandidates.slice(1);

  const handleSimulateHandoff = (candidate: AtmCandidate) => {
    showToast(
      'Cross-Jurisdiction Alert Routed',
      `Target ATM: ${candidate.id} (${candidate.name}) -> Dispatched to ${candidate.jurisdiction.nearest_ps}, ${candidate.jurisdiction.state} (Hotline: ${candidate.jurisdiction.cell_hotline})`,
      'success'
    );
  };

  return (
    <div className="w-96 flex flex-col bg-navy-950 border-l border-navy-750 h-full overflow-hidden select-none">
      {/* Header */}
      <div className="p-3 bg-navy-900/90 border-b border-navy-750 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Candidate Intelligence</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-navy-800 text-cyan-300 border border-navy-700">
            {candidates.length} Scored
          </span>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-800 text-[11px] font-mono">
          <span className="text-slate-400">Sort By:</span>
          <div className="flex gap-1">
            {[
              { id: 'score', label: 'Composite Score' },
              { id: 'distance', label: 'Distance' },
              { id: 'time', label: 'Window' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSortBy(item.id as any)}
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider transition-colors ${
                  sortBy === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Golden Hour Countdown Widget */}
        <GoldenHourWidget />

        {/* Hero Card: #1 Top Priority */}
        {heroCandidate && (
          <div className="p-3 rounded-lg bg-navy-900 border-2 border-cyan-500/60 shadow-xl shadow-cyan-950/40 glow-cyan relative overflow-hidden">
            {/* Top ribbon */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan-300">
                  #1 Top Interdiction Priority
                </span>
              </div>
              <ConfidenceBadge tier={heroCandidate.confidence_tier} />
            </div>

            {/* ATM Title & Score */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-mono font-bold text-sm text-slate-100 leading-tight">
                  {heroCandidate.id} · {heroCandidate.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {heroCandidate.address}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-xl font-black text-cyan-300">
                  {heroCandidate.composite_score.toFixed(2)}
                </div>
                <div className="text-[9px] font-mono text-slate-400 uppercase">Score</div>
              </div>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-navy-750 font-mono text-[10px]">
              <div className="bg-navy-950/80 p-1 rounded border border-navy-800">
                <div className="text-slate-400">Cash-Out Window</div>
                <div className="font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {heroCandidate.predicted_cashout_mins} mins
                </div>
              </div>
              <div className="bg-navy-950/80 p-1 rounded border border-navy-800">
                <div className="text-slate-400">Distance</div>
                <div className="font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {formatDistance(heroCandidate.distance_m)}
                </div>
              </div>
              <div className="bg-navy-950/80 p-1 rounded border border-navy-800">
                <div className="text-slate-400">Matched Age</div>
                <div className="font-bold text-slate-200 mt-0.5">
                  {heroCandidate.matched_age_hours}h ago
                </div>
              </div>
            </div>

            {/* SHAP Key Reasons preview */}
            <div className="mt-2 text-[10px] font-mono space-y-0.5">
              {heroCandidate.shap_reasons.slice(0, 2).map((reason, idx) => (
                <div key={idx} className="text-slate-300 flex items-center gap-1">
                  <span className="text-cyan-400">▸</span> {reason}
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-3 pt-2 border-t border-navy-750 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSimulateHandoff(heroCandidate)}
                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Handoff</span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => recordOfficerFeedback(heroCandidate.id, 'CONFIRM')}
                  title="Confirm as valid cashout target"
                  className="p-1.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => recordOfficerFeedback(heroCandidate.id, 'REJECT')}
                  title="Reject prediction for ML retraining"
                  className="px-2 py-1 rounded bg-navy-800 text-rose-300 border border-navy-700 hover:bg-navy-750 font-mono text-[10px]"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ranked Candidate List (#2 - #10) */}
        <div className="space-y-2">
          {listCandidates.map((candidate, idx) => {
            const rank = idx + 2;
            return (
              <div
                key={candidate.id}
                className="p-2.5 rounded bg-navy-900/90 border border-navy-750 hover:border-cyan-500/40 transition-all text-xs group relative overflow-hidden"
              >
                {/* Header Line */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-400 text-xs">
                      #{rank}
                    </span>
                    <span className="font-mono font-bold text-slate-200 group-hover:text-cyan-200">
                      {candidate.id} · {candidate.name.split(' ')[0]} {candidate.name.split(' ')[1]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ConfidenceBadge tier={candidate.confidence_tier} />
                    <span className="font-mono font-black text-sm text-cyan-300">
                      {candidate.composite_score.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 4 Thin Segmented Progress Bars (Spatial, Temporal, Financial, Graph) */}
                <div className="grid grid-cols-4 gap-1.5 mt-2 font-mono text-[9px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Spt</span>
                      <span className="text-cyan-300 font-semibold">{candidate.scores.spatial}</span>
                    </div>
                    <div className="w-full bg-navy-950 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${candidate.scores.spatial * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Tmp</span>
                      <span className="text-amber-300 font-semibold">{candidate.scores.temporal}</span>
                    </div>
                    <div className="w-full bg-navy-950 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${candidate.scores.temporal * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Fin</span>
                      <span className="text-emerald-300 font-semibold">{candidate.scores.financial}</span>
                    </div>
                    <div className="w-full bg-navy-950 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${candidate.scores.financial * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Grp</span>
                      <span className="text-rose-300 font-semibold">{candidate.scores.graph}</span>
                    </div>
                    <div className="w-full bg-navy-950 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400"
                        style={{ width: `${candidate.scores.graph * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Row & Hover Handoff Trigger */}
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-navy-800 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Dist: {formatDistance(candidate.distance_m)}</span>
                    <span>·</span>
                    <span>Window: {candidate.predicted_cashout_mins}m</span>
                  </div>
                  <button
                    onClick={() => handleSimulateHandoff(candidate)}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200 font-bold transition-opacity"
                  >
                    <span>Handoff</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer Strip */}
      <div className="p-2.5 bg-navy-950 border-t border-navy-750 text-[10px] text-slate-400 font-mono text-center shrink-0">
        <span className="text-amber-400/80 font-bold">*</span> Prediction indicates investigative priority for interception/freeze action, not proven legal culpability.
      </div>
    </div>
  );
};
