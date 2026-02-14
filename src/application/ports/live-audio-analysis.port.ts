import type {
  LiveAudioAnalysisRequest,
  LiveAudioAnalysisResult,
} from '@/src/domain/analysis/live-audio-analysis';

export interface LiveAudioAnalysisPort {
  analyzeLiveAudioSample(request: LiveAudioAnalysisRequest): Promise<LiveAudioAnalysisResult>;
}
