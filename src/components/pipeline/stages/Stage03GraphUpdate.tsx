import React from 'react';
import { useCase } from '../../../context/CaseContext';
import { SAMPLE_GRAPH_DATA } from '../../../data/sampleData';
import { Share2, AlertTriangle, ShieldCheck, Activity, Network } from 'lucide-react';

export const Stage03GraphUpdate: React.FC = () => {
  const { activeComplaint } = useCase();
  const graphData = SAMPLE_GRAPH_DATA[activeComplaint.id] || SAMPLE_GRAPH_DATA['NCRP-2026-0417392'];

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-750">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 uppercase">
            Stage 03: Dynamic Graph Neural Network & Mule Nexus Correlation (NetworkX)
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
          {graphData.nodes.length} Vertices · {graphData.edges.length} Directed Edges
        </span>
      </div>

      {/* Fraud Ring Alert Banner if detected */}
      {activeComplaint.is_adversarial_split ? (
        <div className="p-2.5 rounded bg-rose-950/80 border-2 border-rose-500/80 text-rose-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              ⚠️ ADVERSARIAL MULTI-ATM SPLIT SYNDICATE DETECTED: 4 parallel micro-withdrawals (&lt;₹50k) correlated back to single mule coordinator handle!
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900 text-rose-100 font-black">
            HIGH ANOMALY SCORE (0.98)
          </span>
        </div>
      ) : (
        <div className="p-2.5 rounded bg-amber-950/70 border border-amber-500/60 text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              ⚠️ CONNECTED TO KNOWN FRAUD RING: UPI handle '{activeComplaint.extracted_entities.upi_id}' linked to {graphData.reputation.linked_cases_count} prior NCRP cases!
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900 text-amber-200 font-bold">
            Centrality: {graphData.reputation.score}/100
          </span>
        </div>
      )}

      {/* Graph Visual Canvas Simulation */}
      <div className="grid grid-cols-3 gap-3">
        {/* Node Relationship Map */}
        <div className="col-span-2 p-3 rounded bg-navy-900/90 border border-navy-750 relative h-64 overflow-hidden">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Graph Topology Visualization (Force-Directed)</span>
            <span className="text-cyan-400">Live Vertex Insertion</span>
          </div>

          {/* Abstract Graph Simulation */}
          <div className="relative w-full h-52 bg-navy-950 rounded border border-navy-800 p-4 flex items-center justify-center">
            {/* Center Mule Node */}
            <div className="absolute z-20 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-rose-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-xs animate-pulse glow-red">
                MULE
              </div>
              <span className="mt-1 text-[9px] font-bold text-rose-300 bg-navy-900/90 px-1 rounded border border-rose-500/40">
                {activeComplaint.extracted_entities.upi_id.split('@')[0]}
              </span>
            </div>

            {/* Orbiting Satellite Nodes */}
            {graphData.nodes.slice(0, 6).map((node, i) => {
              const angle = (i * (360 / 6)) * (Math.PI / 180);
              const top = 50 + Math.sin(angle) * 36;
              const left = 50 + Math.cos(angle) * 38;

              return (
                <div
                  key={node.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700"
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border shadow-lg ${
                      node.type === 'victim'
                        ? 'bg-amber-500 text-navy-950 border-amber-300'
                        : node.type === 'atm'
                        ? 'bg-cyan-500 text-navy-950 border-cyan-300'
                        : 'bg-navy-800 text-slate-300 border-slate-600'
                    }`}
                  >
                    {node.type === 'victim' ? 'VIC' : node.type === 'atm' ? 'ATM' : 'SYS'}
                  </div>
                  <span className="text-[8px] text-slate-300 mt-0.5 max-w-20 truncate bg-navy-900 px-1 rounded">
                    {node.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}

            {/* Connecting SVG Edges */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-40">
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
              <line x1="50%" y1="50%" x2="85%" y2="70%" stroke="#22d3ee" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="15%" y2="70%" stroke="#22d3ee" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#f59e0b" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Reputation Card */}
        <div className="p-3 rounded bg-navy-900/90 border border-navy-750 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">
              Mule Reputation & Centrality
            </div>
            <div className="p-2 rounded bg-navy-950 border border-navy-800 text-center">
              <div className="text-2xl font-black text-rose-400 font-mono">
                {graphData.reputation.score}
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-rose-300 mt-0.5">
                {graphData.reputation.risk_level} RISK LEVEL
              </div>
            </div>

            <div className="mt-2 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Graph Out-Degree:</span>
                <span className="font-bold text-slate-200">{graphData.reputation.out_degree}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Linked Prior Cases:</span>
                <span className="font-bold text-cyan-300">{graphData.reputation.linked_cases_count}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tx Velocity:</span>
                <span className="font-bold text-amber-300">{graphData.reputation.velocity_tx_per_hour} tx/hr</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-navy-800 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Eligible for Injunction Freeze</span>
          </div>
        </div>
      </div>
    </div>
  );
};
