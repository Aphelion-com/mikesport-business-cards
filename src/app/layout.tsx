import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettingsSafe } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Dynamic metadata so the admin-configured favicon applies across the whole
// app (login, dashboard, public cards, not-found). Resilient: getSettingsSafe
// never throws, so this is safe at build time too.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsSafe();
  return {
    title: "Mike Sport — Digital Business Cards",
    description: "Official digital business cards for Mike Sport employees.",
    icons: settings.faviconUrl
      ? { icon: settings.faviconUrl, shortcut: settings.faviconUrl, apple: settings.faviconUrl }
      : undefined,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full bg-paper font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
