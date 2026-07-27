"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Calendar, Phone } from "lucide-react";

export function BookingForm() {
  const whatsappNumber = "573176392251";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20BGX,%20I'm%20interested%20in%20booking%20a%20golf%20experience`;

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 golf-ball-texture relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-[36px] sm:text-[42px] md:text-[52px] lg:text-[68px] xl:text-[82px] mb-4 font-bold tracking-tight uppercase">
            Ready to Experience Bogotá Golf?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Speak directly with our golf specialists to create your perfect Colombian golf experience. 
            We are available on WhatsApp to answer all your questions instantly.
          </p>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
              onClick={() => window.open(whatsappUrl, '_blank')}
            >
              <Phone className="w-6 h-6" />
              <span className="text-lg">Chat on WhatsApp</span>
            </Button>
          </div>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm border-primary/10">
          <CardContent className="p-8 sm:p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Prefer to Call?</h3>
            <p className="text-muted-foreground mb-6">
              You can also reach us directly at our phone number regarding any inquiries about packages, 
              customization, or group bookings.
            </p>
            <Button 
              size="lg" 
              variant="outline"
              className="text-xl font-bold px-8 py-6 h-auto border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300"
              onClick={() => window.location.href = `tel:+${whatsappNumber}`}
            >
              <Phone className="w-6 h-6 mr-3" />
              Call Us Now
            </Button>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3 text-primary">
                  <span className="text-xl">✓</span>
                </div>
                <span>Instant Response</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3 text-primary">
                  <span className="text-xl">✓</span>
                </div>
                <span>Personalized Service</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3 text-primary">
                  <span className="text-xl">✓</span>
                </div>
                <span>No Forms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
