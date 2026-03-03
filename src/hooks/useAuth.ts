import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useRequireAuth(redirectTo: string = '/login') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

export function useRequireRole(roles: string[], redirectTo: string = '/') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !roles.includes(user.role))) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo, roles]);

  return { user, loading };
}
