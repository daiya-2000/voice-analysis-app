import { isValidSessionCode, normalizeSessionCode } from '@/src/domain/session/session-access';

export interface ParsedSessionJoinLink {
  sessionCode: string;
}

function normalizeCandidate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.trim().toUpperCase();
}

function parseQueryString(rawValue: string): URLSearchParams | null {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('?')) {
    const query = trimmed.slice(trimmed.indexOf('?') + 1);
    return new URLSearchParams(query);
  }

  if (trimmed.includes('=')) {
    return new URLSearchParams(trimmed);
  }

  return null;
}

export function parseSessionJoinLink(rawValue: string): ParsedSessionJoinLink | null {
  const query = parseQueryString(rawValue);

  if (query) {
    const sessionCode = normalizeCandidate(query.get('sessionCode'));

    if (sessionCode && isValidSessionCode(sessionCode)) {
      return { sessionCode };
    }
  }

  const normalized = normalizeSessionCode(rawValue);
  if (isValidSessionCode(normalized)) {
    return { sessionCode: normalized };
  }

  const tupleMatch = normalized.match(/^([A-Z0-9]{4}-[A-Z0-9]{4})[\s,:/\\|]+([A-Z0-9]{6})$/);

  if (!tupleMatch) {
    return null;
  }

  const [, sessionCode] = tupleMatch;

  return { sessionCode };
}
