"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Utensils,
  Music,
  Coffee, // Changed from Wine to Coffee as primary icon for Greens & Beans
  Wine,
  Building,
  Camera,
  Plane,
  X
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Slider from "react-slick";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area"; // Assuming ScrollArea exists or use div with overflow

// Import images for Fine Dining Experiences
import diningImg1 from "figma:asset/5c8da72ace137a2a372eb642de1ebc53af73c5b0.png";
import diningImg2 from "figma:asset/81794b213008840f75fc91ad21d00a769640af4e.png";
import diningImg3 from "figma:asset/18369b9eb8263a007fdb00d1780abdc14d288846.png";

// Import images for Vibrant Nightlife
import nightlifeImg1 from "figma:asset/56f3b990b1dfe851f9e4cd6f269ee12e468d2c1a.png";
import nightlifeImg2 from "figma:asset/5497a618c6be871c3c5adf28f54788bb2dc24c6f.png";
import nightlifeImg3 from "figma:asset/42b58b81ac2296c61fc07627b0ba95f498b5dc75.png";

// Import images for Historic City Tours
import historicImg1 from "figma:asset/11bae5b985c6a334f053445f9d751dc37f7dcaa6.png";
import historicImg2 from "figma:asset/75f64ddddfb01fd4d690737a301dc5f15e9da354.png";

interface Experience {
  icon: any;
  title: string;
  description: string;
  features: string[];
  image: any;
  images?: any[];
  category: string;
  detailedContent?: React.ReactNode;
}

