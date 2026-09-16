import {
  getAdminOrdersAction,
  updateOrderStatusAction,
} from "@/app/actions/admin-orders";

export async function GET() {
  const result = await getAdminOrdersAction();
  return Response.json(result);
}

export async function PATCH(request: Request) {
  const { orderId, status } = await request.json();

  if (!orderId || !status) {
    return Response.json(
      { success: false, error: "Missing orderId or status" },
      { status: 400 },
    );
  }

  const result = await updateOrderStatusAction(orderId, status);
  return Response.json(result);
}
