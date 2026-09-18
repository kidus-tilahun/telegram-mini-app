"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type AdminCategory = Tables<"categories">;

export type GetAdminCategoriesResult =
  | { success: true; categories: AdminCategory[] }
  | { success: false; error: string };

export async function getAdminCategoriesAction(): Promise<GetAdminCategoriesResult> {
  try {
    console.log("[AdminCategories] Creating service role client...");
    const supabase = createServiceRoleClient();
    console.log(
      "[AdminCategories] Service role client created, querying categories...",
    );

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "[AdminCategories] Supabase error fetching categories:",
        error,
      );
      return { success: false, error: error.message };
    }

    console.log(
      "[AdminCategories] Successfully fetched categories:",
      categories?.length || 0,
    );
    return { success: true, categories: categories ?? [] };
  } catch (error) {
    console.error(
      "[AdminCategories] Unexpected error fetching categories:",
      error,
    );
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
    console.log("[AdminCategories] Creating category:", input);
    const supabase = createServiceRoleClient();

    const { data: category, error } = await supabase
      .from("categories")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error(
        "[AdminCategories] Supabase error creating category:",
        error,
      );
      return { success: false, error: error.message };
    }

    console.log(
      "[AdminCategories] Successfully created category:",
      category.id,
    );
    return { success: true, category };
  } catch (error) {
    console.error(
      "[AdminCategories] Unexpected error creating category:",
      error,
    );
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
    console.log("[AdminCategories] Updating category:", input);
    const { id, ...updates } = input;
    const supabase = createServiceRoleClient();

    const { data: category, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "[AdminCategories] Supabase error updating category:",
        error,
      );
      return { success: false, error: error.message };
    }

    console.log(
      "[AdminCategories] Successfully updated category:",
      category.id,
    );
    return { success: true, category };
  } catch (error) {
    console.error(
      "[AdminCategories] Unexpected error updating category:",
      error,
    );
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
    console.log("[AdminCategories] Deleting category:", id);
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error(
        "[AdminCategories] Supabase error deleting category:",
        error,
      );
      return { success: false, error: error.message };
    }

    console.log("[AdminCategories] Successfully deleted category:", id);
    return { success: true };
  } catch (error) {
    console.error(
      "[AdminCategories] Unexpected error deleting category:",
      error,
    );
    return { success: false, error: "Failed to delete category" };
  }
}
