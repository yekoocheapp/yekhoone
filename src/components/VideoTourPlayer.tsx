"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Phone,
  Calendar,
  CheckCircle2,
  Video
} from "lucide-react";

interface VideoChapter {
  time: number;
  label: string;
}

interface VideoTourPlayerProps {
  videoUrl?: string;
  posterImage: string;
  propertyTitle: string;
  agentName: string;
  agentPhone: string;
  onBookVisit?: () => void;
}

export default function VideoTourPlayer({
  videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-balcony-view-40742-large.mp4",
  posterImage,
  propertyTitle,
  agentName,
  agentPhone,
  onBookVisit
}: VideoTourPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(120); // fallback 2 mins
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<string>("ورودی و پذیرایی");

  const chapters: VideoChapter[] = [
    { time: 0, label: "ورودی و سالن پذیرایی" },
    { time: 25, label: "آشپزخانه و تراس" },
    { time: 55, label: "اتاق خواب مستر" },
    { time: 85, label: "مشاعات و پارکینگ" }
  ];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = Number(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const jumpToChapter = (time: number, label: string) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
    setActiveChapter(label);
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group transition-all ${
        isFullscreen ? "h-screen rounded-none" : "h-[450px] sm:h-[540px] md:h-[600px]"
      }`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterImage}
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            // Check active chapter
            const cTime = videoRef.current.currentTime;
            for (let i = chapters.length - 1; i >= 0; i--) {
              if (cTime >= chapters[i].time) {
                setActiveChapter(chapters[i].label);
                break;
              }
            }
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration || 120);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Big Play Button Overlay when Paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-20 group-hover:bg-black/30 transition-all"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <Play className="w-9 h-9 fill-slate-950 mr-1" />
          </div>
          <span className="mt-4 text-base font-black text-white drop-shadow-md">
            مشاهده تور ویدیویی اختصاصی ملک (4K)
          </span>
          <span className="text-xs text-slate-300 mt-1">
            همراه با توضیحات مشاور ارشد منطقه: {agentName}
          </span>
        </div>
      )}

      {/* Top Header Overlay */}
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">{activeChapter}</span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
              4K Ultra HD
            </span>
          </div>
        </div>

        {/* Agent Badge & In-Person Visit CTA */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onBookVisit && (
            <button
              onClick={onBookVisit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>هماهنگی بازدید حضوری</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls Overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-4 sm:p-6 z-20 flex flex-col gap-3">
        {/* Progress Bar Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-300 w-10 text-left">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400 w-10 text-right">
            {formatTime(duration)}
          </span>
        </div>

        {/* Bottom Bar Buttons & Chapter Markers */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Chapter Quick Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-semibold ml-1 shrink-0">بخش‌ها:</span>
            {chapters.map((ch) => (
              <button
                key={ch.label}
                onClick={() => jumpToChapter(ch.time, ch.label)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeChapter === ch.label
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
