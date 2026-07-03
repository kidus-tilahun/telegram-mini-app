import type { Store } from "@/types/store";
import Image from "next/image";

interface HeaderProps {
  store: Store;
}

export default function Header({ store }: HeaderProps) {
  return (
    <header>
      <Image
        src={store.logo_url}
        alt={`${store.store_name} logo`}
        width={25}
        height={25}
        className="rounded-full"
      />
      <div>
        <h1>{store.store_name}</h1>
        <span>Boutique</span>
      </div>
    </header>
  );
}
