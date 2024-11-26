// file : components/chat-vish/MessageList.tsx

import { useSocket } from '@/lib/socket/SocketContext';
import { useEffect, useMemo, useRef } from 'react';
import { Message } from '@/lib/socket/types';
import { Avatar } from '@/components/ui/avatar';
import { formatRelative } from 'date-fns';
import { EmojiPicker } from './EmojiPicker';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

function MessageBubble({
  message,
  isOwnMessage,
  showAvatar = true
}: MessageBubbleProps) {
  const { addReaction, deleteReaction } = useSocket();

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isOwnMessage && showAvatar && (
        <div className="mr-2">
          <Avatar>{/* Add avatar here */}</Avatar>
        </div>
      )}
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-1' : 'order-2'}`}>
        {!isOwnMessage && (
          <div className="mb-1 text-sm text-gray-500">{message.sender_id}</div>
        )}
        <div
          className={`group relative ${
            isOwnMessage
              ? 'rounded-l-lg rounded-br-lg bg-blue-500 text-white'
              : 'rounded-r-lg rounded-bl-lg bg-gray-100 text-gray-900'
          } p-3`}
        >
          {message.content}
          <div className="absolute bottom-0 right-0 translate-y-full opacity-0 transition-opacity group-hover:opacity-100">
            <EmojiPicker
              onEmojiSelect={(emoji) =>
                addReaction(message.conversation_id, message.id, emoji)
              }
              existingReactions={message.reactions}
              onReactionClick={(reaction) => {
                const hasReacted = message.reactions?.some(
                  (r) =>
                    r.user_id === message.sender_id && r.reaction === reaction
                );
                if (hasReacted) {
                  deleteReaction(message.conversation_id, message.id, reaction);
                } else {
                  addReaction(message.conversation_id, message.id, reaction);
                }
              }}
            />
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {formatRelative(new Date(message.created_at), new Date())}
          {message.updated_at && ' (edited)'}
        </div>
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(
              message.reactions.reduce(
                (acc, r) => {
                  acc[r.reaction] = (acc[r.reaction] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>
              )
            ).map(([reaction, count]) => (
              <span
                key={reaction}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs"
              >
                {reaction} {count}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MessageList() {
  const { messages, activeConversation, conversations } = useSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 1; // Replace with your user ID logic

  const activeMessages = useMemo(
    () => (activeConversation ? messages.get(activeConversation) || [] : []),
    [activeConversation, messages]
  );

  const activeConversationData = useMemo(
    () =>
      activeConversation ? conversations.get(activeConversation) : undefined,
    [activeConversation, conversations]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  if (!activeConversation || !activeConversationData) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="font-semibold">
          {activeConversationData.name ||
            activeConversationData.participants.map((p) => p.name).join(', ')}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeMessages.map((message, index) => {
          const showAvatar =
            index === 0 ||
            activeMessages[index - 1].sender_id !== message.sender_id;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.sender_id === currentUserId}
              showAvatar={showAvatar}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
