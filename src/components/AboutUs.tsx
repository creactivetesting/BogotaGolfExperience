"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { motion } from "motion/react";
import { Users, Target } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logo1 from "figma:asset/0c00a655dc008985a36a785dd535c0f729f89686.png";
import logo2 from "figma:asset/8993c183a7e3f6198bef6f72ef7cfb680ffbfc46.png";
import logo3 from "figma:asset/360e0324fd5702ad1294b3b1aab722e2841b73a3.png";
import logo4 from "figma:asset/fb451fb6edc5d2c331171af0eaef9e8f93175858.png";
import foundersImg from "figma:asset/d213ccc327dd94ae93ab97bbd27b8a6263629ccf.png";

export function AboutUs() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-background">
        {/* Hero / Mission Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block bg-accent/10 rounded-full px-4 py-2 mb-6">
                  <span className="text-accent-foreground font-semibold uppercase tracking-wider text-sm">Our Story</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                  Private Golf in Bogotá, <span className="text-accent">Curated</span> for International Travelers
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We are driven by a shared passion: to show the world that Bogotá is not just a city, but a premier golf experience.
                </p>
              </motion.div>
            </div>

            {/* Founders Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                   <ImageWithFallback 
                    src={foundersImg} 
                    alt="Founders of BGX" 
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                     <p className="font-semibold text-lg">Alejandro Bernal & Felipe González</p>
                     <p className="text-white/80 text-sm">Founders, Bogotá Golf Experiences</p>
                   </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl -z-10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold mb-4">Meet the Visionaries</h2>
                
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-accent/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Alejandro Bernal</h3>
                        <p className="text-muted-foreground mb-2 italic">Expert in Emotional Marketing & Golfer (20+ years)</p>
                        <p className="text-muted-foreground text-sm">
                          (Shown in black shirt, black cap). With two decades on the fairways, Alejandro understands that golf is more than a game—it's an emotional journey. His expertise shapes every BGX experience to resonate deeply with our guests.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-accent/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <Target className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Felipe González</h3>
                        <p className="text-muted-foreground mb-2 italic">Creative Advertiser & Tech Expert (Golfer 3+ years)</p>
                        <p className="text-muted-foreground text-sm">
                          (Shown in black shirt, white cap). Bringing a fresh perspective and technological innovation, Felipe ensures seamless, modern experiences. His creative vision drives the digital excellence of BGX.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                     <p className="text-muted-foreground italic">
                       "Our shared passion for golf, the camaraderie it fosters, and our commitment to exceptional service led us to create this platform. We are dedicated to positioning Bogotá as one of the world's best cities for golf."
                     </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Partners / Logos Section */}
            <div className="bg-primary rounded-3xl p-12 shadow-xl border border-white/10">
               <div className="text-center mb-10">
                 <h2 className="text-3xl font-bold text-white mb-2">Our Partners & Backers</h2>
                 <p className="text-white/70">Making the dream of BGX a reality</p>
               </div>
               
               <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                  <ImageWithFallback src={logo1} alt="BGX partner logo" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />
                  <ImageWithFallback src={logo2} alt="BGX partner logo" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />
                  <ImageWithFallback src={logo3} alt="BGX partner logo" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />
                  <ImageWithFallback src={logo4} alt="BGX partner logo" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />
               </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}