import type { Metadata } from "next";
import { Geist_Mono, Public_Sans } from "next/font/google";
import Script from "next/script";
import { AgentationDev } from "@/components/dev/agentation-dev";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mutolaa",
    template: "%s · Mutolaa",
  },
  description:
    "A calm, modern space to read and manage your digital books and long-form content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${publicSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <Script
          id="mutolaa-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="mutolaa-theme";var t=localStorage.getItem(k);if(t==="dark"){document.documentElement.classList.add("dark");return;}if(t==="light"){document.documentElement.classList.remove("dark");return;}if(window.matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(e){}})();`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
        >
          Asosiy tarkibga o‘tish
        </a>
        {children}
        {(process.env.NODE_ENV === "development" ||
          process.env.NEXT_PUBLIC_AGENTATION === "true") && (
          <AgentationDev />
        )}
      </body>
    </html>
  );
}
