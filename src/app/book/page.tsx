'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useBookingWhatsApp } from '@/hooks/useBookingWhatsApp';

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  country: '',
  city: '',
  state: '',
};

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f5f2]" /> }>
      <BookPageClient />
    </Suspense>
  );
}

function BookPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') ?? '';
  const selectedPlan = searchParams.get('plan') ?? '';
  const playerCountParam = searchParams.get('playerCount') ?? '';
  const estimatedTotalParam = searchParams.get('estimatedTotal') ?? '';
  const intentParam = searchParams.get('intent') === 'booking' ? 'booking' : 'info';
  const source = searchParams.get('source') ?? 'book-page';
  const parsedPlayerCount = Number(playerCountParam || 0);
  const parsedEstimatedTotal = Number(estimatedTotalParam || 0);
  const hasQuoteSummary = Boolean(selectedPlan || playerCountParam || estimatedTotalParam);

  const { ambassadorName, whatsappUrl } = useBookingWhatsApp({
    referralCode,
    planName: selectedPlan || null,
    playerCount: parsedPlayerCount > 0 ? parsedPlayerCount : null,
  });

  const [form, setForm] = useState(EMPTY_FORM);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !searchParams.get('intent')) {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('intent')) {
        params.set('intent', 'info');
        params.set('source', 'book-page');
        router.replace(`/book?${params.toString()}`);
      }
    }
  }, [router, searchParams]);

  const heading = useMemo(
    () => (intentParam === 'booking' ? 'Book your golf experience' : 'Request more information'),
    [intentParam],
  );

  const handleChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleOpenWhatsApp = () => {
    if (typeof window !== 'undefined' && whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const submitBookingLead = async (action: 'pay' | 'chat') => {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const country = form.country.trim();
    const city = form.city.trim();

    if (!name || !phone || !email || !country || !city) {
      setError('Name, phone, email, country, and city are required.');
      return;
    }

    if (!consentMarketing || !consentPrivacy) {
      setError('Please authorize contact and accept the privacy policy to continue.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          country,
          city,
          state: form.state.trim() || null,
          intent: intentParam,
          selectedPlan: selectedPlan || null,
          playerCount: Number.isFinite(parsedPlayerCount) && parsedPlayerCount > 0 ? parsedPlayerCount : null,
          estimatedTotal: Number.isFinite(parsedEstimatedTotal) && parsedEstimatedTotal > 0 ? parsedEstimatedTotal : null,
          ambassadorName: ambassadorName || null,
          ambassadorCode: referralCode || null,
          source,
          consentMarketing,
          consentPrivacy,
          bookingAction: action,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to save your details right now.');
      }

      setIsSubmitted(true);

      if (typeof window === 'undefined') {
        return;
      }

      if (action === 'pay') {
        window.open('https://checkout.wompi.co/l/VPOS_LF35TM', '_blank', 'noopener,noreferrer');
        return;
      }

      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to save your details right now.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitBookingLead('chat');
  };

  return (
    <main className="min-h-screen bg-[#f4f5f2] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => router.push('/')} className="border-[#dfe7dc] bg-white text-[#1d2c1f]">
            ← Back home
          </Button>
          {selectedPlan ? (
            <div className="rounded-full border border-[#dfe7dc] bg-white px-3 py-1 text-sm font-medium text-[#1d2c1f]">
              Plan: {selectedPlan}
            </div>
          ) : null}
        </div>

        <div className="grid gap-8 rounded-[30px] border border-[#dfe7dc] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <section className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b8a6a]">
                BGX Golf Experience
              </p>
              <h1 className="text-4xl font-bold text-[#1d2c1f] md:text-5xl">{heading}</h1>
              <p className="max-w-xl text-base text-slate-600">
                Tell us a little about you and we will follow up with tailored recommendations, availability, and your ambassador referral details.
              </p>
            </div>

            {referralCode ? (
              <div className="rounded-2xl border border-[#dfe7dc] bg-[#f5f7f3] p-4 text-sm text-slate-700">
                <p>
                  Referral code detected: <span className="font-semibold text-[#1d2c1f]">{referralCode}</span>
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Name</Label>
                <Input id="name" value={form.name} onChange={(event) => handleChange('name', event.target.value)} placeholder="Your full name" className="h-11 rounded-xl border-[#dfe7dc] bg-white" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-slate-700">Country</Label>
                  <Input id="country" value={form.country} onChange={(event) => handleChange('country', event.target.value)} placeholder="Colombia" className="h-11 rounded-xl border-[#dfe7dc] bg-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-slate-700">City</Label>
                  <Input id="city" value={form.city} onChange={(event) => handleChange('city', event.target.value)} placeholder="Bogotá" className="h-11 rounded-xl border-[#dfe7dc] bg-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} placeholder="you@email.com" className="h-11 rounded-xl border-[#dfe7dc] bg-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone number</Label>
                  <Input id="phone" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} placeholder="+57 300 000 0000" className="h-11 rounded-xl border-[#dfe7dc] bg-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-slate-700">State / Department (optional)</Label>
                <Input id="state" value={form.state} onChange={(event) => handleChange('state', event.target.value)} placeholder="Cundinamarca" className="h-11 rounded-xl border-[#dfe7dc] bg-white" />
              </div>

              <div className="space-y-3 rounded-2xl border border-[#dfe7dc] bg-[#f8faf8] p-4">
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={consentMarketing} onChange={(event) => setConsentMarketing(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#6b8a6a] focus:ring-[#6b8a6a]" />
                  <span>I authorize being contacted to receive brand information.</span>
                </label>

                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" checked={consentPrivacy} onChange={(event) => setConsentPrivacy(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#6b8a6a] focus:ring-[#6b8a6a]" />
                  <span>
                    I accept the{' '}
                    <Link href="/privacy-policy" target="_blank" rel="noreferrer" className="font-medium text-[#6b8a6a] underline underline-offset-2">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms-of-service" target="_blank" rel="noreferrer" className="font-medium text-[#6b8a6a] underline underline-offset-2">
                      Terms of Service
                    </Link>.
                  </span>
                </label>
              </div>

              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

              {isSubmitted ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <CheckCircle2 className="h-5 w-5" />
                  We have received your details. A BGX specialist will contact you shortly.
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => router.push('/')} className="h-11 rounded-xl border-[#dfe7dc] bg-white text-slate-700">
                  Cancel
                </Button>
                {intentParam === 'booking' ? (
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Button type="button" disabled={isSubmitting} onClick={() => void submitBookingLead('chat')} className="h-11 rounded-xl border border-[#bfd4f2] bg-[#dfeaf8] text-[#1d2c1f] hover:bg-[#d1e1f7]">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Chat on WhatsApp'
                      )}
                    </Button>
                    <Button type="button" disabled={isSubmitting} onClick={() => void submitBookingLead('pay')} className="h-11 rounded-xl bg-green-600 text-white hover:bg-green-700">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Pay now with Wompi'
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl border border-[#bfd4f2] bg-[#dfeaf8] text-[#1d2c1f] hover:bg-[#d1e1f7]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send request'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </section>

          <aside className="flex flex-col justify-between rounded-[28px] border border-[#dfe7dc] bg-[#edf3ee] p-6 text-slate-700">
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#dfe7dc] bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6b8a6a]">Why BGX</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#1d2c1f]">Premium golf experiences in Bogotá</h2>
              </div>

              <ul className="space-y-3 text-sm text-slate-700">
                <li>• Bilingual concierge support</li>
                <li>• Private transport and curated experiences</li>
                <li>• Expert caddies and preferred course access</li>
                <li>• Tailored package recommendations for your group</li>
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-[#dfe7dc] bg-white p-4 text-sm text-slate-700">
              <p className="font-medium text-[#1d2c1f]">Need help now?</p>
              <p className="mt-2">Our team can answer questions and finalize the right golf package for you.</p>
              <Button type="button" onClick={handleOpenWhatsApp} className="mt-4 h-11 w-full rounded-xl border border-[#bfd4f2] bg-[#dfeaf8] text-[#1d2c1f] hover:bg-[#d1e1f7]">
                Chat on WhatsApp
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
