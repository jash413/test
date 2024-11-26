// hooks/useCustomRouter.ts

import { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoading } from '@/components/LoadingProvider';

export const useCustomRouter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldRefresh = sessionStorage.getItem('shouldRefresh') === 'true';
      if (shouldRefresh) {
        sessionStorage.removeItem('shouldRefresh');
        setIsLoading(false); // Ensure loading state is reset
      }
    }
  }, [pathname, setIsLoading]);

  const push = useCallback(
    (path: string) => {
      setIsLoading(true);
      router.push(path);
    },
    [router, setIsLoading]
  );

  const back = useCallback(() => {
    setIsLoading(true);
    router.back();
  }, [router, setIsLoading]);

  return { push, back };
};
