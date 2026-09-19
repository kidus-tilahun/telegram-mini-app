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

async function hmacSha256(key: Uint8Array, data: string): Promise<Uint8Array> {
  // Convert Uint8Array to ArrayBuffer to avoid SharedArrayBuffer type issues
  const keyBuffer = new ArrayBuffer(key.length);
  new Uint8Array(keyBuffer).set(key);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(data),
  );
  return new Uint8Array(signature);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function validateTelegramInitData(
  initData: string,
  botToken: string,
): Promise<ValidatedInitData | null> {
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

  // Generate secret key: HMAC-SHA256("WebAppData", botToken)
  const secretKey = await hmacSha256(
    new TextEncoder().encode("WebAppData"),
    botToken,
  );

  // Calculate hash: HMAC-SHA256(secretKey, dataCheckString)
  const dataCheckString = buildDataCheckString(params);
  const calculatedHashBytes = await hmacSha256(secretKey, dataCheckString);
  const calculatedHash = bytesToHex(calculatedHashBytes);

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
