import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  if (!ADMIN_PASSWORD) {
    return Response.json(
      { success: false, error: "Admin password not configured" },
      { status: 500 },
    );
  }

  const { password } = await request.json();

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return Response.json({ success: true });
  }

  return Response.json(
    { success: false, error: "Invalid password" },
    { status: 401 },
  );
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  return Response.json({ success: true });
}
