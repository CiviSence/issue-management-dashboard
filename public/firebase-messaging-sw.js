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
    badge: '/favicon.ico',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click to focus or open a tab relative to the current site origin
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Retrieve relative path from notification payload data or fallback
  const relativePath = event.notification.data?.path || '/notifications';
  const targetUrl = new URL(relativePath, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus tab if already open
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window/tab if not already open
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
