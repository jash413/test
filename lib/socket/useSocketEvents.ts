// file : lib/socket/useSocketEvent.ts

import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Conversation } from './types';

export function useSocketEvents(
  socket: Socket | undefined,
  setMessages: React.Dispatch<React.SetStateAction<Map<number, Message[]>>>,
  setConversations: React.Dispatch<
    React.SetStateAction<Map<number, Conversation>>
  >,
  setUnreadCounts: React.Dispatch<React.SetStateAction<Map<number, number>>>,
  setUserStatuses: React.Dispatch<React.SetStateAction<Map<number, string>>>,
  activeConversation?: number
) {
  const setupEventListeners = useCallback(() => {
    if (!socket) return;

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

    // Add other event listeners here...

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, activeConversation, setMessages, setConversations]);

  return { setupEventListeners };
}
