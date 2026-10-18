"use client";

import React, { useEffect } from "react";
import ClassicSignUpForm from "./ClassicSignUpForm";
import { X, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice?: string;
  defaultMode?: "signup" | "signin";
}

export default function AuthModal({
  isOpen,
  onClose,
  notice,
  defaultMode = "signup"
}: AuthModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-amber-500/30">
              <Image src="/logo.jpg" alt="یه خونه" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                ورود و ثبت‌نام در سامانه «یه خونه»
              </h3>
              <p className="text-[11px] text-slate-400">
                سامانه هوشمند معاملات مسکن تهران • تایید هویت امن
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Context Notice (e.g. when clicking + ثبت ملک) */}
        {notice && (
          <div className="mx-5 sm:mx-8 mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          <ClassicSignUpForm onSuccess={onClose} defaultMode={defaultMode} />
        </div>
      </div>
    </div>
  );
}
