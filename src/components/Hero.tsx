"use client";

import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Calendar, ArrowRight, Mountain, Users, Globe, DollarSign, Trophy, Star, ChevronLeft, ChevronRight, Utensils, MapPin } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import heroImage1 from "@/assets/optimized/bogota-golf-hero.webp";
import heroImage2 from "@/assets/optimized/bogota-golf-caddies.webp";
import heroImage4 from "@/assets/optimized/bogota-golf-group-celebration.webp";
import heroImage5 from "@/assets/optimized/bogota-golf-value.webp";

interface Slide {
  id: number;
  image: any;
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: {
    text: string;
    icon: any;
    action: string;
  };
  ctaSecondary: {
    text: string;
    icon: any;
    action: string;
  };
  stats: {
    value: string;
    label: string;
  }[];
  badge: {
    icon: any;
    text: string;
  };
}

const slides: Slide[] = [
  {
    id: 1,
    image: heroImage1,
    title: "Private Golf Experiences in Bogotá",
    subtitle: "Exclusive Tours for International Travelers",
    description: "Your golf shots travel 15% further in the thin mountain air. Play championship courses with stunning Andean backdrops while your USD goes further than anywhere else.",
    ctaPrimary: {
      text: "Book Golf Week",
      icon: Calendar,
      action: "contact"
    },
    ctaSecondary: {
      text: "Discover Altitude Benefits",
      icon: Mountain,
      action: "benefits"
    },
    stats: [
      { value: "15%", label: "More Distance" },
      { value: "20+", label: "Golf Courses" },
      { value: "365", label: "Days Golf" }
    ],
    badge: {
      icon: Mountain,
      text: "2,640m Altitude Advantage"
    }
  },
  {
    id: 2,
    image: heroImage2,
    title: "Professional Bilingual Caddies",
    subtitle: "Elevate Your Game",
    description: "Every round includes a professional, bilingual caddy who knows each course intimately. Get local insights, course strategy, and cultural stories that make your experience unforgettable.",
    ctaPrimary: {
      text: "Reserve with Caddy",
      icon: Users,
      action: "contact"
    },
    ctaSecondary: {
      text: "View Golf Plans",
      icon: Trophy,
      action: "plans"
    },
    stats: [
      { value: "100%", label: "Bilingual Caddies" },
      { value: "5★", label: "Service Rating" },
      { value: "Pro", label: "Course Knowledge" }
    ],
    badge: {
      icon: Users,
      text: "Professional Caddy Service"
    }
  },
  {
    id: 3,
    image: "https://img.lalr.co/cms/2021/06/22165155/Glounge-6.jpg",
    title: "World-Class Dining & Nightlife",
    subtitle: "Beyond the 18th Hole",
    description: "After your rounds, indulge in Bogotá's award-winning culinary scene. From rooftop cocktails to Michelin-level gastronomy, experience why Bogotá is South America's food capital.",
    ctaPrimary: {
      text: "Book Culinary Experience",
      icon: Utensils,
      action: "contact"
    },
    ctaSecondary: {
      text: "Explore All Experiences",
      icon: Star,
      action: "experiences"
    },
    stats: [
      { value: "5★", label: "Restaurants" },
      { value: "24/7", label: "Nightlife" },
      { value: "Local", label: "Gastronomy" }
    ],
    badge: {
      icon: Utensils,
      text: "Culinary Capital Experience"
    }
  },
  {
    id: 4,
    image: heroImage4,
    title: "Perfect for Groups & Celebrations",
    subtitle: "Golf Memories That Last",
    description: "Whether it's a bachelor party, corporate retreat, or friends' getaway, our group packages create unforgettable moments. Special rates for foursomes and larger groups.",
    ctaPrimary: {
      text: "Plan Group Trip",
      icon: Users,
      action: "contact"
    },
    ctaSecondary: {
      text: "View Packages",
      icon: Trophy,
      action: "plans"
    },
    stats: [
      { value: "Groups", label: "Specialist" },
      { value: "Custom", label: "Packages" },
      { value: "VIP", label: "Treatment" }
    ],
    badge: {
      icon: Trophy,
      text: "Group Golf Specialists"
    }
  },
  {
    id: 5,
    image: heroImage5,
    title: "Your USD Goes Further",
    subtitle: "Luxury at Unbeatable Value",
    description: "Experience 5-star luxury at a fraction of US or European costs. Premium golf, world-class dining, luxury accommodations, and VIP treatment - all with incredible USD buying power.",
    ctaPrimary: {
      text: "View Golf Plans & Pricing",
      icon: DollarSign,
      action: "plans"
    },
    ctaSecondary: {
      text: "Calculate USD Savings",
      icon: Globe,
      action: "contact"
    },
    stats: [
      { value: "50%", label: "USD Savings" },
      { value: "5★", label: "Luxury Level" },
      { value: "All-In", label: "Packages" }
    ],
    badge: {
      icon: DollarSign,
      text: "Unbeatable USD Value"
    }
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCTAClick = (action: string) => {
    switch(action) {
      case 'contact':
        scrollToSection('contact');
        break;
      case 'courses':
        scrollToSection('courses');
        break;
      case 'benefits':
        scrollToSection('benefits');
        break;
      case 'experiences':
        scrollToSection('experiences');
        break;
      case 'plans':
        scrollToSection('plans');
        break;
      default:
        scrollToSection('contact');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col justify-between pt-[7rem] sm:pt-[8rem] md:pt-[9rem] lg:pt-[10rem] pb-4"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image Slider with Parallax Effect */}
      <div className="absolute inset-0 top-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={slide.image?.src || slide.image}
              alt={slide.title}
              className="w-full h-full object-cover scale-105"
              loading={index === currentSlide ? "eager" : "lazy"}
              fetchPriority={index === currentSlide ? "high" : undefined}
            />
          </div>
        ))}
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-primary/40 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent" />
      </button>

      {/* Main Content - Centered */}
      <div className="relative flex-1 flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge with Pulse Animation */}
            <div className="inline-flex items-center bg-accent/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 transition-all duration-500 border-2 border-accent/30 shadow-lg shadow-accent/10 hover:scale-105 hover:bg-accent/30 group">
              <currentSlideData.badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
              <span className="text-accent text-sm sm:text-base md:text-lg font-bold tracking-wide uppercase">{currentSlideData.badge.text}</span>
            </div>
            
            <div className="transition-all duration-500">
              <h1 className="text-[48px] sm:text-[56px] md:text-[68px] lg:text-[86px] xl:text-[108px] font-black text-white mb-4 sm:mb-6 leading-[0.95] uppercase tracking-tighter">
                {currentSlideData.title}
              </h1>
              
              <h2 className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-[48px] text-accent mb-6 sm:mb-8 font-bold uppercase tracking-tight">
                {currentSlideData.subtitle}
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 sm:mb-8 leading-relaxed font-medium max-w-3xl mx-auto drop-shadow-md">
                {currentSlideData.description}
              </p>
            </div>

            {/* Stats Row with Enhanced Design */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-10 max-w-2xl mx-auto">
              {currentSlideData.stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 text-center transition-all duration-500 border-2 border-white/20 hover:bg-white/20 hover:scale-105 hover:border-accent/50 group shadow-xl">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-accent mb-1 sm:mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">{stat.value}</div>
                  <div className="text-white/90 text-xs sm:text-sm md:text-base uppercase tracking-wider font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all duration-300" 
                  onClick={() => handleCTAClick(currentSlideData.ctaPrimary.action)}
                >
                  <currentSlideData.ctaPrimary.icon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span>{currentSlideData.ctaPrimary.text}</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-black w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300" 
                  onClick={() => handleCTAClick(currentSlideData.ctaSecondary.action)}
                >
                  <currentSlideData.ctaSecondary.icon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="text-[rgba(45,90,45,1)]">{currentSlideData.ctaSecondary.text}</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
                </Button>
              </div>
              
              {/* Slide-specific tertiary CTA */}
              <div className="flex flex-wrap gap-3 justify-center">
                {currentSlide === 0 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:text-accent hover:bg-white/10" 
                    onClick={() => handleCTAClick('courses')}
                  >
                    <Mountain className="w-4 h-4 mr-2" />
                    View All Golf Courses
                  </Button>
                )}
                {currentSlide === 1 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:text-accent hover:bg-white/10" 
                    onClick={() => handleCTAClick('benefits')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Professional Services
                  </Button>
                )}
                {currentSlide === 2 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:text-accent hover:bg-white/10" 
                    onClick={() => handleCTAClick('plans')}
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    Dining Packages
                  </Button>
                )}
                {currentSlide === 3 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:text-accent hover:bg-white/10" 
                    onClick={() => handleCTAClick('experiences')}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Group Experiences
                  </Button>
                )}
                {currentSlide === 4 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:text-accent hover:bg-white/10" 
                    onClick={() => handleCTAClick('benefits')}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Value Benefits
                  </Button>
                )}
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 text-white/80 text-xs sm:text-sm">
              <div className="flex items-center mb-1 sm:mb-0">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-accent fill-accent" />
                ))}
              </div>
              <span className="text-center sm:text-left">4.9/5 rating from 200+ international guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar - Full Width */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Brand Section */}
              <div className="md:col-span-3 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border-b md:border-b-0 md:border-r border-white/10 p-4 flex items-center justify-center">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleCTAClick('plans')}>
                  <Trophy className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-white font-bold text-sm leading-tight">BGX Golf</p>
                    <p className="text-accent text-xs">Premium Experiences</p>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="md:col-span-5 grid grid-cols-2 gap-px bg-white/5">
                <div className="bg-white/0 hover:bg-white/10 p-3 transition-all group flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-white font-semibold text-xs leading-tight">International</p>
                    <p className="text-white/70 text-[10px]">Specialists</p>
                  </div>
                </div>
                <div className="bg-white/0 hover:bg-white/10 p-3 transition-all group flex items-center gap-2 border-l border-white/10">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-white font-semibold text-xs leading-tight">2,640m</p>
                    <p className="text-white/70 text-[10px]">Altitude</p>
                  </div>
                </div>
                <div className="bg-white/0 hover:bg-white/10 p-3 transition-all group flex items-center gap-2 border-t border-white/10">
                  <Trophy className="w-5 h-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-white font-semibold text-xs leading-tight">20+ Courses</p>
                    <p className="text-white/70 text-[10px]">Championship</p>
                  </div>
                </div>
                <div className="bg-white/0 hover:bg-white/10 p-3 transition-all group flex items-center gap-2 border-t border-l border-white/10">
                  <Users className="w-5 h-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-white font-semibold text-xs leading-tight">Bilingual</p>
                    <p className="text-white/70 text-[10px]">Pro Caddies</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/10 p-3 flex flex-wrap items-center justify-center gap-1.5">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-white hover:text-accent hover:bg-white/10 text-xs py-2 h-auto px-3" 
                  onClick={() => handleCTAClick('plans')}
                >
                  <Trophy className="w-3.5 h-3.5 mr-1.5" />
                  Plans
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-white hover:text-accent hover:bg-white/10 text-xs py-2 h-auto px-3" 
                  onClick={() => handleCTAClick('courses')}
                >
                  <Mountain className="w-3.5 h-3.5 mr-1.5" />
                  Courses
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-white hover:text-accent hover:bg-white/10 text-xs py-2 h-auto px-3" 
                  onClick={() => handleCTAClick('experiences')}
                >
                  <Star className="w-3.5 h-3.5 mr-1.5" />
                  Experiences
                </Button>
                <Button 
                  size="sm" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs py-2 h-auto px-4 shadow-lg" 
                  onClick={() => handleCTAClick('contact')}
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}