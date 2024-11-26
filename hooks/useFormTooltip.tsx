// File: hooks/useFormTooltip.tsx

import { useState, useCallback } from 'react';
import { TooltipContent } from '@/components/forms/TooltipContext';

export const useFormTooltip = (
  fieldTooltips: Record<string, TooltipContent>
) => {
  const [currentTooltip, setCurrentTooltip] = useState<TooltipContent>({
    description: 'Select an input to see tips.',
    example: 'Select an input to see example',
    label: ''
  });

  const updateTooltip = useCallback(
    (fieldName: string) => {
      const tooltipContent = fieldTooltips[fieldName];
      if (tooltipContent) {
        setCurrentTooltip(tooltipContent);
      } else {
        setCurrentTooltip({
          description: 'No tips available for this field.',
          example: '',
          label: ''
        });
      }
    },
    [fieldTooltips]
  );

  const resetTooltip = useCallback(() => {
    setCurrentTooltip({
      description: 'Select an input to see tips.',
      example: '',
      label: ''
    });
  }, []);

  return { currentTooltip, updateTooltip, resetTooltip };
};
