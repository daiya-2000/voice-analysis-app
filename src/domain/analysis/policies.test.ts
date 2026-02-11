import assert from 'node:assert/strict';
import test from 'node:test';

import { assertSoftInsightText, toSoftInsightText } from '@/src/domain/analysis/policies';

test('toSoftInsightText appends 傾向 when suffix is missing', () => {
  assert.equal(toSoftInsightText('安定した会話ペース'), '安定した会話ペース傾向');
  assert.equal(toSoftInsightText('高いエンゲージメント'), '高いエンゲージメント傾向');
});

test('assertSoftInsightText throws when assertive wording exists', () => {
  assert.throws(() => assertSoftInsightText('好意がある'), /Soft insight policy violated/);
});
