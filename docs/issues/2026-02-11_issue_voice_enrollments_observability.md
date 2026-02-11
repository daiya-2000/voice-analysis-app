# Issue: `voice_enrollments` に処理トレーサビリティ列を追加（processing_status / hf_model / error_message）

## 推奨メタ情報
- Labels: `backend`, `database`, `observability`, `supabase`
- Priority: `medium`
- Owner: `unassigned`

## 背景
現状の `voice_enrollments` は成功・失敗の追跡情報が不足し、推論失敗時の原因切り分けに時間がかかる。
`processing_status`, `hf_model`, `error_message` を保存し、運用時の可観測性を高める。

## 目的
- 音声登録処理の成否を DB で明確に追跡できるようにする
- どの Hugging Face モデルで処理したかを記録する
- 失敗理由を保存して再現・調査を容易にする

## スコープ
- 含む:
  - DBマイグレーション追加
  - Edge Function の保存ロジック更新
  - adapter/application のレスポンス反映
  - 障害時ログ導線の整備
- 含まない:
  - BIダッシュボード構築
  - 感情推定アルゴリズム変更

## 実装タスク
1. DBスキーマ拡張
- `voice_enrollments` に以下を追加
  - `processing_status text not null default 'pending'`
  - `hf_model text`
  - `error_message text`
- `processing_status` は `pending|success|failed` のCHECK制約
- 必要インデックス（status, created_at）を追加

2. Edge Function更新（`voice-enroll`）
- 開始時: `pending` でレコード作成（または upsert）
- 成功時: `success`, `hf_model`, `tendency_summary`, `confidence` を更新
- 失敗時: `failed`, `error_message` を更新

3. モデル名の保存ルール
- ASR/感情推定のモデルIDを `hf_model` に規約化して保存
  - 例: `asr=openai/whisper-large-v3;sentiment=daigo/bert-base-japanese-sentiment`

4. クライアント表示改善
- 失敗時に `error_message` 相当の診断情報を表示
- 断定表現を避けた文言のままにする（傾向/推定）

5. テスト追加
- success path: `processing_status=success`
- failure path: `processing_status=failed` + `error_message` 保存
- マイグレーション適用後の型整合性確認

6. ドキュメント更新
- ` docs/100_supabase_hf_setup.md` に新カラムと確認SQLを追記

## 受け入れ条件
- SQLで成功/失敗件数が即時確認できる
- 失敗レコードに `error_message` が保存される
- 成功レコードに `hf_model` が保存される
- `npm run typecheck`, `npm run lint`, `npm test` が通る

## 確認SQL
```sql
select processing_status, count(*)
from public.voice_enrollments
group by processing_status;

select id, processing_status, hf_model, error_message, created_at
from public.voice_enrollments
order by created_at desc
limit 20;
```

## リスク
- 既存レコードとの互換性（NOT NULL/DEFAULT）
- 失敗時更新漏れによる `pending` 残留

## 完了定義
- 本番相当の失敗ケースで `failed + error_message` が確実に残る
- 主要運用クエリで障害原因を5分以内に特定できる

## 実行チェックリスト
- [ ] DB マイグレーションを追加して適用
- [ ] `voice-enroll` の pending/success/failed 更新を実装
- [ ] `hf_model` 保存ルールを規約化
- [ ] 失敗時の `error_message` 保存を実装
- [ ] success/failure のテストを追加
- [ ] ` docs/100_supabase_hf_setup.md` を更新
