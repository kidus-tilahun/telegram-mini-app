"use client";

import { useState, useEffect } from "react";
import { LoaderCircle, Pencil, Plus, Tag, Tags, Trash2 } from "lucide-react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminListSkeleton from "@/components/admin/AdminListSkeleton";
import AdminModal from "@/components/admin/AdminModal";
import ErrorState from "@/components/ui/ErrorState";

type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

const inputClasses =
  "h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60";

const labelClasses = "mb-1.5 block text-sm font-medium text-foreground";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sort_order: 0,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(result.categories);
      } else {
        setError(result.error || "Failed to fetch categories");
      }
    } catch {
      setError("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      slug: "",
      sort_order: 0,
    });
    setFormError("");
    setEditingCategory(null);
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      sort_order: category.sort_order,
    });
    setFormError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const method = editingCategory ? "PATCH" : "POST";
      const body = editingCategory
        ? { ...formData, id: editingCategory.id }
        : formData;

      const response = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        resetForm();
        fetchCategories();
      } else {
        setFormError(result.error || "Failed to save category");
      }
    } catch {
      setFormError("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (result.success) {
        fetchCategories();
      } else {
        alert(result.error || "Failed to delete category");
      }
    } catch {
      alert("Failed to delete category");
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      <AdminHeader
        title="Categories"
        description="Manage product categories"
        action={
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={2} aria-hidden />
            Add Category
          </button>
        }
      />

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <AdminListSkeleton rows={3} />
        ) : error ? (
          <ErrorState message={error} />
        ) : categories.length === 0 ? (
          <AdminEmptyState
            icon={Tags}
            title="No categories yet"
            description="Create your first category to organize your catalog."
            actionLabel="Add Category"
            onAction={openCreateForm}
          />
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={openEditForm}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <AdminModal
          title={editingCategory ? "Edit Category" : "Add Category"}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4 pb-2">
            {formError && (
              <div
                role="alert"
                className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
              >
                {formError}
              </div>
            )}

            <div>
              <label htmlFor="category-name" className={labelClasses}>
                Name{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="category-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label htmlFor="category-slug" className={labelClasses}>
                Slug{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="category-slug"
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className={inputClasses}
                required
                placeholder="lowercase-with-dashes"
              />
            </div>

            <div>
              <label htmlFor="category-sort" className={labelClasses}>
                Sort Order
              </label>
              <input
                id="category-sort"
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
                className={inputClasses}
              />
            </div>

            <div className="flex gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-12 flex-1 rounded-full border border-border text-sm font-medium text-foreground transition-colors active:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                      aria-hidden
                    />
                    Saving…
                  </>
                ) : editingCategory ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}

// Category Card Component - Mobile-friendly card layout
function CategoryCard({
  category,
  onEdit,
  onDelete,
  formatDate,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
        >
          <Tag size={18} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {category.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            /{category.slug} · Sort {category.sort_order}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(category.created_at)}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium text-foreground transition-colors active:bg-muted"
        >
          <Pencil size={15} strokeWidth={1.8} aria-hidden />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(category.id)}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-destructive/30 text-sm font-medium text-destructive transition-colors active:bg-destructive/10"
        >
          <Trash2 size={15} strokeWidth={1.8} aria-hidden />
          Delete
        </button>
      </div>
    </article>
  );
}
