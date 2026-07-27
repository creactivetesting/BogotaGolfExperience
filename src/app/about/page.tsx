import type { Metadata } from "next";
import { AboutUs as AboutUsComponent } from "@/components/AboutUs";

export const metadata: Metadata = {
  title: "About Bogotá Golf Experience | Your Premium Golf Concierge",
  description: "BGX is your specialized golf concierge in Bogotá, Colombia, organizing luxury golf trips at high altitude.",
  openGraph: {
    title: "About Bogotá Golf Experience | Your Premium Golf Concierge",
    description: "BGX is your specialized golf concierge in Bogotá, Colombia, organizing luxury golf trips at high altitude.",
    url: "https://www.bogotagolfexperience.com/about",
    siteName: "Bogotá Golf Experience",
    type: "website",
    locale: "en_US",
  },
};

export default function AboutPage() {
  return <AboutUsComponent />;
}
