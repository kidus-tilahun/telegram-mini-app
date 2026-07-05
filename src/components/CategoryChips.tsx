import type { Category } from "@/types/category";
import Link from "next/link";

interface CategoryChipsProps {
  categories: Category[];
}

export default function CategoryChips({ categories }: CategoryChipsProps) {
  return (
    <section className="mt-8 px-5">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-xl text-foreground">Categories</h2>
        <Link
          href="/shop"
          className="text-xs font-medium text-muted-foreground"
        >
          See all
        </Link>
      </div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {categories.slice(1).map((category) => (
          <Link
            key={category.id}
            href="/shop"
            className="shrink-0 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm text-foreground transition-colors active:bg-muted"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
