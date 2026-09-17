import { getDashboardStatsAction } from "@/app/actions/admin-dashboard";

export async function GET() {
  const result = await getDashboardStatsAction();
  return Response.json(result);
}
