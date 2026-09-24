import React from 'react';
import { Compass, Eye, ShieldCheck, MapPin, Layers, Radio } from 'lucide-react';

export type MapStyle = 'dark' | 'light' | 'topo' | 'satellite';
export type ViewMode = 'overview' | 'heatmap' | 'incident';

interface SecondaryToolbarProps {
  mapStyle: MapStyle;
  setMapStyle: (style: MapStyle) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const SecondaryToolbar: React.FC<SecondaryToolbarProps> = ({
  mapStyle,
  setMapStyle,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="bg-navy-900 border-b border-navy-800 px-3 py-1 flex items-center justify-between text-xs select-none">
      {/* Map Style Toggles */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          GIS Basemap:
        </span>
        <div className="flex bg-navy-950 p-0.5 rounded border border-navy-750">
          {(['dark', 'light', 'topo', 'satellite'] as MapStyle[]).map(style => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                mapStyle === style
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
              }`}
            >
              {style === 'dark' ? 'Dark Nav' : style}
            </button>
          ))}
        </div>
      </div>

      {/* Center Live Engine Badge */}
      <div className="flex items-center gap-2 font-mono text-[11px] bg-navy-950 px-2.5 py-0.5 rounded-full border border-navy-750">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <span className="text-slate-300 flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-emerald-400" />
          <strong className="text-emerald-400">LIVE ENGINE</strong>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Leaflet+OSM / XGBoost-v2.4 / NetworkX</span>
        </span>
      </div>

      {/* Quick View Toggles */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">
          View Scope:
        </span>
        <div className="flex bg-navy-950 p-0.5 rounded border border-navy-750">
          {[
            { id: 'overview', label: 'Overview', icon: <Eye className="w-3 h-3" /> },
            { id: 'heatmap', label: 'Risk Heatmap', icon: <Compass className="w-3 h-3" /> },
            { id: 'incident', label: 'Incident Site', icon: <MapPin className="w-3 h-3" /> },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id as ViewMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                viewMode === view.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
              }`}
            >
              {view.icon}
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
