"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Star, MapPin, Trophy, Users, Clock, DollarSign, Phone, Calendar, ArrowRight, MessageCircle } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TransitionLink } from './TransitionLink';
import cimaImg1 from "figma:asset/7606b91ce498e9d4411893eb6b68e9b7ac627053.png";
import cimaImg2 from "figma:asset/7f37f2eda29f8f59f5e48e3fed7ddcf2f7444c9b.png";
import cimaImg3 from "figma:asset/3868732a2e1f2d8584c2475e586877eb97609cae.png";
import cimaImg4 from "figma:asset/4e9c95d195f5c102d38f8fb152bd70f7fe2a79ad.png";
import cimaImg5 from "figma:asset/52b70009c6f9e94378971dfef75fc1c062d502b3.png";
import bricenoImg1 from "figma:asset/6297722cae87afe369c8c7559e2586739ddb607b.png";
import bricenoImg2 from "figma:asset/d23315d489b514923f0db82141b77026b2d9dd13.png";
import bricenoImg3 from "figma:asset/901799daa14635539456b12e94c9263a687f32bf.png";
import bricenoImg4 from "figma:asset/03f220262d8d82633cca73265f4d77c5810249d9.png";
import bricenoImg5 from "figma:asset/439c4ffd8d1ae3fb2f09edc8d17e31776e1d989d.png";
import bricenoImg6 from "figma:asset/fa4ac469577b001111a14fda03d64b05bbdd00bf.png";
import serrezuelaImg1 from "figma:asset/54b808267cc292c3c58064b2c31f1cdbc796c49b.png";
import serrezuelaImg2 from "figma:asset/89b33fe4e05d80201202baa295e2f367cd036099.png";
import serrezuelaImg3 from "figma:asset/912f52e7d5d745685422f7222c0beca775c7c9d6.png";
import serrezuelaImg4 from "figma:asset/ca62348b56acc99978f86d6fe2fc88f06c6c2827.png";
import serrezuelaImgNew1 from "figma:asset/2833575903da44f946f827ea6c1c875780356804.png";
import serrezuelaImgNew2 from "figma:asset/95188679790d5bc3fe0d4f749baa9fe9906ac03d.png";
import serrezuelaImgNew3 from "figma:asset/f9ca301a3fe73766d7b12d39b00ba5c8fb7551fd.png";
import sanAndresImg1 from "figma:asset/81f7f0aa2eb904be9b42923b01b72b1f625441a0.png";
import sanAndresImg2 from "figma:asset/880f8c684b4cf48277913674f6c0fbfc3ffa26d6.png";
import sanAndresImg3 from "figma:asset/bdf80711829177fa7b290b65ad8111f4490b7afc.png";
import countryClubImg1 from "figma:asset/a65f794f99f69e82e608de5ff70f386ecf8dafb2.png";
import countryClubImg2 from "figma:asset/bf10fcb6d4e51068e99bad15dfe9e86214b3c472.png";
import countryClubImg3 from "figma:asset/83937e519636cf8b6559434e89a471a7f7405242.png";
import lagartosImg1 from "figma:asset/a2f77a535930dd3789f4b68505cefef43829d52d.png";
import lagartosImg2 from "figma:asset/ebeac9f4b35c4b9993bddeaba822bf24de4b9449.png";
import lagartosImg3 from "figma:asset/ceb7903636a8a14ccb1e6855d631683cfbbddd64.png";

type PublicCourse = {
  id: string;
  name: string;
  isAvailable: boolean;
  createdAt: string;
};

