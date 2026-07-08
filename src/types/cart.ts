import type { Database } from "./database";
import type { Product } from "./product";

export type Cart = Database["public"]["Tables"]["cart_items"]["Row"];

export interface CartItem {
  id: string;
  quantity: number;
  products: Pick<Product, "id" | "name" | "image" | "price">;
}
