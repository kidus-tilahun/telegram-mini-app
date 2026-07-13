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

  return (
    <section className="mt-5">
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto px-5"
        role="tablist"
        aria-label="categories"
      >
        <button
          onClick={() => handleCategory("All")}
          className={
            active === "All"
              ? "rounded-full bg-primary px-4 py-2 text-primary-foreground"
              : "rounded-full border px-4 py-2"
          }
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategory(category.slug)}
            className={
              active === category.slug
                ? "rounded-full bg-primary px-4 py-2 text-primary-foreground"
                : "rounded-full border px-4 py-2"
            }
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
