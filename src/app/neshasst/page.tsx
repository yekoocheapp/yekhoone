"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  SwitchCamera,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  ArrowRight
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  roleTitle: string;
  roleBadgeColor: string;
  avatar: string;
  isSupervisor?: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
}

export default function NeshasstCallPage() {
  const router = useRouter();
  const { currentRole, currentNeshasst } = useUser();

  // Call duration counter
  const [callSeconds, setCallSeconds] = useState<number>(312); // start at ~5 min
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Local user camera stream
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // 4 Core Participants of the Iranian Real Estate "نشست"
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "supervisor",
      name: currentNeshasst.supervisorName,
      roleTitle: "سرپرست و مدیر قرارداد",
      roleBadgeColor: "bg-amber-500 text-slate-950 border-amber-400 font-black",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      isSupervisor: true,
      isSpeaking: true,
      isMuted: false,
      isVideoOff: false
    },
    {
      id: "agent",
      name: currentNeshasst.agentName,
      roleTitle: "مشاور پرونده",
      roleBadgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      isSpeaking: false,
      isMuted: false,
      isVideoOff: false
    },
    {
      id: "buyer",
      name: currentNeshasst.buyerName,
      roleTitle: "متقاضی مسکن",
      roleBadgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      isSpeaking: false,
      isMuted: false,
      isVideoOff: false
    },
    {
      id: "seller",
      name: currentNeshasst.sellerName,
      roleTitle: "مالک و فروشنده",
      roleBadgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      isSpeaking: false,
      isMuted: false,
      isVideoOff: false
    }
  ]);

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Natural speech simulation for other participants
  useEffect(() => {
    const speechInterval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => {
          // Keep current user controlled by local state
          const isCurrentUser =
            (currentRole === "agency" && p.id === "supervisor") ||
            (currentRole === "agent" && p.id === "agent") ||
            (currentRole === "buyer" && p.id === "buyer") ||
            (currentRole === "seller" && p.id === "seller");

          if (isCurrentUser) {
            return {
              ...p,
              isMuted: isMicMuted,
              isVideoOff: isVideoOff,
              isSpeaking: !isMicMuted && Math.random() > 0.6
            };
          }

          // Random natural conversation flow for others
          const speakChance = Math.random();
          return {
            ...p,
            isSpeaking: speakChance > 0.65
          };
        })
      );
    }, 2800);

    return () => clearInterval(speechInterval);
  }, [currentRole, isMicMuted, isVideoOff]);

  // Request user camera for local tile
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((s) => {
        stream = s;
        setLocalStream(s);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s;
        }
      })
      .catch((err) => {
        console.log("Webcam access optional/fallback:", err);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Update track state when muted/disabled
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicMuted;
      });
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOff;
      });
    }
  }, [isMicMuted, isVideoOff, localStream]);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const isParticipantCurrentUser = (pId: string) => {
    if (currentRole === "agency" && pId === "supervisor") return true;
    if (currentRole === "agent" && pId === "agent") return true;
    if (currentRole === "buyer" && pId === "buyer") return true;
    if (currentRole === "seller" && pId === "seller") return true;
    return false;
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* ==================== TOP BAR ==================== */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Meeting Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/profile"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="بازگشت به پروفایل"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <h1 className="text-xs sm:text-sm font-extrabold text-white truncate">
                {currentNeshasst.title}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate mt-0.5">
              <span>{currentNeshasst.agencyName}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{currentNeshasst.propertyPrice}</span>
            </div>
          </div>
        </div>

        {/* Right: Timer & Participant Count */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(callSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>۴ نفر در نشست</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors hidden md:block"
            title="تمام‌صفحه"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ==================== 4-WAY ZOOM-STYLE VIDEO GRID ==================== */}
      <main className="flex-1 p-2 sm:p-4 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-4 overflow-hidden max-w-7xl w-full mx-auto">
        {participants.map((p) => {
          const isUser = isParticipantCurrentUser(p.id);

          return (
            <div
              key={p.id}
              className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border transition-all duration-300 flex items-center justify-center shadow-2xl ${
                p.isSpeaking
                  ? "border-emerald-500 ring-2 ring-emerald-500/40 shadow-emerald-500/10"
                  : p.isSupervisor
                  ? "border-amber-500/40"
                  : "border-slate-800"
              }`}
            >
              {/* Video Feed / Avatar View */}
              {isUser && localStream && !isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : p.isVideoOff || (isUser && isVideoOff) ? (
                // Camera Turned Off Avatar View
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-700 shadow-xl">
                    <Image src={p.avatar} alt={p.name} fill className="object-cover" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">دوربین خاموش است</span>
                </div>
              ) : (
                // Participant Video Mock Background Stream
                <div className="relative w-full h-full">
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    fill
                    className="object-cover brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
                </div>
              )}

              {/* Active Speaker Animated Audio Wave Pill (Top-Right) */}
              {p.isSpeaking && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-[11px] font-black shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-slate-950 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                  <span>در حال صحبت</span>
                </div>
              )}

              {/* Participant Info Overlay (Bottom) */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                <div className="flex items-center gap-2 min-w-0 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-xl">
                  {/* Mic Muted / Unmuted Status */}
                  {(isUser ? isMicMuted : p.isMuted) ? (
                    <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                        {p.name}
                      </span>
                      {isUser && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-black">
                          شما
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role Badge */}
                <div
                  className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-xl border shadow-lg truncate shrink-0 ${p.roleBadgeColor}`}
                >
                  {p.roleTitle}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* ==================== BOTTOM ZOOM CALL CONTROLS ==================== */}
      <footer className="h-20 sm:h-22 px-4 sm:px-8 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-2xl flex items-center justify-center gap-3 sm:gap-6 shrink-0 z-20">
        {/* Mic Toggle */}
        <button
          onClick={() => setIsMicMuted((prev) => !prev)}
          className={`flex flex-col items-center justify-center gap-1 w-14 sm:w-16 h-14 sm:h-16 rounded-2xl sm:rounded-3xl border transition-all shadow-xl ${
            isMicMuted
              ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
              : "bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700"
          }`}
          title={isMicMuted ? "وصل کردن میکروفون" : "قطع میکروفون"}
        >
          {isMicMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          <span className="text-[10px] font-bold">{isMicMuted ? "بی‌صدا" : "صدا وصل"}</span>
        </button>

        {/* Camera Toggle */}
        <button
          onClick={() => setIsVideoOff((prev) => !prev)}
          className={`flex flex-col items-center justify-center gap-1 w-14 sm:w-16 h-14 sm:h-16 rounded-2xl sm:rounded-3xl border transition-all shadow-xl ${
            isVideoOff
              ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
              : "bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700"
          }`}
          title={isVideoOff ? "روشن کردن دوربین" : "خاموش کردن دوربین"}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
          <span className="text-[10px] font-bold">{isVideoOff ? "ویدیو خاموش" : "ویدیو روشن"}</span>
        </button>

        {/* Switch Front/Back Camera (Mobile) */}
        <button
          onClick={() => {
            alert("سوئیچ دوربین جلو و عقب در دستگاه‌های موبایل");
          }}
          className="flex flex-col items-center justify-center gap-1 w-14 sm:w-16 h-14 sm:h-16 rounded-2xl sm:rounded-3xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-xl"
          title="تغییر دوربین جلو / عقب"
        >
          <SwitchCamera className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          <span className="text-[10px] font-bold">تغییر دوربین</span>
        </button>

        {/* End Call / Leave Meeting (Red Button) */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex flex-col items-center justify-center gap-1 px-5 sm:px-8 h-14 sm:h-16 rounded-2xl sm:rounded-3xl bg-red-600 hover:bg-red-500 text-white font-extrabold shadow-xl shadow-red-600/30 transition-all hover:scale-105"
          title="ترک جلسه نشست"
        >
          <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[11px] font-black">خروج از نشست</span>
        </button>
      </footer>

      {/* ==================== EXIT CONFIRMATION MODAL ==================== */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
              <PhoneOff className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-white mb-2">
              آیا قصد خروج از نشست را دارید؟
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              با خروج از نشست ارتباط تصویری شما با مشاور، سرپرست آژانس و طرف مقابل قطع خواهد شد.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                ادامه نشست
              </button>
              <button
                onClick={() => {
                  if (localStream) {
                    localStream.getTracks().forEach((t) => t.stop());
                  }
                  router.push("/profile");
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
              >
                تایید و خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
