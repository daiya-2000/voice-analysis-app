# Issue: `voice-enroll` を JWT検証あり運用へ移行（サーバー側トークン発行フロー）

## 推奨メタ情報
- Labels: `security`, `backend`, `supabase`, `edge-function`
- Priority: `high`
- Owner: `unassigned`

## 背景
現在の `voice-enroll` は `--no-verify-jwt` で運用しており、匿名クライアントから直接呼べる状態。
本番運用では不正呼び出し耐性が不足するため、JWT検証を有効化した構成に移行する。

## 目的
- `voice-enroll` を `verify_jwt = true` で運用する
- クライアントはサーバー側（Edge Function）で発行された短命トークン経由でのみ分析実行可能にする
- Observer と Detected Speaker の概念分離を維持しつつ、セッション参加者のみ利用できるようにする

## スコープ
- 含む:
  - トークン発行用フローの実装（server-side issuance）
  - `voice-enroll` 側の JWT検証有効化
  - セッション参加チェック（Observerとして正当か）
  - 監査ログ（誰がいつ発行・利用したか）
- 含まない:
  - UIデザイン刷新
  - Hugging Faceモデル選定の変更

## 実装タスク
1. トークン仕様設計
- 有効期限（例: 5分）
- 必須クレーム（observer_id, session_code, role, nonce）
- 署名鍵とローテーション方針

2. サーバー側トークン発行API追加
- Edge Function例: `issue-observer-token`
- 入力: session_code, observer_profile_id, client nonce
- 出力: 短命JWT
- 発行前に `observer_profiles` で参加可否を検証

3. `voice-enroll` の認可強化
- `verify_jwt = true` で再デプロイ
- JWTクレームを検証し、セッション不一致を拒否
- claim の observer_id と request body の observerId が一致しない場合は拒否

4. クライアントフロー変更
- `voice-enroll` 実行前にトークン発行APIを呼ぶ
- 発行トークンを `Authorization: Bearer` で送信
- 期限切れ時の再発行リトライ

5. セキュリティテスト
- トークン無し/改ざん/期限切れ/他セッション利用をすべて失敗させる
- 正常系のみ通ることを確認

6. 運用手順更新
- ` docs/100_supabase_hf_setup.md` から `--no-verify-jwt` を除去
- 秘密情報管理手順（secrets）を更新

## 受け入れ条件
- `voice-enroll` は JWT無しリクエストを 401/403 で拒否する
- 正規フロー（トークン発行→音声登録）のみ成功する
- ログで observer/session 単位の追跡が可能
- `npm run typecheck`, `npm run lint`, `npm test` が通る

## 依存・前提
- Supabase Edge Functions secrets が設定済み
- セッション参加情報を参照できるテーブルが存在

## リスク
- トークン実装ミスで全リクエストが拒否される可能性
- トークン再発行ロジック不足によるUX劣化

## 完了定義
- 本番相当環境で `verify_jwt = true` のまま E2E が成功
- `--no-verify-jwt` 運用を完全廃止

## 実行チェックリスト
- [ ] トークン仕様（exp/claims/nonce）を設計し合意
- [ ] `issue-observer-token` を実装して配備
- [ ] `voice-enroll` を JWT 検証ありで再デプロイ
- [ ] クライアントを Bearer トークンフローへ移行
- [ ] 期限切れ/改ざん/他セッションの拒否をテスト
- [ ] ` docs/100_supabase_hf_setup.md` を更新
