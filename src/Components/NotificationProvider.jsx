import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { getAccessToken } from '../Utils/auth-utils';

// Create a context so your app can check permission status or notifications
const NotificationContext = createContext(null);

// 1. Firebase Config for civisence-admin (Project 2)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB0sJMchdyKjnK4AHqR7ecYn_G4XK2yMbE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civisence-admin.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civisence-admin",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civisence-admin.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1073506164891",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1073506164891:web:9ce7d09a578b2396dbe63e"
};

// VAPID Public Key from your civisence-admin Firebase Console (Cloud Messaging settings)
const VAPID_PUBLIC_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "BGYGaaEo2j5ftK0eMK5I4flQUkv_Iax4cuxKpljXtRGneoyov6zWLpigmqFJ1OEu_CGSW7yaeXVfQ3U8h280xDM";

export const NotificationProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState(
    Capacitor.isNativePlatform() ? 'granted' : Notification.permission
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (!jwtToken) return;
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL 
        ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") 
        : "https://civisence-api.duckdns.org";
      const response = await fetch(`${backendUrl}/api/notifications/my-notifications`, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const count = (data || []).filter(n => n.is_unread).length;
        setUnreadCount(count);
      }
    } catch (err) {
      // Quietly swallow error to keep clean console logs
    }
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Setup native notification listeners
      const regListener = PushNotifications.addListener('registration', (registeredToken) => {
        setToken(registeredToken.value);
      });

      const errListener = PushNotifications.addListener('registrationError', (error) => {
        console.error('[NotificationProvider] Error on native push registration:', error);
      });

      const msgListener = PushNotifications.addListener('pushNotificationReceived', (notification) => {
        const title = notification.title || 'New notification';
        const body = notification.body || '';
        toast.info(`${title}\n${body}`);
        alert(`${title}\n${body}`);
        fetchUnreadCount();
      });

      // Request permissions and register for push notifications on native devices
      PushNotifications.checkPermissions().then((status) => {
        if (status.receive === 'prompt') {
          return PushNotifications.requestPermissions();
        }
        return status;
      }).then((status) => {
        if (status.receive === 'granted') {
          PushNotifications.register();
          setPermission('granted');
        } else {
          console.warn('[NotificationProvider] Native notification permission not granted');
          setPermission('denied');
        }
      });

      return () => {
        regListener.remove();
        errListener.remove();
        msgListener.remove();
      };
    } else {
      // 2. Initialize Firebase inside the provider
      let app, messaging;
      try {
        app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);
      } catch (err) {
        console.error("[NotificationProvider] Firebase initialization failed:", err);
        return;
      }

      // 3. Setup foreground notification listener
      const unsubscribe = onMessage(messaging, (payload) => {
        const title = payload.notification?.title || 'New notification';
        const body = payload.notification?.body || '';
        toast.info(`${title}\n${body}`);
        alert(`${title}\n${body}`);
        fetchUnreadCount();
      });

      // 4. Request token if permission is already granted or when user logs in
      const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
      if (jwtToken && permission === "granted") {
        registerFCMToken(messaging);
      }

      return () => unsubscribe();
    }
  }, [permission]);

  // Function to request permission and register token
  const requestPermissionAndRegister = async () => {
    if (Capacitor.isNativePlatform()) return;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        await registerFCMToken(messaging);
      }
    } catch (error) {
      console.error("[NotificationProvider] Error requesting notification permission:", error);
    }
  };

  const registerFCMToken = async (messagingInstance) => {
    try {
      let registration;
      if ('serviceWorker' in navigator) {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        // Wait until service worker is active
        await navigator.serviceWorker.ready;
      }

      const fcmToken = await getToken(messagingInstance, {
        vapidKey: VAPID_PUBLIC_KEY,
        serviceWorkerRegistration: registration
      });
      if (fcmToken) {
        setToken(fcmToken);
        
        // Send token to backend API
        const backendUrl = import.meta.env.VITE_API_BASE_URL 
          ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") 
          : "https://civisence-api.duckdns.org";
          
        const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
        
        const response = await fetch(`${backendUrl}/api/devices/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
          },
          body: JSON.stringify({
            fcm_token: fcmToken,
            device_type: "web",
            device_name: `Dashboard (${navigator.userAgent.substring(0, 50)})`,
            app_name: "civisence-admin" // CRUCIAL: Tells backend to route via FIREBASE_CREDENTIALS_JSON_2
          })
        });
        
        if (response.ok) {
          const resData = await response.json();
          localStorage.setItem("registered_fcm_token", fcmToken);
        } else {
          const errText = await response.text();
          console.error("[NotificationProvider] Failed to register token with backend. Status:", response.status, "Error:", errText);
        }
      } else {
        console.warn("[NotificationProvider] No registration token available.");
      }
    } catch (err) {
      console.error("[NotificationProvider] Error fetching/registering FCM token:", err);
    }
  };

  // Automatically watch and trigger when a token becomes available in localStorage or cookies
  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
      if (jwtToken && !token) {
        requestPermissionAndRegister();
        clearInterval(checkTokenInterval);
      }
    }, 1000); // Check every 1 second until registered

    return () => clearInterval(checkTokenInterval);
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [token]);

  return (
    <NotificationContext.Provider value={{ 
      token, 
      permission, 
      requestPermissionAndRegister, 
      unreadCount, 
      fetchUnreadCount 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
export const useNotifications = () => useContext(NotificationContext);
