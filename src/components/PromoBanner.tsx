import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PromoBannerProps {
  imageUrl: string;
}

export default function PromoBanner({ imageUrl }: PromoBannerProps) {
  return (
    <section className="mt-8 px-5 animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]">
        <Image
          src={imageUrl}
          alt="Promotion"
          width={1200}
          height={800}
          loading="lazy"
          className="w-full rounded-2xl object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5 text-primary-foreground">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/80">
            Featured
          </p>
          <p className="mt-1 font-display text-2xl leading-tight">
            The Trench
            <br />
            Collection
          </p>
          <Link
            href="/shop"
            className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-white underline-offset-4 hover:underline"
          >
            Explore <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
