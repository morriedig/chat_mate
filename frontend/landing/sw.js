// The app used to be a PWA at this path. This worker replaces the old one once,
// clears its caches and unregisters, so browsers stop serving the old cached app.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map(key => caches.delete(key)))
    await self.registration.unregister()
    const windows = await self.clients.matchAll({ type: 'window' })
    windows.forEach(client => client.navigate(client.url))
  })())
})
