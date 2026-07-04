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

  useEffect(() => {
    console.log("[NotificationProvider] Initializing listeners. Platform is native:", Capacitor.isNativePlatform());
    if (Capacitor.isNativePlatform()) {
      // Setup native notification listeners
      const regListener = PushNotifications.addListener('registration', (registeredToken) => {
        console.log('[NotificationProvider] Native FCM Token received:', registeredToken.value);
        setToken(registeredToken.value);
      });

      const errListener = PushNotifications.addListener('registrationError', (error) => {
        console.error('[NotificationProvider] Error on native push registration:', error);
      });

      const msgListener = PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[NotificationProvider] Native Message received in foreground:', notification);
        const title = notification.title || 'New notification';
        const body = notification.body || '';
        toast.info(`${title}\n${body}`);
        alert(`${title}\n${body}`);
      });

      // Request permissions and register for push notifications on native devices
      PushNotifications.checkPermissions().then((status) => {
        console.log('[NotificationProvider] Native checkPermissions status:', status);
        if (status.receive === 'prompt') {
          return PushNotifications.requestPermissions();
        }
        return status;
      }).then((status) => {
        console.log('[NotificationProvider] Native requestPermissions status:', status);
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
        console.log("[NotificationProvider] Initializing Firebase app with config:", firebaseConfig);
        app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);
      } catch (err) {
        console.error("[NotificationProvider] Firebase initialization failed:", err);
        return;
      }

      // 3. Setup foreground notification listener
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("[NotificationProvider] Foreground notification received:", payload);
        const title = payload.notification?.title || 'New notification';
        const body = payload.notification?.body || '';
        toast.info(`${title}\n${body}`);
        alert(`${title}\n${body}`);
      });

      // 4. Request token if permission is already granted or when user logs in
      const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
      console.log("[NotificationProvider] Auth Token presence check:", !!jwtToken, "Permission state:", permission);
      if (jwtToken && permission === "granted") {
        console.log("[NotificationProvider] Permission already granted, fetching token...");
        registerFCMToken(messaging);
      }

      return () => unsubscribe();
    }
  }, [permission]);

  // Function to request permission and register token
  const requestPermissionAndRegister = async () => {
    if (Capacitor.isNativePlatform()) return;
    try {
      console.log("[NotificationProvider] Requesting permission...");
      const result = await Notification.requestPermission();
      console.log("[NotificationProvider] Permission request result:", result);
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
      console.log("[NotificationProvider] Getting token from Firebase using VAPID key:", VAPID_PUBLIC_KEY);
      const fcmToken = await getToken(messagingInstance, {
        vapidKey: VAPID_PUBLIC_KEY
      });
      if (fcmToken) {
        setToken(fcmToken);
        console.log("[NotificationProvider] Generated FCM Token successfully:", fcmToken);
        
        // Send token to backend API
        const backendUrl = import.meta.env.VITE_API_BASE_URL 
          ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") 
          : "https://csm-backend-aws.duckdns.org";
          
        const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
        console.log("[NotificationProvider] Registering token with backend:", `${backendUrl}/api/devices/register`);
        
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
            app_name: "webapp2" // CRUCIAL: Tells backend to route via FIREBASE_CREDENTIALS_JSON_2
          })
        });
        
        if (response.ok) {
          const resData = await response.json();
          console.log("[NotificationProvider] FCM device token registered with backend successfully. Response:", resData);
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

  // Automatically request/setup when provider boots or user login state changes
  useEffect(() => {
    const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
    console.log("[NotificationProvider] Checking login state change. Has token:", !!jwtToken);
    if (jwtToken) {
      requestPermissionAndRegister();
    } else {
      console.log("[NotificationProvider] User not authenticated yet, waiting for login...");
    }
  }, [setPermission]); // Run on mount or when token updates

  // Also hook into window event for session/login synchronization if they login in other parts of the app
  useEffect(() => {
    const checkAuthAndRegister = () => {
      const jwtToken = getAccessToken() || localStorage.getItem("auth_token") || localStorage.getItem("token");
      if (jwtToken) {
        console.log("[NotificationProvider] Session detected on check, registering...");
        requestPermissionAndRegister();
      }
    };
    
    // Check auth on mount
    checkAuthAndRegister();
    
    // Also listen to storage events (in case token is written after login redirect)
    window.addEventListener('storage', checkAuthAndRegister);
    return () => window.removeEventListener('storage', checkAuthAndRegister);
  }, []);

  return (
    <NotificationContext.Provider value={{ token, permission, requestPermissionAndRegister }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
export const useNotifications = () => useContext(NotificationContext);
