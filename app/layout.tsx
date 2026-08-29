import type { Metadata } from "next";
import { Providers } from "@/components/layout/Providers";
import { NavigationDock } from "@/components/layout/NavigationDock";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Your Name - Full-Stack Developer",
    template: "%s | Your Name"
  },
  description:
    "A futuristic portfolio for full-stack development, applied AI, and product engineering projects.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ScrollProgress />
          <ThemeToggle />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <NavigationDock />
        </Providers>
      </body>
    </html>
  );
}

