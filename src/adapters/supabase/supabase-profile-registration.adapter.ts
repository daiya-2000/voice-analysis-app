import type {
  ObserverProfileRegistrationRequest,
  ObserverProfileRegistrationResult,
  ProfileRegistrationPort,
} from '@/src/application/ports/profile-registration.port';
import { getSupabaseClient } from '@/src/adapters/supabase/client';

export class SupabaseProfileRegistrationAdapter implements ProfileRegistrationPort {
  async registerObserverProfile(
    request: ObserverProfileRegistrationRequest
  ): Promise<ObserverProfileRegistrationResult> {
    const supabase = getSupabaseClient();

    const payload = {
      display_name: request.displayName,
      avatar_preset_id: request.avatarPresetId,
      observer_role: request.observerRole,
      session_code: request.sessionCode ?? null,
    };

    const { data, error } = await supabase
      .from('observer_profiles')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to register observer profile: ${error.message}`);
    }

    return {
      observerId: data.id,
    };
  }
}
