"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, Users, CreditCard, ChevronRight, Loader2, Info, Minus, Plus, Copy } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { cn } from "./ui/utils";
import { Separator } from "./ui/separator";
import { useBookingWhatsApp } from "@/hooks/useBookingWhatsApp";

interface Plan {
  name: string;
  price: string;
  duration: string;
  subtitle: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

interface BookingFormValues {
  startDate: Date | undefined;
  guestCount: number;
}

const STEPS = {
  CONFIG: 0,
  REVIEW: 1
};

export function BookingModal({ isOpen, onClose, plan }: BookingModalProps) {
  const [step, setStep] = useState(STEPS.CONFIG);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [exchangeRate, setExchangeRate] = React.useState(4550);
  const [isExchangeRateFallback, setIsExchangeRateFallback] = React.useState(false);
  const [copiedEstimatedPrice, setCopiedEstimatedPrice] = React.useState(false);
  const { ambassadorName } = useBookingWhatsApp();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    async function loadExchangeRate() {
      try {
        const response = await fetch('/api/public/trm', { cache: 'no-store' });
        const data = await response.json().catch(() => null) as { exchangeRate?: number; fallback?: boolean } | null;

        if (!response.ok || !data?.exchangeRate) {
          throw new Error('Unable to load exchange rate.');
        }

        if (isMounted) {
          setExchangeRate(data.exchangeRate);
          setIsExchangeRateFallback(Boolean(data.fallback));
        }
      } catch (error) {
        console.error('Unable to load TRM exchange rate:', error);
        if (isMounted) {
          setExchangeRate(4550);
          setIsExchangeRateFallback(true);
        }
      }
    }

    void loadExchangeRate();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  // User instructions: Smart Pack 4 nights, Elite Pack 5 nights
  const getNightsForPlan = () => {
    if (!plan) return 0;
    if (plan.name.includes("Elite")) return 5;
    return 4;
  };

  const tripNights = getNightsForPlan();

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormValues>({
    defaultValues: {
      guestCount: 4,
    },
    mode: "onChange"
  });

  const startDate = watch("startDate");
  const guestCount = watch("guestCount");

  // Parse price from string (e.g., "$1,590") to number
  const getPricePerPerson = () => {
    if (!plan) return 0;
    return parseInt(plan.price.replace(/\D/g, ''));
  };

  const getTotalPrice = () => {
    return getPricePerPerson() * (guestCount || 0);
  };

  const getEstCopPrice = () => {
    return getTotalPrice() * exchangeRate;
  };

  const handleCopyPriceForWompi = async () => {
    const valueToCopy = Math.round(getEstCopPrice()).toString();

    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopiedEstimatedPrice(true);
      window.setTimeout(() => setCopiedEstimatedPrice(false), 1800);
    } catch (error) {
      console.error('Unable to copy COP estimated value:', error);
      setCopiedEstimatedPrice(false);
    }
  };

  const handleNext = () => {
    if (step === STEPS.CONFIG && startDate && guestCount > 0) {
      setStep(STEPS.REVIEW);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call or processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to Wompi
    const priceInCents = getEstCopPrice() * 100;
    // We append the amount in cents hoping the link supports pre-filling or is a dynamic link
    window.location.href = `https://checkout.wompi.co/l/VPOS_LF35TM?amount-in-cents=${priceInCents}`;
    
    setIsSubmitting(false);
  };

  const updateGuests = (delta: number) => {
    const current = guestCount || 0;
    const next = Math.max(1, Math.min(12, current + delta)); // Limit between 1 and 12 for now
    setValue("guestCount", next);
  };

  if (!plan || !mounted) return null;

  return (
    <Dialog key={isOpen ? "open" : "closed"} open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif tracking-wide">{plan.name}</DialogTitle>
            <DialogDescription className="text-primary/70 font-medium">
              {plan.subtitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {step === STEPS.CONFIG && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Date Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  1. Select Start Date
                </h3>
                <div className="p-4 border-2 border-primary/5 rounded-2xl bg-white shadow-xl w-full flex justify-center">
                  <Controller
                    control={control}
                    name="startDate"
                    rules={{ required: "Please select a start date" }}
                    render={({ field }) => (
                      <div className="w-full max-w-[300px]">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          tripDuration={tripNights}
                          initialFocus
                        />
                      </div>
                    )}
                  />
                </div>
                {errors.startDate && (
                  <p className="text-sm text-destructive font-medium text-center">
                    Please select a date to continue.
                  </p>
                )}
              </div>

              <Separator />

              {/* Guest Count */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-primary">2. Number of Guests</Label>
                <div className="flex items-center justify-between bg-accent/5 p-4 rounded-lg border border-accent/10">
                  <span className="text-sm text-muted-foreground">How many people are joining?</span>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests(-1)}
                      disabled={guestCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg">{guestCount}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateGuests(1)}
                      disabled={guestCount >= 12}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === STEPS.REVIEW && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-primary">Booking Summary</h3>
                <p className="text-sm text-muted-foreground">Please review your trip details before payment.</p>
              </div>

              <div className="rounded-lg border bg-accent/5 overflow-hidden">
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">{startDate ? format(startDate, "MMMM do, yyyy") : "-"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Package</span>
                    <span className="font-medium">{plan.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{plan.duration}</span>
                  </div>
                  
                  <Separator className="bg-border/50" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{guestCount} x Guest{guestCount > 1 ? 's' : ''}</span>
                      <span className="font-medium text-sm">{plan.price} each</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-4 border-t border-primary/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-primary">Total Total (USD)</span>
                    <span className="text-2xl font-bold text-primary">
                      ${getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-md border border-primary/10 p-3 mb-4">
                    <div className="flex justify-between items-center mb-2 gap-3">
                      <span className="text-sm font-semibold text-primary">Estimated Value in Pesos (COP)</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-700 whitespace-nowrap">
                          ${getEstCopPrice().toLocaleString('es-CO')}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => void handleCopyPriceForWompi()}
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          {copiedEstimatedPrice ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                    <p className="text-[11px] text-primary/80 font-medium mb-1 text-right">
                      Copy this price to pay in Wompi.
                    </p>
                    <p className="text-[10px] text-muted-foreground text-right">
                      *Approx. rate 1 USD = ${exchangeRate.toLocaleString('es-CO')} COP.
                    </p>
                    {isExchangeRateFallback ? (
                      <p className="text-[10px] text-amber-700 text-right mt-1">
                        Unable to sync live TRM now. Using fallback value.
                      </p>
                    ) : null}
                  </div>
                  
                  {/* Ambassador invitation summary */}
                  <div className="bg-gradient-to-r from-accent/10 to-primary/5 rounded-lg p-3 border border-accent/20">
                    <Label className="text-xs font-semibold text-primary mb-2 block">Ambassador Invitation</Label>
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md p-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-green-700 font-medium">
                        {ambassadorName
                          ? `You have been invited by ${ambassadorName} and you will receive special treatment, and a Colombian gift.`
                          : 'You have been invited by your BGX ambassador and you will receive special treatment, and a Colombian gift.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  You will be redirected to Wompi to complete your secure payment.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50/50 sm:justify-between">
          <Button
            variant="outline"
            onClick={step === STEPS.CONFIG ? handleClose : handleBack}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {step === STEPS.CONFIG ? "Cancel" : "Back"}
          </Button>
          
          {step === STEPS.CONFIG ? (
            <Button 
              onClick={handleNext} 
              className="w-full sm:w-auto"
              disabled={!startDate}
            >
              Review & Pay
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit(onSubmit)} 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}