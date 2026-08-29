"use server";

import { cookies } from "next/headers";

import { TelegramAuthError } from "@/lib/telegram/errors";
import {
  TELEGRAM_INIT_DATA_COOKIE,
  validateAndExtractUser,
} from "@/lib/telegram/get-telegram-user";

type SyncTelegramSessionResult =
  | { success: true }
  | { success: false; error: string };

export async function syncTelegramSessionAction(
  initData: string,
): Promise<SyncTelegramSessionResult> {
  if (!initData.trim()) {
    return { success: false, error: "Missing Telegram initData" };
  }

  const user = validateAndExtractUser(initData);
  if (!user) {
    return { success: false, error: "Invalid Telegram initData" };
  }

  const cookieStore = await cookies();
  cookieStore.set(TELEGRAM_INIT_DATA_COOKIE, initData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86_400,
  });

  return { success: true };
}

export async function clearTelegramSessionAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TELEGRAM_INIT_DATA_COOKIE);
}
