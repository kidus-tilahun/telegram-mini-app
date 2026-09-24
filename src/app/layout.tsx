import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";

import TelegramProvider from "@/components/TelegramProvider";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

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
      <body
        className={`min-h-full flex flex-col font-sans ${cormorant.variable} ${montserrat.variable}`}
      >
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
