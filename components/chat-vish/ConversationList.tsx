// file : components/chat-vish/ConversationList.tsx

import { useSocket } from '@/lib/socket/SocketContext';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useCallback } from 'react';

export function ConversationList() {
  const {
    conversations,
    unreadCounts,
    activeConversation,
    userStatuses,
    joinConversation,
    error
  } = useSocket();

  const sortedConversations = Array.from(conversations.values()).sort(
    (a, b) => {
      const aTime = a.last_message?.created_at || '';
      const bTime = b.last_message?.created_at || '';
      return bTime.localeCompare(aTime);
    }
  );

  const handleConversationClick = useCallback(
    async (conversationId: number) => {
      try {
        await joinConversation(conversationId);
      } catch (error) {
        console.error('Failed to join conversation:', error);
      }
    },
    [joinConversation]
  );

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
              activeConversation === conversation.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar>{/* Add avatar here */}</Avatar>
                {conversation.type === 'direct' && (
                  <div
                    className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                      userStatuses.get(conversation.participants[0]?.id) ===
                      'online'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="truncate font-semibold">
                    {conversation.name ||
                      conversation.participants.map((p) => p.name).join(', ')}
                  </h3>
                  {conversation.last_message && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(
                        new Date(conversation.last_message.created_at),
                        {
                          addSuffix: true
                        }
                      )}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm text-gray-500">
                    {conversation.last_message?.content || 'No messages yet'}
                  </p>
                  {unreadCounts.get(conversation.id) ? (
                    <span className="ml-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                      {unreadCounts.get(conversation.id)}
                    </span>
                  ) : null}
                </div>
                {conversation.typingUsers?.size ? (
                  <p className="text-xs italic text-gray-400">
                    {conversation.typingUsers &&
                    conversation.typingUsers.size === 1
                      ? `${conversation.participants.find(
                          (p) =>
                            p.id ===
                            Array.from(conversation.typingUsers || new Set())[0]
                        )?.name} is typing...`
                      : 'Several people are typing...'}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
