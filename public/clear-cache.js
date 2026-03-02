// Cache clearing script for development
if (typeof window !== 'undefined') {
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
  
  // Clear localStorage cache markers
  localStorage.removeItem('app-version');
  localStorage.removeItem('news-page-version');
  localStorage.removeItem('last-reload');
  
  // Force reload
  window.location.reload();
}
