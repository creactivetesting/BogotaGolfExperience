"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, Users, Star, CheckCircle, MapPin, Utensils, Car, Trophy, Info } from "lucide-react";
import { BookingModal } from "./BookingModal";
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgxSmartPackImage from "@/assets/optimized/bogota-golf-hero.webp";
import bgxElitePackImage from "@/assets/optimized/bogota-golf-group-celebration.webp";

type PublicPlan = {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  createdAt: string;
};

export function GolfPlans() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [plans, setPlans] = useState<PublicPlan[]>([]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookClick = (plan: any) => {
    setSelectedPlan(plan);
    setIsBookingModalOpen(true);
  };

  useEffect(() => {
    async function loadPlans() {
      const response = await fetch('/api/public/plans', { cache: 'no-store' });
      const data = await response.json();
      setPlans(data);
    }

    void loadPlans();
  }, []);

  const mappedPlans = plans.map((plan, index) => ({
    ...plan,
    subtitle: index === 0 ? '3 Golf Rounds' : '4 Golf Rounds',
    duration: index === 0 ? '4 Days / 3 Nights' : '5 Days / 4 Nights',
    price: `$${plan.basePrice.toLocaleString('en-US')}`,
    description: plan.description,
    popular: index === 0,
    popularLabel: index === 0 ? 'Smart Value' : 'Premium',
    image: index === 0 ? bgxSmartPackImage : bgxElitePackImage,
    idealFor: index === 0
      ? 'Buddy groups looking for authentic golf + culture in Bogotá.'
      : 'Golf travelers who want more holes, more stories, and a deeper connection to the city.',
    courses: index === 0 ? ['2 Standard Golf Club', '1 Private Club'] : ['2 Standard Golf Club', '2 Private Club'],
    includes: index === 0 ? [
      '3 Golf Rounds',
      '4 nights in 4-star centrally located hotel',
      'Daily breakfast included',
      'Private transportation throughout your stay',
      'Professional caddies-coaches at every round',
      'Dedicated golf-loving host accompanying your group throughout the journey',
      'Premium golf-ready welcome gift',
      'Curated Bogotá nightlife and gastronomy concierge support'
    ] : [
      '4 Golf Rounds',
      '5 nights in 4-star centrally located hotel',
      'Daily breakfast included',
      'Private transportation throughout your stay',
      'Professional caddies-coaches at every round',
      'Dedicated golf-loving host accompanying your group throughout the journey',
      'Premium golf-ready welcome gift',
      'Curated Bogotá nightlife and gastronomy concierge support'
    ],
  }));

  return (
    <section id="plans" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 golf-ball-texture relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <Badge variant="outline" className="mb-4 bg-accent/10 text-accent-foreground border-accent/30 shadow-lg">
            <Trophy className="w-3 h-3 mr-1 inline" />
            Bogotá Golf Experience
          </Badge>
          <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] mb-3 sm:mb-4 uppercase font-bold tracking-tight">
            Smart Value Foursome Packages
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            High-value golf getaways crafted for groups of 4 golf lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {mappedPlans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl group flex flex-col ${
              plan.popular ? 'ring-2 ring-accent shadow-2xl lg:scale-105 border-accent/30' : 'hover:scale-102 hover:-translate-y-2 border-2 hover:border-accent/20'
            }`}>
              {plan.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    {plan.popularLabel}
                  </Badge>
                </div>
              )}
              
              <div className="relative h-48 sm:h-56 bg-primary overflow-hidden shrink-0">
                <ImageWithFallback
                  src={plan.image}
                  alt={`${plan.name} - ${plan.subtitle} Bogotá Golf Package`}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="relative z-10 p-6 text-white h-full flex flex-col justify-end">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{plan.duration}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 shadow-black/50 drop-shadow-sm">{plan.name}</h3>
                  <p className="text-sm opacity-90 font-medium text-accent-foreground/90">{plan.subtitle}</p>
                </div>
              </div>

              <CardContent className="p-6 flex flex-col flex-grow">
                {/* Price */}
                <div className="mb-6 flex items-baseline justify-between border-b border-border/50 pb-4">
                  <div>
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-2">per person</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right max-w-[120px]">
                    <span className="whitespace-nowrap">based on a group of 4</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Golf Courses */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center text-sm uppercase tracking-wider text-primary">
                    <Trophy className="w-4 h-4 mr-2" />
                    Included Rounds
                  </h4>
                  <div className="space-y-2">
                    {plan.courses.map((course, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                        <span className="font-medium">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Includes */}
                <div className="mb-6 flex-grow">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary">Package Includes</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {plan.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary/70 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Ideal For */}
                 <div className="mb-6 bg-accent/5 p-3 rounded-md border border-accent/10">
                   <h4 className="font-semibold mb-1 flex items-center text-xs uppercase tracking-wider text-accent-foreground">
                    <Info className="w-3 h-3 mr-1.5" />
                    Ideal For
                  </h4>
                   <p className="text-xs text-muted-foreground italic">
                     "{plan.idealFor}"
                   </p>
                 </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                    onClick={() => handleBookClick(plan)}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Book for Group of 4
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/20 hover:bg-primary/5"
                    onClick={scrollToContact}
                  >
                    Customize This Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-primary/10 shadow-sm">
            <h3 className="text-xl mb-4">Why Choose BGX Golf Experiences?</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h4 className="font-semibold mb-1">Altitude Advantage</h4>
                <p className="text-sm text-muted-foreground">15% more distance at 2,640m</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-all duration-300">
                  <Users className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h4 className="font-semibold mb-1">Expert Caddies</h4>
                <p className="text-sm text-muted-foreground">Professional bilingual service</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-all duration-300">
                  <Utensils className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h4 className="font-semibold mb-1">Culinary Experiences</h4>
                <p className="text-sm text-muted-foreground">World-class Colombian cuisine</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-all duration-300">
                  <Car className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h4 className="font-semibold mb-1">Full Service</h4>
                <p className="text-sm text-muted-foreground">Complete travel arrangements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        plan={selectedPlan} 
      />
    </section>
  );
}
