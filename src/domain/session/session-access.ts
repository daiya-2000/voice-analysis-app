const SESSION_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const SESSION_CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const JOIN_PASSWORD_PATTERN = /^[A-Z0-9]{6}$/;

function randomChars(length: number): string {
  let value = '';

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * SESSION_CHARSET.length);
    value += SESSION_CHARSET[randomIndex];
  }

  return value;
}

export function generateSessionCode(): string {
  return `${randomChars(4)}-${randomChars(4)}`;
}

export function generateSessionJoinPassword(): string {
  return randomChars(6);
}

export function normalizeSessionCode(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeSessionJoinPassword(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidSessionCode(value: string): boolean {
  return SESSION_CODE_PATTERN.test(value);
}

export function isValidSessionJoinPassword(value: string): boolean {
  return JOIN_PASSWORD_PATTERN.test(value);
}

export function buildSessionJoinPayload(sessionCode: string): string {
  const query = new URLSearchParams({
    sessionCode,
  });

  return `voiceanalysisapp://observer-setup?${query.toString()}`;
}
