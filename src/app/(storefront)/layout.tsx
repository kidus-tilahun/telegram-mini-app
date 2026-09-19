import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "MVP E-commerce App",
  description: "E-commerce Telegram Mini App for Boutique",
};

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-background pb-32 pt-[max(env(safe-area-inset-top),0.5rem)]">
      {children}
    </div>
  );
}
