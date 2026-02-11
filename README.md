# voice-analysis-app

Supabase + Expo + Hugging Face を使ったリアルタイム音声分析アプリです。

## Setup

```bash
npm install
cp .env.example .env
```

`.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Run

```bash
npx expo start
```

## Architecture

- `src/domain`: 純粋な概念とポリシー
- `src/application`: ユースケース
- `src/adapters`: Supabase / AI / Audio 連携
- `src/presentation`: 画面実装

## Integration Notes

- フロントは Hugging Face を直接呼びません
- Supabase Edge Function `voice-enroll` 経由で推論します
- セットアップ詳細: ` docs/100_supabase_hf_setup.md`
