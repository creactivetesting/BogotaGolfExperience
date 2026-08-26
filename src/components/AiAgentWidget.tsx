"use client";

import { useBookingWhatsApp } from '@/hooks/useBookingWhatsApp';

export function AiAgentWidget() {
  const { whatsappUrl } = useBookingWhatsApp();

  return (
    <button
      type="button"
      onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-7 w-7 fill-current"
      >
        <path d="M19.05 4.95A9.94 9.94 0 0 0 12 2a9.98 9.98 0 0 0-8.57 15.24L2 22l4.9-1.35A9.98 9.98 0 0 0 12 22c5.52 0 10-4.48 10-10a9.94 9.94 0 0 0-2.95-7.05ZM12 19.5c-1.36 0-2.7-.36-3.87-.99l-.28-.16-2.9.8.78-2.82-.18-.29A7.5 7.5 0 1 1 12 19.5Zm4.11-5.6c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.49.11-.14.22-.55.71-.68.86-.12.14-.25.16-.46.05-.22-.11-.94-.35-1.79-1.12-.66-.59-1.1-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.25.33-.38.11-.13.14-.22.22-.37.07-.14.04-.27-.02-.38-.06-.11-.49-1.18-.67-1.62-.18-.43-.36-.37-.49-.38h-.42c-.14 0-.38.05-.58.27-.2.22-.76.74-.76 1.81 0 1.07.78 2.11.89 2.25.11.14 1.54 2.35 3.74 3.29.52.22.93.35 1.25.45.53.17 1.01.15 1.39.09.42-.06 1.3-.53 1.48-1.05.18-.52.18-.96.13-1.05-.05-.09-.21-.14-.43-.25Z" />
      </svg>
    </button>
  );
}