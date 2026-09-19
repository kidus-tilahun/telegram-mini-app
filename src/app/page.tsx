import { redirect } from "next/navigation";
import { getTelegramUser } from "@/lib/telegram/get-telegram-user";

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

export default async function RootPage() {
  const adminUserId = getAdminUserId();
  const user = await getTelegramUser();

  const isAdmin = adminUserId !== null && user?.id === adminUserId;

  if (isAdmin) {
    redirect("/admin/dashboard");
  }

  redirect("/shop");
}
