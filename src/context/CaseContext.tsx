import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Complaint, 
  AtmCandidate, 
  FeatureWeights, 
  PipelineStage, 
  PipelineExecutionLog, 
  EvidenceBlock 
} from '../types';
import { 
  SAMPLE_COMPLAINTS, 
  SAMPLE_ATM_CANDIDATES, 
  INITIAL_EVIDENCE_BLOCKS, 
  SAMPLE_GRAPH_DATA 
} from '../data/sampleData';
import { 
  DEFAULT_WEIGHTS, 
  normalizeWeights, 
  recalculateCandidates 
} from '../utils/scoring';
import { generateSHA256 } from '../utils/crypto';

export type TopTab = 
  | 'investigation' 
  | 'pipeline' 
  | 'graph' 
  | 'model' 
  | 'report' 
  | 'integration' 
  | 'export' 
  | 'provenance';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface CaseContextType {
  activeTab: TopTab;
  setActiveTab: (tab: TopTab) => void;
  activeComplaint: Complaint;
  setActiveComplaintId: (id: string) => void;
  complaints: Complaint[];
  candidates: AtmCandidate[];
  topPriorityCandidate: AtmCandidate | null;
  weights: FeatureWeights;
  setWeights: (newWeights: Partial<FeatureWeights>) => void;
  resetWeights: () => void;
  mapAgeHour: number;
  setMapAgeHour: (age: number) => void;
  isPlayingMapAge: boolean;
  setIsPlayingMapAge: (playing: boolean) => void;
  // Pipeline State
  pipelineStage: PipelineStage;
  setPipelineStage: (stage: PipelineStage) => void;
  isPipelineRunning: boolean;
  pipelineProgress: number;
  pipelineLogs: PipelineExecutionLog[];
  startPipelineRun: (complaintId?: string) => void;
  pausePipelineRun: () => void;
  resetPipelineRun: () => void;
  // Evidence & Blockchain
  evidenceBlocks: EvidenceBlock[];
  activeEvidenceHash: string;
  sealCaseEvidence: () => Promise<string>;
  // Officer Retraining Feedback
  retrainingQueueCount: number;
  officerFeedbackLogs: { candidateId: string; action: 'CONFIRM' | 'REJECT'; timestamp: string }[];
  recordOfficerFeedback: (candidateId: string, action: 'CONFIRM' | 'REJECT') => void;
  // Bank Freeze Sim
  bankFreezeApproved: boolean;
  setBankFreezeApproved: (approved: boolean) => void;
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'alert') => void;
  removeToast: (id: string) => void;
}

const STAGES_ORDER: PipelineStage[] = [
  '01_INGEST',
  '02_LLM_EXTRACT',
  '03_GRAPH',
  '04_FEATURES',
  '05_PREDICT',
  '06_THRESHOLD',
  '07_ALERT',
  '08_SEAL',
  '09_LEA_ACTION',
];

