const ASSERTIVE_TERMS = ['好意がある', '興味がない', 'ランキング', '勝敗', '断定', '確定'];

export function toSoftInsightText(value: string): string {
  if (value.endsWith('傾向') || value.endsWith('推定') || value.endsWith('高め')) {
    return value;
  }

  return `${value}傾向`;
}

export function assertSoftInsightText(value: string): void {
  const hasAssertiveTerm = ASSERTIVE_TERMS.some((term) => value.includes(term));

  if (hasAssertiveTerm) {
    throw new Error(`Soft insight policy violated: ${value}`);
  }
}
