"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatsShowcase } from "@/components/StatsShowcase";
import { WhyBogota } from "@/components/WhyBogota";
import { Benefits } from "@/components/Benefits";
import { GolfCourses } from "@/components/GolfCourses";
import { GolfPlans } from "@/components/GolfPlans";
import { Experiences } from "@/components/Experiences";
import { BuddyTrip } from "@/components/BuddyTrip";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";
import { AiAgentWidget } from "@/components/AiAgentWidget";

export default function HomeClient() {
  return (
    <>
      <Header />
      <Hero />
      <StatsShowcase />
      <WhyBogota />
      <Benefits />
      <GolfCourses />
      <Experiences />
      <GolfPlans />
      <BuddyTrip />
      <Testimonials />
      <FAQ />
      <BookingForm />
      <Footer />
      <AiAgentWidget />
    </>
  );
}
