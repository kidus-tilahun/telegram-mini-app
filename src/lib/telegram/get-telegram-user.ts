import "server-only";

import { cookies } from "next/headers";

import { TelegramAuthError } from "./errors";
import type { TelegramUser } from "./types";
import { validateTelegramInitData } from "./validate-init-data";

export const TELEGRAM_INIT_DATA_COOKIE = "tg_init_data";

function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN ?? null;
}

function getDevTelegramUser(): TelegramUser | null {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (process.env.ENABLE_TELEGRAM_DEV_BYPASS !== "true") {
    return null;
  }

  const devUserId = process.env.TELEGRAM_DEV_USER_ID;
  if (!devUserId) {
    return null;
  }

  const id = Number(devUserId);
  if (!Number.isFinite(id)) {
    return null;
  }

  return {
    id,
    first_name: "Dev",
    username: "dev_user",
  };
}

function validateInitData(initData: string): TelegramUser | null {
  const botToken = getBotToken();
  if (!botToken) {
    return null;
  }

  const validated = validateTelegramInitData(initData, botToken);
  return validated?.user ?? null;
}

export async function getTelegramUser(): Promise<TelegramUser | null> {
  const devUser = getDevTelegramUser();
  if (devUser) {
    return devUser;
  }

  const cookieStore = await cookies();
  const initData = cookieStore.get(TELEGRAM_INIT_DATA_COOKIE)?.value;

  if (!initData) {
    return null;
  }

  return validateInitData(initData);
}

export async function requireTelegramUser(): Promise<TelegramUser> {
  const user = await getTelegramUser();

  if (!user) {
    throw new TelegramAuthError();
  }

  return user;
}

export function validateAndExtractUser(initData: string): TelegramUser | null {
  const devUser = getDevTelegramUser();
  if (devUser) {
    return devUser;
  }

  return validateInitData(initData);
}
