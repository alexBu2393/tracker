const NAZWA_CACHE = "tracker-nawykow-v1";
const PLIKI_DO_ZAPISANIA = [
    "index.html",
    "style.css",
    "skrypt.js",
    "manifest.json",
    "icon-192.png",
    "icon-512.png"
];

self.addEventListener("install", function(zdarzenie) {
    zdarzenie.waitUntil(
        caches.open(NAZWA_CACHE).then(function(cache) {
            return cache.addAll(PLIKI_DO_ZAPISANIA);
        })
    );
});

self.addEventListener("fetch", function(zdarzenie) {
    zdarzenie.respondWith(
        caches.match(zdarzenie.request).then(function(odpowiedzZCache) {
            return odpowiedzZCache || fetch(zdarzenie.request);
        })
    );
});