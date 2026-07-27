export const BGX_WHATSAPP_NUMBER = '573176392251';

export const DEFAULT_BOOKING_WHATSAPP_MESSAGE = "Hi BGX, I'm interested in booking a golf experience.";

export function buildBookingWhatsAppMessage(ambassadorName?: string | null) {
  const normalizedName = ambassadorName?.trim();

  if (normalizedName) {
    return `Hi BGX, I've been invited by ${normalizedName}, I'm interested in booking a golf experience.`;
  }

  return DEFAULT_BOOKING_WHATSAPP_MESSAGE;
}

export function buildBookingWhatsAppUrl(ambassadorName?: string | null) {
  const message = buildBookingWhatsAppMessage(ambassadorName);
  return `https://wa.me/${BGX_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
