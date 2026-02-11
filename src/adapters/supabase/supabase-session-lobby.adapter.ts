import type { RealtimeChannel } from '@supabase/supabase-js';

import type {
  CreateSessionLobbyRequest,
  CreateSessionLobbyResult,
  SessionLobbyPort,
  VerifySessionJoinPasswordRequest,
} from '@/src/application/ports/session-lobby.port';
import { getSupabaseClient } from '@/src/adapters/supabase/client';
import type { Observer } from '@/src/domain/analysis/entities';

interface ObserverProfileRow {
  id: string;
  display_name: string;
  observer_role: 'host' | 'observer';
  created_at: string;
}

function toAvatarLabel(observer: ObserverProfileRow, index: number): string {
  if (observer.observer_role === 'host') {
    return 'H';
  }

  return `O${(index + 1).toString().padStart(2, '0')}`;
}

function mapObservers(rows: ObserverProfileRow[]): Observer[] {
  return rows.map((row, index) => ({
    id: row.id,
    displayName: row.display_name,
    role: row.observer_role,
    isActive: true,
    avatarLabel: toAvatarLabel(row, index),
  }));
}

export class SupabaseSessionLobbyAdapter implements SessionLobbyPort {
  async createSessionLobby(request: CreateSessionLobbyRequest): Promise<CreateSessionLobbyResult> {
    const supabase = getSupabaseClient();

    let hostObserverId = request.hostObserverId?.trim();

    if (hostObserverId) {
      const { data, error } = await supabase
        .from('observer_profiles')
        .update({
          display_name: request.hostDisplayName,
          avatar_preset_id: request.hostAvatarPresetId,
          observer_role: 'host',
          session_code: request.sessionCode,
        })
        .eq('id', hostObserverId)
        .select('id')
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to update host profile: ${error.message}`);
      }

      if (!data) {
        const { data: insertedHost, error: insertError } = await supabase
          .from('observer_profiles')
          .insert({
            id: hostObserverId,
            display_name: request.hostDisplayName,
            avatar_preset_id: request.hostAvatarPresetId,
            observer_role: 'host',
            session_code: request.sessionCode,
          })
          .select('id')
          .single();

        if (insertError) {
          throw new Error(`Failed to insert host profile: ${insertError.message}`);
        }

        hostObserverId = insertedHost.id;
      }
    } else {
      const { data: insertedHost, error: insertError } = await supabase
        .from('observer_profiles')
        .insert({
          display_name: request.hostDisplayName,
          avatar_preset_id: request.hostAvatarPresetId,
          observer_role: 'host',
          session_code: request.sessionCode,
        })
        .select('id')
        .single();

      if (insertError) {
        throw new Error(`Failed to create host profile: ${insertError.message}`);
      }

      hostObserverId = insertedHost.id;
    }

    const { error: sessionError } = await supabase.from('session_lobbies').upsert(
      {
        session_code: request.sessionCode,
        join_password: request.joinPassword,
        qr_payload: request.qrPayload,
        host_observer_id: hostObserverId,
      },
      { onConflict: 'session_code' }
    );

    if (sessionError) {
      throw new Error(`Failed to create session lobby: ${sessionError.message}`);
    }

    if (!hostObserverId) {
      throw new Error('Failed to resolve host observer id.');
    }

    return {
      hostObserverId,
    };
  }

  async getObservers(sessionCode: string): Promise<Observer[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('observer_profiles')
      .select('id, display_name, observer_role, created_at')
      .eq('session_code', sessionCode)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to load observers: ${error.message}`);
    }

    return mapObservers((data as ObserverProfileRow[]) ?? []);
  }

  async verifySessionJoinPassword(request: VerifySessionJoinPasswordRequest): Promise<void> {
    const supabase = getSupabaseClient();

    const { data: sessionLobby, error } = await supabase
      .from('session_lobbies')
      .select('join_password')
      .eq('session_code', request.sessionCode)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to verify session password: ${error.message}`);
    }

    if (!sessionLobby) {
      throw new Error('セッションコードが見つかりません。');
    }

    if (sessionLobby.join_password !== request.joinPassword) {
      throw new Error('参加パスワードが正しくありません。');
    }
  }

  subscribeObservers(
    sessionCode: string,
    onUpdate: (observers: Observer[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const supabase = getSupabaseClient();

    const channel: RealtimeChannel = supabase
      .channel(`observer-profiles-${sessionCode}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'observer_profiles',
          filter: `session_code=eq.${sessionCode}`,
        },
        async () => {
          try {
            const observers = await this.getObservers(sessionCode);
            onUpdate(observers);
          } catch (error) {
            if (onError) {
              onError(
                error instanceof Error ? error : new Error('Failed to refresh observers in realtime')
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
