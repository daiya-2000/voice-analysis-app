import type { RecordedVoiceSample } from '@/src/domain/voice/voice-enrollment';

export interface LiveAudioAnalysisRequest {
  sessionCode?: string;
  observerId?: string;
  sample: RecordedVoiceSample;
  preprocessing?: {
    vadSpeechRatio?: number;
    normalizationGainDb?: number;
    noiseSuppressionLevel?: number;
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
  averageMeteringDb?: number;
  silenceRatio?: number;
  transcriptLength?: number;
  analyzedAtIso: string;
  provider: 'huggingface-edge' | 'mock';
}
