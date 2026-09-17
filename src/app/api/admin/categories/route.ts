import {
  getAdminCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/admin-categories";

export async function GET() {
  const result = await getAdminCategoriesAction();
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createCategoryAction(body);
  return Response.json(result);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const result = await updateCategoryAction(body);
  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const result = await deleteCategoryAction(id);
  return Response.json(result);
}
