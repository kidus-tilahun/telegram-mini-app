import type { Category } from "@/types/category";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

interface CategoryChipsProps {
  categories: Category[];
}

export default function CategoryChips({ categories }: CategoryChipsProps) {
  return (
    <section className="mt-8 px-5">
      <SectionHeading
        title="Categories"
        actionLabel="See all"
        actionHref="/shop"
      />
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {categories.slice(1).map((category) => (
          <Link
            key={category.id}
            href="/shop"
            className="shrink-0 rounded-full border border-border bg-surface-elevated px-4 py-2.5 text-sm text-foreground transition-colors active:bg-muted"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
