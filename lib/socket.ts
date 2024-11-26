import { io, Socket } from 'socket.io-client';
import { getSession } from 'next-auth/react';

let socket: Socket = io();
// added hard coded token for testing
// const authToken =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjc0LCJpYXQiOjE3Mjg0ODE5NTYsImV4cCI6MTcyODU2ODM1Nn0.RfAINXqEn0yFwbVeQzL0lE0sDNdZXB15NF-eVP3ijOw';

export const initiateSocketConnection = (
  authToken: string,
  listeners: Array<{ event: string; callback: (data: any) => void }> = []
) => {
  if (!socket.connected) {
    socket = io('https://my-express-app-767851496729.us-south1.run.app', {
      auth: { token: authToken },
      transports: ['websocket'],
      timeout: 10000
    });
  }

  socket.on('connect', () => {
    console.log('Connected to the server');

    socket.on('newMessage', (data) => {
      console.log(data);
    });

    socket.on('newConversation', (data) => {
      console.log(data);
    });

    socket.on('reactionAdded', (data) => {
      console.log(data);
    });

    socket.on('reactionDeleted', (data) => {
      console.log(data);
    });

    if (listeners) {
      listeners.forEach(({ event, callback }) => {
        socket.on(event, callback);
      });
    }
  });
};

// Helper to add a socket event listener
export const addSocketListener = (
  event: string,
  callback: (data: any) => void
) => {
  socket.on(event, callback);
};

const emitWithAuth = async (
  event: string,
  data: object = {},
  callback?: (response: any) => void
) => {
  const session = await getSession();
  const authToken = session?.user?.apiUserToken as string;

  if (!authToken) {
    console.error('No auth token provided');
    return;
  }
  const dataWithToken = { ...data, authToken: authToken };
  socket.emit(event, dataWithToken, callback);
};

const socketOn = (event: string, callback: (response: any) => void) => {
  socket.on(event, callback);
};

// Listen for new messages
export const getNewMessage = (callback: (data: any) => void) => {
  socketOn('newMessage', callback);
};

// Listen for message read updates
export const messageReadUpdate = (callback: (data: any) => void) => {
  socketOn('messageReadUpdate', callback);
};

// Listen for new conversations
export const newConversation = (callback: (data: any) => void) => {
  socketOn('newConversation', callback);
};

// Listen for message deleted updates
export const messageDeleted = (callback: (data: any) => void) => {
  socketOn('messageDeleted', callback);
};

// Listen for message reaction added updates
export const reactionAdded = (callback: (data: any) => void) => {
  socketOn('reactionAdded', callback);
};

// Listen for message reaction removed updates
export const reactionDeleted = (callback: (data: any) => void) => {
  socketOn('reactionDeleted', callback);
};

// Listen for conversation deleted updates
export const conversationDeleted = (callback: (data: any) => void) => {
  socketOn('conversationDeleted', callback);
};

// Listen for group profile picture updated
export const groupProfilePictureUpdated = (callback: (data: any) => void) => {
  socketOn('groupProfilePictureUpdated', callback);
};

// Listen for user typing
export const userTyping = (callback: (data: any) => void) => {
  socketOn('userTyping', callback);
};

// Listen for user stoped typing
export const userStoppedTyping = (callback: (data: any) => void) => {
  socketOn('userStoppedTyping', callback);
};

// Listen for user status active/inactive changed
export const userStatusChanged = (callback: (data: any) => void) => {
  socketOn('userStatusChanged', callback);
};

// Listen for user pinned message
export const messagePinned = (callback: (data: any) => void) => {
  socketOn('messagePinned', callback);
};

// Listen for user unpinned message
export const messageUnpinned = (callback: (data: any) => void) => {
  socketOn('messageUnpinned', callback);
};

// Listen for new participant added
export const participantAdded = (callback: (data: any) => void) => {
  socketOn('participantAdded', callback);
};

// Listen for new participant removed
export const participantRemoved = (callback: (data: any) => void) => {
  socketOn('participantRemoved', callback);
};

// Create a new conversation
export const createConversation = (
  type: 'ONE_TO_ONE' | 'GROUP',
  participantIds: number[],
  groupName?: string,
  profilePicture?: File | { buffer: Buffer; originalname: string },
  callback?: (response: any) => void
) => {
  let pictureData;

  if (profilePicture instanceof File) {
    const reader = new FileReader();
    console.log('here');
    reader.onloadend = () => {
      pictureData = {
        buffer: Buffer.from(reader.result as ArrayBuffer),
        originalname: profilePicture.name
      };
      emitWithAuth(
        'createConversation',
        { type, participantIds, groupName, profilePicture: pictureData },
        (response: { success: any; error: any }) => {
          if (!response.success) {
            console.error('Error creating conversation:', response.error);
          }
          if (callback) {
            callback(response);
          }
        }
      );
    };
    reader.readAsArrayBuffer(profilePicture);
  } else {
    // Handle case when profilePicture is already in the desired format
    emitWithAuth(
      'createConversation',
      { type, participantIds, groupName, profilePicture },
      (response: { success: any; error: any }) => {
        if (!response.success) {
          console.error('Error creating conversation:', response.error);
        }
        if (callback) {
          callback(response);
        }
      }
    );
  }
};

