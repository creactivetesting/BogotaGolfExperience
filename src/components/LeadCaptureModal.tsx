"use client";

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (lead: { id?: string; name?: string; email?: string; phone?: string; country?: string; city?: string | null; state?: string | null; ambassadorName?: string | null; ambassadorCode?: string | null; source?: string | null }) => void;
  source: string;
  intent?: 'info' | 'booking';
  selectedPlan?: string | null;
  defaultAmbassadorName?: string | null;
  defaultReferralCode?: string | null;
}

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  country: '',
  city: '',
  state: '',
};

const LEAD_SUBMIT_TIMEOUT_MS = 15000;

export function LeadCaptureModal({ open, onClose, onSuccess, source, intent = 'info', selectedPlan = null, defaultAmbassadorName = '', defaultReferralCode = '' }: LeadCaptureModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setError('');
      setConsentMarketing(false);
      setConsentPrivacy(false);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      setError('You must authorize contact and accept the privacy policy to continue.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), LEAD_SUBMIT_TIMEOUT_MS);

    try {
      const response = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name,
          phone,
          email,
          country,
          city,
          state: form.state.trim() || null,
          intent,
          selectedPlan: selectedPlan || null,
          ambassadorName: defaultAmbassadorName || null,
          ambassadorCode: defaultReferralCode || null,
          source,
          consentMarketing,
          consentPrivacy,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save your details.');
      }

      onSuccess(data as { id?: string; name?: string; email?: string; phone?: string; country?: string; city?: string | null; state?: string | null; ambassadorName?: string | null; ambassadorCode?: string | null; source?: string | null });
      onClose();
    } catch (submitError) {
      if (submitError instanceof DOMException && submitError.name === 'AbortError') {
        setError('The request timed out. Please try again.');
      } else {
        const message = submitError instanceof Error ? submitError.message : 'Unable to save your details.';
        setError(message);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50" onClick={onClose}>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" onClick={(event) => event.stopPropagation()}>
        <div role="dialog" aria-modal="true" className="w-[92vw] max-w-[560px] rounded-2xl border border-[#dfe7dc] bg-[#f3f4f1] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-[#1d2c1f]">Before we continue</h2>
            <p className="mt-2 text-sm text-slate-600">
              Please share a few contact details so our team can follow up with you and keep your ambassador referral.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="lead-name" className="text-sm font-medium text-slate-700">Name</Label>
              <Input id="lead-name" className="h-11 rounded-xl border-[#dfe7dc] bg-white/80" value={form.name} onChange={(event) => handleChange('name', event.target.value)} placeholder="Your full name" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lead-phone" className="text-sm font-medium text-slate-700">Phone number</Label>
                <Input id="lead-phone" className="h-11 rounded-xl border-[#dfe7dc] bg-white/80" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} placeholder="+57 300 000 0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email" className="text-sm font-medium text-slate-700">Email</Label>
                <Input id="lead-email" type="email" className="h-11 rounded-xl border-[#dfe7dc] bg-white/80" value={form.email} onChange={(event) => handleChange('email', event.target.value)} placeholder="you@email.com" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lead-country" className="text-sm font-medium text-slate-700">Country</Label>
                <Input id="lead-country" className="h-11 rounded-xl border-[#dfe7dc] bg-white/80" value={form.country} onChange={(event) => handleChange('country', event.target.value)} placeholder="Colombia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-city" className="text-sm font-medium text-slate-700">City</Label>
                <Input id="lead-city" className="h-11 rounded-xl border-[#dfe7dc] bg-white/80" value={form.city} onChange={(event) => handleChange('city', event.target.value)} placeholder="Bogotá" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" checked={consentMarketing} onChange={(event) => setConsentMarketing(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#6b8a6a] focus:ring-[#6b8a6a]" />
                <span>I authorize being contacted to receive brand information.</span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" checked={consentPrivacy} onChange={(event) => setConsentPrivacy(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#6b8a6a] focus:ring-[#6b8a6a]" />
                <span>
                  I accept the{' '}
                  <a href="/privacy-policy" target="_blank" rel="noreferrer" className="font-medium text-[#6b8a6a] underline underline-offset-2">Privacy Policy</a>{' '}
                  and{' '}
                  <a href="/terms-of-service" target="_blank" rel="noreferrer" className="font-medium text-[#6b8a6a] underline underline-offset-2">Terms of Service</a>.
                </span>
              </label>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="h-11 rounded-xl border-[#dfe7dc] bg-white text-slate-700">Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-[#6b8a6a] text-white hover:bg-[#587155]">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
