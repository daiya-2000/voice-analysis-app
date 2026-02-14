# Evaluation Baseline Guide

## 目的
- 10〜20セッション分の匿名化評価データを収集し、現状精度のベースラインを比較可能にする。

## 収集データ（匿名）
- `sourceSessionFingerprint`: セッションコードのハッシュ（元コードは保存しない）
- `chunks`: 解析チャンクごとの特徴量
  - `averageMeteringDb`
  - `silenceRatio`
  - `transcriptLength`
  - `confidence`
  - `engagement/tone/pace/tendency` の推定文言

## 人手ラベル定義
- `silenceLabeled`: 無音区間ラベルの付与完了
- `speakerTurnsLabeled`: 話者交代ラベルの付与完了
- `sentimentLabeled`: 大まかな感情傾向ラベルの付与完了

## 運用フロー
1. ライブセッションを実行（データは自動で匿名収集）
2. 「データ表示」画面で収集セッションを確認
3. ラベル付与が完了した項目をトグルで `完了` に更新
4. ベースライン（平均無音比/平均信頼度/モック比）を確認し改善前後を比較

## 受け入れ基準（#10）
- 10〜20セッション収集の進捗が画面で確認できる
- ラベル定義が文書化されている
- ベースライン指標を再現可能な方法で確認できる
