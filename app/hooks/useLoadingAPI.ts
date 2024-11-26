// app/hooks/useLoadingAPI.ts
'use client';

import { useLoading } from '@/components/LoadingProvider';
import { useError } from '@/components/ErrorProvider';
import { useRef, useCallback } from 'react';

export function useLoadingAPI() {
  const { setIsLoading } = useLoading();
  const { setError } = useError();
  const activeRequests = useRef<Record<string, Promise<any>>>({});

  const fetchWithLoading = useCallback(
    async (url: string, options?: RequestInit) => {
      const requestKey = `${url}-${JSON.stringify(options)}`;

      if (requestKey in activeRequests.current) {
        try {
          // Wait for the existing request to complete
          return await activeRequests.current[requestKey];
        } catch (error) {
          // If the existing request failed, we'll try again
        }
      }

      setIsLoading(true);
      setError(null);

      const fetchPromise = (async () => {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || 'An unexpected error occurred');
          }
          return await response.json();
        } catch (error) {
          if (
            error instanceof TypeError &&
            error.message === 'Failed to fetch'
          ) {
            setError(
              'Unable to connect to the server. Please check your connection and try again.'
            );
          } else {
            setError(
              error instanceof Error
                ? error.message
                : 'An unexpected error occurred'
            );
          }
          throw error;
        } finally {
          setIsLoading(false);
          delete activeRequests.current[requestKey];
        }
      })();

      activeRequests.current[requestKey] = fetchPromise;

      try {
        return await fetchPromise;
      } catch (error) {
        // Remove the failed request from activeRequests
        delete activeRequests.current[requestKey];
        throw error;
      }
    },
    [setIsLoading, setError]
  );

  return { fetchWithLoading };
}
