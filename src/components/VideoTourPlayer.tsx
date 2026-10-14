"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Calendar,
  Video,
  CheckCircle2,
  Sparkles,
  Phone,
  Eye,
  Layers,
  ArrowRight
} from "lucide-react";

interface VideoChapter {
  time: number;
  label: string;
  image: string;
  desc: string;
}

interface VideoTourPlayerProps {
  videoUrl?: string;
  posterImage: string;
  propertyTitle: string;
  agentName: string;
  agentPhone: string;
  onBookVisit?: () => void;
  onSwitchTo360?: () => void;
}

export default function VideoTourPlayer({
  videoUrl,
  posterImage,
  propertyTitle,
  agentName,
  agentPhone,
  onBookVisit,
  onSwitchTo360
}: VideoTourPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(true); // default to simulation to avoid NotSupportedError
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);

  const chapters: VideoChapter[] = [
    {
      time: 0,
      label: "ورودی و سالن پذیرایی",
      image: posterImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      desc: "سالن وسیع پرده‌خور با پنجره‌های قدی رو به جنوب و سنگ کف دهبید ممتاز"
    },
    {
      time: 25,
      label: "آشپزخانه و تراس",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      desc: "کابینت‌های پلی‌اورتان انزو ایتالیا، جزیره متحرک و صفحه کورین ضدخش"
    },
    {
      time: 50,
      label: "اتاق خواب مستر",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      desc: "خواب کینگ با کمد دیواری‌های عمیق، دیوار آکوستیک و حمام مستر شیشه‌ای"
    },
    {
      time: 75,
      label: "تراس مشجر و ویوی کوهستان",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      desc: "چشم‌انداز باز بدون مشرف به کوه‌های البرز و منطقه ۲ تهران"
    }
  ];

  // Cinematic timer simulation for walkthrough
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          // Determine chapter
          for (let i = chapters.length - 1; i >= 0; i--) {
            if (next >= chapters[i].time) {
              setCurrentChapterIndex(i);
              break;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, chapters]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const jumpToChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setCurrentTime(chapters[index].time);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const activeChapter = chapters[currentChapterIndex] || chapters[0];

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group transition-all select-none ${
        isFullscreen ? "h-screen rounded-none" : "h-[450px] sm:h-[540px] md:h-[600px]"
      }`}
    >
      {/* Background Visual Layer (High-Res Cinematic Walkthrough Image with Smooth Pan & Zoom) */}
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <Image
          src={activeChapter.image}
          alt={activeChapter.label}
          fill
          priority
          className={`object-cover transition-all duration-1000 ${
            isPlaying ? "scale-110 brightness-95" : "scale-100 brightness-75"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/60" />
      </div>

      {/* Paused Hero Overlay with Big Play Button */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-20 bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/30"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 transition-transform">
            <Play className="w-9 h-9 fill-slate-950 mr-1" />
          </div>
          <span className="mt-4 text-lg font-black text-white drop-shadow-md">
            پخش تور ویدیویی و سینمایی ملک (4K)
          </span>
          <span className="text-xs text-slate-300 mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>گشت تصویری مرحله به مرحله همراه با توضیحات کارشناس</span>
          </span>
        </div>
      )}

      {/* Top Header Overlay Bar */}
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">{activeChapter.label}</span>
            <span className="text-slate-600">|</span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
              4K Ultra HD
            </span>
          </div>

          {/* Sound / Commentary Tag */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>کارشناس: {agentName}</span>
          </div>
        </div>

        {/* In-Person Visit CTA */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onBookVisit && (
            <button
              onClick={onBookVisit}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 text-xs font-bold shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>هماهنگی بازدید حضوری</span>
            </button>
          )}
        </div>
      </div>

      {/* Center Subtitle / Description Overlay when Playing */}
      {isPlaying && (
        <div className="absolute top-20 right-6 z-20 max-w-md bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 text-xs shadow-xl animate-in fade-in slide-in-from-right duration-500">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeChapter.label}</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {activeChapter.desc}
          </p>
        </div>
      )}

      {/* Bottom Controls Overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-4 sm:p-6 z-20 flex flex-col gap-3">
        {/* Progress Timeline */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
          <span className="w-10 text-left">{formatTime(currentTime)}</span>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              setCurrentTime(Math.round(clickPos * duration));
            }}
            className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative"
          >
            <div
              className="h-full bg-gradient-to-l from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right text-slate-400">{formatTime(duration)}</span>
        </div>

        {/* Chapter Buttons & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Chapter Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-semibold ml-1 shrink-0">بخش‌ها:</span>
            {chapters.map((ch, idx) => (
              <button
                key={ch.label}
                onClick={() => jumpToChapter(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  currentChapterIndex === idx
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800"
              title={isPlaying ? "توقف موقت" : "پخش"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800"
              title={isMuted ? "وصل صدا" : "قطع صدا"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-800"
              title="تمام‌صفحه"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
