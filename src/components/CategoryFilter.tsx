"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/category";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = searchParams.get("category") ?? "All";

  function handleCategory(category: string) {
    const params = new URLSearchParams(searchParams);

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  const chipClass = (isActive: boolean) =>
    [
      "shrink-0 rounded-full px-4 py-2.5 text-sm transition-colors",
      isActive
        ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
        : "border border-border bg-surface-elevated text-foreground active:bg-muted",
    ].join(" ");

  return (
    <section className="mt-5">
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto px-5"
        role="tablist"
        aria-label="categories"
      >
        <button
          onClick={() => handleCategory("All")}
          aria-pressed={active === "All"}
          className={chipClass(active === "All")}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategory(category.slug)}
            aria-pressed={active === category.slug}
            className={chipClass(active === category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
