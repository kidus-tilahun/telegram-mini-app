"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart } from "lucide-react";

interface BottomNavigationProps {
  cartCount: number;
}

const items = [
  {
    href: "/",
    label: "Home",
    Icon: Home,
  },
  {
    href: "/shop",
    label: "Shop",
    Icon: ShoppingBag,
  },
  {
    href: "/cart",
    label: "Cart",
    Icon: ShoppingCart,
  },
];

export default function BottomNavigation({ cartCount }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),1rem)]"
    >
      <div className="flex w-full max-w-sm items-center justify-around rounded-full bg-black px-2 py-2 shadow-[var(--shadow-float)]">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 py-2 transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "text-gray-400 hover:text-white",
              ].join(" ")}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />

                {label === "Cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-medium tracking-wide">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
