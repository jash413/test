// // file : socket/socketHandlers.ts

// import { Server as SocketIOServer, Socket } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import * as messageHandlers from './message_handlers';
// import { EventEmitter } from 'events';

// type CallbackFunction = (response: { success: boolean; data?: any; error?: string }) => void;

// interface SocketData {
//   userId: number;
// }

// // Constants
// // Constants
// const MAX_ROOMS_PER_SOCKET = 100;
// const MAX_QUERY_LENGTH = 500;
// const MAX_MESSAGE_LENGTH = 5000;
// const MAX_GROUP_NAME_LENGTH = 100;
// const VALID_REACTIONS = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];
// const VALID_USER_STATUSES = ['online', 'away', 'busy', 'offline'];
// const DEFAULT_MESSAGE_LIMIT = 50;
// const MAX_MESSAGE_LIMIT = 100;
// const MAX_PARTICIPANTS = 100;
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// // Utility functions
// const createError = (message: string) => ({ success: false, error: message });
// const createSuccess = (data: any) => ({ success: true, data });

// const sanitizeData = (data: any) => {
//   const cleaned = { ...data };
//   if (cleaned.authToken) cleaned.authToken = '***';
//   return cleaned;
// };

// // Debug namespace for consistent logging
// const debug = {
//   log: (message: string, ...args: any[]) => {
//     console.log(`[Socket Debug] ${message}`, ...args);
//   },
//   error: (message: string, ...args: any[]) => {
//     console.error(`[Socket Error] ${message}`, ...args);
//   },
//   event: (message: string, ...args: any[]) => {
//     console.log(`[Socket Event] ${message}`, ...args);
//   }
// };

// const validateNumber = (value: any, fieldName: string): number => {
//   const num = Number(value);
//   if (isNaN(num)) {
//     throw new Error(`Invalid ${fieldName}: must be a number`);
//   }
//   return num;
// };

// class SocketEventEmitter extends EventEmitter { }
// const socketEvents = new SocketEventEmitter();

// export function setupSocketServer(io: SocketIOServer) {
//   // Debug middleware for all socket events
//   io.use((socket, next) => {
//     socket.onAny((eventName, ...args) => {
//       debug.event(`Socket ${socket.id} received event "${eventName}"`, args);
//     });
//     next();
//   });

//   io.use(authenticateSocket);

//   io.on('connection', (socket: Socket) => {
//     const userId = (socket.data as SocketData).userId;
//     debug.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

//     // Join user's personal room
//     socket.join(userId.toString());
//     debug.log(`Socket ${socket.id} joined user room: ${userId}`);
//     debug.log(`Current rooms for socket ${socket.id}:`, socket.rooms);

//     setupEventHandlers(io, socket);

//     // Only broadcast to users who need to know (e.g., contacts/friends)
//     socket.broadcast.emit('userConnected', { userId, socketId: socket.id });

//     socket.on('disconnect', async () => {
//       try {
//         debug.log(`User disconnecting: ${userId}, Socket ID: ${socket.id}`);

//         // Clean up rooms
//         for (const room of socket.rooms) {
//           await socket.leave(room);
//         }

//         // Remove all listeners to prevent memory leaks
//         socket.removeAllListeners();

//         debug.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);
//         debug.log('Remaining connected sockets:', io.sockets.sockets.size);

//         socket.broadcast.emit('userDisconnected', { userId, socketId: socket.id });
//       } catch (error) {
//         debug.error(`Error during disconnect cleanup: ${error}`);
//       }
//     });

//     socket.on('error', (error) => {
//       debug.error(`Socket error for user ${userId}:`, error);
//       socket.emit('socketError', { userId, socketId: socket.id, error });
//     });
//   });

//   setupGlobalEventListeners(io);
//   return socketEvents;
// }

// function setupGlobalEventListeners(io: SocketIOServer) {
//   socketEvents.on('broadcast', (eventName: string, data: any) => {
//     debug.log(`Broadcasting event: ${eventName}`, data);
//     io.emit(eventName, data);
//   });

//   socketEvents.on('emitToUser', (userId: number, eventName: string, data: any) => {
//     debug.log(`Emitting to user ${userId}: ${eventName}`, data);
//     io.to(userId.toString()).emit(eventName, data);
//   });

