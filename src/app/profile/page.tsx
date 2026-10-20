"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
  const { currentRole, baseUser } = useUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all group"
            >
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-amber-500/30">
                <Image src="/logo.jpg" alt="یه خونه" fill className="object-cover" />
              </div>
              <span className="text-base font-extrabold bg-gradient-to-l from-amber-400 to-white bg-clip-text text-transparent">
                پروفایل کاربری یه خونه
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Clean Slate Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800/60 max-w-lg w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mb-2">
            فضای طراحی جدید پروفایل کاربری
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            محتویات قبلی این صفحه به طور کامل پاک‌سازی شد. آماده‌ایم تا بخش به بخش این صفحه را از صفر (Scratch) به بهترین شکل بسازیم.
          </p>
        </div>
      </main>
    </div>
  );
}
