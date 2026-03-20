// ==========================================
// ReUz — Socket.IO Real-time Handlers
// ==========================================

import { verifyToken } from './auth.js';

// Map userId -> Set of socketIds
const userSockets = new Map();

export function setupSocket(io) {
  // Auth middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        socket.userId = decoded.userId;
        return next();
      }
    }
    // Allow anonymous connections (for browsing) but no userId
    next();
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;

    if (userId) {
      // Join user's personal room
      socket.join(`user:${userId}`);

      // Track socket
      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId).add(socket.id);

      console.log(`🔌 User ${userId} connected (${userSockets.get(userId).size} connections)`);
    }

    // Join conversation room
    socket.on('conversation:join', (conversationId) => {
      socket.join(`conv:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conv:${conversationId}`);
    });

    // Typing indicator
    socket.on('chat:typing', ({ conversationId, userName }) => {
      socket.to(`conv:${conversationId}`).emit('chat:typing', { conversationId, userName });
    });

    socket.on('disconnect', () => {
      if (userId && userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);
        if (userSockets.get(userId).size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });

  return io;
}

// Emit to specific user (across all their connections)
export function emitToUser(io, userId, event, data) {
  io.to(`user:${userId}`).emit(event, data);
}

// Emit to conversation participants
export function emitToConversation(io, conversationId, event, data) {
  io.to(`conv:${conversationId}`).emit(event, data);
}

export function isUserOnline(userId) {
  return userSockets.has(userId) && userSockets.get(userId).size > 0;
}
