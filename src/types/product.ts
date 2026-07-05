import type { Database } from "./database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductWithCategory = Product & {
  categories: {
    id: string;
    name: string;
  };
};
