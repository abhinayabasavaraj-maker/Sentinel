import { AtmCandidate, AtmScores, FeatureWeights, ConfidenceTier } from '../types';

export const DEFAULT_WEIGHTS: FeatureWeights = {
  spatial: 0.30,
  temporal: 0.20,
  financial: 0.15,
  fraud_dna: 0.15,
  graph: 0.20,
};

/**
 * Normalizes weights so they sum strictly to 1.00
 */
export function normalizeWeights(weights: FeatureWeights): FeatureWeights {
  const sum = weights.spatial + weights.temporal + weights.financial + weights.fraud_dna + weights.graph;
  if (sum === 0) return DEFAULT_WEIGHTS;
  return {
    spatial: Number((weights.spatial / sum).toFixed(4)),
    temporal: Number((weights.temporal / sum).toFixed(4)),
    financial: Number((weights.financial / sum).toFixed(4)),
    fraud_dna: Number((weights.fraud_dna / sum).toFixed(4)),
    graph: Number((weights.graph / sum).toFixed(4)),
  };
}

/**
 * Computes composite score for an ATM given the weights
 */
export function computeCompositeScore(scores: AtmScores, weights: FeatureWeights): number {
  const norm = normalizeWeights(weights);
  const raw = 
    scores.spatial * norm.spatial +
    scores.temporal * norm.temporal +
    scores.financial * norm.financial +
    scores.fraud_dna * norm.fraud_dna +
    scores.graph * norm.graph;
  
  return Math.min(0.99, Math.max(0.12, Number(raw.toFixed(4))));
}

/**
 * Categorizes score into threshold confidence tier
 */
export function getConfidenceTier(score: number): ConfidenceTier {
  if (score >= 0.85) return 'HIGH';
  if (score >= 0.60) return 'MEDIUM';
  return 'LOW';
}

/**
 * Re-ranks ATM candidates and updates their composite scores and tiers
 */
export function recalculateCandidates(
  candidates: AtmCandidate[],
  weights: FeatureWeights,
  ageAdjustmentHour: number = 2.0
): AtmCandidate[] {
  return candidates
    .map(c => {
      // Simulate dynamic signal updates over time
      const timeFactor = Math.min(1.0, 0.7 + (ageAdjustmentHour / 6.0) * 0.3);
      const adjustedScores: AtmScores = {
        spatial: c.scores.spatial,
        temporal: Math.min(0.98, Number((c.scores.temporal * timeFactor).toFixed(2))),
        financial: c.scores.financial,
        fraud_dna: c.scores.fraud_dna,
        graph: Math.min(0.99, Number((c.scores.graph * (0.8 + (ageAdjustmentHour / 6.0) * 0.2)).toFixed(2))),
      };

      const score = computeCompositeScore(adjustedScores, weights);
      const tier = getConfidenceTier(score);

      return {
        ...c,
        scores: adjustedScores,
        composite_score: score,
        confidence_tier: tier,
      };
    })
    .sort((a, b) => b.composite_score - a.composite_score);
}
