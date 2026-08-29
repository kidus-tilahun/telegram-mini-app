import Image from "next/image";
import { Sparkles } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroBannerProps {
  heroImageUrl: string;
}
export default function HeroBanner({ heroImageUrl }: HeroBannerProps) {
  return (
    <section className="px-5 pt-2 animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl bg-secondary shadow-[var(--shadow-soft)]">
        <Image
          src={heroImageUrl}
          alt="Model in flowing silk dress from the Spring Atelier collection"
          width={1280}
          height={1600}
          className="h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.16em] backdrop-blur">
            <Sparkles size={12} /> Spring Atelier
          </span>
          <h1 className="mt-3 font-display text-3xl leading-tight">
            The Quiet
            <br />
            Luxury Edit
          </h1>
          <p className="mt-1.5 text-sm text-white/85">
            Up to 25% off curated picks this week.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-surface-elevated px-5 text-sm font-medium text-foreground"
          >
            Shop the edit <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
