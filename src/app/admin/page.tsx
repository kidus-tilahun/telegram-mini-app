import { redirect } from "next/navigation";

/** /admin lands on the dashboard. */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
