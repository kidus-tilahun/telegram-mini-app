import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { validateTelegramInitData } from "@/lib/telegram/validate-init-data";

function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN ?? null;
}

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

async function validateInitDataAndGetUserId(
  initData: string,
): Promise<number | null> {
  const botToken = getBotToken();
  if (!botToken) {
    return null;
  }

  const validated = await validateTelegramInitData(initData, botToken);
  if (!validated?.user?.id) {
    return null;
  }

  return validated.user.id;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get admin user ID from env
  const adminUserId = getAdminUserId();

  // If admin user ID is not configured, block all admin routes
  if (adminUserId === null) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Extract and validate Telegram user ID from cookie
  const initData = request.cookies.get("tg_init_data")?.value;
  const telegramUserId = initData
    ? await validateInitDataAndGetUserId(initData)
    : null;

  const isAdmin = telegramUserId === adminUserId;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      // Non-admin users redirected to storefront
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Admin users can access admin routes
    return NextResponse.next();
  }

  // Redirect admin users from storefront to admin dashboard
  if (isAdmin && pathname === "/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/"],
};
