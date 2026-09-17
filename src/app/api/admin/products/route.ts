import {
  getAdminProductsAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/app/actions/admin-products";

export async function GET() {
  const result = await getAdminProductsAction();
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createProductAction(body);
  return Response.json(result);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const result = await updateProductAction(body);
  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const result = await deleteProductAction(id);
  return Response.json(result);
}