export function GolfCourses() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [courses, setCourses] = useState<PublicCourse[]>([]);

  const handleWhatsAppClick = (courseName: string) => {
    const message = `Hello, I'm interested in booking a golf round at ${courseName} and have some questions.`;
    const url = `https://wa.me/573176392251?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleBookClick = (course: any) => {
    // Close the details modal
    setSelectedCourse(null);
    
    // Scroll to the plans section
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function loadCourses() {
      const response = await fetch('/api/public/courses');
      const data = await response.json();
      setCourses(data);
    }

    void loadCourses();
  }, []);

  const courseCards = [
    {
      name: "Club La Cima",
      description: "A 'rough gem' at 3,000m altitude. Physical, technical, and offering unique views of the San Rafael Reservoir.",
      type: "Mountain / Hilly",
      holes: 18,
      difficulty: "Very Challenging",
      features: ["Extremely High Altitude", "San Rafael Reservoir Views", "Technical Lies"],
      rating: 4.8,
      image: cimaImg1,
      images: [cimaImg1, cimaImg2, cimaImg3, cimaImg4, cimaImg5],
      location: "La Calera, Cerros Orientales",
      established: "1990s",
      yardage: "6,089 yards",
      par: "Par 70",
      services: ["Mountain Caddy (Essential)", "Driving Range", "Clubhouse Restaurant", "Locker Rooms"],
      hours: "6:00 AM - 6:00 PM",
      greenFee: "From $90 USD",
      detailedDescription: "Designed by Boris Sokoloff, La Cima is one of the highest courses in the world (~3,000m). It is a physical and strategic test featuring narrow fairways, dense Kikuyu rough, and constant 'sidehill lies'. The thin air adds ~15% distance to shots but reduces spin. Weather ranges from 5-17°C with wind and fog factors.",
      highlights: ["3,000m Altitude (15% more distance)", "Views of San Rafael Reservoir", "Signature Uphill 18th Hole", "Technical uneven lies"]
    },
    {
      name: "Briceño 18",
      description: "A modern PGA-standard course. One of the longest in Colombia (7,400 yards) with a challenging links-style layout.",
      type: "Modern Links",
      holes: 18,
      difficulty: "Professional (Slope 135)",
      features: ["PGA Standard", "Long Distance", "Water Hazards", "Elite Practice Area"],
      rating: 4.9,
      image: bricenoImg1,
      images: [bricenoImg1, bricenoImg2, bricenoImg3, bricenoImg4, bricenoImg5, bricenoImg6],
      location: "Sopó, Colombia (Km 19 via Bogotá)",
      established: "2017",
      yardage: "7,400 yards",
      par: "Par 72",
      services: ["300y+ Driving Range", "Short Game Area", "Santa Costilla Restaurant", "Pro Shop", "Event Spaces"],
      hours: "6:00 AM - 6:30 PM",
      greenFee: "From $110 USD",
      detailedDescription: "Opened in 2017, Briceño 18 is the benchmark for modern golf in Colombia. Designed with international standards to host professional tour events, it features a 'Modern Links' style adapted to the Savannah topography. It is one of the country's longest courses, with 18 holes protected by extensive artificial lakes and strategic bunkering. The drainage engineering ensures perfect playability year-round.",
      highlights: ["Hole 13: Signature Par 3 with water", "Hole 18: Epic 600+ yard Par 5", "Best Driving Range in Bogotá (>300y)", "Hole 5: Risk/Reward Par 5 surrounded by water"]
    },
    {
      name: "Serrezuela Country Club",
      description: "A challenging forest course known for its mature trees and tight fairways on the Bogotá Savannah.",
      type: "Forest / Parkland",
      holes: 18,
      difficulty: "Challenging",
      features: ["Mature Forest", "Tight Fairways", "Strategic Bunkers", "Flat Terrain"],
      rating: 4.6,
      image: serrezuelaImgNew1,
      images: [serrezuelaImgNew1, serrezuelaImgNew2, serrezuelaImgNew3, serrezuelaImg1, serrezuelaImg2, serrezuelaImg3, serrezuelaImg4],
      location: "Madrid/Mosquera, Colombia (45 min from Bogotá)",
      established: "1946",
      yardage: "6,678 yards",
      par: "Par 71",
      services: ["Professional Caddy", "Driving Range", "Restaurant", "Tennis Courts", "Event Facilities"],
      hours: "6:30 AM - 6:00 PM",
      greenFee: "From $80 USD",
      detailedDescription: "Serrezuela Country Club offers a distinct 'forest in the savannah' experience. The course is famous for its narrow fairways lined by towering eucalyptus and pine trees, requiring precision over power. The flat terrain makes it pleasant to walk, but the strategic placement of bunkers and the imposing trees demand accurate ball striking.",
      highlights: ["Signature forest layout with mature trees", "Precision-demanding narrow fairways", "Walkable flat terrain", "Strategic bunkering and green complexes"]
    },
    {
      name: "San Andrés Golf Club",
      description: "A legacy of tradition and excellence. 18-hole championship course designed by Thompson & Jones with a classic Scottish style.",
      type: "Classic / British",
      holes: 18,
      difficulty: "Championship",
      features: ["Historic 1945 Design", "7,000+ Trees", "Luxury Glamping", "Scottish Style"],
      rating: 4.8,
      image: sanAndresImg1,
      images: [sanAndresImg1, sanAndresImg2, sanAndresImg3],
      location: "Funza, Cundinamarca (50 min from Bogotá)",
      established: "1945",
      yardage: "7,145 yards",
      par: "Par 72",
      services: ["Eco Chalets (Glamping)", "Short Course (9 Holes)", "Tudor Clubhouse", "Eco Fitness Gym", "Tennis Courts"],
      hours: "6:00 AM - 6:00 PM",
      greenFee: "From $85 USD",
      detailedDescription: "San Andrés Golf Club is a jewel of classic design located in Funza. Founded in 1945 on the Hacienda El Rodeo, it features a Scottish-style layout designed by Stanley Thompson and Robert Trent Jones. The course is renowned for its 7,000+ trees, small greens protected by deep bunkers, and its iconic Tudor-style clubhouse. Recently modernized ('El Nuevo San Andrés'), it now offers luxury glamping and state-of-the-art sports facilities while acting as an ecological lung for the Savannah.",
      highlights: ["Designed by Thompson & Jones (1945)", "Unique Luxury Glamping on-site", "Classic Tudor Clubhouse (1946)", "Ecological 'Lung' with 7,000+ trees"]
    },
    {
      name: "Country Club de Bogotá",
      description: "The 'Cradle of Golf' in Colombia. Home to the Astara Golf Championship (Korn Ferry Tour).",
      type: "Elite / Championship",
      holes: 36,
      difficulty: "Tour Professional",
      features: ["PGA/Korn Ferry Host", "Two 18-hole Courses", "Old British Parkland", "Bent Grass Greens"],
      rating: 4.9,
      image: countryClubImg2,
      images: [countryClubImg2, countryClubImg1, countryClubImg3],
      location: "Bogotá, Colombia (Calle 129)",
      established: "1917",
      yardage: "7,237 yards (Fundadores)",
      par: "Par 72",
      services: ["Championship Courses", "Automated Irrigation", "Gourmet Dining", "Tennis Courts", "Elite Practice Areas"],
      hours: "6:00 AM - 6:30 PM",
      greenFee: "From $150 USD",
      detailedDescription: "Founded in 1917, the Country Club de Bogotá is the most prestigious golf venue in the country. It features two courses: 'Fundadores' (Championship) and 'Pacos y Fabios' (Technical). 'Fundadores', designed by John Van Kleek (1946), is a classic 'Old British Parkland' layout with Bent Grass surfaces, fast elevated greens, and mature trees that penalize offline shots. It hosts the Astara Golf Championship, a key stop on the Korn Ferry Tour.",
      highlights: ["Home of Astara Golf Championship (Korn Ferry Tour)", "Fundadores Course: 7,237y Championship test", "Pacos y Fabios: Technical precision course", "Historic 1917 Institution"]
    },
    {
      name: "Club Los Lagartos",
      description: "An urban oasis featuring the 'David Gutiérrez' course, known as the 'Colombian Augusta' designed by Scott Miller.",
      type: "Urban Resort / 36 Holes",
      holes: 36,
      difficulty: "Championship / Varied",
      features: ["Two 18-hole Courses", "Scott Miller Design", "The 'Colombian Augusta'", "Massive Central Lake"],
      rating: 4.8,
      image: lagartosImg2,
      images: [lagartosImg2, lagartosImg1, lagartosImg3],
      location: "Bogotá, Colombia (Calle 116)",
      established: "1937",
      yardage: "7,127 yards (David Gutiérrez)",
      par: "Par 71",
      services: ["36 Holes (David Gutiérrez & Corea)", "Scottish Style Clubhouse", "Resort Amenities", "Swimming Pool", "Event Facilities"],
      hours: "6:00 AM - 6:00 PM",
      greenFee: "From $100 USD",
      detailedDescription: "Founded in 1937, Los Lagartos is a massive urban green lung with two distinct 18-hole courses. The championship 'David Gutiérrez' course was completely rebuilt in 2012 by Scott Miller (who worked with Jack Nicklaus) to create the 'Colombian Augusta'. It features fast Poa Annua greens, dense Kikuyu fairways, and a massive central lake that comes into play on half the holes. The 18th is a signature Risk/Reward Par 5 over water. The second course, 'Corea', offers technical greens and scenic views of the eastern hills.",
      highlights: ["'David Gutiérrez' Course: The 'Colombian Augusta'", "Redesigned by Scott Miller (2012)", "Signature Hole 18: Risk/Reward Par 5 over water", "Historic Clubhouse (Scottish Parkland style)"]
    }
  ];

  const availableCourses = courses.length > 0 ? courseCards.filter((course) => courses.some((dbCourse) => dbCourse.name === course.name && dbCourse.isAvailable)) : courseCards;

  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 golf-ball-texture relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-block bg-primary/10 rounded-full px-4 py-2 mb-4">
            <span className="text-primary uppercase tracking-wider">Our Courses</span>
          </div>
          <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] mb-3 sm:mb-4 uppercase font-bold tracking-tight">
            Discover 20+ Championship Golf Courses in Bogotá
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Bogotá and its surrounding plateau offer access to more than 20 unique golf courses, from traditional clubs to scenic mountain fairways.
          </p>
        </div>

        <div className="flex md:grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {availableCourses.map((course, index) => (
            <div key={index} className="min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-center md:snap-align-none h-full">
              <Card className="h-full overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group border-2 border-transparent hover:border-accent/30">
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
                      <span className="text-sm whitespace-nowrap">{course.holes} holes</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground mb-4 line-clamp-3 md:line-clamp-none flex-grow">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {course.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{course.features.length - 3}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      <span className="truncate max-w-[100px] sm:max-w-none">{course.difficulty}</span>
                    </div>
                    <Button size="sm" onClick={() => { setSelectedCourse(index); setCurrentImageIndex(0); }} className="shrink-0">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-6">
            These are just 6 of our featured courses. Discover over 20 world-class golf experiences across Bogotá and its stunning surroundings.
          </p>
          <TransitionLink to="/courses">
            <Button size="lg" className="group shadow-lg hover:shadow-2xl">
              <Trophy className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Discover More - All Courses
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </TransitionLink>
        </div>
      </div>

      {/* Course Details Modal */}
      <Dialog open={selectedCourse !== null} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl w-[100vw] h-[100dvh] sm:h-auto sm:max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col rounded-none sm:rounded-lg">
          {selectedCourse !== null && (
            <>
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 sm:pb-6">
                {/* Mobile Full Width Image / Desktop Normal Image */}
                <div className="relative w-full h-64 sm:h-72 lg:h-80 group">
                   <ImageWithFallback
                      src={availableCourses[selectedCourse].images ? availableCourses[selectedCourse].images[currentImageIndex] : availableCourses[selectedCourse].image}
                      alt={availableCourses[selectedCourse].name}
                    />
                    
                    {/* Image overlay gradient for text legibility if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden"></div>

                    {/* Navigation Arrows */}
                    {availableCourses[selectedCourse].images && availableCourses[selectedCourse].images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => (prev === 0 ? availableCourses[selectedCourse].images.length - 1 : prev - 1));
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/50 transition-all active:scale-95"
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => (prev + 1) % availableCourses[selectedCourse].images.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/50 transition-all active:scale-95"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Badges overlaid on image for Mobile (Space saving) */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end sm:hidden z-10">
                       <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-md shadow-lg border-0">
                          {availableCourses[selectedCourse].type}
                        </Badge>
                        <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-lg">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold">{availableCourses[selectedCourse].rating}</span>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                  
                  <DialogHeader className="p-0 space-y-2 text-left">
                    <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight">
                      {availableCourses[selectedCourse].name}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1 inline-block" />
                      {availableCourses[selectedCourse].location}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Thumbnails (Desktop Only) */}
                  {availableCourses[selectedCourse].images && availableCourses[selectedCourse].images.length > 1 && (
                    <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {availableCourses[selectedCourse].images.map((img: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                            currentImageIndex === idx 
                              ? 'border-primary ring-1 ring-primary/20 opacity-100' 
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <ImageWithFallback src={img} alt={`Golf course view ${idx + 1} in Bogotá`} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Highlights / Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                     <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 text-center">
                        <Trophy className="w-5 h-5 mx-auto text-primary mb-1" />
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Difficulty</div>
                        <div className="font-semibold text-sm truncate">{availableCourses[selectedCourse].difficulty}</div>
                     </div>
                     <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 text-center">
                        <MapPin className="w-5 h-5 mx-auto text-primary mb-1" />
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Holes</div>
                        <div className="font-semibold text-sm">{availableCourses[selectedCourse].holes}</div>
                     </div>
                     <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 text-center">
                        <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Par</div>
                        <div className="font-semibold text-sm">{availableCourses[selectedCourse].par}</div>
                     </div>
                     <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 text-center">
                        <Calendar className="w-5 h-5 mx-auto text-primary mb-1" />
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Est.</div>
                        <div className="font-semibold text-sm">{availableCourses[selectedCourse].established}</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Description */}
                     <div className="space-y-4">
                        <h3 className="text-lg font-bold text-foreground flex items-center">
                          About the Course
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                          {availableCourses[selectedCourse].detailedDescription}
                        </p>
                        
                        <div className="pt-2">
                           <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-primary">Key Features</h4>
                           <div className="flex flex-wrap gap-2">
                              {availableCourses[selectedCourse].features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="px-3 py-1 bg-background text-xs sm:text-sm">
                                  {feature}
                                </Badge>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Services & Highlights */}
                     <div className="space-y-6">
                        <div className="bg-accent/5 rounded-xl p-5 border border-accent/10">
                           <h4 className="font-semibold mb-4 text-accent-foreground flex items-center">
                             <Star className="w-4 h-4 mr-2" />
                             Course Highlights
                           </h4>
                           <ul className="space-y-3">
                              {availableCourses[selectedCourse].highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <ArrowRight className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                           </ul>
                        </div>
                        
                        <div>
                           <h4 className="font-semibold mb-3 text-foreground">Available Services</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {availableCourses[selectedCourse].services.map((service, idx) => (
                                <div key={idx} className="flex items-center text-sm text-muted-foreground">
                                  <div className="w-1.5 h-1.5 bg-primary/50 rounded-full mr-2"></div>
                                  {service}
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Action Bar */}
              <div className="p-4 bg-white border-t border-gray-100 sm:p-6 sm:bg-gray-50/50 z-20">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-1/2 border-primary/20 hover:bg-primary/5 hover:text-primary h-12 text-base"
                    onClick={() => handleWhatsAppClick(availableCourses[selectedCourse].name)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Ask a Question
                  </Button>
                  <Button 
                    className="w-full sm:w-1/2 bg-primary hover:bg-primary/90 h-12 text-base shadow-lg shadow-primary/20"
                    onClick={() => handleBookClick(availableCourses[selectedCourse])}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Book This Course
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}