"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCw, Volume2, ShieldCheck, Check, AlertCircle } from "lucide-react";

interface SmartCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
  hasError?: boolean;
}

// Pool of unambiguous characters (excluding O, 0, I, 1, l to avoid confusion)
const CHAR_POOL = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

// Convert Persian numbers to English for effortless typing
function normalizePersianInput(str: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  let res = str;
  for (let i = 0; i < persianDigits.length; i++) {
    res = res.replace(new RegExp(persianDigits[i], "g"), i.toString());
  }
  return res.trim().toUpperCase();
}

export default function SmartCaptcha({
  onVerify,
  className = "",
  hasError = false
}: SmartCaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaText, setCaptchaText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  // Generate a random 5-character string
  const generateRandomCode = useCallback((): string => {
    let code = "";
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * CHAR_POOL.length);
      code += CHAR_POOL[idx];
    }
    return code;
  }, []);

  // Draw the security challenge onto the HTML5 canvas
  const drawCaptcha = useCallback((code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Background gradient (sleek dark aesthetic)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#090d16");
    bgGradient.addColorStop(0.5, "#0f172a");
    bgGradient.addColorStop(1, "#090d16");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Random noise interference curves (wavy lines)
    const curveColors = ["rgba(245, 158, 11, 0.4)", "rgba(56, 189, 248, 0.4)", "rgba(168, 85, 247, 0.4)"];
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = curveColors[i % curveColors.length];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * height);
      ctx.bezierCurveTo(
        width * 0.3,
        Math.random() * height,
        width * 0.7,
        Math.random() * height,
        width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // 4. Random noise scatter dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 200 + 55)}, ${Math.floor(
        Math.random() * 200 + 55
      )}, 255, 0.25)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Render individual characters with random rotation, color, and baseline
    const slotWidth = width / code.length;
    const fonts = ["bold 23px monospace", "900 24px sans-serif", "bold 23px 'Courier New', monospace"];
    const colors = ["#38bdf8", "#34d399", "#fbbf24", "#f472b6", "#a78bfa", "#38bdf8"];

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const font = fonts[i % fonts.length];
      const color = colors[i % colors.length];

      ctx.save();
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
      ctx.shadowBlur = 4;

      const x = i * slotWidth + slotWidth / 2 + (Math.random() * 4 - 2);
      const y = height / 2 + (Math.random() * 4 - 2);

      ctx.translate(x, y);
      const angle = (Math.random() * 26 - 13) * (Math.PI / 180);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, []);

  // Initialize Captcha
  const refreshCaptcha = useCallback(() => {
    setIsRotating(true);
    const newCode = generateRandomCode();
    setCaptchaText(newCode);
    setUserInput("");
    setIsVerified(false);
    onVerifyRef.current(false);
    setTimeout(() => {
      drawCaptcha(newCode);
      setIsRotating(false);
    }, 100);
  }, [drawCaptcha, generateRandomCode]);

  // Initial code generation on mount only
  useEffect(() => {
    refreshCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Audio pronunciation of the code for accessibility
  const playAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Split characters and speak them clearly with pauses
      const speechText = captchaText.split("").join(" . ");
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.75;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  // Validate user typing against the generated code
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setUserInput(rawVal);

    const normalized = normalizePersianInput(rawVal);
    const isCodeMatch = normalized.length === 5 && normalized === captchaText.toUpperCase();

    if (isCodeMatch) {
      setIsVerified(true);
      onVerifyRef.current(true);
    } else {
      setIsVerified(false);
      onVerifyRef.current(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>کد امنیتی هوشمند (ضد ربات)</span>
          <span className="text-red-400">*</span>
        </label>
        <span className="text-[10px] text-slate-400 font-medium">حساس به بزرگ/کوچک نیست</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Dynamic Canvas Box with Control Buttons beside it */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-slate-700 bg-slate-950 shrink-0 shadow-inner">
          <canvas
            ref={canvasRef}
            width={160}
            height={44}
            className="rounded-xl select-none block bg-slate-950"
            title="کد امنیتی ضد ربات"
          />

          {/* Action buttons (Cleanly adjacent, NEVER overlaying the canvas) */}
          <div className="flex flex-col gap-1 pr-1 border-r border-slate-800">
            <button
              type="button"
              onClick={refreshCaptcha}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-amber-400 transition-colors"
              title="تغییر و بازتولید کد امنیتی"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={playAudio}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-sky-400 transition-colors"
              title="پخش صوتی کد"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative flex-1">
          <input
            type="text"
            required
            autoComplete="off"
            dir="ltr"
            maxLength={6}
            value={userInput}
            onChange={handleInputChange}
            placeholder="کد ۵ رقمی..."
            className={`w-full bg-slate-950 border rounded-2xl px-3.5 py-2.5 text-base font-mono font-bold tracking-widest text-center text-white placeholder-slate-500 placeholder:text-xs placeholder:font-sans placeholder:font-normal focus:outline-none transition-all ${
              isVerified
                ? "border-emerald-500/80 bg-emerald-950/20 text-emerald-300"
                : hasError
                ? "border-red-500 bg-red-950/20"
                : "border-slate-800 focus:border-amber-500"
            }`}
          />

          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isVerified ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 animate-in zoom-in-50">
                <Check className="w-4 h-4 text-emerald-400" />
              </span>
            ) : hasError ? (
              <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
            ) : null}
          </div>
        </div>
      </div>

      {/* Verified Pill */}
      {isVerified && (
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold px-2 animate-in fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>هویت انسانی شما با موفقیت تایید شد.</span>
        </div>
      )}
    </div>
  );
}
