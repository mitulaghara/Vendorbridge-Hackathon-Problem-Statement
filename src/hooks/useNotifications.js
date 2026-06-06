// src/hooks/useNotifications.js
import { useState } from 'react';

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: "RFQ-2026-0001 has received 2 quotations", read: false },
  { id: 2, text: "New vendor 'Nexus Construction' requested verification", read: false }
];

/**
 * Custom hook to manage the notification system.
 * Provides state and helper functions for the alerts panel.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (text) => {
    setNotifications(prev => [{ id: Date.now(), text, read: false }, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const togglePanel = () => {
    setShowNotifications(prev => !prev);
  };

  return {
    notifications,
    setNotifications,
    showNotifications,
    addNotification,
    markAllRead,
    togglePanel
  };
}
