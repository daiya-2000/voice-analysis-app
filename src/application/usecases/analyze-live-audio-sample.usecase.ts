import type { LiveAudioAnalysisPort } from '@/src/application/ports/live-audio-analysis.port';
import type {
  LiveAudioAnalysisRequest,
  LiveAudioAnalysisResult,
} from '@/src/domain/analysis/live-audio-analysis';

export class AnalyzeLiveAudioSampleUseCase {
  constructor(private readonly liveAudioAnalysisPort: LiveAudioAnalysisPort) {}

  async execute(request: LiveAudioAnalysisRequest): Promise<LiveAudioAnalysisResult> {
    return this.liveAudioAnalysisPort.analyzeLiveAudioSample(request);
  }
}
