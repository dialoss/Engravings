const CACHE_NAME = 'v1';
const urls = ['index.html', 'offline.html'];

this.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            //console.log('cache')
        )
    )
})