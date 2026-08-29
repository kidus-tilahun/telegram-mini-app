"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [syncStatus, setSyncStatus] = useState<TelegramSyncStatus>("pending");
  const hasSyncedRef = useRef(false);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  const syncTelegramSession = useCallback(async () => {
    if (hasSyncedRef.current) {
      return;
    }
    if (!mountedRef.current) {
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      return;
    }

    hasSyncedRef.current = true;

    try {
      const result = await syncTelegramSessionAction(initData);
      if (!mountedRef.current) return;

      if (result.success) {
        setSyncStatus("synced");
      } else {
        hasSyncedRef.current = false;
        setSyncStatus("failed");
      }
    } catch {
      if (!mountedRef.current) return;
      hasSyncedRef.current = false;
      setSyncStatus("failed");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      setSyncStatus("failed");
      return;
    }

    webApp.ready();
    webApp.expand();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  function handleScriptLoad() {
    const startTime = Date.now();

    const attemptSync = () => {
      if (!mountedRef.current) {
        setSyncStatus("failed");
        return;
      }
      if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
        setSyncStatus("failed");
        return;
      }
      if (Date.now() - startTime > MAX_TOTAL_WAIT_MS) {
        setSyncStatus("failed");
        return;
      }

      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) {
        retryCountRef.current++;
        const delay = Math.min(
          RETRY_BASE_DELAY_MS * Math.pow(1.5, retryCountRef.current - 1),
          1000,
        );
        setTimeout(attemptSync, delay);
        return;
      }

      void syncTelegramSession();
    };

    attemptSync();
  }

  return (
    <TelegramSyncContext.Provider value={{ syncStatus }}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onLoad={handleScriptLoad}
      />
      {children}
      {syncStatus === "failed" && (
        <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center bg-red-50 px-4 py-2 text-sm text-red-700 shadow-md">
          <span>Couldn't connect to Telegram, pull to refresh</span>
        </div>
      )}
    </TelegramSyncContext.Provider>
  );
}
