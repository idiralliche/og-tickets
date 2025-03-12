import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

/**
 * Manages the notification state and exposes a function (showNotification)
 * to display a temporary notification banner.
 */
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  // Function to show a notification with a message, a type and an optional duration (default 3000ms)
  const showNotification = useCallback(
    (message, type = 'info', duration = 3000) => {
      setNotification({ message, type });
      // Auto hide notification after the given duration
      setTimeout(() => {
        setNotification(null);
      }, duration);
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
        />
      )}
    </NotificationContext.Provider>
  );
};

const NotificationBanner = ({ message, type }) => {
  let backgroundColor;
  switch (type) {
    case 'success':
      backgroundColor = '#4CAF50';
      break;
    case 'error':
      backgroundColor = '#F44336';
      break;
    case 'warning':
      backgroundColor = '#FF9800';
      break;
    case 'info':
    default:
      backgroundColor = '#2196F3';
      break;
  }

  const style = {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor,
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    zIndex: 1000,
  };

  return <div style={style}>{message}</div>;
};
