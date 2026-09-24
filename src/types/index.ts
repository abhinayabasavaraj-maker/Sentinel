export type ConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface LocationCoords {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

export interface Complaint {
  id: string;
  victim_name: string;
  victim_phone: string;
  victim_location: LocationCoords;
  district: string;
  state: string;
  filed_at: string; // ISO or human format
  filed_timestamp_unix: number; // for timer
  amount: number;
  crime_category: string;
  modus_operandi: string;
  language: {
    raw_lang: 'Hinglish' | 'Hindi' | 'English' | 'Telugu-English';
    display_badge: string;
    confidence: number;
  };
  raw_text: string;
  english_normalized_text: string;
  extracted_entities: {
    upi_id: string;
    beneficiary_account: string;
    ifsc: string;
    bank_name: string;
    suspect_phone: string;
    apk_or_link?: string;
    device_id?: string;
  };
  is_adversarial_split?: boolean;
  linked_case_ids?: string[];
}

export interface AtmScores {
  spatial: number;    // 0 - 1
  temporal: number;   // 0 - 1
  financial: number;  // 0 - 1
  fraud_dna: number;  // 0 - 1
  graph: number;      // 0 - 1
}

export interface AtmCandidate {
  id: string;
  name: string;
  bank: string;
  address: string;
  lat: number;
  lng: number;
  distance_m: number;
  matched_age_hours: number;
  predicted_cashout_mins: number;
  scores: AtmScores;
  composite_score: number; // computed
  confidence_tier: ConfidenceTier;
  shap_reasons: string[];
  jurisdiction: {
    state: string;
    district: string;
    nearest_ps: string;
    cell_hotline: string;
  };
  cash_availability: 'HIGH' | 'MEDIUM' | 'DEPLETED';
  cctv_coverage: boolean;
  crowd_density: 'LOW' | 'MEDIUM' | 'HIGH';
  is_adversarial_target?: boolean;
}

export interface FeatureWeights {
  spatial: number;
  temporal: number;
  financial: number;
  fraud_dna: number;
  graph: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'victim' | 'upi' | 'mule_account' | 'atm' | 'phone' | 'fraud_ring' | 'prior_case';
  status: 'normal' | 'flagged' | 'frozen' | 'high_priority' | 'target';
  centrality: number; // 0 - 100
  amount?: number;
  tx_velocity?: string;
  flags: string[];
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  amount?: number;
  timestamp?: string;
  is_ring_link?: boolean;
}

export interface MuleReputation {
  account_or_upi: string;
  score: number; // 0 - 100
  risk_level: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  reasons: {
    passed: boolean;
    text: string;
    impact: string;
  }[];
  out_degree: number;
  linked_cases_count: number;
  velocity_tx_per_hour: number;
  freeze_eligible: boolean;
}

export interface EvidenceBlock {
  block_index: number;
  case_id: string;
  timestamp: string;
  sha256_hash: string;
  prior_hash: string;
  status: 'VERIFIED' | 'ANCHORED';
  signer: string;
  summary: string;
}

export type PipelineStage = 
  | '01_INGEST'
  | '02_LLM_EXTRACT'
  | '03_GRAPH'
  | '04_FEATURES'
  | '05_PREDICT'
  | '06_THRESHOLD'
  | '07_ALERT'
  | '08_SEAL'
  | '09_LEA_ACTION';

export interface StageDefinition {
  id: PipelineStage;
  num: string;
  name: string;
  shortName: string;
  description: string;
  durationMs: number;
}

export interface PipelineExecutionLog {
  id: string;
  timestamp: string;
  stage: PipelineStage;
  level: 'INFO' | 'WARN' | 'SUCCESS' | 'CRITICAL';
  message: string;
  codeSnippet?: string;
}
