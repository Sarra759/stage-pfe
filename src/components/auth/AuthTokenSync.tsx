import React from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useAuthPersistStore } from './hooks/stores/useAuthPersistStore';

export function AuthTokenSync() {
  const { data: session, status } = useSession();
  const authPersistStore = useAuthPersistStore();

  React.useEffect(() => {
    if (
      status === 'authenticated' &&
      (session as any)?.access_token &&
      (session as any)?.refresh_token
    ) {
      authPersistStore.setAccessToken((session as any).access_token);
      authPersistStore.setRefreshToken((session as any).refresh_token);
      authPersistStore.setAuthenticated(true);
    }
  }, [session, status]);

  return null;
}