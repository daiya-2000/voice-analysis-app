# Supabase + Hugging Face 連携セットアップ

このアプリはフロントからHugging Faceへ直接アクセスしません。
必ず Supabase Edge Function (`voice-enroll`) を経由します。

## 1. 環境変数（Expo）

`.env` を作成し、以下を設定してください。

```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 2. Supabase テーブル

```sql
create table if not exists public.observer_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  avatar_preset_id text not null,
  observer_role text not null check (observer_role in ('host', 'observer')),
  session_code text,
  created_at timestamptz not null default now()
);
```

このリポジトリにはマイグレーションも含めています。

- `supabase/migrations/20260211093000_create_voice_enrollment_tables.sql`

## 3. Edge Function (`voice-enroll`) の例

フロントは以下 payload を `supabase.functions.invoke('voice-enroll')` で送信します。

```json
{
  "observerId": "uuid",
  "sessionCode": "A7B2-C8D4",
  "observerRole": "host",
  "displayName": "田中 太郎",
  "avatarPresetId": "forest",
  "scriptId": "neutral-1",
  "scriptText": "本日はご参加ありがとうございます。これからセッションを開始します。",
  "scriptObjective": "標準的な話速と声量を取得",
  "audioBase64": "...",
  "audioMimeType": "audio/m4a",
  "durationMs": 4200
}
```

返却値の想定:

```json
{
  "enrollmentId": "enroll_xxx",
  "tendencySummary": "話者特徴を登録しました",
  "confidence": 0.78
}
```

## 4. Hugging Face Secret

Edge Function 側に Hugging Face トークンを設定:

```bash
supabase secrets set HUGGING_FACE_API_KEY=hf_xxx
```

その後、Edge Function 内で Hugging Face Inference API を呼び出してください。

## 5. Deploy コマンド

```bash
supabase db push
supabase functions deploy voice-enroll --no-verify-jwt
```

## 6. 動作確認（必須）

```bash
# Function の呼び出しログ確認（CLI v2.75+）
supabase functions logs voice-enroll --follow
```

`unknown flag` になる場合は、Supabase CLIを更新するか Dashboard の `Edge Functions > voice-enroll > Logs` で確認してください。

アプリ画面で録音完了時に以下表示を確認:

- `Supabase Edge Function経由で推論を実行`
- エラー時は `Failed to register observer profile` や `Edge function voice-enroll failed` が表示される

Supabase SQL Editorで以下を実行して保存確認:

```sql
select count(*) from public.observer_profiles;
select count(*) from public.voice_enrollments;
```
