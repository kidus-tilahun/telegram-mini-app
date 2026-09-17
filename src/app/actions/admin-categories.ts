"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type AdminCategory = Tables<"categories">;

export type GetAdminCategoriesResult =
  | { success: true; categories: AdminCategory[] }
  | { success: false; error: string };

export async function getAdminCategoriesAction(): Promise<GetAdminCategoriesResult> {
  try {
    const supabase = createServiceRoleClient();

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, categories: categories ?? [] };
  } catch (error) {
    return { success: false, error: "Failed to fetch categories" };
  }
}

export type CreateCategoryInput = TablesInsert<"categories">;

export type CreateCategoryResult =
  | { success: true; category: AdminCategory }
  | { success: false; error: string };

export async function createCategoryAction(
  input: CreateCategoryInput,
): Promise<CreateCategoryResult> {
  try {
    const supabase = createServiceRoleClient();

    const { data: category, error } = await supabase
      .from("categories")
      .insert(input)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Failed to create category" };
  }
}

export type UpdateCategoryInput = TablesUpdate<"categories"> & { id: string };

export type UpdateCategoryResult =
  | { success: true; category: AdminCategory }
  | { success: false; error: string };

export async function updateCategoryAction(
  input: UpdateCategoryInput,
): Promise<UpdateCategoryResult> {
  try {
    const { id, ...updates } = input;
    const supabase = createServiceRoleClient();

    const { data: category, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Failed to update category" };
  }
}

export type DeleteCategoryResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteCategoryAction(
  id: string,
): Promise<DeleteCategoryResult> {
  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete category" };
  }
}
