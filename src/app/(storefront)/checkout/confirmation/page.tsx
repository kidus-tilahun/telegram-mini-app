import { Suspense } from "react";
import OrderConfirmationContent from "./OrderConfirmationContent";
import PageLoader from "@/components/ui/PageLoader";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading your order…" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
