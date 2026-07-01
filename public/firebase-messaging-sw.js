importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyB0sJMchdyKjnK4AHqR7ecYn_G4XK2yMbE",
  authDomain: "civisence-admin.firebaseapp.com",
  projectId: "civisence-admin",
  storageBucket: "civisence-admin.firebasestorage.app",
  messagingSenderId: "1073506164891",
  appId: "1:1073506164891:web:9ce7d09a578b2396dbe63e"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'CiviSence Alert';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/pwa-192x192.png',
    badge: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
