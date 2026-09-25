"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { syncTelegramSessionAction } from "@/app/actions/telegram";

export type TelegramSyncStatus = "pending" | "synced" | "failed";

interface TelegramSyncContextValue {
  syncStatus: TelegramSyncStatus;
}

const TelegramSyncContext = createContext<TelegramSyncContextValue>({
  syncStatus: "pending",
});

export function useTelegramSync() {
  return useContext(TelegramSyncContext);
}

const MAX_RETRY_ATTEMPTS = 10;
const RETRY_BASE_DELAY_MS = 300;
const MAX_TOTAL_WAIT_MS = 5000;
// Reduced polling interval from 2000ms to 5000ms to reduce re-renders
const USER_CHANGE_POLL_INTERVAL = 5000;

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [syncStatus, setSyncStatus] = useState<TelegramSyncStatus>("pending");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mountedRef = useRef(true);
  const lastSyncedUserIdRef = useRef<number | null>(null);
  const syncInProgressRef = useRef(false);

  const syncTelegramSession = useCallback(async (): Promise<boolean> => {
    if (syncInProgressRef.current) {
      return false;
    }
    if (!mountedRef.current) {
      return false;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      return false;
    }

    // Extract user ID from initData
    let userId: number | null = null;
    try {
      const params = new URLSearchParams(initData);
      const userRaw = params.get("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        userId = user?.id ?? null;
      }
    } catch {
      // ignore parse errors
    }

    // Skip if we've already synced this exact user
    if (lastSyncedUserIdRef.current === userId && userId !== null) {
      return false;
    }

    syncInProgressRef.current = true;

    try {
      const result = await syncTelegramSessionAction(initData);
      if (!mountedRef.current) return false;

      if (result.success) {
        lastSyncedUserIdRef.current = userId;
        setSyncStatus("synced");
        return true;
      } else {
        setSyncStatus("failed");
        return false;
      }
    } catch {
      if (!mountedRef.current) return false;
      setSyncStatus("failed");
      return false;
    } finally {
      syncInProgressRef.current = false;
    }
  }, []);

  // Handle Telegram WebApp initialization once the SDK is available
  const initializeWebApp = useCallback(() => {
    if (!mountedRef.current) return;

    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;

    // Mark script as loaded
    setScriptLoaded(true);

    // Initialize the WebApp
    webApp.ready();
    webApp.expand();

    // If initData is available immediately, sync
    const initData = webApp.initData;
    if (initData) {
      void syncTelegramSession();
    }
  }, [syncTelegramSession]);

  // The Telegram SDK script is injected into <head> with
  // strategy="beforeInteractive" in the root layout, so it is normally
  // already executed by the time this component mounts. Initialize
  // immediately when available; otherwise poll briefly (50ms x 40 = up to
  // 2s) as a fallback for slow networks.
  useEffect(() => {
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tryInit = () => {
      if (!mountedRef.current) return;
      if (window.Telegram?.WebApp) {
        initializeWebApp();
        return;
      }
      attempts++;
      if (attempts < 40) {
        timer = setTimeout(tryInit, 50);
      } else {
        setSyncStatus("failed");
      }
    };

    tryInit();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [initializeWebApp]);

  // Set up polling/retry for initData after script loads
  useEffect(() => {
    if (!scriptLoaded) return;

    const startTime = Date.now();
    let retryCount = 0;

    const attemptSync = () => {
      if (!mountedRef.current) return;
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        setSyncStatus("failed");
        return;
      }
      if (Date.now() - startTime > MAX_TOTAL_WAIT_MS) {
        setSyncStatus("failed");
        return;
      }

      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) {
        retryCount++;
        const delay = Math.min(
          RETRY_BASE_DELAY_MS * Math.pow(1.5, retryCount - 1),
          1000,
        );
        setTimeout(attemptSync, delay);
        return;
      }

      void syncTelegramSession();
    };

    attemptSync();
  }, [scriptLoaded, syncTelegramSession]);

  // Detect Telegram user changes - keep cookie fresh for non-cart pages
  // Using a ref to track if we've already detected a change to avoid repeated state updates
  const userChangeDetectedRef = useRef(false);
  useEffect(() => {
    if (!scriptLoaded) return;

    const intervalId = setInterval(() => {
      if (!mountedRef.current) return;

      const currentUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (!currentUserId) return;

      // If the Telegram user has changed from what we synced, re-sync
      if (lastSyncedUserIdRef.current !== currentUserId) {
        // Only trigger re-sync once per user change
        if (!userChangeDetectedRef.current) {
          userChangeDetectedRef.current = true;
          // Reset so next syncTelegramSession call will proceed
          lastSyncedUserIdRef.current = null;
          setSyncStatus("pending");
          void syncTelegramSession();
        }
      } else {
        // Reset the flag when user is back to the synced one
        userChangeDetectedRef.current = false;
      }
    }, USER_CHANGE_POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [scriptLoaded, syncTelegramSession]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ syncStatus }), [syncStatus]);

  return (
    <TelegramSyncContext.Provider value={contextValue}>
      {children}
      {syncStatus === "failed" && (
        <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center bg-red-50 px-4 py-2 text-sm text-red-700 shadow-md">
          <span>Unable to connect to Telegram, pull to refresh</span>
        </div>
      )}
    </TelegramSyncContext.Provider>
  );
}