//   socketEvents.on('emitToRoom', (room: string, eventName: string, data: any) => {
//     debug.log(`Emitting to room ${room}: ${eventName}`, data);
//     io.to(room).emit(eventName, data);
//   });
// }

// async function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
//   debug.log('Authenticating socket connection');
//   const token = socket.handshake.auth.token;

//   if (!token) {
//     debug.error('Authentication error: No token provided');
//     return next(new Error('Authentication error: No token provided'));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
//     if (!decoded || typeof decoded.id !== 'number') {
//       throw new Error('Invalid token payload');
//     }
//     (socket.data as SocketData).userId = decoded.id;
//     debug.log(`Socket authenticated for user ${decoded.id}`);
//     next();
//   } catch (error) {
//     debug.error('JWT verification error:', error);
//     return next(new Error('Authentication error: Invalid token'));
//   }
// }

// function setupEventHandlers(io: SocketIOServer, socket: Socket) {
//   const userId = (socket.data as SocketData).userId;

//   // Define handler types
//   type HandlerWithCallback = (data: any, callback: CallbackFunction) => Promise<void>;
//   type HandlerWithoutCallback = (data: any) => void;

//   // Handlers that don't require callbacks (real-time events)
//   const handlersWithoutCallback = {
//     userTyping: (data: { conversationId: number }) => {
//       if (!data?.conversationId) {
//         throw new Error('Invalid conversation ID');
//       }

//       const conversationId = validateNumber(data.conversationId, 'conversationId');

//       debug.log(`User ${userId} typing in conversation ${conversationId}`);
//       io.to(conversationId.toString()).emit('userTyping', {
//         userId,
//         conversationId
//       });
//     },

//     userStoppedTyping: (data: { conversationId: number }) => {
//       if (!data?.conversationId) {
//         throw new Error('Invalid conversation ID');
//       }

//       const conversationId = validateNumber(data.conversationId, 'conversationId');

//       debug.log(`User ${userId} stopped typing in conversation ${conversationId}`);
//       io.to(conversationId.toString()).emit('userStoppedTyping', {
//         userId,
//         conversationId
//       });
//     },

//     userActivity: (data: { conversationId: number; activity: string }) => {
//       if (!data?.conversationId || !data?.activity) {
//         throw new Error('Invalid activity data');
//       }

//       const conversationId = validateNumber(data.conversationId, 'conversationId');

//       debug.log(`User ${userId} activity in conversation ${conversationId}: ${data.activity}`);
//       io.to(conversationId.toString()).emit('userActivity', {
//         userId,
//         conversationId,
//         activity: data.activity
//       });
//     }
//   };

//   // Handlers that require callbacks (API-like operations)
//   const handlersWithCallback = {
//     // Conversation handlers
//     async createConversation(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.authToken) {
//           return callback(createError('Missing authToken'));
//         }

//         if (!data?.type || typeof data.type !== 'string') {
//           return callback(createError('Invalid conversation type'));
//         }

//         if (!Array.isArray(data.participantIds) || !data.participantIds.length) {
//           return callback(createError('Invalid participant IDs'));
//         }

//         if (data.participantIds.length > MAX_PARTICIPANTS) {
//           return callback(createError(`Maximum of ${MAX_PARTICIPANTS} participants allowed`));
//         }

//         if (data.groupName && (
//           typeof data.groupName !== 'string' ||
//           data.groupName.length > MAX_GROUP_NAME_LENGTH
//         )) {
//           return callback(createError(`Group name must be string under ${MAX_GROUP_NAME_LENGTH} characters`));
//         }

//         const result = await messageHandlers.createConversation(
//           data.authToken,
//           userId,
//           data.type,
//           data.participantIds,
//           data.groupName,
//           data.profilePicture
//         );

//         // Notify all participants
//         result.participants.forEach(participant => {
//           io.to(participant.id.toString()).emit('newConversation', result);
//         });

//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Create conversation error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async joinConversation(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversationId) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         const conversationId = validateNumber(data.conversationId, 'conversationId');

//         if (socket.rooms.size >= MAX_ROOMS_PER_SOCKET) {
//           return callback(createError('Maximum room limit reached'));
//         }

//         // Verify user has access to conversation
//         await messageHandlers.getConversation(userId, conversationId);

