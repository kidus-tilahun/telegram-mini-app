"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type AdminProduct = Tables<"products">;

export type GetAdminProductsResult =
  | { success: true; products: AdminProduct[] }
  | { success: false; error: string };

export async function getAdminProductsAction(): Promise<GetAdminProductsResult> {
  try {
    console.log("[AdminProducts] Creating service role client...");
    const supabase = createServiceRoleClient();
    console.log(
      "[AdminProducts] Service role client created, querying products...",
    );

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[AdminProducts] Supabase error fetching products:", error);
      return { success: false, error: error.message };
    }

    console.log(
      "[AdminProducts] Successfully fetched products:",
      products?.length || 0,
    );
    return { success: true, products: products ?? [] };
  } catch (error) {
    console.error("[AdminProducts] Unexpected error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export type CreateProductInput = TablesInsert<"products">;

export type CreateProductResult =
  | { success: true; product: AdminProduct }
  | { success: false; error: string };

export async function createProductAction(
  input: CreateProductInput,
): Promise<CreateProductResult> {
  try {
    console.log("[AdminProducts] Creating product:", input);
    const supabase = createServiceRoleClient();

    const { data: product, error } = await supabase
      .from("products")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("[AdminProducts] Supabase error creating product:", error);
      return { success: false, error: error.message };
    }

    console.log("[AdminProducts] Successfully created product:", product.id);
    return { success: true, product };
  } catch (error) {
    console.error("[AdminProducts] Unexpected error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export type UpdateProductInput = TablesUpdate<"products"> & { id: string };

export type UpdateProductResult =
  | { success: true; product: AdminProduct }
  | { success: false; error: string };

export async function updateProductAction(
  input: UpdateProductInput,
): Promise<UpdateProductResult> {
  try {
    console.log("[AdminProducts] Updating product:", input);
    const { id, ...updates } = input;
    const supabase = createServiceRoleClient();

    const { data: product, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[AdminProducts] Supabase error updating product:", error);
      return { success: false, error: error.message };
    }

    console.log("[AdminProducts] Successfully updated product:", product.id);
    return { success: true, product };
  } catch (error) {
    console.error("[AdminProducts] Unexpected error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export type DeleteProductResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteProductAction(
  id: string,
): Promise<DeleteProductResult> {
  try {
    console.log("[AdminProducts] Deleting product:", id);
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("[AdminProducts] Supabase error deleting product:", error);
      return { success: false, error: error.message };
    }

    console.log("[AdminProducts] Successfully deleted product:", id);
    return { success: true };
  } catch (error) {
    console.error("[AdminProducts] Unexpected error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
