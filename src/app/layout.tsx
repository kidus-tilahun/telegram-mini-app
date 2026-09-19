import type { Metadata } from "next";

import TelegramProvider from "@/components/TelegramProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MVP E-commerce App",
  description: "E-commerce Telegram Mini App for Boutique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
