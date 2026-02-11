export interface VoicePrompt {
  id: string;
  text: string;
  objective: string;
}

export const VOICE_SAMPLE_PROMPTS: VoicePrompt[] = [
  {
    id: 'neutral-1',
    text: '本日はご参加ありがとうございます。これからセッションを開始します。',
    objective: '標準的な話速と声量を取得',
  },
  {
    id: 'neutral-2',
    text: '私は落ち着いたペースで、はっきりとした発音を意識して話します。',
    objective: '明瞭な子音と母音を取得',
  },
  {
    id: 'neutral-3',
    text: 'この音声サンプルは話者識別の推定精度向上のために利用されます。',
    objective: '長音と連続音の特徴量を取得',
  },
];
