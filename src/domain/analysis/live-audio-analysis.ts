import type { RecordedVoiceSample } from '@/src/domain/voice/voice-enrollment';

export interface LiveAudioAnalysisRequest {
  sessionCode?: string;
  observerId?: string;
  sample: RecordedVoiceSample;
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
