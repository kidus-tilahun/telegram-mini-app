import { ShoppingBag } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Your bag is empty"
      description="Browse our boutique and discover your next favorite piece."
      actionLabel="Continue Shopping"
      actionHref="/shop"
    />
  );
}
