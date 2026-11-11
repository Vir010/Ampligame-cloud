import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import ScrollTop from "@/components/layout/ScrollTop";
import AppInit from "@/components/AppInit";
import { LangProvider } from "@/lib/i18n";

import "@/styles/style.css";
import "@/styles/avatar.css";
import "@/styles/profile.css";
import "@/styles/cloudgame.css";
import "@/styles/setting.css";
import "@/styles/library.css";
import "@/styles/supports.css";
import "@/styles/events.css";
import "@/styles/groups.css";
import "@/styles/mobile.css";
import "@/styles/friends.css";
import "@/styles/forums.css";
import "@/styles/poisk.css";

export const metadata: Metadata = {
  title: "AMPLIGAME",
  description: "Игровая платформа",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <LangProvider>
          <AppInit />
          <div className="app">
            <Sidebar />
            <TopBar />
            <main className="content">
              {children}
              <Footer />
            </main>
          </div>
          <ScrollTop />
        </LangProvider>
      </body>
    </html>
  );
}
