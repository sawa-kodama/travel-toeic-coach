import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Travel TOEIC Coach",
  description: "TOEIC初心者と海外旅行英語のためのミニ学習アプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-app px-0 sm:px-4 sm:py-6">
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-white/92 shadow-float backdrop-blur sm:min-h-[calc(100vh-3rem)] sm:rounded-[2.2rem] sm:border sm:border-white/70">
            <AppHeader />
            <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
