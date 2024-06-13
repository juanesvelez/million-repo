addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const url = new URL(request.url)
  
    // Check if request is for an image
    if (url.pathname.startsWith('/images/')) {
      const imageURL = url.searchParams.get('url')
      const width = url.searchParams.get('width') || 800
      const cacheKey = new Request(imageURL + `?width=${width}`, request)
  
      const cache = caches.default
      let response = await cache.match(cacheKey)
  
      if (!response) {
        const imageResponse = await fetch(imageURL)
        if (imageResponse.ok) {
          const image = await imageResponse.blob()
          response = new Response(image, imageResponse)
  
          // Resize image using Cloudflare's built-in resizing service
          response.headers.set('Content-Type', 'image/jpeg')
          response.headers.set('Cache-Control', 'public, max-age=86400')
  
          // Cache the resized image
          event.waitUntil(cache.put(cacheKey, response.clone()))
        }
      }
  
      return response
    }
  
    return fetch(request)
  }