"use client";

import { Mountain, TrendingUp, Users, Utensils, DollarSign, Hotel, Target } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "15% More Distance",
      description: "Play at 2,640m (8,660 ft) and experience the altitude advantage — longer drives, smoother ball flight.",
      color: "text-[#2d5a2d]"
    },
    {
      icon: Mountain,
      title: "Walkable Courses",
      description: "Most courses are walking-friendly, offering a healthy and immersive golf experience.",
      color: "text-[#4a6741]"
    },
    {
      icon: Users,
      title: "Professional Caddies & Coaches",
      description: "Play alongside expert local caddies trained as coaches. They know every fairway, every green — and help you improve your game.",
      color: "text-[#7ba05b]"
    },
    {
      icon: Utensils,
      title: "Complete Lifestyle Experience",
      description: "Golf by day, live Bogotá by night. Dine at world-renowned restaurants, explore vibrant nightlife at Andrés Carne de Res, Gaira, or top rooftops.",
      color: "text-[#8b4513]"
    },
    {
      icon: DollarSign,
      title: "Dollar Advantage",
      description: "Enjoy luxury golf at a fraction of the price thanks to favorable exchange rates.",
      color: "text-[#d4af37]"
    },
    {
      icon: Hotel,
      title: "Premium Hotels",
      description: "Stay at 5-star chains, boutique lodges or countryside retreats tailored for golf travelers.",
      color: "text-[#6b5438]"
    },
    {
      icon: Target,
      title: "Golf Clinics Available",
      description: "Improve your game with local certified pros in custom clinics for individuals or groups.",
      color: "text-[#5a7a3d]"
    }
  ];

  return (
    <section id="benefits" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 golf-ball-texture relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent/80 rounded-full flex items-center justify-center shadow-lg relative">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
              </div>
              {/* Orbiting Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>
          <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] mb-3 sm:mb-4 font-bold tracking-tight uppercase">
            Why Choose Bogotá for Your Golf Experience?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Looking for a unique destination for your golf group? Bogotá combines the challenge of high-altitude golf with the richness of South American culture, gastronomy and nightlife.
          </p>
          <p className="text-base sm:text-lg font-medium mt-3 sm:mt-4 text-primary">
            Come for the game, stay for the experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group border border-primary/10 hover:border-accent/30 bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 bg-primary/5 p-3 rounded-lg group-hover:bg-accent/10 transition-all duration-300">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base group-hover:text-accent transition-colors">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                  {/* Bottom accent line */}
                  <div className="mt-4 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}