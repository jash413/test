// file: lib/socket/useSocketListeners.ts
import { SetStateAction, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { Conversation, Message, Reaction } from './types';

interface ListenerProps {
  socket: Socket | undefined;
  setConnected: (value: boolean) => void;
  setError: (value: string | undefined) => void;
  setMessages: React.Dispatch<SetStateAction<Map<number, Message[]>>>;
  setConversations: React.Dispatch<SetStateAction<Map<number, Conversation>>>;
  setUnreadCounts: React.Dispatch<SetStateAction<Map<number, number>>>;
  setUserStatuses: React.Dispatch<SetStateAction<Map<number, string>>>;
  activeConversation?: number;
  loadInitialData: () => Promise<void>;
}

export const useSocketListeners = ({
  socket,
  setConnected,
  setError,
  setMessages,
  setConversations,
  setUnreadCounts,
  setUserStatuses,
  activeConversation,
  loadInitialData
}: ListenerProps) => {
  const setupEventListeners = useCallback(() => {
    if (!socket) return;

    // Connection events
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

    // Conversation events
    socket.on('newConversation', (conversation: Conversation) => {
      setConversations((prev) => {
        const updated = new Map(prev);
        updated.set(conversation.id, conversation);
        return updated;
      });
    });

    socket.on('userJoinedConversation', ({ userId, conversationId }) => {
      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(conversationId);
        if (conversation) {
          // Update participants list if needed
          conversation.participants = [...conversation.participants];
          updated.set(conversationId, { ...conversation });
        }
        return updated;
      });
    });

    socket.on('userLeftConversation', ({ userId, conversationId }) => {
      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(conversationId);
        if (conversation) {
          conversation.participants = conversation.participants.filter(
            (p) => p.id !== userId
          );
          updated.set(conversationId, { ...conversation });
        }
        return updated;
      });
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

    socket.on('messageEdited', (message: Message) => {
      setMessages((prev) => {
        const updated = new Map(prev);
        const conversationMessages = updated.get(message.conversation_id) || [];
        const messageIndex = conversationMessages.findIndex(
          (m) => m.id === message.id
        );
        if (messageIndex !== -1) {
          conversationMessages[messageIndex] = message;
          updated.set(message.conversation_id, [...conversationMessages]);
        }
        return updated;
      });
    });

    socket.on('messageDeleted', ({ messageId, conversation_id }) => {
      setMessages((prev) => {
        const updated = new Map(prev);
        const conversationMessages = updated.get(conversation_id) || [];
        const filteredMessages = conversationMessages.filter(
          (m) => m.id !== messageId
        );
        updated.set(conversation_id, filteredMessages);
        return updated;
      });
    });

    socket.on(
      'reactionAdded',
      ({ messageId, conversationId, reaction, userId }) => {
        setMessages((prev) => {
          const updated = new Map(prev);
          const conversationMessages = updated.get(conversationId) || [];
          const messageIndex = conversationMessages.findIndex(
            (m) => m.id === messageId
          );
          if (messageIndex !== -1) {
            const message = { ...conversationMessages[messageIndex] };
            // Fix: Using correct property names matching the Reaction type
            const newReaction: Reaction = {
              id: Date.now(), // or however you generate reaction IDs
              message_id: messageId,
              user_id: userId,
              reaction
            };
            message.reactions = [...(message.reactions || []), newReaction];
            conversationMessages[messageIndex] = message;
            updated.set(conversationId, [...conversationMessages]);
          }
          return updated;
        });
      }
    );

    socket.on(
      'reactionDeleted',
      ({ messageId, conversationId, reaction, userId }) => {
        setMessages((prev) => {
          const updated = new Map(prev);
          const conversationMessages = updated.get(conversationId) || [];
          const messageIndex = conversationMessages.findIndex(
            (m) => m.id === messageId
          );
          if (messageIndex !== -1) {
            const message = { ...conversationMessages[messageIndex] };
            // Fix: Using correct property names in the filter
            message.reactions = message.reactions?.filter(
              (r) =>
                !(
                  r.message_id === messageId &&
                  r.user_id === userId &&
                  r.reaction === reaction
                )
            );
            conversationMessages[messageIndex] = message;
            updated.set(conversationId, [...conversationMessages]);
          }
          return updated;
        });
      }
    );

    // Typing events
    socket.on('userTyping', ({ userId, conversationId }) => {
      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(conversationId);
        if (conversation) {
          conversation.typingUsers = conversation.typingUsers || new Set();
          conversation.typingUsers.add(userId);
          updated.set(conversationId, { ...conversation });
        }
        return updated;
      });
    });

    socket.on('userStoppedTyping', ({ userId, conversationId }) => {
      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(conversationId);
        if (conversation?.typingUsers) {
          conversation.typingUsers.delete(userId);
          updated.set(conversationId, { ...conversation });
        }
        return updated;
      });
    });

    // Read status events
    socket.on('messagesRead', ({ userId, conversationId }) => {
      setUnreadCounts((prev) => {
        const updated = new Map(prev);
        updated.set(conversationId, 0);
        return updated;
      });

      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(conversationId);
        if (conversation) {
          conversation.unread_count = 0;
          updated.set(conversationId, { ...conversation });
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

    // Group events
    socket.on('participantAdded', ({ conversationId, participant }) => {
      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(conversationId);
        if (conversation) {
          conversation.participants = [
            ...conversation.participants,
            participant
          ];
          updated.set(conversationId, { ...conversation });
        }
        return updated;
      });
    });

    socket.on('participantRemoved', ({ conversationId, userId }) => {
      setConversations((prev) => {
        const updated = new Map(prev);
        const conversation = updated.get(conversationId);
        if (conversation) {
          conversation.participants = conversation.participants.filter(
            (p) => p.id !== userId
          );
          updated.set(conversationId, { ...conversation });
        }
        return updated;
      });
    });

    socket.on(
      'groupProfilePictureUpdated',
      ({ conversationId, profilePictureUrl }) => {
        setConversations((prev) => {
          const updated = new Map(prev);
          const conversation = updated.get(conversationId);
          if (conversation) {
            conversation.profile_picture = profilePictureUrl;
            updated.set(conversationId, { ...conversation });
          }
          return updated;
        });
      }
    );

    return () => {
      socket.removeAllListeners();
    };
  }, [
    socket,
    setConnected,
    setError,
    setMessages,
    setConversations,
    setUnreadCounts,
    setUserStatuses,
    activeConversation,
    loadInitialData
  ]);

  return { setupEventListeners };
};
