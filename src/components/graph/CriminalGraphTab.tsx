import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { SAMPLE_GRAPH_DATA } from '../../data/sampleData';
import { GraphNode } from '../../types';
import { 
  Share2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Network, 
  Maximize2, 
  RefreshCw,
  Search
} from 'lucide-react';

export const CriminalGraphTab: React.FC = () => {
  const { activeComplaint, showToast, setActiveTab } = useCase();
  const graphData = SAMPLE_GRAPH_DATA[activeComplaint.id] || SAMPLE_GRAPH_DATA['NCRP-2026-0417392'];
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(graphData.nodes[1] || graphData.nodes[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const reputation = graphData.reputation;

  const handleFreezeMule = () => {
    showToast(
      'Mule Freeze Recommendation Transmitted',
      `Injunction drafted for ${reputation.account_or_upi}. Sent to Core Banking System & CFCFRMS.`,
      'success'
    );
  };

  const filteredNodes = graphData.nodes.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'mule') return n.type === 'mule_account' || n.type === 'upi';
    if (filterType === 'atm') return n.type === 'atm';
    if (filterType === 'victim') return n.type === 'victim';
    return true;
  });

  return (
    <div className="flex-1 h-full flex flex-col bg-navy-950 p-4 space-y-3 overflow-y-auto select-none font-mono text-xs">
      {/* Top Header */}
      <div className="p-3 rounded-lg bg-navy-900 border border-navy-750 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="font-bold text-sm text-slate-100 uppercase tracking-wide">
              Mule Syndicate Criminal Relationship Graph (NetworkX Topology)
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              Active Case: {activeComplaint.id} · Connected to {graphData.nodes.length} Vertices across {graphData.edges.length} Financial & Communication Links
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-navy-950 p-1 rounded border border-navy-800">
          <span className="text-[10px] text-slate-400 px-1 uppercase">Filter:</span>
          {['all', 'mule', 'atm', 'victim'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider transition-colors ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Body */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        {/* Left 2 Columns: Interactive Graph Canvas */}
        <div className="col-span-2 p-3 rounded-lg bg-navy-900/90 border border-navy-750 flex flex-col relative min-h-96">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800 text-[11px]">
            <span className="text-slate-400 uppercase tracking-wider">
              Force-Directed Layout Canvas (Click node to inspect)
            </span>
            <span className="text-cyan-400">Physics Stabilization: 100%</span>
          </div>

          {/* Interactive Graph Canvas Area */}
          <div className="relative flex-1 bg-navy-950 rounded-lg border border-navy-800 p-6 flex items-center justify-center overflow-hidden my-2">
            {/* SVG Connecting Lines */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              {graphData.edges.map(edge => {
                const srcIdx = graphData.nodes.findIndex(n => n.id === edge.source);
                const tgtIdx = graphData.nodes.findIndex(n => n.id === edge.target);

                // Coordinates
                const srcAngle = (srcIdx * (360 / graphData.nodes.length)) * (Math.PI / 180);
                const tgtAngle = (tgtIdx * (360 / graphData.nodes.length)) * (Math.PI / 180);

                const x1 = 50 + (srcIdx === 1 ? 0 : Math.cos(srcAngle) * 38);
                const y1 = 50 + (srcIdx === 1 ? 0 : Math.sin(srcAngle) * 36);
                const x2 = 50 + (tgtIdx === 1 ? 0 : Math.cos(tgtAngle) * 38);
                const y2 = 50 + (tgtIdx === 1 ? 0 : Math.sin(tgtAngle) * 36);

                return (
                  <g key={edge.id}>
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={edge.is_ring_link ? '#ef4444' : '#22d3ee'}
                      strokeWidth={edge.is_ring_link ? 2.5 : 1.5}
                      strokeDasharray={edge.is_ring_link ? '4,4' : undefined}
                      strokeOpacity={0.6}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            {filteredNodes.map((node, idx) => {
              const angle = (idx * (360 / filteredNodes.length)) * (Math.PI / 180);
              const isCenter = node.id === 'u1' || node.id === 'ring';
              const top = isCenter ? 50 : 50 + Math.sin(angle) * 36;
              const left = isCenter ? 50 : 50 + Math.cos(angle) * 38;

              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 flex flex-col items-center group ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                  }`}
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-2xl transition-all ${
                      isSelected ? 'ring-4 ring-cyan-400' : ''
                    } ${
                      node.type === 'victim'
                        ? 'bg-amber-500 text-navy-950 border-amber-300'
                        : node.type === 'upi' || node.type === 'mule_account'
                        ? 'bg-rose-600 text-white border-rose-300 animate-pulse glow-red'
                        : node.type === 'atm'
                        ? 'bg-cyan-500 text-navy-950 border-cyan-300'
                        : node.type === 'fraud_ring'
                        ? 'bg-purple-700 text-white border-purple-300'
                        : 'bg-navy-800 text-slate-300 border-slate-600'
                    }`}
                  >
                    {node.type === 'victim'
                      ? 'VIC'
                      : node.type === 'upi'
                      ? 'UPI'
                      : node.type === 'mule_account'
                      ? 'MULE'
                      : node.type === 'atm'
                      ? 'ATM'
                      : 'NODE'}
                  </div>
                  <span
                    className={`mt-1 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap shadow-md ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-200 border border-cyan-400 font-bold'
                        : 'bg-navy-900/90 text-slate-300 border border-navy-700'
                    }`}
                  >
                    {node.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Canvas Legend */}
          <div className="flex items-center justify-between pt-2 border-t border-navy-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Victim Node
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Mule Account / UPI
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> ATM Target Terminal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Syndicate Core
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Mule-Account Reputation Score (0-100) & Reasons Checklist */}
        <div className="p-3 rounded-lg bg-navy-900/90 border border-navy-750 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Mule Account Risk Reputation</span>
              <span className="text-rose-400 font-bold">NetworkX GNN Engine</span>
            </div>

            {/* Score Big Meter */}
            <div className="p-3 rounded bg-navy-950 border border-rose-500/40 text-center space-y-1">
              <div className="text-3xl font-black text-rose-400 font-mono">
                {reputation.score}
                <span className="text-sm text-slate-500 font-normal"> / 100</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                CRITICAL MULE RISK ({reputation.risk_level})
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {reputation.account_or_upi}
              </div>
            </div>

            {/* Expandable Reasons Checklist */}
            <div className="mt-3 space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Graph Centrality Risk Factors Checklist:
              </div>

              {reputation.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border flex items-start justify-between gap-2 text-[10px] ${
                    reason.passed
                      ? 'bg-navy-950 border-rose-500/40 text-slate-200'
                      : 'bg-navy-950/40 border-navy-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    {reason.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{reason.text}</span>
                  </div>
                  <span className={`font-bold shrink-0 ${reason.passed ? 'text-rose-400' : 'text-slate-600'}`}>
                    {reason.impact}
                  </span>
                </div>
              ))}
            </div>

            {/* Graph Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
              <div className="p-2 rounded bg-navy-950 border border-navy-800">
                <span className="text-slate-500 block">GRAPH OUT-DEGREE</span>
                <span className="text-sm font-bold text-slate-200">{reputation.out_degree}</span>
              </div>
              <div className="p-2 rounded bg-navy-950 border border-navy-800">
                <span className="text-slate-500 block">LINKED PRIOR CASES</span>
                <span className="text-sm font-bold text-cyan-300">{reputation.linked_cases_count}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-navy-800">
            <button
              onClick={handleFreezeMule}
              className="w-full py-2 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5 glow-red"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Simulate Mule Injunction Freeze</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
