import type { LiveAudioAnalysisPort } from '@/src/application/ports/live-audio-analysis.port';
import type {
  LiveAudioAnalysisRequest,
  LiveAudioAnalysisResult,
} from '@/src/domain/analysis/live-audio-analysis';
import { resolveLiveAnalysisLabels } from '@/src/domain/analysis/live-analysis-labels';
import { resolveLiveAudioSignalProfile } from '@/src/domain/analysis/live-audio-signal';

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function hashSeed(input: string): number {
  let seed = 0;

  for (let index = 0; index < input.length; index += 1) {
    seed = (seed * 31 + input.charCodeAt(index)) >>> 0;
  }

  return seed;
}

export class MockLiveAudioAnalysisAdapter implements LiveAudioAnalysisPort {
  async analyzeLiveAudioSample(
    request: LiveAudioAnalysisRequest
  ): Promise<LiveAudioAnalysisResult> {
    const durationSec = Math.max(1, request.sample.durationMs / 1000);
    const payloadLength = request.sample.base64Audio.length;
    const payloadPerSecond = payloadLength / durationSec;
    const timeBucket = Math.floor(Date.now() / 20_000);
    const head = request.sample.base64Audio.slice(0, 256);
    const tail = request.sample.base64Audio.slice(-256);
    const seed = hashSeed(
      `${head}:${tail}:${payloadLength}:${request.sample.averageMeteringDb ?? 'na'}:${request.sample.dynamicRangeDb ?? 'na'}:${timeBucket}`
    );

    const averageMeteringDb = request.sample.averageMeteringDb ?? -45;
    const silenceRatio = request.sample.silenceRatio ?? 0.5;
    const peakMeteringDb = request.sample.peakMeteringDb ?? averageMeteringDb;
    const dynamicRangeDb = request.sample.dynamicRangeDb ?? 0;

    const densityActivity = clamp01((payloadPerSecond - 2800) / 17000);
    const signalProfile = resolveLiveAudioSignalProfile({
      averageMeteringDb,
      silenceRatio,
      peakMeteringDb,
      dynamicRangeDb,
      transcriptActivity: densityActivity,
      seed,
    });

    const labels = resolveLiveAnalysisLabels({
      silenceLikely: signalProfile.silenceLikely,
      engagementScore: signalProfile.engagementScore,
      toneScore: signalProfile.toneScore,
      paceScore: signalProfile.paceScore,
      seed,
    });

    const tendencySummary = signalProfile.silenceLikely
      ? '発話が少なめの区間が続いている傾向'
      : `${labels.engagementEstimate} / ${labels.toneEstimate} / ${labels.paceEstimate}`;
    const confidenceBase = signalProfile.silenceLikely ? 0.38 : 0.46;
    const confidence = Math.min(0.9, confidenceBase + signalProfile.engagementScore * 0.35);

    return {
      engagementEstimate: labels.engagementEstimate,
      toneEstimate: labels.toneEstimate,
      paceEstimate: labels.paceEstimate,
      tendencySummary,
      confidence,
      averageMeteringDb,
      silenceRatio,
      transcriptLength: 0,
      analyzedAtIso: new Date().toISOString(),
      provider: 'mock',
    };
  }
}
