import React from 'react';
import { useCase } from '../../context/CaseContext';
import { PipelineStage } from '../../types';
import { Play, Pause, RotateCcw, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

export const PIPELINE_STAGES: { id: PipelineStage; num: string; shortName: string; label: string }[] = [
  { id: '01_INGEST', num: '01', shortName: 'INGEST', label: 'Complaint Intake & Tokenization' },
  { id: '02_LLM_EXTRACT', num: '02', shortName: 'LLM EXTRACT', label: 'Multilingual Fraud DNA Extraction' },
  { id: '03_GRAPH', num: '03', shortName: 'GRAPH', label: 'NetworkX Graph & Ring Correlation' },
  { id: '04_FEATURES', num: '04', shortName: 'FEATURES', label: 'Feature Assembly & Normalization' },
  { id: '05_PREDICT', num: '05', shortName: 'PREDICT', label: 'XGBoost ATM Spatial Prediction' },
  { id: '06_THRESHOLD', num: '06', shortName: 'THRESH', label: 'Confidence Threshold Router' },
  { id: '07_ALERT', num: '07', shortName: 'ALERT', label: 'Multi-Channel Alert Dispatch' },
  { id: '08_SEAL', num: '08', shortName: 'SEAL', label: 'SHA-256 Evidence Sealing' },
  { id: '09_LEA_ACTION', num: '09', shortName: 'LEA ACTION', label: 'Law Enforcement Interdiction' },
];

export const BottomPipelineStrip: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    pipelineStage, 
    setPipelineStage, 
    isPipelineRunning, 
    startPipelineRun, 
    pausePipelineRun, 
    resetPipelineRun,
    activeComplaint
  } = useCase();

  const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === pipelineStage);

  return (
    <footer className="bg-navy-950 border-t border-navy-750 px-3 py-1.5 flex flex-col gap-1 select-none shrink-0 z-30">
      {/* 9-Stage Stepper Strip */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto">
        {/* Horizontal Pipeline Chips */}
        <div className="flex items-center gap-1 flex-1">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isActive = stage.id === pipelineStage;
            const isCompleted = idx < currentIdx;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => {
                    setPipelineStage(stage.id);
                    if (activeTab !== 'pipeline') {
                      setActiveTab('pipeline');
                    }
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-cyan-500 text-navy-950 border-cyan-300 font-black shadow-md shadow-cyan-500/30 scale-105'
                      : isCompleted
                      ? 'bg-navy-900 text-cyan-400 border-cyan-500/40 hover:bg-navy-850'
                      : 'bg-navy-900/60 text-slate-500 border-navy-800 hover:text-slate-300 hover:bg-navy-850'
                  }`}
                  title={`${stage.num} ${stage.label}`}
                >
                  <span className={`font-bold ${isActive ? 'text-navy-950' : 'text-slate-400'}`}>
                    {stage.num}
                  </span>
                  <span>{stage.shortName}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-navy-950 animate-ping" />}
                </button>

                {idx < PIPELINE_STAGES.length - 1 && (
                  <span className="text-slate-600 text-xs px-0.5">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Launch / Jump to Full Visualizer */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-navy-800">
          <button
            onClick={() => {
              if (isPipelineRunning) {
                pausePipelineRun();
              } else {
                startPipelineRun();
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border ${
              isPipelineRunning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {isPipelineRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPipelineRunning ? 'Pause Sim' : 'Run Pipeline'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-navy-900 hover:bg-navy-800 text-cyan-300 hover:text-cyan-200 border border-navy-700 text-[10px] font-mono uppercase tracking-wider transition-colors"
          >
            <span>Inspect 9-Stage Pipeline</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
