import crypto from "crypto";

import type { TelegramUser, ValidatedInitData } from "./types";

const MAX_AUTH_AGE_SECONDS = 86_400;

function buildDataCheckString(params: URLSearchParams): string {
  const pairs: string[] = [];

  params.forEach((value, key) => {
    if (key !== "hash") {
      pairs.push(`${key}=${value}`);
    }
  });

  pairs.sort();
  return pairs.join("\n");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function validateTelegramInitData(
  initData: string,
  botToken: string,
): ValidatedInitData | null {
  if (!initData.trim()) {
    return null;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    return null;
  }

  const authDateRaw = params.get("auth_date");
  const userRaw = params.get("user");

  if (!authDateRaw || !userRaw) {
    return null;
  }

  const authDate = Number(authDateRaw);
  if (!Number.isFinite(authDate)) {
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (nowSeconds - authDate > MAX_AUTH_AGE_SECONDS) {
    return null;
  }

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const dataCheckString = buildDataCheckString(params);
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (!timingSafeEqualHex(calculatedHash, hash)) {
    return null;
  }

  let user: TelegramUser;
  try {
    user = JSON.parse(userRaw) as TelegramUser;
  } catch {
    return null;
  }

  if (!user?.id || typeof user.id !== "number") {
    return null;
  }

  return {
    user,
    authDate,
    queryId: params.get("query_id") ?? undefined,
    hash,
  };
}
