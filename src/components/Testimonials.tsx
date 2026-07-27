"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
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
    id: 1,
    name: "Thomas Weber",
    location: "NYC, USA",
    image: bgxLogo,
    rating: 5,
    text: "The golf courses in Bogotá are hidden gems. The maintenance is PGA tour level, and the clubhouses are spectacular. Incredible value for money compared to playing back home.",
    experience: "European Tour Group",
    date: "April 2025"
  },
  {
    id: 2,
    name: "Liam Wilson",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1722619897030-fba9f9673a29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZ29sZmVyJTIwcG9ydHJhaXQlMjBjYW5hZGF8ZW58MXx8fHwxNzcxMjU5MjM2fDA&ixlib=rb-4.1.0&q=80&w=400",
    rating: 5,
    text: "Escaping the Canadian winter for Bogotá's eternal spring was the best decision. The altitude added 15% to my drives, and the hospitality was unmatched.",
    experience: "Winter Golf Escape",
    date: "February 2025"
  },
  {
    id: 3,
    name: "João Silva",
    location: "Lisbon, Portugal",
    image: "https://images.unsplash.com/photo-1738523686516-54a1daf9c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZ29sZmVyJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc3MTI1ODA0NHww&ixlib=rb-4.1.0&q=80&w=400",
    rating: 5,
    text: "As someone used to European courses, I was blown away by the quality in Bogotá. The bilingual caddies made me feel right at home, and the food scene is world-class.",
    experience: "Cultural Golf Tour",
    date: "March 2025"
  },
  {
    id: 4,
    name: "Jean-Luc Moreau",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1744009549356-e2916ec0bdce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZ29sZmVyJTIwcG9ydHJhaXQlMjBmcmFuY2UlMjBzdHlsaXNofGVufDF8fHx8MTc3MTI1OTIzNnww&ixlib=rb-4.1.0&q=80&w=400",
    rating: 5,
    text: "The combination of championship golf and luxury dining is exquisite. Playing at 2,600 meters with the Andes backdrop is a memory I will cherish forever.",
    experience: "Gourmet Golf Week",
    date: "May 2025"
  },
  {
    id: 5,
    name: "Marco Rossi",
    location: "Milan, Italy",
    image: "https://images.unsplash.com/photo-1655121330147-83c5386e3552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZ29sZmVyJTIwcG9ydHJhaXQlMjBpdGFseSUyMGZhc2hpb258ZW58MXx8fHwxNzcxMjU5MjM2fDA&ixlib=rb-4.1.0&q=80&w=400",
    rating: 5,
    text: "Perfetto! The attention to detail from the BGX team was impressive. From airport pickup to the 19th hole, everything was first class. Highly recommended.",
    experience: "VIP Golf Experience",
    date: "June 2025"
  },
  {
    id: 6,
    name: "Min-jun Kim",
    location: "Seoul, South Korea",
    image: "https://images.unsplash.com/photo-1632333525456-6c2fac03968e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBtYWxlJTIwZ29sZmVyJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxMjU5MjM2fDA&ixlib=rb-4.1.0&q=80&w=400",
    rating: 5,
    text: "I travel often for golf, and Bogotá surprised me. The caddies are very knowledgeable, and the course layouts are challenging yet fair. A must-visit destination.",
    experience: "International Golf Tour",
    date: "July 2025"
  }
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials as Testimonial[]);
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
    mobileFirst: true, // Switch to mobile-first approach for better stability on phones
    responsive: [
      {
        breakpoint: 768, // sm/md breakpoint - show 2 slides
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1280, // lg/xl breakpoint - show 3 slides
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Inject Slick Carousel CSS if not already present (failsafe)
  useEffect(() => {
    async function loadTestimonials() {
      const response = await fetch('/api/admin/testimonials');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setTestimonials(data);
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

  const [mounted, setMounted] = useState(false);

  if (!mounted) return null;

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <section className="py-20 sm:py-24 bg-[#1a2e1a] relative overflow-hidden">
      {/* Background patterns matching the theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2d5a2d]/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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

        {/* Carousel */}
        <div className="-mx-4 pb-12">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 h-full">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 h-[420px] flex flex-col relative group hover:border-[#d4af37]/50 hover:bg-white/[0.06] transition-all duration-500">
                  
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                    <Quote className="w-8 h-8 text-[#d4af37]" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                    ))}
                  </div>

                  {/* Text */}
                  <div className="flex-grow overflow-hidden">
                    <p className="text-gray-200 text-lg leading-relaxed italic font-light line-clamp-6">
                      "{testimonial.reviewText}"
                    </p>
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#d4af37]/50 p-0.5 flex-shrink-0">
                      <ImageWithFallback
                        src={testimonial.image}
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

        {/* Stats Strip */}
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
      
      {/* Custom Slick Styles to replace CSS imports */}
      <style>{`
        .slick-slider {
          position: relative;
          display: block;
          box-sizing: border-box;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -khtml-user-select: none;
          -ms-touch-action: pan-y;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }
        .slick-list {
          position: relative;
          display: block;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        .slick-list:focus {
          outline: none;
        }
        .slick-list.dragging {
          cursor: pointer;
          cursor: hand;
        }
        .slick-slider .slick-track,
        .slick-slider .slick-list {
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
          -ms-transform: translate3d(0, 0, 0);
          -o-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
        .slick-track {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .slick-track:before,
        .slick-track:after {
          display: table;
          content: '';
        }
        .slick-track:after {
          clear: both;
        }
        .slick-loading .slick-track {
          visibility: hidden;
        }
        .slick-slide {
          display: none;
          float: left;
          height: 100%;
          min-height: 1px;
        }
        [dir='rtl'] .slick-slide {
          float: right;
        }
        .slick-slide img {
          display: block;
        }
        .slick-slide.slick-loading img {
          display: none;
        }
        .slick-slide.dragging img {
          pointer-events: none;
        }
        .slick-initialized .slick-slide {
          display: block;
        }
        .slick-loading .slick-slide {
          visibility: hidden;
        }
        .slick-vertical .slick-slide {
          display: block;
          height: auto;
          border: 1px solid transparent;
        }
        .slick-arrow.slick-hidden {
          display: none;
        }
        /* Custom Dots */
        .slick-dots {
          position: absolute;
          bottom: -45px;
          display: block;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style: none;
          text-align: center;
        }
        .slick-dots li {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
          margin: 0 5px;
          padding: 0;
          cursor: pointer;
        }
        .slick-dots li button {
          font-size: 0;
          line-height: 0;
          display: block;
          width: 20px;
          height: 20px;
          padding: 5px;
          cursor: pointer;
          color: transparent;
          border: 0;
          outline: none;
          background: transparent;
        }
        .slick-dots li button:hover,
        .slick-dots li button:focus {
          outline: none;
        }
        .slick-dots li button:before {
          font-family: sans-serif;
          font-size: 40px;
          line-height: 20px;
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          content: '•';
          text-align: center;
          opacity: .25;
          color: white;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #d4af37;
        }
        .slick-slide {
          height: inherit !important;
        }
        .slick-track {
          display: flex !important;
        }
      `}</style>
    </section>
  );
}