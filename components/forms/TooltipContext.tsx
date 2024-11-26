//file : components/forms/TooltipContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface TooltipContent {
  default?: string;
  label?: string;
  description?: string;
  example?: string;
  keywords?: string[];
}

interface TooltipContextType {
  tooltipContent: TooltipContent;
  updateTooltip: (content: TooltipContent) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [tooltipContent, setTooltipContent] = useState<TooltipContent>({
    default: 'Select an input to see tips.',
    example: '',
    keywords: []
  });

  const updateTooltip = useCallback((newContent: TooltipContent) => {
    setTooltipContent(newContent);
  }, []);

  return (
    <TooltipContext.Provider value={{ tooltipContent, updateTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
}
