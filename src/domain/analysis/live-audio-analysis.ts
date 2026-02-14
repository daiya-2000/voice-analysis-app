import type { RecordedVoiceSample } from '@/src/domain/voice/voice-enrollment';

export interface LiveAudioAnalysisRequest {
  sessionCode?: string;
  observerId?: string;
  sample: RecordedVoiceSample;
  preprocessing?: {
    vadSpeechRatio?: number;
    normalizationGainDb?: number;
    noiseSuppressionLevel?: number;
    estimatedSnrDb?: number;
    speechDominanceScore?: number;
    bgmRiskScore?: number;
    noisyEnvironmentLikely?: boolean;
    chunkWindowMs?: number;
    chunkStepMs?: number;
  };
}

export interface LiveAudioAnalysisResult {
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
  tendencySummary: string;
  confidence: number;
  engagementScore?: number;
  toneScore?: number;
  paceScore?: number;
  averageMeteringDb?: number;
  silenceRatio?: number;
  transcriptLength?: number;
  analyzedAtIso: string;
  provider: 'huggingface-edge' | 'mock';
}
