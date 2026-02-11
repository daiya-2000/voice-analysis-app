# AGENTS.md（AIエージェント向け開発指示 / Supabase + Expo + Hugging Face）

このリポジトリは **Supabase + React Native(Expo) + Hugging Face AI** を用いた
リアルタイム音声分析アプリです。

CodeX / Codex などのAIエージェントは、必ず本ファイルおよび `/docs` 配下の仕様に従って作業してください。 :contentReference[oaicite:0]{index=0}

---

## 0. 最重要（このプロジェクトの勝ち筋）
- **UXポリシー**：AIは「正解」や「断定」を出さず、**推定・傾向**として提示する  
- **概念分離**：Observer（閲覧者）と Detected Speaker（分析対象）を混同しない  
- **アーキテクチャ固定**：presentation → application → domain（外部は adapters）  
- **無料優先**：MVPでは無料枠 / OSS / 最小構成を優先

---

## 1. アプリ概要（短縮）
会話音声を解析し、**場の雰囲気**と**個人（話者）の感情傾向**をリアルタイム表示する。
ただし **AIは断定しない**。結果は「ヒント」「参考情報」。

---

## 2. 用語（絶対に守る）
### 2.1 Observer（観測者 / 閲覧者）
- QRでセッション参加するユーザー
- **分析結果を見る側**
- **分析対象ではない**

### 2.2 Detected Speaker（検出話者 / 分析対象）
- 音声から自動検出された話者（話者A / 話者B …）
- **感情分析対象**
- アカウントやQR参加と無関係

> 重要：Observer と Detected Speaker を混同しない（UIやDBでも概念を分ける）

---

## 3. 採用アーキテクチャ（固定）
依存方向は内向き：

- `presentation` → `application` → `domain`

外部接続（Supabase / Hugging Face / Expo APIs）は `adapters` に隔離する。

### 3.1 層の責務
- `src/domain/**`：純粋な概念（Entity / Value / Policy）。外部SDK禁止
- `src/application/**`：ユースケース（フロー制御）。domainを組み合わせる
- `src/adapters/**`：外部接続（supabase / ai / audio / realtime）
- `src/presentation/**`：UI。薄くusecaseを呼ぶだけ

---

## 4. フォルダ構成（必須）
- domain: `src/domain/**`
- application: `src/application/**`
- adapters: `src/adapters/**`
  - `supabase/`（DB, Realtime, Edge Functions呼び出し）
  - `ai/`（Hugging Face など推論I/F）
  - `audio/`（Expo録音/チャンク化I/F）
- presentation: `src/presentation/**`（screens/components/hooks）

---

## 5. 禁止事項（破ったらNG）
- `presentation` から Supabase クライアントを直接呼ばない
- `presentation` から Hugging Face / 外部AI API を直接呼ばない
- `domain` で Supabase / Hugging Face / Expo API を参照しない
- UIにビジネスロジック（話者分離、感情集計、権限判定）を書かない
- Observer を「分析対象」として扱わない（Detected Speakerと混同しない）
- 個人ランキング / スコアで優劣を作らない

---

## 6. AI分析ポリシー（最重要）
### 6.1 絶対禁止（断定・ジャッジ）
- 「好意がある」「興味がない」等の断定
- 勝敗・ランキング・順位付け
- AIの結果を真実として扱うUI/文言

### 6.2 許可（soft insight）
- 「ポジティブ傾向」
- 「関心が高そう」
- 「反応が増加」
- 「エンゲージメント高め」

> 表示・APIレスポンスのフィールド名も「estimate」「tendency」「confidence」等、断定にならない命名にする

---

## 7. MVP 技術構成（想定）
- Frontend：React Native (Expo)
- Backend：Supabase（DB / Realtime / Edge Functions）
- AI：Hugging Face Inference（話者分離 / STT / 感情推定）

### 7.1 モデル呼び出しの方針
- Expo（フロント）→ **Supabase Edge Function** → Hugging Face
- APIキーはフロントに置かない（Edge Functionで秘匿）

---

## 8. データフロー（MVP）
1) Expoで録音（チャンク化）  
2) チャンクをEdge Functionへ送信  
3) Edge Functionが推論（話者分離 → テキスト化 → 感情推定）  
4) 結果をSupabase Realtime/DB経由で配信  
5) Observerがダッシュボードで閲覧

---

## 9. テスト方針（必須）
- `domain` / `application` は単体テスト対象（外部依存なし）
- `adapters` はモック可能にして、必要なら統合テスト
- AI推論の「正確性」はテスト対象外（モックで固定）

---

## 10. CI/CD（必須）
PRで最低限これを通す（CIが落ちるPRはマージ不可）：
- `npm run typecheck`
- `npm run lint`
- `npm test`

CD（mainマージ後）：
- Expo（EAS）ビルド/配布（MVPはOTA中心でも可）
- Supabase Edge Functions deploy（必要時）

---

## 11. AIエージェントの期待アウトプット（新規機能）
新規機能追加時は可能な限り以下をセットで追加する：
1) domainの概念（entity/value/policy）
2) applicationのusecase
3) adaptersのI/F or 実装
4) presentationは薄い呼び出し
5) 単体テスト（最低1つ）

---

## 12. 作業手順（AIが守る）
1) 仕様確認：AGENTS.md と `/docs` を読む  
2) 変更方針：影響範囲と設計（どの層に何を置くか）を宣言  
3) 実装：層を守って最小差分で進める  
4) 検証：typecheck/lint/testを実行し、落ちたら修正  
5) PR本文：PRテンプレを埋める（`Observer` と `Detected Speaker` 分離・断定禁止の自己チェックを含める）

---

# 13. CodeX / Codex 用 System Prompt（貼り付け用）
> これは **CodeXの system prompt / custom instructions** に貼り付けて使う前提です。  
> 目的は「勝手にアーキテクチャを変えない」「仕様を断定表現にしない」こと。  
> CodexがAGENTS.mdを参照して作業する仕組みについては公式ガイド参照。 :contentReference[oaicite:1]{index=1}

```text
あなたはこのリポジトリのAI開発エージェントです。最優先でAGENTS.mdとdocs配下の仕様に従ってください。

【絶対ルール】
- アーキテクチャ（presentation → application → domain、外部はadapters）を変更しない。層の責務を守る。
- presentationからSupabase/AI APIを直接呼ばない。domainで外部SDK参照は禁止。
- Observer（QR参加＝閲覧者）と Detected Speaker（音声検出＝分析対象）を絶対に混同しない。
- AI結果は「推定/傾向」として提示し、断定・判定・ランキング・勝敗構造を作らない。

【作業の進め方】
1) まず変更方針を短く宣言する（どの層に何を追加/変更するか）。
2) 既存構造を尊重し、最小差分で実装する（不要なリファクタ禁止）。
3) 可能ならテストを1つ以上追加（domain/applicationを優先）。
4) 変更後は typecheck/lint/test を実行し、失敗したら修正する。
5) PR本文はテンプレを埋める形で、特に「断定禁止」「Observer/Detected Speaker分離」「依存方向」を自己チェックして記載する。

【不明点の扱い】
- 仕様が曖昧な場合は、勝手に決めずに “前提” を明示して進める（または質問する）。
- セキュリティ（APIキー/音声データ）に関わることは安全側に倒す。フロントに秘密情報を置かない。
```
---

# 14. 参照ドキュメント（docs/

* docs/10_architecture.md
* docs/20_directory_structure.md
* docs/30_testing_policy.md
* docs/40_ai_pipeline.md
* docs/60_ai_analysis_policy.md
* docs/70_ci_cd.md
* docs/80_ai_pr_template_usage.md