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

    if (request.observerRole === 'observer' && request.sessionCode) {
      const { data: sessionLobby, error: sessionError } = await supabase
        .from('session_lobbies')
        .select('session_code, join_password')
        .eq('session_code', request.sessionCode)
        .maybeSingle();

      if (sessionError) {
        throw new Error(`Failed to verify session: ${sessionError.message}`);
      }

      if (!sessionLobby) {
        throw new Error('セッションコードが見つかりません。');
      }

      if (!request.joinPassword || sessionLobby.join_password !== request.joinPassword) {
        throw new Error('パスワードが一致しません。再度QRコードを読み取り直してください。');
      }
    }

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
