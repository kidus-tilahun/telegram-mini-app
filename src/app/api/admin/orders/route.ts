import {
  getAdminOrdersAction,
  updateOrderStatusAction,
} from "@/app/actions/admin-orders";
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

  console.log("[API /admin/orders] GET request received");
  const result = await getAdminOrdersAction();
  console.log("[API /admin/orders] GET result:", {
    success: result.success,
    ordersCount: result.success ? result.orders.length : 0,
    error: result.success ? undefined : result.error,
  });
  return Response.json(result);
}

export async function PATCH(request: Request) {
  if (!(await verifyAdmin())) {
    return Response.json(
      { success: false, error: "Admin access required" },
      { status: 403 },
    );
  }

  console.log("[API /admin/orders] PATCH request received");
  const { orderId, status } = await request.json();

  if (!orderId || !status) {
    return Response.json(
      { success: false, error: "Missing orderId or status" },
      { status: 400 },
    );
  }

  const result = await updateOrderStatusAction(orderId, status);
  console.log("[API /admin/orders] PATCH result:", result);
  return Response.json(result);
}
