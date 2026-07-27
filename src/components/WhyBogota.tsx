import { motion } from 'motion/react';
import { Mountain, DollarSign, Globe, Utensils, Users, Trophy, MapPin, Plane, Clock, Sun } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import golfBallOrbit from '@/assets/optimized/bogota-golf-altitude-ball.webp';

const features = [
  {
    icon: Mountain,
    title: "Altitude Advantage",
    description: "Play at 2,640m and experience 15% more distance on every shot",
    metric: "+15% Distance",
    color: "from-[#2d5a2d] to-[#4a6741]"
  },
  {
    icon: DollarSign,
    title: "Unbeatable Value",
    description: "Premium luxury at 50% less than US and European destinations",
    metric: "50% Savings",
    color: "from-[#d4af37] to-[#f4d03f]"
  },
  {
    icon: Users,
    title: "Bilingual Caddies",
    description: "Professional, English-speaking caddies with deep course knowledge",
    metric: "100% Bilingual",
    color: "from-[#7ba05b] to-[#5a7a3d]"
  },
  {
    icon: Utensils,
    title: "Culinary Capital",
    description: "World-class dining scene with Michelin-level gastronomy",
    metric: "5★ Dining",
    color: "from-[#8b4513] to-[#a0522d]"
  },
  {
    icon: Trophy,
    title: "22+ Golf Courses",
    description: "Championship, resort, and scenic courses for all skill levels",
    metric: "22+ Courses",
    color: "from-[#d4af37] to-[#b8941f]"
  },
  {
    icon: Globe,
    title: "Perfect Weather",
    description: "Year-round spring climate with 14-18°C temperatures daily",
    metric: "365 Days",
    color: "from-[#4a6741] to-[#2d5a2d]"
  },
  {
    icon: Plane,
    title: "Easy Access",
    description: "Direct flights from major US, European, and Asian hubs",
    metric: "Direct Flights",
    color: "from-[#6b5438] to-[#8b4513]"
  },
  {
    icon: Clock,
    title: "No Jet Lag",
    description: "Same or similar time zones to US East Coast and Central",
    metric: "EST/CST",
    color: "from-[#3a3a3a] to-[#1a2e1a]"
  }
];

export function WhyBogota() {
  return (
    <section className="py-16 sm:py-24 bg-white golf-ball-texture relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block bg-primary/10 rounded-full px-4 py-2 mb-4">
            <span className="text-primary uppercase tracking-wider">The Bogotá Difference</span>
          </div>
          <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] uppercase mb-4 font-bold tracking-tight">
            Why Bogotá for Golf?
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Discover what makes Bogotá the ultimate destination for international golf tourism. 
            A unique combination of natural advantages, world-class service, and unbeatable value.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-primary/10 hover:border-accent/30 hover:shadow-md transition-all duration-300 h-full">
                {/* Icon - Elegant Minimalist Style */}
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>

                {/* Metric Badge */}
                <div className="inline-block bg-accent/5 rounded-md px-3 py-1 mb-3 border border-accent/20">
                  <span className="text-accent text-xs uppercase tracking-wide">{feature.metric}</span>
                </div>

                <h3 className="mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big Statement Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 golf-texture opacity-50"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 sm:p-12 items-center">
            <div>
              <h3 className="text-white mb-4">
                The Only Golf Destination with the Altitude Advantage
              </h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                At 2,640 meters above sea level, Bogotá offers a unique physics advantage that no other major golf destination can match. 
                Your drives naturally travel 15% further in our thin mountain air, transforming your game without changing your swing.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className="text-accent font-bold text-2xl">2,640m</div>
                  <div className="text-white/80 text-sm">Altitude</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className="text-accent font-bold text-2xl">15%+</div>
                  <div className="text-white/80 text-sm">More Distance</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <div className="text-accent font-bold text-2xl">22+</div>
                  <div className="text-white/80 text-sm">Courses</div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-accent mb-4 mx-auto" />
                    <div className="text-white font-bold text-xl">Bogotá, Colombia</div>
                    <div className="text-white/80 text-sm">South America's Golf Capital</div>
                  </div>
                </div>
                {/* Orbiting Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* Orbiting Golf Ball */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      {/* Subtle Glow Effect */}
                      <div className="absolute -inset-1 rounded-full bg-white/40 blur-md opacity-60"></div>
                      
                      {/* Golf Ball Image */}
                      <ImageWithFallback 
                        src={golfBallOrbit} 
                        alt="Golf ball in flight above Bogotá showing the altitude advantage for longer shots" 
                        className="w-full h-full object-contain drop-shadow-lg relative z-10 hover:scale-110 hover:rotate-12 transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}