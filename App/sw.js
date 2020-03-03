//these two only run once per session, can be useful for caching

//a new cache
const staticCacheName = 'site-static';


//asset array, in this case 'asset' means anything requested from the server (in url form)
//these are called 'shell assets'
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/style.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

//install event
self.addEventListener('install', evt => {
    //console.log("service worker installed");
    //have to wait as the install event may complete before we have fully written into the cache, js is async
    evt.waitUntil(
        //open or create this cache
        caches.open(staticCacheName).then(cache => {
            //now we can access this cache
            //add = one , addAll = array
            console.log("caching shell assets");
            cache.addAll(assets);
        })
    );
})

//activate event
self.addEventListener('activate', evt => {
    //console.log("service worked activated");
})

//fetch event
self.addEventListener('fetch', evt => {
    console.log('fetch event', evt.request.url);
    evt.respondWith(
        //check if req is in cache
        caches.match(evt.request).then((res) => {
            //if not res will b empty, so return res OR re-fetch the req
            return res || fetch(evt.request);
        })
    );
})