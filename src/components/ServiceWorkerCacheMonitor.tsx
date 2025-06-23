import React, { useState, useEffect } from "react";
import { serviceWorker } from "../serviceWorker";

export const ServiceWorkerCacheMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setIsActive(serviceWorker.isControlling());
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    try {
      setIsLoading(true);
      await serviceWorker.clearCache();
      console.log("Cache cleared successfully");
    } catch (error) {
      console.error("Failed to clear cache:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-purple-500 p-2 text-white shadow-lg"
        title="Service Worker Status"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-64 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Service Worker</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Status:</span>
          <span
            className={`font-mono ${isActive ? "text-green-600" : "text-red-600"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Caches Spotify API responses for 5 minutes
        </div>
      </div>

      <button
        onClick={handleClearCache}
        disabled={isLoading || !isActive}
        className="w-full rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
      >
        {isLoading ? "Clearing..." : "Clear Cache"}
      </button>
    </div>
  );
};
