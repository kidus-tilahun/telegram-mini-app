"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { syncTelegramSessionAction } from "@/app/actions/telegram";

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      return;
    }

    webApp.ready();
    webApp.expand();
  }, []);

  async function syncTelegramSession() {
    if (hasSyncedRef.current) {
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      return;
    }

    hasSyncedRef.current = true;

    const result = await syncTelegramSessionAction(initData);
    if (result.success) {
      router.refresh();
    } else {
      hasSyncedRef.current = false;
    }
  }

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onLoad={() => {
          void syncTelegramSession();
        }}
      />
      {children}
    </>
  );
}
