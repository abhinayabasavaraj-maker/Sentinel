import React from 'react';
import { useCase } from '../../context/CaseContext';
import { PIPELINE_STAGES } from '../layout/BottomPipelineStrip';
import { Stage01Ingest } from './stages/Stage01Ingest';
import { Stage02LLMExtract } from './stages/Stage02LLMExtract';
import { Stage03GraphUpdate } from './stages/Stage03GraphUpdate';
import { Stage04FeatureAssembly } from './stages/Stage04FeatureAssembly';
import { Stage05PredictiveEngine } from './stages/Stage05PredictiveEngine';
import { Stage06ThresholdRouter } from './stages/Stage06ThresholdRouter';
import { Stage07AlertDispatch } from './stages/Stage07AlertDispatch';
import { Stage08EvidenceSealing } from './stages/Stage08EvidenceSealing';
import { Stage09LEAConsumption } from './stages/Stage09LEAConsumption';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const PipelineVisualizer: React.FC = () => {
  const { 
    pipelineStage, 
    setPipelineStage, 
    isPipelineRunning, 
    startPipelineRun, 
    pausePipelineRun, 
    resetPipelineRun,
    pipelineLogs,
    activeComplaint,
    complaints,
    setActiveComplaintId
  } = useCase();

  const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === pipelineStage);

  const renderActiveStageComponent = () => {
    switch (pipelineStage) {
      case '01_INGEST':
        return <Stage01Ingest />;
      case '02_LLM_EXTRACT':
        return <Stage02LLMExtract />;
      case '03_GRAPH':
        return <Stage03GraphUpdate />;
      case '04_FEATURES':
        return <Stage04FeatureAssembly />;
      case '05_PREDICT':
        return <Stage05PredictiveEngine />;
      case '06_THRESHOLD':
        return <Stage06ThresholdRouter />;
      case '07_ALERT':
        return <Stage07AlertDispatch />;
      case '08_SEAL':
        return <Stage08EvidenceSealing />;
      case '09_LEA_ACTION':
        return <Stage09LEAConsumption />;
      default:
        return <Stage01Ingest />;
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-navy-950 p-4 space-y-3 overflow-y-auto select-none">
      {/* Top Master Controller Bar */}
      <div className="p-3 rounded-lg bg-navy-900 border border-navy-750 shadow-xl flex items-center justify-between gap-3">
        {/* Left: Play / Pause / Reset & Steps */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isPipelineRunning) pausePipelineRun();
              else startPipelineRun();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg ${
              isPipelineRunning
                ? 'bg-amber-500 text-navy-950 border border-amber-400'
                : 'bg-cyan-500 hover:bg-cyan-400 text-navy-950 border border-cyan-300'
            }`}
          >
            {isPipelineRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPipelineRunning ? 'Pause Simulation' : 'Execute 9-Stage Pipeline'}</span>
          </button>

          <button
            onClick={resetPipelineRun}
            title="Reset Pipeline Simulation"
            className="p-1.5 rounded bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-slate-200 border border-navy-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center gap-1 pl-2 border-l border-navy-750">
            <button
              onClick={() => {
                if (currentIdx > 0) setPipelineStage(PIPELINE_STAGES[currentIdx - 1].id);
              }}
              disabled={currentIdx === 0}
              className="p-1.5 rounded bg-navy-800 text-slate-300 disabled:opacity-40 hover:bg-navy-750 border border-navy-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">
              Stage {currentIdx + 1} of 9
            </span>
            <button
              onClick={() => {
                if (currentIdx < PIPELINE_STAGES.length - 1) setPipelineStage(PIPELINE_STAGES[currentIdx + 1].id);
              }}
              disabled={currentIdx === PIPELINE_STAGES.length - 1}
              className="p-1.5 rounded bg-navy-800 text-slate-300 disabled:opacity-40 hover:bg-navy-750 border border-navy-700 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Select Sample Complaint for Demonstration */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400 text-[11px] uppercase">Target Scenario:</span>
          <select
            value={activeComplaint.id}
            onChange={e => {
              setActiveComplaintId(e.target.value);
              resetPipelineRun();
            }}
            className="bg-navy-950 text-cyan-300 border border-navy-700 rounded px-2.5 py-1 text-xs font-mono font-medium focus:outline-none focus:border-cyan-500"
          >
            {complaints.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.language.raw_lang} ({c.crime_category.split('/')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 9-Stage Progress Breadcrumb Strip */}
      <div className="grid grid-cols-9 gap-1.5 font-mono text-[10px]">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isActive = stage.id === pipelineStage;
          const isDone = idx < currentIdx;

          return (
            <button
              key={stage.id}
              onClick={() => setPipelineStage(stage.id)}
              className={`p-2 rounded border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-lg glow-cyan scale-102'
                  : isDone
                  ? 'bg-navy-900 text-slate-300 border-cyan-500/30'
                  : 'bg-navy-900/60 text-slate-500 border-navy-800 hover:bg-navy-850'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono font-black">{stage.num}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ) : null}
              </div>
              <div className="truncate font-semibold uppercase tracking-wider text-[9px]">
                {stage.shortName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Stage Interactive Detail View */}
      <div className="p-3.5 rounded-lg bg-navy-900/90 border border-navy-750 shadow-2xl min-h-72">
        {renderActiveStageComponent()}
      </div>

      {/* Running Execution CI/CD Log Underneath */}
      <div className="rounded-lg bg-navy-950 border border-navy-800 p-3 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-navy-850">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sentinel Execution Engine Log Stream (Simulated Redis / Worker stdout)</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">
            Log Buffer: {pipelineLogs.length} events
          </span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1 text-[11px] pr-1">
          {pipelineLogs.length === 0 ? (
            <div className="text-slate-500 italic py-2">
              Simulation ready. Press "Execute 9-Stage Pipeline" above to run live intelligence ingestion, multilingual extraction, and spatial prediction sequence.
            </div>
          ) : (
            pipelineLogs.map(log => {
              const colors = {
                INFO: 'text-slate-300',
                SUCCESS: 'text-emerald-400',
                WARN: 'text-amber-400',
                CRITICAL: 'text-rose-400 font-bold',
              };

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span className="text-cyan-400/80 font-semibold shrink-0">[{log.stage}]</span>
                  <span className={`shrink-0 text-[10px] px-1 rounded ${
                    log.level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'text-slate-400'
                  }`}>
                    {log.level}:
                  </span>
                  <span className={colors[log.level]}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
