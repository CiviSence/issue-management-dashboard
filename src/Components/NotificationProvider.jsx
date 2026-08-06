import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { getAccessToken } from '../Utils/auth-utils';

// Create a context so your app can check permission status or notifications
const NotificationContext = createContext(null);

// 1. Firebase Config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// VAPID Public Key from environment variables
const VAPID_PUBLIC_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const NotificationProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState(
    Capacitor.isNativePlatform() ? 'granted' : Notification.permission
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const hasAttemptedRegistration = useRef(false);

  const fetchUnreadCount = useCallback(async () => {
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
  }, []);

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
      // 2. Initialize Firebase inside the provider if credentials exist
      if (!firebaseConfig.apiKey) {
        console.warn("[NotificationProvider] Firebase API key missing in environment variables. Web push notifications disabled.");
        return;
      }

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
        // Get the active PWA service worker registration which imports firebase-messaging-sw.js
        registration = await navigator.serviceWorker.getRegistration() || await navigator.serviceWorker.register('/sw.js');
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

  // Trigger registration once when a valid JWT session exists and notification permission is granted
  useEffect(() => {
    const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (jwtToken && !token && !hasAttemptedRegistration.current && permission === "granted") {
      hasAttemptedRegistration.current = true;
      requestPermissionAndRegister();
    }
  }, [permission, token]);

  // Fetch unread count on mount, tab focus, and 60s background interval
  useEffect(() => {
    const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (!jwtToken) return;

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // 60s interval

    const handleFocus = () => fetchUnreadCount();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchUnreadCount]);

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
