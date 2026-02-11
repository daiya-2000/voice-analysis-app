import { AVATAR_PRESETS, type AvatarPreset } from '@/src/domain/profile/avatar-preset';

export class GetAvatarPresetsUseCase {
  execute(): AvatarPreset[] {
    return AVATAR_PRESETS;
  }
}
