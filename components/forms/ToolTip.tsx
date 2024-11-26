import React from 'react';
import { TooltipContent } from './TooltipContext';
import { Card, CardContent } from "@/components/ui/card";

interface TooltipProps {
  content?: TooltipContent;
}

export function Tooltip({ content }: TooltipProps) {
  if (!content) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">Tip</h3>
        {content.description && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-secondary-foreground">Description:</h4>
            <p className="text-muted-foreground">{content.description}</p>
          </div>
        )}
        {content.example && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-secondary-foreground">Example:</h4>
            <p className="text-muted-foreground italic">{content.example}</p>
          </div>
        )}
        {content.keywords && content.keywords.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-secondary-foreground">Key Elements:</h4>
            <div className="flex flex-wrap gap-2">
              {content.keywords.map(keyword => (
                <span 
                  key={keyword} 
                  className="inline-block bg-accent text-accent-foreground rounded-full px-2 py-1 text-xs font-semibold"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}