//         // Leave other conversation rooms
//         for (const room of socket.rooms) {
//           if (room !== socket.id && room !== userId.toString()) {
//             await socket.leave(room);
//             debug.log(`Left room: ${room}`);
//           }
//         }

//         await socket.join(conversationId.toString());

//         // Notify other participants
//         socket.to(conversationId.toString()).emit('userJoinedConversation', {
//           userId,
//           conversationId
//         });

//         callback(createSuccess({ conversationId }));
//       } catch (error: any) {
//         debug.error('Join conversation error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async leaveConversation(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversationId) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         const conversationId = validateNumber(data.conversationId, 'conversationId');

//         await socket.leave(conversationId.toString());

//         // Notify other participants
//         socket.to(conversationId.toString()).emit('userLeftConversation', {
//           userId,
//           conversationId
//         });

//         callback(createSuccess({ conversationId }));
//       } catch (error: any) {
//         debug.error('Leave conversation error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getConversations(data: any, callback: CallbackFunction) {
//       try {
//         const conversations = await messageHandlers.getConversations(userId);
//         callback(createSuccess(conversations));
//       } catch (error: any) {
//         debug.error('Get conversations error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getConversation(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversationId) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         const conversationId = validateNumber(data.conversationId, 'conversationId');
//         const conversation = await messageHandlers.getConversation(userId, conversationId);
//         callback(createSuccess(conversation));
//       } catch (error: any) {
//         debug.error('Get conversation error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getConversationsWithUnreadCounts(data: any, callback: CallbackFunction) {
//       try {
//         const conversations = await messageHandlers.getConversationsWithUnreadCounts(userId);
//         callback(createSuccess(conversations));
//       } catch (error: any) {
//         debug.error('Get conversations with unread counts error:', error);
//         callback(createError(error.message));
//       }
//     },

//     // Message handlers
//     async sendMessage(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.authToken) {
//           return callback(createError('Missing authToken'));
//         }

//         if (!data?.conversation_id) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');

//         if (!data?.content || typeof data.content !== 'string') {
//           return callback(createError('Invalid message content'));
//         }

//         if (data.content.length > MAX_MESSAGE_LENGTH) {
//           return callback(createError(`Message content exceeds ${MAX_MESSAGE_LENGTH} characters`));
//         }

//         if (data.parent_message_id) {
//           const parentMessageId = validateNumber(data.parent_message_id, 'parent_message_id');
//           // Verify parent message exists and is in the same conversation
//           //await messageHandlers.verifyParentMessage(conversationId, parentMessageId);
//         }

//         if (data.files) {
//           if (!Array.isArray(data.files)) {
//             return callback(createError('Files must be an array'));
//           }

//           for (const file of data.files) {
//             if (!file.size || file.size > MAX_FILE_SIZE) {
//               return callback(createError(`File size must be under ${MAX_FILE_SIZE} bytes`));
//             }
//           }
//         }

//         const message = await messageHandlers.sendMessage(
//           data.authToken,
//           userId,
//           conversationId,
//           data.content,
//           data.parent_message_id,
//           data.files
//         );

//         io.to(conversationId.toString()).emit('newMessage', message);
//         callback(createSuccess(message));
//       } catch (error: any) {
//         debug.error('Send message error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async editMessage(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.authToken) {
//           return callback(createError('Missing authToken'));
//         }

//         if (!data?.conversation_id || !data?.message_id) {
//           return callback(createError('Invalid conversation or message ID'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');
//         const messageId = validateNumber(data.message_id, 'message_id');

//         if (!data?.content || typeof data.content !== 'string') {
//           return callback(createError('Invalid message content'));
//         }

//         if (data.content.length > MAX_MESSAGE_LENGTH) {
//           return callback(createError(`Message content exceeds ${MAX_MESSAGE_LENGTH} characters`));
//         }

//         const updatedMessage = await messageHandlers.editMessage(
//           data.authToken,
//           userId,
//           conversationId,
//           messageId,
//           data.content
//         );

//         io.to(conversationId.toString()).emit('messageEdited', updatedMessage);
//         callback(createSuccess(updatedMessage));
//       } catch (error: any) {
//         debug.error('Edit message error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async deleteMessage(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.authToken) {
//           return callback(createError('Missing authToken'));
//         }

