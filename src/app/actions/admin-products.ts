"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type AdminProduct = Tables<"products">;

export type GetAdminProductsResult =
  | { success: true; products: AdminProduct[] }
  | { success: false; error: string };

export async function getAdminProductsAction(): Promise<GetAdminProductsResult> {
  try {
    const supabase = createServiceRoleClient();

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, products: products ?? [] };
  } catch (error) {
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
    const supabase = createServiceRoleClient();

    const { data: product, error } = await supabase
      .from("products")
      .insert(input)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, product };
  } catch (error) {
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
    const { id, ...updates } = input;
    const supabase = createServiceRoleClient();

    const { data: product, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, product };
  } catch (error) {
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
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
}
