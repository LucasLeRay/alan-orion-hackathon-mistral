import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', function (event) {
  const message = event.data.json();

  const body = message.body;
  if (body) {
    self.registration.showNotification('orion', {
      body: message.body,
      icon: '/favicon.png',
      tag: 'general'
    });
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(clients.openWindow('/'));
});
