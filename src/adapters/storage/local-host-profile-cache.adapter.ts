import { Directory, File, Paths } from 'expo-file-system';

import type { HostProfileCachePort } from '@/src/application/ports/host-profile-cache.port';
import type { PersistedHostProfile } from '@/src/domain/profile/persisted-host-profile';

const APP_CACHE_DIRECTORY_NAME = 'voice-analysis-app';
const HOST_PROFILE_FILE_NAME = 'host-profile.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parsePersistedHostProfile(rawJson: string): PersistedHostProfile | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) {
    return null;
  }

  if (parsed.observerRole !== 'host') {
    return null;
  }

  if (typeof parsed.displayName !== 'string' || typeof parsed.avatarPresetId !== 'string') {
    return null;
  }

  if (typeof parsed.updatedAtIso !== 'string') {
    return null;
  }

  if (parsed.observerId !== undefined && typeof parsed.observerId !== 'string') {
    return null;
  }

  return {
    observerId: parsed.observerId,
    observerRole: 'host',
    displayName: parsed.displayName,
    avatarPresetId: parsed.avatarPresetId,
    updatedAtIso: parsed.updatedAtIso,
  };
}

export class LocalHostProfileCacheAdapter implements HostProfileCachePort {
  private readonly appDirectory = new Directory(Paths.document, APP_CACHE_DIRECTORY_NAME);
  private readonly hostProfileFile = new File(this.appDirectory, HOST_PROFILE_FILE_NAME);

  async loadHostProfile(): Promise<PersistedHostProfile | null> {
    if (!this.hostProfileFile.exists) {
      return null;
    }

    try {
      const rawProfile = await this.hostProfileFile.text();
      return parsePersistedHostProfile(rawProfile);
    } catch {
      return null;
    }
  }

  async saveHostProfile(profile: PersistedHostProfile): Promise<void> {
    if (!this.appDirectory.exists) {
      this.appDirectory.create({ idempotent: true, intermediates: true });
    }

    if (!this.hostProfileFile.exists) {
      this.hostProfileFile.create({ intermediates: true, overwrite: true });
    }

    this.hostProfileFile.write(JSON.stringify(profile));
  }

  async clearHostProfile(): Promise<void> {
    if (!this.hostProfileFile.exists) {
      return;
    }

    this.hostProfileFile.delete();
  }
}
