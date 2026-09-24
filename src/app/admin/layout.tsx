import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/telegram/is-admin";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify admin access server-side
  try {
    await requireAdmin();
  } catch {
    redirect("/");
  }

  return (
    <div className="min-h-dvh bg-background">
      <AdminNav />
      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-md px-5 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-4 md:max-w-3xl md:px-8 md:pb-16 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
