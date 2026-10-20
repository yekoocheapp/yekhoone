"use client";

import React, { useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import SmartCaptcha from "./SmartCaptcha";
import { UserRole } from "@/data/users";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  Briefcase,
  Building
} from "lucide-react";

interface ClassicSignUpFormProps {
  onSuccess?: () => void;
  className?: string;
  defaultMode?: "signup" | "signin";
}

const ROLE_OPTIONS: {
  role: UserRole;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}[] = [
  {
    role: "buyer",
    title: "متقاضی و خریدار مسکن",
    subtitle: "جستجوی ملک، رهن و اجاره، خرید، تهاتر دارایی و ذخیره فایل‌ها",
    icon: Home,
    tag: "پرطرفدار"
  },
  {
    role: "seller",
    title: "مالک یا سازنده مسکن",
    subtitle: "ثبت مستقیم فایل ملکی، فروش، رهن، تهاتر و مشارکت در ساخت",
    icon: KeyRound,
    tag: "ثبت مستقیم"
  },
  {
    role: "agent",
    title: "مشاور رسمی املاک",
    subtitle: "فایلینگ تخصصی، همراهی مشتریان و حضور در اتاق نشست آنلاین",
    icon: Briefcase,
    tag: "تخصصی"
  },
  {
    role: "agency",
    title: "دفتر یا سرپرست آژانس",
    subtitle: "پنل سازمانی دپارتمان، مدیریت مشاوران، فایلینگ و نظارت قرارداد",
    icon: Building,
    tag: "سازمانی"
  }
];

export default function ClassicSignUpForm({
  onSuccess,
  className = "",
  defaultMode = "signup"
}: ClassicSignUpFormProps) {
  const { signUpClassic, signInClassic } = useUser();
  const [mode, setMode] = useState<"signup" | "signin">(defaultMode);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");

  // Captcha State
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  // Stable callback for captcha validation
  const handleCaptchaVerify = useCallback((valid: boolean) => {
    setIsCaptchaValid(valid);
    if (valid) setCaptchaError(false);
  }, []);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setCaptchaError(false);

    // 1. Validate Captcha
    if (!isCaptchaValid) {
      setCaptchaError(true);
      setErrorMsg("لطفاً کد امنیتی ضد ربات را به طور صحیح وارد فرمایید.");
      return;
    }

    // 2. Validate Contact
    if (!contact.trim() || contact.trim().length < 5) {
      setErrorMsg("لطفاً شماره تلفن همراه معتبر (مثلاً ۰۹۱۲...) یا ایمیل خود را وارد کنید.");
      return;
    }

    // 3. Validate Password
    if (!password || password.length < 6) {
      setErrorMsg("کلمه عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    if (mode === "signup") {
      if (!firstName.trim()) {
        setErrorMsg("لطفاً نام خود را وارد کنید.");
        return;
      }
      if (!lastName.trim()) {
        setErrorMsg("لطفاً نام خانوادگی خود را وارد کنید.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("کلمه عبور و تکرار آن یکسان نیستند. لطفاً مجدداً بررسی فرمایید.");
        return;
      }

      signUpClassic({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        contact: contact.trim(),
        password,
        role: selectedRole
      });

      const roleTitle = ROLE_OPTIONS.find(r => r.role === selectedRole)?.title || "کاربر گرامی";
      setSuccessMsg(`حساب کاربری شما با عنوان «${roleTitle}» با موفقیت ایجاد شد! خوش آمدید.`);
    } else {
      // Sign-in
      const res = signInClassic({
        contact: contact.trim(),
        password
      });

      if (!res.success) {
        setErrorMsg(res.error || "ورود ناموفق بود. لطفاً اطلاعات خود را بررسی فرمایید.");
        return;
      }

      setSuccessMsg(`خوش آمدید، ${res.userName || "کاربر گرامی"}! ورود به حساب با موفقیت انجام شد.`);
    }

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 700);
    }
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Tab Switcher: Sign Up vs Sign In */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMsg(null);
            setConfirmPassword("");
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
            mode === "signup"
              ? "bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          ثبت‌نام کاربر جدید
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMsg(null);
            setConfirmPassword("");
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
            mode === "signin"
              ? "bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          ورود به حساب موجود
        </button>
      </div>

      {/* Security Info Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          {mode === "signup"
            ? "لطفاً نقش و نحوه فعالیت خود را مشخص فرمایید تا امکانات و ابزارهای مرتبط فوراً برای شما فعال شود."
            : "با وارد کردن ایمیل یا شماره موبایل و کد امنیتی وارد حساب کاربری خود در «یه خونه» شوید."}
        </span>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <>
            {/* ROLE SELECTION MODULE */}
            <div className="space-y-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white">
                  شما چه نقشی در سامانه دارید؟ (نحوه فعالیت) <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-amber-400 font-semibold">یک عنوان را انتخاب فرمایید</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {ROLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRole === opt.role;
                  return (
                    <div
                      key={opt.role}
                      onClick={() => setSelectedRole(opt.role)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/60"
                          : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isSelected ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-amber-400"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-xs font-bold ${isSelected ? "text-amber-300" : "text-white"}`}>
                            {opt.title}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: علیرضا"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام خانوادگی <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: مهرابی"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Email or Phone Number */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            شماره تلفن همراه یا ایمیل <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            <input
              type="text"
              required
              dir="ltr"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا name@domain.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left font-sans"
            />
          </div>
        </div>

        {/* Password & Password Confirmation */}
        {mode === "signup" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                کلمه عبور <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  dir="ltr"
                  placeholder="حداقل ۶ کاراکتر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  title={showPassword ? "مخفی‌سازی کلمه عبور" : "نمایش کلمه عبور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                تکرار کلمه عبور <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  dir="ltr"
                  placeholder="تکرار کلمه عبور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-xl pr-10 pl-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none text-left font-sans transition-colors ${
                    confirmPassword && confirmPassword === password && password.length >= 6
                      ? "border-emerald-500/80 focus:border-emerald-500"
                      : confirmPassword && confirmPassword !== password
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-800 focus:border-amber-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  title={showConfirmPassword ? "مخفی‌سازی کلمه عبور" : "نمایش کلمه عبور"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                کلمه عبور <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-amber-400/80 hover:text-amber-300 cursor-pointer">
                فراموشی رمز؟
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                title={showPassword ? "مخفی‌سازی کلمه عبور" : "نمایش کلمه عبور"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Smart Captcha Component */}
        <div className="pt-2">
          <SmartCaptcha
            onVerify={handleCaptchaVerify}
            hasError={captchaError}
          />
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
        >
          <span>{mode === "signup" ? "ثبت‌نام و ورود به «یه خونه»" : "ورود به حساب کاربری"}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
