import React, { createContext, useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../Utils/firebaseConfig';
import { toast } from 'react-toastify';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

const NotificationContext = createContext({ token: null });

export const NotificationProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // 1. Request permissions and register for push notifications on native devices
      PushNotifications.checkPermissions().then((status) => {
        if (status.receive === 'prompt') {
          return PushNotifications.requestPermissions();
        }
        return status;
      }).then((status) => {
        if (status.receive === 'granted') {
          PushNotifications.register();
        } else {
          console.warn('Native notification permission not granted');
        }
      });

      // 2. Set up native notification listeners
      const regListener = PushNotifications.addListener('registration', (registeredToken) => {
        console.log('Native FCM Token:', registeredToken.value);
        setToken(registeredToken.value);
      });

      const errListener = PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on native push registration:', error);
      });

      const msgListener = PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Native Message received in foreground: ', notification);
        const title = notification.title || 'New notification';
        const body = notification.body || '';
        toast.info(`${title}\n${body}`);
      });

      return () => {
        regListener.remove();
        errListener.remove();
        msgListener.remove();
      };
    } else {
      // 3. Fallback to standard Web Firebase Messaging SDK in the browser
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
            .then((currentToken) => {
              if (currentToken) {
                console.log('Web FCM Token:', currentToken);
                setToken(currentToken);
              } else {
                console.warn('No registration token available.');
              }
            })
            .catch((err) => console.error('Error getting Web FCM token', err));
        } else {
          console.warn('Notification permission not granted');
        }
      });

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received: ', payload);
        const title = payload.notification?.title || 'New notification';
        const body = payload.notification?.body || '';
        toast.info(`${title}\n${body}`);
      });

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ token }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => React.useContext(NotificationContext);