//         if (!data?.conversation_id || !data?.message_id) {
//           return callback(createError('Invalid conversation or message ID'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');
//         const messageId = validateNumber(data.message_id, 'message_id');

//         await messageHandlers.deleteMessage(
//           data.authToken,
//           userId,
//           conversationId,
//           messageId
//         );

//         io.to(conversationId.toString()).emit('messageDeleted', {
//           messageId,
//           conversationId
//         });

//         callback(createSuccess({ message: 'Message deleted successfully' }));
//       } catch (error: any) {
//         debug.error('Delete message error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getMessages(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversation_id) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');
//         const limit = data.limit ? Math.min(validateNumber(data.limit, 'limit'), MAX_MESSAGE_LIMIT) : DEFAULT_MESSAGE_LIMIT;

//         const messages = await messageHandlers.getMessages(
//           userId,
//           conversationId,
//           limit,
//           data.before
//         );
//         callback(createSuccess(messages));
//       } catch (error: any) {
//         debug.error('Get messages error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getThreadMessages(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversation_id || !data?.parent_message_id) {
//           return callback(createError('Invalid conversation or parent message ID'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');
//         const parentMessageId = validateNumber(data.parent_message_id, 'parent_message_id');

//         const messages = await messageHandlers.getThreadMessages(
//           conversationId,
//           parentMessageId
//         );
//         callback(createSuccess(messages));
//       } catch (error: any) {
//         debug.error('Get thread messages error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async markMessagesAsRead(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversation_id) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');

//         const result = await messageHandlers.markMessagesAsRead(
//           userId,
//           conversationId
//         );

//         io.to(conversationId.toString()).emit('messagesRead', {
//           userId,
//           conversationId
//         });

//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Mark messages as read error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getUnreadCount(data: any, callback: CallbackFunction) {
//       try {
//         const result = await messageHandlers.getUnreadCount(userId);
//         callback(createSuccess({ unreadCount: result }));
//       } catch (error: any) {
//         debug.error('Get unread count error:', error);
//         callback(createError(error.message));
//       }
//     },

//     // Reaction handlers
//     async addReaction(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.authToken) {
//           return callback(createError('Missing authToken'));
//         }

//         if (!data?.conversation_id || !data?.message_id) {
//           return callback(createError('Invalid conversation or message ID'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');
//         const messageId = validateNumber(data.message_id, 'message_id');

//         if (!data?.reaction || !VALID_REACTIONS.includes(data.reaction)) {
//           return callback(createError(`Invalid reaction. Must be one of: ${VALID_REACTIONS.join(', ')}`));
//         }

//         const result = await messageHandlers.addReaction(
//           data.authToken,
//           userId,
//           conversationId,
//           messageId,
//           data.reaction
//         );

//         io.to(conversationId.toString()).emit('reactionAdded', result);
//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Add reaction error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async deleteReaction(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversation_id || !data?.message_id) {
//           return callback(createError('Invalid conversation or message ID'));
//         }

//         if (!data?.reaction || !VALID_REACTIONS.includes(data.reaction)) {
//           return callback(createError(`Invalid reaction. Must be one of: ${VALID_REACTIONS.join(', ')}`));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');
//         const messageId = validateNumber(data.message_id, 'message_id');

//         const result = await messageHandlers.deleteReaction(
//           userId,
//           messageId,
//           data.reaction
//         );

//         io.to(conversationId.toString()).emit('reactionDeleted', result);
//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Delete reaction error:', error);
//         callback(createError(error.message));
//       }
//     },

//     // Group handlers
//     async addParticipantToGroup(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversationId || !data?.userId) {
//           return callback(createError('Invalid conversation or user ID'));
//         }

//         const conversationId = validateNumber(data.conversationId, 'conversationId');
//         const targetUserId = validateNumber(data.userId, 'userId');

//         const result = await messageHandlers.addParticipantToGroup(
//           conversationId,
//           targetUserId
//         );

//         io.to(conversationId.toString()).emit('participantAdded', result);
//         // Also notify the new participant
//         io.to(targetUserId.toString()).emit('addedToGroup', result);

//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Add participant error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async removeParticipantFromGroup(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversationId || !data?.userId) {
//           return callback(createError('Invalid conversation or user ID'));
//         }

//         const conversationId = validateNumber(data.conversationId, 'conversationId');
//         const targetUserId = validateNumber(data.userId, 'userId');

