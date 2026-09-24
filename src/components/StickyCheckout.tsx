import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Price from "@/components/ui/Price";

interface StickyCheckoutProps {
  total: number;
}

export default function StickyCheckout({ total }: StickyCheckoutProps) {
  const router = useRouter();
  const handleCheckout = () => {
    console.log("Checkout");
    router.push("/checkout");
  };
  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+max(env(safe-area-inset-bottom),1rem))] z-50 mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
      <button
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98]"
        onClick={handleCheckout}
      >
        Checkout · <Price value={total} />
        <ArrowRight size={16} aria-hidden />
      </button>
    </div>
  );
}
