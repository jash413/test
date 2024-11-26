// app/components/ErrorProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from 'lucide-react'; // Assuming you're using lucide-react for icons

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <Alert variant="destructive" className="pr-8">
            <AlertDescription>{error}</AlertDescription>
            <button 
              onClick={() => setError(null)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </Alert>
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}