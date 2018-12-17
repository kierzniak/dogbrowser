/* global workbox, self */

workbox.setConfig({ debug: false });

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// Preache the PWA icons
workbox.precaching.precacheAndRoute([
  "/manifest.json",
  "/img/icons/favicon.png",
  "/img/icons/google-128.png",
  "/img/icons/google-192.png",
  "/img/icons/pwa-64.png",
  "/img/icons/pwa-128.png",
  "/img/icons/pwa-256.png",
  "/img/icons/pwa-512.png"
]);

// Cache the Google Fonts javascrupt with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  new RegExp("^https://ajax.googleapis.com/ajax/libs/webfont"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-scripts"
  })
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  new RegExp("^https://fonts.googleapis.com/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-stylesheets"
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  new RegExp("^https://fonts.gstatic.com/"),
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365
      })
    ]
  })
);

// Cache Flickr API images
workbox.routing.registerRoute(
  new RegExp("^https://.+.staticflickr.com/"),
  workbox.strategies.cacheFirst({
    cacheName: "api-image-cache",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30 // Cache for 30 days
      })
    ]
  })
);

// Cache Flickr API
workbox.routing.registerRoute(
  new RegExp("^https://api.flickr.com/services/rest/"),
  workbox.strategies.networkFirst({
    cacheName: "api-cache",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 1 // 1 hour
      })
    ]
  })
);
