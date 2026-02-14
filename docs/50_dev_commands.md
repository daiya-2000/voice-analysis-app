# Development Commands

Install:
npm ci

Start Expo:
npx expo start

Typecheck:
npm run typecheck

Lint:
npm run lint

Test:
npm test

Supabase auth ping (JWT切り分け):
supabase functions deploy auth-ping --no-verify-jwt
supabase functions deploy live-analyze --no-verify-jwt
# JWTありで auth-ping / live-analyze を叩く（CLI invoke未対応版）
npm run check:edge-auth