export function Experiences() {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  // Inject Slick Carousel CSS via CDN to avoid build errors with fonts/images
  useEffect(() => {
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

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dotsClass: "slick-dots !bottom-2", // Customizing dots position
  };

  const experiences: Experience[] = [
    {
      icon: Utensils,
      title: "Fine Dining Experiences",
      description:
        "Dine at world-renowned restaurants featuring Colombian and international cuisine.",
      features: [
        "Michelin-level restaurants",
        "Local Colombian specialties",
        "Private chef experiences",
      ],
      image: diningImg3, // Default cover
      images: [diningImg3, diningImg1, diningImg2], // Gallery
      category: "Gastronomy",
    },
    {
      icon: Music,
      title: "Vibrant Nightlife",
      description:
        "Experience Bogotá's legendary nightlife at iconic venues.",
      features: [
        "Andrés Carne de Res",
        "Gaira rooftop experiences",
        "Live music venues",
      ],
      image: nightlifeImg1, // Default cover
      images: [nightlifeImg1, nightlifeImg3, nightlifeImg2], // Gallery
      category: "Entertainment",
    },
    {
      icon: Coffee,
      title: "Bogotá Greens & Beans",
      description:
        "The ultimate altitude experience: Golf for you, a sensory coffee & wine adventure for your family.",
      features: [
        "Specialty Coffee at 2600m",
        "Altitude Vineyards",
        "Parallel Family Itineraries",
      ],
      image: "https://images.unsplash.com/photo-1760022881497-fa4d401f0920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBjb2ZmZWUlMjBmYXJtJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MTI2NjkxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1760022881497-fa4d401f0920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBjb2ZmZWUlMjBmYXJtJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MTI2NjkxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1738474429346-3fbef4ab70dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsdHklMjBjb2ZmZWUlMjB0YXN0aW5nJTIwYm9nb3RhfGVufDF8fHx8MTc3MTI2NjkxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1764709124945-56ba2ae2c496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwdGFzdGluZyUyMGdsYXNzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzEyNjY5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      ],
      category: "Culture",
      detailedContent: (
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-serif text-primary mb-4">The Ultimate Altitude Experience</h3>
            <p className="text-muted-foreground leading-relaxed">
              In Bogotá, excellence is found above 2,600 meters. We have designed a world-class journey where the precision of the perfect swing meets the soul of the perfect cup. 
              While you dominate some of South America's most exclusive and challenging golf courses, your companions will immerse themselves in the <strong>Mountain Coffee Tour</strong>, discovering the secrets of specialty coffee from expert producers. To end the day, everyone gathers at sunset for an <strong>Altitude Wine Tasting</strong>, savoring the hidden gems of Colombian mountain vineyards.
            </p>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
            <h4 className="text-lg font-bold text-primary mb-3 flex items-center">
              <Utensils className="w-5 h-5 mr-2" />
              The Golf & Coffee Connection
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>The Altitude Narrative:</strong> Just as playing at 2,600 meters makes the ball fly further—a golfer's dream—that same altitude makes coffee beans denser and more complex.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                <span><strong>Excellence:</strong> In both golf and specialty coffee, the difference between good and extraordinary lies in technical details and precision.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                <span><strong>Focus:</strong> High-quality coffee is a known ally for mental performance and energy.</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                <span><strong>Patience:</strong> Like a good swing, specialty coffee rejects haste. Artisanal preparation mimics the strategic patience needed on the course.</span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xl font-serif text-primary border-b border-primary/20 pb-2">
                Option 1: The Valley of Contrasts
              </h4>
              <p className="text-sm text-muted-foreground italic mb-4">
                South-West Route | Ideal for warmer climates and relaxed play.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Day 1: Funza & Tradition</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Golfer:</span> San Andrés Golf Club (Tradition)</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Family:</span> Colonial Mansions Tour & Wellness</div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Day 2: Mosquera & Coffee</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Golfer:</span> Serrezuela Country Club (Technical)</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Family:</span> Hacienda Coloma Coffee Tour (Seed to Cup)</div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Day 3: Girardot & Relax</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Golfer:</span> El Peñón (Hot Climate Precision)</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Family:</span> Pool, Sun & Rosé Wine Tasting</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-serif text-primary border-b border-primary/20 pb-2">
                Option 2: Savanna & Altitude Vineyards
              </h4>
              <p className="text-sm text-muted-foreground italic mb-4">
                North Route | High performance courses & cold climate sophistication.
              </p>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Day 1: Chía & New Wave</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Golfer:</span> Guaymaral or Country Club (Tournament Level)</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Family:</span> Boutique Coffee Tour in Cota</div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Day 2: Briceño & Pairing</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Golfer:</span> Briceño 18 (Long Drive)</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Family:</span> Salt Cathedral & Gourmet Coffee Lunch</div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Day 3: Villa de Leyva</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Golfer:</span> Club Campestre El Rincón</div>
                  <div className="text-sm"><span className="font-medium text-gray-900">Family:</span> Vineyard Experience & Barrel Walking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Building,
      title: "Historic City Tours",
      description:
        "Explore Bogotá's rich history and colonial architecture.",
      features: [
        "La Candelaria district",
        "Gold Museum visits",
        "Cultural landmarks",
      ],
      image: historicImg1,
      images: [
        historicImg1, // La Candelaria Night (Provided asset)
        historicImg2, // Gold Museum (Provided asset)
        "https://images.unsplash.com/photo-1731560816331-bdbb9f61323a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQbGF6YSUyMGRlJTIwQm9saXZhciUyMEJvZ290YSUyMGNhdGhlZHJhbCUyMGRheXxlbnwxfHx8fDE3NzEyNjc0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" // Plaza Bolivar Cathedral
      ],
      category: "Culture",
    },
    {
      icon: Camera,
      title: "Photography Tours",
      description:
        "Capture stunning landscapes and vibrant street life with professional guides.",
      features: [
        "Professional photographers",
        "Drone photography",
        "Exclusive locations",
      ],
      image: "https://images.unsplash.com/photo-1621944860377-8cfda325a59e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDZXJyb3MlMjBPcmllbnRhbGVzJTIwQm9nb3RhJTIwbW91bnRhaW5zfGVufDF8fHx8MTc3MTI2NjkxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1621944860377-8cfda325a59e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDZXJyb3MlMjBPcmllbnRhbGVzJTIwQm9nb3RhJTIwbW91bnRhaW5zfGVufDF8fHx8MTc3MTI2NjkxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1693157689184-1b6855ddf856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwcGFyYW1vJTIwY29sb21iaWF8ZW58MXx8fHwxNzcxMjY2OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1642964408711-a6a0ba8ef215?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBodW1taW5nYmlyZCUyMGJpb2RpdmVyc2l0eXxlbnwxfHx8fDE3NzEyNjY5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      ],
      category: "Adventure",
    },
    {
      icon: Plane,
      title: "Day Trips & Excursions",
      description:
        "Explore nearby attractions and natural wonders beyond Bogotá.",
      features: [
        "Salt Cathedral",
        "Guatavita Lake",
        "Hot springs",
      ],
      image:
        "https://images.unsplash.com/photo-1537438608674-310b2f9bfce8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWx0JTIwQ2F0aGVkcmFsJTIwWmlwYXF1aXJhJTIwaW50ZXJpb3IlMjBjcm9zc3xlbnwxfHx8fDE3NzEyNjczOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1537438608674-310b2f9bfce8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWx0JTIwQ2F0aGVkcmFsJTIwWmlwYXF1aXJhJTIwaW50ZXJpb3IlMjBjcm9zc3xlbnwxfHx8fDE3NzEyNjczOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", // Salt Cathedral
        "https://images.unsplash.com/photo-1707073686909-30606cb383d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWd1bmElMjBHdWF0YXZpdGElMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxMjY3NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", // Laguna Guatavita
        "https://images.unsplash.com/photo-1639910310293-4b03ccac91cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJxdWUlMjBKYWltZSUyMER1cXVlJTIwQ29sb21iaWF8ZW58MXx8fHwxNzcxMjY3NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" // Parque Jaime Duque
      ],
      category: "Adventure",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Gastronomy":
        return "bg-orange-100 text-orange-800";
      case "Entertainment":
        return "bg-purple-100 text-purple-800";
      case "Culture":
        return "bg-blue-100 text-blue-800";
      case "Adventure":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section id="experiences" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 golf-ball-texture relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] font-bold mb-4 uppercase tracking-tight">
            Beyond Golf: Complete Bogotá Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Golf by day, live Bogotá by night. Our curated
            experiences showcase the best of Colombian culture,
            cuisine, and entertainment to complement your golf
            adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience, index) => {
            const IconComponent = experience.icon;
            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full"
              >
                <div className="relative h-48 shrink-0">
                  {/* Badge & Icon - Rendered outside conditional to ensure they appear on top */}
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-primary/90 text-white border-none">
                      {experience.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-lg border border-primary/10 z-20">
                    <IconComponent className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>

                  {experience.images ? (
                    <div className="h-full slick-container-fix">
                      <Slider {...sliderSettings} className="h-full">
                        {experience.images.map((img, i) => (
                          <div key={i} className="h-48 focus:outline-none">
                            <ImageWithFallback
                              src={img}
                              alt={`${experience.title} Bogotá - ${i + 1} - Premium Golf Experience`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    <ImageWithFallback
                      src={experience.image}
                      alt={`${experience.title} in Bogotá - Curated Golf Experience`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                <CardHeader>
                  <CardTitle>{experience.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {experience.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {experience.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-auto" 
                    onClick={() => {
                      if (experience.detailedContent) {
                        setSelectedExperience(experience);
                      } else {
                        scrollToContact();
                      }
                    }}
                  >
                    {experience.detailedContent ? "View Details" : "Plan Experience"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Custom Experience Packages
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Every experience is tailored to your group's
              interests. Whether you're celebrating a special
              occasion or looking for adventure, we create
              personalized itineraries that go beyond golf.
            </p>
            <Button size="lg" variant="secondary" onClick={scrollToContact}>
              Plan Custom Experience
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={selectedExperience !== null} onOpenChange={(open) => !open && setSelectedExperience(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {selectedExperience && (
            <div className="flex flex-col">
              <div className="relative h-64 sm:h-80 w-full shrink-0">
                 <ImageWithFallback
                    src={selectedExperience.images ? selectedExperience.images[0] : selectedExperience.image}
                    alt={selectedExperience.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <Badge className="bg-white/20 text-white border-none w-fit mb-2 backdrop-blur-sm">
                      {selectedExperience.category}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{selectedExperience.title}</h2>
                  </div>
              </div>
              <div className="p-6 sm:p-8">
                {selectedExperience.detailedContent}
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                   <Button size="lg" onClick={() => {
                     setSelectedExperience(null);
                     setTimeout(scrollToContact, 100);
                   }}>
                     Book This Experience
                   </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}