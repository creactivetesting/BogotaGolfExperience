import type { Metadata } from "next";
import { CoursesPage as CoursesPageComponent } from "@/components/CoursesPage";

export const metadata: Metadata = {
  title: "Championship Golf Courses in Bogotá | 22+ Courses at Altitude",
  description: "Discover 22+ championship golf courses near Bogotá at 2,640m altitude with private access and premium services.",
  openGraph: {
    title: "Championship Golf Courses in Bogotá | 22+ Courses at Altitude",
    description: "Discover 22+ championship golf courses near Bogotá at 2,640m altitude with private access and premium services.",
    url: "https://www.bogotagolfexperience.com/courses",
    siteName: "Bogotá Golf Experience",
    type: "website",
    locale: "en_US",
  },
};

export default function CoursesPage() {
  return <CoursesPageComponent />;
}
