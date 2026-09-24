import React, { useState } from 'react';
import { Layers, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';

export interface MapLayerState {
  victimOrigin: boolean;
  atmCandidates: boolean;
  historicalHotspots: boolean;
  jurisdictionBounds: boolean;
  bankBranches: boolean;
}

interface MapLayersCardProps {
  layers: MapLayerState;
  setLayers: React.Dispatch<React.SetStateAction<MapLayerState>>;
}

export const MapLayersCard: React.FC<MapLayersCardProps> = ({ layers, setLayers }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleLayer = (key: keyof MapLayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="absolute top-3 right-3 z-20 w-56 rounded-md bg-navy-900/90 backdrop-blur-md border border-navy-700/80 shadow-2xl p-2.5 text-xs select-none">
      <div className="flex items-center justify-between pb-1.5 border-b border-navy-750">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Map GIS Layers</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
        >
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-2 space-y-1.5 font-mono text-[11px]">
          <button
            onClick={() => toggleLayer('victimOrigin')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:text-slate-100 transition-colors py-0.5"
          >
            {layers.victimOrigin ? (
              <CheckSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              Victim / Crime Origin
            </span>
          </button>

          <button
            onClick={() => toggleLayer('atmCandidates')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:text-slate-100 transition-colors py-0.5"
          >
            {layers.atmCandidates ? (
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              ATM Candidates (#1–#12)
            </span>
          </button>

          <button
            onClick={() => toggleLayer('historicalHotspots')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:text-slate-100 transition-colors py-0.5"
          >
            {layers.historicalHotspots ? (
              <CheckSquare className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500/80 shrink-0" />
              Historical Cash-out Heat
            </span>
          </button>

          <button
            onClick={() => toggleLayer('jurisdictionBounds')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:text-slate-100 transition-colors py-0.5"
          >
            {layers.jurisdictionBounds ? (
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
              Police PS Jurisdictions
            </span>
          </button>

          <button
            onClick={() => toggleLayer('bankBranches')}
            className="flex items-center gap-2 w-full text-left text-slate-300 hover:text-slate-100 transition-colors py-0.5"
          >
            {layers.bankBranches ? (
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              Bank Branches & CBS
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
