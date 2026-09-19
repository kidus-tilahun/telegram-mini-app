import {
  getAdminCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/admin-categories";
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

  const result = await getAdminCategoriesAction();
  return Response.json(result);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return Response.json(
      { success: false, error: "Admin access required" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const result = await createCategoryAction(body);
  return Response.json(result);
}

export async function PATCH(request: Request) {
  if (!(await verifyAdmin())) {
    return Response.json(
      { success: false, error: "Admin access required" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const result = await updateCategoryAction(body);
  return Response.json(result);
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return Response.json(
      { success: false, error: "Admin access required" },
      { status: 403 },
    );
  }

  const { id } = await request.json();
  const result = await deleteCategoryAction(id);
  return Response.json(result);
}
