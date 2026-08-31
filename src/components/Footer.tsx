"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import bgxLogo from "@/assets/optimized/bgx-logo.webp";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-2 bg-[#ffffff]">
                <img src={bgxLogo.src} alt="BGX Bogotá Golf Experience logo" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div>
                <h3 className="text-xl font-bold">BGX</h3>
                <p className="text-xs opacity-90">Bogotá Golf Experiences</p>
              </div>
            </div>
            <div className="space-y-3 mb-4 sm:mb-6">
              <p className="text-sm opacity-80 leading-relaxed">
                Premium golf experiences in Bogotá. Discover the altitude advantage, world-class courses, and unforgettable Colombian hospitality.
              </p>
              <div className="bg-accent/20 rounded-lg p-2.5 sm:p-3">
                <p className="text-xs opacity-90">
                  🏌️ 15% more distance at 2,640m altitude<br/>
                  ⭐ 20+ championship golf courses<br/>
                  🇨🇴 Professional bilingual caddies
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button size="sm" variant="outline" className="p-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300">
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Button size="sm" variant="outline" className="p-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Button size="sm" variant="outline" className="p-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300">
                <Youtube className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <Button size="sm" variant="outline" className="p-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300">
                <Twitter className="w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#home" className="hover:opacity-100 transition-opacity">Home</a></li>
              <li><a href="#courses" className="hover:opacity-100 transition-opacity">Golf Courses</a></li>
              <li><a href="#plans" className="hover:opacity-100 transition-opacity">Golf Plans</a></li>
              <li><a href="#experiences" className="hover:opacity-100 transition-opacity">Experiences</a></li>
              <li><a href="#contact" className="hover:opacity-100 transition-opacity">Contact</a></li>
              <li><Link href="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">FAQ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Weekend Golf Packages</li>
              <li>Golf Week Experiences</li>
              <li>Corporate Golf Retreats</li>
              <li>Professional Caddy Service</li>
              <li>Culinary & Nightlife Tours</li>
              <li>Luxury Accommodation</li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm opacity-80 mb-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                <a href="https://wa.me/573176392251" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +57 317 639 2251
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <a href="mailto:info@bogotagolfexperience.com" className="hover:text-white transition-colors">
                  info@bogotagolfexperience.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm opacity-80">
            <p>&copy; 2026 BGX Bogotá Golf Experiences. All rights reserved. Built by Armonia Automation.</p>
          </div>
          <div className="flex space-x-6 text-sm opacity-80">
            <Link href="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:opacity-100 transition-opacity">Cookie Policy</Link>
            <a href="/admin/login" className="hover:opacity-100 transition-opacity font-semibold">Admin Access</a>
          </div>
        </div>
      </div>
    </footer>
  );
}