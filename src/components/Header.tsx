import type { Store } from "@/types/store";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

interface HeaderProps {
  store: Store;
}

export default function Header({ store }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3">
      <Link href="/" className="flex min-h-11 items-center gap-2.5 rounded-xl">
        <div
          aria-hidden
          className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-primary-foreground ring-1 ring-border"
        >
          <Image
            src={store.logo_url}
            alt=""
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="leading-tight">
          <h1 className="font-display text-lg text-foreground">
            {store.store_name}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Boutique
          </p>
        </div>
      </Link>

      <Link
        href="/shop"
        aria-label="Search products"
        className="grid h-11 w-11 place-items-center rounded-full bg-surface text-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95"
      >
        <Search size={18} strokeWidth={1.8} aria-hidden />
      </Link>
    </header>
  );
}
