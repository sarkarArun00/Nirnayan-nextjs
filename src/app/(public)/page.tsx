
import Blog from "@/components/home/Blog";
import BookWith from "@/components/home/BookWith";
import Care from "@/components/home/Care";
import Checkups from "@/components/home/Checkups";
import Faq from "@/components/home/Faq";
import HeroSection from "@/components/home/HeroSection";
import LifestylePackages from "@/components/home/LifestylePackages";
import Organs from "@/components/home/Organs";
import OurLocation from "@/components/home/OurLocation";
import PopularPackage from "@/components/home/PopularPackage";
import PopularTest from "@/components/home/PopularTest";
import Testimonial from "@/components/home/Testimonial";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularTest />
      <BookWith />
      <PopularPackage />
      <Checkups />
      <LifestylePackages />
      <Care />
      <Organs />
      <Blog />
      <Testimonial />
      <OurLocation />
      <Faq />
      
    </>
  );
}