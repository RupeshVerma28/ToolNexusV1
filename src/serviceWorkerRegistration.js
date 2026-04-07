// small utility to register/unregister the service worker
export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL || ""}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          // console.log('SW registered:', registration);
        })
        .catch((error) => {
          // console.warn('SW registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let reg of registrations) {
        reg.unregister();
      }
    });
  }
}
