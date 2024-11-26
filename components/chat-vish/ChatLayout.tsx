// file : components/chat-vish/ChatLayout.tsx

import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function ChatLayout() {
  return (
    <div className="flex h-screen">
      <div className="flex w-80 flex-col border-r">
        <ConversationList />
      </div>
      <div className="flex flex-1 flex-col">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}
