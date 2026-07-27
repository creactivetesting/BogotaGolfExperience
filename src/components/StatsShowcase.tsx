"use client";

import { motion } from 'motion/react';
import { Trophy, MapPin, Users, Star } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

const stats = [
  {
    icon: MapPin,
    value: 22,
    suffix: '+',
    label: 'Golf Courses',
    description: 'Championship & resort courses',
    color: 'from-[#2d5a2d] to-[#4a6741]'
  },
  {
    icon: Users,
    value: 200,
    suffix: '+',
    label: 'Happy Golfers',
    description: 'International visitors in 2025',
    color: 'from-[#7ba05b] to-[#5a7a3d]'
  },
  {
    icon: Trophy,
    value: 15,
    suffix: '%',
    label: 'More Distance',
    description: 'At 2,640m altitude',
    color: 'from-[#d4af37] to-[#f4d03f]'
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    label: 'Rating',
    description: 'From verified golfers',
    color: 'from-[#8b4513] to-[#a0522d]'
  }
];

export function StatsShowcase() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden py-16 sm:py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 golf-texture opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col justify-center items-center gap-12 sm:gap-16 lg:gap-20">
          
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] text-white uppercase mb-4 sm:mb-6 font-bold tracking-tight">
              Golf Excellence by the Numbers
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg">
              Join the growing community of international golfers who have discovered Bogotá's unique advantages
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-accent/40 transition-all duration-300 h-full">
                  {/* Icon - Minimalist Elegant */}
                  <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-all duration-300">
                    <stat.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                  </div>

                  {/* Animated Number */}
                  <div className="text-center mb-2">
                    <div className="text-4xl sm:text-5xl font-bold text-white mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2500} />
                    </div>
                    <div className="text-accent font-semibold uppercase tracking-wider mb-2">
                      {stat.label}
                    </div>
                    <p className="text-white/70 text-sm">
                      {stat.description}
                    </p>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <p className="text-white text-sm sm:text-base">
                <span className="text-accent font-bold">Limited Availability</span> • Book your 2025-2026 golf experience today
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}