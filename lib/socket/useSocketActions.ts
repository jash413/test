// file: lib/socket/useSocketActions.ts
import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { Message } from './types';

interface SocketActionsProps {
  socket: Socket | undefined;
  authToken: string | undefined;
  setError: (error: string | undefined) => void;
}

export const useSocketActions = ({
  socket,
  authToken,
  setError
}: SocketActionsProps) => {
  const emitWithAuth = useCallback(
    async <T>(
      event: string,
      data: any,
      requiresAuth: boolean = true
    ): Promise<T> => {
      if (!socket?.connected) {
        throw new Error('Socket not connected');
      }

      if (requiresAuth && !authToken) {
        throw new Error('Not authenticated');
      }

      const payload = requiresAuth ? { ...data, authToken } : data;

      return new Promise((resolve, reject) => {
        socket.emit(event, payload, (response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        });
      });
    },
    [socket, authToken]
  );

  const joinConversation = useCallback(
    async (conversationId: number) => {
      try {
        await emitWithAuth('joinConversation', { conversationId }, false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to join conversation'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const leaveConversation = useCallback(
    async (conversationId: number) => {
      try {
        await emitWithAuth('leaveConversation', { conversationId }, false);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to leave conversation'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const sendMessage = useCallback(
    async (
      conversationId: number,
      content: string,
      parentMessageId?: number,
      files?: File[]
    ) => {
      try {
        await emitWithAuth('sendMessage', {
          conversation_id: conversationId,
          content,
          parent_message_id: parentMessageId,
          files
        });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to send message'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const editMessage = useCallback(
    async (conversationId: number, messageId: number, content: string) => {
      try {
        await emitWithAuth('editMessage', {
          conversation_id: conversationId,
          message_id: messageId,
          content
        });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to edit message'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const deleteMessage = useCallback(
    async (conversationId: number, messageId: number) => {
      try {
        await emitWithAuth('deleteMessage', {
          conversation_id: conversationId,
          message_id: messageId
        });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to delete message'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const addReaction = useCallback(
    async (conversationId: number, messageId: number, reaction: string) => {
      try {
        await emitWithAuth('addReaction', {
          conversation_id: conversationId,
          message_id: messageId,
          reaction
        });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to add reaction'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const deleteReaction = useCallback(
    async (conversationId: number, messageId: number, reaction: string) => {
      try {
        await emitWithAuth(
          'deleteReaction',
          {
            conversation_id: conversationId,
            message_id: messageId,
            reaction
          },
          false
        );
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to delete reaction'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const markAsRead = useCallback(
    async (conversationId: number) => {
      try {
        await emitWithAuth(
          'markMessagesAsRead',
          {
            conversation_id: conversationId
          },
          false
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to mark messages as read'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const setUserStatus = useCallback(
    async (status: string) => {
      try {
        await emitWithAuth('setUserStatus', { status }, false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to set user status'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const searchMessages = useCallback(
    async (conversationId: number, query: string): Promise<Message[]> => {
      try {
        return await emitWithAuth(
          'searchMessages',
          {
            conversation_id: conversationId,
            query
          },
          false
        );
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to search messages'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const startTyping = useCallback(
    (conversationId: number) => {
      if (!socket?.connected) return;
      socket.emit('userTyping', { conversationId });
    },
    [socket]
  );

  const stopTyping = useCallback(
    (conversationId: number) => {
      if (!socket?.connected) return;
      socket.emit('userStoppedTyping', { conversationId });
    },
    [socket]
  );

  const addParticipantToGroup = useCallback(
    async (conversationId: number, userId: number) => {
      try {
        await emitWithAuth('addParticipantToGroup', {
          conversationId,
          userId
        });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to add participant'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const removeParticipantFromGroup = useCallback(
    async (conversationId: number, userId: number) => {
      try {
        await emitWithAuth('removeParticipantFromGroup', {
          conversationId,
          userId
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to remove participant'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const updateGroupProfilePicture = useCallback(
    async (conversationId: number, profilePicture: string) => {
      try {
        await emitWithAuth('updateGroupProfilePicture', {
          conversationId,
          profilePicture
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to update group profile picture'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const getConversationMessages = useCallback(
    async (conversationId: number, limit?: number, before?: number) => {
      try {
        return await emitWithAuth(
          'getMessages',
          {
            conversation_id: conversationId,
            limit,
            before
          },
          false
        );
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to get messages'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const getThreadMessages = useCallback(
    async (conversationId: number, parentMessageId: number) => {
      try {
        return await emitWithAuth(
          'getThreadMessages',
          {
            conversation_id: conversationId,
            parent_message_id: parentMessageId
          },
          false
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to get thread messages'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const getUnreadCount = useCallback(async () => {
    try {
      return await emitWithAuth<{ unreadCount: number }>(
        'getUnreadCount',
        {},
        false
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to get unread count'
      );
      throw error;
    }
  }, [emitWithAuth, setError]);

  const getOnlineUsers = useCallback(async () => {
    try {
      return await emitWithAuth<number[]>('getOnlineUsers', {}, false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to get online users'
      );
      throw error;
    }
  }, [emitWithAuth, setError]);

  const getUserStatus = useCallback(
    async (userId: number) => {
      try {
        return await emitWithAuth<string>('getUserStatus', { userId }, false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to get user status'
        );
        throw error;
      }
    },
    [emitWithAuth, setError]
  );

  const getConversationsWithUnreadCounts = useCallback(async () => {
    try {
      return await emitWithAuth('getConversationsWithUnreadCounts', {}, false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to get conversations with unread counts'
      );
      throw error;
    }
  }, [emitWithAuth, setError]);

  return {
    joinConversation,
    leaveConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    deleteReaction,
    markAsRead,
    setUserStatus,
    searchMessages,
    startTyping,
    stopTyping,
    addParticipantToGroup,
    removeParticipantFromGroup,
    updateGroupProfilePicture,
    getConversationMessages,
    getThreadMessages,
    getUnreadCount,
    getOnlineUsers,
    getUserStatus,
    getConversationsWithUnreadCounts
  };
};
