this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('palette-assets-v1').then(cache => {
      return cache.addAll([
        '/',
        '/js/jquery.min.js',
        '/js/scripts.js',
        '/css/styles.css',
        '/css/fontello-39a7439d/css/fontello.css',
        '/css/fontello-39a7439d/css/fontello-ie7.css',
        '/css/fontello-39a7439d/css/fontello-ie7-codes.css',
        '/css/fontello-39a7439d/css/fontello-embedded.css',
        '/css/fontello-39a7439d/css/fontello-codes.css',
        '/css/fontello-39a7439d/css/animation.css',
        '/css/fontello-39a7439d/font/fontello.eot',
        '/css/fontello-39a7439d/font/fontello.svg',
        '/css/fontello-39a7439d/font/fontello.ttf',
        '/css/fontello-39a7439d/font/fontello.woff',
        '/css/fontello-39a7439d/font/fontello.woff2',
      ]);
    })
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

this.addEventListener('activate', (event) => {
  let cacheWhitelist = ['palette-assets-v1'];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
    .then(() => clients.claim())
  );
});

this.addEventListener('message', (event) => {
  if (event.data.type === 'add-palette') {
    self.registration.showNotification(`${event.data.paletteName} was succesfully added!`);
  }
});