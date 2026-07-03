import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <article className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase">{product.category}</p>
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="font-medium">ETB {product.price.toLocaleString()}</p>
        </div>
      </article>
    </Link>
  );
}
