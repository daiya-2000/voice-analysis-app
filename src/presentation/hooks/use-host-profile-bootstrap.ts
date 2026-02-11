import { useEffect, useMemo, useState } from 'react';

import { LocalHostProfileCacheAdapter } from '@/src/adapters/storage/local-host-profile-cache.adapter';
import { LoadHostProfileUseCase } from '@/src/application/usecases/load-host-profile.usecase';

export function useHostProfileBootstrap() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasHostProfile, setHasHostProfile] = useState(false);

  const loadHostProfileUseCase = useMemo(
    () => new LoadHostProfileUseCase(new LocalHostProfileCacheAdapter()),
    []
  );

  useEffect(() => {
    let isMounted = true;

    loadHostProfileUseCase
      .execute()
      .then((profile) => {
        if (!isMounted) {
          return;
        }

        setHasHostProfile(Boolean(profile));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setHasHostProfile(false);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadHostProfileUseCase]);

  return { hasHostProfile, isLoading };
}
