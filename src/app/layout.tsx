import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "یه خونه | سامانه هوشمند املاک و نقشه تهران (YeKhoone)",
  description: "سامانه هوشمند و یکپارچه معاملات مسکن تهران با نقشه هوشمند تهران، تور ویدیویی املاک و اتاق نشست آنلاین قرارداد.",
  icons: {
    icon: "/logo.jpg",
  },
};

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/logo.jpg" />
        <meta name="theme-color" content="#1e1b4b" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
