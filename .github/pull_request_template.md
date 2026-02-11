# 🤖 AI-Driven PR Template

## 0. 概要（1〜3行）
- 何を実現するPRか：
- ユーザー価値 / UXの変化：

---

## 1. 変更タイプ（該当するものに ✅）
- [ ] 新機能
- [ ] バグ修正
- [ ] リファクタ
- [ ] ドキュメント
- [ ] CI/CD
- [ ] その他：

---

## 2. 要件 / 仕様リンク
- 関連ドキュメント：docs/（例：docs/10_architecture.md, docs/60_ai_analysis_policy.md）
- 仕様（該当する箇条書き）：
  - 

---

## 3. アーキテクチャ遵守チェック（必須）
### 3.1 依存方向
- [ ] presentation → application → domain の依存方向を守った
- [ ] domain に Supabase / HuggingFace / Expo API 参照がない
- [ ] presentation から Supabase / AI を直接呼んでいない（usecase経由）

### 3.2 フォルダ配置
- [ ] domain: `src/domain/**` に概念を追加/更新
- [ ] application: `src/application/**` にusecaseを追加/更新
- [ ] adapters: `src/adapters/**` に外部I/Fまたは実装を追加/更新
- [ ] presentation: UIは薄い呼び出しのみ

---

## 4. 仕様の重要ポイント（AIが間違えやすい所）
> ここはレビュー最重要。AIが「勝手に断定」や「ゲーム化」を混ぜていないか確認する。

- [ ] AI結果は「推定/傾向」として表示（断定しない）
- [ ] ランキング/スコアリング/勝敗の構造を作っていない
- [ ] 個人評価は可だが、確定表現は禁止（例：好意がある/ない等）
- [ ] 「Observer（QR参加者）」と「Detected Speakers（音声検出対象）」を分離した

---

## 5. UI/UX 変更点（スクショ or 文章）
- Before：
- After：
- 画面：Home / Lobby / Recording / Dashboard（該当箇所だけ）

---

## 6. 実装詳細（差分の読み方）
### 追加 / 変更した主要ファイル
- domain:
  - 
- application:
  - 
- adapters:
  - 
- presentation:
  - 

### 重要なロジック（簡潔に）
- 

---

## 7. 動作確認（必須）
- [ ] iOS（Simulator/実機）：OK / 未確認
- [ ] Android（Emulator/実機）：OK / 未確認
- [ ] ローカル起動：`npx expo start`
- [ ] Edge Functions（該当時）：ローカル or デプロイ確認

---

## 8. テスト（必須）
- [ ] `npm test` 実行結果：PASS / 未実行（理由：）
- 追加したテスト：
  - 

---

## 9. セキュリティ / 秘密情報（必須）
- [ ] APIキーをフロントに置いていない
- [ ] `.env` や秘密情報のコミットがない
- [ ] 音声データの保存方針を逸脱していない（MVPは最小限）

---

## 10. 影響範囲 / リスク
- 影響範囲：
- リスク：
- ロールバック手順（必要なら）：

---

## 11. レビュアーに見てほしい点（最重要）
- ここだけは必ず見てほしい：
  1) 
  2) 
