export const BGX_WHATSAPP_NUMBER = '573176392251';

export const DEFAULT_BOOKING_WHATSAPP_MESSAGE = "Hi BGX, I'm interested in booking a golf experience.";

function formatPlanLabel(planName?: string | null) {
  const normalized = planName?.trim();

  if (!normalized) {
    return '';
  }

  return normalized.replace(/^BGX\s+/i, '').trim();
}

export function buildBookingWhatsAppMessage({
  ambassadorName,
  planName,
  playerCount,
}: {
  ambassadorName?: string | null;
  planName?: string | null;
  playerCount?: number | null;
} = {}) {
  const normalizedName = ambassadorName?.trim();
  const normalizedPlan = formatPlanLabel(planName);
  const normalizedPlayerCount = Number(playerCount);
  const hasValidGroupSize = Number.isFinite(normalizedPlayerCount) && normalizedPlayerCount > 0;

  const intro = 'Hi BGX, I\'m interested in booking a golf experience.';

  if (normalizedName && normalizedPlan && hasValidGroupSize) {
    return `Hi BGX, I'm interested in booking a golf experience. I've been invited by ${normalizedName} and I'm booking a trip for ${normalizedPlayerCount} people from the ${normalizedPlan} pack.`;
  }

  if (normalizedName && normalizedPlan) {
    return `Hi BGX, I'm interested in booking a golf experience. I've been invited by ${normalizedName} and I'm booking a trip from the ${normalizedPlan} pack.`;
  }

  if (normalizedName) {
    return `Hi BGX, I'm interested in booking a golf experience. I've been invited by ${normalizedName}.`;
  }

  if (normalizedPlan && hasValidGroupSize) {
    return `Hi BGX, I'm interested in booking a golf experience. I'm booking a trip for ${normalizedPlayerCount} people from the ${normalizedPlan} pack.`;
  }

  if (normalizedPlan) {
    return `Hi BGX, I'm interested in booking a golf experience. I'm interested in the ${normalizedPlan} pack.`;
  }

  return DEFAULT_BOOKING_WHATSAPP_MESSAGE;
}

export function buildBookingWhatsAppUrl({
  ambassadorName,
  planName,
  playerCount,
}: {
  ambassadorName?: string | null;
  planName?: string | null;
  playerCount?: number | null;
} = {}) {
  const message = buildBookingWhatsAppMessage({ ambassadorName, planName, playerCount });
  return `https://wa.me/${BGX_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
