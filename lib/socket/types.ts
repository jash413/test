// lib/types/socket.ts
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  parent_message_id?: number;
  created_at: string;
  updated_at?: string;
  files?: File[];
  reactions?: Reaction[];
}

export interface Conversation {
  id: number;
  type: 'direct' | 'group';
  name?: string;
  profile_picture?: string;
  participants: Participant[];
  last_message?: Message;
  unread_count?: number;
  typingUsers?: Set<number>;
}

export interface Participant {
  id: number;
  name: string;
  profile_picture?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

export interface Reaction {
  id: number;
  message_id: number;
  user_id: number;
  reaction: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
}

export interface SocketContextType {
  connected: boolean;
  connecting: boolean;
  conversations: Map<number, Conversation>;
  activeConversation?: number;
  messages: Map<number, Message[]>;
  unreadCounts: Map<number, number>;
  userStatuses: Map<number, string>;
  error?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  joinConversation: (conversationId: number) => Promise<void>;
  leaveConversation: (conversationId: number) => Promise<void>;
  sendMessage: (
    conversationId: number,
    content: string,
    parentMessageId?: number,
    files?: File[]
  ) => Promise<void>;
  editMessage: (
    conversationId: number,
    messageId: number,
    content: string
  ) => Promise<void>;
  deleteMessage: (conversationId: number, messageId: number) => Promise<void>;
  addReaction: (
    conversationId: number,
    messageId: number,
    reaction: string
  ) => Promise<void>;
  deleteReaction: (
    conversationId: number,
    messageId: number,
    reaction: string
  ) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  setUserStatus: (status: string) => Promise<void>;
  searchMessages: (conversationId: number, query: string) => Promise<Message[]>;
  startTyping: (conversationId: number) => void;
  stopTyping: (conversationId: number) => void;
  setActiveConversation: (conversationId?: number) => void;
}
