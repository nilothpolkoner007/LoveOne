import { Server } from 'socket.io';
import ChatBundle from '../module/ChatMessage.js';


const userSocketMap = new Map();
let ioInstance = null;

const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('✅ Socket.IO initialized');

  ioInstance = io;
  io.userSocketMap = userSocketMap;

  io.on('connection', (socket) => {
    console.log('✅ New socket connected:', socket.id);

    // Handle user registration
    socket.on('register_user', ({ userId }) => {
      const oldSocketId = userSocketMap.get(userId);
      if (oldSocketId !== socket.id) {
        console.log(`🔗 Linked user ${userId} to socket ${socket.id}`);
        userSocketMap.set(userId, socket.id);
      }
    });

    // Join user to a room
    socket.on('join_chat', ({ userId, roomId }) => {
      socket.join(roomId);
      console.log(`👥 ${userId} joined room ${roomId}`);
    });

    // Broadcast message to room (except sender)
    socket.on('send_message', async ({ roomId, message }) => {
      if (!roomId || !message) return;

      try {
        // Try to find an existing bundle
        const existing = await ChatBundle.findOne({
          roomId,
          sender_id: message.sender_id,
        });

        if (existing) {
          existing.messages.push({
            content: message.content,
            created_at: message.created_at,
          });
          await existing.save();
        } else {
          // Create new bundle if not found
          await ChatBundle.create({
            roomId,
            sender_id: message.sender_id,
            messages: [
              {
                content: message.content,
                created_at: message.created_at,
              },
            ],
          });
        }

        socket.to(roomId).emit('receive_message', message);
      } catch (err) {
        console.error('❌ Failed to save chat bundle:', err);
      }
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Disconnected socket:', socket.id);

      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`❌ Removed user ${userId} from socket map`);
        }
      }
    });
  });
};

// Access Socket.IO instance from other files
export const getSocketIO = () => ioInstance;

export default setupChatSocket;
