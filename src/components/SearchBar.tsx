"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "") {
      params.delete("q");
    } else {
      params.set("q", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="px-5">
      <label className="sr-only" htmlFor="search">
        Search products
      </label>
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 shadow-[var(--shadow-soft)]">
        <Search size={18} className="text-muted-foreground" />
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products…"
          className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          aria-label="Filters"
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
