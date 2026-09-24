"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Tags,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

/**
 * Admin navigation: sticky glass tab bar on mobile (primary surface),
 * fixed sidebar on desktop. Same links, same authorization — presentation only.
 */
export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: sticky glass top bar with tab pills */}
      <header className="sticky top-0 z-40 overflow-hidden md:hidden">
        <div className="glass-nav -mx-px -mt-px">
          <div className="flex items-center justify-between px-5 pb-1 pt-[max(env(safe-area-inset-top),0.75rem)]">
            <div className="flex min-h-11 items-center gap-2.5">
              <div
                aria-hidden
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground ring-1 ring-border"
              >
                <Store size={16} strokeWidth={1.8} />
              </div>
              <div className="leading-tight">
                <h1 className="font-display text-lg text-foreground">Admin</h1>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Boutique
                </p>
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View storefront"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors active:bg-muted"
            >
              <ExternalLink size={18} strokeWidth={1.8} aria-hidden />
            </Link>
          </div>

          <nav aria-label="Admin" className="px-3 pb-2.5">
            <div className="flex gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                        : "text-muted-foreground active:bg-muted",
                    ].join(" ")}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      aria-hidden
                    />
                    <span className="text-[10px] font-medium tracking-wide">
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Desktop: fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-3 px-6 pb-5 pt-[max(env(safe-area-inset-top),1.5rem)]">
          <div
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground ring-1 ring-border"
          >
            <Store size={18} strokeWidth={1.8} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg text-foreground">Admin</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Boutique
            </p>
          </div>
        </div>

        <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex min-h-11 items-center gap-3 rounded-full px-4 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  aria-hidden
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted"
          >
            <ExternalLink size={18} strokeWidth={1.8} aria-hidden />
            View Storefront
          </Link>
        </div>
      </aside>
    </>
  );
}
