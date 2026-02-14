import assert from 'node:assert/strict';
import test from 'node:test';

import { toObserverProfileRegistrationErrorMessage } from '@/src/application/policies/profile-registration-error-policy';

test('toObserverProfileRegistrationErrorMessage returns actionable message for missing observer_profiles table', () => {
  const message = toObserverProfileRegistrationErrorMessage({
    code: 'PGRST205',
    message: "Could not find the table 'public.observer_profiles' in the schema cache",
  });

  assert.match(message, /public\.observer_profiles/);
  assert.match(message, /supabase\/migrations\/20260211093000_create_voice_enrollment_tables\.sql/);
  assert.match(message, /supabase db push/);
});

test('toObserverProfileRegistrationErrorMessage keeps original message for other errors', () => {
  const message = toObserverProfileRegistrationErrorMessage({
    code: '23505',
    message: 'duplicate key value violates unique constraint',
  });

  assert.equal(
    message,
    'Failed to register observer profile: duplicate key value violates unique constraint'
  );
});

