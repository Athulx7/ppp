const CACHE_NAME = "payroll-pwa-cache-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json"
];

self.addEventListener("install", (event) => {
    console.log("Service Worker installing...,..");

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", () => {
    console.log("Service Worker activated");
});