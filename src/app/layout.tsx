import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import Script from "next/script";

import TelegramProvider from "@/components/TelegramProvider";
import "./globals.css";

// Only the weights actually used in the codebase are loaded:
// - Cormorant (display): 400 (default) + 500 (font-medium on display headings)
// - Montserrat (sans): 400 (default) + 500 (font-medium) + 600 (font-semibold) + 700 (font-bold)
// Unused weights (Cormorant 600/700, Montserrat 300) were removed to cut font payload.
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MVP E-commerce App",
  description: "E-commerce Telegram Mini App for Boutique",
};

// Synchronously extracts Telegram.WebApp.themeParams into CSS custom
// properties on <html> as soon as the SDK script executes (before first
// paint). This prevents any theme flash/shift and makes the Telegram theme
// available to the app without waiting for React hydration.
// The SDK script is injected into <head> with strategy="beforeInteractive"
// below, so it runs before any Next.js/React code.
const TELEGRAM_THEME_BOOTSTRAP = `(function(){
  function apply(){
    var wa=window.Telegram&&window.Telegram.WebApp;
    if(!wa||!wa.themeParams)return false;
    var t=wa.themeParams,s=document.documentElement.style;
    s.setProperty("--tg-bg",t.backgroundColor||"");
    s.setProperty("--tg-text",t.textColor||"");
    s.setProperty("--tg-hint",t.secondaryTextColor||"");
    s.setProperty("--tg-link",t.linkColor||"");
    s.setProperty("--tg-btn",t.buttonColor||"");
    s.setProperty("--tg-btn-text",t.buttonTextColor||"");
    s.setProperty("--tg-header",t.headerColor||"");
    return true;
  }
  if(apply())return;
  var n=0;
  var id=setInterval(function(){n++;if(apply()||n>100)clearInterval(id);},10);
})();`;

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
        {/*
          Telegram SDK is loaded with strategy="beforeInteractive": the script
          tag is inlined into <head> and fetched in parallel with the HTML,
          executing before any Next.js/React code. This makes
          Telegram.WebApp.ready() fire within ~100ms of page load instead of
          after hydration (the previous afterInteractive behavior).
        */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <Script
          id="telegram-theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: TELEGRAM_THEME_BOOTSTRAP }}
        />
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
