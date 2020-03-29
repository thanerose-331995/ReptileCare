//these two only run once per session, can be useful for caching

//a new cache
const staticCache = 'site-static-v7';
const dynamicCache = 'site-dynamic-v7';

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
    '/img/lizard.png',
    '/pages/fallback.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

//size limiter func
function limitCacheSize(name, size) {
    caches.open(name).then(cache => {
        //get each key in cache
        cache.keys().then(keys => {
            //if cache too big
            if (keys.length > size) {
                //delete the first key and recall function
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

//install event
self.addEventListener('install', evt => {
    console.log("service worker installed");
    //have to wait as the install event may complete before we have fully written into the cache, js is async
    evt.waitUntil(
        //open or create this cache
        caches.open(staticCache).then(cache => {
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
    evt.waitUntil(
        //find each keys of the caches
        caches.keys().then(keys => {
            //promise all takes an array of promises and waits for them to resolve before resolving itself
            return Promise.all(keys
                //if key doesnt equal cash name
                .filter(key => key !== staticCache && key !== dynamicCache)
                //delete key
                .map(key => caches.delete(key)))
        })
    )
})

//fetch event
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt.request.url);
    //make sure its not a request to the db
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            //check if req is in cache
            caches.match(evt.request).then((res) => {
                //if not res will b empty, so return res OR re-fetch the req
                return res || fetch(evt.request).then(fetchRes => {
                    //if not stored in cache, store in different cache (dynamic caching)
                    return caches.open(dynamicCache).then(cache => {
                        //store a clone in the cache and return the original
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCache, 20);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                //if the url includes .html
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html')
                }
            })
        );
    }
})