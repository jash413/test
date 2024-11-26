export type Participant = {
  id: number;
  name: string;
  email: string;
  image: string | null;
};

export type Message = {
  id: number;
  creator_id: number;
  updater_id: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  content: string;
  sender_id: number;
  conversation_id: number;
  file_info: string;
  reactions: null | any;
  parent_message_id: null | number;
  message_type: null | string;
};

export type Conversation = {
  id: number;
  creator_id: number;
  updater_id: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  type: 'ONE_TO_ONE' | 'GROUP';
  group_name: null | string;
  profile_picture: null | string;
  last_message_at: string;
  bid_request_id: null | number;
  participants: Participant[];
  messages: Message[];
  hasNewMsg?: boolean;
};

export interface IMessages {
  image: any;
  id: number;
  creator_id: number;
  updater_id: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  content: string;
  sender_id: number;
  conversation_id: number;
  file_info: string;
  reactions: string | null;
  pinned: boolean;
  parent_message_id: number | null;
  message_type: string | null;
  sender: Sender;
}

export interface Sender {
  id: number;
  name: string;
  email?: string;
  image?: string | null;
}

export interface InFileInfo {
  original_name: string;
  file_url: string;
  download_url: string;
}

interface MessageProps {
  message: {
    file_info: InFileInfo[];
  };
}
