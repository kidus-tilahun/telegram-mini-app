"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  ImagePlus,
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminListSkeleton from "@/components/admin/AdminListSkeleton";
import AdminModal from "@/components/admin/AdminModal";
import Badge from "@/components/ui/Badge";
import ErrorState from "@/components/ui/ErrorState";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  status: string;
  featured: boolean;
  category_id: string;
  created_at: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const statusOptions = ["active", "inactive", "draft"];

const inputClasses =
  "h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60";

const labelClasses = "mb-1.5 block text-sm font-medium text-foreground";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    status: "active",
    featured: false,
    category_id: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/products");
      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      } else {
        setError(result.error || "Failed to fetch products");
      }
    } catch {
      setError("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch {
      // Silently fail - categories are optional for the form
      console.error("Failed to fetch categories");
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      price: "",
      stock: "",
      image: "",
      status: "active",
      featured: false,
      category_id: "",
    });
    setFormError("");
    setEditingProduct(null);
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      status: product.status,
      featured: product.featured,
      category_id: product.category_id,
    });
    setFormError("");
    setShowForm(true);
  }

  async function handleImageUpload(file: File) {
    setIsUploadingImage(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: uploadForm,
      });

      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, image: result.url }));
      } else {
        setFormError(result.error || "Failed to upload image");
      }
    } catch {
      setFormError("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }

  function handleCameraCapture() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // Use rear camera on mobile
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    input.click();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const method = editingProduct ? "PATCH" : "POST";
      const body = editingProduct
        ? { ...formData, id: editingProduct.id }
        : formData;

      const response = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        resetForm();
        fetchProducts();
      } else {
        setFormError(result.error || "Failed to save product");
      }
    } catch {
      setFormError("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (result.success) {
        fetchProducts();
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch {
      alert("Failed to delete product");
    }
  }

  function categoryLabel(id: string) {
    return categories.find((c) => c.id === id)?.name;
  }

  return (
    <>
      <AdminHeader
        title="Products"
        description="Manage your product catalog"
        action={
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={2} aria-hidden />
            Add Product
          </button>
        }
      />

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <AdminListSkeleton rows={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : products.length === 0 ? (
          <AdminEmptyState
            icon={Package}
            title="No products yet"
            description="Add your first product to start building your catalog."
            actionLabel="Add Product"
            onAction={openCreateForm}
          />
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryLabel={categoryLabel(product.category_id)}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <AdminModal
          title={editingProduct ? "Edit Product" : "Add Product"}
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
              <label htmlFor="product-name" className={labelClasses}>
                Name{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="product-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClasses}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="product-price" className={labelClasses}>
                  Price (ETB){" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="product-stock" className={labelClasses}>
                  Stock{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div>
              <span className={labelClasses}>Product Image</span>
              <div className="space-y-3">
                {/* Image Preview */}
                {formData.image && (
                  <div className="relative h-40 w-32 overflow-hidden rounded-xl border border-border bg-muted">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    disabled={isUploadingImage}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 text-sm font-medium text-foreground transition-colors active:bg-muted disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <LoaderCircle
                        size={15}
                        className="animate-spin"
                        aria-hidden
                      />
                    ) : (
                      <Camera size={15} strokeWidth={1.8} aria-hidden />
                    )}
                    {isUploadingImage ? "Uploading…" : "Take Photo"}
                  </button>
                  <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 text-sm font-medium text-foreground transition-colors active:bg-muted">
                    <ImagePlus size={15} strokeWidth={1.8} aria-hidden />
                    Choose from Gallery
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={isUploadingImage}
                      className="sr-only"
                    />
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-destructive/30 px-4 text-sm font-medium text-destructive transition-colors active:bg-destructive/10"
                    >
                      <Trash2 size={15} strokeWidth={1.8} aria-hidden />
                      Remove Image
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  aria-label="Image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                  className={inputClasses}
                  placeholder="Or enter image URL manually"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="product-status" className={labelClasses}>
                  Status
                </label>
                <select
                  id="product-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className={inputClasses}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="product-category" className={labelClasses}>
                  Category{" "}
                  <span className="text-destructive" aria-hidden>
                    *
                  </span>
                </label>
                <select
                  id="product-category"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category_id: e.target.value,
                    }))
                  }
                  className={inputClasses}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-elevated px-4 transition-colors active:bg-muted">
              <input
                type="checkbox"
                id="product-featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-5 w-5 rounded accent-primary"
              />
              <span className="text-sm font-medium text-foreground">
                Featured product
              </span>
            </label>

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
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}

// Product Card Component - Mobile-friendly card layout
function ProductCard({
  product,
  categoryLabel,
  onEdit,
  onDelete,
}: {
  product: Product;
  categoryLabel?: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  const statusVariant =
    product.status === "active"
      ? "success"
      : product.status === "draft"
        ? "accent"
        : "neutral";

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <Package size={22} strokeWidth={1.5} aria-hidden />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {product.name}
          </p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-base text-foreground tabular-nums">
              ETB {product.price.toLocaleString()}
            </span>
            {categoryLabel && (
              <span className="truncate text-xs text-muted-foreground">
                {categoryLabel}
              </span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant={statusVariant}>
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </Badge>
            {product.featured && <Badge variant="accent">Featured</Badge>}
            {product.stock === 0 ? (
              <Badge variant="destructive">Out of stock</Badge>
            ) : (
              <span className="text-xs text-muted-foreground tabular-nums">
                Stock: {product.stock}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium text-foreground transition-colors active:bg-muted"
        >
          <Pencil size={15} strokeWidth={1.8} aria-hidden />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-destructive/30 text-sm font-medium text-destructive transition-colors active:bg-destructive/10"
        >
          <Trash2 size={15} strokeWidth={1.8} aria-hidden />
          Delete
        </button>
      </div>
    </article>
  );
}
