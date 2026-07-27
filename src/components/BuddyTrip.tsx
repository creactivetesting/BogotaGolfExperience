"use client";

import { motion } from 'motion/react';
import { Users, Calendar, MapPin, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import buddyTripImage from '@/assets/optimized/bogota-golf-buddy-trip.webp';

export function BuddyTrip() {
  const scrollToBooking = () => {
    const bookingSection = document.querySelector('#booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: Users, text: "Custom Group Sizes (4-20+ players)" },
    { icon: Calendar, text: "Flexible Multi-Day Itineraries" },
    { icon: MapPin, text: "Curated Course Selection" },
    { icon: Star, text: "VIP Experiences & Dining" }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e1a]/95 via-[#2d5a2d]/90 to-[#4a6741]/85 z-10" />
        <ImageWithFallback
          src={buddyTripImage}
          alt="Golf buddies enjoying a premium golf trip in Bogotá with mountain views"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl z-0" />

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full backdrop-blur-sm">
              <Users className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#d4af37] uppercase tracking-wider">Buddy Trips</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h2 className="text-white mb-4">
              Plan Your Ultimate Golf Getaway
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl">
              Gather your foursome or bring the whole crew. We'll craft a personalized golf adventure 
              through Bogotá's finest courses with unforgettable experiences.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 group hover:bg-white/15 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-[#d4af37] mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-white">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* What's included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 mb-10"
          >
            <h3 className="text-white mb-6 text-center">What's Included in Your Buddy Trip</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Premium tee times at multiple championship courses",
                "Professional bilingual caddies for every round",
                "Private transportation between courses & experiences",
                "Curated dining at Bogotá's top restaurants",
                "Group accommodation recommendations",
                "Customized itinerary planning & concierge service"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={scrollToBooking}
              className="group bg-[#d4af37] hover:bg-[#c49b2f] text-[#1a2e1a] px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Plan Your Buddy Trip</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              onClick={() => window.open('https://wa.me/573176392251', '_blank')}
              className="group bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-6 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <span>Chat on WhatsApp</span>
              <svg
                className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center text-white/60 mt-8"
          >
            ⭐ Trusted by golf groups from USA, Europe, and Asia • 100+ successful buddy trips organized
          </motion.p>
        </div>
      </div>
    </section>
  );
}