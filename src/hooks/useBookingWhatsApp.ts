"use client";

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { buildBookingWhatsAppMessage, buildBookingWhatsAppUrl } from '@/lib/whatsapp';

type UseBookingWhatsAppOptions = {
  ambassadorName?: string | null;
  referralCode?: string | null;
};

function resolveReferralCodeFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length < 2) {
    return '';
  }

  if (segments[0] === 'ambassador' || segments[0] === 'embajador' || segments[0] === 'ref') {
    return decodeURIComponent(segments[1] ?? '').trim();
  }

  return '';
}

export function useBookingWhatsApp(options: UseBookingWhatsAppOptions = {}) {
  const { ambassadorName: ambassadorNameFromProps, referralCode } = options;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const referralFromQuery = searchParams.get('ref')?.trim() ?? '';
  const referralFromPath = resolveReferralCodeFromPath(pathname ?? '');
  const resolvedReferralCode = (referralCode?.trim() ?? '') || referralFromQuery || referralFromPath;
  const normalizedAmbassadorNameFromProps = ambassadorNameFromProps?.trim() ?? '';

  const [fetchedAmbassadorName, setFetchedAmbassadorName] = useState<string>('');

  useEffect(() => {
    if (normalizedAmbassadorNameFromProps) {
      return;
    }

    if (!resolvedReferralCode) {
      return;
    }

    const controller = new AbortController();

    async function loadAmbassadorNameByCode() {
      try {
        const response = await fetch(`/api/public/ambassadors?code=${encodeURIComponent(resolvedReferralCode)}`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          setFetchedAmbassadorName('');
          return;
        }

        const data = await response.json() as { name?: string };
        setFetchedAmbassadorName((data.name ?? '').trim());
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Unable to resolve ambassador by referral code:', error);
        setFetchedAmbassadorName('');
      }
    }

    void loadAmbassadorNameByCode();

    return () => {
      controller.abort();
    };
  }, [normalizedAmbassadorNameFromProps, resolvedReferralCode]);

  const resolvedAmbassadorName = normalizedAmbassadorNameFromProps || (resolvedReferralCode ? fetchedAmbassadorName : '');

  const message = useMemo(() => {
    return buildBookingWhatsAppMessage(resolvedAmbassadorName);
  }, [resolvedAmbassadorName]);

  const whatsappUrl = useMemo(() => {
    return buildBookingWhatsAppUrl(resolvedAmbassadorName);
  }, [resolvedAmbassadorName]);

  return {
    ambassadorName: resolvedAmbassadorName,
    message,
    whatsappUrl,
  };
}
