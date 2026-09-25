"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

// Debounce so each keystroke no longer triggers a full navigation +
// server re-render (the previous per-keystroke router.push was a major
// INP/TBT cost on the shop page).
const SEARCH_DEBOUNCE_MS = 300;

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Clear any pending debounce on unmount.
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (next === "") {
        params.delete("q");
      } else {
        params.set("q", next);
      }

      router.push(`${pathname}?${params.toString()}`);
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <div className="px-5 pt-4">
      <label className="sr-only" htmlFor="search">
        Search products
      </label>
      <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 shadow-[var(--shadow-soft)] focus-within:ring-2 focus-within:ring-ring">
        <Search
          size={18}
          className="shrink-0 text-muted-foreground"
          aria-hidden
        />
        <input
          // The input is uncontrolled; key={query} remounts it whenever the
          // URL query changes externally (back/forward, programmatic
          // navigation), keeping the field in sync without effect-based
          // state syncing. While the user types (before the debounced push
          // lands), the key is stable so typing is never interrupted.
          key={query}
          id="search"
          type="search"
          defaultValue={query}
          onChange={handleSearchChange}
          placeholder="Search products…"
          className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          aria-label="Filters"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          <SlidersHorizontal size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
