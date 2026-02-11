import {
  parseSessionJoinLink,
  type ParsedSessionJoinLink,
} from '@/src/domain/session/session-join-link';

export class ParseSessionJoinLinkUseCase {
  execute(rawValue: string): ParsedSessionJoinLink | null {
    return parseSessionJoinLink(rawValue);
  }
}
