# AI Pipeline

## 処理順

1. Speaker Diarization
音声を話者ごとに分離

2. Speech to Text
話者単位でテキスト化

3. Sentiment Analysis
テキストから感情傾向推定

---

## 使用技術（MVP）

- pyannote.audio (speaker diarization)
- Whisper系 STT
- Japanese sentiment model (BERT)

---

## 注意

AI結果は確定情報ではない。
