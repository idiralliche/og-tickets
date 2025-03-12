import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback(
    (message, type = 'info', duration = 2000) => {
      setNotification({ message, type });
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
  const typeClass = `notification-${type}`;
  return <div className={`notification-banner ${typeClass}`}>{message}</div>;
};