//         const result = await messageHandlers.removeParticipantFromGroup(
//           conversationId,
//           targetUserId
//         );

//         io.to(conversationId.toString()).emit('participantRemoved', result);
//         // Also notify the removed participant
//         io.to(targetUserId.toString()).emit('removedFromGroup', {
//           conversationId,
//           userId: targetUserId
//         });

//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Remove participant error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async updateGroupProfilePicture(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.authToken) {
//           return callback(createError('Missing authToken'));
//         }

//         if (!data?.conversationId) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         const conversationId = validateNumber(data.conversationId, 'conversationId');

//         if (!data?.profilePicture) {
//           return callback(createError('No profile picture provided'));
//         }

//         const result = await messageHandlers.updateGroupProfilePicture(
//           data.authToken,
//           conversationId,
//           data.profilePicture
//         );

//         io.to(conversationId.toString()).emit('groupProfilePictureUpdated', {
//           conversationId,
//           profilePictureUrl: result.profile_picture
//         });

//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Update group profile picture error:', error);
//         callback(createError(error.message));
//       }
//     },

//     // Search handlers
//     async searchMessages(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.conversation_id) {
//           return callback(createError('Invalid conversation ID'));
//         }

//         if (!data?.query || typeof data.query !== 'string') {
//           return callback(createError('Invalid search query'));
//         }

//         const conversationId = validateNumber(data.conversation_id, 'conversation_id');

//         if (data.query.length > MAX_QUERY_LENGTH) {
//           return callback(createError(`Search query exceeds ${MAX_QUERY_LENGTH} characters`));
//         }

//         const result = await messageHandlers.searchMessages(
//           conversationId,
//           data.query
//         );

//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Search messages error:', error);
//         callback(createError(error.message));
//       }
//     },

//     // User status handlers
//     async setUserStatus(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.status || !VALID_USER_STATUSES.includes(data.status)) {
//           return callback(createError(`Invalid status. Must be one of: ${VALID_USER_STATUSES.join(', ')}`));
//         }

//         const result = await messageHandlers.setUserStatus(userId, data.status);

//         // Broadcast status change to all users
//         io.emit('userStatusChanged', {
//           userId,
//           status: data.status
//         });

//         callback(createSuccess(result));
//       } catch (error: any) {
//         debug.error('Set user status error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getUserStatus(data: any, callback: CallbackFunction) {
//       try {
//         if (!data?.userId) {
//           return callback(createError('Invalid user ID'));
//         }

//         const targetUserId = validateNumber(data.userId, 'userId');
//         const status = await messageHandlers.getUserStatus(targetUserId);
//         callback(createSuccess(status));
//       } catch (error: any) {
//         debug.error('Get user status error:', error);
//         callback(createError(error.message));
//       }
//     },

//     async getOnlineUsers(data: any, callback: CallbackFunction) {
//       try {
//         const onlineUsers = await messageHandlers.getOnlineUsers();
//         callback(createSuccess(onlineUsers));
//       } catch (error: any) {
//         debug.error('Get online users error:', error);
//         callback(createError(error.message));
//       }
//     }
//   };

//   // Register handlers without callbacks (real-time events)
//   Object.entries(handlersWithoutCallback).forEach(([event, handler]) => {
//     socket.on(event, (data: any) => {
//       try {
//         debug.log(`Executing ${event}`, { userId, data });
//         handler(data);
//         debug.log(`Successfully executed ${event}`);
//       } catch (error) {
//         debug.error(`Error in ${event}:`, error);
//       }
//     });
//   });

//   // Register handlers with callbacks (API-like operations)
//   Object.entries(handlersWithCallback).forEach(([event, handler]) => {
//     socket.on(event, async (data: any, callback: CallbackFunction) => {
//       let callbackCalled = false;
//       try {
//         debug.log(`Executing ${event}`, { userId, data });
//         await handler(data, (...args) => {
//           if (!callbackCalled) {
//             callbackCalled = true;
//             callback(...args);
//           }
//         });
//         debug.log(`Successfully executed ${event}`);
//       } catch (error: any) {
//         debug.error(`Error in ${event}:`, error);
//         if (!callbackCalled) {
//           callbackCalled = true;
//           callback(createError(error.message));
//         }
//       }
//     });
//   });
// }

// export { socketEvents };
