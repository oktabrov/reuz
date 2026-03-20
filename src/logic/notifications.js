// ==========================================
// ReUz — Real-Time Notification Engine
// ==========================================

import { store } from '../store.js';

/**
 * Notification types:
 *   purchase     — item bought (to seller)
 *   message      — new chat message
 *   dispute      — dispute opened / response / escalated / resolved
 *   order_update — shipped / delivered / completed / cancelled
 *   system       — generic system events
 */

export function createNotification(userId, type, title, message, link = null) {
  const notification = {
    id: store.generateId(),
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: Date.now()
  };

  store.add('notifications', notification);
  return notification;
}

export function getUserNotifications(userId) {
  return store
    .filter('notifications', n => n.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getUnreadCount(userId) {
  return store.filter('notifications', n => n.userId === userId && !n.read).length;
}

export function markAsRead(notificationId) {
  store.update('notifications', notificationId, { read: true });
}

export function markAllAsRead(userId) {
  const unread = store.filter('notifications', n => n.userId === userId && !n.read);
  unread.forEach(n => {
    store.update('notifications', n.id, { read: true });
  });
}