// Update the group profile picture
export const updateGroupProfilePicture = (
  conversationId: number,
  newProfilePicture?: File | { buffer: Buffer; originalname: string },
  callback?: (response: any) => void
) => {
  let pictureData;

  const emitUpdateProfilePicture = (picture: any) => {
    emitWithAuth(
      'updateGroupProfilePicture',
      {
        conversationId,
        profilePicture: picture
      },
      (response: { success: any; error: any }) => {
        if (!response.success) {
          console.error(
            'Error updating group profile picture:',
            response.error
          );
        }
        if (callback) {
          callback(response);
        }
      }
    );
  };

  if (newProfilePicture instanceof File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      pictureData = {
        buffer: Buffer.from(reader.result as ArrayBuffer),
        originalname: newProfilePicture.name
      };
      emitUpdateProfilePicture(pictureData);
    };
    reader.readAsArrayBuffer(newProfilePicture);
  } else {
    emitUpdateProfilePicture(newProfilePicture);
  }
};

// Get all conversations
export const getConversations = (callback: (data: any) => void) => {
  socket.off('conversations').on('conversations', (data) => callback(data));
  emitWithAuth('getConversations', {}, callback);
};

// Get all conversation
export const getConversation = (
  conversationId: number,
  callback: (data: any) => void
) => {
  socket.off('conversations').on('conversations', (data) => callback(data));
  emitWithAuth('getConversation', { conversationId }, callback);
};

// Join a conversation
export const joinConversation = (
  conversationId: number,
  callback: (data: any) => void
) => {
  emitWithAuth('joinConversation', { conversationId }, callback);
};

// Leave a conversation
export const leaveConversation = (
  conversationId: number,
  callback: (data: any) => void
) => {
  emitWithAuth('leaveConversation', { conversationId }, callback);
};

// Clear a conversation
export const deleteConversation = (
  conversationId: number,
  callback: (data: any) => void
) => {
  emitWithAuth('deleteConversation', { conversationId }, callback);
};

// Send a message
export const sendMessage = (
  conversation_id: number,
  parent_message_id: number | undefined,
  message: string | undefined,
  files: (File | { buffer: Buffer; originalname: string })[] | undefined,
  callback: (data: any) => void
) => {
  emitWithAuth(
    'sendMessage',
    {
      conversation_id,
      parent_message_id,
      content: message,
      files: files
    },
    callback
  );
};

// Get messages for a conversation
export const getMessages = (
  conversation_id: number,
  callback: (data: any) => void
) => {
  emitWithAuth('getMessages', { conversation_id }, callback);
  socket.on('getMessages', (data) => callback(data));
};

// Set user is typing
export const setUserTyping = (
  conversation_id: number,
  callback: (data: any) => void
) => {
  emitWithAuth('userTyping', { conversation_id }, callback);
};

// Set user stoped typing
export const setUserStoppedTyping = (
  conversation_id: number,
  callback: (data: any) => void
) => {
  emitWithAuth('userStoppedTyping', { conversation_id }, callback);
};

// Get user activity status
export const getUserActivityStatus = (
  userId: number,
  callback: (data: any) => void
) => {
  emitWithAuth('getUserStatus', { userId }, callback);
};

// Get conversations with unread counts
export const getConversationsWithUnreadCounts = (
  callback: (data: any) => void
) => {
  emitWithAuth('getConversationsWithUnreadCounts', callback);
};

// Mark messages as read
export const markMessagesAsRead = (
  conversation_id: number,
  callback: (data: any) => void
) => {
  emitWithAuth('markMessagesAsRead', { conversation_id }, callback);
};

// Get unread message count
export const getUnreadCount = (
  userId: number,
  callback: (data: any) => void
) => {
  socket.emit(
    'getUnreadCount',
    { userId },
    (response: { success: any; error: any }) => {
      if (!response.success) {
        console.error('Error creating conversation:', response.error);
      }
      callback(response);
    }
  );
  socket.on('unreadCount', (data) => callback(data));
};

// Delete a message
export const deleteMessage = (
  conversation_id: number,
  message_id: number,
  callback: (data: any) => void
) => {
  emitWithAuth('deleteMessage', { conversation_id, message_id }, callback);
};

// Edit a message
export const editMessage = (
  conversation_id: number,
  message_id: number,
  content: string,
  callback: (data: any) => void
) => {
  emitWithAuth(
    'editMessage',
    { conversation_id, message_id, content },
    callback
  );
};

// Add a reaction to a message
export const addReaction = (
  conversation_id: number,
  message_id: number,
  reaction: string,
  callback: (data: any) => void
) => {
  emitWithAuth(
    'addReaction',
    { conversation_id, message_id, reaction },
    callback
  );
};

// Delete a reaction from a message
export const deleteReaction = (
  conversation_id: number,
  message_id: number,
  reaction: string,
  callback: (data: any) => void
) => {
  emitWithAuth(
    'deleteReaction',
    { conversation_id, message_id, reaction },
    callback
  );
};

// Get thread messages
export const getThreadMessages = (
  conversation_id: number,
  parent_message_id: number,
  callback: (data: any) => void
) => {
  emitWithAuth('getThreadMessages', { conversation_id, parent_message_id });
  socket.on('threadMessages', (data) => callback(data));
};

export default socket;
