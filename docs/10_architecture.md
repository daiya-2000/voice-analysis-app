# Architecture

## 概要

本アプリはリアルタイム音声分析アプリであり、以下の構成を採用する。

Frontend:
- React Native (Expo)

Backend:
- Supabase (Database + Edge Functions)

AI Processing:
- Hugging Face Inference API

---

## データフロー

1. Expoで音声録音
2. 音声チャンクをSupabase Edge Functionへ送信
3. Edge FunctionがAI推論を呼び出す
   - Speaker Diarization
   - Speech-to-Text
   - Sentiment Analysis
4. 分析結果をSupabase経由でクライアントへ返却

---

## 分離原則

- UIは分析内容を知らない
- application がフローを管理
- domain は概念のみ保持

---

## 主要概念

Observer:
QRで参加し分析結果を見るユーザー

Detected Speaker:
音声から自動検出された話者

Session:
分析単位
