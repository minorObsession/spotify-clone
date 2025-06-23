// Simple Service Worker Registration
class SimpleServiceWorker {
  private isSupported = "serviceWorker" in navigator;

  async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn("Service Worker not supported on this client");
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered:", registration);
      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  async unregister(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log("Service Worker unregistered");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Service Worker unregistration failed:", error);
      return false;
    }
  }

  isControlling(): boolean {
    return !!navigator.serviceWorker.controller;
  }

  async clearCache(): Promise<void> {
    try {
      const cache = await caches.open("spotify-cache-v1");
      const keys = await cache.keys();
      await Promise.all(keys.map((key) => cache.delete(key)));
      console.log("Cache cleared");
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  }
}

// Export singleton
export const serviceWorker = new SimpleServiceWorker();

// Auto-register on page load
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    serviceWorker.register();
  });
}
