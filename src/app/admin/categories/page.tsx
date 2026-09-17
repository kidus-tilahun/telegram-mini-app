"use client";

import { useState, useEffect } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

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
      const url = "/api/admin/categories";
      const method = editingCategory ? "PATCH" : "POST";
      const body = editingCategory
        ? { ...formData, id: editingCategory.id }
        : formData;

      const response = await fetch(url, {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-gray-500">Manage product categories</p>
          </div>
          <button className="w-full sm:w-auto" disabled>
            Loading...
          </button>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-gray-500">
          Loading categories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-gray-500">Manage product categories</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500">Manage product categories</p>
        </div>
        <button
          onClick={openCreateForm}
          className="w-full sm:w-auto rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border shadow-sm">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories yet. Click "Add Category" to create your first
            category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Sort Order
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{category.name}</td>
                    <td className="px-4 py-3 font-mono text-sm">
                      {category.slug}
                    </td>
                    <td className="px-4 py-3">{category.sort_order}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(category.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditForm(category)}
                          className="text-primary-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 md:items-center">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            <div className="border-b p-4 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  placeholder="lowercase-with-dashes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingCategory
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
