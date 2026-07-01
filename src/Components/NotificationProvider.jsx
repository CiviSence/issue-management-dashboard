import React, { createContext, useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../Utils/firebaseConfig';
import { toast } from 'react-toastify';

const NotificationContext = createContext({ token: null });

export const NotificationProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Request permission for notifications
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
              setToken(currentToken);
              // Optionally send token to backend here
            } else {
              console.warn('No registration token available.');
            }
          })
          .catch((err) => console.error('Error getting FCM token', err));
      } else {
        console.warn('Notification permission not granted');
      }
    });

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      const title = payload.notification?.title || 'New notification';
      const body = payload.notification?.body || '';
      toast.info(`${title}\n${body}`);
    });

    return () => {
      // Cleanup listener if needed (onMessage returns unsubscribe in modular SDK)
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ token }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => React.useContext(NotificationContext);
