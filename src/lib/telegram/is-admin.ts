import "server-only";

import { getTelegramUser } from "./get-telegram-user";

function getAdminUserId(): number | null {
  const adminUserId = process.env.TELEGRAM_ADMIN_USER_ID;
  if (!adminUserId) {
    return null;
  }

  const id = Number(adminUserId);
  if (!Number.isFinite(id)) {
    return null;
  }

  return id;
}

export async function isAdmin(): Promise<boolean> {
  const adminUserId = getAdminUserId();
  if (adminUserId === null) {
    return false;
  }

  const user = await getTelegramUser();
  if (!user) {
    return false;
  }

  return user.id === adminUserId;
}

export async function requireAdmin(): Promise<number> {
  const adminUserId = getAdminUserId();
  if (adminUserId === null) {
    throw new Error("Admin user ID not configured");
  }

  const user = await getTelegramUser();
  if (!user) {
    throw new Error("Telegram authentication required");
  }

  if (user.id !== adminUserId) {
    throw new Error("Admin access required");
  }

  return user.id;
}
