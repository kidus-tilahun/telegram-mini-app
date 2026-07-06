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
      <Link href="/" className="flex items-center gap-2.5">
        <div
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"
        >
          <Image
            src={store.logo_url}
            alt={`${store.store_name} logo`}
            width={36}
            height={36}
            className="w-12 h-12 object-cover overflow-hidden rounded-full"
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
        href="/products"
        aria-label="Search products"
        className="grid h-11 w-11 place-items-center rounded-full bg-slate-200 text-foreground shadow-[var(--shadow-soft)]"
      >
        <Search size={18} strokeWidth={1.8} />
      </Link>
    </header>
  );
}
