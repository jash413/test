//file : server/axios.ts

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 500, 502, 503, 504];

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to determine if request should be retried
const shouldRetry = (error: AxiosError): boolean => {
  const shouldRetryStatus = error.response
    ? RETRY_STATUS_CODES.includes(error.response.status)
    : false;

  const isNetworkError = !error.response && error.code === 'ECONNRESET';

  return shouldRetryStatus || isNetworkError;
};

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Connection: 'keep-alive'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add retry count to config if it doesn't exist
    if (typeof config.retryCount === 'undefined') {
      config.retryCount = 0;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const config: any = error.config;

    // Check if we should retry the request
    if (config && config.retryCount < MAX_RETRIES && shouldRetry(error)) {
      config.retryCount += 1;

      // Implement exponential backoff
      const backoffDelay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);

      console.log(
        `Retrying request (${config.retryCount}/${MAX_RETRIES}) after ${backoffDelay}ms:`,
        config.url
      );

      // Wait for the backoff delay
      await delay(backoffDelay);

      // Retry the request
      return api(config);
    }

    // If we shouldn't retry or have exhausted retries, handle the error
    if (error.response) {
      if (error.response.status === 401) {
        redirect('/auth/signin');
      } else {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);

        if (config?.retryCount) {
          console.error(
            `Request failed after ${config.retryCount} retries:`,
            config.url
          );
        }
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
      console.error('Error code:', error.code);

      if (config?.retryCount) {
        console.error(
          `Network request failed after ${config.retryCount} retries:`,
          config.url
        );
      }
    } else {
      console.error('Error message:', error.message);
    }

    return Promise.reject(error);
  }
);

// Add type declaration for the retry count configuration
declare module 'axios' {
  export interface AxiosRequestConfig {
    retryCount?: number;
  }
}

export default api;
