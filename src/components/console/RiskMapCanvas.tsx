import React, { useEffect, useRef, useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { MapStyle, ViewMode } from '../layout/SecondaryToolbar';
import { MapLayersCard, MapLayerState } from './MapLayersCard';
import { LiveFeatureVectorCard } from './LiveFeatureVectorCard';
import { Play, Pause, RotateCcw, Crosshair, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { AtmCandidate } from '../../types';

interface RiskMapCanvasProps {
  mapStyle: MapStyle;
  viewMode: ViewMode;
}

export const RiskMapCanvas: React.FC<RiskMapCanvasProps> = ({ mapStyle, viewMode }) => {
  const { 
    activeComplaint, 
    candidates, 
    topPriorityCandidate, 
    mapAgeHour, 
    setMapAgeHour, 
    isPlayingMapAge, 
    setIsPlayingMapAge,
    showToast 
  } = useCase();

  const [layers, setLayers] = useState<MapLayerState>({
    victimOrigin: true,
    atmCandidates: true,
    historicalHotspots: true,
    jurisdictionBounds: true,
    bankBranches: true,
  });

  const [activePopupCandidate, setActivePopupCandidate] = useState<AtmCandidate | null>(null);

  // SVG / Canvas coordinates calculation
  const centerLat = activeComplaint.victim_location.lat;
  const centerLng = activeComplaint.victim_location.lng;

  // Coordinate scaling helper to fit in the canvas
  const latRange = 0.03;
  const lngRange = 0.04;

  const projectToCanvas = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - (centerLng - lngRange / 2)) / lngRange) * width;
    const y = ((centerLat + latRange / 2 - lat) / latRange) * height;
    return { x: Math.max(40, Math.min(width - 40, x)), y: Math.max(40, Math.min(height - 40, y)) };
  };

  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="relative flex-1 h-full flex flex-col bg-navy-950 overflow-hidden select-none">
      {/* Visual GIS Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Background Grid / Cartography simulation */}
        <div 
          className={`absolute inset-0 transition-colors duration-500 ${
            mapStyle === 'light' ? 'bg-slate-200' : mapStyle === 'satellite' ? 'bg-slate-950' : 'bg-navy-950'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, ${mapStyle === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(34, 211, 238, 0.04)'} 1px, transparent 1px),
              linear-gradient(to right, ${mapStyle === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(28, 44, 76, 0.35)'} 1px, transparent 1px),
              linear-gradient(to bottom, ${mapStyle === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(28, 44, 76, 0.35)'} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 80px 80px, 80px 80px',
          }}
        >
          {/* Simulated Cartographic Street lines */}
          <svg className="w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#334d80" strokeWidth="2" strokeDasharray="6,6" />
            <line x1="20%" y1="85%" x2="80%" y2="15%" stroke="#334d80" strokeWidth="2" />
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx="50%" cy="50%" r="22%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4,8" fill="none" opacity="0.25" />
            <circle cx="50%" cy="50%" r="38%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="8,12" fill="none" opacity="0.15" />
          </svg>
        </div>

        {/* Historical Hotspot Heatmap Layer */}
        {layers.historicalHotspots && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Heat Gradient Blobs */}
            <div 
              className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 animate-pulse-slow"
              style={{
                top: '42%',
                left: '48%',
                background: 'radial-gradient(circle, rgba(239,68,68,0.7) 0%, rgba(245,158,11,0.4) 50%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div 
              className="absolute w-56 h-56 rounded-full blur-2xl opacity-20"
              style={{
                top: '30%',
                left: '60%',
                background: 'radial-gradient(circle, rgba(245,158,11,0.6) 0%, rgba(34,211,238,0.3) 60%, transparent 80%)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        )}

        {/* Dynamic Markers Overlay */}
        <div className="absolute inset-0 p-8">
          <div className="relative w-full h-full">
            {/* 1. Victim Origin Marker */}
            {layers.victimOrigin && (
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ top: '50%', left: '50%' }}
              >
                <div className="relative flex flex-col items-center group cursor-pointer">
                  {/* Radar Pulse */}
                  <div className="absolute -inset-3 rounded-full bg-amber-500/20 animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-navy-900 shadow-lg flex items-center justify-center text-navy-950 font-black text-xs z-10 glow-amber">
                    <MapPin className="w-4 h-4 fill-navy-950" />
                  </div>
                  {/* Tooltip Label */}
                  <div className="mt-1 px-2 py-0.5 rounded bg-navy-900/90 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap shadow-xl">
                    VICTIM: {activeComplaint.victim_name.split(' ')[0]} ({activeComplaint.district})
                  </div>
                </div>
              </div>
            )}

            {/* 2. Candidate ATM Markers */}
            {layers.atmCandidates &&
              candidates.map((atm, idx) => {
                const isTopPriority = topPriorityCandidate?.id === atm.id;
                const rank = idx + 1;

                // Deterministic placement offset around victim origin
                const angle = (idx * (360 / Math.max(6, candidates.length)) + (idx * 25)) * (Math.PI / 180);
                const radiusPercent = 18 + (atm.distance_m / 1000) * 16;
                const topPos = 50 + Math.sin(angle) * radiusPercent;
                const leftPos = 50 + Math.cos(angle) * radiusPercent;

                return (
                  <div
                    key={atm.id}
                    onClick={() => setActivePopupCandidate(atm)}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer"
                    style={{
                      top: `${Math.max(12, Math.min(88, topPos))}%`,
                      left: `${Math.max(12, Math.min(88, leftPos))}%`,
                    }}
                  >
                    <div className="relative flex flex-col items-center group">
                      {/* Concentric pulsing rings for Top Priority candidate */}
                      {isTopPriority && (
                        <>
                          <div className="absolute -inset-4 rounded-full border-2 border-cyan-400/80 animate-ping" />
                          <div className="absolute -inset-8 rounded-full border border-cyan-400/40 animate-pulse-slow" />
                        </>
                      )}

                      {/* Pin Circle */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-2xl transition-transform group-hover:scale-125 z-10 ${
                          isTopPriority
                            ? 'bg-cyan-400 text-navy-950 border-white shadow-cyan-400/60 glow-cyan scale-110'
                            : atm.confidence_tier === 'HIGH'
                            ? 'bg-emerald-500 text-navy-950 border-emerald-300'
                            : atm.confidence_tier === 'MEDIUM'
                            ? 'bg-amber-500 text-navy-950 border-amber-300'
                            : 'bg-navy-800 text-slate-300 border-navy-600'
                        }`}
                      >
                        #{rank}
                      </div>

                      {/* Pin Badge Text */}
                      <div
                        className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap border shadow-xl transition-all ${
                          isTopPriority
                            ? 'bg-cyan-950/95 text-cyan-200 border-cyan-400 font-bold scale-105'
                            : 'bg-navy-900/90 text-slate-300 border-navy-700 group-hover:border-cyan-500/50'
                        }`}
                      >
                        {atm.id} · {(atm.composite_score * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Selected Candidate Detailed Popover */}
        {activePopupCandidate && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-80 rounded-lg bg-navy-900/95 backdrop-blur-md border-2 border-cyan-500/80 shadow-2xl p-3 text-xs font-mono animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-1.5 border-b border-navy-750">
              <span className="font-bold text-cyan-300">
                {activePopupCandidate.id} · {activePopupCandidate.bank}
              </span>
              <button
                onClick={() => setActivePopupCandidate(null)}
                className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-navy-800"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 text-slate-200 font-sans text-xs">
              {activePopupCandidate.name}
            </div>
            <div className="text-[11px] text-slate-400">{activePopupCandidate.address}</div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-navy-800 text-[10px]">
              <div>
                <span className="text-slate-400">Score:</span>{' '}
                <strong className="text-cyan-300">{(activePopupCandidate.composite_score * 100).toFixed(0)}%</strong>
              </div>
              <div>
                <span className="text-slate-400">Window:</span>{' '}
                <strong className="text-amber-300">{activePopupCandidate.predicted_cashout_mins} mins</strong>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              Nearest PS: <span className="text-slate-200">{activePopupCandidate.jurisdiction.nearest_ps}</span>
            </div>
          </div>
        )}

        {/* Map Control Buttons (Top Left) */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 bg-navy-900/80 backdrop-blur-md p-1 rounded border border-navy-750 shadow-lg">
          <button
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.2))}
            title="Zoom In"
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-navy-800 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
            title="Zoom Out"
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-navy-800 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              showToast('Map Recentered', `Focused on crime origin in ${activeComplaint.district}`, 'info');
            }}
            title="Recenter On Incident Origin"
            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-navy-800 transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Top-Right Map Layers Card */}
        <MapLayersCard layers={layers} setLayers={setLayers} />

        {/* Floating Bottom-Left Live Feature Vector Card */}
        <LiveFeatureVectorCard />
      </div>

      {/* Time Scrubber Under the Map: "Complaint Age: 0h -> 6h" */}
      <div className="bg-navy-900 border-t border-navy-800 px-3 py-1.5 flex items-center justify-between gap-3 text-xs font-mono select-none">
        {/* Play / Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlayingMapAge(!isPlayingMapAge)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-colors"
          >
            {isPlayingMapAge ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>PLAY SIGNAL ARRIVAL</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlayingMapAge(false);
              setMapAgeHour(0.5);
            }}
            title="Reset Timeline"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-navy-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Elapsed Scrubber Slider */}
        <div className="flex-1 flex items-center gap-3 max-w-xl">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider shrink-0">
            Complaint Age:
          </span>
          <span className="font-bold text-cyan-300 shrink-0 min-w-10">
            {mapAgeHour.toFixed(1)}h
          </span>
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0.0"
              max="6.0"
              step="0.1"
              value={mapAgeHour}
              onChange={e => {
                setIsPlayingMapAge(false);
                setMapAgeHour(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
            <span>0.0h</span>
            <span>·</span>
            <span>6.0h</span>
          </div>
        </div>

        {/* Signal Status Indicator */}
        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Dynamic Signal Calibration Active</span>
        </div>
      </div>
    </div>
  );
};
