import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from "@/lib/utils";

type AlertType = 'error' | 'success';

interface EnhancedAlertProps {
  message: string;
  type: AlertType;
  className?: string;
}

const EnhancedAlert: React.FC<EnhancedAlertProps> = ({ message, type, className = '' }) => (
  <Alert className={cn(
    "mt-4 enhanced-alert",
    type === 'error' ? 'enhanced-alert-error' : 'enhanced-alert-success',
    className
  )}>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export default EnhancedAlert;