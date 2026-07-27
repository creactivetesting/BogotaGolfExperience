"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, Calendar, Phone, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bgxLogo from "@/assets/optimized/bgx-logo.webp";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isCoursesPage = pathname === '/courses';
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };
  
  const scrollToSection = (sectionId: string) => {
    // If we're on the courses page and clicking a homepage section, navigate to home first
    if (isCoursesPage && sectionId !== 'courses') {
      router.push('/#' + sectionId);
    } else if (sectionId === 'home') {
      // Navigate to home and scroll to top
      if (pathname !== '/') {
        router.push('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Scroll to section on current page
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const leftNavigation = [
    { name: "Golf Courses", onClick: () => scrollToSection('courses') },
    { name: "Home", onClick: () => scrollToSection('home') }
  ];

  const rightNavigation = [
    { name: "Golf Plans", onClick: () => scrollToSection('plans') },
    { name: "Experiences", onClick: () => scrollToSection('experiences') },
    { name: "Blogs", onClick: () => router.push('/blog') }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-primary/10 shadow-sm translate-z-0 transform-gpu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-[60px] md:h-[90px] lg:h-[100px]">
          
          {/* Logo Central - Golf Ball Style - ALINEADO SUPERIOR */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 sm:top-0 md:top-1 lg:top-1 z-50">
            <Link href="/" className="block group">
              {/* Golf Ball Circle Container - Tamaño Reducido */}
              <div className="relative w-[8rem] h-[8rem] sm:w-[9rem] sm:h-[9rem] md:w-[10rem] md:h-[10rem] lg:w-[11rem] lg:h-[11rem] flex items-center justify-center">
                {/* Outer Glow Ring - Animated */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-accent/30 via-primary/20 to-accent/30 blur-2xl logo-glow"></div>
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Golf Ball Background con Textura de Pelota de Golf */}
                <div className="absolute inset-0 rounded-full bg-white border-[4.5px] border-primary/30 shadow-2xl group-hover:shadow-[0_25px_80px_rgba(45,90,45,0.5)] transition-all duration-500 group-hover:scale-110 logo-powerful golf-ball-texture">
                  {/* Inner Shine Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60"></div>
                </div>
                
                {/* Logo Image - MÁS GRANDE */}
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-2.5 md:p-3 lg:p-3.5 z-10">
                  <ImageWithFallback 
                    src={bgxLogo.src} 
                    alt="BGX Bogotá Golf Experience" 
                    className="w-full h-full object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                    loading="eager"
                  />
                </div>

                {/* Hover Glow Effect - Golden Ring */}
                <div className="absolute inset-0 rounded-full ring-4 ring-accent/0 group-hover:ring-accent/30 transition-all duration-500"></div>
                
                {/* Bottom Shadow Extension */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/5 blur-2xl rounded-full"></div>
              </div>
            </Link>
          </div>

          {/* Left Side - Navigation próxima al logo */}
          <div className="hidden lg:flex items-center absolute left-0 space-x-1">
            {/* CTA Button - Extremo izquierdo */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollToContact} 
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <Phone className="w-4 h-4 xl:mr-2" strokeWidth={1.5} />
              <span className="hidden xl:inline">Call Us</span>
            </Button>

            {/* Separador visual */}
            <div className="w-px h-6 bg-border mx-4"></div>

            {/* Navegación izquierda - más cerca del logo */}
            <nav className="flex items-center space-x-6">
              {leftNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side - Navigation próxima al logo */}
          <div className="hidden lg:flex items-center absolute right-0 space-x-1">
            {/* Navegación derecha - más cerca del logo */}
            <nav className="flex items-center space-x-6">
              {rightNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              <button
                onClick={scrollToContact}
                className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>

            {/* Separador visual */}
            <div className="w-px h-6 bg-border mx-4"></div>

            {/* CTA Button - Extremo derecho */}
            <Button 
              size="sm" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105" 
              onClick={scrollToContact}
            >
              <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Book Tour
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden absolute right-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border-primary/20"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" strokeWidth={1.5} /> : <Menu className="w-4 h-4" strokeWidth={1.5} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-6 space-y-4">
              {[...leftNavigation, ...rightNavigation, { name: "Contact", onClick: scrollToContact }].map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t space-y-3">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={scrollToContact}>
                  <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Book Tour
                </Button>
                <Button variant="outline" className="w-full border-primary/20" onClick={scrollToContact}>
                  <Phone className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}