// file: lib/socket/useSocketSetup.ts
import { useRef } from 'react';
import { Socket } from 'socket.io-client';

export function useSocketSetup() {
  const socketRef = useRef<Socket>();
  const authTokenRef = useRef<string>();

  return {
    socketRef,
    authTokenRef
  };
}
