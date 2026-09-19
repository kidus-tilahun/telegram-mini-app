import { getDashboardStatsAction } from "@/app/actions/admin-dashboard";
import { requireAdmin } from "@/lib/telegram/is-admin";

async function verifyAdmin() {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return Response.json(
      { success: false, error: "Admin access required" },
      { status: 403 },
    );
  }

  const result = await getDashboardStatsAction();
  return Response.json(result);
}
