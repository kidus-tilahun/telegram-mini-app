import Image from "next/image";

interface HeroBannerProps {
  heroImageUrl: string;
}
export default function HeroBanner({ heroImageUrl }: HeroBannerProps) {
  return (
    <section>
      <Image
        src={heroImageUrl}
        alt="Boutique promotional banner"
        width={200}
        height={400}
        className="rounded-2xl"
      />
    </section>
  );
}
