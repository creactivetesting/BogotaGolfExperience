"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Star, MapPin, Trophy, Users, Clock, DollarSign, Phone, Calendar, ArrowRight, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingForm } from './BookingForm';
import { Footer } from './Footer';
import { Header } from './Header';
import { TransitionLink } from './TransitionLink';

export function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCourseNames, setActiveCourseNames] = useState<string[] | null>(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Slider images para el hero
  const sliderImages = [
    {
      url: "https://images.unsplash.com/photo-1755144589277-a1b2d4ddda32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwYWVyaWFsJTIwbW91bnRhaW5zJTIwc2NlbmljfGVufDF8fHx8MTc1OTI4MTc4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Bogotá Golf Courses for International Visitors",
      subtitle: "Discover the Sabana's Premium Golf Collection"
    },
    {
      url: "https://images.unsplash.com/photo-1736705102736-61134435a9c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZmFpcndheSUyMGdyZWVuJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1OTI4MTc4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "15% More Distance",
      subtitle: "Play at 2,640m Altitude"
    },
    {
      url: "https://images.unsplash.com/photo-1685296982506-91e3e7942a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGx1eHVyeSUyMHJlc29ydHxlbnwxfHx8fDE3NTkyODE3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "World-Class Facilities",
      subtitle: "From Historic Clubs to Modern Resorts"
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadActiveCourses() {
      try {
        const response = await fetch('/api/public/courses', { cache: 'no-store' });
        const data = await response.json();

        if (Array.isArray(data)) {
          setActiveCourseNames(data.map((course: { name: string }) => course.name));
          return;
        }

        setActiveCourseNames([]);
      } catch (error) {
        console.error('No se pudieron cargar los campos activos:', error);
        setActiveCourseNames(null);
      }
    }

    void loadActiveCourses();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const allCourses = [
    {
      name: "San Andrés Golf Club",
      description: "Traditional Scottish-style course with history and character.",
      type: "Traditional",
      holes: 18,
      difficulty: "Championship",
      features: ["Historic Club", "Scottish Design", "Walking Friendly"],
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1685296982506-91e3e7942a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGx1eHVyeSUyMHJlc29ydHxlbnwxfHx8fDE3NTc1NDkxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Bogotá, Colombia",
      established: "1927",
      yardage: "6,847 yards",
      par: "Par 72",
      services: ["Professional Caddy", "Cart Rental", "Club House Restaurant", "Pro Shop", "Driving Range"],
      hours: "6:00 AM - 6:00 PM",
      greenFee: "From $85 USD",
      detailedDescription: "Founded in 1927, San Andrés Golf Club stands as Colombia's most historic golf course. Designed in traditional Scottish links style, this championship course has hosted numerous international tournaments and offers an authentic golfing experience at 2,640m altitude.",
      highlights: ["96-year golf tradition", "15% more distance due to altitude", "Walking-friendly design", "Historic clubhouse with colonial architecture"]
    },
    {
      name: "El Rincón de Cajicá",
      description: "Colombia's top private club, host of the World Cup of Golf (1980).",
      type: "Championship",
      holes: 18,
      difficulty: "Professional",
      features: ["World Cup Host", "Private Club", "Elite Facilities"],
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1576538854517-4851c4d392bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwYm9nb3RhJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1NzU0OTEwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Cajicá, Colombia (45 min from Bogotá)",
      established: "1965",
      yardage: "7,124 yards",
      par: "Par 72",
      services: ["Bilingual Professional Caddy", "Premium Cart Fleet", "Fine Dining Restaurant", "Exclusive Pro Shop", "Practice Facilities"],
      hours: "6:00 AM - 7:00 PM",
      greenFee: "From $120 USD",
      detailedDescription: "Host of the 1980 World Cup of Golf, El Rincón de Cajicá is Colombia's most prestigious private golf club. This championship course challenges players with strategic design while offering breathtaking views of the Sabana de Bogotá.",
      highlights: ["World Cup of Golf 1980 host venue", "Most exclusive club in Colombia", "Strategic championship design", "Panoramic Sabana views"]
    },
    {
      name: "Country Club de Bogotá",
      description: "Championship course with elite amenities.",
      type: "Elite",
      holes: 18,
      difficulty: "Championship",
      features: ["Elite Amenities", "City Views", "Premium Service"],
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1685880841765-6306f11616ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcGxheWVyJTIwYWx0aXR1ZGUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NTc1NDkxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Bogotá, Colombia",
      established: "1948",
      yardage: "6,912 yards",
      par: "Par 71",
      services: ["Expert Caddy Service", "Electric Carts", "Gourmet Restaurant", "Pro Shop", "Tennis Courts"],
      hours: "6:00 AM - 6:30 PM",
      greenFee: "From $95 USD",
      detailedDescription: "Located in the heart of Bogotá, Country Club de Bogotá offers a perfect blend of urban convenience and championship golf. The course features stunning city views and has been home to Colombia's golf elite for over 75 years.",
      highlights: ["Prime Bogotá location", "City skyline views", "75+ years of golf tradition", "Multi-sport facilities"]
    },
    {
      name: "Club Los Lagartos",
      description: "Two full 18-hole courses with lakes and tree-lined layouts.",
      type: "Resort",
      holes: 36,
      difficulty: "Varied",
      features: ["Two Courses", "Lakes & Trees", "Resort Style"],
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1609883013913-36c04181d457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwd2F0ZXIlMjBsYWtlfGVufDF8fHx8MTc1OTE3NjY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Tabio, Colombia (1 hour from Bogotá)",
      established: "1992",
      yardage: "13,400+ yards (both courses)",
      par: "Par 72 each",
      services: ["Caddy for Both Courses", "Golf Cart Fleet", "Resort Restaurant", "Event Facilities", "Swimming Pool"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $75 USD per course",
      detailedDescription: "Featuring two distinct 18-hole championship courses, Los Lagartos offers the ultimate golf resort experience. The Lake Course and Tree Course provide different challenges, making it perfect for multi-day golf experiences.",
      highlights: ["Two championship courses", "Lake and tree-lined holes", "Resort-style amenities", "Perfect for golf packages"]
    },
    {
      name: "Club Los Arrayanes",
      description: "Hillside beauty with unforgettable views and facilities.",
      type: "Scenic",
      holes: 18,
      difficulty: "Challenging",
      features: ["Mountain Views", "Hillside Design", "Premium Facilities"],
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1715761920143-23ec33f378d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwbW91bnRhaW5zJTIwc2NlbmljfGVufDF8fHx8MTc1OTE3NjY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "La Calera, Colombia (30 min from Bogotá)",
      established: "1978",
      yardage: "6,789 yards",
      par: "Par 72",
      services: ["Mountain Caddy Experts", "Cart Rental", "Vista Restaurant", "Event Spaces", "Spa Services"],
      hours: "6:00 AM - 6:00 PM",
      greenFee: "From $100 USD",
      detailedDescription: "Perched on the Eastern Hills of Bogotá, Los Arrayanes offers the most spectacular mountain views in Colombian golf. This challenging hillside course tests every aspect of your game while rewarding you with breathtaking panoramas.",
      highlights: ["Spectacular mountain views", "Challenging hillside design", "Eastern Hills location", "Award-winning restaurant"]
    },
    {
      name: "Club Guaymaral",
      description: "Natural parkland course with strategic water hazards.",
      type: "Parkland",
      holes: 18,
      difficulty: "Intermediate",
      features: ["Water Hazards", "Parkland Style", "Family Friendly"],
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1712411880136-cc82a565bf71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGx1eHVyeSUyMGZhY2lsaXR5fGVufDF8fHx8MTc1OTE3NjY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Bogotá, Colombia",
      established: "1985",
      yardage: "6,423 yards",
      par: "Par 71",
      services: ["Professional Caddy", "Cart Rental", "Family Restaurant", "Practice Range", "Golf Academy"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $70 USD",
      detailedDescription: "A strategic parkland course featuring natural water hazards and mature trees. Guaymaral offers an accessible yet challenging layout perfect for players of all skill levels, with a welcoming atmosphere for families and groups.",
      highlights: ["Strategic water features", "Mature tree-lined fairways", "Accessible for all levels", "Strong golf academy program"]
    },
    {
      name: "Hatogrande Country Club",
      description: "Modern championship design with international standards.",
      type: "Modern",
      holes: 18,
      difficulty: "Championship",
      features: ["Modern Design", "Tournament Ready", "Practice Facilities"],
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1662883161574-de7a6e671f8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwZmFpcndheSUyMHRyZWVzJTIwbmF0dXJlfGVufDF8fHx8MTc1OTE3NjY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Tenjo, Colombia (50 min from Bogotá)",
      established: "2001",
      yardage: "7,045 yards",
      par: "Par 72",
      services: ["Bilingual Caddy", "Premium Carts", "Fine Dining", "Pro Shop", "Teaching Pros"],
      hours: "6:00 AM - 6:30 PM",
      greenFee: "From $110 USD",
      detailedDescription: "Designed to international tournament standards, Hatogrande represents modern Colombian golf at its finest. The course challenges with strategic bunkering and water features while maintaining playability for all handicaps.",
      highlights: ["International tournament standards", "Modern strategic design", "World-class practice facilities", "Professional instruction available"]
    },
    {
      name: "Club Militar de Golf",
      description: "Classic military course with tradition and discipline.",
      type: "Traditional",
      holes: 18,
      difficulty: "Standard",
      features: ["Military Heritage", "Traditional Layout", "Well Maintained"],
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1606240674889-098fd540ab8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwbGFuZHNjYXBlJTIwY291bnRyeXNpZGV8ZW58MXx8fHwxNzU5MTc2NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Bogotá, Colombia",
      established: "1952",
      yardage: "6,512 yards",
      par: "Par 72",
      services: ["Caddy Service", "Cart Rental", "Officers Club Restaurant", "Pro Shop", "Event Spaces"],
      hours: "6:00 AM - 6:00 PM",
      greenFee: "From $65 USD",
      detailedDescription: "With over 70 years of military tradition, this course offers a classic golf experience with impeccable maintenance standards. The traditional layout rewards strategic play and course management.",
      highlights: ["70+ years of military tradition", "Classic traditional layout", "Impeccable maintenance", "Historic military clubhouse"]
    },
    {
      name: "Serrezuela Madrid Country Club",
      description: "Countryside retreat with challenging strategic design.",
      type: "Countryside",
      holes: 18,
      difficulty: "Challenging",
      features: ["Countryside Setting", "Strategic Play", "Weekend Getaway"],
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1634635976405-934ffb77aaf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwZGVzZXJ0JTIwbW9kZXJufGVufDF8fHx8MTc1OTE3NjY4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Madrid, Colombia (1 hour from Bogotá)",
      established: "1989",
      yardage: "6,678 yards",
      par: "Par 71",
      services: ["Professional Caddy", "Cart Rental", "Country Restaurant", "Lodging Available", "Event Facilities"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $80 USD",
      detailedDescription: "Located in the picturesque countryside west of Bogotá, Serrezuela offers a peaceful golf escape. The course features strategic design elements that reward thoughtful shot-making and course management.",
      highlights: ["Peaceful countryside setting", "Strategic course design", "Weekend getaway destination", "Lodging available on-site"]
    },
    {
      name: "Fontanar Country Club",
      description: "Exclusive lakeside course with stunning natural beauty.",
      type: "Exclusive",
      holes: 18,
      difficulty: "Championship",
      features: ["Lakeside", "Exclusive Access", "Natural Beauty"],
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1758190153146-a1507e2e000d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwZ3JlZW4lMjByb2xsaW5nJTIwaGlsbHN8ZW58MXx8fHwxNzU5MTc2Njg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Chía, Colombia (35 min from Bogotá)",
      established: "1995",
      yardage: "6,890 yards",
      par: "Par 72",
      services: ["Elite Caddy Service", "Premium Carts", "Gourmet Dining", "Exclusive Pro Shop", "Spa & Wellness"],
      hours: "6:00 AM - 7:00 PM",
      greenFee: "From $125 USD",
      detailedDescription: "One of Colombia's most exclusive golf destinations, Fontanar features a dramatic lakeside setting with championship design. The course offers privacy, luxury, and an unforgettable golf experience.",
      highlights: ["Exclusive private club", "Dramatic lakeside holes", "Championship design", "World-class amenities"]
    },
    {
      name: "Club Campestre El Rancho",
      description: "Family-friendly resort course with multiple recreational options.",
      type: "Resort",
      holes: 18,
      difficulty: "Intermediate",
      features: ["Family Resort", "Multiple Sports", "Event Venue"],
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1758551932752-a9c603e25146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwdHJvcGljYWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MTc2Njg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Sasaima, Colombia (90 min from Bogotá)",
      established: "1982",
      yardage: "6,234 yards",
      par: "Par 70",
      services: ["Caddy Service", "Cart Fleet", "Family Restaurant", "Swimming Pool", "Tennis Courts"],
      hours: "7:00 AM - 6:00 PM",
      greenFee: "From $60 USD",
      detailedDescription: "A perfect family resort destination combining golf with multiple recreational activities. El Rancho offers a relaxed atmosphere ideal for golf groups traveling with families or seeking a multi-activity experience.",
      highlights: ["Family-friendly resort atmosphere", "Multiple recreational activities", "Relaxed golf experience", "Great for group events"]
    },
    {
      name: "Club Los Búhos",
      description: "Mountain course with dramatic elevation changes.",
      type: "Mountain",
      holes: 18,
      difficulty: "Challenging",
      features: ["Elevation Changes", "Mountain Setting", "Scenic Views"],
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1648122532741-7e69d419f884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwc3Vuc2V0JTIwZHJhbWF0aWN8ZW58MXx8fHwxNzU5MTc2Njg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Subachoque, Colombia (55 min from Bogotá)",
      established: "1998",
      yardage: "6,756 yards",
      par: "Par 72",
      services: ["Mountain Caddy", "Cart Rental", "Mountain Lodge Restaurant", "Pro Shop", "Event Spaces"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $90 USD",
      detailedDescription: "Set in the mountains west of Bogotá, Los Búhos features dramatic elevation changes and breathtaking vistas. This challenging course rewards strategic play and offers a unique mountain golf experience.",
      highlights: ["Dramatic elevation changes", "Mountain vistas", "Strategic shot-making required", "Unique mountain golf experience"]
    },
    {
      name: "Club Campestre La Sabana",
      description: "Classic Sabana layout with traditional Colombian charm.",
      type: "Traditional",
      holes: 18,
      difficulty: "Standard",
      features: ["Sabana Style", "Traditional Charm", "Social Club"],
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1699720899434-f345aa400543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwcGFya2xhbmQlMjB0cmVlfGVufDF8fHx8MTc1OTE3NjY4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Bogotá Savannah, Colombia",
      established: "1975",
      yardage: "6,345 yards",
      par: "Par 71",
      services: ["Caddy Service", "Cart Rental", "Traditional Restaurant", "Social Events", "Golf Shop"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $70 USD",
      detailedDescription: "A traditional Sabana course that captures the essence of Colombian golf culture. La Sabana offers a friendly atmosphere with classic design elements and strong social traditions.",
      highlights: ["Traditional Sabana golf", "Colombian golf culture", "Strong social atmosphere", "Classic course design"]
    },
    {
      name: "Club de Golf Los Halcones",
      description: "Modern executive course perfect for quick rounds.",
      type: "Executive",
      holes: 18,
      difficulty: "Accessible",
      features: ["Executive Length", "Quick Play", "Practice Focused"],
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1729313666803-818fc18d3b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwdmFsbGV5JTIwcGFub3JhbWljfGVufDF8fHx8MTc1OTE3NjY5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Funza, Colombia (40 min from Bogotá)",
      established: "2005",
      yardage: "5,234 yards",
      par: "Par 65",
      services: ["Caddy Available", "Cart Rental", "Casual Dining", "Driving Range", "Short Game Area"],
      hours: "7:00 AM - 6:00 PM",
      greenFee: "From $45 USD",
      detailedDescription: "An executive-length course ideal for quick rounds and skill development. Los Halcones offers accessible golf in a relaxed setting, perfect for practice or introducing new players to the game.",
      highlights: ["Executive length course", "Quick 3-hour rounds", "Great for skill development", "Accessible for beginners"]
    },
    {
      name: "Club de Golf El Peñón",
      description: "Championship course with lake features and strategic design.",
      type: "Championship",
      holes: 18,
      difficulty: "Professional",
      features: ["Lake Features", "Strategic Design", "Tournament Venue"],
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1634140179730-ea0e6ff5a506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwYnVua2VyJTIwc2FuZHxlbnwxfHx8fDE3NTkxNzY2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Girardot, Colombia (2.5 hours from Bogotá)",
      established: "1993",
      yardage: "7,187 yards",
      par: "Par 72",
      services: ["Professional Caddy", "Premium Cart Fleet", "Clubhouse Dining", "Resort Hotel", "Conference Facilities"],
      hours: "6:00 AM - 6:30 PM",
      greenFee: "From $105 USD",
      detailedDescription: "Located in the warm climate of Girardot, El Peñón offers year-round golf with championship design. The course features dramatic lake holes and strategic bunkering that have hosted national tournaments.",
      highlights: ["Championship tournament venue", "Dramatic lakeside holes", "Warm climate year-round", "Resort hotel on-site"]
    },
    {
      name: "Club de Golf Bacatá",
      description: "Highland course with rolling terrain and mature trees.",
      type: "Highland",
      holes: 18,
      difficulty: "Challenging",
      features: ["Rolling Terrain", "Mature Trees", "Highland Setting"],
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1658526549416-bb6dbfe24c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwd29vZGxhbmQlMjBmb3Jlc3R8ZW58MXx8fHwxNzU5MTc2NjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Zipaquirá, Colombia (50 min from Bogotá)",
      established: "1988",
      yardage: "6,654 yards",
      par: "Par 71",
      services: ["Expert Caddy", "Cart Rental", "Highland Restaurant", "Pro Shop", "Salt Cathedral Tours"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $75 USD",
      detailedDescription: "Nestled in the highlands near the famous Salt Cathedral, Bacatá features rolling terrain and mature tree-lined fairways. The course offers a challenging yet fair test combined with cultural tourism opportunities.",
      highlights: ["Highland setting near Salt Cathedral", "Rolling terrain and mature trees", "Challenging strategic play", "Cultural tourism nearby"]
    },
    {
      name: "Club de Golf La Caro",
      description: "Natural wetland course with environmental focus.",
      type: "Eco-Friendly",
      holes: 18,
      difficulty: "Intermediate",
      features: ["Wetland Setting", "Eco-Friendly", "Wildlife Habitat"],
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1621362922330-60816fedf00f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwaGlnaGxhbmRzJTIwZWxldmF0aW9ufGVufDF8fHx8MTc1OTE3NjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "La Caro, Colombia (1 hour from Bogotá)",
      established: "2003",
      yardage: "6,412 yards",
      par: "Par 72",
      services: ["Caddy Service", "Cart Rental", "Eco Restaurant", "Nature Walks", "Bird Watching"],
      hours: "7:00 AM - 6:00 PM",
      greenFee: "From $65 USD",
      detailedDescription: "Built with environmental sustainability in mind, La Caro integrates golf with natural wetland preservation. The course offers unique wildlife viewing opportunities alongside enjoyable golf.",
      highlights: ["Eco-friendly course design", "Natural wetland preservation", "Wildlife and bird watching", "Environmental education"]
    },
    {
      name: "Club de Golf El Tequendama",
      description: "Historic course near the famous Tequendama Falls.",
      type: "Historic",
      holes: 18,
      difficulty: "Standard",
      features: ["Historic Site", "Waterfall Views", "Tourist Destination"],
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1584120194892-eefa222afb59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwdXBzY2FsZSUyMGV4Y2x1c2l2ZXxlbnwxfHx8fDE3NTkxNzY2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Soacha, Colombia (45 min from Bogotá)",
      established: "1968",
      yardage: "6,289 yards",
      par: "Par 71",
      services: ["Caddy Service", "Cart Rental", "Historic Restaurant", "Falls Viewing", "Tourist Packages"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $70 USD",
      detailedDescription: "Located near Colombia's iconic Tequendama Falls, this historic course combines golf with natural wonder tourism. The layout offers traditional design with spectacular waterfall vistas.",
      highlights: ["Near famous Tequendama Falls", "Historic course since 1968", "Combines golf and tourism", "Spectacular waterfall views"]
    },
    {
      name: "Club de Golf Yerbabuena",
      description: "Countryside course with natural springs and gardens.",
      type: "Countryside",
      holes: 18,
      difficulty: "Intermediate",
      features: ["Natural Springs", "Garden Setting", "Peaceful Atmosphere"],
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1685296982506-91e3e7942a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY2x1YiUyMGx1eHVyeSUyMHJlc29ydHxlbnwxfHx8fDE3NTc1NDkxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Chía, Colombia (40 min from Bogotá)",
      established: "1991",
      yardage: "6,478 yards",
      par: "Par 72",
      services: ["Caddy Service", "Cart Rental", "Garden Restaurant", "Spa Services", "Event Gardens"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $75 USD",
      detailedDescription: "Set among natural springs and botanical gardens, Yerbabuena offers a tranquil golf experience. The course meanders through beautiful landscaping that creates a peaceful, garden-like atmosphere.",
      highlights: ["Natural spring water features", "Botanical garden setting", "Tranquil peaceful atmosphere", "Beautiful landscaping"]
    },
    {
      name: "Club Los Cortijos",
      description: "Links-style course with open fairways and strategic bunkering.",
      type: "Links-Style",
      holes: 18,
      difficulty: "Championship",
      features: ["Links Style", "Open Fairways", "Wind Play"],
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1576538854517-4851c4d392bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwYm9nb3RhJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1NzU0OTEwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Cajicá, Colombia (50 min from Bogotá)",
      established: "2000",
      yardage: "6,923 yards",
      par: "Par 72",
      services: ["Professional Caddy", "Cart Fleet", "Links Clubhouse", "Pro Shop", "Practice Facilities"],
      hours: "6:00 AM - 6:30 PM",
      greenFee: "From $95 USD",
      detailedDescription: "Inspired by Scottish links design, Los Cortijos features open fairways, strategic bunkering, and wind as a key factor. This championship course rewards creative shot-making and strategic thinking.",
      highlights: ["Authentic links-style design", "Strategic bunker placement", "Wind factor in play", "Championship caliber"]
    },
    {
      name: "Club Campestre El Hinche",
      description: "Warm weather retreat with tropical landscape design.",
      type: "Tropical",
      holes: 18,
      difficulty: "Intermediate",
      features: ["Warm Climate", "Tropical Design", "Weekend Retreat"],
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1685880841765-6306f11616ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwcGxheWVyJTIwYWx0aXR1ZGUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NTc1NDkxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Melgar, Colombia (2 hours from Bogotá)",
      established: "1985",
      yardage: "6,123 yards",
      par: "Par 70",
      services: ["Caddy Service", "Cart Rental", "Pool Restaurant", "Resort Lodging", "Swimming Pool"],
      hours: "7:00 AM - 6:00 PM",
      greenFee: "From $55 USD",
      detailedDescription: "A warm climate escape from Bogotá's cool temperatures, El Hinche offers tropical golf in a resort setting. The course provides a relaxing weekend retreat with family-friendly amenities.",
      highlights: ["Warm tropical climate", "Weekend resort destination", "Family-friendly amenities", "Escape from cool Bogotá weather"]
    },
    {
      name: "Club de Golf Tocancipá",
      description: "New generation course with modern amenities and technology.",
      type: "Modern",
      holes: 18,
      difficulty: "Challenging",
      features: ["GPS Carts", "Modern Amenities", "Tech-Enabled"],
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1715761920143-23ec33f378d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwbW91bnRhaW5zJTIwc2NlbmljfGVufDF8fHx8MTc1OTE3NjY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      location: "Tocancipá, Colombia (45 min from Bogotá)",
      established: "2010",
      yardage: "6,834 yards",
      par: "Par 72",
      services: ["GPS-Equipped Carts", "Digital Scorecard", "Modern Clubhouse", "Tech Pro Shop", "Virtual Coaching"],
      hours: "6:00 AM - 6:30 PM",
      greenFee: "From $85 USD",
      detailedDescription: "Representing the new generation of Colombian golf, Tocancipá features modern design with cutting-edge technology. GPS carts, digital scorecards, and virtual coaching enhance the contemporary golf experience.",
      highlights: ["Modern course design", "GPS-equipped carts", "Digital technology integration", "Contemporary golf experience"]
    }
  ];

  const courses =
    activeCourseNames === null
      ? allCourses
      : allCourses.filter((course) => activeCourseNames.includes(course.name));

  useEffect(() => {
    if (selectedCourse !== null && !courses[selectedCourse]) {
      setSelectedCourse(null);
    }
  }, [courses, selectedCourse]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Slider */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden mt-[60px] md:mt-[90px] lg:mt-[100px]">
        {sliderImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={slide.url}
              alt={`${slide.title} golf course in Bogotá`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
        ))}

        {/* Back Button - Top Left */}
        <div className="absolute top-8 left-4 sm:left-8 z-20">
          <TransitionLink to="/">
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/30 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al Inicio
            </Button>
          </TransitionLink>
        </div>

        {/* Slider Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-[42px] sm:text-[52px] md:text-[68px] lg:text-[82px] font-bold mb-4 uppercase tracking-tight">
              {sliderImages[currentSlide].title}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-8 opacity-90">
              {sliderImages[currentSlide].subtitle}
            </p>
            <Button size="lg" onClick={scrollToContact} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Calendar className="w-5 h-5 mr-2" />
              Reserve Now
            </Button>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* All Courses Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 golf-ball-texture relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-block bg-primary/10 rounded-full px-4 py-2 mb-4">
              <span className="text-primary uppercase tracking-wider">Complete Collection</span>
            </div>
            <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] mb-3 sm:mb-4 uppercase font-bold tracking-tight">
              Bogotá's Elite Collection of Championship Courses
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              From historic Scottish-style layouts to modern championship designs, explore every world-class golf experience that Bogotá and its surroundings have to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group border-2 border-transparent hover:border-accent/30">
                <div className="relative h-48 overflow-hidden">
                   <ImageWithFallback
                    src={course.image}
                    alt={`${course.name} - ${course.type} golf course in Bogotá`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/95 text-black backdrop-blur-sm shadow-lg">
                      {course.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{course.name}</span>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{course.holes} holes</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      <span>{course.difficulty}</span>
                    </div>
                    <Button size="sm" onClick={() => setSelectedCourse(index)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 golf-ball-texture opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Trophy className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-[32px] sm:text-[42px] md:text-[52px] font-bold text-white mb-6 uppercase">
            Ready to Experience Bogotá Golf?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let us create your perfect golf experience. From course selection to accommodations, dining, and transportation — we handle everything so you can focus on your game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={scrollToContact}>
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Golf Tour
            </Button>
            <Button size="lg" variant="secondary" onClick={scrollToContact}>
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <BookingForm />
      
      {/* Footer */}
      <Footer />

      {/* Course Details Modal */}
      <Dialog open={selectedCourse !== null} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          {selectedCourse !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl mb-2 sm:mb-4">{courses[selectedCourse].name}</DialogTitle>
                <DialogDescription className="text-sm">
                  Detailed information about {courses[selectedCourse].name} - {courses[selectedCourse].type} golf course in {courses[selectedCourse].location}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Course Image */}
                <div className="relative h-48 sm:h-64 w-full rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={courses[selectedCourse].image}
                    alt={courses[selectedCourse].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <Badge variant="secondary" className="bg-white/90 text-black text-xs sm:text-sm">
                      {courses[selectedCourse].type}
                    </Badge>
                  </div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{courses[selectedCourse].rating}</span>
                  </div>
                </div>

                {/* Course Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Course Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{courses[selectedCourse].location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-muted-foreground" />
                          <span>{courses[selectedCourse].difficulty} • {courses[selectedCourse].par}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Established {courses[selectedCourse].established}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{courses[selectedCourse].hours}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>{courses[selectedCourse].greenFee}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Course Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {courses[selectedCourse].features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Services */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Available Services</h4>
                      <ul className="space-y-1 text-sm">
                        {courses[selectedCourse].services.map((service, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <h4 className="font-semibold mb-2">About This Course</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {courses[selectedCourse].detailedDescription}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-semibold mb-3">Course Highlights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {courses[selectedCourse].highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <ArrowRight className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-lg border">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold">Ready to Experience {courses[selectedCourse].name}?</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Join our exclusive weekend golf packages and discover why Bogotá is becoming South America's premier golf destination.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto" onClick={scrollToContact}>
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="text-sm sm:text-base">Weekend Package</span>
                      </Button>
                      <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={scrollToContact}>
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="text-sm sm:text-base">Custom Tour</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Packages include: Accommodation • Transportation • Professional Caddy • Course Access • Gourmet Dining
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
