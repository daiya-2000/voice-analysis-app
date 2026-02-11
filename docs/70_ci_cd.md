# CI / CD Policy

## 1. 目的

本プロジェクトのCI/CDは以下を目的とする：

- AI駆動開発による品質低下を防ぐ
- mainブランチを常にデプロイ可能な状態に保つ
- Expoアプリのビルド失敗を早期検出する
- Supabase Edge Functions の安全な更新
- AI分析パイプラインの破壊的変更を防止する

---

## 2. 全体構成

Repository:
- GitHub

CI:
- GitHub Actions

CD:
- Expo EAS Build
- Supabase CLI Deploy

---

## 3. ブランチ戦略

main:
- 常にデプロイ可能状態
- 直接push禁止

develop:
- 開発統合ブランチ

feature/*:
- 機能開発用

---

## 4. CI（Pull Request時）

PR作成時に以下を自動実行：

### 4.1 Install
npm ci


### 4.2 Type Check


npm run typecheck


### 4.3 Lint


npm run lint


### 4.4 Test


npm test


---

## 5. CI失敗条件

以下の場合PRはマージ不可：

- TypeScriptエラー
- Lintエラー
- Unit Test失敗
- Domain/Application層のテスト不足

---

## 6. CD（Deploy Flow）

### 6.1 Expo App

Trigger:
- main ブランチへのマージ

Process:
1. EAS Build 実行
2. OTA Update（MVP段階）
3. 必要に応じてストア配布

Command:


npx expo prebuild
npx eas build


---

### 6.2 Supabase Edge Functions

Trigger:
- main マージ後

Command:


supabase functions deploy


---

## 7. AI関連コードのCIルール（重要）

以下の変更は必ずレビュー対象：

- speaker diarization 処理変更
- sentiment analysis モデル変更
- inference API変更

理由：
AI精度低下はCIでは検知できないため。

---

## 8. GitHub Actions構成例



.github/workflows/ci.yml


---

## 9. CI実行順序

1. Install
2. Typecheck
3. Lint
4. Test
5. Build Check (Expo)

---

## 10. 将来拡張（MVP後）

- Preview build（PRごとのExpo build）
- AI推論負荷テスト
- E2Eテスト（Detox）

MVPでは未実装。