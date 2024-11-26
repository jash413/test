//file: lib/socket/SocketContext.tsx

import { createContext, useContext } from 'react';
import { SocketContextType } from './types';

export const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
