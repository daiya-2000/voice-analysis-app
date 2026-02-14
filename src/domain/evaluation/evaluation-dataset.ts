export type EvaluationProvider = 'huggingface-edge' | 'mock';

export interface EvaluationChunkRecord {
  id: string;
  analyzedAtIso: string;
  provider: EvaluationProvider;
  averageMeteringDb: number | null;
  silenceRatio: number | null;
  transcriptLength: number | null;
  confidence: number;
  engagementEstimate: string;
  toneEstimate: string;
  paceEstimate: string;
  tendencySummary: string;
}

export interface EvaluationLabelProgress {
  silenceLabeled: boolean;
  speakerTurnsLabeled: boolean;
  sentimentLabeled: boolean;
}

export interface EvaluationSessionRecord {
  id: string;
  sourceSessionFingerprint: string;
  createdAtIso: string;
  updatedAtIso: string;
  endedAtIso: string | null;
  labels: EvaluationLabelProgress;
  chunks: EvaluationChunkRecord[];
}

export interface EvaluationDataset {
  schemaVersion: 1;
  sessions: EvaluationSessionRecord[];
}

export function createEmptyEvaluationDataset(): EvaluationDataset {
  return {
    schemaVersion: 1,
    sessions: [],
  };
}

export function createDefaultLabelProgress(): EvaluationLabelProgress {
  return {
    silenceLabeled: false,
    speakerTurnsLabeled: false,
    sentimentLabeled: false,
  };
}

export function buildSessionFingerprint(sessionCode?: string): string {
  if (!sessionCode) {
    return 'unknown-session';
  }

  let hash = 0;
  for (let index = 0; index < sessionCode.length; index += 1) {
    hash = (hash * 31 + sessionCode.charCodeAt(index)) >>> 0;
  }

  return `session-${hash.toString(16).padStart(8, '0')}`;
}
