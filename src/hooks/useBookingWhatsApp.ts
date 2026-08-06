"use client";

import { useEffect, useMemo, useState } from 'react';
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
  const normalizedAmbassadorNameFromProps = ambassadorNameFromProps?.trim() ?? '';
  const [locationReferralCode, setLocationReferralCode] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const referralFromQuery = params.get('ref')?.trim() ?? '';
    const referralFromPath = resolveReferralCodeFromPath(window.location.pathname ?? '');
    const resolvedFromLocation = referralFromQuery || referralFromPath;
    setLocationReferralCode(resolvedFromLocation);
  }, []);

  const resolvedReferralCode = (referralCode?.trim() ?? '') || locationReferralCode;

  useEffect(() => {
    if (typeof window === 'undefined' || !resolvedReferralCode) {
      return;
    }

    try {
      const storageKey = 'bgx-tracked-referral-codes';
      const existingValue = window.sessionStorage.getItem(storageKey) ?? '';
      const trackedCodes = existingValue.split(',').filter(Boolean);

      if (trackedCodes.includes(resolvedReferralCode)) {
        return;
      }

      const targetUrl = `${window.location.origin}${window.location.pathname}${window.location.search || ''}`;

      void fetch('/api/public/track-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: resolvedReferralCode,
          targetUrl,
          sourcePath: window.location.pathname || '/',
        }),
        cache: 'no-store',
      });

      trackedCodes.push(resolvedReferralCode);
      window.sessionStorage.setItem(storageKey, trackedCodes.join(','));
    } catch (error) {
      console.error('Unable to track referral click:', error);
    }
  }, [resolvedReferralCode]);

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
