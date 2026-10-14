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
  title: "یه خونه | سامانه هوشمند و رایگان املاک ایران (YeKhoone)",
  description: "سامانه جستجوی بی‌واسطه، مدرن و ۱۰۰٪ رایگان رهن، اجاره و خرید ملک در سراسر ایران با نقشه هوشمند و محاسبه‌گر رهن و اجاره.",
  icons: {
    icon: "/logo.jpg",
  },
};

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
        {children}
      </body>
    </html>
  );
}
