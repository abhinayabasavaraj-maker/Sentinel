import React, { useState, useRef, useEffect } from 'react';
import { useCase, TopTab } from '../../context/CaseContext';
import { 
  ShieldAlert, 
  ChevronDown, 
  Radio, 
  Share2, 
  FileText, 
  Layers, 
  Sliders, 
  Activity, 
  Download, 
  Cpu, 
  AlertOctagon,
  Flame
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeComplaint, 
    complaints, 
    setActiveComplaintId 
  } = useCase();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs: { id: TopTab; label: string; icon: React.ReactNode; variant?: 'normal' | 'orange' | 'green' }[] = [
    { id: 'investigation', label: 'Investigation Console', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'pipeline', label: 'Pipeline Flow', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'graph', label: 'Criminal Graph', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'model', label: 'Model & Explainability', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'report', label: 'Case Report', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'integration', label: 'I4C / CFCFRMS Integration', icon: <Cpu className="w-3.5 h-3.5" />, variant: 'orange' },
    { id: 'export', label: 'Export Dossier (PDF)', icon: <Download className="w-3.5 h-3.5" />, variant: 'green' },
    { id: 'provenance', label: 'Provenance', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="bg-navy-950 border-b border-navy-750 px-3 py-1.5 flex items-center justify-between select-none relative z-30">
      {/* Product Lockup */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative flex items-center justify-center w-8 h-8 rounded bg-navy-800 border border-cyan-500/40 text-cyan-400">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-black text-xs tracking-wider text-slate-100 flex items-center gap-1">
              SENTINEL <span className="text-cyan-400">I4C</span>
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-navy-800 text-cyan-300 border border-cyan-500/30">
              PS 26184
            </span>
          </div>
          <div className="text-[10px] text-slate-400 tracking-tight font-medium">
            Predictive Cash-Out Interdiction Engine
          </div>
        </div>
      </div>

      {/* Persistent Case Chip with Dropdown Switcher */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-navy-900 border border-navy-700 hover:border-cyan-500/50 hover:bg-navy-850 transition-all text-left group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Complaint:</span>
              <span className="font-bold text-cyan-300 group-hover:text-cyan-200">
                {activeComplaint.id}
              </span>
              {activeComplaint.is_adversarial_split && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                  ADVERSARIAL RING
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2">
              <span>Filed: {activeComplaint.filed_at}</span>
              <span>·</span>
              <span className="text-amber-300/90 font-medium">₹{activeComplaint.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-96 rounded-md bg-navy-900 border border-navy-600 shadow-2xl z-50 p-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-navy-750 flex items-center justify-between">
              <span>Switch Active Case Context</span>
              <span>{complaints.length} Sample Complaints</span>
            </div>
            <div className="max-h-80 overflow-y-auto mt-1 space-y-1">
              {complaints.map(complaint => (
                <button
                  key={complaint.id}
                  onClick={() => {
                    setActiveComplaintId(complaint.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded text-xs transition-colors font-mono flex flex-col gap-0.5 ${
                    complaint.id === activeComplaint.id
                      ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200'
                      : 'hover:bg-navy-800 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{complaint.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-950 border border-navy-700 text-slate-400">
                      {complaint.language.raw_lang}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {complaint.victim_name} · ₹{complaint.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-cyan-400/80 truncate">
                    {complaint.crime_category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top-Level Tab Pills */}
      <nav className="flex items-center gap-1 overflow-x-auto py-0.5">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          if (tab.variant === 'orange') {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium uppercase tracking-wider transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-amber-500 text-navy-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-950/80 hover:border-amber-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          }

          if (tab.variant === 'green') {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium uppercase tracking-wider transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-emerald-500 text-navy-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-950/80 hover:border-emerald-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium uppercase tracking-wider transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-navy-900 text-slate-300 border-navy-750 hover:bg-navy-800 hover:text-slate-100 hover:border-slate-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
