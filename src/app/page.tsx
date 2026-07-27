import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "BGX Bogotá Golf Experience | Premium Golf Packages at 2,640m Altitude",
  description: "Experience championship golf at 2,640m altitude in Bogotá. Exclusive access, private luxury transport, and bilingual golf concierge.",
  openGraph: {
    title: "BGX Bogotá Golf Experience | Premium Golf Packages at 2,640m Altitude",
    description: "Experience championship golf at 2,640m altitude in Bogotá. Exclusive access, private luxury transport, and bilingual golf concierge.",
    url: "https://www.bogotagolfexperience.com",
    siteName: "Bogotá Golf Experience",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BGX Bogotá Golf Experience | Premium Golf Packages at 2,640m Altitude",
    description: "Experience championship golf at 2,640m altitude in Bogotá. Exclusive access, private luxury transport, and bilingual golf concierge.",
  },
};

export default function Home() {
  return <HomeClient />;
}
