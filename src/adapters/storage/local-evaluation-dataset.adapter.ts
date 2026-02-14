import { Directory, File, Paths } from 'expo-file-system';

import type { EvaluationDatasetPort } from '@/src/application/ports/evaluation-dataset.port';
import {
  createDefaultLabelProgress,
  createEmptyEvaluationDataset,
  type EvaluationChunkRecord,
  type EvaluationDataset,
  type EvaluationSessionRecord,
} from '@/src/domain/evaluation/evaluation-dataset';

const APP_CACHE_DIRECTORY_NAME = 'voice-analysis-app';
const EVALUATION_DATASET_FILE_NAME = 'evaluation-dataset.json';
const MAX_SESSION_COUNT = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseChunk(raw: unknown): EvaluationChunkRecord | null {
  if (!isRecord(raw)) {
    return null;
  }

  if (
    typeof raw.id !== 'string' ||
    typeof raw.analyzedAtIso !== 'string' ||
    (raw.provider !== 'huggingface-edge' && raw.provider !== 'mock') ||
    typeof raw.confidence !== 'number' ||
    typeof raw.engagementEstimate !== 'string' ||
    typeof raw.toneEstimate !== 'string' ||
    typeof raw.paceEstimate !== 'string' ||
    typeof raw.tendencySummary !== 'string'
  ) {
    return null;
  }

  const averageMeteringDb = typeof raw.averageMeteringDb === 'number' ? raw.averageMeteringDb : null;
  const silenceRatio = typeof raw.silenceRatio === 'number' ? raw.silenceRatio : null;
  const transcriptLength = typeof raw.transcriptLength === 'number' ? raw.transcriptLength : null;

  return {
    id: raw.id,
    analyzedAtIso: raw.analyzedAtIso,
    provider: raw.provider,
    averageMeteringDb,
    silenceRatio,
    transcriptLength,
    confidence: raw.confidence,
    engagementEstimate: raw.engagementEstimate,
    toneEstimate: raw.toneEstimate,
    paceEstimate: raw.paceEstimate,
    tendencySummary: raw.tendencySummary,
  };
}

function parseSession(raw: unknown): EvaluationSessionRecord | null {
  if (!isRecord(raw)) {
    return null;
  }

  if (
    typeof raw.id !== 'string' ||
    typeof raw.sourceSessionFingerprint !== 'string' ||
    typeof raw.createdAtIso !== 'string' ||
    typeof raw.updatedAtIso !== 'string'
  ) {
    return null;
  }

  const endedAtIso = typeof raw.endedAtIso === 'string' ? raw.endedAtIso : null;

  const labels = isRecord(raw.labels)
    ? {
        silenceLabeled: Boolean(raw.labels.silenceLabeled),
        speakerTurnsLabeled: Boolean(raw.labels.speakerTurnsLabeled),
        sentimentLabeled: Boolean(raw.labels.sentimentLabeled),
      }
    : createDefaultLabelProgress();

  const rawChunks = Array.isArray(raw.chunks) ? raw.chunks : [];
  const chunks = rawChunks.map(parseChunk).filter((chunk): chunk is EvaluationChunkRecord => chunk !== null);

  return {
    id: raw.id,
    sourceSessionFingerprint: raw.sourceSessionFingerprint,
    createdAtIso: raw.createdAtIso,
    updatedAtIso: raw.updatedAtIso,
    endedAtIso,
    labels,
    chunks,
  };
}

function parseDataset(rawJson: string): EvaluationDataset {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return createEmptyEvaluationDataset();
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.sessions)) {
    return createEmptyEvaluationDataset();
  }

  const sessions = parsed.sessions
    .map(parseSession)
    .filter((session): session is EvaluationSessionRecord => session !== null)
    .slice(0, MAX_SESSION_COUNT);

  return {
    schemaVersion: 1,
    sessions,
  };
}

export class LocalEvaluationDatasetAdapter implements EvaluationDatasetPort {
  private readonly appDirectory = new Directory(Paths.document, APP_CACHE_DIRECTORY_NAME);
  private readonly datasetFile = new File(this.appDirectory, EVALUATION_DATASET_FILE_NAME);

  async loadDataset(): Promise<EvaluationDataset> {
    if (!this.datasetFile.exists) {
      return createEmptyEvaluationDataset();
    }

    try {
      return parseDataset(await this.datasetFile.text());
    } catch {
      return createEmptyEvaluationDataset();
    }
  }

  async saveDataset(dataset: EvaluationDataset): Promise<void> {
    if (!this.appDirectory.exists) {
      this.appDirectory.create({ idempotent: true, intermediates: true });
    }

    if (!this.datasetFile.exists) {
      this.datasetFile.create({ intermediates: true, overwrite: true });
    }

    const trimmedDataset: EvaluationDataset = {
      schemaVersion: 1,
      sessions: dataset.sessions.slice(0, MAX_SESSION_COUNT),
    };

    this.datasetFile.write(JSON.stringify(trimmedDataset));
  }
}
