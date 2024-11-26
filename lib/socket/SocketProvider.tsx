// file: lib/socket/SocketProvider.tsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from './SocketContext';
import { Conversation, Message, SocketContextType } from './types';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>();
  const [conversations, setConversations] = useState<Map<number, Conversation>>(
    new Map()
  );
  const [messages, setMessages] = useState<Map<number, Message[]>>(new Map());
  const [unreadCounts, setUnreadCounts] = useState<Map<number, number>>(
    new Map()
  );
  const [userStatuses, setUserStatuses] = useState<Map<number, string>>(
    new Map()
  );
  const [activeConversation, setActiveConversation] = useState<number>();

  // Refs
  const socketRef = useRef<Socket>();
  const authTokenRef = useRef<string>();
  const typingTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      if (!socketRef.current) return;

      const [loadedConversations, unreadCountsData] = await Promise.all([
        new Promise<Conversation[]>((resolve, reject) => {
          socketRef.current?.emit('getConversations', {}, (response: any) => {
            if (response.success) resolve(response.data);
            else reject(new Error(response.error));
          });
        }),
        new Promise<{ [key: number]: number }>((resolve, reject) => {
          socketRef.current?.emit('getUnreadCount', {}, (response: any) => {
            if (response.success) resolve(response.data);
            else reject(new Error(response.error));
          });
        })
      ]);

      setConversations(new Map(loadedConversations.map((c) => [c.id, c])));
      setUnreadCounts(
        new Map(
          Object.entries(unreadCountsData).map(([id, count]) => [
            Number(id),
            count
          ])
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load initial data'
      );
    }
  }, []);

  // Setup socket listeners
  const setupSocketListeners = useCallback(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      setError(undefined);
      loadInitialData();
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      setError(error.message);
      setConnected(false);
    });

    // Message events
    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => {
        const updated = new Map(prev);
        const conversationMessages = [
          ...(updated.get(message.conversation_id) || [])
        ];
        conversationMessages.push(message);
        updated.set(message.conversation_id, conversationMessages);
        return updated;
      });

      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(message.conversation_id);
        if (conversation) {
          conversation.last_message = message;
          if (message.conversation_id !== activeConversation) {
            conversation.unread_count = (conversation.unread_count || 0) + 1;
          }
          updated.set(message.conversation_id, { ...conversation });
        }
        return updated;
      });
    });

    // User status events
    socket.on('userStatusChanged', ({ userId, status }) => {
      setUserStatuses((prev) => {
        const updated = new Map(prev);
        updated.set(userId, status);
        return updated;
      });

      setConversations((prev) => {
        const updated = new Map(prev);
        prev.forEach((conversation, id) => {
          const participant = conversation.participants.find(
            (p) => p.id === userId
          );
          if (participant) {
            participant.status = status;
            updated.set(id, { ...conversation });
          }
        });
        return updated;
      });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [activeConversation, loadInitialData]); // Added activeConversation as dependency

  // Socket connection
  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      setError(undefined);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No auth token available');
      }
      authTokenRef.current = token;

      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      setupSocketListeners();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect');
    } finally {
      setConnecting(false);
    }
  }, [setupSocketListeners]); // Added setupSocketListeners as dependency

  // Socket actions
  const joinConversation = useCallback(async (conversationId: number) => {
    if (!socketRef.current) throw new Error('Socket not connected');

    await new Promise<void>((resolve, reject) => {
      socketRef.current!.emit(
        'joinConversation',
        { conversationId },
        (response: any) => {
          if (response.success) {
            setActiveConversation(conversationId);
            resolve();
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  }, []);

  const leaveConversation = useCallback(
    async (conversationId: number) => {
      if (!socketRef.current) throw new Error('Socket not connected');

      await new Promise<void>((resolve, reject) => {
        socketRef.current!.emit(
          'leaveConversation',
          { conversationId },
          (response: any) => {
            if (response.success) {
              if (activeConversation === conversationId) {
                setActiveConversation(undefined);
              }
              resolve();
            } else {
              reject(new Error(response.error));
            }
          }
        );
      });
    },
    [activeConversation]
  );

  const sendMessage = useCallback(
    async (
      conversationId: number,
      content: string,
      parentMessageId?: number,
      files?: File[]
    ) => {
      if (!socketRef.current || !authTokenRef.current)
        throw new Error('Not connected');

      await new Promise<void>((resolve, reject) => {
        socketRef.current!.emit(
          'sendMessage',
          {
            authToken: authTokenRef.current,
            conversation_id: conversationId,
            content,
            parent_message_id: parentMessageId,
            files
          },
          (response: any) => {
            if (response.success) resolve();
            else reject(new Error(response.error));
          }
        );
      });
    },
    []
  );

  // Add other action implementations here...
  // editMessage, deleteMessage, addReaction, etc.

  // Replace the useEffect at the end with this fixed version
  useEffect(() => {
    // Copy ref values into variables inside the effect
    const timeouts = typingTimeoutRef.current;
    const socket = socketRef.current;

    // Return cleanup function
    return () => {
      // First disconnect the socket
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
      socketRef.current = undefined;
      setConnected(false);

      // Then clear all typing timeouts using the copied reference
      if (timeouts) {
        timeouts.forEach((timeout) => clearTimeout(timeout));
        timeouts.clear();
      }
    };
  }, []); // Empty dependency array since this is a cleanup effect

  // Move the disconnect function to be regular function since it's only used in cleanup
  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.disconnect();
      socket.removeAllListeners();
    }
    socketRef.current = undefined;
    setConnected(false);
  }, []);

  const value: SocketContextType = {
    connected,
    connecting,
    conversations,
    activeConversation,
    messages,
    unreadCounts,
    userStatuses,
    error,
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    editMessage: async () => {}, // Implement these
    deleteMessage: async () => {},
    addReaction: async () => {},
    deleteReaction: async () => {},
    markAsRead: async () => {},
    setUserStatus: async () => {},
    searchMessages: async () => [],
    startTyping: () => {},
    stopTyping: () => {},
    setActiveConversation
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