const CaseContext = createContext<CaseContextType | null>(null);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TopTab>('investigation');
  const [complaints] = useState<Complaint[]>(SAMPLE_COMPLAINTS);
  const [activeComplaintId, setActiveComplaintIdState] = useState<string>(SAMPLE_COMPLAINTS[0].id);
  const [weights, setWeightsState] = useState<FeatureWeights>(DEFAULT_WEIGHTS);
  const [mapAgeHour, setMapAgeHour] = useState<number>(2.0);
  const [isPlayingMapAge, setIsPlayingMapAge] = useState<boolean>(false);

  // Pipeline simulation state
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('01_INGEST');
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<number>(10);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineExecutionLog[]>([]);

  // Evidence & Blockchain state
  const [evidenceBlocks, setEvidenceBlocks] = useState<EvidenceBlock[]>(INITIAL_EVIDENCE_BLOCKS);
  const [activeEvidenceHash, setActiveEvidenceHash] = useState<string>('0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b');

  // Retraining queue & bank status
  const [retrainingQueueCount, setRetrainingQueueCount] = useState<number>(18);
  const [officerFeedbackLogs, setOfficerFeedbackLogs] = useState<{ candidateId: string; action: 'CONFIRM' | 'REJECT'; timestamp: string }[]>([]);
  const [bankFreezeApproved, setBankFreezeApproved] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const activeComplaint = complaints.find(c => c.id === activeComplaintId) || complaints[0];

  // Candidates for active complaint
  const rawCandidates = SAMPLE_ATM_CANDIDATES[activeComplaint.id] || SAMPLE_ATM_CANDIDATES['NCRP-2026-0417392'];
  const [candidates, setCandidates] = useState<AtmCandidate[]>(() => 
    recalculateCandidates(rawCandidates, weights, mapAgeHour)
  );

  const topPriorityCandidate = candidates.length > 0 ? candidates[0] : null;

  // Show Toast
  const showToast = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Recalculate candidates whenever weights, active complaint, or map age changes
  useEffect(() => {
    const freshRaw = SAMPLE_ATM_CANDIDATES[activeComplaint.id] || SAMPLE_ATM_CANDIDATES['NCRP-2026-0417392'];
    const updated = recalculateCandidates(freshRaw, weights, mapAgeHour);
    setCandidates(updated);
  }, [activeComplaint.id, weights, mapAgeHour]);

  // Compute live hash of case
  const sealCaseEvidence = useCallback(async (): Promise<string> => {
    const casePayload = {
      complaint_id: activeComplaint.id,
      filed_at: activeComplaint.filed_at,
      victim: activeComplaint.victim_name,
      amount: activeComplaint.amount,
      entities: activeComplaint.extracted_entities,
      top_candidate: topPriorityCandidate ? {
        atm_id: topPriorityCandidate.id,
        name: topPriorityCandidate.name,
        confidence: topPriorityCandidate.composite_score,
        tier: topPriorityCandidate.confidence_tier,
      } : null,
      timestamp: new Date().toISOString(),
      protocol_version: 'SENTINEL-I4C-V2.4',
    };

    const hash = await generateSHA256(casePayload);
    setActiveEvidenceHash(hash);

    // Add block if not already present
    setEvidenceBlocks(prev => {
      const existing = prev.find(b => b.case_id === activeComplaint.id && b.sha256_hash === hash);
      if (existing) return prev;
      const lastBlock = prev[prev.length - 1];
      const newBlock: EvidenceBlock = {
        block_index: (lastBlock?.block_index || 10480) + 1,
        case_id: activeComplaint.id,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        sha256_hash: hash,
        prior_hash: lastBlock?.sha256_hash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        status: 'VERIFIED',
        signer: 'I4C-GOV-SEAL-NODE-07',
        summary: `Sealed prediction for ${activeComplaint.id} (Top ATM: ${topPriorityCandidate?.id || 'ATM_014'})`,
      };
      return [...prev, newBlock];
    });

    return hash;
  }, [activeComplaint, topPriorityCandidate]);

  // Update hash when complaint changes
  useEffect(() => {
    sealCaseEvidence();
  }, [activeComplaint.id, sealCaseEvidence]);

  // Weight updater
  const setWeights = (newWeights: Partial<FeatureWeights>) => {
    setWeightsState(prev => {
      const merged = { ...prev, ...newWeights };
      return normalizeWeights(merged);
    });
  };

  const resetWeights = () => {
    setWeightsState(DEFAULT_WEIGHTS);
  };

  const setActiveComplaintId = (id: string) => {
    setActiveComplaintIdState(id);
    showToast(
      'Complaint Context Switched',
      `Active case set to ${id} (${SAMPLE_COMPLAINTS.find(c => c.id === id)?.crime_category || 'Cybercrime'})`,
      'info'
    );
  };

  // Map age playback ticker
  useEffect(() => {
    let interval: any;
    if (isPlayingMapAge) {
      interval = setInterval(() => {
        setMapAgeHour(prev => {
          if (prev >= 6.0) {
            setIsPlayingMapAge(false);
            return 6.0;
          }
          return Number((prev + 0.2).toFixed(1));
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlayingMapAge]);

  // Officer feedback
  const recordOfficerFeedback = (candidateId: string, action: 'CONFIRM' | 'REJECT') => {
    setRetrainingQueueCount(prev => prev + 1);
    setOfficerFeedbackLogs(prev => [
      { candidateId, action, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 40)
    ]);
    showToast(
      action === 'CONFIRM' ? 'Ground-Truth Confirmed' : 'Prediction Rejected',
      `Feedback for ${candidateId} logged to active ML Retraining Queue (Total items: ${retrainingQueueCount + 1})`,
      action === 'CONFIRM' ? 'success' : 'warning'
    );
  };

  // Automated 9-Stage Pipeline Runner
  const startPipelineRun = useCallback((targetComplaintId?: string) => {
    if (targetComplaintId && targetComplaintId !== activeComplaint.id) {
      setActiveComplaintIdState(targetComplaintId);
    }
    setIsPipelineRunning(true);
    setPipelineStage('01_INGEST');
    setPipelineProgress(5);
    setPipelineLogs([
      {
        id: 'log-0',
        timestamp: new Date().toLocaleTimeString('en-IN'),
        stage: '01_INGEST',
        level: 'INFO',
        message: `Pipeline execution initiated for complaint ${targetComplaintId || activeComplaint.id}. Listening on Redis stream 'ncrp.complaints.ingest'`,
      }
    ]);
  }, [activeComplaint.id]);

  const pausePipelineRun = () => {
    setIsPipelineRunning(false);
  };

  const resetPipelineRun = () => {
    setIsPipelineRunning(false);
    setPipelineStage('01_INGEST');
    setPipelineProgress(10);
    setPipelineLogs([]);
  };

  // Pipeline execution timer loop
  useEffect(() => {
    if (!isPipelineRunning) return;

    const stageTimeouts: Record<PipelineStage, number> = {
      '01_INGEST': 2200,
      '02_LLM_EXTRACT': 3000,
      '03_GRAPH': 2600,
      '04_FEATURES': 2000,
      '05_PREDICT': 2800,
      '06_THRESHOLD': 2000,
      '07_ALERT': 2200,
      '08_SEAL': 2400,
      '09_LEA_ACTION': 1500,
    };

    const currentIdx = STAGES_ORDER.indexOf(pipelineStage);
    const delay = stageTimeouts[pipelineStage];

    const timer = setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx < STAGES_ORDER.length) {
        const nextStage = STAGES_ORDER[nextIdx];
        setPipelineStage(nextStage);
        setPipelineProgress(Math.round(((nextIdx + 1) / STAGES_ORDER.length) * 100));

        // Append realistic logs
        const logMessages: Record<PipelineStage, { level: 'INFO' | 'SUCCESS' | 'WARN' | 'CRITICAL'; message: string }> = {
          '01_INGEST': { level: 'INFO', message: 'NCRP intake parsed. Free text routed to LLM tokenizer.' },
          '02_LLM_EXTRACT': { 
            level: 'SUCCESS', 
            message: `Multilingual extraction complete (${activeComplaint.language.display_badge}). Normalized English JSON structured.` 
          },
          '03_GRAPH': { 
            level: activeComplaint.is_adversarial_split ? 'CRITICAL' : 'WARN', 
            message: activeComplaint.is_adversarial_split 
              ? '⚠️ ADVERSARIAL PATTERN DETECTED: 4 parallel micro-withdrawals linked via shared syndicate vertex in Cyberabad graph!'
              : `NetworkX graph updated. Mule account ${activeComplaint.extracted_entities.upi_id} connected to known fraud ring (Centrality: 92/100).` 
          },
          '04_FEATURES': { level: 'INFO', message: '5-feature vector assembled (Spatial, Temporal, Financial, FraudDNA, Graph). Auto-normalizer applied.' },
          '05_PREDICT': { level: 'SUCCESS', message: `XGBoost inference complete. Top priority ATM: ${topPriorityCandidate?.id || 'ATM_014'} (Score: ${topPriorityCandidate?.composite_score || 0.87}).` },
          '06_THRESHOLD': { level: 'SUCCESS', message: `Threshold Router: Score exceeds 0.85 -> AUTO-ALERT lane engaged for immediate intercept dispatch.` },
          '07_ALERT': { level: 'SUCCESS', message: `Simultaneous outbound alerts dispatched to Cyber Cell SMS Gateway, Bank Core Banking System, and I4C National Ledger.` },
          '08_SEAL': { level: 'SUCCESS', message: `Cryptographic Evidence Block sealed with SHA-256 and anchored to Government Ledger.` },
          '09_LEA_ACTION': { level: 'SUCCESS', message: 'Pipeline run completed. Case intelligence ready for Law Enforcement Field Action.' },
        };

        const item = logMessages[nextStage];
        setPipelineLogs(prev => [
          ...prev,
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-IN'),
            stage: nextStage,
            level: item.level,
            message: item.message,
          }
        ]);

        if (nextStage === '08_SEAL') {
          sealCaseEvidence();
        }
      } else {
        setIsPipelineRunning(false);
        showToast('Pipeline Run Completed', `Full 9-stage intelligence sequence completed for ${activeComplaint.id}`, 'success');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isPipelineRunning, pipelineStage, activeComplaint, topPriorityCandidate, sealCaseEvidence, showToast]);

  return (
    <CaseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeComplaint,
        setActiveComplaintId,
        complaints,
        candidates,
        topPriorityCandidate,
        weights,
        setWeights,
        resetWeights,
        mapAgeHour,
        setMapAgeHour,
        isPlayingMapAge,
        setIsPlayingMapAge,
        pipelineStage,
        setPipelineStage,
        isPipelineRunning,
        pipelineProgress,
        pipelineLogs,
        startPipelineRun,
        pausePipelineRun,
        resetPipelineRun,
        evidenceBlocks,
        activeEvidenceHash,
        sealCaseEvidence,
        retrainingQueueCount,
        officerFeedbackLogs,
        recordOfficerFeedback,
        bankFreezeApproved,
        setBankFreezeApproved,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
