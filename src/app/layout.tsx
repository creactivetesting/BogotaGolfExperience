import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import JSONLD from "@/components/JSONLD";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bogotagolfexperience.com"),
  title: "Private Golf Experiences in Bogotá | BGX",
  description: "Experience premium, all-inclusive golf tours in Bogotá with professional bilingual caddies and luxury amenities.",
  keywords: ["golf bogota", "golf colombia", "golf vacation bogota", "bogota golf experience", "golf tour colombia"],
  authors: [{ name: "BGX" }],
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JSONLD />
      </head>
      <body className="antialiased">
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
