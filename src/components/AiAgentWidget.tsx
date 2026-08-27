"use client";

import { useBookingWhatsApp } from '@/hooks/useBookingWhatsApp';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
      <path d="M12.04 2C6.58 2 2.15 6.39 2.15 11.85c0 1.82.49 3.6 1.42 5.14L2 22l5.2-1.46A9.86 9.86 0 0 0 12.04 21c5.46 0 9.9-4.39 9.9-9.85S17.5 2 12.04 2Zm0 17.86c-1.53 0-3.02-.41-4.32-1.2l-.31-.18-3.08.87.83-3.02-.2-.32A7.51 7.51 0 0 1 4.5 11.85c0-4.15 3.38-7.52 7.54-7.52 4.16 0 7.54 3.37 7.54 7.52 0 4.15-3.38 7.52-7.54 7.52Zm4.13-5.63c-.23-.12-1.34-.66-1.55-.74-.2-.08-.35-.12-.49.12-.15.23-.56.74-.69.89-.13.15-.26.17-.48.06-.23-.12-.98-.36-1.86-1.15-.69-.61-1.15-1.36-1.29-1.59-.13-.23-.01-.35.1-.47.1-.1.23-.26.35-.39.12-.13.16-.22.23-.37.08-.15.04-.28-.02-.39-.06-.12-.49-1.18-.67-1.62-.18-.43-.36-.37-.48-.38h-.41c-.15 0-.39.06-.6.28-.2.22-.78.76-.78 1.86s.8 2.15.91 2.3c.11.15 1.56 2.39 3.79 3.35.53.23.94.37 1.26.47.53.17 1 .15 1.38.09.42-.06 1.34-.55 1.53-1.07.18-.52.18-.96.13-1.07-.06-.11-.21-.18-.44-.3Z"/>
    </svg>
  );
}

export function AiAgentWidget() {
  const { whatsappUrl } = useBookingWhatsApp();

  if (!whatsappUrl) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#25D366] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-all duration-200 hover:scale-105 hover:shadow-[0_20px_45px_rgba(37,211,102,0.38)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
    >
      <WhatsAppIcon />
    </button>
  );
}