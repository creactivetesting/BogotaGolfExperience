"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Slider from "react-slick";
import bgxLogo from "figma:asset/518092e19c55e8e36d9ad43068a1b79ad630fd42.png";

interface Testimonial {
  id: string;
  golferName: string;
  reviewText: string;
  isActive: boolean;
  createdAt: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    golferName: "Thomas Weber",
    reviewText: "The golf courses in Bogotá are hidden gems. The maintenance is PGA tour level, and the clubhouses are spectacular. Incredible value for money compared to playing back home.",
    isActive: true,
    createdAt: "2025-04-01"
  },
  {
    id: "2",
    golferName: "Liam Wilson",
    reviewText: "Escaping the Canadian winter for Bogotá's eternal spring was the best decision. The altitude added 15% to my drives, and the hospitality was unmatched.",
    isActive: true,
    createdAt: "2025-02-01"
  },
  {
    id: "3",
    golferName: "João Silva",
    reviewText: "As someone used to European courses, I was blown away by the quality in Bogotá. The bilingual caddies made me feel right at home, and the food scene is world-class.",
    isActive: true,
    createdAt: "2025-03-01"
  },
  {
    id: "4",
    golferName: "Jean-Luc Moreau",
    reviewText: "The combination of championship golf and luxury dining is exquisite. Playing at 2,600 meters with the Andes backdrop is a memory I will cherish forever.",
    isActive: true,
    createdAt: "2025-05-01"
  },
  {
    id: "5",
    golferName: "Marco Rossi",
    reviewText: "Perfetto! The attention to detail from the BGX team was impressive. From airport pickup to the 19th hole, everything was first class. Highly recommended.",
    isActive: true,
    createdAt: "2025-06-01"
  },
  {
    id: "6",
    golferName: "Min-jun Kim",
    reviewText: "I travel often for golf, and Bogotá surprised me. The caddies are very knowledgeable, and the course layouts are challenging yet fair. A must-visit destination.",
    isActive: true,
    createdAt: "2025-07-01"
  }
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response = await fetch('/api/admin/testimonials');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const validTestimonials = data.filter((t: any) => t.reviewText && t.reviewText.trim() !== '');
          if (validTestimonials.length > 0) {
            setTestimonials(validTestimonials);
          }
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
      }
    }

    void loadTestimonials();

    if (!document.querySelector("link[href*='slick-carousel']")) {
      const link1 = document.createElement("link");
      link1.rel = "stylesheet";
      link1.type = "text/css";
      link1.href = "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css";
      document.head.appendChild(link1);

      const link2 = document.createElement("link");
      link2.rel = "stylesheet";
      link2.type = "text/css";
      link2.href = "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css";
      document.head.appendChild(link2);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <section className="py-20 sm:py-24 bg-[#1a2e1a] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2d5a2d]/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-[#d4af37]/30">
              <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
              <span className="text-[#d4af37] font-semibold uppercase tracking-wider text-xs">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              GOLFER STORIES
            </h2>
            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-xl mx-auto">
              Discover why golfers from around the world are choosing Bogotá for their next premium golf destination.
            </p>
          </motion.div>

          <div className="flex gap-3 mt-8">
            <Button
              onClick={previous}
              size="icon"
              variant="outline"
              className="rounded-full border-white/10 text-white bg-white/5 hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-[#1a2e1a] transition-all duration-300 w-12 h-12 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={next}
              size="icon"
              variant="outline"
              className="rounded-full border-white/10 text-white bg-white/5 hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-[#1a2e1a] transition-all duration-300 w-12 h-12 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="-mx-4 pb-12">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 h-full">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 h-[420px] flex flex-col relative group hover:border-[#d4af37]/50 hover:bg-white/[0.06] transition-all duration-500">
                  <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                    <Quote className="w-8 h-8 text-[#d4af37]" />
                  </div>

                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                    ))}
                  </div>

                  <div className="flex-grow overflow-hidden">
                    <p className="text-gray-200 text-lg leading-relaxed italic font-light line-clamp-6">
                      "{testimonial.reviewText}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#d4af37]/50 p-0.5 flex-shrink-0">
                      <ImageWithFallback
                        src={bgxLogo}
                        alt={testimonial.golferName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base">{testimonial.golferName}</h4>
                      <p className="text-[#d4af37] text-xs uppercase tracking-wide">BGX Golfer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">4.9/5</h3>
            <p className="text-xs uppercase tracking-widest text-gray-400">Average Rating</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">100%</h3>
            <p className="text-xs uppercase tracking-widest text-gray-400">Satisfaction</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">20+</h3>
            <p className="text-xs uppercase tracking-widest text-gray-400">Countries</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">24/7</h3>
            <p className="text-xs uppercase tracking-widest text-gray-400">Support</p>
          </div>
        </div>
      </div>

      <style>{`
        .slick-slider { position: relative; display: block; box-sizing: border-box; user-select: none; touch-action: pan-y; }
        .slick-list { position: relative; display: block; overflow: hidden; margin: 0; padding: 0; }
        .slick-track { position: relative; top: 0; left: 0; display: flex !important; margin-left: auto; margin-right: auto; }
        .slick-slide { display: none; float: left; height: inherit !important; min-height: 1px; }
        .slick-initialized .slick-slide { display: block; }
        .slick-dots { position: absolute; bottom: -45px; display: block; width: 100%; padding: 0; margin: 0; list-style: none; text-align: center; }
        .slick-dots li { position: relative; display: inline-block; width: 20px; height: 20px; margin: 0 5px; cursor: pointer; }
        .slick-dots li button { font-size: 0; display: block; width: 20px; height: 20px; padding: 5px; cursor: pointer; color: transparent; border: 0; background: transparent; }
        .slick-dots li button:before { font-size: 40px; line-height: 20px; position: absolute; top: 0; left: 0; width: 20px; height: 20px; content: '•'; text-align: center; opacity: .25; color: white; }
        .slick-dots li.slick-active button:before { opacity: 1; color: #d4af37; }
      `}</style>
    </section>
  );
}