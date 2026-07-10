interface StickyCheckoutProps {
  total: number;
}

export default function StickyCheckout({ total }: StickyCheckoutProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
      <button className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98]">
        Checkout · ${total.toFixed(2)}
      </button>
    </div>
  );
}
