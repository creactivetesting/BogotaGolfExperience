"use client";

import { MessageCircle } from "lucide-react";
import { useBookingWhatsApp } from '@/hooks/useBookingWhatsApp';

export function AiAgentWidget() {
  const { whatsappUrl } = useBookingWhatsApp();

  return (
    <button
      type="button"
      onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-300 bg-white/95 text-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.18)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-[0_12px_28px_rgba(15,23,42,0.22)] focus:outline-none focus:ring-4 focus:ring-slate-200"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={2} />
    </button>
  );
}